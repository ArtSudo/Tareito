import {initAgent} from "@/bot/agent/agentService";
import { GraphState }  from "@/bot/graph/graphModel"
import { RunnableConfig } from "@langchain/core/runnables";

export async function callAgent(State: GraphState,config?: RunnableConfig): Promise<GraphState> {
    
    const agente = await initAgent(State.idUser);

    const result = await agente.invoke(
        { input: State.input },
        {
            ...config,
            configurable: {
            ...(config?.configurable ?? {}),
            sessionId: State.idUser, // 👈 obligatorio para que getMessageHistory funcione
        },
  }
    );

    return {
        ...State,
        output: typeof result.output === "string"
            ? result.output
            : JSON.stringify(result.output),
    }
}