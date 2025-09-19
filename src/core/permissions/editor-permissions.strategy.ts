import { EUserPermissions } from "@/lib/EUserPermissions";
import { getPermissionsForRole } from "@/core/permissions/permissions-helper";
import { PermissionsStrategy } from "@/core/permissions/permissions.strategy";
import { IUserPermissions } from "@/lib/IUserPermissions";
import { EUserRole } from '@/lib/EUserRole';

export class EditorPermissionsStrategy implements PermissionsStrategy {
  private readonly permissions: IUserPermissions;

  constructor() {
    this.permissions = getPermissionsForRole(EUserRole.EDITOR);
  }

  canPerform(permission: EUserPermissions): boolean {
    return this.permissions[permission];
  }
}
