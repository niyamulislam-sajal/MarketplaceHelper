import { useState } from "react";

export default function ChatForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("Niyamul"); // default value
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
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Ask the Assistant</h2>

      <label>Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={4}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Name</label>
      <select value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", marginBottom: 10 }}>
        <option value="Niyamul">Niyamul</option>
        <option value="Sajib">Sajib</option>
      </select>

      <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
        {loading ? "Sending..." : "Submit"}
      </button>

      <div style={{ marginTop: 20 }}>
        <strong>Response:</strong>
        <pre>{response}</pre>
      </div>
    </form>
  );
}
