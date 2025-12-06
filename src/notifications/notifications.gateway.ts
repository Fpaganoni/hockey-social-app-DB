import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('WebSocket gateway initialized');
  }

  sendNotification(toUserId: string, payload: any) {
    this.server.to(toUserId).emit('notification', payload);
  }

  @SubscribeMessage('join')
  handleJoin(client: any, payload: { userId: string }) {
    client.join(payload.userId);
    return { status: 'joined', userId: payload.userId };
  }
}
