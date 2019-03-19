'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {import('@adonisjs/framework/src/Route/Manager'} */
const Route = use('Route')

Route.group(() => {

  //UserController
  Route.post('login-user', 'UserController.login')
  Route.put('update-user', 'UserController.modificar').middleware(['auth:jwt'])
  Route.post('new-user', 'UserController.alta').middleware(['auth:jwt'])
  Route.put('change-pass-user', 'UserController.cambiarPassword').middleware(['auth:jwt'])
  Route.post('forgout-pass-user', 'UserController.forgoutPass')
  Route.post('change-pass-mail-user', 'UserController.cambiarPasswordMail')
  Route.put('change-state-user', 'UserController.changeStateUser').middleware(['auth:jwt'])
  Route.delete('delete-user', 'UserController.eliminar').middleware(['auth:jwt'])
  Route.get('all-user', 'UserController.all').middleware(['auth:jwt'])
  Route.get('profile-user/:id', 'UserController.perfil').middleware(['auth:jwt'])
  Route.post('verify-field-user', 'UserController.verificarCampo').middleware(['auth:jwt'])
  Route.put('update-other-user', 'UserController.modificarOtroUsuario').middleware(['auth:jwt'])
  Route.post('upload-profile-photo-user', 'UserController.uploadImagenPerfil').middleware(['auth:jwt'])

  //Sucursal Controller
  Route.get('all-sucursal', 'SucursalController.all').middleware(['auth:jwt'])
  Route.post('new-sucursal', 'SucursalController.alta').middleware(['auth:jwt'])
  Route.put('update-sucursal', 'SucursalController.modificar').middleware(['auth:jwt'])
  Route.put('change-state-sucursal', 'SucursalController.cambiarEstado').middleware(['auth:jwt'])
  Route.delete('delete-sucursal', 'SucursalController.eliminar').middleware(['auth:jwt'])

  //Servicio Controller
  Route.post('new-servicio', 'ServicioController.alta').middleware(['auth:jwt'])
  Route.put('update-servicio', 'ServicioController.modificar').middleware(['auth:jwt'])
  Route.get('all-servicio', 'ServicioController.all').middleware(['auth:jwt'])
  Route.put('change-state-servicio', 'ServicioController.cambiarEstado').middleware(['auth:jwt'])

  //Descuento
  Route.post('new-descuento', 'DescuentoController.alta').middleware(['auth:jwt'])
  Route.put('update-descuento', 'DescuentoController.modificar').middleware(['auth:jwt'])
  Route.put('change-state-descuento', 'DescuentoController.cambiarEstado').middleware(['auth:jwt'])
  Route.get('all-descuento', 'DescuentoController.all').middleware(['auth:jwt'])

  //Medios Pago
  Route.put('change-state-mediosPago', 'MediosPagoController.cambiarEstado').middleware(['auth:jwt'])
  Route.get('all-mediosPago', 'MediosPagoController.all').middleware(['auth:jwt'])
  Route.get('all-enable-mediosPago', 'MediosPagoController.allEnable').middleware(['auth:jwt'])
  
  //Producto
  Route.get('all-producto', 'ProductoController.all').middleware(['auth:jwt'])
  Route.post('new-producto', 'ProductoController.alta').middleware(['auth:jwt'])
  Route.put('update-producto', 'ProductoController.modificar').middleware(['auth:jwt'])
  Route.put('change-state-producto', 'ProductoController.cambiarEstado').middleware(['auth:jwt'])

  //Cliente
  Route.post('new-cliente', 'ClienteController.alta').middleware(['auth:jwt'])
  Route.put('update-cliente', 'ClienteController.modificar').middleware(['auth:jwt'])
  Route.put('disable-cliente', 'ClienteController.inactivar').middleware(['auth:jwt'])
  Route.put('enable-cliente', 'ClienteController.reactivar').middleware(['auth:jwt'])
  Route.post('newService-cliente', 'ClienteController.nuevoServicio').middleware(['auth:jwt'])
  Route.post('disableService-cliente', 'ClienteController.inactivarServicio').middleware(['auth:jwt'])
  Route.post('discount-cliente', 'ClienteController.aplicarDescuento').middleware(['auth:jwt'])
  Route.post('deleteDiscount-cliente', 'ClienteController.eliminarDescuento').middleware(['auth:jwt'])
  Route.get('all-cliente', 'ClienteController.all').middleware(['auth:jwt'])
  Route.get('profile-cliente/:id', 'ClienteController.perfil').middleware(['auth:jwt'])
  Route.get('ingreso-cliente/:cliente_id/:sucursal_id', 'ClienteController.ingresar')


}).prefix('api/v1')
