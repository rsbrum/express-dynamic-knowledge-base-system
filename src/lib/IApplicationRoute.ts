import { Router } from "express";

export default interface IApplicationRoute {
  getRouter(): Router;
}
