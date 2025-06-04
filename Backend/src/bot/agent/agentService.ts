import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { prompt } from "@/bot/agent/promptTemplates";
import { getSessionHistory } from "@/bot/memory/memoryService";
import { getLLM } from "@/bot/llm/llmService";
import { createReactAgent, AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { Tool } from "@langchain/core/tools";

class DateTool extends Tool {
  name: string;
  description: string;
  constructor() {
    super();
    this.name = "get_current_date";
    this.description = "Devuelve la fecha y hora actual en formato ISO.";
  }

  async _call(_input: string) {
    return new Date().toISOString();
  }
}

export const dateTool = new DateTool();

export async function initAgent(sessionId: string) {
    const llm = getLLM();

    const agent = await createStructuredChatAgent({
        llm,
        tools: [dateTool],
        prompt
    });

    const agentExecutor = new AgentExecutor({
        agent,
        tools: [dateTool],
    });

    const runnable = new RunnableWithMessageHistory({
        runnable: agentExecutor,
        getMessageHistory: () => {
            return getSessionHistory(sessionId);
        },
        inputMessagesKey: "input",
        historyMessagesKey: "history",
    });

    return runnable;
}
