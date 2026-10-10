

export default class Sala {
    #id;
    #nome;
    #usuarioId;

    constructor(id, nome, usuarioId) {
        this.#id = id;
        this.#nome = nome;
        this.#usuarioId = usuarioId;
    }

    get id() {
        return this.#id;
    }

    set id(id) {
        this.#id = id;
    }

    get nome() {
        return this.#nome;
    }

    set nome(nome) {
        this.#nome = nome;
    }

    get usuarioId() {
        return this.#usuarioId;
    }

    set usuarioId(usuarioId) {
        this.#usuarioId = usuarioId;
    }

    validar() {
        if (!this.#nome || this.#nome.trim() === "") {
            throw new Error("O nome da sala é obrigatório.");
        }

        return true;
    }

    toJSON() {
        return { id: this.#id, nome: this.#nome, usuarioId: this.#usuarioId };
    }

    static toMap(row) {
        return new Sala(row.sal_id, row.sal_nome, row.usu_id);
    }
}