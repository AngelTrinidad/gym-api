'use strict'

const Producto = use('App/Models/Producto')

class ProductoController {
  async alta({request, response, auth}){
    /*
    *Descripcion: Alta de un nuevo producto
    *Header: Authorization: bearer <<token>>
    *Body: producto.detalle, producto.precio
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/producto
    *   }
    * }
    */

    try {

      //user alta
      const user = await auth.getUser()

      //descuento enviado por el body
      const {producto} = request.all()

      //Validacion del producto
      if(!producto.detalle || !producto.precio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Creación del producto
      const productoInstance = new Producto()
      productoInstance.detalle = producto.detalle
      productoInstance.precio = producto.precio
      productoInstance.user_id_alta = user.id


      await productoInstance.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          producto: productoInstance
        }
      })

    } catch (e) {
      //ERROR!!!
      return response.json({
        status: "error",
        body:{
          msg: e
        }
      })
    }
  }

  async modificar({request, response}){
    /*
    *Descripcion: Modificar un producto
    *Header: Authorization: Beader <<token>>
    *Body: producto.id, producto.detalle, producto.precio
    *Formato: obj
    *Return:
    *  {
    *    status: ok/error,
    *    body: {
    *     msg/producto
    *    }
    *  }
    */

    try {

      //Descuento enviado por el body
      const {producto} = request.all()

      //Validacion del producto
      if(!producto.id || !producto.detalle || !producto.precio){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Find del producto
      const productoInstance = await Descuento.find(producto.id)
      if(!productoInstance){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Producto no encontrado'
          }
        })
      }
      productoInstance.detalle = producto.detalle
      productoInstance.precio = producto.precio
      await productoInstance.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          producto: productoInstance
        }
      })


    } catch (e) {
      //ERROR!!!
      return response.json({
        status: "error",
        body:{
          msg: e
        }
      })
    }
  }

  async inactivar({request, response}){
    /*
    *Descripcion: Inactivacion de un producto
    *Header: Authorization: bearer <<token>>
    *Body: producto_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/producto
    *   }
    * }
    */

    try {

      //Validación del request
      const idProducto = request.input('producto_id');
      if(!idProducto){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Modifcación de estado
      const producto = await this.cambiarEstado(idProducto, 0);
      if(!producto){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Producto no encontrado'
          }
        })
      }

      //Success
      return response.json({
        status: "ok",
        body: {
          producto
        }
      })
    } catch (e) {
      //ERROR!!!
      return response.json({
        status: "error",
        body:{
          msg: e
        }
      })
    }

  }

  async reactivar({request, response}){
    /*
    *Descripcion: Reactivación de producto
    *Header: Authorization: bearer <<token>>
    *Body: producto_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/producto
    *   }
    * }
    */

    try {
      //Validación del request
      const idProducto = request.input('producto_id');
      if(!idProducto){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Modifcación de estado
      const producto = await this.cambiarEstado(idProducto, 1);
      if(!producto){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'producto no encontrado'
          }
        })
      }

      //Success
      return response.json({
        status: "ok",
        body: {
          producto
        }
      })
    } catch (e) {
      //ERROR!!
      return response.json({
        status: "error",
        body: {
          e
        }
      })
    }


  }

  async cambiarEstado(idProducto, nuevoEstado){

    //Obtenemos el producto por el id
    const producto = await Producto.find(idProducto)

    //Validación del producto
    if(!producto){
      return false
    }

    //Cambiamos el estado
    producto.estado = nuevoEstado
    await producto.save()
    return producto
  }

  async eliminar({request, response}){
    /*
    *Descripcion: Eliminar producto
    *Header: Authorization: bearer <<token>>
    *Body: producto_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/producto
    *   }
    * }
    */

    try {

      //Validación del request
      const idProducto = request.input('producto_id');
      if(!idProducto){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Validación de Producto
      const producto = await Descuento.find(idProducto)
      if(!producto){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Descuento no encontrado'
          }
        })
      }

      //Eliminación de descuento
      await producto.delete()

      //Success
      return response.json({
        status: "ok",
        body: {
          producto
        }
      })
    } catch (e) {
      //ERROR!!!
      return response.json({
        status: "error",
        body:{
          msg: e
        }
      })
    }
  }

  async all({response}){
    try {
      const products = await Producto
        .query()
        .with('userAlta', user => {
          user.select('id', 'username', 'nombre', 'apellido')
        })
        .fetch()
      return response.json({
        status: 'ok',
        body: {
          products
        }
      })
    } catch (e) {
      response.json({
        status: 'error',
        body:{
          msg: e.message
        }
      })
    }
  }

}

module.exports = ProductoController
