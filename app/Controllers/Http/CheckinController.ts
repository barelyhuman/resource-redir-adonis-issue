import { DateTime } from 'luxon'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import Checkins from 'App/Models/Checkins'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

export default class CheckinController {
  public async index({ view, auth, response, session }: HttpContextContract) {
    const userDetails = await User.find(auth.user!.id)

    if (!userDetails?.timezone) {
      session.flash('error', 'Please set a timezone in your profile')
      return response.redirect().toRoute('ProfilesController.index')
    }

    const today = DateTime.now().setZone(userDetails.timezone)
    const startToday = today.startOf('day')
    const endToday = today.endOf('day')

    const checkInRunning = await Checkins.query()
      .where('user_id', auth.user!.id)
      .andWhereNull('ended_at')
      .andWhereBetween('started_at', [
        Database.raw(`'${startToday.toSQL()}'`),
        Database.raw(`'${endToday.toSQL()}'`),
      ])
      .first()

    const allCheckins = await Checkins.query().where('user_id', auth.user!.id)

    return view.render('checkins/index', {
      checkedIn: !!checkInRunning,
      checkins: (allCheckins || []).map(x => {
        const now = new Date().getTime()
        const start =
          x.startedAt != null ? x.startedAt.toJSDate().getTime() : now
        const end = x.endedAt != null ? x.endedAt.toJSDate().getTime() : now
        const inHours = 60 * 60 * 1000
        const duration = end - start
        const durationInHours = duration / inHours
        const fullDuration = 24
        const per = (durationInHours / fullDuration) * 100

        return {
          ...x.serialize(),
          durationInMills: duration,
          durationInHours: durationInHours,
          completedPercentage: per,
        }
      }),
      breadcrumbs: [
        {
          title: 'rman',
          link: '/',
        },
        {
          title: 'Check-ins',
          link: Route.makeUrl('CheckinController.index'),
        },
      ],
    })
  }

  public async start({ auth, session, response }: HttpContextContract) {
    const startPoint = DateTime.now()
    const userDetails = await User.find(auth.user!.id)
    const today = DateTime.now().setZone(userDetails.timezone)
    const startToday = today.startOf('day')
    const endToday = today.endOf('day')
    const checkInRunning = await Checkins.query()
      .where('user_id', auth.user!.id)
      .andWhereNull('ended_at')
      .andWhereBetween('started_at', [
        Database.raw(`'${startToday.toSQL()}'`),
        Database.raw(`'${endToday.toSQL()}'`),
      ])
      .first()

    if (checkInRunning) {
      session.flash('message', 'You are already checked in')
      return response.redirect().toRoute('CheckinController.index')
    }

    const checkin = new Checkins()
    checkin.startedAt = startPoint
    checkin.userId = auth.user!.id
    await checkin.save()
    return response.redirect().toRoute('CheckinController.index')
  }
  public async stop({ auth, response }: HttpContextContract) {
    const endPoint = DateTime.now()
    const userDetails = await User.find(auth.user!.id)

    if (!userDetails?.timezone) {
      session.flash('error', 'Please set a timezone in your profile')
      return response.redirect().toRoute('ProfilesController.index')
    }

    const today = DateTime.now().setZone(userDetails.timezone)
    const startToday = today.startOf('day')
    const endToday = today.endOf('day')
    const checkInRunning = await Checkins.query()
      .where('user_id', auth.user!.id)
      .andWhereNull('ended_at')
      .andWhereBetween('started_at', [
        Database.raw(`'${startToday.toSQL()}'`),
        Database.raw(`'${endToday.toSQL()}'`),
      ])
      .first()

    if (!checkInRunning) {
      return response.redirect().toRoute('CheckinController.index')
    }

    checkInRunning.endedAt = endPoint
    await checkInRunning.save()
    return response.redirect().toRoute('CheckinController.index')
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
