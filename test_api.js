// Uses native fetch (Node 18+)

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting API Verification ---');

  try {
    // 1. Ask Chatbot
    const chatRes = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'Can I work from home on weekends?' })
    });
    const chatData = await chatRes.json();
    console.log('\n[TEST 1] Chat Endpoint Output:');
    console.log(JSON.stringify(chatData, null, 2));

    // 2. Fetch FAQs
    const faqRes = await fetch(`${API_URL}/faqs`);
    const faqData = await faqRes.json();
    console.log('\n[TEST 2] Get FAQs Count:', faqData.count);

  } catch (error) {
    console.error('Test execution error:', error.message);
  }
}

runTests();