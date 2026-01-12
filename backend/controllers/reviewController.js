const { reviewCodeWithAI } = require('../services/llmService');
const Review = require('../models/Review');
const dbConnect = require('../config/db'); // ✅ ADD THIS

const ALLOWED_LANGUAGES = [
  'javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'go', 'rust',
  'typescript', 'kotlin', 'dart', 'swift', 'php', 'ruby', 'sql'
];

/* ================= METRICS ================= */

function calculateMetrics(code, detectedLanguage = 'javascript') {
  const lines = code.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim() !== '');
  const linesOfCode = nonEmptyLines.length;

  const complexityScore = calculateCyclomaticComplexity(code, detectedLanguage);
  const cognitiveComplexity = calculateCognitiveComplexity(code, detectedLanguage);
  const issuesFound = detectIssues(code, detectedLanguage, linesOfCode);
  const qualityRating = calculateQualityRating(
    linesOfCode, complexityScore, cognitiveComplexity, issuesFound
  );
  const maintainabilityIndex = calculateMaintainability(
    linesOfCode, complexityScore, issuesFound
  );

  return {
    linesOfCode,
    complexityScore,
    cognitiveComplexity,
    qualityRating,
    issuesFound,
    maintainabilityIndex
  };
}

function calculateCyclomaticComplexity(code) {
  let complexity = 1;
  const patterns = [
    /\bif\b/g, /\belse if\b/g, /\bfor\b/g, /\bwhile\b/g,
    /\bswitch\b/g, /\bcase\b/g, /\bcatch\b/g,
    /\&\&/g, /\|\|/g, /\?/g
  ];
  patterns.forEach(p => {
    const m = code.match(p);
    if (m) complexity += m.length;
  });
  return Math.min(complexity, 50);
}

function calculateCognitiveComplexity(code) {
  let cognitive = 0;
  let nesting = 0;
  code.split('\n').forEach(line => {
    if (/{|\(|\[/.test(line)) nesting++;
    if (/}|\)|\]/.test(line)) nesting = Math.max(0, nesting - 1);
    if (/\bif\b|\bfor\b|\bwhile\b/.test(line)) cognitive += 1 + nesting;
  });
  return Math.min(cognitive, 50);
}

function detectIssues(code, language, linesOfCode) {
  let issues = 0;
  if (code.split('\n').some(l => l.length > 120)) issues++;
  if (linesOfCode > 300) issues++;
  if (language === 'javascript' && code.includes('var ')) issues++;
  if (language === 'java' && !code.includes('class')) issues++;
  return issues;
}

function calculateQualityRating(lines, complexity, cognitive, issues) {
  let score = 100;
  score -= complexity * 2;
  score -= cognitive;
  score -= issues * 5;
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

function calculateMaintainability(lines, complexity, issues) {
  let index = 100 - complexity * 2 - issues * 5 - Math.log2(lines + 1) * 5;
  return Math.max(0, Math.min(100, Math.round(index)));
}

/* ================= REVIEW API ================= */

exports.reviewCode = async (req, res, next) => {
  try {
    await dbConnect(); // ✅ CONNECT DB INSIDE REQUEST

    const { code, language } = req.body;
    const userId = req.user?.githubId;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, error: 'Code is required' });
    }

    let languageToPass;
    if (language && language !== 'auto' && ALLOWED_LANGUAGES.includes(language)) {
      languageToPass = language;
    }

    let reviewResult;
    try {
      reviewResult = await reviewCodeWithAI(code, languageToPass);
    } catch {
      reviewResult = {
        improvedCode: code,
        explanation: 'Code contains syntax or structural errors.',
        category: 'Bug Fix',
        detectedLanguage: language || 'unknown',
        framework: null
      };
    }

    const metrics = calculateMetrics(code);

    let savedReview = null;
    if (userId) {
      savedReview = await new Review({
        userId: String(userId),
        originalCode: code,
        improvedCode: reviewResult.improvedCode,
        explanation: reviewResult.explanation,
        category: reviewResult.category,
        language: reviewResult.detectedLanguage || 'unknown',
        metrics,
        createdAt: new Date()
      }).save();
    }

    res.json({
      success: true,
      data: {
        ...reviewResult,
        metrics,
        originalCode: code,
        _id: savedReview?._id || null
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ================= HISTORY ================= */

exports.getReviewHistory = async (req, res) => {
  await dbConnect(); // ✅ ADD

  const userId = req.user?.githubId;
  if (!userId) return res.json({ success: true, data: [] });

  const reviews = await Review.find({ userId: String(userId) })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, data: reviews });
};

exports.getReviewById = async (req, res) => {
  await dbConnect(); // ✅ ADD

  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false });
  res.json({ success: true, data: review });
};

exports.deleteReview = async (req, res) => {
  await dbConnect(); // ✅ ADD

  const { id } = req.params;
  const userId = req.user?.githubId;
  if (!userId) return res.status(401).json({ success: false });

  const review = await Review.findById(id);
  if (!review) return res.status(404).json({ success: false });

  if (String(review.userId) !== String(userId)) {
    return res.status(403).json({ success: false });
  }

  await Review.findByIdAndDelete(id);
  res.json({ success: true });
};
