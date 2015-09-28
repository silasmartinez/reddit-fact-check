export default ngModule => {
  ngModule.service('postService',
    function ($http, $q) {
      return ({
        getPost: getPost,
        evalPost: evalPost,
        getRemoteText: getRemoteText
      });

      function getPost (id) {
        var request = $http({
          method: 'get',
          url: '/api/posts/' + id
        });
        return (request.then(handleSuccess, handleError));
      }

      function getRemoteText (id) {
        var request = $http({
          method: 'get',
          url: '/api/alchemy/text',
          params: {
            postId: id
          }
        });
        return (request.then(handleSuccess, handleError));
      }

      function evalPost(id) {
        var request = $http.put('/api/alchemy/evalPost/' + id, {});
        return (request.then(handleSuccess, handleError));
      }

      function handleError (response) {
        if (
          !angular.isObject(response.data) || !response.data.message
        ) {
          return ($q.reject('An unknown error occurred.'));
        }
        return ($q.reject(response.data.message));
      }

      function handleSuccess (response) {
        return (response.data);
      }
    });
};
