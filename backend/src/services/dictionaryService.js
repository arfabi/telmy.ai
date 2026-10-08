import { getFirestore } from '../config/firebase.js';
import { generateFieldExplanation } from './aiService.js';
import { getEmbedding, cosineSimilarity } from './geminiService.js';

// In-memory cache for speed and offline fallback
const memoryCache = new Map();

/**
 * Priority 4.2: Semantic Vector Match across verified Firestore entries
 * @param {string} queryText - Label or field name
 * @param {string} targetLanguage - Target language
 * @param {number} threshold - Cosine similarity threshold (default >= 0.90)
 */
export async function findSemanticFieldMatch(queryText, targetLanguage = 'en', threshold = 0.90) {
  const { db, isFirebaseConnected } = getFirestore();
  if (!isFirebaseConnected || !db || !queryText) return null;

  try {
    const queryVec = await getEmbedding(queryText);
    if (!queryVec) return null;

    const snapshot = await db.collection('entries')
      .where('verified', '==', true)
      .limit(60)
      .get();

    if (snapshot.empty) return null;

    let bestMatch = null;
    let highestSim = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.embedding && Array.isArray(data.embedding)) {
        const sim = cosineSimilarity(queryVec, data.embedding);
        if (sim > highestSim && sim >= threshold) {
          highestSim = sim;
          bestMatch = { data, similarity: sim };
        }
      }
    });

    if (bestMatch && bestMatch.data) {
      const trans = bestMatch.data.translations?.[targetLanguage];
      if (trans) {
        console.log(`[Vector Search Cache Hit] "${queryText}" matched "${bestMatch.data.originalLabel}" (Cosine Sim: ${bestMatch.similarity.toFixed(3)})`);
        return {
          ...trans,
          fieldKey: bestMatch.data.fieldKey,
          verified: true,
          source: 'vector_semantic_cache',
          semanticSimilarity: bestMatch.similarity
        };
      }
    }
  } catch (err) {
    console.warn('[Vector Search] Notice:', err.message);
  }

  return null;
}

/**
 * Normalize field key for database lookup
 */
export function normalizeFieldKey(domain = '', fieldName = '', label = '') {
  const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].toLowerCase().trim();
  const cleanField = (label || fieldName || '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  return `${cleanDomain}:${cleanField || 'unknown'}`;
}

/**
 * Get field explanation by checking Firestore first, then Gemini AI
 */
