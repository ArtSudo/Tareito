
import { StructuredTool, ToolInputParsingException } from "@langchain/core/tools";
import { ToolMessage } from "@langchain/core/messages/tool";
import { LenientStructuredTool } from "@/bot/llm/LenientStructuredTool"
import { z } from "zod";
import { nextActionService } from "@/api/nextAction/nextActionService";
import { userService } from "@/api/user/userService";


// 📋 Obtener next actions por usuario
export class GetNextActionsByUserTool extends LenientStructuredTool {
  name = "get_next_actions_by_user";
  description = "Obtiene todas las acciones siguientes de un usuario.";

  schema = z.object({
    user_id: z.string().describe("ID del usuario como string numérico")
  });

  async _call({ user_id }: { user_id: string }) {
    const userId = parseInt(user_id, 10);
    if (isNaN(userId)) return "ID inválido.";
    const user = await userService.findById(userId);
    if (!user.responseObject) return `❌ No existe el usuario con ID ${userId}.`;

    const result = await nextActionService.findAllByUserId(userId);
    return JSON.stringify(result.responseObject);
  }
}

// 🔍 Obtener una next action por su ID
export class GetNextActionTool extends LenientStructuredTool {
  name = "get_next_action";
  description = "Obtiene una acción siguiente por su ID. Formato: actionId";

  schema = z.object({
    actionId: z.string().describe("ID del itemNexAction como string numérico")
  });

  schemaInput = this.schema

  async _call(actionId: string): Promise<string> {
    const id = Number.parseInt(actionId.trim(), 10);
    if (isNaN(id)) return "⚠️ Formato inválido. Usa: actionId";

    const result = await nextActionService.findById(id);
    if (!result.responseObject) return `❌ No se encontró la acción con ID ${id}.`;
    return JSON.stringify(result.responseObject);
  }
}

// 📝 Crear una nueva next action
export class CreateNextActionTool extends LenientStructuredTool {
  name = "create_next_action";
  description = "Crea una nueva acción siguiente para un usuario. Requiere user_id y contenido.Action Input: {user_id:1,content: Diseñar el prototipo del robot}";

  schema = z.object({
    user_id: z.string().describe("user_id: ID del usuario como string numérico"),
    content: z.string().min(1).describe("content: Contenido de la acción siguiente")
  });

  schemaInput = this.schema;

  async _call({ user_id, content }: { user_id: string; content: string }) {
    try {
      const userId = Number.parseInt(user_id.trim(), 10);  
      if (!content || content.trim() === "") return "⚠️ El contenido no puede estar vacío.";
      if (isNaN(userId)) return "⚠️ El ID del usuario debe ser un número.";

      const user = await userService.findById(userId);
      if (!user.responseObject) return `❌ No existe el usuario con ID ${userId}.`;

    
      const result = await nextActionService.create(userId, { content: content.trim() });
      if (!result.responseObject?.id) throw new Error("No se creó correctamente.");
      return `✅ Acción creada con ID: ${result.responseObject.id}`;
    } catch (err) {
      return `❌ Error al crear la acción: ${(err as Error).message}`;
    }
  }

}


export class MarkNextActionAsDoneTool extends LenientStructuredTool {
  name = "mark_next_action_as_done";
  description = "Marca una acción como completada. Formato: actionId";

  schema = z.object({
    actionId: z.string().describe("ID del itemNextAction como string numérico")
  });

  schemaInput = this.schema;

  async _call({ actionId }: { actionId: string }): Promise<string> {
    try {
      const id = Number.parseInt(actionId.trim(), 10);
      if (isNaN(id)) return "⚠️ Formato inválido. Usa: actionId";

      const result = await nextActionService.markAsDone(id);
      if (!result.responseObject) return `❌ No se pudo completar la acción con ID ${id}.`;
      return `✅ Acción ${id} marcada como realizada`;
    } catch (err) {
      return `❌ Error al marcar como realizada: ${(err as Error).message}`;
    }
  }
}
