import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { prompt } from "@/bot/agent/promptTemplates";
import { getSessionHistory } from "@/bot/memory/memoryService";
import { getLLM } from "@/bot/llm/llmService";
import { createReactAgent, AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";
import { 
    GetInboxByUserTool,
    GetInboxItemTool,
    CreateInboxItemTool,
    MarkInboxItemAsProcessedTool,
    GetInboxByUserAndStatusTool
} from "@/api/inbox/inboxTools"

import {
    GetNextActionsByUserTool,
    GetNextActionTool,
    CreateNextActionTool,
    MarkNextActionAsDoneTool,
} from "@/api/nextAction/nextactionTools"

const handler = new ConsoleCallbackHandler();

const Tools = [
  new GetInboxByUserTool(),
  new GetInboxItemTool(),
  new CreateInboxItemTool(),
  new MarkInboxItemAsProcessedTool(),
  new GetInboxByUserAndStatusTool(),
  new GetNextActionsByUserTool(),
  new GetNextActionTool(),
  new CreateNextActionTool(),
  new MarkNextActionAsDoneTool(),
];

export async function initAgent(sessionId: string) {
    const llm = getLLM();

    const agent = await createStructuredChatAgent({
        llm,
        tools: Tools,
        prompt,
    });

    const agentExecutor = new AgentExecutor({
        agent,
        tools: Tools,
        maxIterations: 10,
        callbacks: [handler]
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
