# Apple Podcasts review scraper
This is a simple Node.js script that scrapes reviews from multiple storefronts and return them in a single object.

## Why did I make this?

Apple doesn't aggregate reviews in one place and each country has its own database. This script is making multiple calls to an array of storefronts and return an aggregated list of reviews in a single view.
Right now I only use the countries that my podcast is popular in 🙈 but you are welcome to add more.
## Dependencies
- [Node.js](https://nodejs.org) 12.x
## Run the script

Install the dependency first by running
```
npm ci
```
Then run the script using

```
node index.js
```

Visit `http://localhost:8000`


## How do I find my podcast ID?

Visit the podcast page and grab the id from the url, use the picture below as reference.

<img width="1235" alt="Screen Shot 2021-10-02 at 2 46 17 PM" src="https://user-images.githubusercontent.com/4811912/135732677-ec728482-40a1-4fdf-8d17-5d6d00bfd273.png">
