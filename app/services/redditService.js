
export default ngModule => {
  ngModule.service('redditService',
    function ($http, $q) {
      // Return public API.
      return ({
        getSubList: getSubList,
        getSubReddit: getSubReddit
      });

      function getSubReddit (sub) {
        var request = $http({
          method: 'get',
          url: '/api/reddit',
          params: {
            sub: sub
          }
        });
        return (request.then(handleSuccess, handleError));
      }

      function getSubList () {
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
