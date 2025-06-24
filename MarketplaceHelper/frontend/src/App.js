import { useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("Niyamul");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setReply("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setReply(data.reply);
    } catch (err) {
      setReply("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Ask Your Assistant</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        <select value={name} onChange={(e) => setName(e.target.value)}>
          <option value="Niyamul">Niyamul</option>
          <option value="Sajib">Sajib</option>
        </select>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>

      {reply && (
        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
          <strong>Assistant:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}

export default App;

