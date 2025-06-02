import { ChatOpenAI } from "@langchain/openai";
import { env } from "@/common/utils/envConfig";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  apiKey: env.AI_TOCKEN,
  modelName: "gpt-4o",
});

// Example function to send a message
async function sendMessage() {
    const response = await model.call([
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What is the capital of France?" },
    ]);

    console.log(response.content); // Logs: "The capital of France is Paris."
}

sendMessage().catch(console.error);
  