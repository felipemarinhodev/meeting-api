import * as Yup from 'yup';
import Room from '../models/Room';

class RoomController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha ao validar.' });
    }

    console.log(`Nome da sala ${req.body.name}`);

    await Room.create(req.body);
    return res.json();
  }
}

export default new RoomController();
