
import { StructuredTool, ToolInputParsingException } from "@langchain/core/tools";
import { ToolMessage } from "@langchain/core/messages/tool";

export abstract class LenientStructuredTool extends StructuredTool {
  async invoke(input: any, config?: any) {
    try {
      return await super.invoke(input, config);
    } catch (err) {
      if (err instanceof ToolInputParsingException) {
        return new ToolMessage({
          tool_call_id: this.name,
          content: `⚠️ Entrada inválida para "${this.name}". Formato esperado: ${this.schema.toString()}`
        });
      }
      throw err;
    }
  }
}