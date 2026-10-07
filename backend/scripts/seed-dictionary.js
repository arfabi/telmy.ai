import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initFirebase } from '../src/config/firebase.js';
import { normalizeFieldKey } from '../src/services/dictionaryService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seed() {
  console.log('🌱 Starting Dictionary Seed to Firestore...');
  const { db, isFirebaseConnected } = initFirebase();

  if (!isFirebaseConnected || !db) {
    console.error('❌ Cannot seed: Firebase is not connected.');
    console.error('Please ensure serviceAccountKey.json is placed in /backend directory or GOOGLE_APPLICATION_CREDENTIALS is set.');
    process.exit(1);
  }

  const mockPath = path.resolve(__dirname, '../../extension/mock/apostille-ahu.json');
  if (!fs.existsSync(mockPath)) {
    console.error('❌ Mock file not found at:', mockPath);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
  const fields = data.fields || [];
  console.log(`📦 Loaded ${fields.length} fields from ${data.target_form || 'mock file'}`);

  const batch = db.batch();
  let count = 0;

  const domain = data.domain_pattern || data.domain || 'apostille.ahu.go.id';

  for (const field of fields) {
    const fieldId = field.id || field.field_id || 'field_' + count;
    const labelOriginal = field.label_original || field.translations?.id?.label || fieldId;
    const fieldKey = normalizeFieldKey(domain, fieldId, labelOriginal);
    const docRef = db.collection('entries').doc(fieldKey);

    batch.set(docRef, {
      fieldKey,
      fieldId: fieldId,
      domain: domain,
      section: field.section || '',
      originalLabel: labelOriginal,
      patterns: field.patterns || [],
      inputType: field.input_type || 'text',
      mask: field.mask || null,
      maxLength: field.max_length || null,
      officialDocUrl: field.official_source || null,
      verified: true,
      source: field.source === 'ai' ? 'ai' : 'verified',
      verifiedAt: new Date().toISOString(),
      translations: field.translations || {}
    }, { merge: true });

    count++;
  }

  await batch.commit();
  console.log(`✅ Successfully seeded ${count} verified dictionary fields to Firestore!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
