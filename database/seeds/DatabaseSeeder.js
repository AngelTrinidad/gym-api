'use strict'

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')

class DatabaseSeeder {
  async run () {
    const sucursal = await Factory
      .model('App/Models/Sucursal')
      .create()

    const user = await Factory
      .model('App/Models/User')
      .create({first: true, sucursal_id: sucursal.id})

    const userArray = await Factory
      .model('App/Models/User')
      .createMany(5)

    userArray.forEach( async (user) => {

      if(user.nombre.length > 0){
        await Factory
          .model('App/Models/Producto')
          .create({user_id: user.id})

        await Factory
          .model('App/Models/Servicio')
          .create({user_id: user.id})

        await Factory
          .model('App/Models/Descuento')
          .create({user_id: user.id})

        await Factory
          .model('App/Models/Cliente')
          .createMany(5, {user_id: user.id})
      }
    })

    for(let i=1; i<4; i++){
      await Factory
        .model('App/Models/Caja')
        .create({sucursal_id: sucursal.id, nro_caja: i})
    }

  }
}

module.exports = DatabaseSeeder
