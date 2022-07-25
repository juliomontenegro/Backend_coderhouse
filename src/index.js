const SQLPRODUCTOS =require('./sqlproductos');
const SQLMENSAJES=require('./sqlmensajes');
const express = require('express');
const {Router} = express;
const router = Router();
const app = express();
const path = require('path');
const handlebars =require('express-handlebars');


// const fs = require('fs');

 
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
 

let sqlproductos= new SQLPRODUCTOS();
let sqlmensajes= new SQLMENSAJES();

const PORT=8080;

// app.listen(PORT, () => {console.log(`Servidor corriendo en el puerto ${PORT}`)});
const server = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', './public')))
app.use('/productos', router);





app.engine(
      "hbs", handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
      })
    );

app.set('view engine', 'hbs');
app.set('views', '../views');



app.get('/', (req, res) => {
   res.render("productos");
   });




   router.get("/", (req, res) => {
   
      sqlproductos.getAll().then(productos => {
        res.render("productos", { productos });
      }
      ).catch(error => {
        console.error(error);
      });

    
    });

    
    router.post("/", (req, res) => {
    
    
      const { title, price, thumbnail } = req.body;
     
       
      sqlproductos.add({ title, price, thumbnail });
      res.redirect("/");
    });


//crear tablas
sqlmensajes.createTable();
sqlproductos.createTableProd();


// socket.io
const mensajesArray = [];

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  //  socket.emit("productosServ", api.productos);
  // con socket emit traer todos los productos de la base de datos
  sqlproductos.getAll().then(productos => {
    socket.emit("productosServ", productos);
  }
  ).catch(error => {
    console.error(error);
  }
  );



  socket.on("add-product", (data) => {
    sqlproductos.add(data);
    io.sockets.emit("productosServ", sqlproductos.productos);
  });
  

  socket.on('mensaje', message => {

  mensajesArray.push(message)
 
// fs.writeFileSync(pathchat,JSON.stringify(mensajesArray,null,2)+"\n");
// guardar mensajes en la base de datos con sqlite3
sqlmensajes.add(mensajesArray);

io.sockets.emit("nuevoMsj",mensajesArray);
});

if(mensajesArray.length>0){
  // fs.readFile(pathchat,(err,data)=>{
  //   if(err) throw err;
  //   let mensajes = JSON.parse(data);
  //   io.sockets.emit("nuevoMsj",mensajes);
  //   });
  sqlmensajes.getAll().then(mensajes => {
    io.sockets.emit("nuevoMsj",mensajes);
  }
  ).catch(error => {
    console.error(error);
  });
}

});
  

