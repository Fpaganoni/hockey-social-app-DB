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
      include: {
        user: true,
        club: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        club: true,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        club: true,
      },
    });
  }

  async findByClub(clubId: string) {
    return this.prisma.post.findMany({
      where: { clubId },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        club: true,
      },
    });
  }

  async create(data: {
    content: string;
    userId: string;
    clubId?: string;
    imageUrl?: string;
    images?: string[];
    videoUrl?: string;
    visibility?: "PUBLIC" | "FRIENDS" | "PRIVATE";
    isPinned?: boolean;
  }) {
    return this.prisma.post.create({
      data: {
        content: data.content,
        userId: data.userId,
        clubId: data.clubId,
        imageUrl: data.imageUrl,
        images: data.images || [],
        videoUrl: data.videoUrl,
        visibility: data.visibility || "PUBLIC",
        isPinned: data.isPinned || false,
        isClubPost: !!data.clubId,
      },
    });
  }

  async update(
    id: string,
    data: {
      content?: string;
      imageUrl?: string;
      images?: string[];
      videoUrl?: string;
      visibility?: "PUBLIC" | "FRIENDS" | "PRIVATE";
      isPinned?: boolean;
    }
  ) {
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
        user: true,
        replies: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async createComment(
    postId: string,
    userId: string,
    content: string,
    parentCommentId?: string
  ) {
    return this.prisma.comment.create({
      data: {
        postId,
        userId,
        content,
        parentCommentId,
      },
      include: {
        user: true,
      },
    });
  }

  async deleteComment(id: string) {
    await this.prisma.comment.delete({ where: { id } });
    return true;
  }

  // Comment Likes
  async likeComment(commentId: string, userId: string) {
    try {
      return await this.prisma.commentLike.create({
        data: {
          commentId,
          userId,
        },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new Error("You already liked this comment");
      }
      throw error;
    }
  }

  async unlikeComment(commentId: string, userId: string) {
    const like = await this.prisma.commentLike.findFirst({
      where: { commentId, userId },
    });

    if (!like) {
      throw new Error("Comment like not found");
    }

    await this.prisma.commentLike.delete({
      where: { id: like.id },
    });

    return true;
  }

  async getCommentLikes(commentId: string) {
    return this.prisma.commentLike.findMany({
      where: { commentId },
      include: {
        user: true,
      },
    });
  }

  async getCommentLikesCount(commentId: string) {
    return this.prisma.commentLike.count({
      where: { commentId },
    });
  }

  // Likes
  async getLikes(postId: string) {
    return this.prisma.like.findMany({
      where: { postId },
      include: {
        user: true,
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
}
