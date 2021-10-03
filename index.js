'use strict';

const podcast_id = '1393804410'; // change this to your podcast ID
const fetch = require('axios');
const http = require('http');
const PORT = 8000;
const countries = require('./storefronts');

const server = http.createServer(async (req, res) => {
  let buffer = '';
  let i = 0;

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  countries.map(async (country) => {
    const body = await get_podcast(podcast_id, country);

    buffer += body;
    i++;
    if (i >= countries.length && buffer) {
      const valid_json = buffer.replace('}{', '},{');
      
      res.write(`[${valid_json}]`);
      res.end();
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});

// TODO: add pagination for podcasts with more reviews
async function get_podcast(id, store) {
  const url = `https://itunes.apple.com/${store.code}/rss/customerreviews/id=${id}/mostrecent/json`;
  const options = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  };
  const review_json = await fetch.get(url, options);
  const entry = review_json.data && review_json.data.feed.entry ?
    review_json.data.feed.entry : [];
  
  return Array.isArray(entry) ? 
    entry.map(e => podcast_review_object(e, store)) :
    podcast_review_object(entry, store);
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
