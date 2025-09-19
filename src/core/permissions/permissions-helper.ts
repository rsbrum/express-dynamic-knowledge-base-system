import { EUserRole } from '@/lib/EUserRole';
import { IUserPermissions } from '@/lib/IUserPermissions';
import { EUserPermissions } from '@/lib/EUserPermissions';
import { PermissionsStrategyFactory } from './permissions.factory';

export function getPermissionsForRole(role: EUserRole): IUserPermissions {
  switch (role) {
    case EUserRole.ADMIN:
      return {
        [EUserPermissions.CAN_VIEW]: true,
        [EUserPermissions.CAN_EDIT]: true,
        [EUserPermissions.CAN_DELETE]: true,
      };
    case EUserRole.EDITOR:
      return {
        [EUserPermissions.CAN_VIEW]: true,
        [EUserPermissions.CAN_EDIT]: true,
        [EUserPermissions.CAN_DELETE]: false,
      };
    case EUserRole.VIEWER:
    default:
      return {
        [EUserPermissions.CAN_VIEW]: true,
        [EUserPermissions.CAN_EDIT]: false,
        [EUserPermissions.CAN_DELETE]: false,
      };
  }
}

export function hasPermission(role: EUserRole, permission: EUserPermissions): boolean {
  const strategy = PermissionsStrategyFactory.getStrategy(role);
  return strategy.canPerform(permission);
}
