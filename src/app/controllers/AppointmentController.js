import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import Room from '../models/Room';

class AppointmentController {
  async index(req, res) {
    const limit = 20;
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      room: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date, room } = req.body;

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * Check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        room_id: room,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      date,
      room_id: room,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