export async function explainField({ metadata, language = 'en', pageContext = '' }) {
  const { db, isFirebaseConnected } = getFirestore();
  const fieldKey = normalizeFieldKey(metadata.domain, metadata.name, metadata.label);
  const cacheKey = `${fieldKey}:${language}`;
  const strategy = (process.env.EXPLAIN_STRATEGY || 'AI_FIRST').toUpperCase();

  // 1. Priority 4.2: Check Semantic Vector Cache First (Cross-Domain, Zero-Token)
  const semanticMatch = await findSemanticFieldMatch(metadata.label || metadata.name, language, 0.90);
  if (semanticMatch) {
    memoryCache.set(cacheKey, semanticMatch);
    return semanticMatch;
  }

  // 2. AI_FIRST Strategy: 100% Pure AI from GLM / Gemini
  if (strategy === 'AI_FIRST') {
    try {
      console.log(`[Strategy: AI_FIRST] Requesting fresh AI explanation for "${metadata.label || metadata.name}" (${language})...`);
      const aiExplanation = await generateFieldExplanation(metadata, language, pageContext);
      if (aiExplanation && (aiExplanation.meaning || aiExplanation.howToFill)) {
        const result = {
          ...aiExplanation,
          fieldKey,
          verified: false,
          source: 'ai_draft'
        };

        // Optionally record into Firestore with embedding in background
        if (isFirebaseConnected && db) {
          (async () => {
            try {
              const emb = await getEmbedding(metadata.label || metadata.name || '');
              await db.collection('entries').doc(fieldKey).set({
                fieldKey,
                domain: metadata.domain || 'unknown',
                originalLabel: metadata.label || metadata.name || '',
                inputType: metadata.type || 'text',
                section: metadata.section || '',
                verified: false,
                source: 'ai_draft',
                embedding: emb || null,
                updatedAt: new Date().toISOString(),
                translations: {
                  [language]: aiExplanation
                }
              }, { merge: true });
            } catch (e) {}
          })();
        }

        return result;
      }
    } catch (aiErr) {
      console.warn(`[AI_FIRST] AI call error:`, aiErr.message);
    }
  }

  // 2. Check in-memory cache for DB_FIRST
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  // 3. DB_FIRST Strategy: Check Firestore verified dictionary first
  if (isFirebaseConnected && db) {
    try {
      const entryRef = db.collection('entries').doc(fieldKey);
      const doc = await entryRef.get();

      if (doc.exists) {
        const data = doc.data();
        const existingTrans = data.translations && data.translations[language];
        const isReliable = data.verified === true || (existingTrans && (existingTrans.confidence ?? 0) >= 0.9);

        if (existingTrans && isReliable) {
          const result = {
            ...existingTrans,
            fieldKey,
            verified: data.verified ?? true,
            source: data.source || 'verified',
            verifiedAt: data.verifiedAt || null,
            officialDocUrl: data.officialDocUrl || null
          };
          memoryCache.set(cacheKey, result);
          return result;
        }

        // Generate translation via AI and update Firestore
        const aiExplanation = await generateFieldExplanation(metadata, language, pageContext);
        const updatedTranslations = {
          ...(data.translations || {}),
          [language]: aiExplanation
        };

        await entryRef.update({
          translations: updatedTranslations,
          updatedAt: new Date().toISOString()
        });

        const result = {
          ...aiExplanation,
          fieldKey,
          verified: false,
          source: 'ai_draft'
        };
        memoryCache.set(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn(`[Firestore] Error querying entry for ${fieldKey}:`, err.message);
    }
  }

  // 4. Fallback generation if DB not available or entry not found
  const explanation = await generateFieldExplanation(metadata, language, pageContext);

  const result = {
    ...explanation,
    fieldKey,
    verified: false,
    source: 'ai_draft',
    generatedAt: new Date().toISOString()
  };

  // 4. Save newly discovered field as draft in Firestore for human reviewer
  if (isFirebaseConnected && db) {
    try {
      await db.collection('entries').doc(fieldKey).set({
        fieldKey,
        domain: metadata.domain || 'unknown',
        originalLabel: metadata.label || metadata.name || '',
        inputType: metadata.type || 'text',
        section: metadata.section || '',
        verified: false,
        source: 'ai_draft',
        createdAt: new Date().toISOString(),
        translations: {
          [language]: explanation
        }
      }, { merge: true });

      // Log to unmatched collection for metrics
      await db.collection('unmatched').doc(fieldKey).set({
        fieldKey,
        domain: metadata.domain || '',
        label: metadata.label || '',
        lastSeen: new Date().toISOString(),
        count: db.constructor.FieldValue ? db.constructor.FieldValue.increment(1) : 1
      }, { merge: true }).catch(() => {});
    } catch (err) {
      console.warn(`[Firestore] Failed saving draft for ${fieldKey}:`, err.message);
    }
  }

  memoryCache.set(cacheKey, result);
  return result;
}

/**
 * Save user suggestion or correction
 */
export async function saveSuggestion(payload) {
  const { db, isFirebaseConnected } = getFirestore();
  const suggestionData = {
    fieldKey: payload.fieldKey || normalizeFieldKey(payload.domain, payload.fieldId, payload.fieldLabel),
    fieldLabel: payload.fieldLabel || '',
    type: payload.type || 'suggestion', // 'suggestion' | 'correction'
    text: payload.text || '',
    language: payload.language || 'id',
    status: 'pending', // 'pending' | 'reviewed' | 'approved' | 'rejected'
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConnected && db) {
    const docRef = await db.collection('suggestions').add(suggestionData);
    return { id: docRef.id, ...suggestionData };
  }

  return { id: 'local_' + Date.now(), ...suggestionData, localOnly: true };
}

/**
 * Save rating (helpful / unhelpful)
 */
export async function saveRating(payload) {
  const { db, isFirebaseConnected } = getFirestore();
  const ratingData = {
    fieldKey: payload.fieldKey || '',
    isHelpful: !!payload.isHelpful,
    language: payload.language || 'id',
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConnected && db) {
    await db.collection('ratings').add(ratingData);
    return { success: true };
  }

  return { success: true, localOnly: true };
}
