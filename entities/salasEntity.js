
export default class SalasEntity{
    #sal_id
    #sal_nome
    #usu_id

    constructor(id, nome, usuId){
        this.#sal_id = id
        this.#sal_nome = nome
        this.#usu_id = usuId
    }

    get sal_id() { return this.#sal_id }
    get sal_nome() { return this.#sal_nome }
    get usu_id() { return this.#usu_id }

}