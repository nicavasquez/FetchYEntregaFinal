class Cliente {
    constructor (nombre, numero, direccion){
        this.nombre = nombre;
        this.numero = numero;
        this.direccion = direccion;
    }
}

let boton = document.querySelector("#Enviar");
boton.addEventListener("click", agregarCliente);

// agregado datos de cliente - mostrar datos del cliente y compra realizada al confirmar la compra

function agregarCliente(){
    let nombre = document.querySelector("#nombre").value;
    let numero = document.querySelector("#numero").value;
    let direccion = document.querySelector("#direccion").value;
    let cliente1 = new Cliente(nombre, numero, direccion);
    console.log(cliente1);
    mostrarCliente(cliente1);
    
}

// mostrar datos del cliente y compra realizada al confirmar la compra
function mostrarCliente(cliente){
        Swal.fire({
            title: 'Confirmado',
            html: `Muchas gracias ${cliente.nombre}!! <br>
            Recibiras tu pedido en ${cliente.direccion}. <br>
            Monto final: $${total} <br>
            `,
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Confirmar",
          })

    if (cliente.nombre === "" || cliente.direccion ==="") {
        Swal.fire({
            title: 'Nombre y Direccion',
            text: 'Agrega tu nombre y direccion para recibir su compra',
            icon: 'warning',
            confirmButtonText: 'Agregar!'
        });
              
        
    } else {
    let form = document.querySelector("#items");
    form.innerHTML ="";
    let formulario = document.querySelector("#contacto");
    formulario.innerHTML=""    
    let nuevo = document.createElement("div");
    nuevo.innerHTML = `
    <h2>Muchas Gracias ${cliente.nombre}!!</h2>
    <hr>
    <h2>Recibira su pedido en ${cliente.direccion}</h2>
    <h3>Monto final abonado $${total}.</h3>
    <h2>Disfruta tu pedido !!</h2>
    `;
    nuevo.className= "saludoCliente"
    formulario.appendChild(nuevo);
        
    }
}

let productos = []


// nombro las variables 
let carrito = [];
let total = 0;
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const DOMbotonConfirmar = document.querySelector('#boton-confirmar');
const miLocalStorage = window.localStorage;


// genero las card por cada producto

function dibujarProductos() {
    fetch("./data.json")
        .then((res)=>res.json())
        .then((data)=>{
            data.forEach((producto, indice) => {
                // Estructura
                productos.push(producto) // creo un array con todos los productos
                const miNodo = document.createElement('div');
                miNodo.classList.add('card');
                miNodo.innerHTML = 
                `<div class='card-body'>
                <img class='car-img' src='${producto.imagen}'></img>
                <h5 class='card-title'> ${producto.nombre} </h5>
                <p class='card-text'> ${divisa}${producto.precio} </p>
                <button class='btn btn-info' onclick="agregarAlCarrito(${indice})"> Comprar </button>
                `
                DOMitems.appendChild(miNodo);
            });
            
})

};

