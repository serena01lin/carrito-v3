//Seleccionamos los elementos del Dom que vamos a usar en JS
const template = document.querySelector('#template');
const cart = document.querySelector('#cart');
const footer = document.querySelector('#footer');
const templateFooter = document.querySelector('#templateFooter');
const fragment = document.createDocumentFragment();

let cartArray = []; //creamos el carrito donde vamos a agregar los productos 


document.addEventListener('click', (e) => { //le damos el evento 'click' a todo el documento
    //delegamos eventos a los botones, utilizamos un if para identificar cada boton (y el dataset) //delegacion de eventos
    if (e.target.dataset.fruit === 'Sandía🍉') {
        addToCart(e) //ejecutamos una funcion para que se agregue al carrito
    }
    if (e.target.dataset.fruit === 'Melón🍈') {
        addToCart(e)
    }
    if (e.target.dataset.fruit === 'Pera🍐') {
        addToCart(e)
    }
    if (e.target.matches('.list-group-item div .btn-outline-success')) { //cuando encuentre el boton agregar quiero que ejecute la funcion de btnAdd()
        btnAdd(e)
    }
    if (e.target.matches('.list-group-item div .btn-outline-danger')) {//cuando encuentre el boton quitar quiero que ejecute la funcion de btnRemove()
        btnRemove(e)
    }
        
});

const btnAdd = (e) => { //creamos la funcion cuando le hagamos click al boton de agregar 
    cartArray = cartArray.map((item) => { //iteramos el cartArray con map() porque queemos aumantar la cantidad (sobreescribimos cartArray por eso ahora es let y no const)
        if (e.target.dataset.id === item.id) { //detectamos si el boton de agregar hace referencia al producto que le estamos dando click (dataset.id)
            item.amount++;
        }
        return item; //el map tiene que retornar algo
    });

    showCart(); //mostramos los cambios
};

const btnRemove = (e) => {
    cartArray = cartArray.filter((item) => { //para quitar elementos de un array usamos filter()
        if(e.target.dataset.id === item.id) {//detectamos si el boton de agregar hace referencia al producto que le estamos dando click (dataset.id)
            if (item.amount>0){ //solo disminuimos si la cantidad es mayor a 0
            item.amount--;
            if (item.amount === 0) return; // tenemos que eliminar el producto del DOM, lo retornamos sin elemento
                return item;
            }
        } else {
            return item;
        };
    });
    showCart(); //mostramos en el carrito esos cambios
};

const addToCart = (e) => { //creamos la funcion para que los productos se agreguen al carrito
    const product = { //creamos un objeto
        title: e.target.dataset.fruit,
        id: e.target.dataset.fruit,
        amount: 1,
        price: parseInt(e.target.dataset.price), //devolvia un string, por eso lo pasamos a numero con la funcion parseInt()
    };
    
    const position = cartArray.findIndex((item) => item.title === product.title); //con findIndex() detectamos si existe el producto dentro del carrito, el cual nos devuelve el indice, en caso de que no exista el elemento en el array, devuelve -1

    if (position === -1){ //no existe dentro del array (-1)
        cartArray.push(product) //lo agregamos con la funcion push()
    } else {
        cartArray[position].amount++; //ya existe, le agregamos 1 a la cantidad que ya habia
    };

    showCart(); //ejecutamos la funcion de mostrar en pantalla el carrito
};

const showCart = () => { //declaramos la funcion en la cual se va a mostrar el carrito de compras

    cart.textContent = ''; //para evitar el error de forEach() (repeticion) hacemos que cada vez que se ejecute empiece sin nada

    cartArray.forEach((item) => { //recorremos el carrito con forEach()
        const clone = template.content.cloneNode(true); //clonamos el template

        clone.querySelector('.list-group-item .lead').textContent = item.title;
        clone.querySelector('.badge').textContent = item.amount;
        clone.querySelector('.lead span').textContent = item.price * item.amount; //sumamos el precio por cada vez que se agregue el producto al carrito, por eso multiplicamos price * amount

        clone.querySelector('.btn-outline-success').dataset.id = item.id; //agregamos los dataset de los botones agregar y quitar de manera dinamica
        clone.querySelector('.btn-outline-danger').dataset.id= item.id;

        fragment.appendChild(clone); //agregamos el template al fragment, para evitar reflog
    });

    cart.appendChild(fragment); //subimos el fragment al carrito

    showFooter(); //ejecutamos la funcion de mostrar footer
};

const showFooter = () => { //declaramos la funcion de mostrar footer

    footer.textContent = ' '; //para evitar el error de forEach() (repeticion) hacemos que cada vez que se ejecute empiece sin nada

    const total = cartArray.reduce((acc, current) => { //sumamos los productos con el metodo reduce()
        return acc+current.amount * current.price; //accedemos a la cantidad y lo multiplicamos por el precio
    }, 0); //le damos un tercer parametro (0) para que lo que nos devuelva sea un numero.
    
    const clone = templateFooter.content.cloneNode(true); //clonamos el template del footer
    clone.querySelector('.lead span').textContent = total;
    
    footer.appendChild(clone); //colocamos dentro del footer lo que clonamos
};

