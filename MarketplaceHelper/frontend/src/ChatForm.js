import React, { useState } from 'react';

export default function ChatForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('Niyamul');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, name }),
      });

      if (!res.ok) {
        throw new Error('Failed to contact assistant.');
      }

      const data = await res.json();
      setResponse(data?.response || 'No response from assistant.');
    } catch (err) {
      setResponse(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🧠 Marketplace Assistant</h2>
      <form onSubmit={onSubmit}>
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
        <select value={name} onChange={(e) => setName(e.target.value)}>
          <option value="Niyamul">Niyamul</option>
          <option value="Sajib">Sajib</option>
        </select><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Ask Assistant'}
        </button>
      </form>

      <div style={{ marginTop: '1rem' }}>
        <strong>Response:</strong>
        <p>{response || 'No response yet.'}</p>
      </div>
    </div>
  );
}
