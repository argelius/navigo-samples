const router = new Navigo(null, true);

let beer = null;

function homePage() {
  document.querySelector('#main').innerHTML = `
    <a href="/random" data-navigo>Random beer</a>
  `;

  router.updatePageLinks();
}

function randomBeerPage() {

  document.querySelector('#main').innerHTML = `
    <h1>${beer.name}</h1>
    <p><strong>${beer.tagline}</strong></p>
    <img height="100" src="${beer.image_url}" alt="${beer.name}">
    <p>${beer.description}</p>
    <a href="/" data-navigo>Go back</a>
  `;

  router.updatePageLinks();
}

function beerPage() {
  document.querySelector('#main').innerHTML = `
    <h1>${beer.name}</h1>
    <p><strong>${beer.tagline}</strong></p>
    <img height="100" src="${beer.image_url}" alt="${beer.name}">
    <p>${beer.description}</p>
    <a href="/" data-navigo>Go back</a>
  `;

  router.updatePageLinks();
}

router
  .on(
    '/random',
    randomBeerPage,
    {
      before: function (done, params) {
        this.source = axios.CancelToken.source();
        this.request = axios.get('https://api.punkapi.com/v2/beers/random', {
          cancelToken: this.source.token
        })
          .then((response) => {
            beer = response.data[0];
            done();
          })
          .catch((err) => {
            // Cancelled
          });

      },
      leave: function () {
        this.source.cancel();
      }
    }
  )
  .on('*', homePage)
  .resolve();
