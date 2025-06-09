import { Annotation, MessagesAnnotation  } from "@langchain/langgraph";
import { z } from "zod";


export const GraphAnnotation = Annotation.Root({
    idUser: Annotation<string>,
    input: Annotation<string>,
    output: Annotation<string | undefined>,
});

export const GraphStateSchema = z.object({
    idUser: z.string(),
    input: z.string().optional(),
    output: z.string().optional(),
});

export type GraphState = z.infer<typeof GraphStateSchema>;