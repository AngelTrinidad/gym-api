'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', async (faker, i, data) => {

  let username = faker.username()
  let email = faker.email()
  let password = faker.password()
  let nombre = faker.first()
  let apellido = faker.last()

  if(data.first){
    username = 'angelt'
    email = '96trinidad@gmail.com'
    password = 'Tulina1997',
    nombre = 'angel'
    apellido = 'trinidad'
  }

  return {
    username,
    email,
    password,
    nombre,
    apellido,
    estado: 1,
    created_at: faker.date(),
    sucursal_id: data.sucursal_id
  }
})

Factory.blueprint('App/Models/Producto', async (faker, i, data) => {
  return {
    detalle: faker.word(),
    estado: 1,
    precio: faker.integer({min: 1, max: 300})*1000,
    user_id_alta: data.user_id
  }
})

Factory.blueprint('App/Models/Servicio', async (faker, i, data) => {
  return {
    detalle: faker.word(),
    precio: faker.integer({min:50, max:300})*1000,
    estado: 1,
    user_id_alta: data.user_id
  }
})

Factory.blueprint('App/Models/Descuento', async (faker, i, data) => {
  return {
    descripcion: faker.word(),
    porcentaje_descuento: faker.floating({min:0, max:100, fixed:7}),
    monto_descuento: 0,
    estado: 1,
    fecha_inicio: new Date(),
    fecha_fin: null,
    user_id: data.user_id
  }
})

Factory.blueprint('App/Models/Cliente', async (faker, i, data) => {
  return {
    nro_documento: faker.cf(),
    nombre: faker.first(),
    apellido: faker.last(),
    sexo: faker.integer({min: 0, max: 1}),
    email: faker.email(),
    contacto: faker.phone(),
    fecha_nacimiento: faker.date({string: true, american: true}),
    password: null,
    sucursal_id: data.sucursal_id
  }
})

Factory.blueprint('App/Models/Sucursal', async (faker, i) => {
  return {
    detalle: 'sucursal '+faker.word(),
    direccion: faker.address(),
    contacto: faker.phone()
  }
})

Factory.blueprint('App/Models/Caja', async (faker, i, data) => {
  return {
    sucursal_id: data.sucursal_id,
    detalle: 'Caja '+ data.nro_caja
  }
})
