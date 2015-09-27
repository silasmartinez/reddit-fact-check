export default ngModule => {
  ngModule.controller('visibilityControl',
    function ($scope, $http, $location) {
      var formData = {};

      $scope.submitForm = function () {
        console.log($scope.repos);
        // console.log($scope.formData);
        formData.localNotes = $scope.repos.localNotes;
        formData.visible = $scope.repos.visible;
        formData.npm = $scope.repos.npm;
        console.log(formData);
        $http({
          url: '/api/' + $scope.repoId + '/update',
          data: formData,
          method: 'post'
        }).then(function (data) {
          console.log('OK', data);
          $location.path('/repos');

        }).catch(function (err) {
          'ERR', console.log(err);
        });
      };
    });
};
