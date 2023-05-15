import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import Membership, { ROLE } from 'App/Models/Membership'
import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'

export default class ProjectsController {
  public async index({ view, auth }: HttpContextContract) {
    const userInTeams = await Membership.query()
      .where('user_id', auth.user!.id)
      .select(['team_id'])

    const projects = await Project.query()
      .whereIn(
        'team_id',
        userInTeams.map(x => x.teamId)
      )
      .select(['id', 'name', 'description'])

    return view.render('projects/index', {
      projects: projects.map(x => x.serialize()),
      breadcrumbs: [
        {
          title: 'rman',
          link: '/',
        },
        {
          title: 'Projects',
          link: Route.makeUrl('ProjectsController.index'),
        },
      ],
    })
  }

  public async create({ view, auth }: HttpContextContract) {
    const userTeamRows = await Membership.query()
      .where('user_id', auth.user!.id)
      .whereNotNull('team_id')
      .preload('team')

    const userTeamsDetails = userTeamRows.map(x => x.serialize().team)
    return view.render('projects/create', {
      teams: userTeamsDetails,
      breadcrumbs: [
        {
          title: 'rman',
          link: '/',
        },
        {
          title: 'Projects',
          link: Route.makeUrl('ProjectsController.index'),
        },
        {
          title: 'Create Project',
          link: Route.makeUrl('ProjectsController.create'),
        },
      ],
    })
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const projectDetails = await Database.transaction(async trx => {
      const project = new Project()
      project.name = request.input('name')
      project.teamId = request.input('teamId')
      project.description = request.input('description')
      project.useTransaction(trx)
      const projectDetails = await project.save()

      const membership = new Membership()
      membership.projectId = projectDetails.id
      membership.userId = auth.user!.id
      membership.role = ROLE.OWNER
      membership.useTransaction(trx)
      await membership.save()

      return projectDetails
    })
    return response.redirect(`/projects/${projectDetails.id}`)
  }

  public async show({ view, response, request }: HttpContextContract) {
    const forId = request.params()['id']
    const projectDetails = await Project.query()
      .withAggregate('members', query => {
        query
          .distinctOn('user_id')
          .count('*')
          .as('members_count')
          .where({
            project_id: forId,
          })
          .groupBy('memberships.user_id')
      })
      .where('projects.id', forId)
      .first()

    if (!projectDetails) {
      return response.notFound('Cannot find project')
    }

    return view.render('projects/show', {
      project: projectDetails.serialize(),
      memberCount: parseInt(projectDetails.$extras.members_count, 10),
      breadcrumbs: [
        { title: 'rman', link: '/' },
        { title: 'Projects', link: Route.makeUrl('ProjectsController.index') },
        {
          title: projectDetails.name,
          link: Route.makeUrl('ProjectsController.show', {
            id: projectDetails.id,
          }),
        },
      ],
    })
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
