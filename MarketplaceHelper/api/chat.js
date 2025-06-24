export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, description, name } = req.body;

  try {
    const threadResponse = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2"
      }
    });

    const threadData = await threadResponse.json();
    const thread_id = threadData.id;

    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({
        role: "user",
        content: `Marketplace Query:\nTitle: ${title}\nDescription: ${description}\nSubmitted by: ${name}`
      })
    });

    await messageResponse.json(); // just to trigger the message creation

    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({
        assistant_id: process.env.REACT_APP_ASSISTANT_ID
      })
    });

    const runData = await runResponse.json();
    const run_id = runData.id;

    // Polling for run completion
    let status = "queued";
    let finalResponse = null;

    while (status !== "completed" && status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s

      const statusResponse = await fetch(
        `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v2"
          }
        }
      );

      const statusData = await statusResponse.json();
      status = statusData.status;
    }

    // Get messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2"
      }
    });

    const messagesData = await messagesResponse.json();
    const latestMessage = messagesData.data.find(msg => msg.role === "assistant");

    res.status(200).json({ result: latestMessage.content[0].text.value });

  } catch (error) {
    console.error("Error in assistant handler:", error);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
}
