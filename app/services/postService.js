
export default ngModule => {
  ngModule.service('repoService',
    function ($http, $q) {
      return ({
        getPost: getPublicRepositories,
        getPrivateRepositories: getPrivateRepositories
      });

      function getPublicRepositories () {
        var request = $http({
          method: 'get',
          url: '/api',
          params: {
            action: 'get'
          }
        });
        return (request.then(handleSuccess, handleError));
      }

      function getPrivateRepositories () {
        var request = $http({
          method: 'get',
          url: '/api/admin',
          params: {
            action: 'get'
          }
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
