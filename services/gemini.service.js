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

  let response;
  try {
    response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: prompt,
    });
  } catch (err) {
    const error = new Error(`Gemini API request failed: ${err.message}`);
    error.statusCode = 502;
    throw error;
  }

  return response.text;
};

module.exports = { getGeminiResponse };