import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { validate as isUUID } from "uuid";
import { BusinessError, BusinessLogicException } from "@/shared/exceptions";

@Injectable()
export class UUIDValidationInterceptor implements NestInterceptor {
  constructor(private readonly paramName: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const id: string = request.params[this.paramName];

    if (!id) {
      return next.handle();
    }

    if (!isUUID(id)) {
      throw new BusinessLogicException(
        `Invalid UUID for parameter '${this.paramName}'`,
        BusinessError.BAD_REQUEST,
      );
    }

    return next.handle();
  }
}
