
const knex  = require('../options/mariaDB'); // importar knex

class sqlproductos {
    constructor() {
        this.knex = knex;
    }
    createTableProd() {
        knex.schema.hasTable('productos').then(exists => {
            if (!exists) {
                knex.schema.createTable('productos', table => {
                    table.increments('id').primary();
                    table.string('title');
                    table.integer('price');
                    table.string('thumbnail');
                }).then(() => {
                    console.log('tabla productos creada');
                }).catch(error => {
                    console.error(error);
                });
            }
        }).catch(error => {
            console.error(error);
        })
    }


    async add(product) {
        try {
            await this.knex('productos').insert(product);
        }
        catch (error) {
            console.error(`No se pudo agregar el producto ${error}`);
        }
    }
    
    async getById(id) {
        try {
            return await this.knex('productos').where('id', id).first();
        }
        catch (error) {
            console.error(`No se pudo obtener el producto ${error}`);
        }}

    async getAll() {
      // mostrar todos los productos de la base de datos
      try {
       let rows= await this.knex.from('productos').select('*');
       return rows;
        
        }
        catch (error) {
            console.error(`No se pudo obtener los productos ${error}`);
        }
    }

 

    async update(id, product) {
        try {
            await this.knex('productos').where('id', id).update(product);
        }
        catch (error) {
            console.error(`No se pudo actualizar el producto ${error}`);
        }}

    async delete(id) {
        try {
            await this.knex('productos').where('id', id).del();
        }
        catch (error) {
            console.error(`No se pudo eliminar el producto ${error}`);
        }}

      



    }

    module.exports = sqlproductos;