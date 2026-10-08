import UsuarioEntity from "../entities/usuarioEntity.js"

export default class UsuarioRepository{

    async Create(entity,db){
        let query = "insert into tb_usuario(usu_nome, usu_email, usu_senha) values(?,?,?)"
        let values = [entity.usu_nome, entity.usu_email, entity.usu_senha]
        let result = await db.ExecutaComandoLastInserted(query,values)
        return result > 0 ? entity.usu_id = result : false 
    }

    async FindBy(id,db){
        let query = "select * from tb_usuario where usu_id = ?"
        let rows = await db.ExecutaComando(query,[id])
        let list = []
        rows.forEach(row =>{ list.push(UsuarioEntity.Map(row[0])) })
        return list
    }

    async Read(db){
        let query = "select * from tb_usuario"
        let rows = await db.ExecutaComando(query)
        let list = []
        rows.forEach(row =>{ list.push(UsuarioEntity.Map(row)) })
        return list
    }

    async Update(entity,db){
        let query = "update tb_usuario set usu_nome = ?, usu_email = ?, usu_senha = ? where usu_id = ?"
        let values = [entity.usu_nome, entity.usu_email, entity.usu_senha, entity.usu_id]
        let result = await db.ExecutaComandoNonQuery(query,values)
        return result ? true : false
    }

    async Delete(id,db){
        let query = "delete from tb_usuario where usu_id = ?"
        let result = await db.ExecutaComandoNonQuery(query,[id])
        return result ? true :false
    }
}
