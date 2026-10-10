import Database from "../database/db.js"
import Sala from "../entities/salaEntity.js"

export default class SalaRepository {

    #banco

    set banco(value) {
        this.#banco = value
    }

    constructor() {
        this.#banco = new Database()
    }

    async criarSala(sala) {
        let sql = "insert into tb_sala values(?, ?, ?)"

        let valores = [sala.id, sala.nome, sala.usuarioId];

        let result = await this.#banco.ExecutaComandoLastInserted(sql, valores);

        if(result > 0) {
            result = sala.id;

            return true
        }

        return false;
    }
}