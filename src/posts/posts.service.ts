import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(limit?: number, offset?: number) {
    return this.prisma.post.findMany({
      take: limit || 50,
      skip: offset || 0,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async findByAuthor(authorId: string, authorType: "USER" | "CLUB") {
    return this.prisma.post.findMany({
      where: {
        authorId,
        authorType,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: {
    content: string;
    imageUrl: string;
    authorType: "USER" | "CLUB";
    authorId: string;
  }) {
    return this.prisma.post.create({
      data,
    });
  }

  async update(id: string, data: { content?: string; imageUrl?: string }) {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.prisma.post.delete({ where: { id } });
    return true;
  }

  // Comments
  async getComments(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async createComment(postId: string, authorId: string, content: string) {
    return this.prisma.comment.create({
      data: {
        postId,
        authorId,
        content,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async deleteComment(id: string) {
    await this.prisma.comment.delete({ where: { id } });
    return true;
  }

  // Likes
  async getLikes(postId: string) {
    return this.prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async getLikesCount(postId: string) {
    return this.prisma.like.count({
      where: { postId },
    });
  }

  async likePost(postId: string, userId: string) {
    try {
      return await this.prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new Error("You already liked this post");
      }
      throw error;
    }
  }

  async unlikePost(postId: string, userId: string) {
    const like = await this.prisma.like.findFirst({
      where: { postId, userId },
    });

    if (!like) {
      throw new Error("Like not found");
    }

    await this.prisma.like.delete({
      where: { id: like.id },
    });

    return true;
  }

  // Resolve polymorphic author
  async getAuthor(post: any) {
    if (post.authorType === "USER") {
      return this.prisma.user.findUnique({
        where: { id: post.authorId },
        include: { profile: true },
      });
    }
    return null;
  }

  async getClubAuthor(post: any) {
    if (post.authorType === "CLUB") {
      return this.prisma.club.findUnique({
        where: { id: post.authorId },
      });
    }
    return null;
  }
}
