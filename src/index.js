const API =require('./api');
const express = require('express');
const {Router} = express;
const router = Router();
const app = express();
const path = require('path');
const handlebars =require('express-handlebars');
const faker=require('faker');
const { schema, normalize, denormalize } = require('normalizr');

const fs = require('fs');
const pathchat=(path.join(__dirname,'../public/chat-data/messages.json'));


const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


let api= new API();

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
      const response = api.getAll();
    
      if (!response) res.send({ error: productNotFound });
    
      res.render("productos", { productos: response });
    }); 
    
    router.post("/", (req, res) => {
      const { title, price, thumbnail } = req.body;
      api.add({ title, price, thumbnail });
      res.redirect("/");
    });

    //generar 5 productos con faker en la ruta  /api/productos-test
    router.get("/api/productos-test", (req, res) => { 
      faker.locale="es";
      for (let i = 0; i < 5; i++) {
        api.add({
          title: faker.commerce.productName(),
          price: faker.commerce.price(),
          thumbnail: faker.image.image(),
        });
      }
      
      res.redirect("/");
    });

// socket.io
const mensajesArray = [{
   id:"mensajes",
    mensajes:[]
  }];

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

   socket.emit("productosServ", api.productos);


  socket.on("add-product", (data) => {
    api.add(data);
    io.sockets.emit("productosServ", api.productos);
  });
  

  socket.on('mensaje', message => {
    //asigno una id a cada mensaje
    message.id=mensajesArray[0].mensajes.length+1; 
    mensajesArray[0].mensajes.push(message); 
   
    fs.writeFileSync(pathchat,JSON.stringify(mensajesArray,null,2)+"\n");
    // io.sockets.emit("nuevoMsj",mensajesArray);

// normalizr
const autor = new schema.Entity('autor');
const mensajes = new schema.Entity('mensajes', {
  autor: autor
});
const chat= new schema.Entity('chat', {
  mensajes: [mensajes]
});

const chatnormalizado = normalize(mensajesArray, [chat]);
console.log(chatnormalizado);
const pathchatNormalizado=(path.join(__dirname,'../public/chat-data/chatNormalizado.json'));

fs.writeFileSync(pathchatNormalizado, JSON.stringify(chatnormalizado, null, '\t'));

// denormalizar
const chatdenormalizado = denormalize(chatnormalizado.result, [chat], chatnormalizado.entities);

io.sockets.emit("nuevoMsj",chatdenormalizado);

 
});

if(fs.existsSync(pathchat)){
  fs.readFile(pathchat,(err,data)=>{
    if(err) throw err;
    let mensajes = JSON.parse(data);
    io.sockets.emit("nuevoMsj",mensajes);
    });





  
}


});


