import express from 'express';
import { Router } from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewRoutes from './routes/viewRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import initializePassport from './config/passport.js';
import passport from 'passport';
import dotenv from 'dotenv';
import faker from 'faker';
import {schema, normalize, denormalize  } from 'normalizr';
import fs from 'fs';
import path from 'path';
//socket io
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import API from './api.js'

const router=Router();



dotenv.config();

const app = express();
const PORT=8080;

let api= new API();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const pathchat=(path.join(__dirname,'../public/chat-data/messages.json'));


const server = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});

//conexion a mongo
mongoose.connect(`mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@${process.env.MONGO_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('Conectado a Mongo')});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'))
app.use(cookieParser());
app.use(
    session({
      store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@${process.env.MONGO_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
        mongoOptions: {useNewUrlParser: true,useUnifiedTopology: true,},
        ttl:600
      }),
      secret: 'asdafsfgdfgdfg',
      resave: false,
      saveUninitialized: false,
    }))


app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views',__dirname+ '/views');
app.use('/', viewRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/productos', router);


initializePassport();
app.use(passport.initialize());
app.use(passport.session());


//productos
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

      //logueo current
      app.get("/api/sessions/current", (req, res) => {
   
        res.send({ usuario: req.session.user });

    });
    //logout
    app.get("/api/sessions/logout", (req, res) => {
      req.session.destroy();
      res.send({ usuario: null });
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
 