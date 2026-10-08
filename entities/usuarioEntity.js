import IEntity from "./IEntity.js"

export default class UsuarioEntity extends IEntity{
    #usu_id
    #usu_nome
    #usu_email
    #usu_senha

    constructor(usu_id, usu_nome, usu_email, usu_senha){
        super()
        this.#usu_id = usu_id
        this.#usu_nome = usu_nome
        this.#usu_email = usu_email
        this.#usu_senha = usu_senha
    }

    get usu_id(){ return this.#usu_id }
    get usu_nome(){ return this.#usu_nome }
    get usu_email(){ return this.#usu_email }
    get usu_senha(){ return this.#usu_senha }

    set usu_id(usu_id){ this.#usu_id = usu_id }
    set usu_nome(usu_nome){ this.#usu_nome = usu_nome }
    set usu_email(usu_email){ this.#usu_email = usu_email }
    set usu_senha(usu_senha){ this.#usu_senha = usu_senha }

    static Map(row){
        return new UsuarioEntity(
            row["usu_id"],
            row["usu_nome"],
            row["usu_email"],
            row["usu_senha"]
        )
    }

    Validacao(){
        let errors = []
        if((this.#usu_nome ?? "").trim() === "")
            errors.push("O nome do usuário é obrigatório.\n")
        if((this.#usu_email ?? "").trim() === "" || !this.#usu_email.includes("@"))
            errors.push("O e-mail do usuário é obrigatório.\n")
        if((this.#usu_senha ?? "").trim() === "")
            errors.push("A senha do usuário é obrigatória.\n")

        return errors.length > 0 ? errors : null
    }
}