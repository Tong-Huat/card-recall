/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.scss */ "./src/styles.scss");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);

 // global value that holds info about the current hand.

var currentGame = null;
var displayedCards = [];
var selectedCards = [];
var numOfCards; // query for game,card, error and instrutions container

var gameContainer = document.querySelector('#game-container');
var cardSelectionContainer = document.querySelector('#select-container');
var errorContainer = document.querySelector('#error-container');
var gameInfoContainer = document.querySelector('#info-container'); // create registrations on landing page

var registrationContainer = document.createElement('div');
registrationContainer.classList.add('container', 'form-signin', 'bg-light'); // create registration elements: user name and pw

var registrationText = document.createElement('h2');
registrationText.innerText = 'Registration Form';
var regUserNameDiv = document.createElement('div');
regUserNameDiv.classList.add('form-floating');
var regUserName = document.createElement('input');
regUserName.placeholder = 'Input Username';
var regPasswordDiv = document.createElement('div');
regPasswordDiv.classList.add('form-floating');
var regPassword = document.createElement('input');
regPassword.placeholder = 'Input Password';
var registrationBtn = document.createElement('button');
registrationBtn.innerText = 'Register';
regUserNameDiv.appendChild(regUserName);
regPasswordDiv.appendChild(regPassword);
registrationContainer.appendChild(registrationText);
registrationContainer.appendChild(regUserNameDiv);
registrationContainer.appendChild(regPasswordDiv);
registrationContainer.appendChild(registrationBtn); // ************** create login on landing page **************//

var loginContainer = document.createElement('div');
loginContainer.classList.add('container', 'form-signin', 'bg-light'); // create login elements: UserName and pw

var loginText = document.createElement('h2');
loginText.innerText = 'Login Form';
var userNameDiv = document.createElement('div');
userNameDiv.classList.add('form-floating');
var userName = document.createElement('input');
userName.placeholder = 'Input User Name';
var passwordDiv = document.createElement('div');
passwordDiv.classList.add('form-floating');
var password = document.createElement('input');
password.placeholder = 'Input Password';
var loginBtn = document.createElement('button');
loginBtn.innerText = 'Login';
userNameDiv.appendChild(userName);
passwordDiv.appendChild(password);
loginContainer.appendChild(loginText);
loginContainer.appendChild(userNameDiv);
loginContainer.appendChild(passwordDiv);
loginContainer.appendChild(loginBtn);

var checkLoggedIn = function checkLoggedIn() {
  axios__WEBPACK_IMPORTED_MODULE_1___default().get('/isloggedin').then(function (response) {
    console.log('response from login :>> ', response);

    if (response.data.isLoggedIn === true) {
      document.body.appendChild(diffContainer);
      document.body.appendChild(playBtn);
    } else {
      // render other buttons
      document.body.appendChild(registrationContainer);
      document.body.appendChild(loginContainer);
    }
  })["catch"](function (error) {
    return console.log('error from logging in', error);
  });
}; // ************** create difficulty selection elements **************//


var diffContainer = document.createElement('div');
diffContainer.classList.add('container', 'bg-light', 'cardContainer');
var bgnBtn = document.createElement('input');
bgnBtn.type = 'radio';
bgnBtn.name = 'difficulty';
bgnBtn.checked = false;
bgnBtn.value = 'beginner';
var bgnLabel = document.createElement('label');
var bgnDescription = document.createTextNode('Beginner');
bgnLabel.appendChild(bgnDescription);
var advBtn = document.createElement('input');
advBtn.type = 'radio';
advBtn.name = 'difficulty';
advBtn.checked = false;
advBtn.value = 'advanced';
var advLabel = document.createElement('label');
var advDescription = document.createTextNode('Advanced');
advLabel.appendChild(advDescription);
var expBtn = document.createElement('input');
expBtn.type = 'radio';
expBtn.name = 'difficulty';
expBtn.checked = false;
expBtn.value = 'expert';
var expLabel = document.createElement('label');
var expDescription = document.createTextNode('Expert');
expLabel.appendChild(expDescription);
diffContainer.appendChild(bgnBtn);
diffContainer.appendChild(bgnLabel);
diffContainer.appendChild(advBtn);
diffContainer.appendChild(advLabel);
diffContainer.appendChild(expBtn);
diffContainer.appendChild(expLabel); // create play game btn to start 1st game

var playBtn = document.createElement('button');
playBtn.innerText = 'Play Game'; // ************** create card and card holders **************//

var flashedCards = document.createElement('h5');
flashedCards.classList.add('flashedCard');
var flashedCardContainer = document.createElement('div');
flashedCardContainer.classList.add('container', 'bg-light', 'cardContainer');
flashedCardContainer.appendChild(flashedCards);
var allCards = document.createElement('h5');
var allCardsContainer = document.createElement('div');
allCardsContainer.classList.add('container', 'bg-light', 'cardContainer');
allCardsContainer.innerText = "Select the card order";
var resultFlashedCards = document.createElement('div');
resultFlashedCards.classList.add('resultCard'); // create submit ans button

var submitAnsBtn = document.createElement('button');
submitAnsBtn.innerText = 'Submit';
var resultOutcome = document.createElement('h3'); // create play again btn

var playAgainBtn = document.createElement('button');
playAgainBtn.innerText = 'Play Again'; // create card function

var createCard = function createCard(cardInfo) {
  var suit = document.createElement('div');
  suit.classList.add('suit');
  suit.innerText = cardInfo.suitSymbol;
  var name = document.createElement('div');
  name.classList.add('name', cardInfo.color);
  name.innerText = cardInfo.displayName;
  var card = document.createElement('div');
  card.classList.add('card');
  card.appendChild(name);
  card.appendChild(suit);
  return card;
}; // create num of cards to be flashed according to difficulty level 


var flashingCards = function flashingCards(_ref, gameLevel) {
  var flashCards = _ref.flashCards;
  var cardElement; // manipulate DOM

  if (gameLevel == 'beginner') {
    numOfCards = 5;

    for (var i = 0; i < numOfCards; i += 1) {
      displayedCards.push(flashCards[i]);
      cardElement = createCard(flashCards[i]);
      cardElement.id = "card".concat(i);
      cardElement.classList.toggle('beginner');
      flashedCards.appendChild(cardElement);
      console.log('flashCards :>> ', flashCards);
      console.log('displayedCards :>> ', displayedCards);
      setTimeout(function () {
        gameContainer.innerText = '';
      }, 5000);
    }

    ;
  } else if (gameLevel == 'advanced') {
    numOfCards = 7;

    for (var _i = 0; _i < numOfCards; _i += 1) {
      displayedCards.push(flashCards[_i]);
      cardElement = createCard(flashCards[_i]);
      cardElement.id = "card".concat(_i);
      cardElement.classList.toggle('advanced');
      flashedCards.appendChild(cardElement);
      console.log('flashCards :>> ', flashCards);
      console.log('displayedCards :>> ', displayedCards);
      setTimeout(function () {
        gameContainer.innerText = '';
      }, 7000);
    }

    ;
  } else {
    numOfCards = 10;

    for (var _i2 = 0; _i2 < numOfCards; _i2 += 1) {
      displayedCards.push(flashCards[_i2]);
      cardElement = createCard(flashCards[_i2]);
      cardElement.id = "card".concat(_i2);
      cardElement.classList.toggle('expert');
      flashedCards.appendChild(cardElement);
      console.log('flashCards :>> ', flashCards);
      console.log('displayedCards :>> ', displayedCards);
      setTimeout(function () {
        gameContainer.innerText = '';
      }, 10000);
    }

    ;
  }

  console.log('flashCards :>> ', flashCards);
  flashedCardContainer.appendChild(flashedCards);
  gameContainer.appendChild(flashedCardContainer);
}; // display all cards in array for user to select order


var displayCards = function displayCards(_ref2) {
  var flashCards = _ref2.flashCards;
  var cardElement; // shuffle the mixed flash card array

  for (var i = flashCards.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref3 = [flashCards[j], flashCards[i]];
    flashCards[i] = _ref3[0];
    flashCards[j] = _ref3[1];
  } // append all 10 cards for selection


  for (var _i3 = 0; _i3 < flashCards.length; _i3 += 1) {
    cardElement = createCard(flashCards[_i3]);
    cardElement.id = "card".concat(_i3);
    allCards.appendChild(cardElement);
  }

  allCardsContainer.appendChild(allCards);
  cardSelectionContainer.appendChild(allCardsContainer);
}; // event listener for all displayed cards slated for selection


