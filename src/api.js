class api {

    productos = [];
    
 //    agregar un producto
    add(producto) {
         this.productos.push(producto);
      }
 
 // asignar una id a un producto.
 
     getId() {
         return this.productos.length > 0 ? this.productos[this.productos.length - 1].id + 1 : 1;
     }
 
 // buscar en el array un producto por su id devolver error en caso que no exista.
     getById(id) {
         const producto = this.productos.find(producto => producto.id === id);
         if (!producto) {
             throw new Error('Producto no encontrado');
         }
         return producto;
     }
 
 // Obtener todos los productos
     getAll() {
         return this.productos;
     }
 // update de un producto segun su id
     update(id, producto) {
         const index = this.productos.findIndex(producto => producto.id === id);
 
         if(!index){
             throw new Error('Producto no encontrado');
         }
             this.productos[index] = producto
             this.productos[index].id = id;
     }
 
 // eliminar un producto del array segun su id
     delete(id) {
         if(!this.getById(id)){
             throw new Error('Producto no encontrado');
         }
         this.productos.splice(this.productos.findIndex(producto => producto.id === id),1);
     }
 
 }

 export default api;