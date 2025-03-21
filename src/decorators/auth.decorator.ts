import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';
import { UserRole } from '../enums/user.enum';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(roles?: UserRole[]) {
  return applyDecorators(
    ApiBearerAuth(),
    SetMetadata('roles', roles ?? []),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
