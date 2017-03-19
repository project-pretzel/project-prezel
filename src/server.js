// src/server.js

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import NotFoundPage from './components/NotFoundPage';
import controller from './controller/index.js';
import bodyparser from 'body-parser'
import request from 'request';
import parser from 'xml2json';
import getTop20Trends from './data/trends.js';

// initialize the server and configure support for ejs templates

const app = new Express();
const server = new Server(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// getTop20Trends(function(err, response) {
//   console.log(response);
// })

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'static')));
app.use(bodyparser.json());

app.get('/messages', controller.messages.get);
app.post('/messages', controller.messages.post);
app.get('/users', controller.users.get);
app.post('/users', controller.users.post);

// universal routing and rendering
app.get('*', (req, res) => {
  match(
    { routes, location: req.url },
    (err, redirectLocation, renderProps) => {

      // in case of error display the error message
      if (err) {
        return res.status(500).send(err.message);
      }

      // in case of redirect propagate the redirect to the browser
      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      // generate the React markup for the current route
      let markup;
      if (renderProps) {
        // if the current route matched we have renderProps
        markup = renderToString(<RouterContext {...renderProps}/>);
      } else {
        // otherwise we can render a 404 page
        markup = renderToString(<NotFoundPage/>);
        res.status(404);
      }

      // render the index template with the embedded React markup
      return res.render('index', { markup });
    }
  );
});

request.get('https://trends.google.com/trends/hottrends/visualize/internal/data', function(req, res) {
  if (res.body) {
    var top20Trends = JSON.parse(res.body).united_states; // getting top 20 US google trends
    var options = {
      object: true,
      sanitize: true,
      trim: true
    }
    
    /*top20Trends.forEach(function(current, index) {
      request.get('https://news.google.com/news?cf=all&hl=en&pz=1&&q='+ current +'&ned=us&output=rss', function(req, res) {
        var feed = parser.toJson(res.body, options);
     //   console.dir(feed.rss);
      });
    })*/;
  } else {
    console.error(res.error);
  };
});

//server requests for user/message sql db queries
app.get('/messages', controller.messages.get);
app.post('/messages', controller.messages.post);
app.get('/users', controller.users.get);
app.post('/users', controller.users.post);

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});
