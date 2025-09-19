import { EUserPermissions } from "@/lib/EUserPermissions";

export abstract class PermissionsStrategy {
  abstract canPerform(permission: EUserPermissions): boolean;
}
