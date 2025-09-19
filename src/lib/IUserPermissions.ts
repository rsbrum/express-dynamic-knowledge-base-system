import { EUserPermissions } from "@/lib/EUserPermissions";

export interface IUserPermissions {
  [EUserPermissions.CAN_VIEW]: boolean;
  [EUserPermissions.CAN_EDIT]: boolean;
  [EUserPermissions.CAN_DELETE]: boolean;
}

export type AdminPermissions = {
  [EUserPermissions.CAN_VIEW]: true;
  [EUserPermissions.CAN_EDIT]: true;
  [EUserPermissions.CAN_DELETE]: true;
};

export type EditorPermissions = {
  [EUserPermissions.CAN_VIEW]: true;
  [EUserPermissions.CAN_EDIT]: true;
  [EUserPermissions.CAN_DELETE]: false;
};

export type ViewerPermissions = {
  [EUserPermissions.CAN_VIEW]: true;
  [EUserPermissions.CAN_EDIT]: false;
  [EUserPermissions.CAN_DELETE]: false;
};
