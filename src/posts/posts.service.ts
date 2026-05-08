import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationType } from "@prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

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
      include: {
        user: true,
        club: true,
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
    const comment = await this.prisma.comment.create({
      data: { postId, userId, content, parentCommentId },
      include: { user: true },
    });

    if (parentCommentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: parentCommentId },
        select: { userId: true },
      });
      if (parent) {
        this.eventEmitter.emit('comment.replied', {
          actorId: userId,
          recipientId: parent.userId,
          type: NotificationType.REPLY_COMMENT,
          entityId: comment.id,
          postId,
        });
      }
    } else {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true },
      });
      if (post) {
        this.eventEmitter.emit('post.commented', {
          actorId: userId,
          recipientId: post.userId,
          type: NotificationType.COMMENT_POST,
          entityId: postId,
          postId,
        });
      }
    }

    return comment;
  }

  async deleteComment(id: string) {
    await this.prisma.comment.delete({ where: { id } });
    return true;
  }

  // Comment Likes
  async likeComment(commentId: string, userId: string) {
    try {
      const like = await this.prisma.commentLike.create({
        data: { commentId, userId },
      });

      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
        select: { userId: true, postId: true },
      });
      if (comment) {
        this.eventEmitter.emit('comment.liked', {
          actorId: userId,
          recipientId: comment.userId,
          type: NotificationType.LIKE_COMMENT,
          entityId: commentId,
          postId: comment.postId,
        });
      }

      return like;
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
      const like = await this.prisma.like.create({
        data: { postId, userId },
      });

      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true },
      });
      if (post) {
        this.eventEmitter.emit('post.liked', {
          actorId: userId,
          recipientId: post.userId,
          type: NotificationType.LIKE_POST,
          entityId: postId,
          postId,
        });
      }

      return like;
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
