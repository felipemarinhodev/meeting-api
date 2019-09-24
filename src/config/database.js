module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'meeting',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
