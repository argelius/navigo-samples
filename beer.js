const router = new Navigo(null, true);

let beers = [];
let beer = null;

function homePage(params) {
  const page = parseInt(params.page);
  document.querySelector('#main').innerHTML = `
    <ul>
      ${beers.map(x => `
        <li>
          <a href="/beer/${x.id}" data-navigo>${x.name}</a>
        </li>`
      ).join('')}
    </ul>
    ${page === 1 ? '<span>Prev</span>' : `<a href="/page/${page - 1}" data-navigo>Prev</a>`}
    <a href="/page/${page + 1}" data-navigo>Next</a>
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
    '/beer/:id',
    beerPage,
    {
      before: function (done, params) {
        const id = params.id;

        this.source = axios.CancelToken.source();
        this.request = axios.get(`https://api.punkapi.com/v2/beers/${id}`, {
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
  .on(
    '/page/:page',
    homePage,
    {
      before: function (done, params) {
        this.source = axios.CancelToken.source();
        this.request =
          axios.get(`https://api.punkapi.com/v2/beers?page=${params.page}`, {
          cancelToken: this.source.token
        })
          .then((response) => {
            beers = response.data;
            done();
          })
          .catch((err) => {
            // Cancelled
          });
      },
      leave: function () {
        this.source.cancel();
      }
    },
  )
  .on(
    '*',
    function () {
      router.navigate('/page/1');
    }
  )
  .resolve();
