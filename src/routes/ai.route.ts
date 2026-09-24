import { Request, Response, Router } from "express";

const aiRouter = Router();
aiRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { q } = req.body;

    if (!q || typeof q !== "string") {
      res.status(400).json({
        success: false,
        message: "Question is required",
      });
      return;
    }

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "phi3:latest",
        messages: [
          {
            role: "user",
            content: q,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      const error = await response.text();

      res.write(
        `event: error\ndata: ${JSON.stringify({
          message: error || "Ollama request failed",
        })}\n\n`,
      );

      res.end();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, {
        stream: true,
      });

      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const data = JSON.parse(line);

          if (data.message?.content) {
            res.write(
              `data: ${JSON.stringify({
                content: data.message.content,
              })}\n\n`,
            );
          }

          if (data.done) {
            res.write(
              `event: done\ndata: ${JSON.stringify({
                done: true,
              })}\n\n`,
            );
          }
        } catch (error) {
          console.error("Failed to parse Ollama chunk:", error);
        }
      }
    }

    res.end();
  } catch (error) {
    console.error("Ollama error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to connect to Ollama",
      });
    } else {
      res.write(
        `event: error\ndata: ${JSON.stringify({
          message: "Failed to connect to Ollama",
        })}\n\n`,
      );

      res.end();
    }
  }
});
export default aiRouter;
