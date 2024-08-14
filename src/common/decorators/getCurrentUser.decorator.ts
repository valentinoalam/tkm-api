import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayloadWithRt } from '@feat/auth/payloads/jwtPayloadWithRt.type';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();
    if (data) {
      return user[data];
    }
    return user;
  },
);
