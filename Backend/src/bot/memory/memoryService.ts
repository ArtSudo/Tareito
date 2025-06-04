import { BaseChatMessageHistory } from "@langchain/core/chat_history";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

const store = new Map<string, InMemoryChatMessageHistory>();

export function getSessionHistory(sessionId: string): BaseChatMessageHistory {
  if (!store.has(sessionId)) {
    store.set(sessionId, new InMemoryChatMessageHistory());
  }
  return store.get(sessionId)!;
}
