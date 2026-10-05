// GMT — Gemini API Client
// Handles: multimodal requests (text + screenshot), structured output parsing

const GEMINI_MODEL = 'gemini-3.8-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const SYSTEM_PROMPT = `You are GMT (Guide Me To), an intelligent browser co-pilot.
Your job is to guide users step-by-step through tasks on websites.
You are a GUIDE, not an executor. You tell users what to click/fill — you do NOT do it for them.

RULES:
1. Analyze the screenshot and DOM to find the exact elements
2. Provide clear, friendly step-by-step instructions
3. Detect user language from their command (Bahasa Indonesia or English) and respond in the same language
4. Each step must include: a CSS selector, what to do, and a short voice instruction
5. If navigation is needed, provide the exact URL
6. Be specific and encouraging

OUTPUT FORMAT (strict JSON):
{
  "language": "id" or "en",
  "navigate_to": "https://..." or null,
  "greeting": "short friendly acknowledgment of the command",
  "steps": [
    {
      "id": 1,
      "selector": "CSS selector string or null",
      "action": "click" | "fill" | "navigate" | "scroll" | "wait",
      "label": "short step label (max 40 chars)",
      "instruction": "detailed instruction text",
      "voice": "what GMT should say aloud for this step",
      "hint": "optional extra context or tip"
    }
  ]
}`;

export async function callGemini({ command, language, currentUrl, screenshot, domSummary }) {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('Gemini API key not set. Please configure it in GMT settings.');

  const parts = [
    {
      text: `Current URL: ${currentUrl}\n\nUser command: "${command}"\n\nDOM Summary:\n${domSummary}`
    }
  ];

  // Add screenshot if available
  if (screenshot) {
    parts.push({
      inline_data: {
        mime_type: 'image/jpeg',
        data: screenshot
      }
    });
    parts.push({ text: 'The image above shows the current state of the browser page.' });
  }

  const requestBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: [
      {
        role: 'user',
        parts: parts
      }
    ],
    generationConfig: {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json'
    }
  };

  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error('Empty response from Gemini');

  try {
    return JSON.parse(rawText);
  } catch {
    // Try to extract JSON from text
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('Could not parse Gemini response as JSON');
  }
}

async function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.local.get('gmt_gemini_key', (result) => {
      resolve(result.gmt_gemini_key || null);
    });
  });
}
