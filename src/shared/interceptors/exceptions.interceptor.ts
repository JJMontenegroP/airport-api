import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import { BusinessError, BusinessLogicException } from "@/shared/exceptions";

@Injectable()
export class ExceptionsInterceptor implements NestInterceptor {
  private readonly errors: Record<BusinessError, HttpStatus> = {
    [BusinessError.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
    [BusinessError.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [BusinessError.PRECONDITION_FAILED]: HttpStatus.PRECONDITION_FAILED,
  };

  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: BusinessLogicException) => {
        const httpStatus = this.errors[err.type];
        if (httpStatus) {
          throw new HttpException(err.message, httpStatus);
        }
        throw err;
      }),
    );
  }
}
