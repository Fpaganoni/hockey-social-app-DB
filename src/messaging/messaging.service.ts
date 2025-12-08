import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            profile: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getConversation(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            profile: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }

  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async startConversation(participantIds: string[]) {
    // Check if conversation already exists
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        AND: participantIds.map((id) => ({
          participants: {
            some: { id },
          },
        })),
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    return this.prisma.conversation.create({
      data: {
        participants: {
          connect: participantIds.map((id) => ({ id })),
        },
      },
      include: {
        participants: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async markAsRead(messageId: string) {
    await this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
    return true;
  }
}
