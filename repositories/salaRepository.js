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
        let sql = "insert into tb_sala(sal_id, sal_nome, usu_id) values(?, ?, ?)"

        let valores = [sala.id, sala.nome, sala.usuarioId];

        let result = await this.#banco.ExecutaComandoLastInserted(sql, valores);

        if(result > 0) {
            sala.id = result;

            return true
        }

        return false;
    }

    async listarSalas() {
        let sql = "select * from tb_sala";
        let rows = await this.#banco.ExecutaComando(sql);
        
        let lista =[];

        for(let row of rows) {
            lista.push(Sala.toMap(row));
        }

        return lista;
    }
}