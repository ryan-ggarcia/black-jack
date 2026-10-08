import express from "express"
import UsuarioController from "../controllers/usuarioController.js"

const router = express.Router()
const ctrl = new UsuarioController()

router.get("/", (req, res) => ctrl.Read(req, res))
router.get("/:id", (req, res) => ctrl.FindBy(req, res))
router.post("/", (req, res) => ctrl.Create(req, res))
router.put("/:id", (req, res) => ctrl.Update(req, res))
router.delete("/:id", (req, res) => ctrl.Delete(req, res))

export default router
