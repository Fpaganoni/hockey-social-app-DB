import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationType } from '@prisma/client';
import { NotificationsService } from './notifications.service';

export interface NotificationEvent {
  actorId: string;
  recipientId: string;
  type: NotificationType;
  entityId?: string;
  postId?: string;
}

@Injectable()
export class NotificationsListener {
  constructor(private notificationsService: NotificationsService) {}

  @OnEvent('post.liked')
  async handlePostLiked(event: NotificationEvent) {
    try {
      await this.notificationsService.createNotification(event);
    } catch (_) {}
  }

  @OnEvent('post.commented')
  async handlePostCommented(event: NotificationEvent) {
    try {
      await this.notificationsService.createNotification(event);
    } catch (_) {}
  }

  @OnEvent('comment.replied')
  async handleCommentReplied(event: NotificationEvent) {
    try {
      await this.notificationsService.createNotification(event);
    } catch (_) {}
  }

  @OnEvent('comment.liked')
  async handleCommentLiked(event: NotificationEvent) {
    try {
      await this.notificationsService.createNotification(event);
    } catch (_) {}
  }

  @OnEvent('club.invite_sent')
  async handleClubInvite(event: NotificationEvent) {
    try {
      await this.notificationsService.createNotification(event);
    } catch (_) {}
  }

  @OnEvent('user.followed')
  async handleUserFollowed(event: NotificationEvent) {
    try {
      await this.notificationsService.createNotification(event);
    } catch (_) {}
  }
}
