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
let botonMensaje = document.getElementById("botonMensaje");


botonMensaje.addEventListener("click", function(){
localStorage.setItem("email", email.value);
    socket.emit("mensaje", {
        "email": email.value,
        "mensaje": mensaje.value,
        "fecha": moment().format("DD/MM/YYYY HH:mm:ss")
    });
   mensaje.value="";



}


);

socket.on("nuevoMsj", (data) => {
    let mensajesHtml = data
    .map((mensaje) => `<p><b class="text-primary">${mensaje.email}: </b><span>[${mensaje.fecha}]</span><i class="text-success">${mensaje.mensaje}</i></p>`)
    .join("");

  document.getElementById("mjsEnviados").innerHTML = mensajesHtml;

//   el scroll de mensajes se mueve al final

 document.getElementById("mjsEnviados").scrollTop = document.getElementById("mjsEnviados").scrollHeight;

}
);

email.value=localStorage.getItem("email");
