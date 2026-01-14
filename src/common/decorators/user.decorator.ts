import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserPayload {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);