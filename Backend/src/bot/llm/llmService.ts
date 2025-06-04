import { ChatOpenAI } from "@langchain/openai";
import { env } from "@/common/utils/envConfig";

export type SupportedModels = "OpenAI_4o";

export function getLLM(model: SupportedModels = "OpenAI_4o") {
  switch (model) {
    case "OpenAI_4o":
      return new ChatOpenAI({
        temperature: 0.7,
        modelName: "gpt-4o",
        openAIApiKey: env.AI_TOCKEN,
      });

    default:
      throw new Error(`Modelo no soportado: ${model}`);
  }
}
