import { isAIMessage,MessageContent } from "@langchain/core/messages";
import { initAgent } from "@/bot/agent/agentService";
import { getSessionHistory } from "@/bot/memory/memoryService";

export async function handleUserMessage(userId: string, message: string): Promise<string> {
    const agent = await initAgent(userId);

    const history = await getSessionHistory(userId).getMessages();
    console.log("📜 Historial de la sesión:", history);

    const response = await agent.invoke(
        { input: message },
        {
        configurable: {
            sessionId: userId,
        },
        }
    );

    // El contenido vendrá como response.output
    const content = response.output as MessageContent;

    if (typeof content === "string") {
        return content;
    }

    if (Array.isArray(content)) {
        return content
        .map((part) => {
            if (part.type === "text" && typeof (part as any).text === "string") {
            return (part as any).text;
            }
            return "";
        })
        .join("\n");
    }

    return "No se pudo interpretar la respuesta del asistente.";
}