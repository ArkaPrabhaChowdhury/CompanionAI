import { Configuration, OpenAIApi } from "openai";
import 'react-native-url-polyfill/auto';
import {OPENAI_API_KEY} from "@env";


async function generateAIResponse(conversation) {
  try {
    const configuration = new Configuration({
      organization: "org-Q0aCYl9VGcdufkZzVeBMtZKM",
      apiKey: OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const messages = conversation.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 75,
      messages: [{"role":"system", "content":"Imagine you're a compassionate therapist with 20+ years of experience. You're here to help someone in need. Provide helpful and concise responses that address their concerns. Keep your answers supportive and avoid excessive questioning. Keep the responses short and empathetic"},...messages],
    });

    const therapistResponse = completion.data.choices[0].message.content;

    return therapistResponse;
  } catch (error) {
    console.error("Error in generateAIResponse:", error);
    throw error;
  }
}

export { generateAIResponse };
