const marked = require('marked');

export default ngModule => {
  ngModule.controller('PostController',
    function ($scope, postService, $routeParams, $location, $compile) {
      $scope.post = '';
      $scope.admin = '';

      function applyRemoteData (post) {
        if (post.text) {
          post.text = marked(post.text);
        }
        $scope.post = post;
      }

      if ($routeParams.postId) {
        loadRemoteData();
      } else {
        $location.path('/reddit');
      }

      function loadRemoteData () {
        postService.getPost($routeParams.postId)
          .then(
            function (data) {
              applyRemoteData(data);
            }
        );
      }

      $scope.getPostText = function (post) {
        console.log('selected post: ', post);
      };
    }
  );
};
