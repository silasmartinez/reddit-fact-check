
export default ngModule => {
  ngModule.controller('MainController',
    function ($scope, redditService, $routeParams, $location) {
      $scope.posts = [];
      $scope.admin = '';

      function applyRemoteData (posts) {
        $scope.posts = posts;
      }

      if ($routeParams.subReddit) {
        loadRemoteData($routeParams.subReddit);
      } else {
        var baseData = [{
          title: 'Select a subreddit from the links to the left of this message, or log in to add subreddits.'
        }];
        applyRemoteData(baseData)
      }

      function loadRemoteData () {
        redditService.getSubReddit($routeParams.subReddit)
          .then(
          function (data) {
            applyRemoteData(data.posts);
          }
        );
      }

      $scope.selectPost = function (post) {
        console.log('selected post: ', post)
        $location.path('#/reddit');
      }
    }
  );
};
