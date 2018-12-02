'use strict'

const User = use('App/Models/User');
const LoginUser = use('App/Models/LoginUser')
const Hash = use('Hash')
const Mail = use('Mail')
const rn = require('random-number')
const generator = require('generate-password')
const moment = require('moment')
const Helpers = use('Helpers')
const Drive = use('Drive')

class UserController {

  async login ({request, response, auth}) {
    /*
    *Descripcion: Login del admin
    *Header: No necesario
    *Body: user.email, user.password
    *Formato: Obj
    *Return:
    *  {
    *    status: ok/error,
    *    body: {
    *     msg/token
    *    }
    *  }
    */

    try {

      //Recuperamos el user en el request body
      const {user} = request.all()

      //Validación de user
      if(!user || !user.email || !user.password)
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })

      //Login del user, generación del jwt
      const logged = await auth.attempt(user.email, user.password, true)

      //Guardamos el ultimo login en la DB
      const userDB = await User.findBy('email', user.email)
      const loginUser = new LoginUser()
      loginUser.user_id = userDB.id
      await loginUser.save()

      //Success
      return response.json({
        status: "ok",
        body: {
          token: logged.token
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

  async alta({request, response}){
    /*
    *Descripcion: Alta de un nuevo usuario
    *Header: Authorization: bearer <<token>>
    *Body: user.username, user.email, user.password, user.nombre, user.apellido, user.sucursal_id
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

      //Usuario enviado por el body
      const {user} = request.all()

      //Validacion de nuevo usuario
      if(!user.username || !user.nombre || !user.apellido || !user.email){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Creación del nuevo usuario
      const userInstance = new User()
      userInstance.username = user.username.toLowerCase()
      userInstance.nombre = user.nombre.toLowerCase()
      userInstance.apellido = user.apellido.toLowerCase()
      userInstance.email = user.email.toLowerCase()
      const password = generator.generate({
        length: 7,
        numbers: true
      })
      userInstance.password = password
      userInstance.sucursal_id = (user.sucursal_id ? user.sucursal_id : null)
      await userInstance.save()

      //Email con el link de confirmacion
      await Mail.send('emails.WelcomeUser', {user: userInstance.toJSON(), password}, (message) => {
        message
          .to(userInstance.email)
          .from('support.solvo.com.py')
          .subject('Bienvenido a solvo.com')
      })

      //Success
      return response.json({
        status: "ok",
        body: {
          user: userInstance
        }
      })

    } catch (e) {
      console.log(e)
      //ERROR!!!
      return response.json({
        status: "error",
        body:{
          msg: e.message
        }
      })
    }

  }

  async cambiarPassword({request, response, auth}){
    /*
    *Descripcion: Cambio de contraseña del user logged
    *Header: Authorization: bearer <<token>>
    *Body: password, password_repeat
    *Formato: obj
    *Return:
    *  {
    *    status: error/ok,
    *    body: {
    *      msg/user
    *    }
    *  }
    */
    try {

      //user logged
      const user = await auth.getUser()

      //request body
      const password = request.input('password')
      const passwordRepeat = request.input('password_repeat')

      //Validación
      if(password !== passwordRepeat){
        return response.json({
          status: 'error',
          body:{
            msg: 'Password y passwordRepeat no coinciden'
          }
        })
      }

      //Hash y actualización
      user.password = await Hash.make(password)
      user.save()

      //success
      return response.json({
        status: 'ok',
        body:{
          user
        }
      })
    } catch (e) {
      //ERROR!!
      return response.json({
        status:'error',
        body: {
          msg: e.message
        }
      })
    }
  }

  async forgoutPass({request, response}){
    /*
    *Descripcion: Envia un email con un link para cambiar la contraseña
    *Header: Authorization: bearer <<token>>
    *Body: user.email
    *Formato: obj
    *Return:
    *  {
    *    status: error/ok,
    *    body: {
    *      msg/
    *    }
    *  }
    */
    try {

      //request body
      const email = request.input('email')

      //Validación
      if(!email){
        return response.json({
          status: 'error',
          body:{
            msg: 'Request body incompleto'
          }
        })
      }

      const user = await User.findBy('email', email)
      if(!user){
        return response.json({
          status: 'error',
          body:{
            msg: 'Usuario no existente'
          }
        })
      }

      //Codigo de confirmacion
      const cod_confirm = rn({
        min: 1000,
        max: 100000,
        integer: true
      })
      user.cod_confirmacion = await Hash.make(cod_confirm.toString())
      user.save()

      //Email con el link de confirmacion
      await Mail.send('emails.sendLink', {user: user.toJSON(), cod: cod_confirm}, (message) => {
        message
          .to(user.email)
          .from('support.solvo.com.py')
          .subject('Cambio de contraseña')
      })

      //success
      return response.json({
        status: 'ok',
        body:{
          cod_confirm
        }
      })
    } catch (e) {
      //ERROR!!
      return response.json({
        status:'error',
        body: {
          msg: e.message
        }
      })
    }
  }

  async cambiarPasswordMail({request, response}){
    /*
    *Descripcion: Cambio de contraseña del user por mail
    *Header: Authorization: bearer <<token>>
    *Body: password, password_repeat, user_id, cod_confirm
    *Formato: obj
    *Return:
    *  {
    *    status: error/ok,
    *    body: {
    *      msg/user
    *    }
    *  }
    */
    try {

      //request body
      const userId = request.input('user_id')
      const codConfirm = request.input('cod_confirm')
      const password = request.input('password')
      const passwordRepeat = request.input('password_repeat')

      if(!userId || !codConfirm || !password || !passwordRepeat){
        return response.json({
          status: 'error',
          body:{
            msg: 'Request body incompleto'
          }
        })
      }

      //Validación
      if(password !== passwordRepeat){
        return response.json({
          status: 'error',
          body:{
            msg: 'Password y passwordRepeat no coinciden'
          }
        })
      }

      //Buscar el user
      const user = await User.find(userId)
      if(!user){
        return response.json({
          status: 'error',
          body:{
            msg: 'Usuario no existente'
          }
        })
      }

      //Validacion del cod de confirmacion
      const isSame = await Hash.verify(codConfirm, user.cod_confirmacion)
      if(!isSame){
        return response.json({
          status: 'error',
          body:{
            msg: 'Codigo de confirmación no corresponde'
          }
        })
      }

      //Hash y actualización
      user.password = await Hash.make(password)
      user.save()

      //success
      return response.json({
        status: 'ok',
        body:{
          user
        }
      })
    } catch (e) {
      //ERROR!!
      return response.json({
        status:'error',
        body: {
          msg: e.message
        }
      })
    }
  }

  async verificarCampo({request, response}){
    /*
    *Descripcion: Verificar si un username ya existe
    *Header: Authorization: Beader <<token>>
    *Body: field, value, (exclude.field, exclude.value)
    *Formato: obj
    *Return:
    *  {
    *    status: ok/error,
    *    body: {
    *     msg/token
    *    }
    *  }
    */

    try {

      //Nuevos valores del user
      const field = request.input('field')
      const value = request.input('value').toLowerCase()
      const exclude = request.input('exclude')
      //Validación de user
      if(!field || !value)
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
        const userFind = await User
        .query()
        .select('id')
        .where((builder) => {
          builder.whereRaw(`LOWER(${field}) = ?`, [value])
          if(exclude){
            builder.whereNotIn(exclude.field, [exclude.value])
          }
        })
        .fetch()

      return response.json({
        status: 'ok',
        body: {
          users: userFind
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

  async modificar({request, response, auth}){
    /*
    *Descripcion: Put del perfil del admin
    *Header: Authorization: Beader <<token>>
    *Body: user.email, user.unsername, user.nombre, user.apellido, user.sucursal_id
    *Formato: obj
    *Return:
    *  {
    *    status: ok/error,
    *    body: {
    *     msg/token
    *    }
    *  }
    */

    try {

      //Recupera el usuario por medio del jwt del middleware
      let user = await auth.getUser()

      //Nuevos valores del user
      const userInput = request.input('user')

      user.username = userInput['username']
      //user.email = userInput['email']
      user.nombre = userInput['nombre']
      user.apellido = userInput['apellido']
      user.sucursal_id = userInput['sucursal']
      //guardamos los datos
      await user.save()

      //Generamos un nuevo token
      const logged = await auth.generate(user, true)

      //Success
      return response.json({
        status: "ok",
        body: {
          token: logged.token
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

  async changeStateUser({request, response}){
    /*
    *Descripcion: Inactivacion de un usuario
    *Header: Authorization: bearer <<token>>
    *Body: user_id
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
      const idUser = request.input('user_id');
      if(!idUser){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Obtenemos el user por el id
      const user = await User.find(idUser)

      //Validación del user id
      if(!user){
        return response.json({
          status: "error",
          body: {
            msg: 'User no encontado'
          }
        })
      }

      //Cambiamos el estado
      user.estado = !user.estado
      await user.save()

      const userReturn = await User
        .query()
        .with('sucursal', sucursal => {
          sucursal.select('id', 'detalle')
        })
        .where('id', '=', user.id)
        .first()

      //Success
      return response.json({
        status: "ok",
        body: {
          user: userReturn
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
    *Descripcion: Eliminar user
    *Header: Authorization: bearer <<token>>
    *Body: user.id
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
      const idUser = request.input('user_id');
      if(!idUser){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incorrecto/incompleto'
          }
        })
      }

      //Validación de user
      const user = await User.find(idUser)
      if(!user){
        //ERROR!!!
        return response.json({
          status: "error",
          body: {
            msg: 'User no encontrado'
          }
        })
      }

      //Eliminación de user
      await user.delete()

      //Success
      return response.json({
        status: "ok",
        body: {
          user
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
      const users = await User
        .query()
        .with('sucursal', sucursal => {
          sucursal.select('id', 'detalle')
        })
        .where('estado', '<>', 2)
        .orderBy('username', 'asc')
        .fetch()
      return response.json({
        status: 'ok',
        body: {
          users
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

  async perfil({response, params}){
    try {
      const user = await User.find(params.id)
      return response.json({
        status: 'ok',
        body: {
          user
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

  async modificarOtroUsuario({request, response}){

    try {
      const userInput = request.input('user')
      if(!userInput){
        return response.json({
          status: "error",
          body: {
            msg: 'Request body incompleto/incorrecto'
          }
        })
      }

      const userUpdate = await User.find(userInput.id)
      if(!userUpdate){
        return response.json({
          status: "error",
          body: {
            msg: 'User no encontrado'
          }
        })
      }

      userUpdate.nombre = userInput.nombre
      userUpdate.apellido = userInput.apellido
      userUpdate.username = userInput.username
      userUpdate.sucursal_id = userInput.sucursal_id
      await userUpdate.save()

      //return user
      const user = await User
        .query()
        .with('sucursal', sucursal => {
          sucursal.select('id', 'detalle')
        })
        .where('id', userInput.id)
        .first()


      return response.json({
        status: 'ok',
        body:{
          user
        }
      })

    } catch (e) {
      return response.json({
        status: 'error',
        body: {
          msg: e.message
        }
      })
    }

  }

  async uploadImagenPerfil({request, response, auth}){
    try {
      //user logged
      const user = await auth.getUser()

      //request body
      const photo = request.file('photo', {
        types: ['image'],
        size: '2mb'
      })

      //move
      const newName= `profile-${user.username}-${moment().format('YYYYMMDDHHmmss')}.jpg`
      await photo.move(Helpers.publicPath('images/users'), {
        name: newName
      })

      //validation
      if(!photo.moved()){
        return response.json({
          status: 'error',
          body:{
            msg: photo.error()
          }
        })
      }else{
        //verificamos la existencia de la img anterior
        if(Drive.exists(`${Helpers.publicPath('images/users')}/${user.img_perfil}`)){
          Drive.delete(`${Helpers.publicPath('images/users')}/${user.img_perfil}`)
        }
        user.img_perfil = newName
        await user.save()
        return response.json({
          status: 'ok',
          body:{
            name_img: newName
          }
        })
      }


    } catch (e) {
      return response.json({
        status: 'error',
        body:{
          msg: e.message
        }
      })
    }
  }

}

module.exports = UserController
