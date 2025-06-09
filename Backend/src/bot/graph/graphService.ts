import { StateGraph, START, END } from "@langchain/langgraph";
import { GraphAnnotation  } from "@/bot/graph/graphModel";
import { MemorySaver } from "@langchain/langgraph";
import { callAgent } from "@/bot/nodes/Agent"

const graphBuilder = new StateGraph(GraphAnnotation );

graphBuilder
    .addNode("llm", callAgent, {ends: ["__end__"],})
    .addEdge("__start__", "llm")
    .addEdge("llm", "__end__");

export const graph = graphBuilder.compile({
  checkpointer: new MemorySaver(),
});