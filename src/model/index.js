var db = require('../db');

module.exports = {

  messages: {
    get: function (callback) {
      // fetch all messages
      // id , userid, msgtext, msgtime 
      var queryStr = 'select messages.id, users.name, messages.msgtext, messages.msgtime \
                      from messages left outer join users on (messages.userid = users.id) \
                      order by messages.id desc';
      db.dbConnection.query(queryStr, function(err, results) {
        callback(err, results);
      });
    },
    post: function (params, callback) {
      // create a message for a user id based on the given username
      // expect params to be {name(from users): '', msgtext: ''}
      var queryStr = 'insert into messages(userid, msgtext, msgtime) \
                      values ((select id from users where name = ? limit 1), ?, now())';
      db.dbConnection.query(queryStr, params, function(err, results) {
        callback(err, results);
      });
    }
  },
  users: {
    get: function (callback) {
      // fetch all users
      //id, googleid, name, email, img
      var queryStr = 'select * from users';
      db.dbConnection.query(queryStr, function(err, results) {
        callback(err, results);
      });
    },
    post: function (params, callback) {
      // create a user
      // expect params to be {googleid: '', name: '', email: '', img: ''}
      console.log('>>>>>>>>>>>>>>>', params);
      var queryStr = 'insert into users(googleid, name, email, img) values (?, ?, ?, ?)';
      db.dbConnection.query(queryStr, params, function(err, results) {
        callback(err, results);
      });
    }
  }
  };