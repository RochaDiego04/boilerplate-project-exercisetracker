import express, { Express } from "express";
import { Router } from "express";

const router: Router = Router();

router.route("/").get();

export default router;
