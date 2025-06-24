export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, description, name } = req.body;

  if (!title || !description || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const completionRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Marketplace Query:\nTitle: ${title}\nDescription: ${description}\nSubmitted by: ${name}`,
          },
        ],
      }),
    });

    const data = await completionRes.json();

    if (!completionRes.ok) {
      console.error("OpenAI Error:", data);
      return res.status(500).json({ error: "OpenAI API call failed", details: data });
    }

    const reply = data.choices?.[0]?.message?.content || "No reply received.";
    return res.status(200).json({ message: reply });

  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({ error: "Internal Server Error", detail: err.message });
  }
}
