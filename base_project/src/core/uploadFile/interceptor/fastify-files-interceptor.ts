import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import FastifyMulter from 'fastify-multer';
import { Options, Multer } from 'multer';
import { defaultOption } from '../utils/default-option';

type MulterInstance = any;
export function FastifyFilesInterceptor(
  fieldName = 'files',
  maxCount = 10,
  localOptions?: Options,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS')
      options: Multer,
    ) {
      this.multer = (FastifyMulter as any)({
        ...options,
        ...(localOptions || defaultOption),
      });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      await new Promise<void>((resolve, reject) =>
        this.multer.array(fieldName, maxCount)(
          ctx.getRequest(),
          ctx.getResponse(),
          (error: any) => {
            if (error) {
              return reject(error);
            }
            resolve();
          },
        ),
      );

      return next.handle();
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
