export default ngModule => {
  ngModule.service('postService',
    function ($http, $q) {
      return ({
        getPost: getPost,
        getPrivateRepositories: getPrivateRepositories
      });

      function getPost (id) {
        var request = $http({
          method: 'get',
          url: '/api/posts/' + id
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
