const Sequelize = require('sequelize');

module.exports = function(server)
{

  server.models = server.models || {};
  server.models.sequelize = new Sequelize('postgres://postgres@db/postgres');
  server.models.User = require("./User")(server);
  server.models.Vote = require("./Vote")(server);
  const {sequelize, User, Vote} = server.models;

  server.models.initDB = (callback)=>{
    const timeout = setInterval(()=>{
      sequelize
        .authenticate()
        .then(() => {
          clearInterval(timeout);
          // @see http://docs.sequelizejs.com/manual/tutorial/models-definition.html#database-synchronization
          // this will drop the table first and re-create it afterwards
          User.sync({force: true}).then(()=>{
            // http://docs.sequelizejs.com/class/lib/model.js~Model.html#static-method-create
            User.create({
              username: "foobar",
              password: "$2a$10$KgFhp4HAaBCRAYbFp5XYUOKrbO90yrpUQte4eyafk4Tu6mnZcNWiK",
            })
            Vote.sync({force: true}).then(()=>{
              console.log('DB SETUP OK');
              callback();
            });
          })
          console.log('Connection has been established successfully.');
        })
        .catch(err => {
          console.error('Unable to connect to the database:', err);
        });
    }, 1000)
  }; //initDB
}
