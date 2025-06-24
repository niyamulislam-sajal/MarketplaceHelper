import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    name: 'Niyamul',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

      // 1. Create thread
      const threadRes = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const threadData = await threadRes.json();
      const threadId = threadData.id;

      // 2. Add message to thread
      await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'user',
          content: `Title: ${formData.title}\nDescription: ${formData.description}\nName: ${formData.name}`,
        }),
      });

      // 3. Run assistant
      const runRes = await fetch(
        `https://api.openai.com/v1/threads/${threadId}/runs`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assistant_id: 'asst_rILEgVoDQUalVH9cmW7eCaXi',
          }),
        }
      );

      const runData = await runRes.json();
      const runId = runData.id;

      // 4. Poll until status is completed
      let status = 'queued';
      while (status !== 'completed') {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2s
        const statusRes = await fetch(
          `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        const statusData = await statusRes.json();
        status = statusData.status;
      }

      // 5. Get messages
      const messagesRes = await fetch(
        `https://api.openai.com/v1/threads/${threadId}/messages`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const messagesData = await messagesRes.json();
      const lastMessage = messagesData.data.find(
        (msg) => msg.role === 'assistant'
      );

      setResponse(lastMessage?.content[0]?.text?.value || 'No response received.');
    } catch (error) {
      setResponse('❌ Error: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="App" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h1>Ask Your Assistant</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <select name="name" value={formData.name} onChange={handleChange}>
          <option value="Niyamul">Niyamul</option>
          <option value="Sajib">Sajib</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: '20px', background: '#f1f1f1', padding: '15px' }}>
          <h3>Assistant Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
