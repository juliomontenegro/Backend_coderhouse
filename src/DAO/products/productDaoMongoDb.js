import{containerMongoDb}from'../../api/containerMongoDb.js';
import{productSchema}from'../../models/productModels.js';

class productDaoMongoDb extends containerMongoDb{
    constructor(){
        super('productos',productSchema);
    }
    }
export {productDaoMongoDb};