var cardSelection = function cardSelection() {
  var card0 = document.getElementById('card0');
  card0.addEventListener('click', cardSelected);
  var card1 = document.getElementById('card1');
  card1.addEventListener('click', cardSelected);
  var card2 = document.getElementById('card2');
  card2.addEventListener('click', cardSelected);
  var card3 = document.getElementById('card3');
  card3.addEventListener('click', cardSelected);
  var card4 = document.getElementById('card4');
  card4.addEventListener('click', cardSelected);
  var card5 = document.getElementById('card5');
  card5.addEventListener('click', cardSelected);
  var card6 = document.getElementById('card6');
  card6.addEventListener('click', cardSelected);
  var card7 = document.getElementById('card7');
  card7.addEventListener('click', cardSelected);
  var card8 = document.getElementById('card8');
  card8.addEventListener('click', cardSelected);
  var card9 = document.getElementById('card9');
  card9.addEventListener('click', cardSelected);
}; // selected cards to be appended to solution array and disappear


var cardSelected = function cardSelected(e) {
  document.getElementById(e.currentTarget.id).remove();
  var displayName = e.currentTarget.firstChild.innerText;
  var cardSuitSymbol = e.currentTarget.lastChild.innerText;
  console.log(e.currentTarget.firstChild.innerText);
  console.log(e.currentTarget.lastChild.innerText);
  selectedCards.push({
    displayName: displayName,
    suitSymbol: cardSuitSymbol
  });
  console.log('selectedCards :>> ', selectedCards);
};

var displayFinalResults = function displayFinalResults() {
  var cardElement;

  for (var i = 0; i < selectedCards.length; i += 1) {
    cardElement = createCard(selectedCards[i]);
    allCards.appendChild(cardElement);
  }

  for (var _i4 = 0; _i4 < displayedCards.length; _i4 += 1) {
    cardElement = createCard(displayedCards[_i4]);
    resultFlashedCards.appendChild(cardElement);
  }

  flashedCardContainer.innerText = "Actual Card Order";
  flashedCardContainer.appendChild(resultFlashedCards);
  gameContainer.appendChild(flashedCardContainer);
  allCardsContainer.innerText = "Your Selected Order";
  allCardsContainer.appendChild(allCards);
  cardSelectionContainer.appendChild(allCardsContainer);
};

registrationBtn.addEventListener('click', function () {
  var registerData = {
    name: regUserName.value,
    password: regPassword.value
  };
  console.log(registerData);
  axios__WEBPACK_IMPORTED_MODULE_1___default().post('/register', registerData).then(function (response) {
    console.log('hellloow>>>>>>', response.data);

    if (response.data.error) {
      throw response.data.error;
    } else {
      document.body.removeChild(registrationContainer);
      registrationContainer.remove();
    }
  })["catch"](function (error) {
    errorContainer.innerHTML = '<p style="color:red">Invalid Registration Details</p>';
    console.log(error);
  });
  checkLoggedIn();
});
loginBtn.addEventListener('click', function () {
  var loginData = {
    name: userName.value,
    password: password.value
  };
  console.log(loginData);
  axios__WEBPACK_IMPORTED_MODULE_1___default().post('/login', loginData).then(function (response) {
    console.log('hellloow>>>>>>', response.data);

    if (response.data.error) {
      throw response.data.error;
    } else {
      gameInfoContainer.classList.add('container', 'form-signin', 'bg-light');
      gameInfoContainer.innerHTML = '-A series of cards will be flashed for 1 sec each <br>-At the end of the flashing, pls select the cards in the order that they were flashed. <br> -To win the game, the exact order of the cards must be correct <br> Beginner - 5 cards <br> Advanced - 7 cards <br> Expert - 10 cards';
      document.body.appendChild(diffContainer);
      document.body.appendChild(playBtn);
      loginContainer.innerHTML = '';
      loginContainer.remove();
      registrationContainer.remove();
      errorContainer.remove(); // document.body.removeChild(loginContainer);
      // document.body.removeChild(registrationContainer);
      // document.body.removeChild(errorContainer);
    }
  })["catch"](function (error) {
    errorContainer.innerHTML = '<p style="color:red">Invalid Login Details</p>';
    console.log(error);
  });
  checkLoggedIn();
});
playBtn.addEventListener('click', function () {
  document.body.removeChild(playBtn); // document.body.removeChild(gameInfoContainer);

  gameContainer.appendChild(flashedCardContainer); // Make a request to create a new game

  axios__WEBPACK_IMPORTED_MODULE_1___default().post('/games').then(function (response) {
    // set the global value to the new game.
    currentGame = response.data;
    console.log('currentGame>>>>>>>', currentGame);
    var difficulty = document.querySelector('input[name="difficulty"]:checked');
    var gameLevel = difficulty.value;
    document.body.removeChild(diffContainer); // display it out to the user

    flashingCards(currentGame, gameLevel);

    if (numOfCards == 5) {
      setTimeout(function () {
        displayCards(currentGame);
        cardSelection();
        document.body.appendChild(submitAnsBtn);
      }, 6000);
    } else if (numOfCards == 7) {
      setTimeout(function () {
        displayCards(currentGame);
        cardSelection();
        document.body.appendChild(submitAnsBtn);
      }, 8000);
    } else {
      setTimeout(function () {
        displayCards(currentGame);
        cardSelection();
        document.body.appendChild(submitAnsBtn);
      }, 10000);
    }
  })["catch"](function (error) {
    // handle error
    console.log(error);
  });
});
submitAnsBtn.addEventListener('click', function () {
  var cardDifference = displayedCards.length - selectedCards.length;

  if (displayedCards.length > selectedCards.length) {
    alert("Number of selected cards is lesser that those displayed. Pls select ".concat(cardDifference, " more cards!"));
  } else {
    allCards.innerHTML = "";
    flashedCards.innerHTML = "";
    cardSelectionContainer.removeChild(allCardsContainer);
    var count = 0; // check for win conditions

    for (var i = 0; i < displayedCards.length; i += 1) {
      if (displayedCards[i].displayName === selectedCards[i].displayName && displayedCards[i].suitSymbol === selectedCards[i].suitSymbol) {
        count += 1;
      }
    }

    if (count === displayedCards.length) {
      resultOutcome.innerText = 'You won';
      console.log('you won');
      document.body.removeChild(submitAnsBtn);
    } else {
      resultOutcome.innerText = 'You lost';
      console.log('you lost ');
      document.body.removeChild(submitAnsBtn);
    }

    displayFinalResults();
    document.body.appendChild(resultOutcome);
    document.body.appendChild(playAgainBtn);
  }
});
playAgainBtn.addEventListener('click', function () {
  flashedCardContainer.innerText = "";
  allCardsContainer.innerText = "Select the card order";
  allCards.innerHTML = "";
  resultFlashedCards.innerHTML = "";
  cardSelectionContainer.removeChild(allCardsContainer);
  gameContainer.removeChild(flashedCardContainer);
  document.body.removeChild(resultOutcome);
  document.body.removeChild(playAgainBtn);
  currentGame = null;
  displayedCards = [];
  selectedCards = [];
  document.body.appendChild(diffContainer);
  document.body.appendChild(playBtn);
});
checkLoggedIn();

/***/ }),

