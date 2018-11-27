'use strict'

const Cliente = use('App/Models/Cliente')
const Servicio = use('App/Models/Servicio')
const Descuento = use('App/Models/Descuento')
const Ingreso = use('App/Models/Ingreso')

class ClienteController {
  async alta({request, response, auth}){
    /*
    *Descripcion: Alta de un nuevo cliente
    *Header: Authorization: bearer <<token>>
    *Body: cliente.nro_documento, cliente.nombre, cliente.apellido, cliente.sexo
    * cliente.email, cliente.contacto, cliente.fecha_nacimiento, cliente.sucursal_id
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

      //cliente enviado por el body
      const {cliente} = request.all()

      //Validacion del cliente
      if(!cliente.nro_documento || !cliente.nombre || !cliente.apellido || !cliente.sexo || !cliente.sucursal_id){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Creación del cliente
      const clienteInstance = new Cliente()
      clienteInstance.nro_documento = cliente.nro_documento
      clienteInstance.nombre = cliente.nombre
      clienteInstance.apelldio = cliente.apellido
      clienteInstance.sexo = cliente.sexo
      clienteInstance.sucursal_id = cliente.sucursal_id
      clienteInstance.email = (cliente.email ? cliente.email : null)
      clienteInstance.contacto = (cliente.contacto ? cliente.contacto : null)
      clienteInstance.fecha_nacimiento = (cliente.fecha_nacimiento ? cliente.fecha_nacimiento : null)
      clienteInstance.user_id_alta = user.id


      await clienteInstance.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          cliente: clienteInstance
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
    *Descripcion: Modificar un cliente
    *Header: Authorization: Beader <<token>>
    *Body: cliente.id, cliente.nro_documento, cliente.nombre, cliente.apellido, cliente.sexo
    * cliente.email, cliente.contacto, cliente.fecha_nacimiento, cliente.sucursal_id
    *Formato: obj
    *Return:
    *  {
    *    status: ok/error,
    *    body: {
    *     msg/cliente
    *    }
    *  }
    */

    try {

      //Descuento enviado por el body
      const {producto} = request.all()

      //Validacion del cliente
      if(!cliente.id || !cliente.nro_documento || !cliente.nombre ||
        !cliente.apellido || !cliente.sexo || !cliente.sucursal_id){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Find del cliente
      const clienteInstance = await Descuento.find(cliente.id)
      if(!clienteInstance){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Cliente no encontrado'
          }
        })
      }
      clienteInstance.nro_documento = cliente.nro_documento
      clienteInstance.nombre = cliente.nombre
      clienteInstance.apelldio = cliente.apellido
      clienteInstance.sexo = cliente.sexo
      clienteInstance.sucursal_id = cliente.sucursal_id
      clienteInstance.email = (cliente.email ? cliente.email : null)
      clienteInstance.contacto = (cliente.contacto ? cliente.contacto : null)
      clienteInstance.fecha_nacimiento = (cliente.fecha_nacimiento ? cliente.fecha_nacimiento : null)
      await clienteInstance.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          producto: clienteInstance
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
    *Descripcion: Inactivacion de un cliente
    *Header: Authorization: bearer <<token>>
    *Body: cliente_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/cliente
    *   }
    * }
    */

    try {

      //Validación del request
      const idCliente = request.input('cliente_id');
      if(!idCliente){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Modifcación de estado
      const cliente = await this.cambiarEstado(idCliente, 0);
      if(!cliente){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'cliente no encontrado'
          }
        })
      }

      //Success
      return response.json({
        status: "ok",
        body: {
          cliente
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
    *Descripcion: Reactivación de cliente
    *Header: Authorization: bearer <<token>>
    *Body: cliente_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/cliente
    *   }
    * }
    */

    try {
      //Validación del request
      const idCliente = request.input('cliente_id');
      if(!idCliente){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Modifcación de estado
      const cliente = await this.cambiarEstado(idCliente, 1);
      if(!cliente){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'cliente no encontrado'
          }
        })
      }

      //Success
      return response.json({
        status: "ok",
        body: {
          cliente
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

  async cambiarEstado(idCliente, nuevoEstado){

    //Obtenemos el cliente por el id
    const cliente = await Cliente.find(idCliente)

    //Validación del cliente
    if(!cliente){
      return false
    }

    //Cambiamos el estado
    cliente.estado = nuevoEstado
    await cliente.save()
    return cliente
  }

  async eliminar({request, response}){
    /*
    *Descripcion: Eliminar cliente
    *Header: Authorization: bearer <<token>>
    *Body: cliente_id
    *Formato: obj
    *Return:
    * {
    *   status: error/ok,
    *   body: {
    *     msg/cliente
    *   }
    * }
    */

    try {

      //Validación del request
      const idCliente = request.input('cliente_id');
      if(!idCliente){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Validación de cliente
      const cliente = await Cliente.find(idCliente)
      if(!cliente){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'cliente no encontrado'
          }
        })
      }

      //Eliminación de cliente
      await cliente.delete()

      //Success
      return response.json({
        status: "ok",
        body: {
          cliente
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

  async nuevoServicio({request, response}){
    /*
    *Descripcion: alta de nuevo servicio para el cliente
    *Header: Authorization: bearer <<token>>
    *Body:
    *  {
    *    cliente_id,
    *    servicio_id,
    *    descuento: {
    *      id,
    *      fecha_inicio,
    *      fecha_fin
    *    }
    *  }
    *Formato: obj
    *Return:
    *  {
    *    status: error/ok
    *    body: {
    *      msg/clienteServicio
    *    }
    *  }
    */

    try {

      //Request body
      const idCliente = request.input('cliente_id')
      const idServicio = request.input('servicio_id')
      const descuento = request.input('descuento')

      //Validacion del request
      if(!idCliente || !idServicio ||
        (descuento && (!descuento.id || !descuento.fecha_inicio) )){
        //ERROR!!
        return response.json({
          status: 'error',
          body:{
            msg: 'Request body incompleto/incorrecto'
          }
        })
      }

      //Busqueda de cliente y servicio
      const cliente = await Cliente.find(idCliente)
      const servicio = await Servicio.find(idServicio)
      let descuentoInstance = null
      //Validacion de cliente y servicio
      if(!cliente || !servicio){
        return response.json({
          status: 'error',
          body: {
            msg: 'Cliente o servicio no existente'
          }
        })
      }

      //Validacion de descuento
      if(descuento){
        descuentoInstance = await Descuento.find(descuento.id)
        if(!descuentoInstance){
          return response.json({
            status: 'error',
            body: {
              msg: 'Descuento no existente'
            }
          })
        }
      }

      //Save
      await cliente.servicios().save(servicio, (row) => {
        //En el caso de que exista descuento, se busca el descuento y se añade
        if(descuentoInstance){
          row.descuento_id = descuento.id
          row.fecha_inicio_descuento = descuento.fecha_inicio
          row.fecha_fin_descuento = (descuento.fecha_fin_descuento ? descuento.fecha_fin_descuento : null)
        }
      })

      //Success
      return response.json({
        status: 'ok'
      })

    } catch (e) {
      return response.json({
        status: 'error',
        body:{
          msg: e
        }
      })
    }
  }

  async inactivarServicio({request, response}){
    /*
    *Descripcion: Inactivar un servicio del cliente
    *Header: Authorization: bearer <<token>>
    *Body:
      {
        cliente_servicio_id,
        cliente_id
      }
    *Formato: obj
    *Return: obj
    */
    try {
      const clienteId = request.input('cliente_id')
      const id = request.input('cliente_servicio_id')
      if(!clienteId || !id){
        return response.json({
          status: 'error',
          body: {
            msg: 'Request body incompleto/incorrecto'
          }
        })
      }

      const cliente = await Cliente.find(clienteId)
      const clienteServicio = await cliente
        .servicios()
        .pivotQuery()
        .where('id', id)
        .update({estado: 0})

      return response.json({
        status: 'ok',
        clienteServicio
      })
    } catch (e) {
      return response.json({
        status: 'error',
        body:{
          msg: e
        }
      })
    }
  }

  async reactivarServicio({request, response}){
    /*
    *Descripcion: Reactivar un servicio del cliente
    *Header: Authorization: bearer <<token>>
    *Body:
      {
        cliente_servicio_id,
        cliente_id
      }
    *Formato: obj
    *Return: obj
    */
    try {
      const clienteId = request.input('cliente_id')
      const id = request.input('cliente_servicio_id')
      if(!clienteId || !id){
        return response.json({
          status: 'error',
          body: {
            msg: 'Request body incompleto/incorrecto'
          }
        })
      }

      const cliente = await Cliente.find(clienteId)
      const clienteServicio = await cliente
        .servicios()
        .pivotQuery()
        .where('id', id)
        .update({estado: 1})

      return response.json({
        status: 'ok',
        clienteServicio
      })
    } catch (e) {
      return response.json({
        status: 'error',
        body:{
          msg: e
        }
      })
    }
  }

  async aplicarDescuento({request, response}){
    try {
      const clienteId = request.input('cliente_id')
      const id = request.input('cliente_servicio_id')
      const descuentoId = request.input('descuento_id')
      const descuento = request.input('descuento')

      if(!clienteId || !id || !descuento.id || !descuento.fecha_inicio){
        return response.json({
          status: 'error',
          body: {
            msg: 'Request body incompleto/incorrecto'
          }
        })
      }

      if(descuento.fecha_fin && descuento.fecha_fin < descuento.fecha_inicio){
        return response.json({
          status: 'error',
          body: {
            msg: 'Fecha fin debe ser mayor a la fecha inicio'
          }
        })
      }

      const cliente = await Cliente.find(clienteId)
      if(!cliente){
        return response.json({
          status: 'error',
          body: {
            msg: 'Cliente no existente'
          }
        })
      }

      const clienteServicio = await cliente
        .servicios()
        .pivotQuery()
        .where('id', id)
        .update({
          descuento_id: descuento.id,
          fecha_inicio_descuento: descuento.fecha_inicio,
          fecha_fin_descuento: (descuento.fecha_fin ? descuento.fecha_fin : null)
        })

      return response.json({
        status: 'ok'
      })

    } catch (e) {
      return response.json({
        status: 'error',
        body: {
          msg: e
        }
      })
    }
  }

  async eliminarDescuento({request, response}){
    try {
      const clienteId = request.input('cliente_id')
      const id = request.input('cliente_servicio_id')

      if(!clienteId || !id){
        return response.json({
          status: 'error',
          body: {
            msg: 'Request body incompleto/incorrecto'
          }
        })
      }

      const cliente = await Cliente.find(clienteId)
      if(!cliente){
        return response.json({
          status: 'error',
          body: {
            msg: 'Cliente no existente'
          }
        })
      }

      const clienteServicio = await cliente
        .servicios()
        .pivotQuery()
        .where('id', id)
        .update({
          descuento_id: null,
          fecha_inicio_descuento: null,
          fecha_fin_descuento: null
        })

      return response.json({
        status: 'ok'
      })

    } catch (e) {
      return response.json({
        status: 'error',
        body: {
          msg: e
        }
      })
    }
  }

  async ingresar({response, params}){
    try {
      const cliente = await Cliente.find(params.cliente_id)
      const ingreso = new Ingreso()
      ingreso.sucursal_id = params.sucursal_id

      const ingresoInstance = await cliente.ingresos().save(ingreso)
      return response.json({
        status: 'ok'
      })
    } catch (e) {
      return response.json({
        status: 'error',
        body:{
          msg: e
        }
      })
    }

  }

  async all({response}){
    try {
      const clientes = await Cliente
        .query()
        .with('ingresos', ingreso => {
          ingreso.select('id', 'created_at', 'cliente_id', 'sucursal_id')
            .with('sucursal', sucursal => {
              sucursal.select('id','detalle')
            })
        })
        .with('servicios', servicio => {
          servicio.select('id', 'detalle')
        })
        .fetch()

      return response.json({
        status: 'ok',
        body:{
          clientes
        }
      })
    } catch (e) {
      response.json({
        status: 'error',
        body:{
          msg: e
        }
      })
    }
  }

  async perfil({response, params}){
    try {
      const cliente = await Cliente.find(params.id)
      await cliente.loadMany({
        servicios: (servicio) => {
          servicio.select('id','detalle')
        },
        ingresos: (ingreso) => {
          ingreso.select('id', 'created_at', 'sucursal_id')
            .with('sucursal', sucursal => {
              sucursal.select('id','detalle')
            })
        }
      })

      return response.json({
        status: 'ok',
        body: {
          cliente
        }
      })

    } catch (e) {
      return response.json({
        status: 'error',
        body: {
          msg: e
        }
      })
    }
  }
}

module.exports = ClienteController
