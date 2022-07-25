const path=require('path');
const dbPath=path.resolve(__dirname,'../src/db/ecommerce.sqlite');


// console.log(dbPath);

const knexsqlite=require('knex')({
    client: 'sqlite3',
    connection: {
        filename:dbPath,
    },
    useNullAsDefault: true,
})
module.exports=knexsqlite;
