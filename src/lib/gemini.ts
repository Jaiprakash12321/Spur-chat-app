import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateText, streamText } from "ai";
import { openrouter } from "~/server/actions";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateChatTitle(message: string): Promise<string> {

  const prompt = `
Generate a short chat title (max 5 words).
No quotes.
No punctuation.
Based on this user message:

"${message}"
`

  try {
    const { text } = await generateText({
          model: openrouter('openai/gpt-4o-mini') as any,
          prompt,
          maxOutputTokens: 20,
          temperature: 0.3
      })
      
      const title = text.split("\n")[0]?.slice(0, 50) || "New Chat"
      return title
  } catch(err) {
       console.error(err)
       return "New chat"
  }
   
  // const result = await model.generateContent(prompt);
  //   if (!result.response) {
  //   return "New Chat";
  // }
  // const text = result.response.text().split("\n")[0]?.slice(0, 50) ?? "New Chat"
  // return text
}
