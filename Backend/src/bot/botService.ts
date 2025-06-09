import { type GraphState } from "@/bot/graph/graphModel";
import { graph } from "@/bot/graph/graphService";

export async function handleUserMessage(userId: string, message: string): Promise<string> {
    const config = {
        configurable: {
        thread_id: userId, // clave para multiusuario
        },
    };

    const initialState: GraphState = {
        idUser: userId,
        input: message,
    }

    const result = await graph.invoke(
        initialState,
        config,
    );

    return result.output ? result.output : "No se pudo interpretar la respuesta del asistente.";
}