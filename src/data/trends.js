
import axios from 'axios';

var trends = ['Nikkis butt', 'Kims butt' ]; //need a default value I think or the front page breaks
import request from 'request';





export default trends;

// this function get's the top 10 rss stories from google news.

// request.get('https://trends.google.com/trends/hottrends/visualize/internal/data', function(req, res) {
//   if (res.body) {
//     var top20Trends = JSON.parse(res.body).united_states; // getting top 20 US google trends
//     var options = {
//       object: true,
//       sanitize: true,
//       trim: true
//     }
//     top20Trends.forEach(function(current, index) {
//       request.get('https://news.google.com/news?cf=all&hl=en&pz=1&&q='+ current +'&ned=us&output=rss', function(req, res) {
//         var feed = parser.toJson(res.body, options);
//         console.dir(feed.rss);
//       });
//     });
//   } else {
//     console.error(res.error);
//   };
// });
