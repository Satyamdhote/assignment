const {Sequelize} = require("sequelize");
const  taskModel  = require("./models/task.js");
require('dotenv').config();

const connection = async() => {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
      });

      let Task = null; 
      try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        Task = taskModel(sequelize);
        await sequelize.sync();
        console.log('Table Created');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports = { connection };
