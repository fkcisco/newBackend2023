import express, { urlencoded } from 'express';
const router = express.Router();
router.use( express.json() );
router.use( express.urlencoded( { extended: true } ) );
import socketServer from '../app.js';

const foods = [
    {name: "Banana", price: 100},
    {name: "Pizza", price: 200},
    {name: "Gaseosa", price: 300},
    {name: "Empanad", price: 400},
    {name: "Sushi", price: 500}
]

router.get('/', (req, res) => { 
    res.render('home', { food: foods } );
})

function addProduct(product) {
    if (product.name === undefined || product.price === undefined  || product.name === null || product.price === null) {
        throw new Error("Campos obligatorios.");
    }      
    
    const createProduct = {       
        ...product
    };   
    
    foods.push(createProduct);  
    //console.log(foods)  
}

router.post('/', (req,res) => {
    
    const { name, price } = req.body;   
    console.log(name)


    try { 
        addProduct({ name, price });
        res.status(200).json({message: "producto agregado", product:{ name, price }});
        socketServer.emit('add-product', { name, price });
    } catch(err) {
        socketServer.emit('error-product', "Producto duplicado");
        res.status(400).json({error: "Error: ", err});
    }
})

router.get ('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { food: foods });
})

export default router;