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
    let plantilla=`<div class="mt-3 w-75 mx-auto">
    <h1 class="text-center">Lista de productos guardados</h1>
  
    <table class="table table-dark mt-3 ">
      <tr>
        <th scope="col">Título</th>
        <th scope="col">Precio</th>
        <th scope="col">Miniatura</th>
      </tr>
      {{#if productos.length}}
      {{#each productos}}
      <tr>
        <td>{{this.title}}</td>
        <td>{{this.price}}</td>
        <td><img height="72px" width="72px" src={{this.thumbnail}} /></td>
      </tr>
      {{/each}}
      {{/if}}
      {{#unless productos.length}}
      <tr>
        <td>No hay productos guardados</td>
        <td>No hay productos guardados</td>
        <td>No hay productos guardados</td>
      </tr>
      {{/unless}}
    </table>`;
    let productos = data
    let template = Handlebars.compile(plantilla);
    document.getElementById("contenidoTabla").innerHTML =template({productos});
}
)





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



    
//plantilla login
const plantillaLogin= async()=>{
    const response = await fetch("/api/sessions/current")
    const usuario = await response.json()
    const plantilla = `{{#if usuario.usuario}}
    <div class="container pt-4">
    <h4>Bienvenido: {{usuario.usuario.name}}</h4>
    <button onclick=desloguear() class="btn btn-danger" >Desloguear</button>
    </div>
    {{/if}}`;
    const template = Handlebars.compile(plantilla);
    document.getElementById("login").innerHTML = template({usuario});

    }

plantillaLogin()

const desloguear= async()=>{
    const response = await fetch("/api/sessions/current")
    const usuario = await response.json()

    document.getElementById("login").innerHTML = `<h3 class="text-danger text-center">Hasta Luego ${usuario.usuario.name}!</h3>`;
    const responselogout= await fetch("/api/sessions/logout")
    const logout= await responselogout.json()
 
    plantillaLogin
    setTimeout(()=>{ location.reload(); }, 2000);

    }







email.value=localStorage.getItem("email");
nombre.value=localStorage.getItem("nombre");
apellido.value=localStorage.getItem("apellido");
edad.value=localStorage.getItem("edad");
alias.value=localStorage.getItem("alias");
avatar.value=localStorage.getItem("avatar");