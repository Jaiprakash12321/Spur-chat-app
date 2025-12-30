import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateChatTitle(message: string) {

  const prompt = `
Generate a short chat title (max 5 words).
No quotes.
No punctuation.
Based on this user message:

"${message}"
`;
   
  const result = await model.generateContent(prompt);
    if (!result.response) {
    return "New Chat";
  }
  const text = result.response.text().split("\n")[0]?.slice(0, 50) ?? "New Chat"
  return text
}
