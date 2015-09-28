var axios = require('axios');
var endpoints = require('./endpoints');
var querystring = require('querystring');

var proto = {
  lookup: function (callType, inputType, inputData, options) {
    if (!endpoints[callType]) {
      throw new Error('alchemy: invalid api call: ' + callType);
    } else if (!endpoints[callType][inputType]) {
      throw new Error('alchemy: invalid input type: ' + inputType);
    } else if (!inputData) {
      throw new Error('alchemy: no input data specified');
    } else {
      var params = {
        outputMode: 'json',
        apikey: this.apiKey
      };

      var requestUrl = this.getBaseURL();
      requestUrl += endpoints[callType][inputType] + '?';
      requestUrl += querystring.stringify(params);
      if (callType !== 'news') {
        requestUrl += '&' + inputType + '=' + inputData;
      } else if (!options) {
        throw new Error('alchemy: options must be supplied when calling news API');
      }
      if (options) {
        requestUrl += '&' + querystring.stringify(options);
      }
      if (callType !== 'news') {
        return axios.get(requestUrl);
      }

    }
  },
  getBaseURL: function () {
    return 'http://access.alchemyapi.com/calls';
  }

};

var alchemy = function (key) {
  var alchemyAPI = Object.create(proto);
  alchemyAPI.apiKey = key;
  return alchemyAPI;
};

module.exports = alchemy;
