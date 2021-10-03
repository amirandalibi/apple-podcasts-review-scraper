'use strict';

const podcast_id = '1393804410'; // change this to your podcast ID
const https = require('https');
const http = require('http');
const PORT = 8000;
const countries = require('./storefronts');

const server = http.createServer(async (req, res) => {
  let buffer = '';
  let i = 0;

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  countries.map(async (country) => {
    get_podcast(podcast_id, country)
      .then(buff => {
        buffer += buff;
        i++;
        if (i >= countries.length && buffer) {
          const valid_json = buffer.replace('}{', '},{');
          
          res.write(`[${valid_json}]`);
          res.end();
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});

// TODO: add pagination for podcasts with more reviews
async function get_podcast(id, store) {
  const url = `https://itunes.apple.com/${store.code}/rss/customerreviews/id=${id}/mostrecent/json`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let raw_data = '';

      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        raw_data += chunk;
        const json = JSON.parse(raw_data);
        const entry = json && json.feed.entry || '';
        const result = entry && Array.isArray(entry) ? 
          entry.map(e => podcast_review_object(e, store)) :
          podcast_review_object(entry, store);
        
        resolve(result);
      });

    }).on('error', (e) => {
      reject(e.message);
    });
  });
};

function podcast_review_object(e, c) {
  return e && JSON.stringify({
    'country': c.name,
    ...(e.author && { 'author': e.author.name.label }),
    ...(e.title && { 'title': e.title.label }),
    ...(e.content && { 'content': e.content.label }),
    ...(e['im:rating'] && { 'rating': e['im:rating'].label }),
    ...(e.updated && { 'updated': e.updated.label })
  })
}
