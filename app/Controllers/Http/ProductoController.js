'use strict'

const Producto = use('App/Models/Producto')
const Database = use('Database');

class ProductoController {
  async alta({request, response, auth}){
    /*
    *Descripcion: Alta de un nuevo producto
    *Header: Authorization: bearer <<token>>
    *Body: {
      producto: {
        detalle,
        precio,
        sucursales: [
          {id, cant, cant_min}
        ]
      }
    }
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/producto
    *   }
    * }
    */

    //trx
    const trx = await Database.beginTransaction()

    try {

      //user alta
      const user = await auth.getUser()

      //descuento enviado por el body
      const producto = request.input('producto')

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
      let productoInstance = new Producto()
      productoInstance.detalle = producto.detalle.toLowerCase()
      productoInstance.precio = producto.precio
      productoInstance.user_id_alta = user.id


      await productoInstance.save(trx)

      //creación del inventario por sucursal
      if(producto.sucursales){
        const sucursalesId = producto.sucursales.map(sucursal => sucursal.id)
        let position = 0
        let stock = []
        await productoInstance.sucursales().attach(sucursalesId, row => {
          row.cantidad = producto.sucursales[position].cant
          row.cantidad_minima = producto.sucursales[position].cant_min
          position++
          stock.push({
            sucursal_id: row.sucursal_id,
            cant: row.cantidad,
            cant_min: row.cantidad_minima
          })
        }, trx)

        //agregamos las sucursales con su stock en el producto a retornar
        productoInstance.stock = stock
      }

      //commit
      trx.commit()

      //Success
      return response.json({
        status: "ok",
        body: {
          producto: productoInstance
        }
      })

    } catch (e) {
      //ERROR!!!
      trx.rollback()
      return response.json({
        status: "error",
        body:{
          msg: e.message
        }
      })
    }
  }

  async modificar({request, response}){
    /*
    *Descripcion: Modificar un producto
    *Header: Authorization: Beader <<token>>
    *Body:
      producto: {
        id,
        detalle,
        precio,
        sucursales: [
          {id, cant, cant_min}
        ]
      }
    *Formato: obj
    *Return:
    *  {
    *    status: ok/error,
    *    body: {
    *     msg/producto
    *    }
    *  }
    */

    //trx
    const trx = await Database.beginTransaction()

    try {

      //Descuento enviado por el body
      const producto = request.input('producto')

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
      const productoInstance = await Producto.find(producto.id)
      if(!productoInstance){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Producto no encontrado'
          }
        })
      }
      productoInstance.detalle = producto.detalle.toLowerCase()
      productoInstance.precio = producto.precio
      await productoInstance.save(trx)

      //Eliminamos todas las relaciones entre producto y sucursal
      await productoInstance.sucursales().detach()

      if(producto.sucursales){
        const sucursalesId = producto.sucursales.map(sucursal => sucursal.id)
        let position = 0
        let stock = []
        await productoInstance.sucursales().attach(sucursalesId, row => {
          row.cantidad = producto.sucursales[position].cant
          row.cantidad_minima = producto.sucursales[position].cant_min
          position++
          stock.push({
            sucursal_id: row.sucursal_id,
            cant: row.cantidad,
            cant_min: row.cantidad_minima
          })
        }, trx)

        //agregamos las sucursales con su stock en el producto a retornar
        productoInstance.stock = stock
      }

      //commit
      trx.commit()

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
          msg: e.message
        }
      })
    }
  }

  async cambiarEstado({request, response}){
    /*
    *Descripcion: Inactivacion de un usuario
    *Header: Authorization: bearer <<token>>
    *Body: producto_id, new_state
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/user
    *   }
    * }
    */

    try {

      //Validación del request
      const productoId = request.input('producto_id')
      const newState = request.input('new_state')
      if(!productoId){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Obtenemos el producto por el id
      const producto = await Producto.find(productoId)

      //Validación del producto
      if(!producto){
        return response.json({
          status: "error",
          body: {
            msg: 'producto no encontado'
          }
        })
      }

      //Cambiamos el estado
      switch (newState) {
        case 'disable':
          producto.estado = 0
          break;
        case 'delete':
          producto.estado = 2
          break;
        default:
          producto.estado = 1
      }
      await producto.save()

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
          msg: e.message
        }
      })
    }

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
      const producto = await Producto.find(idProducto)
      if(!producto){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'producto no encontrado'
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
          msg: e.message
        }
      })
    }
  }

  async all({response}){
    try {
      const products = await Producto
        .query()
        .where('estado','<>', 2)
        .with('userAlta', user => {
          user.select('id', 'username', 'nombre', 'apellido')
        })
        .with('sucursales')
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
