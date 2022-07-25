const knexsqlite = require('../options/sqlite.js');

class sqlmensajes {
    constructor() {
        this.knexsqlite = knexsqlite;
    }

    createTable() {
        knexsqlite.schema.hasTable('mensajes').then(exists => {
            if (!exists) {
                knexsqlite.schema.createTable('mensajes', table => {
                    table.increments('id').primary();
                    table.string('email');
                    table.string('mensaje');
                    table.timestamp('fecha');

                }).then(() => {
                    console.log('tabla mensajes creada');
                }).catch(error => {
                    console.error(error);
                });
            }
        }).catch(error => {
            console.error(error);
        })
    }


    async add(mensaje) {
        try {
            await this.knexsqlite('mensajes').insert(mensaje);
        }
        catch (error) {
            console.error(`No se pudo agregar el mensaje ${error}`);
        }
    }
    async getAll() {
        try {
            let rows = await this.knexsqlite.from('mensajes').select('*');
            return rows;
        }
        catch (error) {
            console.error(`No se pudo obtener los mensajes ${error}`);
        }
    }


}
module.exports = sqlmensajes;