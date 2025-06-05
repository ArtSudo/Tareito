import { z } from "zod";
import { inboxService } from "@/api/inbox/inboxService";
import { userService } from "@/api/user/userService";
import { LenientStructuredTool } from "@/bot/llm/LenientStructuredTool"

// 📥 Obtener todos los inbox s de un usuario
export class GetInboxByUserTool extends LenientStructuredTool {
    name = "get_inbox_by_user";
    description = "Obtiene todos los s del inbox para un usuario.";

    schema = z.object({
        user_id: z.string().describe("ID del usuario como string numérico")
    });

    schemaInput = this.schema

    async _call({ user_id }: { user_id: string }) {
        const userId = parseInt(user_id, 10);
        if (isNaN(userId)) return "ID inválido.";
        const user = await userService.findById(userId);
        if (!user.responseObject) return `❌ No existe el usuario con ID ${userId}.`;

        const result = await inboxService.findAllByUserId(userId);
        return JSON.stringify(result.responseObject);
    }
}

// 🔍 Obtener un inbox  por su ID
export class GetInboxTool extends LenientStructuredTool {
  name = "get_inbox";
  description = "Obtiene los inbox por su ID.";

  schema = z.object({
    _id: z.string().describe("ID del  como string numérico")
  });

  schemaInput = this.schema

  async _call({ _id }: { _id: string }) {
    const id = parseInt(_id, 10);
    if (isNaN(id)) return "ID inválido.";
    try {
        const result = await inboxService.findById(id);
        if (!result.responseObject) return `❌ No se encontró el  con ID ${id}.`;
        return JSON.stringify(result.responseObject);
    } catch (err) {
    return `❌ Error al ejecutar ${this.name}: ${(err as Error).message}`;
    }
  }
}

// 📝 Crear un nuevo inbox 
export class CreateInboxTool extends LenientStructuredTool {
  name = "create_inbox";
  description = "Crea un nuevo inbox para un usuario.";

  schema = z.object({
    user_id: z.string().describe("ID del usuario como string numérico"),
    content: z.string().min(1, "Contenido requerido").describe("Contenido del ")
  });

  schemaInput = this.schema

  async _call({ user_id, content }: { user_id: string; content: string }) {
    const userId = parseInt(user_id, 10);
    if (isNaN(userId)) return "ID inválido.";
    const user = await userService.findById(userId);
    if (!user.responseObject) return `❌ No existe el usuario con ID ${userId}.`;

    try {
      const result = await inboxService.createItem(userId, content.trim());
      if (!result.responseObject?.id) throw new Error("Error al crear .");
      return `✅  creado con ID: ${result.responseObject.id}`;
    } catch (err) {
      return `❌ Error: ${(err as Error).message}`;
    }
  }
}

// ✅ Marcar un inbox  como procesado
export class MarkInboxAsProcessedTool extends LenientStructuredTool {
  name = "mark_inbox__as_processed";
  description = "Marca un  como procesado.";

  schema = z.object({
    _id: z.string().describe("ID del  como string numérico")
  });

  schemaInput = this.schema

  async _call({ _id }: { _id: string }) {

    const id = parseInt(_id, 10);
    if (isNaN(id)) return "ID inválido.";

    try {
      const result = await inboxService.markAsProcessed(id);
      if (!result.responseObject) return `❌ No se pudo procesar el  con ID ${id}.`;
      return `✅  ${id} marcado como procesado`;
    } catch (err) {
      return `❌ Error: ${(err as Error).message}`;
    }
  }
}

// 📥📊 Obtener inbox s por usuario y estado
export class GetInboxByUserAndStatusTool extends LenientStructuredTool {
  name = "get_inbox_by_user_and_status";
  description = "Obtiene s por usuario y estado de procesamiento.";

    schema = z.object({
    user_id: z.string().describe("ID del usuario como string numérico"),
    status: z.string().describe("true para procesados, false para no procesados. Debe ser exactamente 'true' o 'false' (como texto).")
    });


  schemaInput = this.schema

  async _call({ user_id, status }: { user_id: string; status: boolean | string }) {
    try {
        const userId = parseInt(user_id, 10);
        if (isNaN(userId)) return "ID inválido.";
        const user = await userService.findById(userId);
        if (!user.responseObject) return `❌ No existe el usuario con ID ${userId}.`;
    
        // Resolver estado
        let normalizedStatus: boolean;
        if (typeof status === "boolean") {
        normalizedStatus = status;
        } else {
        const val = status.toLowerCase();
        if (val === "processed" || val === "true") {
            normalizedStatus = true;
        } else if (val === "unprocessed" || val === "false") {
            normalizedStatus = false;
        } else {
            return `❌ Estado inválido: ${status}`;
        }
        }

        const result = await inboxService.findByUserAndStatusProcessed(userId, normalizedStatus);
        return JSON.stringify(result.responseObject);
    } catch (err) {
        return `❌ Error al ejecutar ${this.name}: ${(err as Error).message}`;
    }
  }
}
