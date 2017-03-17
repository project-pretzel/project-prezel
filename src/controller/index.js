var model = require('../model');

module.exports = {

  messages: {
    get: function (req, res) {
      model.messages.get(function(err, results) {
        if (err) { console.log("err message get", err);}
        res.json(results);
      });
    },
    post: function (req, res) {
      var params = [req.body.username, req.body.msgtext];
      model.messages.post(params, function(err, results) {
        if (err) { console.log("err message post", err);}
        res.sendStatus(201);
      });
    }
  },

  users: {
    get: function (req, res) {
      model.users.get(function(err, results) {
        if (err) { console.log("err users get", err);}
        res.json(results);
      });
    },
    post: function (req, res) {
      var params = [req.body.googleid, req.body.name, req.body.email, req.body.img];
      model.users.post(params, function(err, results) {
        if (err) { console.log("err users post", err);}
        console.log(results);
        res.sendStatus(201);
      });
    }
  }
  };
