/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import View from '@ioc:Adonis/Core/View'
import Route from '@ioc:Adonis/Core/Route'

View.global('appNavigationList', [
  {
    text: 'Check-ins',
    url: () => Route.makeUrl('CheckinController.index'),
  },
  // {
  // 	text: 'Stats',
  // 	url: () => Route.makeUrl('DashboardController.index'),
  // },
  {
    text: 'Account',
    url: () => Route.makeUrl('ProfilesController.index'),
  },
])
