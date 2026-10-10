
import SalaRepository from "../repositories/salaRepository.js";
import Sala from "../entities/salaEntity.js";

export default class SalaController {
    #salaRepository;

    constructor() {
        this.#salaRepository = new SalaRepository();
    }

    async criar(req, res) {
        try {
            const { nome } = req.body;
            const sala = new Sala(null, nome, null);
            if (sala.validar()) {
                await this.#salaRepository.criarSala(sala);
                res.status(201).json(sala);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "erro interno no servidor" });
        }
    }
}