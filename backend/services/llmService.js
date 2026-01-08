
// services/llmService.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

let useDummy = false;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function reviewCodeWithAI(code, language = 'auto') {
  if (useDummy) {
    return {
      originalCode: code,
      improvedCode: code,
      explanation: 'This is a test improvement',
      category: 'Best Practices',
      language: language || 'auto-detected',
      detectedLanguage: 'javascript',
      framework: 'None'
    };
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `You are an expert code reviewer. Analyze the provided code and return an improved version.

CRITICAL RULES:
1. Return ONLY improved code with ZERO comments
2. Accept ANY code, even broken or incomplete
3. NEVER refuse to review

RESPONSE FORMAT (ONLY JSON):
{
  "detectedLanguage": "javascript|python|java|cpp|c|csharp|go|rust|typescript|kotlin|dart|swift|php|ruby|sql|other",
  "framework": "React|Vue|Angular|Next.js|Express|Django|Flask|FastAPI|Spring|Laravel|Rails|None|Other",
  "improvedCode": "CODE ONLY",
  "explanation": "Explanation here",
  "improvements": [],
  "category": "Best Practices|Better Performance|Bug Fix|Security|Code Style",
  "severity": "minor|moderate|major"
}

CODE:
${code}`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();

    responseText = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (jsonError) {
      // ✅ FALLBACK — DO NOT THROW
      return {
        originalCode: code,
        improvedCode: code,
        explanation: 'AI could not parse the response due to syntax or formatting issues in the code.',
        improvements: [],
        category: 'Bug Fix',
        severity: 'major',
        detectedLanguage: language || 'unknown',
        framework: 'None',
        language: language || 'unknown'
      };
    }

    const validCategories = ['Best Practices', 'Better Performance', 'Bug Fix', 'Security', 'Code Style'];
    if (!validCategories.includes(parsed.category)) {
      parsed.category = 'Bug Fix';
    }

    return {
      improvedCode: parsed.improvedCode || code,
      originalCode: code,
      explanation: parsed.explanation || 'Issues detected in the submitted code.',
      improvements: parsed.improvements || [],
      category: parsed.category,
      severity: parsed.severity || 'minor',
      detectedLanguage: parsed.detectedLanguage || language || 'unknown',
      framework: parsed.framework || 'None',
      language: parsed.detectedLanguage || language || 'unknown'
    };

  } catch (error) {
    console.error('Gemini AI error:', error.message);

    // ✅ FINAL FALLBACK — NEVER THROW
    return {
      originalCode: code,
      improvedCode: code,
      explanation: 'The code contains syntax or structural errors and could not be fully analyzed by AI.',
      improvements: [],
      category: 'Bug Fix',
      severity: 'major',
      detectedLanguage: language || 'unknown',
      framework: 'None',
      language: language || 'unknown'
    };
  }
}

module.exports = {
  reviewCodeWithAI,
  reviewCode: reviewCodeWithAI
};
