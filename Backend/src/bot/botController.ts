import { Request, Response } from "express";
import { handleUserMessage } from "@/bot/botService";

export const botController = {
  async sendMessage(req: Request, res: Response) {
    const { userId } = req.params;
    const { message } = req.body;

    console.log(userId);
    console.log(message);

    const response = await handleUserMessage(userId, message);
    res.json({ response });
  },
};
