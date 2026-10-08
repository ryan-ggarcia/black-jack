import { jest, describe, test, expect, beforeAll, afterEach } from "@jest/globals"
import express from "express"
import request from "supertest"

// O db.js lê o .env e abre um pool no MySQL; nos testes ele é substituído por uma classe vazia
jest.unstable_mockModule("../database/db.js", () => ({
    default: class DatabaseMock { }
}))

const { default: UsuarioRepository } = await import("../repositories/usuarioRepository.js")
const { default: UsuarioEntity } = await import("../entities/usuarioEntity.js")
const { default: usuarioRoute } = await import("../routes/usuarioRoute.js")

let app

beforeAll(() => {
    app = express()
    app.use(express.json())
    app.use("/usuarios", usuarioRoute)

    // evita poluir a saída com os console.log de erro da controller
    jest.spyOn(console, "log").mockImplementation(() => { })
})

afterEach(() => {
    jest.restoreAllMocks()
    jest.spyOn(console, "log").mockImplementation(() => { })
})

const usuarioValido = { usu_nome: "Ryan", usu_email: "ryan@email.com", usu_senha: "123456" }

describe("GET /usuarios", () => {
    test("200 com a lista de usuários", async () => {
        jest.spyOn(UsuarioRepository.prototype, "Read").mockResolvedValue([
            new UsuarioEntity(1, "Ryan", "ryan@email.com", "123456")
        ])

        const res = await request(app).get("/usuarios")

        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(1)
        expect(res.body[0].usu_nome).toBe("Ryan")
    })

    test("200 com lista vazia", async () => {
        jest.spyOn(UsuarioRepository.prototype, "Read").mockResolvedValue([])

        const res = await request(app).get("/usuarios")

        expect(res.status).toBe(200)
        expect(res.body).toEqual([])
    })

    test("500 quando o repositório falha", async () => {
        jest.spyOn(UsuarioRepository.prototype, "Read").mockRejectedValue(new Error("falha no banco"))

        const res = await request(app).get("/usuarios")

        expect(res.status).toBe(500)
        expect(res.body.msg).toBe("Erro interno do servidor")
    })
})

describe("GET /usuarios/:id", () => {
    test("200 quando o usuário existe", async () => {
        const findBy = jest.spyOn(UsuarioRepository.prototype, "FindBy").mockResolvedValue([
            new UsuarioEntity(1, "Ryan", "ryan@email.com", "123456")
        ])

        const res = await request(app).get("/usuarios/1")

        expect(res.status).toBe(200)
        expect(res.body[0].usu_id).toBe(1)
        expect(findBy.mock.calls[0][0]).toBe("1")
    })

    test("404 quando o usuário não existe", async () => {
        jest.spyOn(UsuarioRepository.prototype, "FindBy").mockResolvedValue([])

        const res = await request(app).get("/usuarios/99")

        expect(res.status).toBe(404)
        expect(res.body.msg).toBe("Usuário não encontrado")
    })

    test("400 com ID inválido e não consulta o banco", async () => {
        const findBy = jest.spyOn(UsuarioRepository.prototype, "FindBy")

        const res = await request(app).get("/usuarios/0")

        expect(res.status).toBe(400)
        expect(res.body.msg).toBe("ID inválido")
        expect(findBy).not.toHaveBeenCalled()
    })

    test("500 quando o repositório falha", async () => {
        jest.spyOn(UsuarioRepository.prototype, "FindBy").mockRejectedValue(new Error("falha no banco"))

        const res = await request(app).get("/usuarios/1")

        expect(res.status).toBe(500)
    })
})

