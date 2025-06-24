import React, { useState } from "react";

const ChatForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("Niyamul");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🧠 Marketplace Assistant</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /><br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br />
        <button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Ask Assistant"}
        </button>
      </form>
      <div style={{ marginTop: "1rem" }}>
        <strong>Response:</strong>
        <pre>{response}</pre>
      </div>
    </div>
  );
};

export default ChatForm;
