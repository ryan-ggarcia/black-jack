
import express from "express";
import SalaController from "../controllers/salaController.js";


const router = express.Router();
const controller = new SalaController(); 

router.post("/", (req, res) => controller.criar(req, res));
router.get("/", (req, res) => controller.listar(req, res));

export default router;