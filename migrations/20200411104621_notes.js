
exports.up = function(knex) {
  return knex.schema
   .createTable('notes', function (table) {
       table.increments('id');
       table.integer('uid', 255).notNullable();
       table.string('title', 255).notNullable();
       table.string('note', 10000000);
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable("notes")
};
