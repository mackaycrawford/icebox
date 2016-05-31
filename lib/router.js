Router.route('/', function () {
  this.render('listRecipes');
});

Router.route('/index', function () {
  this.render('listRecipes');
});
Router.route('/listRecipes', function () {
  this.render('listRecipes');
});

Router.route('/viewRecipe', function () {
  this.render('viewRecipe');
});

Router.route('/login', function () {
  this.render('login');
});