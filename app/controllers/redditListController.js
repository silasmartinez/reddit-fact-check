export default ngModule => {
  ngModule.controller('RedditListController',
    function ($scope, redditService) {
      $scope.subs = [];
      $scope.newSub = '';

      function applyRemoteData (subs) {
        $scope.newSub = '';
        $scope.subs = subs;
      }

      loadRemoteData();

      function loadRemoteData () {
        redditService.getSubList()
          .then(
          function (data) {
            applyRemoteData(data);
          }
        );
      }

      $scope.addSub = function (subReddit) {
        let subDetail = {
          name: subReddit,
          user: $scope.user.id
        }
        redditService.addSubReddit(subDetail)
          .then(function () {
            loadRemoteData();
          });
      };

      $scope.deleteSub = function (subReddit) {
        redditService.deleteSub(subReddit)
          .then(function () {
            loadRemoteData();
          });
      };
    }
  );
};
