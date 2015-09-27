export default ngModule => {
  ngModule.service('userService',
    function ($http, $q) {
      return ({
        getProfileInfo: getProfileInfo
      });

      function getProfileInfo () {
        var request = $http({
          method: 'get',
          url: '/api/profile'
        });
        return (request.then(handleSuccess, handleError));
      }

      function handleError (response) {
        if (
          !angular.isObject(response.data) || !response.data.message
        ) {
          return ( $q.reject('An unknown error occurred.'));
        }
        return ( $q.reject(response.data.message));
      }

      function handleSuccess (response) {
        return ( response.data);
      }
    });
};
