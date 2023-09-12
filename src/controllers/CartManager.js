import {promises as fs} from 'fs'
import {nanoid} from "nanoid"
import ProductManager from './ProductManager.js'

const prodAll = new ProductManager()

class CartManager {
    constructor(){
        this.path = "./src/models/carts.json"
    }
   
    _exist = async (id) => {
        let carts = await this._readCarts()
        return carts.find(cart => cart.id === id)
    }
  
    _readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts)
    }
  
    _writeCarts = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart))
    }
    
    getCarts = async () => {
        return await this._readCarts()
    }

    addCarts = async () => {
        let cartsAct = await this._readCarts()
        let id = nanoid()
        let cartsConcat = [{id:id, products : []}, ...cartsAct]
        await this._writeCarts(cartsConcat)
        return "Añadido al carrito"
    }
    
    getCartById = async (id) => {
        let cartId = await this._exist(id)
        if(!cartId) return "No encontrado"
        return cartId
    }
   
    addProductInCart = async (cartId, prodId) => {
        let carttId = await this._exist(cartId)
        if(!carttId) return "carrito no encontrado"
        let proddId = await prodAll._exist(prodId)
        if(!proddId) return "Producto no encontrado"

        let cartsAll = await this.getCarts()
        let cartFilter = cartsAll.filter((cart) => cart.id != cartId)
        if(carttId.products.some((prod) => prod.id === prodId)){
            let moreProd  = carttId.products.find((prod) => prod.id === prodId)
            moreProd .quantity++
            let cartsConcat = [carttId, ...cartFilter]
            await this._writeCarts(cartsConcat)
            return "Producto se a añadido al carrito"
        }
      
        carttId.products.push({id:prodId, quantity: 1})
        let cartsConcat = [ carttId, ...cartFilter]
        await this._writeCarts(cartsConcat)
        return "Producto en el carrito"
    }
}

export default CartManager