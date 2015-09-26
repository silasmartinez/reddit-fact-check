
export default ngModule => {
  ngModule.controller('RedditListController',
    function ($scope) {
      $scope.reddits = [
        {name: 'javascript'},
        {name: 'running'},
        {name: 'space'}
      ];

      //function applyRemoteData (newRepos) {
      //  $scope.repos = newRepos.repos;
      //}
      //
      //loadRemoteData();
      //
      //function loadRemoteData () {
      //  repoService.getPublicRepositories()
      //    .then(
      //      function (repos) {
      //        applyRemoteData(repos);
      //      }
      //  );
      //
      //}
    }
  );
};