dibujarProductos();
 
       
// funcion para agregar al carro - ve si existe o si es un producto nuevo
// guarda la indo del carro en localstorage
const agregarAlCarrito = (indice) => {
    Toastify({
        text: "Producto agregado a su compra",
        gravity: "bottom",
        position: "left",
        duration: "3000",        
        style: {            
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
      
    const codigoProd = carrito.findIndex((elemento)=>{
        return elemento.id === productos[indice].id;
    });
    
    Swal.fire({
        title: 'Agregado',
        text: 'Producto agregado a su compra',
        icon: 'success',
        confirmButtonText: 'Listo!'
    });
    const productoAgregar = productos[indice];
    codigoProd === -1 ? (        
        productoAgregar.cantidad = 1,
        carrito.push(productoAgregar), 
        mostrarCarrito(),
        guardarLocalStorage()
    ) : (
        carrito[codigoProd].cantidad = carrito[codigoProd].cantidad + 1,
        mostrarCarrito(),
        guardarLocalStorage()
    )
};



let valor = 0;

//me muestra todos los productos agregados al carro y calcula el total de la compra 
const mostrarCarrito = () => {
    DOMcarrito.className = "carro" ;
    DOMcarrito.innerHTML = "" ;
    if (carrito.length > 0) {
        carrito.forEach((producto,indice)=>{
            const carritoFinal = document.createElement("div");
            carritoFinal.classList.add("card-body")
            carritoFinal.innerHTML=`
            <div class="product-details">${producto.nombre}</div>
            <img class="car-img" src="${producto.imagen}"></img>
            <div class ="product-details" >Cantidad:${producto.cantidad}</div>
            <div class ="product-details" >Precio: $ ${producto.precio}</div>
            <div class ="product-details" > Subtotal: $ ${producto.precio * producto.cantidad}</div>
            <button type="button" class ="btn btn-danger"  id="eliminar" onclick="eliminar(${indice})">Eliminar Producto</button>`;
            DOMcarrito.appendChild(carritoFinal);
            total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0 );
            
        
            }
            
        );
        
        
    }
    DOMtotal.classList.add("total-carrito-fin");
    DOMtotal.innerHTML=`
    <div class ="product-details" > Total: $ ${total}</div>
    `     
}


// funcion para eliminar un producto del carro
const eliminar = (idProd) => {
  const item = carrito.find((prod) => prod.id === idProd);
  const indice = carrito.indexOf(item);
  Swal.fire({
    title: "Deseas eliminar este producto del carro?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Borrar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
        Swal.fire({
            title: 'Eliminado!',
            icon: 'success',
            text: 'El producto ha sido eliminado del carro.'
        })
      carrito.splice(indice, 1);
      mostrarCarrito();
      guardarLocalStorage();
      
    }
  });
};


// funcion para vaciar el carro
DOMbotonVaciar.addEventListener("click", vaciar)
function vaciar() {
    
    Swal.fire({
        title: "Deseas vaciar el carro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Vaciar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Vaciado!',
                icon: 'success',
                text: 'Todos los productos han sido eliminados del carro.'
            })
          carrito = [];
          mostrarCarrito();
          guardarLocalStorage();
          total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0 );
        DOMtotal.classList.add("total-carrito-fin");
        DOMtotal.innerHTML=`
        <div class ="product-details" > Total: $ ${total}</div>
        ` 
        
        }
      });
      
      

    mostrarCarrito();
    localStorage.clear();

}


// boton de confirmar compra, usa funcion de agregar cliente
DOMbotonConfirmar.addEventListener("click", agregarCliente);

// funcion de guardar los productos del carro en el localstorage
function guardarLocalStorage(){
    miLocalStorage.setItem("carrito", JSON.stringify(carrito));

}

// funcion para que el carro tenga la info guardada en localstorage
function cargarCarritoDeLocalStorage(){
    miLocalStorage.getItem("carrito") !== null ? (
        carrito = JSON.parse(miLocalStorage.getItem("carrito")), 
        mostrarCarrito()
    ) : (
        alert ("El carrito del Local Storage esta vacío.")       

    )
}

cargarCarritoDeLocalStorage();




// establezco un alert asincronico que me va diciendo el monto gastado
let repetirTotal;
let contador = 0;


// creo una funcion que me muestre cuanto voy gastando cada 10 segundos por 4 veces y se corta diciendo que no se mostrara mas
function repetirTotalCada10000() {    
    repetirTotal = setInterval(mandarMensaje, 10000);    
}

function mandarMensaje() {
    let promesa = new Promise ((resolve,reject)=>{
        if (contador > 3) {
            clearInterval(repetirTotal);
            Swal.fire({
                title: 'FINALIZAR MUESTRA DE TOTAL',
                icon: 'success',
                text: `El mensaje del gasto total no se mostrara más.`
                })
        } else {
            Swal.fire({
            title: 'TOTAL',
            icon: 'success',
            text: `Esto es lo que llevas gastado $${total}.`
            })
            contador = contador + 1 ;
        }
    })    
}
repetirTotalCada10000();

// creo un mensaje que se exporta desde una URL externa y se mostrara despues de 20 segundos de navegar dentro de la pagina
fetch ('https://jsonplaceholder.typicode.com/posts')
    .then((response)=> response.json())
    .then((json)=> {
        setTimeout(() => {
            Swal.fire({
                title: `Te recomendamos que pruebes:
                ${(json[0].title).toUpperCase()}`,
                icon: 'success',
                text: `Descripción: 
                ${(json[0].body).charAt(0).toUpperCase() + (json[0].body).slice(1)}`
                })
        }, 25000)
    })
    