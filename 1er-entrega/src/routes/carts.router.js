import fs from 'fs';
import express from 'express';
const router = express.Router();
router.use( express.json() );
router.use( express.urlencoded( { extended: true } ) );

import CartManager from '../class/CartManager.js';

const cartManager = new CartManager('./carrito.json');

let cartIdCounter = 1;


// Tutor habia entendi mal el proceso, se ve.
// aca creo un carrito y le designo los productos
// pasando los valores en el body
// POST -> http://localhost:8080/api/carts
// { 
//     "products":[{
//     "id-p": 15,
//     "quantity":4
//     },
//     {
//     "id-p": 10,
//     "quantity":5
//     }]
//   }

router.post( "/", ( req, res ) => {      
    
    try {           
        const { products } = req.body;

        // aca pude resolver lo del id incremental
        const cartId = cartManager.generateIdCart();

        const createCart = {
            id: cartId,
            products: products
        };        

        let carrito = [];

        try {
            carrito = cartManager.getCart();
        } catch (error) {
            cartManager.saveCartEmpty()              
        }

        console.log(createCart )

        const idExistente = carrito.find(item => item.id === createCart.id);

        if(!idExistente) {
            carrito.push(createCart); 
            cartManager.saveCart(carrito);
            res.status(200).json(carrito);  
        } else {
            res.status(500).json({error: "El producto ya existe en el carrito."});
        }             

        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al crear el carrito"});
        
    } 
})



router.get( "/:cid", ( req, res ) => {
    
    const cartId = parseInt(req.params.cid); 

   

    try {        
        const cart = cartManager.getCartId(cartId); 
        res.send({ cart });
    } catch (error) {
        res.status(404).send({ status: "error", error: "Carrito no encontrado" }); 
    }

})

router.post( "/:cid/product/:pid", ( req, res ) => {

    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    let carrito = [];

    try {
        carrito = cartManager.getCart();         
    } catch (error) {
        cartManager.saveCartEmpty()              
    }   

    const carritoFiltrado = carrito.find(cart => cart.id === cartId);

    const productoEncontrado = carritoFiltrado.products.find(producto => producto['id-p'] === productId);

    

     if (!carritoFiltrado) {
        return 'Error no existe el carrito';
      }     

    if (productoEncontrado) {
        const quantity = productoEncontrado.quantity;
        productoEncontrado.quantity += 1;
      } else {
        const productToAdd = {
          "id-p": productId,
          quantity: 1
        };
        carritoFiltrado.products.push(productToAdd);
      }
      

      cartManager.saveCart(carrito);

    
})

export default router;