describe("POST /usuarios", () => {
    test("201 com dados válidos", async () => {
        const create = jest.spyOn(UsuarioRepository.prototype, "Create").mockResolvedValue(1)

        const res = await request(app).post("/usuarios").send(usuarioValido)

        expect(res.status).toBe(201)
        expect(res.body.msg).toBe("Usuário criado com sucesso")
        const entity = create.mock.calls[0][0]
        expect(entity.usu_nome).toBe("Ryan")
        expect(entity.usu_email).toBe("ryan@email.com")
    })

    test("400 com corpo vazio e lista os três erros", async () => {
        const create = jest.spyOn(UsuarioRepository.prototype, "Create")

        const res = await request(app).post("/usuarios").send({})

        expect(res.status).toBe(400)
        expect(res.body.msg).toHaveLength(3)
        expect(create).not.toHaveBeenCalled()
    })

    test("400 com e-mail sem @", async () => {
        const res = await request(app).post("/usuarios").send({ ...usuarioValido, usu_email: "ryanemail.com" })

        expect(res.status).toBe(400)
        expect(res.body.msg).toEqual(["O e-mail do usuário é obrigatório.\n"])
    })

    test("400 quando o repositório não insere", async () => {
        jest.spyOn(UsuarioRepository.prototype, "Create").mockResolvedValue(false)

        const res = await request(app).post("/usuarios").send(usuarioValido)

        expect(res.status).toBe(400)
        expect(res.body.msg).toBe("Erro ao criar usuário")
    })

    test("500 quando o repositório falha", async () => {
        jest.spyOn(UsuarioRepository.prototype, "Create").mockRejectedValue(new Error("falha no banco"))

        const res = await request(app).post("/usuarios").send(usuarioValido)

        expect(res.status).toBe(500)
    })
})

describe("PUT /usuarios/:id", () => {
    test("200 com dados válidos", async () => {
        const update = jest.spyOn(UsuarioRepository.prototype, "Update").mockResolvedValue(true)

        const res = await request(app).put("/usuarios/1").send(usuarioValido)

        expect(res.status).toBe(200)
        expect(res.body.msg).toBe("Usuário atualizado com sucesso")
        expect(update.mock.calls[0][0].usu_id).toBe("1")
    })

    test("400 com ID inválido", async () => {
        const update = jest.spyOn(UsuarioRepository.prototype, "Update")

        const res = await request(app).put("/usuarios/0").send(usuarioValido)

        expect(res.status).toBe(400)
        expect(res.body.msg).toBe("ID inválido")
        expect(update).not.toHaveBeenCalled()
    })

    test("400 com dados inválidos", async () => {
        const update = jest.spyOn(UsuarioRepository.prototype, "Update")

        const res = await request(app).put("/usuarios/1").send({ ...usuarioValido, usu_nome: "  " })

        expect(res.status).toBe(400)
        expect(res.body.msg).toEqual(["O nome do usuário é obrigatório.\n"])
        expect(update).not.toHaveBeenCalled()
    })

    test("400 quando o repositório não atualiza", async () => {
        jest.spyOn(UsuarioRepository.prototype, "Update").mockResolvedValue(false)

        const res = await request(app).put("/usuarios/99").send(usuarioValido)

        expect(res.status).toBe(400)
        expect(res.body.msg).toBe("Erro ao atualizar usuário")
    })

    test("500 quando o repositório falha", async () => {
        jest.spyOn(UsuarioRepository.prototype, "Update").mockRejectedValue(new Error("falha no banco"))

        const res = await request(app).put("/usuarios/1").send(usuarioValido)

        expect(res.status).toBe(500)
    })
})

describe("DELETE /usuarios/:id", () => {
    test("200 quando remove", async () => {
        const del = jest.spyOn(UsuarioRepository.prototype, "Delete").mockResolvedValue(true)

        const res = await request(app).delete("/usuarios/1")

        expect(res.status).toBe(200)
        expect(res.body.msg).toBe("Usuário deletado com sucesso")
        expect(del.mock.calls[0][0]).toBe("1")
    })

    test("400 com ID inválido", async () => {
        const del = jest.spyOn(UsuarioRepository.prototype, "Delete")

        const res = await request(app).delete("/usuarios/abc")

        expect(res.status).toBe(400)
        expect(res.body.msg).toBe("ID inválido")
        expect(del).not.toHaveBeenCalled()
    })

    test("400 quando o repositório não remove", async () => {
        jest.spyOn(UsuarioRepository.prototype, "Delete").mockResolvedValue(false)

        const res = await request(app).delete("/usuarios/99")

        expect(res.status).toBe(400)
        expect(res.body.msg).toBe("Erro ao deletar usuário")
    })

    test("500 quando o repositório falha", async () => {
        jest.spyOn(UsuarioRepository.prototype, "Delete").mockRejectedValue(new Error("falha no banco"))

        const res = await request(app).delete("/usuarios/1")

        expect(res.status).toBe(500)
    })
})
