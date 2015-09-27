export default ngModule => {
  ngModule.service('redditService',
    function ($http, $q) {
      // Return public API.
      return ({
        getSubList: getSubList,
        getSubReddit: getSubReddit,
        checkPost: checkPost
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

      function checkPost (post) {
        console.log(post);
        var request = $http({
          method: 'post',
          url: '/api/reddit',
          data: post
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
