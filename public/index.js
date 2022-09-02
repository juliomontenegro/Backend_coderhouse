const socket = io.connect();

// usando socket para enviar los productos al servidor
let boton = document.getElementById("boton");
let titulo = document.getElementById("title");
let precio = document.getElementById("price");
let imagen = document.getElementById("thumbnail");





boton.addEventListener("click", function(){
    socket.emit("add-product", {
        title: titulo.value,
        price: precio.value,
        thumbnail: imagen.value
    });
  
});

socket.on("productosServ", (data) => {
fetch("./hb/form.hbs")
.then(response => response.text())
.then(plantilla => {
    let productos = data
    let template = Handlebars.compile(plantilla);
    document.getElementById("contenidoTabla").innerHTML =template({productos});
}
)
.catch(error => console.log(error,"queres plantilla? no hay plantilla"));
}
);


// Centro de Mensajes
let mensajesEnv= document.getElementById("mjsEnv");
let email = document.getElementById("email");
let mensaje = document.getElementById("texto");
let nombre=document.getElementById("nombre");
let apellido=document.getElementById("apellido");
let edad=document.getElementById("edad");
let alias=document.getElementById("alias");
let avatar=document.getElementById("avatar");
let botonMensaje = document.getElementById("botonMensaje");


botonMensaje.addEventListener("click", function(){
localStorage.setItem("email", email.value);
localStorage.setItem("nombre", nombre.value);
localStorage.setItem("apellido", apellido.value);
localStorage.setItem("edad", edad.value);
localStorage.setItem("alias", alias.value);
localStorage.setItem("avatar", avatar.value);


    socket.emit("mensaje", {
        
        "mensaje": mensaje.value,
        "fecha": moment().format("DD/MM/YYYY HH:mm:ss"),
         "autor":{
            "id": email.value,
            "nombre":nombre.value,
            "apellido":apellido.value,
            "edad":edad.value,
            "alias":alias.value,
            "avatar":avatar.value
         }
    });
   mensaje.value="";



}


);

socket.on("nuevoMsj", (data) => {
    let mensajesHtml = data[0].mensajes
    .map((mensaje) => `<p><b class="text-primary">${mensaje.autor.id}: </b><span>[${mensaje.fecha}]</span><i class="text-success">${mensaje.mensaje}</i>    <img height="40px" width="40px" src=${mensaje.autor.avatar} /></p>`)
    .join("");

  document.getElementById("mjsEnviados").innerHTML = mensajesHtml;

//   el scroll de mensajes se mueve al final

 document.getElementById("mjsEnviados").scrollTop = document.getElementById("mjsEnviados").scrollHeight;

}
);



//hacer un fetch a /api/productos-test para generar 5 productos
let botonTest = document.getElementById("botonTest");
botonTest.addEventListener("click", function(){
fetch("/productos/api/productos-test")
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => console.log(error));
}
);



email.value=localStorage.getItem("email");
nombre.value=localStorage.getItem("nombre");
apellido.value=localStorage.getItem("apellido");
edad.value=localStorage.getItem("edad");
alias.value=localStorage.getItem("alias");
avatar.value=localStorage.getItem("avatar");
