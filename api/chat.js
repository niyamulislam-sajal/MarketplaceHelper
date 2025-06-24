export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { title, description, name } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Title: ${title}\nDescription: ${description}\nName: ${name}` },
      ],
    }),
  });

  const data = await response.json();
  return res.status(200).json({ response: data.choices?.[0]?.message?.content || 'No response' });
}
