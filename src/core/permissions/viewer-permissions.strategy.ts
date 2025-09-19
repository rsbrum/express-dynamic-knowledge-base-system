import { EUserPermissions } from "@/lib/EUserPermissions";
import { EUserRole } from '@/lib/EUserRole';
import { IUserPermissions } from "@/lib/IUserPermissions";
import { getPermissionsForRole } from "@/core/permissions/permissions-helper";
import { PermissionsStrategy } from "@/core/permissions/permissions.strategy";

export class ViewerPermissionsStrategy implements PermissionsStrategy {
  private readonly permissions: IUserPermissions;

  constructor() {
    this.permissions = getPermissionsForRole(EUserRole.VIEWER);
  }

  canPerform(permission: EUserPermissions): boolean {
    return this.permissions[permission];
  }
}
