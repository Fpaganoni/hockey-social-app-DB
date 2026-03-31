import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const contextType = context.getType<'http' | 'graphql'>();

    // 1. Manejo nativo de contexto HTTP (Opcional, futuro)
    if (contextType === 'http') {
      const http = context.switchToHttp();
      return { req: http.getRequest(), res: http.getResponse() };
    }

    // 2. Manejo de contexto GraphQL
    if (contextType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();
      
      // NestJS Throttler necesita tanto req como res para identificar IPs y setear headers.
      // En Apollo Express setup, res vive dentro de req.res por defecto.
      const req = ctx.req;
      const res = ctx.res || req.res;
      return { req, res };
    }

    // Fallback para otros protocolos (WebSockets, RPC) si existen
    return super.getRequestResponse(context);
  }
}
