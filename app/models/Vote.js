const Sequelize = require("sequelize");

module.exports = function(server){

server.models = server.models || {};
const {sequelize, User} = server.models;

const Vote = sequelize.define('vote', {
  id: { type: Sequelize.STRING, primaryKey: true },
  vote: Sequelize.STRING,
  user_id: {
    type: Sequelize.STRING,
    references: {
      // This is a reference to another model
      model: User,
      // This is the column name of the referenced model
      key: 'username',
      // This declares when to check the foreign key constraint. PostgreSQL only.
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
})

return Vote;

}
