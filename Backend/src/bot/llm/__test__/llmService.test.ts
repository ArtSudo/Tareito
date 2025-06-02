import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import { callLLM } from "@/bot/llm/LLMService";


describe("LLMService", () => {
    beforeAll(async () => {
        // Setup if needed
    });
    
    beforeEach(async () => {
        // Reset state if needed
    });
    
    afterAll(async () => {
        // Cleanup if needed
    });
    
    it("should call the LLM and return a response", async () => {
        const response = await callLLM("What is the capital of France?");
        console.log("LLM Response:", response);
        expect(response).toBeDefined();
        expect(response).toContain("Paris");
    });

});