import express, { Router } from "express";
import UserController from "../controllers/inventoryContorller";

const router: Router = express.Router();

router.get('/', UserController.getTest);
router.get('/data', UserController.getData);
router.post('/upload', UserController.saveData);

export default router;
