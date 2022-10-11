import {debugLogger } from './utils.js';

class api {

    productos = [];
    
 //add product
    add(producto) {
         this.productos.push(producto);
         debugLogger.info(`add product: ${producto.title}`);
      }
 
 //assigning an id to a product.
 
     getId() {
         return this.productos.length > 0 ? this.productos[this.productos.length - 1].id + 1 : 1;
     }
 
 // find product by id
     getById(id) {
         const producto = this.productos.find(producto => producto.id === id);
         if (!producto) {
            debugLogger.error(`Product not found id: ${id}`);
             throw new Error('Product not found');
         }
         return producto;
     }
 
 // getall products
     getAll() {
         return this.productos;
     }
 // update product by id
     update(id, producto) {
         const index = this.productos.findIndex(producto => producto.id === id);
 
         if(!index){
            debugLogger.error(`Update Product not found id: ${id}`);
             throw new Error('Update Product not found');
         }
             this.productos[index] = producto
             this.productos[index].id = id;
     }
 
 //delete product by id
     delete(id) {
         if(!this.getById(id)){
            debugLogger.error(`failed to delete product with id: ${id}`);
             throw new Error('failed to delete product');
         }
         this.productos.splice(this.productos.findIndex(producto => producto.id === id),1);
     }
 
 }

 export default api;