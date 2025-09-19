import { EUserPermissions } from "@/lib/EUserPermissions";

export interface IUserPermissions {
  [EUserPermissions.CAN_VIEW]: boolean;
  [EUserPermissions.CAN_EDIT]: boolean;
  [EUserPermissions.CAN_DELETE]: boolean;
  [EUserPermissions.CAN_MANAGE_USERS]: boolean;
}

export type AdminPermissions = {
  [EUserPermissions.CAN_VIEW]: true;
  [EUserPermissions.CAN_EDIT]: true;
  [EUserPermissions.CAN_DELETE]: true;
  [EUserPermissions.CAN_MANAGE_USERS]: true;
};

export type EditorPermissions = {
  [EUserPermissions.CAN_VIEW]: true;
  [EUserPermissions.CAN_EDIT]: true;
  [EUserPermissions.CAN_DELETE]: false;
  [EUserPermissions.CAN_MANAGE_USERS]: false;
};

export type ViewerPermissions = {
  [EUserPermissions.CAN_VIEW]: true;
  [EUserPermissions.CAN_EDIT]: false;
  [EUserPermissions.CAN_DELETE]: false;
  [EUserPermissions.CAN_MANAGE_USERS]: false;
};
