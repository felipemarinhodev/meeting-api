import * as Yup from 'yup';
import Appointment from '../models/Appointment';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date } = req.body;

    const appointment = await Appointment.create({
      user_id: req.userId,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
