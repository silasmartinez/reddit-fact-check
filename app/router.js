
export default ngModule => {
  ngModule.config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/reddit', {
          template: require('./partials/reddits.html'),
          controller: 'MainController'
        })
        .when('/reddit/:subReddit', {
          template: require('./partials/reddits.html'),
          controller: 'MainController'
        })
        .when('/posts/:postId', {
          template: require('./partials/postView.html'),
          controller: 'PostController'
        })
        .otherwise({
          redirectTo: '/reddit'
        });
    }
  ]);
};
