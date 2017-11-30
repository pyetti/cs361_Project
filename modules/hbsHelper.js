var hbs = require('handlebars');

module.exports = {
	registerHandlebars: registerHandlebarsFunction
}


function registerHandlebarsFunction (app, handlebars) {
	app.set('view engine', 'handlebars');
	app.engine('handlebars', handlebars.engine);
}

hbs.registerHelper('trimString', function(str, start, stop) {
  if (str.length > stop) { return str.substring(start, stop) + '...'; }
  return str;
});

hbs.registerHelper('ifEven', function(index) {
	if (index % 2 == 0) { return true; }
	return false;
});

hbs.registerHelper('ternary', function(value, test, a, b) {
	return value === test ? a : b;
});
