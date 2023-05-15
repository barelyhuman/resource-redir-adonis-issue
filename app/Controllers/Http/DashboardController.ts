import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'

export default class DashboardController {
	async index({ view, auth }: HttpContextContract) {
		await auth.use('web').authenticate()
		return view.render('dashboard', {
			breadcrumbs: [
				{
					title: 'rman',
					link: '/',
				},
				{
					title: 'Stats',
					link: Route.makeUrl('DashboardController.index'),
				},
			],
		})
	}
}
