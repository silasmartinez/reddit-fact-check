const marked = require('marked');

export default ngModule => {
  ngModule.controller('PostController',
    function ($scope, postService, $routeParams, $location) {
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

      $scope.getPostText = function (postId) {
        console.log('selected post: ', postId);
        postService.getRemoteText(postId)
          .then(function () {
            return postService.getPost($routeParams.postId);
          })
          .then(
            function (data) {
              applyRemoteData(data);
            });
      };
      $scope.evaluatePost = function (postId) {
        console.log('evaluating post: ', postId);
        postService.evalPost(postId)
          .then(function () {
            return postService.getPost($routeParams.postId);
          })
          .then(
          function (data) {
            applyRemoteData(data);
          });
      };
    }
  );
};
