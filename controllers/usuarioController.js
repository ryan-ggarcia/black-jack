import UsuarioEntity from "../entities/usuarioEntity.js"
import Database from "../database/db.js"
import UsuarioRepository from "../repositories/usuarioRepository.js"

export default class UsuarioController {
    #usuarioRepo
    #db
    constructor() {
        this.#db = new Database()
        this.#usuarioRepo = new UsuarioRepository()
    }

    async Create(req, res) {
        try {
            const { usu_nome, usu_email, usu_senha } = req.body
            let entity = new UsuarioEntity(null, usu_nome, usu_email, usu_senha)

            if (entity.Validacao()) {
                console.log(entity.Validacao())
                return res.status(400).json({ msg: entity.Validacao() })
            } else {
                let result = await this.#usuarioRepo.Create(entity, this.#db)
                if (result)
                    res.status(201).json({ msg: "Usuário criado com sucesso" })
                else
                    res.status(400).json({ msg: "Erro ao criar usuário" })
            }
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "Erro interno do servidor" })
        }
    }

    async Read(req, res) {
        try {
            let result = await this.#usuarioRepo.Read(this.#db)
            res.status(200).json(result)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "Erro interno do servidor" })
        }
    }

    async FindBy(req, res) {
        try {
            const { id } = req.params
            if (id > 0) {
                let result = await this.#usuarioRepo.FindBy(id, this.#db)
                if (result.length > 0)
                    res.status(200).json(result)
                else
                    res.status(404).json({ msg: "Usuário não encontrado" })
            } else
                res.status(400).json({ msg: "ID inválido" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "Erro interno do servidor" })
        }
    }

    async Update(req, res) {
        try {
            const { id } = req.params
            const { usu_nome, usu_email, usu_senha } = req.body
            let entity = new UsuarioEntity(id, usu_nome, usu_email, usu_senha)
            if (id > 0) {
                if (entity.Validacao()) {
                    console.log(entity.Validacao())
                    return res.status(400).json({ msg: entity.Validacao() })
                } else {
                    let result = await this.#usuarioRepo.Update(entity, this.#db)
                    if (result)
                        res.status(200).json({ msg: "Usuário atualizado com sucesso" })
                    else
                        res.status(400).json({ msg: "Erro ao atualizar usuário" })
                }
            } else {
                res.status(400).json({ msg: "ID inválido" })
            }
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "Erro interno do servidor" })
        }
    }

    async Delete(req, res) {
        try {
            const { id } = req.params
            if (id > 0) {
                let result = await this.#usuarioRepo.Delete(id, this.#db)
                if (result)
                    res.status(200).json({ msg: "Usuário deletado com sucesso" })
                else
                    res.status(400).json({ msg: "Erro ao deletar usuário" })
            }
            else
                res.status(400).json({ msg: "ID inválido" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "Erro interno do servidor" })
        }
    }
}