/***/ "./src/styles.scss":
/*!*************************!*\
  !*** ./src/styles.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL3NyYy9zdHlsZXMuc2NzcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6WyJjdXJyZW50R2FtZSIsImRpc3BsYXllZENhcmRzIiwic2VsZWN0ZWRDYXJkcyIsIm51bU9mQ2FyZHMiLCJnYW1lQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY2FyZFNlbGVjdGlvbkNvbnRhaW5lciIsImVycm9yQ29udGFpbmVyIiwiZ2FtZUluZm9Db250YWluZXIiLCJyZWdpc3RyYXRpb25Db250YWluZXIiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwicmVnaXN0cmF0aW9uVGV4dCIsImlubmVyVGV4dCIsInJlZ1VzZXJOYW1lRGl2IiwicmVnVXNlck5hbWUiLCJwbGFjZWhvbGRlciIsInJlZ1Bhc3N3b3JkRGl2IiwicmVnUGFzc3dvcmQiLCJyZWdpc3RyYXRpb25CdG4iLCJhcHBlbmRDaGlsZCIsImxvZ2luQ29udGFpbmVyIiwibG9naW5UZXh0IiwidXNlck5hbWVEaXYiLCJ1c2VyTmFtZSIsInBhc3N3b3JkRGl2IiwicGFzc3dvcmQiLCJsb2dpbkJ0biIsImNoZWNrTG9nZ2VkSW4iLCJheGlvcyIsInRoZW4iLCJyZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJkYXRhIiwiaXNMb2dnZWRJbiIsImJvZHkiLCJkaWZmQ29udGFpbmVyIiwicGxheUJ0biIsImVycm9yIiwiYmduQnRuIiwidHlwZSIsIm5hbWUiLCJjaGVja2VkIiwidmFsdWUiLCJiZ25MYWJlbCIsImJnbkRlc2NyaXB0aW9uIiwiY3JlYXRlVGV4dE5vZGUiLCJhZHZCdG4iLCJhZHZMYWJlbCIsImFkdkRlc2NyaXB0aW9uIiwiZXhwQnRuIiwiZXhwTGFiZWwiLCJleHBEZXNjcmlwdGlvbiIsImZsYXNoZWRDYXJkcyIsImZsYXNoZWRDYXJkQ29udGFpbmVyIiwiYWxsQ2FyZHMiLCJhbGxDYXJkc0NvbnRhaW5lciIsInJlc3VsdEZsYXNoZWRDYXJkcyIsInN1Ym1pdEFuc0J0biIsInJlc3VsdE91dGNvbWUiLCJwbGF5QWdhaW5CdG4iLCJjcmVhdGVDYXJkIiwiY2FyZEluZm8iLCJzdWl0Iiwic3VpdFN5bWJvbCIsImNvbG9yIiwiZGlzcGxheU5hbWUiLCJjYXJkIiwiZmxhc2hpbmdDYXJkcyIsImdhbWVMZXZlbCIsImZsYXNoQ2FyZHMiLCJjYXJkRWxlbWVudCIsImkiLCJwdXNoIiwiaWQiLCJ0b2dnbGUiLCJzZXRUaW1lb3V0IiwiZGlzcGxheUNhcmRzIiwibGVuZ3RoIiwiaiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNhcmRTZWxlY3Rpb24iLCJjYXJkMCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNhcmRTZWxlY3RlZCIsImNhcmQxIiwiY2FyZDIiLCJjYXJkMyIsImNhcmQ0IiwiY2FyZDUiLCJjYXJkNiIsImNhcmQ3IiwiY2FyZDgiLCJjYXJkOSIsImUiLCJjdXJyZW50VGFyZ2V0IiwicmVtb3ZlIiwiZmlyc3RDaGlsZCIsImNhcmRTdWl0U3ltYm9sIiwibGFzdENoaWxkIiwiZGlzcGxheUZpbmFsUmVzdWx0cyIsInJlZ2lzdGVyRGF0YSIsInJlbW92ZUNoaWxkIiwiaW5uZXJIVE1MIiwibG9naW5EYXRhIiwiZGlmZmljdWx0eSIsImNhcmREaWZmZXJlbmNlIiwiYWxlcnQiLCJjb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsNEZBQXVDLEM7Ozs7Ozs7Ozs7O0FDQTFCOztBQUViLFlBQVksbUJBQU8sQ0FBQyxxREFBWTtBQUNoQyxhQUFhLG1CQUFPLENBQUMsaUVBQWtCO0FBQ3ZDLGNBQWMsbUJBQU8sQ0FBQyx5RUFBc0I7QUFDNUMsZUFBZSxtQkFBTyxDQUFDLDJFQUF1QjtBQUM5QyxvQkFBb0IsbUJBQU8sQ0FBQyw2RUFBdUI7QUFDbkQsbUJBQW1CLG1CQUFPLENBQUMsbUZBQTJCO0FBQ3RELHNCQUFzQixtQkFBTyxDQUFDLHlGQUE4QjtBQUM1RCxrQkFBa0IsbUJBQU8sQ0FBQyx5RUFB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QStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6Im1haW4tM2ViNzU5OTM3MmNiMzNlNGZiN2EuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBjb29raWVzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2Nvb2tpZXMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlKCcuLi9jb3JlL2J1aWxkRnVsbFBhdGgnKTtcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzJyk7XG52YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbicpO1xudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcbiAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9XG5cbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCA/IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChjb25maWcuYXV0aC5wYXNzd29yZCkpIDogJyc7XG4gICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuICAgIH1cblxuICAgIHZhciBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblxuICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcbiAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcbiAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGJyb3dzZXIgcmVxdWVzdCBjYW5jZWxsYXRpb24gKGFzIG9wcG9zZWQgdG8gYSBtYW51YWwgY2FuY2VsbGF0aW9uKVxuICAgIHJlcXVlc3Qub25hYm9ydCA9IGZ1bmN0aW9uIGhhbmRsZUFib3J0KCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdSZXF1ZXN0IGFib3J0ZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHZhciB0aW1lb3V0RXJyb3JNZXNzYWdlID0gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJztcbiAgICAgIGlmIChjb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2U7XG4gICAgICB9XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IodGltZW91dEVycm9yTWVzc2FnZSwgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgICB2YXIgeHNyZlZhbHVlID0gKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgaXNVUkxTYW1lT3JpZ2luKGZ1bGxQYXRoKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cbiAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh4c3JmVmFsdWUpIHtcbiAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3REYXRhID09PSAndW5kZWZpbmVkJyAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3RcbiAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcud2l0aENyZWRlbnRpYWxzKSkge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSAhIWNvbmZpZy53aXRoQ3JlZGVudGlhbHM7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIEV4cGVjdGVkIERPTUV4Y2VwdGlvbiB0aHJvd24gYnkgYnJvd3NlcnMgbm90IGNvbXBhdGlibGUgWE1MSHR0cFJlcXVlc3QgTGV2ZWwgMi5cbiAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cbiAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG4gICAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXJlcXVlc3REYXRhKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL2NvcmUvbWVyZ2VDb25maWcnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoYXhpb3MuZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG4vLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5heGlvcy5pc0F4aW9zRXJyb3IgPSByZXF1aXJlKCcuL2hlbHBlcnMvaXNBeGlvc0Vycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cbi8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICovXG5DYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG4gIHZhciBjYW5jZWw7XG4gIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgY2FuY2VsID0gYztcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdG9rZW46IHRva2VuLFxuICAgIGNhbmNlbDogY2FuY2VsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBJbnRlcmNlcHRvck1hbmFnZXIgPSByZXF1aXJlKCcuL0ludGVyY2VwdG9yTWFuYWdlcicpO1xudmFyIGRpc3BhdGNoUmVxdWVzdCA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hSZXF1ZXN0Jyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL21lcmdlQ29uZmlnJyk7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG4gIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcbiAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcbiAgfTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcbiAqL1xuQXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25maWcgPSBhcmd1bWVudHNbMV0gfHwge307XG4gICAgY29uZmlnLnVybCA9IGFyZ3VtZW50c1swXTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gIH1cblxuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuXG4gIC8vIFNldCBjb25maWcubWV0aG9kXG4gIGlmIChjb25maWcubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRzLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSB0aGlzLmRlZmF1bHRzLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZy5tZXRob2QgPSAnZ2V0JztcbiAgfVxuXG4gIC8vIEhvb2sgdXAgaW50ZXJjZXB0b3JzIG1pZGRsZXdhcmVcbiAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdW5kZWZpbmVkXTtcbiAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcblxuICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59O1xuXG5BeGlvcy5wcm90b3R5cGUuZ2V0VXJpID0gZnVuY3Rpb24gZ2V0VXJpKGNvbmZpZykge1xuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICByZXR1cm4gYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLnJlcGxhY2UoL15cXD8vLCAnJyk7XG59O1xuXG4vLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiAoY29uZmlnIHx8IHt9KS5kYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWRcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0Fic29sdXRlVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9pc0Fic29sdXRlVVJMJyk7XG52YXIgY29tYmluZVVSTHMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBiYXNlVVJMIHdpdGggdGhlIHJlcXVlc3RlZFVSTCxcbiAqIG9ubHkgd2hlbiB0aGUgcmVxdWVzdGVkVVJMIGlzIG5vdCBhbHJlYWR5IGFuIGFic29sdXRlIFVSTC5cbiAqIElmIHRoZSByZXF1ZXN0VVJMIGlzIGFic29sdXRlLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHJlcXVlc3RlZFVSTCB1bnRvdWNoZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdGVkVVJMIEFic29sdXRlIG9yIHJlbGF0aXZlIFVSTCB0byBjb21iaW5lXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgZnVsbCBwYXRoXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRGdWxsUGF0aChiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpIHtcbiAgaWYgKGJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwocmVxdWVzdGVkVVJMKSkge1xuICAgIHJldHVybiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpO1xuICB9XG4gIHJldHVybiByZXF1ZXN0ZWRVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9lbmhhbmNlRXJyb3InKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHRyYW5zZm9ybURhdGEgPSByZXF1aXJlKCcuL3RyYW5zZm9ybURhdGEnKTtcbnZhciBpc0NhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9pc0NhbmNlbCcpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgIGNvbmZpZy5kYXRhLFxuICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzXG4gICk7XG5cbiAgdXRpbHMuZm9yRWFjaChcbiAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgIH1cbiAgKTtcblxuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cblxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgZXJyb3IuaXNBeGlvc0Vycm9yID0gdHJ1ZTtcblxuICBlcnJvci50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFN0YW5kYXJkXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAvLyBNaWNyb3NvZnRcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgbnVtYmVyOiB0aGlzLm51bWJlcixcbiAgICAgIC8vIE1vemlsbGFcbiAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLFxuICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxuICAgICAgY29sdW1uTnVtYmVyOiB0aGlzLmNvbHVtbk51bWJlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgLy8gQXhpb3NcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBjb2RlOiB0aGlzLmNvZGVcbiAgICB9O1xuICB9O1xuICByZXR1cm4gZXJyb3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgdmFyIGNvbmZpZyA9IHt9O1xuXG4gIHZhciB2YWx1ZUZyb21Db25maWcyS2V5cyA9IFsndXJsJywgJ21ldGhvZCcsICdkYXRhJ107XG4gIHZhciBtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cyA9IFsnaGVhZGVycycsICdhdXRoJywgJ3Byb3h5JywgJ3BhcmFtcyddO1xuICB2YXIgZGVmYXVsdFRvQ29uZmlnMktleXMgPSBbXG4gICAgJ2Jhc2VVUkwnLCAndHJhbnNmb3JtUmVxdWVzdCcsICd0cmFuc2Zvcm1SZXNwb25zZScsICdwYXJhbXNTZXJpYWxpemVyJyxcbiAgICAndGltZW91dCcsICd0aW1lb3V0TWVzc2FnZScsICd3aXRoQ3JlZGVudGlhbHMnLCAnYWRhcHRlcicsICdyZXNwb25zZVR5cGUnLCAneHNyZkNvb2tpZU5hbWUnLFxuICAgICd4c3JmSGVhZGVyTmFtZScsICdvblVwbG9hZFByb2dyZXNzJywgJ29uRG93bmxvYWRQcm9ncmVzcycsICdkZWNvbXByZXNzJyxcbiAgICAnbWF4Q29udGVudExlbmd0aCcsICdtYXhCb2R5TGVuZ3RoJywgJ21heFJlZGlyZWN0cycsICd0cmFuc3BvcnQnLCAnaHR0cEFnZW50JyxcbiAgICAnaHR0cHNBZ2VudCcsICdjYW5jZWxUb2tlbicsICdzb2NrZXRQYXRoJywgJ3Jlc3BvbnNlRW5jb2RpbmcnXG4gIF07XG4gIHZhciBkaXJlY3RNZXJnZUtleXMgPSBbJ3ZhbGlkYXRlU3RhdHVzJ107XG5cbiAgZnVuY3Rpb24gZ2V0TWVyZ2VkVmFsdWUodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdCh0YXJnZXQpICYmIHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHRhcmdldCwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHt9LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gc291cmNlLnNsaWNlKCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZURlZXBQcm9wZXJ0aWVzKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICB1dGlscy5mb3JFYWNoKHZhbHVlRnJvbUNvbmZpZzJLZXlzLCBmdW5jdGlvbiB2YWx1ZUZyb21Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cywgbWVyZ2VEZWVwUHJvcGVydGllcyk7XG5cbiAgdXRpbHMuZm9yRWFjaChkZWZhdWx0VG9Db25maWcyS2V5cywgZnVuY3Rpb24gZGVmYXVsdFRvQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHV0aWxzLmZvckVhY2goZGlyZWN0TWVyZ2VLZXlzLCBmdW5jdGlvbiBtZXJnZShwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmIChwcm9wIGluIGNvbmZpZzEpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB2YXIgYXhpb3NLZXlzID0gdmFsdWVGcm9tQ29uZmlnMktleXNcbiAgICAuY29uY2F0KG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzKVxuICAgIC5jb25jYXQoZGVmYXVsdFRvQ29uZmlnMktleXMpXG4gICAgLmNvbmNhdChkaXJlY3RNZXJnZUtleXMpO1xuXG4gIHZhciBvdGhlcktleXMgPSBPYmplY3RcbiAgICAua2V5cyhjb25maWcxKVxuICAgIC5jb25jYXQoT2JqZWN0LmtleXMoY29uZmlnMikpXG4gICAgLmZpbHRlcihmdW5jdGlvbiBmaWx0ZXJBeGlvc0tleXMoa2V5KSB7XG4gICAgICByZXR1cm4gYXhpb3NLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTE7XG4gICAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChvdGhlcktleXMsIG1lcmdlRGVlcFByb3BlcnRpZXMpO1xuXG4gIHJldHVybiBjb25maWc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuKGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUnKTtcblxudmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbmZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSkge1xuICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG4gIHZhciBhZGFwdGVyO1xuICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy94aHInKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG52YXIgZGVmYXVsdHMgPSB7XG4gIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0FjY2VwdCcpO1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7IC8qIElnbm9yZSAqLyB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcbiAgbWF4Qm9keUxlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfVxufTtcblxuZGVmYXVsdHMuaGVhZGVycyA9IHtcbiAgY29tbW9uOiB7XG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG4gIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFydHMgPSBbXTtcblxuICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGtleSA9IGtleSArICdbXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICAgIH1cblxuICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG4gICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgdmFyIGhhc2htYXJrSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cblxuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICAgIHZhciBjb29raWUgPSBbXTtcbiAgICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zXG4gKlxuICogQHBhcmFtIHsqfSBwYXlsb2FkIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3MsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXhpb3NFcnJvcihwYXlsb2FkKSB7XG4gIHJldHVybiAodHlwZW9mIHBheWxvYWQgPT09ICdvYmplY3QnKSAmJiAocGF5bG9hZC5pc0F4aW9zRXJyb3IgPT09IHRydWUpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG4gIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG4gICAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXG4gICAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuICAgICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG4gICAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcbiAgICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgICAgLyoqXG4gICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAgICovXG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgfVxuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLy8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbnZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcbiAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcbiAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG4gICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5dO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gIHZhciBwYXJzZWQgPSB7fTtcbiAgdmFyIGtleTtcbiAgdmFyIHZhbDtcbiAgdmFyIGk7XG5cbiAgaWYgKCFoZWFkZXJzKSB7IHJldHVybiBwYXJzZWQ7IH1cblxuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwYXJzZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG5cbi8qZ2xvYmFsIHRvU3RyaW5nOnRydWUqL1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG4gIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAodmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XG4gIGlmICh0b1N0cmluZy5jYWxsKHZhbCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gcHJvdG90eXBlID09PSBudWxsIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqIG5hdGl2ZXNjcmlwdFxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdOYXRpdmVTY3JpcHQnIG9yICdOUydcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiAobmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05hdGl2ZVNjcmlwdCcgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05TJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG4gKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cbiAqXG4gKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChyZXN1bHRba2V5XSkgJiYgaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHt9LCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbC5zbGljZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbi8qKlxuICogUmVtb3ZlIGJ5dGUgb3JkZXIgbWFya2VyLiBUaGlzIGNhdGNoZXMgRUYgQkIgQkYgKHRoZSBVVEYtOCBCT00pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnQgd2l0aCBCT01cbiAqIEByZXR1cm4ge3N0cmluZ30gY29udGVudCB2YWx1ZSB3aXRob3V0IEJPTVxuICovXG5mdW5jdGlvbiBzdHJpcEJPTShjb250ZW50KSB7XG4gIGlmIChjb250ZW50LmNoYXJDb2RlQXQoMCkgPT09IDB4RkVGRikge1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnNsaWNlKDEpO1xuICB9XG4gIHJldHVybiBjb250ZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzUGxhaW5PYmplY3Q6IGlzUGxhaW5PYmplY3QsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlOiBpc0RhdGUsXG4gIGlzRmlsZTogaXNGaWxlLFxuICBpc0Jsb2I6IGlzQmxvYixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNTdHJlYW06IGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgZm9yRWFjaDogZm9yRWFjaCxcbiAgbWVyZ2U6IG1lcmdlLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHJpbTogdHJpbSxcbiAgc3RyaXBCT006IHN0cmlwQk9NXG59O1xuIiwiaW1wb3J0ICcuL3N0eWxlcy5zY3NzJztcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG4vLyBnbG9iYWwgdmFsdWUgdGhhdCBob2xkcyBpbmZvIGFib3V0IHRoZSBjdXJyZW50IGhhbmQuXG5sZXQgY3VycmVudEdhbWUgPSBudWxsO1xubGV0IGRpc3BsYXllZENhcmRzID0gW11cbmxldCBzZWxlY3RlZENhcmRzID0gW11cbmxldCBudW1PZkNhcmRzO1xuLy8gcXVlcnkgZm9yIGdhbWUsY2FyZCwgZXJyb3IgYW5kIGluc3RydXRpb25zIGNvbnRhaW5lclxuY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lLWNvbnRhaW5lcicpO1xuY29uc3QgY2FyZFNlbGVjdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWxlY3QtY29udGFpbmVyJyk7XG5jb25zdCBlcnJvckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlcnJvci1jb250YWluZXInKTtcbmNvbnN0IGdhbWVJbmZvQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2luZm8tY29udGFpbmVyJyk7XG4vLyBjcmVhdGUgcmVnaXN0cmF0aW9ucyBvbiBsYW5kaW5nIHBhZ2VcbmNvbnN0IHJlZ2lzdHJhdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucmVnaXN0cmF0aW9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5lcicsICdmb3JtLXNpZ25pbicsICdiZy1saWdodCcpO1xuXG4vLyBjcmVhdGUgcmVnaXN0cmF0aW9uIGVsZW1lbnRzOiB1c2VyIG5hbWUgYW5kIHB3XG5jb25zdCByZWdpc3RyYXRpb25UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbnJlZ2lzdHJhdGlvblRleHQuaW5uZXJUZXh0ID0gJ1JlZ2lzdHJhdGlvbiBGb3JtJztcblxuY29uc3QgcmVnVXNlck5hbWVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnJlZ1VzZXJOYW1lRGl2LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tZmxvYXRpbmcnKTtcbmNvbnN0IHJlZ1VzZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbnJlZ1VzZXJOYW1lLnBsYWNlaG9sZGVyID0gJ0lucHV0IFVzZXJuYW1lJztcblxuY29uc3QgcmVnUGFzc3dvcmREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnJlZ1Bhc3N3b3JkRGl2LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tZmxvYXRpbmcnKTtcbmNvbnN0IHJlZ1Bhc3N3b3JkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbnJlZ1Bhc3N3b3JkLnBsYWNlaG9sZGVyID0gJ0lucHV0IFBhc3N3b3JkJztcblxuY29uc3QgcmVnaXN0cmF0aW9uQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5yZWdpc3RyYXRpb25CdG4uaW5uZXJUZXh0ID0gJ1JlZ2lzdGVyJztcblxucmVnVXNlck5hbWVEaXYuYXBwZW5kQ2hpbGQocmVnVXNlck5hbWUpO1xucmVnUGFzc3dvcmREaXYuYXBwZW5kQ2hpbGQocmVnUGFzc3dvcmQpO1xucmVnaXN0cmF0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHJlZ2lzdHJhdGlvblRleHQpO1xucmVnaXN0cmF0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHJlZ1VzZXJOYW1lRGl2KTtcbnJlZ2lzdHJhdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChyZWdQYXNzd29yZERpdik7XG5yZWdpc3RyYXRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQocmVnaXN0cmF0aW9uQnRuKTtcblxuLy8gKioqKioqKioqKioqKiogY3JlYXRlIGxvZ2luIG9uIGxhbmRpbmcgcGFnZSAqKioqKioqKioqKioqKi8vXG5jb25zdCBsb2dpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xubG9naW5Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29udGFpbmVyJywgJ2Zvcm0tc2lnbmluJywgJ2JnLWxpZ2h0Jyk7XG5cbi8vIGNyZWF0ZSBsb2dpbiBlbGVtZW50czogVXNlck5hbWUgYW5kIHB3XG5jb25zdCBsb2dpblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xubG9naW5UZXh0LmlubmVyVGV4dCA9ICdMb2dpbiBGb3JtJztcblxuY29uc3QgdXNlck5hbWVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnVzZXJOYW1lRGl2LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tZmxvYXRpbmcnKTtcbmNvbnN0IHVzZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbnVzZXJOYW1lLnBsYWNlaG9sZGVyID0gJ0lucHV0IFVzZXIgTmFtZSc7XG5cbmNvbnN0IHBhc3N3b3JkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5wYXNzd29yZERpdi5jbGFzc0xpc3QuYWRkKCdmb3JtLWZsb2F0aW5nJyk7XG5jb25zdCBwYXNzd29yZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5wYXNzd29yZC5wbGFjZWhvbGRlciA9ICdJbnB1dCBQYXNzd29yZCc7XG5cbmNvbnN0IGxvZ2luQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5sb2dpbkJ0bi5pbm5lclRleHQgPSAnTG9naW4nO1xuXG51c2VyTmFtZURpdi5hcHBlbmRDaGlsZCh1c2VyTmFtZSk7XG5wYXNzd29yZERpdi5hcHBlbmRDaGlsZChwYXNzd29yZCk7XG5sb2dpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2dpblRleHQpO1xubG9naW5Db250YWluZXIuYXBwZW5kQ2hpbGQodXNlck5hbWVEaXYpO1xubG9naW5Db250YWluZXIuYXBwZW5kQ2hpbGQocGFzc3dvcmREaXYpO1xubG9naW5Db250YWluZXIuYXBwZW5kQ2hpbGQobG9naW5CdG4pO1xuXG5jb25zdCBjaGVja0xvZ2dlZEluID0gKCkgPT4ge1xuICBheGlvcy5nZXQoJy9pc2xvZ2dlZGluJylcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIGxvZ2luIDo+PiAnLCByZXNwb25zZSk7XG4gICAgICBpZiAocmVzcG9uc2UuZGF0YS5pc0xvZ2dlZEluID09PSB0cnVlKVxuICAgICAge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpZmZDb250YWluZXIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBsYXlCdG4pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIHJlbmRlciBvdGhlciBidXR0b25zXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVnaXN0cmF0aW9uQ29udGFpbmVyKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsb2dpbkNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiBjb25zb2xlLmxvZygnZXJyb3IgZnJvbSBsb2dnaW5nIGluJywgZXJyb3IpKTtcbn07XG5cbi8vICoqKioqKioqKioqKioqIGNyZWF0ZSBkaWZmaWN1bHR5IHNlbGVjdGlvbiBlbGVtZW50cyAqKioqKioqKioqKioqKi8vXG5jb25zdCBkaWZmQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5kaWZmQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5lcicsICdiZy1saWdodCcsICdjYXJkQ29udGFpbmVyJyk7XG5cbmNvbnN0IGJnbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5iZ25CdG4udHlwZSA9ICdyYWRpbyc7XG5iZ25CdG4ubmFtZSA9ICdkaWZmaWN1bHR5JztcbmJnbkJ0bi5jaGVja2VkID0gZmFsc2U7XG5iZ25CdG4udmFsdWUgPSAnYmVnaW5uZXInO1xuY29uc3QgYmduTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuY29uc3QgYmduRGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQmVnaW5uZXInKTtcbmJnbkxhYmVsLmFwcGVuZENoaWxkKGJnbkRlc2NyaXB0aW9uKTtcblxuY29uc3QgYWR2QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbmFkdkJ0bi50eXBlID0gJ3JhZGlvJztcbmFkdkJ0bi5uYW1lID0gJ2RpZmZpY3VsdHknO1xuYWR2QnRuLmNoZWNrZWQgPSBmYWxzZTtcbmFkdkJ0bi52YWx1ZSA9ICdhZHZhbmNlZCc7XG5jb25zdCBhZHZMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5jb25zdCBhZHZEZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdBZHZhbmNlZCcpO1xuYWR2TGFiZWwuYXBwZW5kQ2hpbGQoYWR2RGVzY3JpcHRpb24pO1xuXG5jb25zdCBleHBCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuZXhwQnRuLnR5cGUgPSAncmFkaW8nO1xuZXhwQnRuLm5hbWUgPSAnZGlmZmljdWx0eSc7XG5leHBCdG4uY2hlY2tlZCA9IGZhbHNlO1xuZXhwQnRuLnZhbHVlID0gJ2V4cGVydCc7XG5jb25zdCBleHBMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5jb25zdCBleHBEZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdFeHBlcnQnKTtcbmV4cExhYmVsLmFwcGVuZENoaWxkKGV4cERlc2NyaXB0aW9uKTtcblxuZGlmZkNvbnRhaW5lci5hcHBlbmRDaGlsZChiZ25CdG4pXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGJnbkxhYmVsKVxuZGlmZkNvbnRhaW5lci5hcHBlbmRDaGlsZChhZHZCdG4pXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGFkdkxhYmVsKVxuZGlmZkNvbnRhaW5lci5hcHBlbmRDaGlsZChleHBCdG4pXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGV4cExhYmVsKVxuXG4vLyBjcmVhdGUgcGxheSBnYW1lIGJ0biB0byBzdGFydCAxc3QgZ2FtZVxuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xucGxheUJ0bi5pbm5lclRleHQgPSAnUGxheSBHYW1lJztcblxuXG4vLyAqKioqKioqKioqKioqKiBjcmVhdGUgY2FyZCBhbmQgY2FyZCBob2xkZXJzICoqKioqKioqKioqKioqLy9cbmNvbnN0IGZsYXNoZWRDYXJkcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g1Jyk7XG5mbGFzaGVkQ2FyZHMuY2xhc3NMaXN0LmFkZCgnZmxhc2hlZENhcmQnKVxuY29uc3QgZmxhc2hlZENhcmRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmZsYXNoZWRDYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5lcicsICdiZy1saWdodCcsICdjYXJkQ29udGFpbmVyJyk7XG5mbGFzaGVkQ2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChmbGFzaGVkQ2FyZHMpXG5cbmNvbnN0IGFsbENhcmRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDUnKTtcbmNvbnN0IGFsbENhcmRzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5hbGxDYXJkc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjb250YWluZXInLCAnYmctbGlnaHQnLCAnY2FyZENvbnRhaW5lcicpO1xuYWxsQ2FyZHNDb250YWluZXIuaW5uZXJUZXh0ID0gXCJTZWxlY3QgdGhlIGNhcmQgb3JkZXJcIlxuXG5jb25zdCByZXN1bHRGbGFzaGVkQ2FyZHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnJlc3VsdEZsYXNoZWRDYXJkcy5jbGFzc0xpc3QuYWRkKCdyZXN1bHRDYXJkJylcbi8vIGNyZWF0ZSBzdWJtaXQgYW5zIGJ1dHRvblxuY29uc3Qgc3VibWl0QW5zQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5zdWJtaXRBbnNCdG4uaW5uZXJUZXh0ID0gJ1N1Ym1pdCc7XG5cbmNvbnN0IHJlc3VsdE91dGNvbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xuXG4vLyBjcmVhdGUgcGxheSBhZ2FpbiBidG5cbmNvbnN0IHBsYXlBZ2FpbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xucGxheUFnYWluQnRuLmlubmVyVGV4dCA9ICdQbGF5IEFnYWluJztcblxuXG5cbi8vIGNyZWF0ZSBjYXJkIGZ1bmN0aW9uXG5jb25zdCBjcmVhdGVDYXJkID0gKGNhcmRJbmZvKSA9PiB7XG4gIGNvbnN0IHN1aXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgc3VpdC5jbGFzc0xpc3QuYWRkKCdzdWl0Jyk7XG4gIHN1aXQuaW5uZXJUZXh0ID0gY2FyZEluZm8uc3VpdFN5bWJvbDtcblxuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIG5hbWUuY2xhc3NMaXN0LmFkZCgnbmFtZScsIGNhcmRJbmZvLmNvbG9yKTtcbiAgbmFtZS5pbm5lclRleHQgPSBjYXJkSW5mby5kaXNwbGF5TmFtZTtcblxuICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNhcmQuY2xhc3NMaXN0LmFkZCgnY2FyZCcpO1xuIFxuICBjYXJkLmFwcGVuZENoaWxkKG5hbWUpO1xuICBjYXJkLmFwcGVuZENoaWxkKHN1aXQpO1xuXG4gIHJldHVybiBjYXJkO1xufTtcblxuLy8gY3JlYXRlIG51bSBvZiBjYXJkcyB0byBiZSBmbGFzaGVkIGFjY29yZGluZyB0byBkaWZmaWN1bHR5IGxldmVsIFxuY29uc3QgZmxhc2hpbmdDYXJkcyA9ICh7IGZsYXNoQ2FyZHMsIH0sIGdhbWVMZXZlbCkgPT4ge1xuICBsZXQgY2FyZEVsZW1lbnQ7XG4gIFxuICAvLyBtYW5pcHVsYXRlIERPTVxuICBpZiAoZ2FtZUxldmVsID09ICdiZWdpbm5lcicpe1xuICAgIG51bU9mQ2FyZHMgPSA1ICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mQ2FyZHM7IGkgKz0gMSl7XG4gICAgZGlzcGxheWVkQ2FyZHMucHVzaChmbGFzaENhcmRzW2ldKVxuICAgIGNhcmRFbGVtZW50ID0gY3JlYXRlQ2FyZChmbGFzaENhcmRzW2ldKTtcbiAgICBjYXJkRWxlbWVudC5pZCA9IGBjYXJkJHtpfWA7XG4gICAgY2FyZEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnYmVnaW5uZXInKVxuICAgIGZsYXNoZWRDYXJkcy5hcHBlbmRDaGlsZChjYXJkRWxlbWVudCk7XG4gICAgY29uc29sZS5sb2coJ2ZsYXNoQ2FyZHMgOj4+ICcsIGZsYXNoQ2FyZHMpO1xuICAgIGNvbnNvbGUubG9nKCdkaXNwbGF5ZWRDYXJkcyA6Pj4gJywgZGlzcGxheWVkQ2FyZHMpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGdhbWVDb250YWluZXIuaW5uZXJUZXh0ID0gJyc7XG4gICAgfSwgNTAwMCk7XG59O1xuICAgIFxuICB9IGVsc2UgaWYgKGdhbWVMZXZlbCA9PSAnYWR2YW5jZWQnKXtcbiAgICBudW1PZkNhcmRzID0gN1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT2ZDYXJkczsgaSArPSAxKXtcbiAgICBkaXNwbGF5ZWRDYXJkcy5wdXNoKGZsYXNoQ2FyZHNbaV0pXG4gICAgY2FyZEVsZW1lbnQgPSBjcmVhdGVDYXJkKGZsYXNoQ2FyZHNbaV0pO1xuICAgIGNhcmRFbGVtZW50LmlkID0gYGNhcmQke2l9YDtcbiAgICBjYXJkRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdhZHZhbmNlZCcpXG4gICAgZmxhc2hlZENhcmRzLmFwcGVuZENoaWxkKGNhcmRFbGVtZW50KTtcbiAgICBjb25zb2xlLmxvZygnZmxhc2hDYXJkcyA6Pj4gJywgZmxhc2hDYXJkcyk7XG4gICAgY29uc29sZS5sb2coJ2Rpc3BsYXllZENhcmRzIDo+PiAnLCBkaXNwbGF5ZWRDYXJkcyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZ2FtZUNvbnRhaW5lci5pbm5lclRleHQgPSAnJztcbiAgICB9LCA3MDAwKTtcbiAgfTtcbiAgfSBlbHNlIHtcbiAgICBudW1PZkNhcmRzID0gMTBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mQ2FyZHM7IGkgKz0gMSl7XG4gICAgZGlzcGxheWVkQ2FyZHMucHVzaChmbGFzaENhcmRzW2ldKVxuICAgIGNhcmRFbGVtZW50ID0gY3JlYXRlQ2FyZChmbGFzaENhcmRzW2ldKTtcbiAgICBjYXJkRWxlbWVudC5pZCA9IGBjYXJkJHtpfWA7XG4gICAgY2FyZEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnZXhwZXJ0JylcbiAgICBmbGFzaGVkQ2FyZHMuYXBwZW5kQ2hpbGQoY2FyZEVsZW1lbnQpO1xuICAgIGNvbnNvbGUubG9nKCdmbGFzaENhcmRzIDo+PiAnLCBmbGFzaENhcmRzKTtcbiAgICBjb25zb2xlLmxvZygnZGlzcGxheWVkQ2FyZHMgOj4+ICcsIGRpc3BsYXllZENhcmRzKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBnYW1lQ29udGFpbmVyLmlubmVyVGV4dCA9ICcnO1xuICAgIH0sIDEwMDAwKTtcbiAgfTtcbiAgfVxuICAgIGNvbnNvbGUubG9nKCdmbGFzaENhcmRzIDo+PiAnLCBmbGFzaENhcmRzKTtcbiAgICBmbGFzaGVkQ2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChmbGFzaGVkQ2FyZHMpO1xuICAgIGdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoZmxhc2hlZENhcmRDb250YWluZXIpO1xuICBcblxufVxuXG4vLyBkaXNwbGF5IGFsbCBjYXJkcyBpbiBhcnJheSBmb3IgdXNlciB0byBzZWxlY3Qgb3JkZXJcbmNvbnN0IGRpc3BsYXlDYXJkcyA9ICh7IGZsYXNoQ2FyZHMsfSkgPT5cbntcbiAgbGV0IGNhcmRFbGVtZW50O1xuICAgIC8vIHNodWZmbGUgdGhlIG1peGVkIGZsYXNoIGNhcmQgYXJyYXlcbiAgZm9yIChsZXQgaSA9IGZsYXNoQ2FyZHMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgIFtmbGFzaENhcmRzW2ldLCBmbGFzaENhcmRzW2pdXSA9IFtmbGFzaENhcmRzW2pdLCBmbGFzaENhcmRzW2ldXTtcbiAgICB9XG4gICAgXG4gIC8vIGFwcGVuZCBhbGwgMTAgY2FyZHMgZm9yIHNlbGVjdGlvblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZsYXNoQ2FyZHMubGVuZ3RoOyBpICs9IDEpe1xuICAgIGNhcmRFbGVtZW50ID0gY3JlYXRlQ2FyZChmbGFzaENhcmRzW2ldKTtcbiAgICBjYXJkRWxlbWVudC5pZCA9IGBjYXJkJHtpfWA7XG4gICAgYWxsQ2FyZHMuYXBwZW5kQ2hpbGQoY2FyZEVsZW1lbnQpO1xuICB9XG4gIGFsbENhcmRzQ29udGFpbmVyLmFwcGVuZENoaWxkKGFsbENhcmRzKVxuICBjYXJkU2VsZWN0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGFsbENhcmRzQ29udGFpbmVyKTtcbn1cblxuLy8gZXZlbnQgbGlzdGVuZXIgZm9yIGFsbCBkaXNwbGF5ZWQgY2FyZHMgc2xhdGVkIGZvciBzZWxlY3Rpb25cbmNvbnN0IGNhcmRTZWxlY3Rpb24gPSAoKSA9PiB7XG5jb25zdCBjYXJkMCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkMCcpO1xuY2FyZDAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpO1xuY29uc3QgY2FyZDEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDEnKTtcbmNhcmQxLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDInKTtcbmNhcmQyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDMnKTtcbmNhcmQzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDQnKTtcbmNhcmQ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDUnKTtcbmNhcmQ1LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDYnKTtcbmNhcmQ2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDcnKTtcbmNhcmQ3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDgnKTtcbmNhcmQ4LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDknKTtcbmNhcmQ5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxufVxuXG4vLyBzZWxlY3RlZCBjYXJkcyB0byBiZSBhcHBlbmRlZCB0byBzb2x1dGlvbiBhcnJheSBhbmQgZGlzYXBwZWFyXG5jb25zdCBjYXJkU2VsZWN0ZWQgPSAoZSkgPT4ge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGUuY3VycmVudFRhcmdldC5pZCkucmVtb3ZlKClcbiAgICBjb25zdCBkaXNwbGF5TmFtZSA9IGUuY3VycmVudFRhcmdldC5maXJzdENoaWxkLmlubmVyVGV4dDtcbiAgICBjb25zdCBjYXJkU3VpdFN5bWJvbCA9IGUuY3VycmVudFRhcmdldC5sYXN0Q2hpbGQuaW5uZXJUZXh0O1xuICAgIGNvbnNvbGUubG9nKGUuY3VycmVudFRhcmdldC5maXJzdENoaWxkLmlubmVyVGV4dClcbiAgICBjb25zb2xlLmxvZyhlLmN1cnJlbnRUYXJnZXQubGFzdENoaWxkLmlubmVyVGV4dClcbiAgICBzZWxlY3RlZENhcmRzLnB1c2goe2Rpc3BsYXlOYW1lLCBzdWl0U3ltYm9sOiBjYXJkU3VpdFN5bWJvbCB9KVxuICAgIGNvbnNvbGUubG9nKCdzZWxlY3RlZENhcmRzIDo+PiAnLCBzZWxlY3RlZENhcmRzKTtcbn1cblxuY29uc3QgZGlzcGxheUZpbmFsUmVzdWx0cyA9ICgpID0+IHtcbiAgbGV0IGNhcmRFbGVtZW50O1xuICBcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZENhcmRzLmxlbmd0aDsgaSArPSAxKXtcbiAgICBjYXJkRWxlbWVudCA9IGNyZWF0ZUNhcmQoc2VsZWN0ZWRDYXJkc1tpXSk7XG4gICAgYWxsQ2FyZHMuYXBwZW5kQ2hpbGQoY2FyZEVsZW1lbnQpO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGlzcGxheWVkQ2FyZHMubGVuZ3RoOyBpICs9IDEpe1xuICAgIGNhcmRFbGVtZW50ID0gY3JlYXRlQ2FyZChkaXNwbGF5ZWRDYXJkc1tpXSk7XG4gICAgcmVzdWx0Rmxhc2hlZENhcmRzLmFwcGVuZENoaWxkKGNhcmRFbGVtZW50KTtcbiAgfVxuICBmbGFzaGVkQ2FyZENvbnRhaW5lci5pbm5lclRleHQgPSBcIkFjdHVhbCBDYXJkIE9yZGVyXCJcbiAgZmxhc2hlZENhcmRDb250YWluZXIuYXBwZW5kQ2hpbGQocmVzdWx0Rmxhc2hlZENhcmRzKVxuICBnYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGZsYXNoZWRDYXJkQ29udGFpbmVyKTtcbiAgYWxsQ2FyZHNDb250YWluZXIuaW5uZXJUZXh0ID0gXCJZb3VyIFNlbGVjdGVkIE9yZGVyXCJcbiAgYWxsQ2FyZHNDb250YWluZXIuYXBwZW5kQ2hpbGQoYWxsQ2FyZHMpXG4gIGNhcmRTZWxlY3Rpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoYWxsQ2FyZHNDb250YWluZXIpO1xufVxuXG5yZWdpc3RyYXRpb25CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGNvbnN0IHJlZ2lzdGVyRGF0YSA9IHtcbiAgICBuYW1lOiByZWdVc2VyTmFtZS52YWx1ZSxcbiAgICBwYXNzd29yZDogcmVnUGFzc3dvcmQudmFsdWUsXG4gIH07XG4gIFxuICBjb25zb2xlLmxvZyhyZWdpc3RlckRhdGEpO1xuICBheGlvc1xuICAgIC5wb3N0KCcvcmVnaXN0ZXInLCByZWdpc3RlckRhdGEpXG4gICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnaGVsbGxvb3c+Pj4+Pj4nLCByZXNwb25zZS5kYXRhKTtcbiAgICAgIGlmIChyZXNwb25zZS5kYXRhLmVycm9yKXtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2UuZGF0YS5lcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocmVnaXN0cmF0aW9uQ29udGFpbmVyKTtcbiAgICAgICAgcmVnaXN0cmF0aW9uQ29udGFpbmVyLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgZXJyb3JDb250YWluZXIuaW5uZXJIVE1MID0gJzxwIHN0eWxlPVwiY29sb3I6cmVkXCI+SW52YWxpZCBSZWdpc3RyYXRpb24gRGV0YWlsczwvcD4nO1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pXG4gICAgIGNoZWNrTG9nZ2VkSW4oKTtcbn0pO1xuXG5sb2dpbkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgY29uc3QgbG9naW5EYXRhID0ge1xuICAgIG5hbWU6IHVzZXJOYW1lLnZhbHVlLFxuICAgIHBhc3N3b3JkOiBwYXNzd29yZC52YWx1ZSxcbiAgfTtcbiAgY29uc29sZS5sb2cobG9naW5EYXRhKTtcbiAgYXhpb3NcbiAgICAucG9zdCgnL2xvZ2luJywgbG9naW5EYXRhKVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2hlbGxsb293Pj4+Pj4+JywgcmVzcG9uc2UuZGF0YSk7XG4gICAgICBpZiAocmVzcG9uc2UuZGF0YS5lcnJvcilcbiAgICAgIHtcbiAgICAgICAgIHRocm93IHJlc3BvbnNlLmRhdGEuZXJyb3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnYW1lSW5mb0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjb250YWluZXInLCAnZm9ybS1zaWduaW4nLCAnYmctbGlnaHQnKTtcbiAgICAgICAgZ2FtZUluZm9Db250YWluZXIuaW5uZXJIVE1MID0gJy1BIHNlcmllcyBvZiBjYXJkcyB3aWxsIGJlIGZsYXNoZWQgZm9yIDEgc2VjIGVhY2ggPGJyPi1BdCB0aGUgZW5kIG9mIHRoZSBmbGFzaGluZywgcGxzIHNlbGVjdCB0aGUgY2FyZHMgaW4gdGhlIG9yZGVyIHRoYXQgdGhleSB3ZXJlIGZsYXNoZWQuIDxicj4gLVRvIHdpbiB0aGUgZ2FtZSwgdGhlIGV4YWN0IG9yZGVyIG9mIHRoZSBjYXJkcyBtdXN0IGJlIGNvcnJlY3QgPGJyPiBCZWdpbm5lciAtIDUgY2FyZHMgPGJyPiBBZHZhbmNlZCAtIDcgY2FyZHMgPGJyPiBFeHBlcnQgLSAxMCBjYXJkcyc7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGlmZkNvbnRhaW5lcik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGxheUJ0bik7XG4gICAgICAgIGxvZ2luQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBsb2dpbkNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgICByZWdpc3RyYXRpb25Db250YWluZXIucmVtb3ZlKClcbiAgICAgICAgZXJyb3JDb250YWluZXIucmVtb3ZlKClcbiAgICAgICAgLy8gZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsb2dpbkNvbnRhaW5lcik7XG4gICAgICAgIC8vIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocmVnaXN0cmF0aW9uQ29udGFpbmVyKTtcbiAgICAgICAgLy8gZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlcnJvckNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGVycm9yQ29udGFpbmVyLmlubmVySFRNTCA9ICc8cCBzdHlsZT1cImNvbG9yOnJlZFwiPkludmFsaWQgTG9naW4gRGV0YWlsczwvcD4nO1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pXG4gICAgIGNoZWNrTG9nZ2VkSW4oKTtcbn0pO1xuXG5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHBsYXlCdG4pO1xuICAvLyBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGdhbWVJbmZvQ29udGFpbmVyKTtcbiAgZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChmbGFzaGVkQ2FyZENvbnRhaW5lcik7XG4gIC8vIE1ha2UgYSByZXF1ZXN0IHRvIGNyZWF0ZSBhIG5ldyBnYW1lXG4gIGF4aW9zXG4gICAucG9zdCgnL2dhbWVzJylcbiAgIC50aGVuKCAocmVzcG9uc2UpID0+IHtcbiAgICAvLyBzZXQgdGhlIGdsb2JhbCB2YWx1ZSB0byB0aGUgbmV3IGdhbWUuXG4gICAgICBjdXJyZW50R2FtZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBjb25zb2xlLmxvZygnY3VycmVudEdhbWU+Pj4+Pj4+JyxjdXJyZW50R2FtZSk7XG4gICAgICBjb25zdCBkaWZmaWN1bHR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImRpZmZpY3VsdHlcIl06Y2hlY2tlZCcpO1xuICAgICAgY29uc3QgZ2FtZUxldmVsID0gZGlmZmljdWx0eS52YWx1ZVxuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaWZmQ29udGFpbmVyKTtcbiAgICAgIC8vIGRpc3BsYXkgaXQgb3V0IHRvIHRoZSB1c2VyXG4gICAgICBmbGFzaGluZ0NhcmRzKGN1cnJlbnRHYW1lLCBnYW1lTGV2ZWwpO1xuICAgICAgaWYgKG51bU9mQ2FyZHMgPT0gNSl7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRpc3BsYXlDYXJkcyhjdXJyZW50R2FtZSk7XG4gICAgICBjYXJkU2VsZWN0aW9uKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN1Ym1pdEFuc0J0bik7XG4gICAgfSwgNjAwMCk7fSBlbHNlIGlmIChudW1PZkNhcmRzID09IDcpe1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkaXNwbGF5Q2FyZHMoY3VycmVudEdhbWUpO1xuICAgICAgY2FyZFNlbGVjdGlvbigpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdWJtaXRBbnNCdG4pO1xuICAgIH0sIDgwMDApO30gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRpc3BsYXlDYXJkcyhjdXJyZW50R2FtZSk7XG4gICAgICBjYXJkU2VsZWN0aW9uKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN1Ym1pdEFuc0J0bik7XG4gICAgfSwgMTAwMDApO31cbiAgICAgXG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAvLyBoYW5kbGUgZXJyb3JcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcbn0pO1xuXG5zdWJtaXRBbnNCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGxldCBjYXJkRGlmZmVyZW5jZSA9IGRpc3BsYXllZENhcmRzLmxlbmd0aCAtIHNlbGVjdGVkQ2FyZHMubGVuZ3RoO1xuICBpZihkaXNwbGF5ZWRDYXJkcy5sZW5ndGggPiBzZWxlY3RlZENhcmRzLmxlbmd0aCl7IFxuICAgIGFsZXJ0KGBOdW1iZXIgb2Ygc2VsZWN0ZWQgY2FyZHMgaXMgbGVzc2VyIHRoYXQgdGhvc2UgZGlzcGxheWVkLiBQbHMgc2VsZWN0ICR7Y2FyZERpZmZlcmVuY2V9IG1vcmUgY2FyZHMhYClcbiAgfSBlbHNlIHtcbiAgYWxsQ2FyZHMuaW5uZXJIVE1MID0gXCJcIlxuICBmbGFzaGVkQ2FyZHMuaW5uZXJIVE1MID0gXCJcIlxuICBjYXJkU2VsZWN0aW9uQ29udGFpbmVyLnJlbW92ZUNoaWxkKGFsbENhcmRzQ29udGFpbmVyKTtcbiAgbGV0IGNvdW50ID0gMDtcbiAgXG4gIC8vIGNoZWNrIGZvciB3aW4gY29uZGl0aW9uc1xuICBmb3IobGV0IGkgPSAwOyBpIDwgZGlzcGxheWVkQ2FyZHMubGVuZ3RoOyBpICs9IDEpe1xuICBpZihkaXNwbGF5ZWRDYXJkc1tpXS5kaXNwbGF5TmFtZSA9PT0gc2VsZWN0ZWRDYXJkc1tpXS5kaXNwbGF5TmFtZSAmJiBcbiAgICAgIGRpc3BsYXllZENhcmRzW2ldLnN1aXRTeW1ib2wgPT09IHNlbGVjdGVkQ2FyZHNbaV0uc3VpdFN5bWJvbCl7XG4gICAgICAgIGNvdW50ICs9IDE7ICAgICAgIFxuICAgICAgfVxuICB9XG4gIGlmKGNvdW50ID09PSBkaXNwbGF5ZWRDYXJkcy5sZW5ndGgpe1xuICAgICAgcmVzdWx0T3V0Y29tZS5pbm5lclRleHQgPSAnWW91IHdvbidcbiAgICAgIGNvbnNvbGUubG9nKCd5b3Ugd29uJylcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc3VibWl0QW5zQnRuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRPdXRjb21lLmlubmVyVGV4dCA9ICdZb3UgbG9zdCdcbiAgICAgIGNvbnNvbGUubG9nKCd5b3UgbG9zdCAnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc3VibWl0QW5zQnRuKTtcbiAgICAgIH1cbiAgICBkaXNwbGF5RmluYWxSZXN1bHRzKCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZXN1bHRPdXRjb21lKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGxheUFnYWluQnRuKVxuICB9XG4gIH0pO1xuXG5wbGF5QWdhaW5CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PntcbiAgZmxhc2hlZENhcmRDb250YWluZXIuaW5uZXJUZXh0ID0gXCJcIlxuICBhbGxDYXJkc0NvbnRhaW5lci5pbm5lclRleHQgPSBcIlNlbGVjdCB0aGUgY2FyZCBvcmRlclwiXG4gIGFsbENhcmRzLmlubmVySFRNTCA9IFwiXCJcbiAgcmVzdWx0Rmxhc2hlZENhcmRzLmlubmVySFRNTCA9IFwiXCJcbiAgY2FyZFNlbGVjdGlvbkNvbnRhaW5lci5yZW1vdmVDaGlsZChhbGxDYXJkc0NvbnRhaW5lcik7XG4gIGdhbWVDb250YWluZXIucmVtb3ZlQ2hpbGQoZmxhc2hlZENhcmRDb250YWluZXIpO1xuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHJlc3VsdE91dGNvbWUpXG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocGxheUFnYWluQnRuKVxuICBjdXJyZW50R2FtZSA9IG51bGw7XG4gIGRpc3BsYXllZENhcmRzID0gW11cbiAgc2VsZWN0ZWRDYXJkcyA9IFtdXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGlmZkNvbnRhaW5lcik7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGxheUJ0bik7XG59KTtcblxuY2hlY2tMb2dnZWRJbigpIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiBtb2R1bGVbJ2RlZmF1bHQnXSA6XG5cdFx0KCkgPT4gbW9kdWxlO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LmpzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==