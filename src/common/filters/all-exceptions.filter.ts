import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    // 1. Detección del tipo de contexto (GraphQL o HTTP REST)
    const contextType = host.getType<GqlContextType>();

    // Extraer o determinar el status HTTP
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error ? exception.message : 'Unknown Server Error';

    // 2. Logging Centralizado Independiente del Contexto
    this.logger.error(
      `[Context: ${contextType}] Exception caught: ${message}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    // 3. Manejo de Respuesta para GraphQL
    if (contextType === 'graphql') {
      // En GraphQL NO respondemos directamente via HTTP objects. 
      // Relanzamos o retornamos la excepción para que Apollo Server la atrape y
      // la fase de 'formatError' (en graphql.module) la limpie/ofusque y formatee como JSON graphQL { errors: [...] }.
      if (exception instanceof HttpException) {
        return exception;
      }
      // Aseguramos que los errores graves genéricos no corten el hilo sin formato (masking the DB / code leak)
      return new HttpException('Internal GraphQL Engine Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 4. Manejo de Respuesta HTTP / REST Standard (e.g Webhooks de Stripe, auth routes)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Protección extra: No exponer el objeto de excepción si es un Error 500 no manejado 
    const finalErrorMessage =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : (exception as HttpException).getResponse();

    if (response && response.status) {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request?.url,
        message: finalErrorMessage,
      });
    }
  }
}
