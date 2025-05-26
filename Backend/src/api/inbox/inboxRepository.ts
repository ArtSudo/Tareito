import { prisma } from '../../common/utils/prisma';
import { InboxItem } from './inboxModel';

export class InboxRepository {
  async findAllbyUserId(userId: number): Promise<InboxItem[]> {
    return prisma.inboxItem.findMany({
      where: {userId},
      orderBy: {capturedAt: 'desc'},
    });
  }

  async findById(id: number): Promise<InboxItem | null> {
    return prisma.inboxItem.findUnique({
      where: { id },
    });
  }

  async create(userId: number, content: string): Promise<InboxItem> {
    return prisma.inboxItem.create({
      data: { userId, content}
    });
  }

  async markAsProcessed(id: number): Promise<InboxItem> {
    return prisma.inboxItem.update({
      where: { id },
      data: { processed: true }
    });
  }
  
};
