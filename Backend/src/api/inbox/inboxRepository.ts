import { prisma } from '../../common/utils/prisma';
import type { InboxItem } from './inboxModel';

export class InboxRepository {
  async findAllbyUserId(userId: number): Promise<InboxItem[]> {
    return prisma.inboxItem.findMany({
      where: {userId},
      orderBy: {createdAt: 'desc'},
    });
  }

  async findById(id: number): Promise<InboxItem | null> {
    return prisma.inboxItem.findUnique({
      where: { id },
    });
  }

  async findByStatusProcessed(status: boolean): Promise<InboxItem[]>{
    return prisma.inboxItem.findMany({
      where: {processed : status},
      orderBy: {createdAt: 'desc'}
    });
  }

  async findByUserAndStatusProcessed(userId: number, status: boolean): Promise<InboxItem[]> {
  return prisma.inboxItem.findMany({
    where: { userId, processed: status },
    orderBy: { createdAt: 'desc' },
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
      data: { processed: true, updatedAt: new Date() }
    });
  }
  
};
