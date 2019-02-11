const router = new Navigo(null, true);

function homePage() {
  document.querySelector('#main').innerHTML = `
    <h1>Home</h1>

    <p>This is the home page</p>

    <p>Read more about this app <a href="/about" data-navigo>here</p>
  `;

  router.updatePageLinks();
}

function aboutPage() {
  document.querySelector('#main').innerHTML = `
    <h1>About</h1>
    <hr>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  `
}

let interval = null;

router
  .on('/about', aboutPage)
  .on('*', homePage)
  .resolve();
