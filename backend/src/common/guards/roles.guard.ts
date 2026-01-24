import { ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Leer los roles requeridos del decorator @Roles
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

        // Si no hay roles definidos, permitir acceso
        if (!requiredRoles) {
            return true;
        }

        // Obtener el usuario de la request
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Verificar si el usuario tiene uno de los roles requeridos
        const hasRole = requiredRoles.some((role) => role === user.role);

        if (!hasRole) {
            throw new ForbiddenException('No tienes permisos para acceder a este recurso');
        }

        return true;
    }
}