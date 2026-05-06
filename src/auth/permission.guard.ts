import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    
    const requiredPermissions = this.reflector.get<string[]>(
      "permission",
      context.getHandler()
    );
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
   

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    const userPermissions =
      user?.role?.permission?.map((p: any) => p.identifier) || [];



    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      throw new ForbiddenException("Access denied");
    }

    return true;
  }
}

