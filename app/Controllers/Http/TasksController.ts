import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'

export default class TasksController {
  public async index({ view }: HttpContextContract) {
    return view.render('tasks/index', {
      breadcrumbs: [
        {
          title: 'rman',
          link: '/',
        },
        {
          title: 'Tasks',
          link: Route.makeUrl('TasksController.index'),
        },
      ],
    })
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
