const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setResponse("");

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Will be injected by Vite/Cra
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // use gpt-4 only if you have access
        messages: [
          {
            role: "user",
            content: `Marketplace Query:\nTitle: ${title}\nDescription: ${description}\nSubmitted by: ${name}`,
          },
        ],
      }),
    });

    const data = await res.json();
    setResponse(data.choices?.[0]?.message?.content || "No reply received.");
  } catch (err) {
    console.error("Fetch Error:", err);
    setResponse("❌ Failed to contact assistant.");
  }

  setLoading(false);
};
