import Route from '@ioc:Adonis/Core/Route'
import User from 'App/Models/User'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Buffer } from 'buffer'
import { Readable } from 'stream'

export default class ProfilesController {
  public async index({ view, response, auth }: HttpContextContract) {
    const userDetails = await User.find(auth.user!.id)

    if (!userDetails) {
      auth.logout()
      return response.redirect().toRoute('AuthController.loginGet')
    }

    return view.render('profiles/index', {
      user: userDetails.serialize(),
      breadcrumbs: [
        {
          title: 'rman',
          link: '/',
        },
        {
          title:
            [userDetails.firstName, userDetails.lastName]
              .filter(x => x)
              .join(' ')
              .trim() || userDetails.email,
          link: Route.makeUrl('ProfilesController.index'),
        },
      ],
    })
  }

  public async update({
    request,
    response,
    session,
    auth,
  }: HttpContextContract) {
    const firstName = request.input('firstName')
    const lastName = request.input('lastName')
    const email = request.input('email')
    const timezone = request.input('timezone')
    const user = await User.find(auth.user!.id)
    user.firstName = firstName
    user.lastName = lastName
    user.email = email
    user.timezone = timezone
    await user.save()
    session.flash('message', 'Updated Profile')
    return response.redirect().toRoute('profile.index')
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    try {
      const id = parseInt(request.params().id, 10)

      if (id !== auth.user!.id) {
        return response.forbidden({ errror: 'Unauthorized' })
      }

      const requestedUser = await User.find(id)
      if (requestedUser) {
        await requestedUser.delete()
      }
      return response.redirect().toRoute('AuthController.loginGet')
    } catch (err) {
      console.error(err)
    }
  }

  public async exportData({ auth, response }: HttpContextContract) {
    try {
      const data = await User.find(auth.user!.id)
      return response.stream(
        Readable.from(Buffer.from(JSON.stringify(data!.serialize()), 'utf8'))
      )
    } catch (err) {
      console.error(err)
    }
  }
}
