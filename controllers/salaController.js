
import SalaRepository from "../repositories/salaRepository.js";
import Sala from "../entities/salaEntity.js";

export default class SalaController {
    #salaRepository;

    constructor() {
        this.#salaRepository = new SalaRepository();
    }

    async listar(req, res) {
        try {
            const salas = await this.#salaRepository.listarSalas();
            res.status(200).json(salas);
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "erro interno no servidor" });
        }
    }

    async criar(req, res) {
        try {
            const { nome } = req.body;
            const sala = new Sala(null, nome, null);
            sala.validar();
            if (await this.#salaRepository.criarSala(sala)) {
                res.status(201).json(sala);
            } else {
                res.status(500).json({ msg: "erro ao criar a sala" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "erro interno no servidor" });
        }
    }
}