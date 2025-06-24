export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, description, name } = req.body;

  try {
    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Marketplace Query:\nTitle: ${title}\nDescription: ${description}\nSubmitted by: ${name}`
          }
        ]
      })
    });

    const data = await result.json();
    const reply = data.choices?.[0]?.message?.content || "No response from assistant.";

    res.status(200).json({ message: reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
