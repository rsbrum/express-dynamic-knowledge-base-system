import { EUserRole } from "@/lib/EUserRole";
import { EditorPermissionsStrategy } from "@/core/permissions/editor-permissions.strategy";
import { ViewerPermissionsStrategy } from "@/core/permissions/viewer-permissions.strategy";
import { AdminPermissionsStrategy } from "@/core/permissions/admin-permissions.strategy";
import { PermissionsStrategy } from "@/core/permissions/permissions.strategy";

export class PermissionsStrategyFactory {
  private static strategies = new Map<EUserRole, PermissionsStrategy>([
    [EUserRole.ADMIN, new AdminPermissionsStrategy()],
    [EUserRole.EDITOR, new EditorPermissionsStrategy()],
    [EUserRole.VIEWER, new ViewerPermissionsStrategy()],
  ]);

  static getStrategy(role: EUserRole): PermissionsStrategy {
    const strategy = this.strategies.get(role);
    if (!strategy) {
      throw new Error(`No permissions strategy found for role: ${role}`);
    }
    return strategy;
  }
}
