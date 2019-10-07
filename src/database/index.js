import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Room from '../app/models/Room';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment, Room];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  //  Responsável por conectar com a base de dados e carregar os models.
  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose
      .connect('mongodb://localhost:27017/meeting', {
        useNewUrlParser: true, // Pois estou utilizando uma url em um formato mais novo.
        useUnifiedTopology: true,
      })
      .then(() => console.log('DB Connected!'))
      .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
      });
  }
}

export default new Database();
