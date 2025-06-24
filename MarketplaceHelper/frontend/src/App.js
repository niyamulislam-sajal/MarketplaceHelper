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

    const data = await res.json();
    setResponse(data.message || data.error || "No response received.");
  } catch (err) {
    console.error("Fetch Error:", err);
    setResponse("❌ Failed to contact assistant.");
  }

  setLoading(false);
};
