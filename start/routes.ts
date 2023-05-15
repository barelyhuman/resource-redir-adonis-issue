import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('home')
})

Route.get('checkins/start', 'CheckinController.start').middleware('auth')
Route.get('checkins/stop', 'CheckinController.stop').middleware('auth')

Route.resource('checkins', 'CheckinController')
  .middleware({
    '*': ['auth'],
  })
  .except(['show', 'create', 'store', 'edit', 'destroy', 'update'])

Route.resource('dashboard', 'DashboardController')
  .middleware({
    '*': ['auth'],
  })
  .except(['show', 'create', 'store', 'edit', 'destroy', 'update'])

Route.get('profile/export', 'ProfilesController.exportData').middleware('auth')

Route.resource('profile', 'ProfilesController')
  .middleware({
    '*': ['auth'],
  })
  .except(['show', 'create', 'store', 'edit'])

Route.get('login', 'AuthController.loginGet')
Route.post('login', 'AuthController.loginPost')

Route.get('register', 'AuthController.registerGet')
Route.post('register', 'AuthController.registerPost')

Route.get('logout', 'AuthController.logoutGet')
