import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Request } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;
    const startedAt = Date.now();

    this.logger.debug(
      `Starting ${controllerName}.${handlerName} ` +
        `for ${request.method} ${request.url}`,
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startedAt;

        this.logger.debug(
          `Finished ${controllerName}.${handlerName} ` + `in ${duration}ms`,
        );
      }),
    );
  }
}
