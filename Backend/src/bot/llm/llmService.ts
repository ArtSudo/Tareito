import { ChatOpenAI } from "@langchain/openai";
import { env } from "@/common/utils/envConfig";

type SupportedModels = "OpenAI_4o";

export async function callLLM(prompt: string, model: SupportedModels = "OpenAI_4o") {
    switch (model) {
      case "OpenAI_4o":
        const openai = new ChatOpenAI({
          temperature: 0.7,
          modelName: "gpt-4o", // Cambia si usas GPT-4o
          openAIApiKey: env.AI_TOCKEN,
        });
  
        const response = await openai.invoke(prompt);
        return response.content;
  
      default:
        throw new Error(`Modelo no soportado: ${model}`);
    }
  }