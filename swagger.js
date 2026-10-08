const mensagem = (exemplo) => ({
    type: "object",
    properties: { msg: { type: "string", example: exemplo } }
})

const resposta = (descricao, exemplo) => ({
    description: descricao,
    content: { "application/json": { schema: mensagem(exemplo) } }
})

const parametroId = {
    name: "id",
    in: "path",
    required: true,
    description: "ID do usuário",
    schema: { type: "integer", minimum: 1 }
}

const erroInterno = resposta("Erro interno", "Erro interno do servidor")

export default {
    openapi: "3.0.3",
    info: {
        title: "Black Jack API",
        version: "1.0.0",
        description: "API do jogo de Black Jack"
    },
    servers: [{ url: "http://localhost:5000" }],
    tags: [{ name: "Usuários", description: "Cadastro e manutenção de usuários" }],
    components: {
        schemas: {
            Usuario: {
                type: "object",
                properties: {
                    usu_id: { type: "integer", example: 1 },
                    usu_nome: { type: "string", example: "Ryan" },
                    usu_email: { type: "string", example: "ryan@email.com" },
                    usu_senha: { type: "string", example: "123456" }
                }
            },
            UsuarioInput: {
                type: "object",
                required: ["usu_nome", "usu_email", "usu_senha"],
                properties: {
                    usu_nome: { type: "string", example: "Ryan" },
                    usu_email: { type: "string", example: "ryan@email.com" },
                    usu_senha: { type: "string", example: "123456" }
                }
            },
            ErroValidacao: {
                type: "object",
                properties: {
                    msg: {
                        type: "array",
                        items: { type: "string" },
                        example: ["O nome do usuário é obrigatório.\n"]
                    }
                }
            }
        }
    },
    paths: {
        "/usuarios": {
            get: {
                tags: ["Usuários"],
                summary: "Lista todos os usuários",
                responses: {
                    200: {
                        description: "Lista de usuários",
                        content: {
                            "application/json": {
                                schema: { type: "array", items: { $ref: "#/components/schemas/Usuario" } }
                            }
                        }
                    },
                    500: erroInterno
                }
            },
            post: {
                tags: ["Usuários"],
                summary: "Cadastra um usuário",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioInput" } } }
                },
                responses: {
                    201: resposta("Usuário criado", "Usuário criado com sucesso"),
                    400: {
                        description: "Dados inválidos ou erro ao criar",
                        content: { "application/json": { schema: { $ref: "#/components/schemas/ErroValidacao" } } }
                    },
                    500: erroInterno
                }
            }
        },
        "/usuarios/{id}": {
            get: {
                tags: ["Usuários"],
                summary: "Busca um usuário pelo ID",
                parameters: [parametroId],
                responses: {
                    200: {
                        description: "Usuário encontrado",
                        content: {
                            "application/json": {
                                schema: { type: "array", items: { $ref: "#/components/schemas/Usuario" } }
                            }
                        }
                    },
                    400: resposta("ID inválido", "ID inválido"),
                    404: resposta("Usuário não encontrado", "Usuário não encontrado"),
                    500: erroInterno
                }
            },
            put: {
                tags: ["Usuários"],
                summary: "Atualiza um usuário",
                parameters: [parametroId],
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioInput" } } }
                },
                responses: {
                    200: resposta("Usuário atualizado", "Usuário atualizado com sucesso"),
                    400: {
                        description: "ID inválido, dados inválidos ou erro ao atualizar",
                        content: { "application/json": { schema: { $ref: "#/components/schemas/ErroValidacao" } } }
                    },
                    500: erroInterno
                }
            },
            delete: {
                tags: ["Usuários"],
                summary: "Remove um usuário",
                parameters: [parametroId],
                responses: {
                    200: resposta("Usuário removido", "Usuário deletado com sucesso"),
                    400: resposta("ID inválido ou erro ao deletar", "ID inválido"),
                    500: erroInterno
                }
            }
        }
    }
}
