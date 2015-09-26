
export default ngModule => {
  ngModule.controller('ProfileController',
    function ($scope, userService) {
      $scope.user = {};

      function applyRemoteData (profileData) {
        $scope.user = profileData.user;
      }

      loadRemoteData();

      function loadRemoteData () {
        userService.getProfileInfo()
          .then(
            function (profile) {
              applyRemoteData(profile);
            }
        );

      }
    }
  );
};
