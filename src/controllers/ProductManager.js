import {promises as fs} from 'fs'
import {nanoid} from "nanoid"

class ProductManager {
    constructor(){
        this.path = "./src/models/products.json"
    }
   
    _exist = async (id) => {
        let products = await this._readProducts()
        return products.find(prod => prod.id === id)
    }
   
    _readProducts = async () => {
        let products = await fs.readFile(this.path, "utf-8")
        return JSON.parse(products)
    }
   
    _writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product))
    }

    addProducts = async (product) => {
        let productsAct = await this._readProducts()
        product.id = nanoid()
        let productAll = [...productsAct, product]
        await this._writeProducts(productAll)
        return "Tu producto a sido agregado"
    }
   
    updProducts = async (id, product) => {
        
        let prodId = await this._exist(id)
        if(!prodId) return "Producto no a logrado ser encontrado"
     
        await this.delProducts(id)
        let productAct = await this._readProducts()
    
        let products = [{...product, id : id}, ...productAct]
        //console.log([{...product, id : id}, ...productAct]) se valida contenido para el producto a actualizar
        await this._writeProducts(products)
        return "Producto actualizado"
    }
   
    getProducts = async () => {
        return await this._readProducts()
    }
   
    getProdById = async (id) => {
        let prodId = await this._exist(id)
        if(!prodId) return "Producto no encontrado"
        return prodId
    }
 
    delProducts = async (id) => {
        let products = await this._readProducts()
      
        let existProd = products.some(prod => prod.id === id)
        if(existProd){
            let filterProducts = products.filter(prod => prod.id != id)
            await this._writeProducts(filterProducts)
            return "Producto a sido eliminado"
        }
        return "Id del producto no a sido encontrado"      
    }
}

export default ProductManager