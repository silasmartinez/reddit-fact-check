const angular = require('angular');
const app = angular.module('app', [require('angular-route')]);

require('./controllers')(app);
require('./services')(app);
require('./router')(app);
require('./directives')(app);
