const Sequelize = require("sequelize");

module.exports = function(server){

server.models = server.models || {};
const {sequelize} = server.models;

const User = sequelize.define("user", {
  username: { type: Sequelize.STRING, primaryKey: true },
  password: Sequelize.STRING,
  // vote_id: {
  //   type: Sequelize.STRING,
  //   references: {
  //     // This is a reference to another model
  //     model: Vote,
  //     // This is the column name of the referenced model
  //     key: 'id',
  //     // This declares when to check the foreign key constraint. PostgreSQL only.
  //     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
  //   }
  // }
})

return User;

}
