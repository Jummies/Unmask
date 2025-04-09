export default async function handler(req, res) {
  const { conversation } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: "You are a psychological profiler. Ask 10 reflective questions, one at a time..."
        },
        ...conversation
      ]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
