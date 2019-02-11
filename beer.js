const router = new Navigo(null, true);

let beers = [];
let beer = null;

function encode(str) {
  str = str.toString();

  const rv = str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
    return '&#'+i.charCodeAt(0)+';';
  });

  return rv;
}

function homePage(params) {
  const page = parseInt(params.page);
  document.querySelector('#main').innerHTML = `
    <ul>
      ${beers.map(x => `
        <li>
          <a href="/beer/${encode(x.id)}" data-navigo>${encode(x.name)}</a>
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
    <h1>${encode(beer.name)}</h1>
    <p><strong>${encode(beer.tagline)}</strong></p>
    <img height="100" src="${encode(beer.image_url)}" alt="${encode(beer.name)}">
    <p>${encode(beer.description)}</p>
    <a href="#" onclick="history.back()" data-navigo>Go back</a>
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
