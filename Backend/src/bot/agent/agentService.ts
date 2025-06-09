import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { prompt } from "@/bot/agent/promptTemplates";
import { getSessionHistory } from "@/bot/memory/memoryService";
import { getLLM } from "@/bot/llm/llmService";
import { createReactAgent, AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { 
    GetInboxByUserTool,
    GetInboxTool,
    CreateInboxTool,
    MarkInboxAsProcessedTool,
    GetInboxByUserAndStatusTool
} from "@/api/inbox/inboxTools"

import {
    GetNextActionsByUserTool,
    GetNextActionTool,
    CreateNextActionTool,
    MarkNextActionAsDoneTool,
} from "@/api/nextAction/nextactionTools"

const Tools = [
  new GetInboxByUserTool(),
  new GetInboxTool(),
  new CreateInboxTool(),
  new MarkInboxAsProcessedTool(),
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
        maxIterations: 20,
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