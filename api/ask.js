// File: api/ask.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { conversation } = req.body;

  const systemPrompt = {
    role: 'system',
    content: "I want to uncover the mask and I recently wearing the roles I'm playing, the illusions I'm believing. Please guide me through the process by asking 10 reflecting questions one at a time to help me recognize the stories I'm telling myself. After I answer the 10th question, please step into a role of my higher self and analyze my responses: identify the top negative patterns present in my life and the top positive patterns I can embrace and grow. Be direct and truthful — tough love is welcome. Provide daily affirmations to support my growth, actionable steps to change my behaviors and embody my authentic self, and a message of encouragement from my higher self to celebrate how far I've come on my journey."
  };

  try {
    const messages = [systemPrompt, ...(conversation || [])];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages
      })
    });

    const data = await response.json();

    if (!data || !data.choices || !data.choices.length || !data.choices[0].message) {
      console.error('Invalid response from OpenAI:', data);
      return res.status(500).json({ error: 'Invalid response structure from OpenAI' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API failure:', error);
    res.status(500).json({ error: 'Failed to fetch from OpenAI' });
  }
}
