var API = module.exports;
window.API = API;
/**
 * @TODO
 * プロトコルはhttpsオンリー?
 */
API.ENDPOINT = '//qiita.com/api/v2';

//------------------------------------------------------------------------------
// Authorization



//------------------------------------------------------------------------------
// Core functions

/**
 * HTTP GET
 * @param {string} url
 * @param {Object} params
 */
API.pGet = function(url, params) {
    if (params) {
        url += '?'+API.encodeURLParam(params);
    }
    return fetch(API.ENDPOINT + url)
};

/**
 * create url parameter query from dictionary
 * @param {Object} params
 * @return {string} query
 */
API.encodeURLParam = function(params) {
    return Object.keys(params)
        .map(function(key){
            return key + '=' + encodeURIComponent(params[key]);
        })
        .join('&');
};
