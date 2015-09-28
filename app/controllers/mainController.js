export default ngModule => {
  ngModule.controller('MainController',
    function ($scope, redditService, $routeParams, $location) {
      $scope.posts = [];
      $scope.admin = '';

      function applyRemoteData (posts) {
        $scope.posts = posts;
      }

      //if ($routeParams.subReddit) {
        loadRemoteData($routeParams.subReddit);
      //} else {
      //  loadRemoteData();
      //}

      function loadRemoteData (target) {
      redditService.getSubReddit(target)
        .then(
            function (data) {
              if (data.posts) {
                applyRemoteData(data.posts);
              } else {
                applyRemoteData(data.reverse());
              }
            }
        );
      }

      $scope.selectPost = function (post) {
        if (post.comments) {
          delete (post['$$hashKey']);
          redditService.checkPost(post)
            .then(function (targetPost) {
              $location.path('/posts/' + targetPost.id);
            });
        }
      };
    }
  );
};
