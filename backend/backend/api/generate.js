import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "user",
              content: `Generate a complete responsive HTML website with CSS only. No explanation. Only code. Prompt: ${prompt}`
            }
          ]
        })
      }
    );

    const data = await response.json();
    res.status(200).json({ html: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI API error" });
  }
}