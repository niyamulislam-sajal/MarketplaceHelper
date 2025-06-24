export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, description, name } = req.body;

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

    // ✅ Check if OpenAI API request succeeded
    if (!completionRes.ok) {
      const errorText = await completionRes.text();
      console.error("OpenAI Error:", errorText);
      return res.status(500).json({ error: "Failed to get response from OpenAI", detail: errorText });
    }

    const data = await completionRes.json();
    const reply = data.choices?.[0]?.message?.content || "No reply received";

    return res.status(200).json({ message: reply });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Server error", detail: error.message });
  }
}
