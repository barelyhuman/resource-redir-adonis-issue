import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Team from 'App/Models/Team'
import Membership, { ROLE } from 'App/Models/Membership'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {
  public async loginGet({
    view,
    session,
    auth,
    response,
  }: HttpContextContract) {
    try {
      await auth.use('web').authenticate()
      if (auth.use('web').isAuthenticated) {
        return response.redirect().toRoute('CheckinController.index')
      }
    } catch (err) {
      if (err.code !== 'E_INVALID_AUTH_SESSION') {
        session.flash('error', err.message)
      }
      return view.render('auth/login')
    }
  }

  public async loginPost({
    request,
    response,
    session,
    auth,
  }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const rememberMe = request.input('rememberMe')

    try {
      await auth.use('web').verifyCredentials(email, password)
    } catch (err) {
      session.flash('error', 'Invalid Credentials, please try again')
      return response.redirect('/login')
    }

    await auth.use('web').attempt(email, password, rememberMe)
    return response.redirect().toRoute('CheckinController.index')
  }

  public async registerGet({
    view,
    auth,
    session,
    response,
  }: HttpContextContract) {
    try {
      await auth.use('web').authenticate()
      if (auth.use('web').isAuthenticated) {
        return response.redirect('/dashboard')
      }
    } catch (err) {
      if (err.code !== 'E_INVALID_AUTH_SESSION') {
        session.flash('error', err.message)
      }
      return view.render('auth/register')
    }
  }

  public async registerPost({
    request,
    session,
    response,
  }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const userDetails = await User.findBy('email', email)

    if (userDetails) {
      session.flash(
        'error',
        'An account with the email already exists, try logging in instead'
      )
      return response.redirect('/register')
    }

    await Database.transaction(async trx => {
      const team = new Team()
      team.name = email + "'s Team"
      team.useTransaction(trx)

      const insertedTeamDetails = await team.save()

      const user = new User()

      user.email = email
      user.password = password

      user.useTransaction(trx)
      const insertedUserDetails = await user.save()

      const membership = new Membership()
      membership.role = ROLE.OWNER
      membership.userId = insertedUserDetails.id
      membership.teamId = insertedTeamDetails.id
      membership.useTransaction(trx)
      await membership.save()
    })

    session.flash('message', 'User registered, please login')
    return response.redirect('/login')
  }

  public async logoutGet({ auth, session, response }: HttpContextContract) {
    await auth.use('web').logout()
    session.flash('message', 'Logged Out')
    response.redirect('/login')
  }

  public async forgotPassword({}: HttpContextContract) {}
  public async resetPassword({}: HttpContextContract) {}
}
