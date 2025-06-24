const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setResponse("");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, name }),
    });

    const text = await res.text(); // Always fetch as text to avoid crashing on empty or invalid JSON

    if (!res.ok) {
      console.error("API Error Response:", text);
      setResponse("❌ Assistant error: " + text);
    } else {
      const data = JSON.parse(text);
      setResponse(data.message || data.error || "No response received.");
    }

  } catch (err) {
    console.error("Fetch Error:", err);
    setResponse("❌ Failed to contact assistant.");
  }

  setLoading(false);
};

