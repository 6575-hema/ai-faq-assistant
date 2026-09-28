const { GoogleGenAI } = require('@google/genai');

const getGeminiResponse = async (userQuestion, faqs) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || /^your_/i.test(apiKey)) {
    const error = new Error('GEMINI_API_KEY is not configured. Set a valid key in .env.');
    error.statusCode = 503;
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey });

  const context = faqs
    .map((faq, index) => `${index + 1}. Q: ${faq.question}\n   A: ${faq.answer}`)
    .join('\n\n');

  const prompt = `
You are an HR AI Assistant for our company. 
Below is the official HR FAQ knowledge base:

${context}

Employee Question: "${userQuestion}"

Instructions:
1. Match the employee's query against the company FAQs.
2. If the query matches one of the FAQs, provide a clear, professional answer strictly based on the FAQ context.
3. If the query is unrelated to company HR policies or missing from the list, politely inform the employee to contact HR directly.
`;

  // If the main model is busy or unavailable, fall back to the next one.
  // Busy models (503/429) get one retry after a short pause.
  const models = [process.env.GEMINI_MODEL || 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest'];

  let lastError;
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text;
      } catch (err) {
        lastError = err;
        if (!isBusyError(err)) break;
        if (attempt === 0) await sleep(1500);
      }
    }
  }

  // Gemini is unavailable: answer directly from the FAQ database instead of failing.
  console.error(`Gemini API request failed, using FAQ fallback: ${lastError.message}`);
  return answerFromFaqs(userQuestion, faqs);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isBusyError = (err) => /\b(503|429)\b|UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded|high demand/i.test(err.message || '');

const STOP_WORDS = new Set(['a', 'an', 'the', 'is', 'are', 'do', 'does', 'i', 'we', 'you', 'what', 'when', 'how', 'can', 'my', 'our', 'to', 'of', 'for', 'in', 'on', 'any', 'there', 'get', 'will', 'us', 'me']);

const tokenize = (text) =>
  (String(text).toLowerCase().match(/[a-z0-9]+/g) || [])
    .map((word) => word.replace(/s$/, ''))
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));

// Pick the FAQ whose question shares the most keywords with the user's question.
const answerFromFaqs = (userQuestion, faqs) => {
  const queryWords = tokenize(userQuestion);
  let best = null;
  let bestScore = 0;
  for (const faq of faqs) {
    const faqWords = new Set(tokenize(faq.question));
    const score = queryWords.filter((word) => faqWords.has(word)).length;
    if (score > bestScore) {
      best = faq;
      bestScore = score;
    }
  }

  if (!best) {
    return "I couldn't find an answer to that in our HR FAQs. Please contact HR directly for help.";
  }
  return best.answer;
};

module.exports = { getGeminiResponse };