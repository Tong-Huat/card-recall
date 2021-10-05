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
/* harmony import */ var ejs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ejs */ "./node_modules/ejs/lib/ejs.js");
/* harmony import */ var ejs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ejs__WEBPACK_IMPORTED_MODULE_2__);


 // global value that holds info about the current hand.

var currentGame = null;
var displayedCards = [];
var selectedCards = [];
var numOfCards; // query for game,card, error and instrutions container

var dashboardDiv = document.querySelector('#dashboard');
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
      // document.body.removeChild(registrationContainer);
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
      var userDiv = document.createElement('div');
      dashboardDiv.appendChild(userDiv);
      axios__WEBPACK_IMPORTED_MODULE_1___default().get('/user').then(function (responseUser) {
        console.log(responseUser.data);
        userDiv.innerHTML = "User: ".concat(responseUser.data.user.name, " <br> Wins Record: XX");
      })["catch"](function (error) {
        return console.log(error);
      });
      gameInfoContainer.classList.add('container', 'form-signin', 'bg-light');
      gameInfoContainer.innerHTML = '-A series of cards will be flashed for 1 sec each <br>-At the end of the flashing, pls select the cards in the order that they were flashed. <br> -To win the game, the exact order of the cards must be correct <br> Beginner - 5 cards <br> Advanced - 7 cards <br> Expert - 10 cards';
      document.body.appendChild(diffContainer);
      document.body.appendChild(playBtn); // loginContainer.innerHTML = '';

      loginContainer.remove();
      registrationContainer.remove();
      errorContainer.remove();
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
  var isWon = false;
  var cardDifference = displayedCards.length - selectedCards.length;

  if (displayedCards.length > selectedCards.length || selectedCards.length === 0) {
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
      isWon = true;
      resultOutcome.innerText = 'You won';
      console.log('you won');
      document.body.removeChild(submitAnsBtn);
    } else {
      isWon = false;
      resultOutcome.innerText = 'You lost';
      console.log('you lost ');
      document.body.removeChild(submitAnsBtn);
    }

    displayFinalResults();
    document.body.appendChild(resultOutcome);
    document.body.appendChild(playAgainBtn);
  }

  var gameResult = {
    id: newGame.id,
    isCompleted: true,
    isWon: isWon
  };
  axios__WEBPACK_IMPORTED_MODULE_1___default().put('gameOutcome', gameResult).then(function (response) {
    console.log('update game outcome:>>>>>', response.data);
  })["catch"](function (error) {
    console.log('error in game outcome:>> ', error);
  });
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

/***/ "./node_modules/ejs/lib/ejs.js":
/*!*************************************!*\
  !*** ./node_modules/ejs/lib/ejs.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/



/**
 * @file Embedded JavaScript templating engine. {@link http://ejs.co}
 * @author Matthew Eernisse <mde@fleegix.org>
 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
 * @project EJS
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
 */

/**
 * EJS internal functions.
 *
 * Technically this "module" lies in the same file as {@link module:ejs}, for
 * the sake of organization all the private functions re grouped into this
 * module.
 *
 * @module ejs-internal
 * @private
 */

/**
 * Embedded JavaScript templating engine.
 *
 * @module ejs
 * @public
 */

var fs = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'fs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var path = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'path'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var utils = __webpack_require__(/*! ./utils */ "./node_modules/ejs/lib/utils.js");

var scopeOptionWarned = false;
/** @type {string} */
var _VERSION_STRING = __webpack_require__(/*! ../package.json */ "./node_modules/ejs/package.json").version;
var _DEFAULT_OPEN_DELIMITER = '<';
var _DEFAULT_CLOSE_DELIMITER = '>';
var _DEFAULT_DELIMITER = '%';
var _DEFAULT_LOCALS_NAME = 'locals';
var _NAME = 'ejs';
var _REGEX_STRING = '(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)';
var _OPTS_PASSABLE_WITH_DATA = ['delimiter', 'scope', 'context', 'debug', 'compileDebug',
  'client', '_with', 'rmWhitespace', 'strict', 'filename', 'async'];
// We don't allow 'cache' option to be passed in the data obj for
// the normal `render` call, but this is where Express 2 & 3 put it
// so we make an exception for `renderFile`
var _OPTS_PASSABLE_WITH_DATA_EXPRESS = _OPTS_PASSABLE_WITH_DATA.concat('cache');
var _BOM = /^\uFEFF/;

/**
 * EJS template function cache. This can be a LRU object from lru-cache NPM
 * module. By default, it is {@link module:utils.cache}, a simple in-process
 * cache that grows continuously.
 *
 * @type {Cache}
 */

exports.cache = utils.cache;

/**
 * Custom file loader. Useful for template preprocessing or restricting access
 * to a certain part of the filesystem.
 *
 * @type {fileLoader}
 */

exports.fileLoader = fs.readFileSync;

/**
 * Name of the object containing the locals.
 *
 * This variable is overridden by {@link Options}`.localsName` if it is not
 * `undefined`.
 *
 * @type {String}
 * @public
 */

exports.localsName = _DEFAULT_LOCALS_NAME;

/**
 * Promise implementation -- defaults to the native implementation if available
 * This is mostly just for testability
 *
 * @type {PromiseConstructorLike}
 * @public
 */

exports.promiseImpl = (new Function('return this;'))().Promise;

/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * @param {String}  name     specified path
 * @param {String}  filename parent file path
 * @param {Boolean} [isDir=false] whether the parent file path is a directory
 * @return {String}
 */
exports.resolveInclude = function(name, filename, isDir) {
  var dirname = path.dirname;
  var extname = path.extname;
  var resolve = path.resolve;
  var includePath = resolve(isDir ? filename : dirname(filename), name);
  var ext = extname(name);
  if (!ext) {
    includePath += '.ejs';
  }
  return includePath;
};

/**
 * Try to resolve file path on multiple directories
 *
 * @param  {String}        name  specified path
 * @param  {Array<String>} paths list of possible parent directory paths
 * @return {String}
 */
function resolvePaths(name, paths) {
  var filePath;
  if (paths.some(function (v) {
    filePath = exports.resolveInclude(name, v, true);
    return fs.existsSync(filePath);
  })) {
    return filePath;
  }
}

/**
 * Get the path to the included file by Options
 *
 * @param  {String}  path    specified path
 * @param  {Options} options compilation options
 * @return {String}
 */
function getIncludePath(path, options) {
  var includePath;
  var filePath;
  var views = options.views;
  var match = /^[A-Za-z]+:\\|^\//.exec(path);

  // Abs path
  if (match && match.length) {
    path = path.replace(/^\/*/, '');
    if (Array.isArray(options.root)) {
      includePath = resolvePaths(path, options.root);
    } else {
      includePath = exports.resolveInclude(path, options.root || '/', true);
    }
  }
  // Relative paths
  else {
    // Look relative to a passed filename first
    if (options.filename) {
      filePath = exports.resolveInclude(path, options.filename);
      if (fs.existsSync(filePath)) {
        includePath = filePath;
      }
    }
    // Then look in any views directories
    if (!includePath && Array.isArray(views)) {
      includePath = resolvePaths(path, views);
    }
    if (!includePath && typeof options.includer !== 'function') {
      throw new Error('Could not find the include file "' +
          options.escapeFunction(path) + '"');
    }
  }
  return includePath;
}

/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `template` is not set, the file specified in `options.filename` will be
 * read.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @memberof module:ejs-internal
 * @param {Options} options   compilation options
 * @param {String} [template] template source
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned.
 * @static
 */

function handleCache(options, template) {
  var func;
  var filename = options.filename;
  var hasTemplate = arguments.length > 1;

  if (options.cache) {
    if (!filename) {
      throw new Error('cache option requires a filename');
    }
    func = exports.cache.get(filename);
    if (func) {
      return func;
    }
    if (!hasTemplate) {
      template = fileLoader(filename).toString().replace(_BOM, '');
    }
  }
  else if (!hasTemplate) {
    // istanbul ignore if: should not happen at all
    if (!filename) {
      throw new Error('Internal EJS error: no file name or template '
                    + 'provided');
    }
    template = fileLoader(filename).toString().replace(_BOM, '');
  }
  func = exports.compile(template, options);
  if (options.cache) {
    exports.cache.set(filename, func);
  }
  return func;
}

/**
 * Try calling handleCache with the given options and data and call the
 * callback with the result. If an error occurs, call the callback with
 * the error. Used by renderFile().
 *
 * @memberof module:ejs-internal
 * @param {Options} options    compilation options
 * @param {Object} data        template data
 * @param {RenderFileCallback} cb callback
 * @static
 */

function tryHandleCache(options, data, cb) {
  var result;
  if (!cb) {
    if (typeof exports.promiseImpl == 'function') {
      return new exports.promiseImpl(function (resolve, reject) {
        try {
          result = handleCache(options)(data);
          resolve(result);
        }
        catch (err) {
          reject(err);
        }
      });
    }
    else {
      throw new Error('Please provide a callback function');
    }
  }
  else {
    try {
      result = handleCache(options)(data);
    }
    catch (err) {
      return cb(err);
    }

    cb(null, result);
  }
}

/**
 * fileLoader is independent
 *
 * @param {String} filePath ejs file path.
 * @return {String} The contents of the specified file.
 * @static
 */

function fileLoader(filePath){
  return exports.fileLoader(filePath);
}

/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * @memberof module:ejs-internal
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned
 * @static
 */

function includeFile(path, options) {
  var opts = utils.shallowCopy({}, options);
  opts.filename = getIncludePath(path, opts);
  if (typeof options.includer === 'function') {
    var includerResult = options.includer(path, opts.filename);
    if (includerResult) {
      if (includerResult.filename) {
        opts.filename = includerResult.filename;
      }
      if (includerResult.template) {
        return handleCache(opts, includerResult.template);
      }
    }
  }
  return handleCache(opts);
}

/**
 * Re-throw the given `err` in context to the `str` of ejs, `filename`, and
 * `lineno`.
 *
 * @implements {RethrowCallback}
 * @memberof module:ejs-internal
 * @param {Error}  err      Error object
 * @param {String} str      EJS source
 * @param {String} flnm     file name of the EJS file
 * @param {Number} lineno   line number of the error
 * @param {EscapeCallback} esc
 * @static
 */

function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
}

function stripSemi(str){
  return str.replace(/;(\s*$)/, '$1');
}

/**
 * Compile the given `str` of ejs into a template function.
 *
 * @param {String}  template EJS template
 *
 * @param {Options} [opts] compilation options
 *
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `opts.client`, either type might be returned.
 * Note that the return type of the function also depends on the value of `opts.async`.
 * @public
 */

exports.compile = function compile(template, opts) {
  var templ;

  // v1 compat
  // 'scope' is 'context'
  // FIXME: Remove this in a future version
  if (opts && opts.scope) {
    if (!scopeOptionWarned){
      console.warn('`scope` option is deprecated and will be removed in EJS 3');
      scopeOptionWarned = true;
    }
    if (!opts.context) {
      opts.context = opts.scope;
    }
    delete opts.scope;
  }
  templ = new Template(template, opts);
  return templ.compile();
};

/**
 * Render the given `template` of ejs.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}   template EJS template
 * @param {Object}  [data={}] template data
 * @param {Options} [opts={}] compilation and rendering options
 * @return {(String|Promise<String>)}
 * Return value type depends on `opts.async`.
 * @public
 */

exports.render = function (template, d, o) {
  var data = d || {};
  var opts = o || {};

  // No options object -- if there are optiony names
  // in the data, copy them to options
  if (arguments.length == 2) {
    utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA);
  }

  return handleCache(opts, template)(data);
};

/**
 * Render an EJS file at the given `path` and callback `cb(err, str)`.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}             path     path to the EJS file
 * @param {Object}            [data={}] template data
 * @param {Options}           [opts={}] compilation and rendering options
 * @param {RenderFileCallback} cb callback
 * @public
 */

exports.renderFile = function () {
  var args = Array.prototype.slice.call(arguments);
  var filename = args.shift();
  var cb;
  var opts = {filename: filename};
  var data;
  var viewOpts;

  // Do we have a callback?
  if (typeof arguments[arguments.length - 1] == 'function') {
    cb = args.pop();
  }
  // Do we have data/opts?
  if (args.length) {
    // Should always have data obj
    data = args.shift();
    // Normal passed opts (data obj + opts obj)
    if (args.length) {
      // Use shallowCopy so we don't pollute passed in opts obj with new vals
      utils.shallowCopy(opts, args.pop());
    }
    // Special casing for Express (settings + opts-in-data)
    else {
      // Express 3 and 4
      if (data.settings) {
        // Pull a few things from known locations
        if (data.settings.views) {
          opts.views = data.settings.views;
        }
        if (data.settings['view cache']) {
          opts.cache = true;
        }
        // Undocumented after Express 2, but still usable, esp. for
        // items that are unsafe to be passed along with data, like `root`
        viewOpts = data.settings['view options'];
        if (viewOpts) {
          utils.shallowCopy(opts, viewOpts);
        }
      }
      // Express 2 and lower, values set in app.locals, or people who just
      // want to pass options in their data. NOTE: These values will override
      // anything previously set in settings  or settings['view options']
      utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA_EXPRESS);
    }
    opts.filename = filename;
  }
  else {
    data = {};
  }

  return tryHandleCache(opts, data, cb);
};

/**
 * Clear intermediate JavaScript cache. Calls {@link Cache#reset}.
 * @public
 */

/**
 * EJS template class
 * @public
 */
exports.Template = Template;

exports.clearCache = function () {
  exports.cache.reset();
};

function Template(text, opts) {
  opts = opts || {};
  var options = {};
  this.templateText = text;
  /** @type {string | null} */
  this.mode = null;
  this.truncate = false;
  this.currentLine = 1;
  this.source = '';
  options.client = opts.client || false;
  options.escapeFunction = opts.escape || opts.escapeFunction || utils.escapeXML;
  options.compileDebug = opts.compileDebug !== false;
  options.debug = !!opts.debug;
  options.filename = opts.filename;
  options.openDelimiter = opts.openDelimiter || exports.openDelimiter || _DEFAULT_OPEN_DELIMITER;
  options.closeDelimiter = opts.closeDelimiter || exports.closeDelimiter || _DEFAULT_CLOSE_DELIMITER;
  options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
  options.strict = opts.strict || false;
  options.context = opts.context;
  options.cache = opts.cache || false;
  options.rmWhitespace = opts.rmWhitespace;
  options.root = opts.root;
  options.includer = opts.includer;
  options.outputFunctionName = opts.outputFunctionName;
  options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;
  options.views = opts.views;
  options.async = opts.async;
  options.destructuredLocals = opts.destructuredLocals;
  options.legacyInclude = typeof opts.legacyInclude != 'undefined' ? !!opts.legacyInclude : true;

  if (options.strict) {
    options._with = false;
  }
  else {
    options._with = typeof opts._with != 'undefined' ? opts._with : true;
  }

  this.opts = options;

  this.regex = this.createRegex();
}

Template.modes = {
  EVAL: 'eval',
  ESCAPED: 'escaped',
  RAW: 'raw',
  COMMENT: 'comment',
  LITERAL: 'literal'
};

Template.prototype = {
  createRegex: function () {
    var str = _REGEX_STRING;
    var delim = utils.escapeRegExpChars(this.opts.delimiter);
    var open = utils.escapeRegExpChars(this.opts.openDelimiter);
    var close = utils.escapeRegExpChars(this.opts.closeDelimiter);
    str = str.replace(/%/g, delim)
      .replace(/</g, open)
      .replace(/>/g, close);
    return new RegExp(str);
  },

  compile: function () {
    /** @type {string} */
    var src;
    /** @type {ClientFunction} */
    var fn;
    var opts = this.opts;
    var prepended = '';
    var appended = '';
    /** @type {EscapeCallback} */
    var escapeFn = opts.escapeFunction;
    /** @type {FunctionConstructor} */
    var ctor;

    if (!this.source) {
      this.generateSource();
      prepended +=
        '  var __output = "";\n' +
        '  function __append(s) { if (s !== undefined && s !== null) __output += s }\n';
      if (opts.outputFunctionName) {
        prepended += '  var ' + opts.outputFunctionName + ' = __append;' + '\n';
      }
      if (opts.destructuredLocals && opts.destructuredLocals.length) {
        var destructuring = '  var __locals = (' + opts.localsName + ' || {}),\n';
        for (var i = 0; i < opts.destructuredLocals.length; i++) {
          var name = opts.destructuredLocals[i];
          if (i > 0) {
            destructuring += ',\n  ';
          }
          destructuring += name + ' = __locals.' + name;
        }
        prepended += destructuring + ';\n';
      }
      if (opts._with !== false) {
        prepended +=  '  with (' + opts.localsName + ' || {}) {' + '\n';
        appended += '  }' + '\n';
      }
      appended += '  return __output;' + '\n';
      this.source = prepended + this.source + appended;
    }

    if (opts.compileDebug) {
      src = 'var __line = 1' + '\n'
        + '  , __lines = ' + JSON.stringify(this.templateText) + '\n'
        + '  , __filename = ' + (opts.filename ?
        JSON.stringify(opts.filename) : 'undefined') + ';' + '\n'
        + 'try {' + '\n'
        + this.source
        + '} catch (e) {' + '\n'
        + '  rethrow(e, __lines, __filename, __line, escapeFn);' + '\n'
        + '}' + '\n';
    }
    else {
      src = this.source;
    }

    if (opts.client) {
      src = 'escapeFn = escapeFn || ' + escapeFn.toString() + ';' + '\n' + src;
      if (opts.compileDebug) {
        src = 'rethrow = rethrow || ' + rethrow.toString() + ';' + '\n' + src;
      }
    }

    if (opts.strict) {
      src = '"use strict";\n' + src;
    }
    if (opts.debug) {
      console.log(src);
    }
    if (opts.compileDebug && opts.filename) {
      src = src + '\n'
        + '//# sourceURL=' + opts.filename + '\n';
    }

    try {
      if (opts.async) {
        // Have to use generated function for this, since in envs without support,
        // it breaks in parsing
        try {
          ctor = (new Function('return (async function(){}).constructor;'))();
        }
        catch(e) {
          if (e instanceof SyntaxError) {
            throw new Error('This environment does not support async/await');
          }
          else {
            throw e;
          }
        }
      }
      else {
        ctor = Function;
      }
      fn = new ctor(opts.localsName + ', escapeFn, include, rethrow', src);
    }
    catch(e) {
      // istanbul ignore else
      if (e instanceof SyntaxError) {
        if (opts.filename) {
          e.message += ' in ' + opts.filename;
        }
        e.message += ' while compiling ejs\n\n';
        e.message += 'If the above error is not helpful, you may want to try EJS-Lint:\n';
        e.message += 'https://github.com/RyanZim/EJS-Lint';
        if (!opts.async) {
          e.message += '\n';
          e.message += 'Or, if you meant to create an async function, pass `async: true` as an option.';
        }
      }
      throw e;
    }

    // Return a callable function which will execute the function
    // created by the source-code, with the passed data as locals
    // Adds a local `include` function which allows full recursive include
    var returnedFn = opts.client ? fn : function anonymous(data) {
      var include = function (path, includeData) {
        var d = utils.shallowCopy({}, data);
        if (includeData) {
          d = utils.shallowCopy(d, includeData);
        }
        return includeFile(path, opts)(d);
      };
      return fn.apply(opts.context, [data || {}, escapeFn, include, rethrow]);
    };
    if (opts.filename && typeof Object.defineProperty === 'function') {
      var filename = opts.filename;
      var basename = path.basename(filename, path.extname(filename));
      try {
        Object.defineProperty(returnedFn, 'name', {
          value: basename,
          writable: false,
          enumerable: false,
          configurable: true
        });
      } catch (e) {/* ignore */}
    }
    return returnedFn;
  },

  generateSource: function () {
    var opts = this.opts;

    if (opts.rmWhitespace) {
      // Have to use two separate replace here as `^` and `$` operators don't
      // work well with `\r` and empty lines don't work well with the `m` flag.
      this.templateText =
        this.templateText.replace(/[\r\n]+/g, '\n').replace(/^\s+|\s+$/gm, '');
    }

    // Slurp spaces and tabs before <%_ and after _%>
    this.templateText =
      this.templateText.replace(/[ \t]*<%_/gm, '<%_').replace(/_%>[ \t]*/gm, '_%>');

    var self = this;
    var matches = this.parseTemplateText();
    var d = this.opts.delimiter;
    var o = this.opts.openDelimiter;
    var c = this.opts.closeDelimiter;

    if (matches && matches.length) {
      matches.forEach(function (line, index) {
        var closing;
        // If this is an opening tag, check for closing tags
        // FIXME: May end up with some false positives here
        // Better to store modes as k/v with openDelimiter + delimiter as key
        // Then this can simply check against the map
        if ( line.indexOf(o + d) === 0        // If it is a tag
          && line.indexOf(o + d + d) !== 0) { // and is not escaped
          closing = matches[index + 2];
          if (!(closing == d + c || closing == '-' + d + c || closing == '_' + d + c)) {
            throw new Error('Could not find matching close tag for "' + line + '".');
          }
        }
        self.scanLine(line);
      });
    }

  },

  parseTemplateText: function () {
    var str = this.templateText;
    var pat = this.regex;
    var result = pat.exec(str);
    var arr = [];
    var firstPos;

    while (result) {
      firstPos = result.index;

      if (firstPos !== 0) {
        arr.push(str.substring(0, firstPos));
        str = str.slice(firstPos);
      }

      arr.push(result[0]);
      str = str.slice(result[0].length);
      result = pat.exec(str);
    }

    if (str) {
      arr.push(str);
    }

    return arr;
  },

  _addOutput: function (line) {
    if (this.truncate) {
      // Only replace single leading linebreak in the line after
      // -%> tag -- this is the single, trailing linebreak
      // after the tag that the truncation mode replaces
      // Handle Win / Unix / old Mac linebreaks -- do the \r\n
      // combo first in the regex-or
      line = line.replace(/^(?:\r\n|\r|\n)/, '');
      this.truncate = false;
    }
    if (!line) {
      return line;
    }

    // Preserve literal slashes
    line = line.replace(/\\/g, '\\\\');

    // Convert linebreaks
    line = line.replace(/\n/g, '\\n');
    line = line.replace(/\r/g, '\\r');

    // Escape double-quotes
    // - this will be the delimiter during execution
    line = line.replace(/"/g, '\\"');
    this.source += '    ; __append("' + line + '")' + '\n';
  },

  scanLine: function (line) {
    var self = this;
    var d = this.opts.delimiter;
    var o = this.opts.openDelimiter;
    var c = this.opts.closeDelimiter;
    var newLineCount = 0;

    newLineCount = (line.split('\n').length - 1);

    switch (line) {
    case o + d:
    case o + d + '_':
      this.mode = Template.modes.EVAL;
      break;
    case o + d + '=':
      this.mode = Template.modes.ESCAPED;
      break;
    case o + d + '-':
      this.mode = Template.modes.RAW;
      break;
    case o + d + '#':
      this.mode = Template.modes.COMMENT;
      break;
    case o + d + d:
      this.mode = Template.modes.LITERAL;
      this.source += '    ; __append("' + line.replace(o + d + d, o + d) + '")' + '\n';
      break;
    case d + d + c:
      this.mode = Template.modes.LITERAL;
      this.source += '    ; __append("' + line.replace(d + d + c, d + c) + '")' + '\n';
      break;
    case d + c:
    case '-' + d + c:
    case '_' + d + c:
      if (this.mode == Template.modes.LITERAL) {
        this._addOutput(line);
      }

      this.mode = null;
      this.truncate = line.indexOf('-') === 0 || line.indexOf('_') === 0;
      break;
    default:
      // In script mode, depends on type of tag
      if (this.mode) {
        // If '//' is found without a line break, add a line break.
        switch (this.mode) {
        case Template.modes.EVAL:
        case Template.modes.ESCAPED:
        case Template.modes.RAW:
          if (line.lastIndexOf('//') > line.lastIndexOf('\n')) {
            line += '\n';
          }
        }
        switch (this.mode) {
        // Just executing code
        case Template.modes.EVAL:
          this.source += '    ; ' + line + '\n';
          break;
          // Exec, esc, and output
        case Template.modes.ESCAPED:
          this.source += '    ; __append(escapeFn(' + stripSemi(line) + '))' + '\n';
          break;
          // Exec and output
        case Template.modes.RAW:
          this.source += '    ; __append(' + stripSemi(line) + ')' + '\n';
          break;
        case Template.modes.COMMENT:
          // Do nothing
          break;
          // Literal <%% mode, append as raw output
        case Template.modes.LITERAL:
          this._addOutput(line);
          break;
        }
      }
      // In string mode, just add the output
      else {
        this._addOutput(line);
      }
    }

    if (self.opts.compileDebug && newLineCount) {
      this.currentLine += newLineCount;
      this.source += '    ; __line = ' + this.currentLine + '\n';
    }
  }
};

/**
 * Escape characters reserved in XML.
 *
 * This is simply an export of {@link module:utils.escapeXML}.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @public
 * @func
 * */
exports.escapeXML = utils.escapeXML;

/**
 * Express.js support.
 *
 * This is an alias for {@link module:ejs.renderFile}, in order to support
 * Express.js out-of-the-box.
 *
 * @func
 */

exports.__express = exports.renderFile;

/**
 * Version of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.VERSION = _VERSION_STRING;

/**
 * Name for detection of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.name = _NAME;

/* istanbul ignore if */
if (typeof window != 'undefined') {
  window.ejs = exports;
}


/***/ }),

/***/ "./node_modules/ejs/lib/utils.js":
/*!***************************************!*\
  !*** ./node_modules/ejs/lib/utils.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

/**
 * Private utility functions
 * @module utils
 * @private
 */



var regExpChars = /[|\\{}()[\]^$+*?.]/g;

/**
 * Escape characters reserved in regular expressions.
 *
 * If `string` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} string Input string
 * @return {String} Escaped string
 * @static
 * @private
 */
exports.escapeRegExpChars = function (string) {
  // istanbul ignore if
  if (!string) {
    return '';
  }
  return String(string).replace(regExpChars, '\\$&');
};

var _ENCODE_HTML_RULES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&#34;',
  "'": '&#39;'
};
var _MATCH_HTML = /[&<>'"]/g;

function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}

/**
 * Stringified version of constants used by {@link module:utils.escapeXML}.
 *
 * It is used in the process of generating {@link ClientFunction}s.
 *
 * @readonly
 * @type {String}
 */

var escapeFuncStr =
  'var _ENCODE_HTML_RULES = {\n'
+ '      "&": "&amp;"\n'
+ '    , "<": "&lt;"\n'
+ '    , ">": "&gt;"\n'
+ '    , \'"\': "&#34;"\n'
+ '    , "\'": "&#39;"\n'
+ '    }\n'
+ '  , _MATCH_HTML = /[&<>\'"]/g;\n'
+ 'function encode_char(c) {\n'
+ '  return _ENCODE_HTML_RULES[c] || c;\n'
+ '};\n';

/**
 * Escape characters reserved in XML.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @implements {EscapeCallback}
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @static
 * @private
 */

exports.escapeXML = function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
exports.escapeXML.toString = function () {
  return Function.prototype.toString.call(this) + ';\n' + escapeFuncStr;
};

/**
 * Naive copy of properties from one object to another.
 * Does not recurse into non-scalar properties
 * Does not check to see if the property has a value before copying
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopy = function (to, from) {
  from = from || {};
  for (var p in from) {
    to[p] = from[p];
  }
  return to;
};

/**
 * Naive copy of a list of key names, from one object to another.
 * Only copies property if it is actually defined
 * Does not recurse into non-scalar properties
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @param  {Array} list List of properties to copy
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopyFromList = function (to, from, list) {
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    if (typeof from[p] != 'undefined') {
      to[p] = from[p];
    }
  }
  return to;
};

/**
 * Simple in-process cache implementation. Does not implement limits of any
 * sort.
 *
 * @implements {Cache}
 * @static
 * @private
 */
exports.cache = {
  _data: {},
  set: function (key, val) {
    this._data[key] = val;
  },
  get: function (key) {
    return this._data[key];
  },
  remove: function (key) {
    delete this._data[key];
  },
  reset: function () {
    this._data = {};
  }
};

/**
 * Transforms hyphen case variable into camel case.
 *
 * @param {String} string Hyphen case string
 * @return {String} Camel case string
 * @static
 * @private
 */
exports.hyphenToCamel = function (str) {
  return str.replace(/-[a-z]/g, function (match) { return match[1].toUpperCase(); });
};


/***/ }),

/***/ "./node_modules/ejs/package.json":
/*!***************************************!*\
  !*** ./node_modules/ejs/package.json ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse("{\"name\":\"ejs\",\"description\":\"Embedded JavaScript templates\",\"keywords\":[\"template\",\"engine\",\"ejs\"],\"version\":\"3.1.5\",\"author\":\"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)\",\"license\":\"Apache-2.0\",\"bin\":{\"ejs\":\"./bin/cli.js\"},\"main\":\"./lib/ejs.js\",\"jsdelivr\":\"ejs.min.js\",\"unpkg\":\"ejs.min.js\",\"repository\":{\"type\":\"git\",\"url\":\"git://github.com/mde/ejs.git\"},\"bugs\":\"https://github.com/mde/ejs/issues\",\"homepage\":\"https://github.com/mde/ejs\",\"dependencies\":{\"jake\":\"^10.6.1\"},\"devDependencies\":{\"browserify\":\"^16.5.1\",\"eslint\":\"^6.8.0\",\"git-directory-deploy\":\"^1.5.1\",\"jsdoc\":\"^3.6.4\",\"lru-cache\":\"^4.0.1\",\"mocha\":\"^7.1.1\",\"uglify-js\":\"^3.3.16\"},\"engines\":{\"node\":\">=0.10.0\"},\"scripts\":{\"test\":\"mocha\"}}");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9lanMvbGliL2Vqcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2Vqcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL3NyYy9zdHlsZXMuc2NzcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6WyJjdXJyZW50R2FtZSIsImRpc3BsYXllZENhcmRzIiwic2VsZWN0ZWRDYXJkcyIsIm51bU9mQ2FyZHMiLCJkYXNoYm9hcmREaXYiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnYW1lQ29udGFpbmVyIiwiY2FyZFNlbGVjdGlvbkNvbnRhaW5lciIsImVycm9yQ29udGFpbmVyIiwiZ2FtZUluZm9Db250YWluZXIiLCJyZWdpc3RyYXRpb25Db250YWluZXIiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwicmVnaXN0cmF0aW9uVGV4dCIsImlubmVyVGV4dCIsInJlZ1VzZXJOYW1lRGl2IiwicmVnVXNlck5hbWUiLCJwbGFjZWhvbGRlciIsInJlZ1Bhc3N3b3JkRGl2IiwicmVnUGFzc3dvcmQiLCJyZWdpc3RyYXRpb25CdG4iLCJhcHBlbmRDaGlsZCIsImxvZ2luQ29udGFpbmVyIiwibG9naW5UZXh0IiwidXNlck5hbWVEaXYiLCJ1c2VyTmFtZSIsInBhc3N3b3JkRGl2IiwicGFzc3dvcmQiLCJsb2dpbkJ0biIsImNoZWNrTG9nZ2VkSW4iLCJheGlvcyIsInRoZW4iLCJyZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJkYXRhIiwiaXNMb2dnZWRJbiIsImJvZHkiLCJkaWZmQ29udGFpbmVyIiwicGxheUJ0biIsImVycm9yIiwiYmduQnRuIiwidHlwZSIsIm5hbWUiLCJjaGVja2VkIiwidmFsdWUiLCJiZ25MYWJlbCIsImJnbkRlc2NyaXB0aW9uIiwiY3JlYXRlVGV4dE5vZGUiLCJhZHZCdG4iLCJhZHZMYWJlbCIsImFkdkRlc2NyaXB0aW9uIiwiZXhwQnRuIiwiZXhwTGFiZWwiLCJleHBEZXNjcmlwdGlvbiIsImZsYXNoZWRDYXJkcyIsImZsYXNoZWRDYXJkQ29udGFpbmVyIiwiYWxsQ2FyZHMiLCJhbGxDYXJkc0NvbnRhaW5lciIsInJlc3VsdEZsYXNoZWRDYXJkcyIsInN1Ym1pdEFuc0J0biIsInJlc3VsdE91dGNvbWUiLCJwbGF5QWdhaW5CdG4iLCJjcmVhdGVDYXJkIiwiY2FyZEluZm8iLCJzdWl0Iiwic3VpdFN5bWJvbCIsImNvbG9yIiwiZGlzcGxheU5hbWUiLCJjYXJkIiwiZmxhc2hpbmdDYXJkcyIsImdhbWVMZXZlbCIsImZsYXNoQ2FyZHMiLCJjYXJkRWxlbWVudCIsImkiLCJwdXNoIiwiaWQiLCJ0b2dnbGUiLCJzZXRUaW1lb3V0IiwiZGlzcGxheUNhcmRzIiwibGVuZ3RoIiwiaiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNhcmRTZWxlY3Rpb24iLCJjYXJkMCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNhcmRTZWxlY3RlZCIsImNhcmQxIiwiY2FyZDIiLCJjYXJkMyIsImNhcmQ0IiwiY2FyZDUiLCJjYXJkNiIsImNhcmQ3IiwiY2FyZDgiLCJjYXJkOSIsImUiLCJjdXJyZW50VGFyZ2V0IiwicmVtb3ZlIiwiZmlyc3RDaGlsZCIsImNhcmRTdWl0U3ltYm9sIiwibGFzdENoaWxkIiwiZGlzcGxheUZpbmFsUmVzdWx0cyIsInJlZ2lzdGVyRGF0YSIsImlubmVySFRNTCIsImxvZ2luRGF0YSIsInVzZXJEaXYiLCJyZXNwb25zZVVzZXIiLCJ1c2VyIiwicmVtb3ZlQ2hpbGQiLCJkaWZmaWN1bHR5IiwiaXNXb24iLCJjYXJkRGlmZmVyZW5jZSIsImFsZXJ0IiwiY291bnQiLCJnYW1lUmVzdWx0IiwibmV3R2FtZSIsImlzQ29tcGxldGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw0RkFBdUMsQzs7Ozs7Ozs7Ozs7QUNBMUI7O0FBRWIs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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsV0FBVztBQUNYO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGtEQUFrRCwrQkFBK0IsRUFBRTtBQUNuRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbExBOzs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoibWFpbi05MGEwM2U2M2E1N2M5YWQ5Yzc0OS5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgYnVpbGRGdWxsUGF0aCA9IHJlcXVpcmUoJy4uL2NvcmUvYnVpbGRGdWxsUGF0aCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpZy5hdXRoLnBhc3N3b3JkKSkgOiAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXG4gICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZVxuICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCByZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcbiAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhY29uZmlnLnJlc3BvbnNlVHlwZSB8fCBjb25maWcucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgdmFyIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSAndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnO1xuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcih0aW1lb3V0RXJyb3JNZXNzYWdlLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oZnVsbFBhdGgpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gRXhwZWN0ZWQgRE9NRXhjZXB0aW9uIHRocm93biBieSBicm93c2VycyBub3QgY29tcGF0aWJsZSBYTUxIdHRwUmVxdWVzdCBMZXZlbCAyLlxuICAgICAgICAvLyBCdXQsIHRoaXMgY2FuIGJlIHN1cHByZXNzZWQgZm9yICdqc29uJyB0eXBlIGFzIGl0IGNhbiBiZSBwYXJzZWQgYnkgZGVmYXVsdCAndHJhbnNmb3JtUmVzcG9uc2UnIGZ1bmN0aW9uLlxuICAgICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY2FuY2VsKTtcbiAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghcmVxdWVzdERhdGEpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vY29yZS9tZXJnZUNvbmZpZycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG52YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuYXhpb3MuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gIHJldHVybiBjcmVhdGVJbnN0YW5jZShtZXJnZUNvbmZpZyhheGlvcy5kZWZhdWx0cywgaW5zdGFuY2VDb25maWcpKTtcbn07XG5cbi8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuYXhpb3MuQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsJyk7XG5heGlvcy5DYW5jZWxUb2tlbiA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbFRva2VuJyk7XG5heGlvcy5pc0NhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL2lzQ2FuY2VsJyk7XG5cbi8vIEV4cG9zZSBhbGwvc3ByZWFkXG5heGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5heGlvcy5zcHJlYWQgPSByZXF1aXJlKCcuL2hlbHBlcnMvc3ByZWFkJyk7XG5cbi8vIEV4cG9zZSBpc0F4aW9zRXJyb3JcbmF4aW9zLmlzQXhpb3NFcnJvciA9IHJlcXVpcmUoJy4vaGVscGVycy9pc0F4aW9zRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBgQ2FuY2VsYCBpcyBhbiBvYmplY3QgdGhhdCBpcyB0aHJvd24gd2hlbiBhbiBvcGVyYXRpb24gaXMgY2FuY2VsZWQuXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkNhbmNlbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG59O1xuXG5DYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4vQ2FuY2VsJyk7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcbiAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHZhciByZXNvbHZlUHJvbWlzZTtcbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vbWVyZ2VDb25maWcnKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcbiAgICBjb25maWcudXJsID0gYXJndW1lbnRzWzBdO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgfVxuXG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgLy8gU2V0IGNvbmZpZy5tZXRob2RcbiAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdHMubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLm1ldGhvZCA9ICdnZXQnO1xuICB9XG5cbiAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIHJldHVybiBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IChjb25maWcgfHwge30pLmRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgY29uZmlnLmRhdGEsXG4gICAgY29uZmlnLmhlYWRlcnMsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICAvLyBGbGF0dGVuIGhlYWRlcnNcbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcbiAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNcbiAgKTtcblxuICB1dGlscy5mb3JFYWNoKFxuICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgfVxuICApO1xuXG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuXG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICBlcnJvci5pc0F4aW9zRXJyb3IgPSB0cnVlO1xuXG4gIGVycm9yLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGNvZGU6IHRoaXMuY29kZVxuICAgIH07XG4gIH07XG4gIHJldHVybiBlcnJvcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICogQHJldHVybnMge09iamVjdH0gTmV3IG9iamVjdCByZXN1bHRpbmcgZnJvbSBtZXJnaW5nIGNvbmZpZzIgdG8gY29uZmlnMVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICB2YXIgY29uZmlnID0ge307XG5cbiAgdmFyIHZhbHVlRnJvbUNvbmZpZzJLZXlzID0gWyd1cmwnLCAnbWV0aG9kJywgJ2RhdGEnXTtcbiAgdmFyIG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzID0gWydoZWFkZXJzJywgJ2F1dGgnLCAncHJveHknLCAncGFyYW1zJ107XG4gIHZhciBkZWZhdWx0VG9Db25maWcyS2V5cyA9IFtcbiAgICAnYmFzZVVSTCcsICd0cmFuc2Zvcm1SZXF1ZXN0JywgJ3RyYW5zZm9ybVJlc3BvbnNlJywgJ3BhcmFtc1NlcmlhbGl6ZXInLFxuICAgICd0aW1lb3V0JywgJ3RpbWVvdXRNZXNzYWdlJywgJ3dpdGhDcmVkZW50aWFscycsICdhZGFwdGVyJywgJ3Jlc3BvbnNlVHlwZScsICd4c3JmQ29va2llTmFtZScsXG4gICAgJ3hzcmZIZWFkZXJOYW1lJywgJ29uVXBsb2FkUHJvZ3Jlc3MnLCAnb25Eb3dubG9hZFByb2dyZXNzJywgJ2RlY29tcHJlc3MnLFxuICAgICdtYXhDb250ZW50TGVuZ3RoJywgJ21heEJvZHlMZW5ndGgnLCAnbWF4UmVkaXJlY3RzJywgJ3RyYW5zcG9ydCcsICdodHRwQWdlbnQnLFxuICAgICdodHRwc0FnZW50JywgJ2NhbmNlbFRva2VuJywgJ3NvY2tldFBhdGgnLCAncmVzcG9uc2VFbmNvZGluZydcbiAgXTtcbiAgdmFyIGRpcmVjdE1lcmdlS2V5cyA9IFsndmFsaWRhdGVTdGF0dXMnXTtcblxuICBmdW5jdGlvbiBnZXRNZXJnZWRWYWx1ZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHRhcmdldCkgJiYgdXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2UodGFyZ2V0LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2Uoe30sIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIHV0aWxzLmZvckVhY2godmFsdWVGcm9tQ29uZmlnMktleXMsIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzLCBtZXJnZURlZXBQcm9wZXJ0aWVzKTtcblxuICB1dGlscy5mb3JFYWNoKGRlZmF1bHRUb0NvbmZpZzJLZXlzLCBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChkaXJlY3RNZXJnZUtleXMsIGZ1bmN0aW9uIG1lcmdlKHByb3ApIHtcbiAgICBpZiAocHJvcCBpbiBjb25maWcyKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKHByb3AgaW4gY29uZmlnMSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBheGlvc0tleXMgPSB2YWx1ZUZyb21Db25maWcyS2V5c1xuICAgIC5jb25jYXQobWVyZ2VEZWVwUHJvcGVydGllc0tleXMpXG4gICAgLmNvbmNhdChkZWZhdWx0VG9Db25maWcyS2V5cylcbiAgICAuY29uY2F0KGRpcmVjdE1lcmdlS2V5cyk7XG5cbiAgdmFyIG90aGVyS2V5cyA9IE9iamVjdFxuICAgIC5rZXlzKGNvbmZpZzEpXG4gICAgLmNvbmNhdChPYmplY3Qua2V5cyhjb25maWcyKSlcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIGZpbHRlckF4aW9zS2V5cyhrZXkpIHtcbiAgICAgIHJldHVybiBheGlvc0tleXMuaW5kZXhPZihrZXkpID09PSAtMTtcbiAgICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG90aGVyS2V5cywgbWVyZ2VEZWVwUHJvcGVydGllcyk7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQWNjZXB0Jyk7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICBtYXhCb2R5TGVuZ3RoOiAtMSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9XG59O1xuXG5kZWZhdWx0cy5oZWFkZXJzID0ge1xuICBjb21tb246IHtcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB2YXIgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKCcjJyk7XG4gICAgaWYgKGhhc2htYXJrSW5kZXggIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgaGFzaG1hcmtJbmRleCk7XG4gICAgfVxuXG4gICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkxcbiAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuICAgIDogYmFzZVVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3NcbiAqXG4gKiBAcGFyYW0geyp9IHBheWxvYWQgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvcywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBeGlvc0Vycm9yKHBheWxvYWQpIHtcbiAgcmV0dXJuICh0eXBlb2YgcGF5bG9hZCA9PT0gJ29iamVjdCcpICYmIChwYXlsb2FkLmlzQXhpb3NFcnJvciA9PT0gdHJ1ZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAgIC8qKlxuICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAqL1xuICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgICB9XG5cbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG4gICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcblxuLypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQnVmZmVyKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwpICYmIHZhbC5jb25zdHJ1Y3RvciAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsLmNvbnN0cnVjdG9yKVxuICAgICYmIHR5cGVvZiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcbiAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWwpIHtcbiAgaWYgKHRvU3RyaW5nLmNhbGwodmFsKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbCk7XG4gIHJldHVybiBwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xufVxuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cbmZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICovXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTmF0aXZlU2NyaXB0JyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTlMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFtrZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICogQHJldHVybiB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQk9NKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNQbGFpbk9iamVjdDogaXNQbGFpbk9iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltLFxuICBzdHJpcEJPTTogc3RyaXBCT01cbn07XG4iLCJpbXBvcnQgJy4vc3R5bGVzLnNjc3MnO1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IHJlc29sdmVJbmNsdWRlIH0gZnJvbSAnZWpzJztcbi8vIGdsb2JhbCB2YWx1ZSB0aGF0IGhvbGRzIGluZm8gYWJvdXQgdGhlIGN1cnJlbnQgaGFuZC5cbmxldCBjdXJyZW50R2FtZSA9IG51bGw7XG5sZXQgZGlzcGxheWVkQ2FyZHMgPSBbXVxubGV0IHNlbGVjdGVkQ2FyZHMgPSBbXVxubGV0IG51bU9mQ2FyZHM7XG4vLyBxdWVyeSBmb3IgZ2FtZSxjYXJkLCBlcnJvciBhbmQgaW5zdHJ1dGlvbnMgY29udGFpbmVyXG5jb25zdCBkYXNoYm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGFzaGJvYXJkJyk7XG5jb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhbWUtY29udGFpbmVyJyk7XG5jb25zdCBjYXJkU2VsZWN0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NlbGVjdC1jb250YWluZXInKTtcbmNvbnN0IGVycm9yQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Vycm9yLWNvbnRhaW5lcicpO1xuY29uc3QgZ2FtZUluZm9Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5mby1jb250YWluZXInKTtcbi8vIGNyZWF0ZSByZWdpc3RyYXRpb25zIG9uIGxhbmRpbmcgcGFnZVxuY29uc3QgcmVnaXN0cmF0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5yZWdpc3RyYXRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29udGFpbmVyJywgJ2Zvcm0tc2lnbmluJywgJ2JnLWxpZ2h0Jyk7XG5cbi8vIGNyZWF0ZSByZWdpc3RyYXRpb24gZWxlbWVudHM6IHVzZXIgbmFtZSBhbmQgcHdcbmNvbnN0IHJlZ2lzdHJhdGlvblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xucmVnaXN0cmF0aW9uVGV4dC5pbm5lclRleHQgPSAnUmVnaXN0cmF0aW9uIEZvcm0nO1xuXG5jb25zdCByZWdVc2VyTmFtZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucmVnVXNlck5hbWVEaXYuY2xhc3NMaXN0LmFkZCgnZm9ybS1mbG9hdGluZycpO1xuY29uc3QgcmVnVXNlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xucmVnVXNlck5hbWUucGxhY2Vob2xkZXIgPSAnSW5wdXQgVXNlcm5hbWUnO1xuXG5jb25zdCByZWdQYXNzd29yZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucmVnUGFzc3dvcmREaXYuY2xhc3NMaXN0LmFkZCgnZm9ybS1mbG9hdGluZycpO1xuY29uc3QgcmVnUGFzc3dvcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xucmVnUGFzc3dvcmQucGxhY2Vob2xkZXIgPSAnSW5wdXQgUGFzc3dvcmQnO1xuXG5jb25zdCByZWdpc3RyYXRpb25CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbnJlZ2lzdHJhdGlvbkJ0bi5pbm5lclRleHQgPSAnUmVnaXN0ZXInO1xuXG5yZWdVc2VyTmFtZURpdi5hcHBlbmRDaGlsZChyZWdVc2VyTmFtZSk7XG5yZWdQYXNzd29yZERpdi5hcHBlbmRDaGlsZChyZWdQYXNzd29yZCk7XG5yZWdpc3RyYXRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQocmVnaXN0cmF0aW9uVGV4dCk7XG5yZWdpc3RyYXRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQocmVnVXNlck5hbWVEaXYpO1xucmVnaXN0cmF0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHJlZ1Bhc3N3b3JkRGl2KTtcbnJlZ2lzdHJhdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChyZWdpc3RyYXRpb25CdG4pO1xuXG4vLyAqKioqKioqKioqKioqKiBjcmVhdGUgbG9naW4gb24gbGFuZGluZyBwYWdlICoqKioqKioqKioqKioqLy9cbmNvbnN0IGxvZ2luQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5sb2dpbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjb250YWluZXInLCAnZm9ybS1zaWduaW4nLCAnYmctbGlnaHQnKTtcblxuLy8gY3JlYXRlIGxvZ2luIGVsZW1lbnRzOiBVc2VyTmFtZSBhbmQgcHdcbmNvbnN0IGxvZ2luVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG5sb2dpblRleHQuaW5uZXJUZXh0ID0gJ0xvZ2luIEZvcm0nO1xuXG5jb25zdCB1c2VyTmFtZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xudXNlck5hbWVEaXYuY2xhc3NMaXN0LmFkZCgnZm9ybS1mbG9hdGluZycpO1xuY29uc3QgdXNlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xudXNlck5hbWUucGxhY2Vob2xkZXIgPSAnSW5wdXQgVXNlciBOYW1lJztcblxuY29uc3QgcGFzc3dvcmREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnBhc3N3b3JkRGl2LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tZmxvYXRpbmcnKTtcbmNvbnN0IHBhc3N3b3JkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbnBhc3N3b3JkLnBsYWNlaG9sZGVyID0gJ0lucHV0IFBhc3N3b3JkJztcblxuY29uc3QgbG9naW5CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbmxvZ2luQnRuLmlubmVyVGV4dCA9ICdMb2dpbic7XG5cbnVzZXJOYW1lRGl2LmFwcGVuZENoaWxkKHVzZXJOYW1lKTtcbnBhc3N3b3JkRGl2LmFwcGVuZENoaWxkKHBhc3N3b3JkKTtcbmxvZ2luQ29udGFpbmVyLmFwcGVuZENoaWxkKGxvZ2luVGV4dCk7XG5sb2dpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh1c2VyTmFtZURpdik7XG5sb2dpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChwYXNzd29yZERpdik7XG5sb2dpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2dpbkJ0bik7XG5cbmNvbnN0IGNoZWNrTG9nZ2VkSW4gPSAoKSA9PiB7XG4gIGF4aW9zLmdldCgnL2lzbG9nZ2VkaW4nKVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gbG9naW4gOj4+ICcsIHJlc3BvbnNlKTtcbiAgICAgIGlmIChyZXNwb25zZS5kYXRhLmlzTG9nZ2VkSW4gPT09IHRydWUpXG4gICAgICB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGlmZkNvbnRhaW5lcik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGxheUJ0bik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gcmVuZGVyIG90aGVyIGJ1dHRvbnNcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZWdpc3RyYXRpb25Db250YWluZXIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxvZ2luQ29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IGNvbnNvbGUubG9nKCdlcnJvciBmcm9tIGxvZ2dpbmcgaW4nLCBlcnJvcikpO1xufTtcblxuLy8gKioqKioqKioqKioqKiogY3JlYXRlIGRpZmZpY3VsdHkgc2VsZWN0aW9uIGVsZW1lbnRzICoqKioqKioqKioqKioqLy9cbmNvbnN0IGRpZmZDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmRpZmZDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29udGFpbmVyJywgJ2JnLWxpZ2h0JywgJ2NhcmRDb250YWluZXInKTtcblxuY29uc3QgYmduQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbmJnbkJ0bi50eXBlID0gJ3JhZGlvJztcbmJnbkJ0bi5uYW1lID0gJ2RpZmZpY3VsdHknO1xuYmduQnRuLmNoZWNrZWQgPSBmYWxzZTtcbmJnbkJ0bi52YWx1ZSA9ICdiZWdpbm5lcic7XG5jb25zdCBiZ25MYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5jb25zdCBiZ25EZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdCZWdpbm5lcicpO1xuYmduTGFiZWwuYXBwZW5kQ2hpbGQoYmduRGVzY3JpcHRpb24pO1xuXG5jb25zdCBhZHZCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuYWR2QnRuLnR5cGUgPSAncmFkaW8nO1xuYWR2QnRuLm5hbWUgPSAnZGlmZmljdWx0eSc7XG5hZHZCdG4uY2hlY2tlZCA9IGZhbHNlO1xuYWR2QnRuLnZhbHVlID0gJ2FkdmFuY2VkJztcbmNvbnN0IGFkdkxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbmNvbnN0IGFkdkRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0FkdmFuY2VkJyk7XG5hZHZMYWJlbC5hcHBlbmRDaGlsZChhZHZEZXNjcmlwdGlvbik7XG5cbmNvbnN0IGV4cEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5leHBCdG4udHlwZSA9ICdyYWRpbyc7XG5leHBCdG4ubmFtZSA9ICdkaWZmaWN1bHR5JztcbmV4cEJ0bi5jaGVja2VkID0gZmFsc2U7XG5leHBCdG4udmFsdWUgPSAnZXhwZXJ0JztcbmNvbnN0IGV4cExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbmNvbnN0IGV4cERlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0V4cGVydCcpO1xuZXhwTGFiZWwuYXBwZW5kQ2hpbGQoZXhwRGVzY3JpcHRpb24pO1xuXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGJnbkJ0bilcbmRpZmZDb250YWluZXIuYXBwZW5kQ2hpbGQoYmduTGFiZWwpXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGFkdkJ0bilcbmRpZmZDb250YWluZXIuYXBwZW5kQ2hpbGQoYWR2TGFiZWwpXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGV4cEJ0bilcbmRpZmZDb250YWluZXIuYXBwZW5kQ2hpbGQoZXhwTGFiZWwpXG5cbi8vIGNyZWF0ZSBwbGF5IGdhbWUgYnRuIHRvIHN0YXJ0IDFzdCBnYW1lXG5jb25zdCBwbGF5QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5wbGF5QnRuLmlubmVyVGV4dCA9ICdQbGF5IEdhbWUnO1xuXG5cbi8vICoqKioqKioqKioqKioqIGNyZWF0ZSBjYXJkIGFuZCBjYXJkIGhvbGRlcnMgKioqKioqKioqKioqKiovL1xuY29uc3QgZmxhc2hlZENhcmRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDUnKTtcbmZsYXNoZWRDYXJkcy5jbGFzc0xpc3QuYWRkKCdmbGFzaGVkQ2FyZCcpXG5jb25zdCBmbGFzaGVkQ2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZmxhc2hlZENhcmRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29udGFpbmVyJywgJ2JnLWxpZ2h0JywgJ2NhcmRDb250YWluZXInKTtcbmZsYXNoZWRDYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKGZsYXNoZWRDYXJkcylcblxuY29uc3QgYWxsQ2FyZHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoNScpO1xuY29uc3QgYWxsQ2FyZHNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmFsbENhcmRzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5lcicsICdiZy1saWdodCcsICdjYXJkQ29udGFpbmVyJyk7XG5hbGxDYXJkc0NvbnRhaW5lci5pbm5lclRleHQgPSBcIlNlbGVjdCB0aGUgY2FyZCBvcmRlclwiXG5cbmNvbnN0IHJlc3VsdEZsYXNoZWRDYXJkcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucmVzdWx0Rmxhc2hlZENhcmRzLmNsYXNzTGlzdC5hZGQoJ3Jlc3VsdENhcmQnKVxuLy8gY3JlYXRlIHN1Ym1pdCBhbnMgYnV0dG9uXG5jb25zdCBzdWJtaXRBbnNCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbnN1Ym1pdEFuc0J0bi5pbm5lclRleHQgPSAnU3VibWl0JztcblxuY29uc3QgcmVzdWx0T3V0Y29tZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG5cbi8vIGNyZWF0ZSBwbGF5IGFnYWluIGJ0blxuY29uc3QgcGxheUFnYWluQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5wbGF5QWdhaW5CdG4uaW5uZXJUZXh0ID0gJ1BsYXkgQWdhaW4nO1xuXG5cblxuLy8gY3JlYXRlIGNhcmQgZnVuY3Rpb25cbmNvbnN0IGNyZWF0ZUNhcmQgPSAoY2FyZEluZm8pID0+IHtcbiAgY29uc3Qgc3VpdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBzdWl0LmNsYXNzTGlzdC5hZGQoJ3N1aXQnKTtcbiAgc3VpdC5pbm5lclRleHQgPSBjYXJkSW5mby5zdWl0U3ltYm9sO1xuXG4gIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbmFtZS5jbGFzc0xpc3QuYWRkKCduYW1lJywgY2FyZEluZm8uY29sb3IpO1xuICBuYW1lLmlubmVyVGV4dCA9IGNhcmRJbmZvLmRpc3BsYXlOYW1lO1xuXG4gIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY2FyZC5jbGFzc0xpc3QuYWRkKCdjYXJkJyk7XG4gXG4gIGNhcmQuYXBwZW5kQ2hpbGQobmFtZSk7XG4gIGNhcmQuYXBwZW5kQ2hpbGQoc3VpdCk7XG5cbiAgcmV0dXJuIGNhcmQ7XG59O1xuXG4vLyBjcmVhdGUgbnVtIG9mIGNhcmRzIHRvIGJlIGZsYXNoZWQgYWNjb3JkaW5nIHRvIGRpZmZpY3VsdHkgbGV2ZWwgXG5jb25zdCBmbGFzaGluZ0NhcmRzID0gKHsgZmxhc2hDYXJkcywgfSwgZ2FtZUxldmVsKSA9PiB7XG4gIGxldCBjYXJkRWxlbWVudDtcbiAgXG4gIC8vIG1hbmlwdWxhdGUgRE9NXG4gIGlmIChnYW1lTGV2ZWwgPT0gJ2JlZ2lubmVyJyl7XG4gICAgbnVtT2ZDYXJkcyA9IDUgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT2ZDYXJkczsgaSArPSAxKXtcbiAgICBkaXNwbGF5ZWRDYXJkcy5wdXNoKGZsYXNoQ2FyZHNbaV0pXG4gICAgY2FyZEVsZW1lbnQgPSBjcmVhdGVDYXJkKGZsYXNoQ2FyZHNbaV0pO1xuICAgIGNhcmRFbGVtZW50LmlkID0gYGNhcmQke2l9YDtcbiAgICBjYXJkRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdiZWdpbm5lcicpXG4gICAgZmxhc2hlZENhcmRzLmFwcGVuZENoaWxkKGNhcmRFbGVtZW50KTtcbiAgICBjb25zb2xlLmxvZygnZmxhc2hDYXJkcyA6Pj4gJywgZmxhc2hDYXJkcyk7XG4gICAgY29uc29sZS5sb2coJ2Rpc3BsYXllZENhcmRzIDo+PiAnLCBkaXNwbGF5ZWRDYXJkcyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZ2FtZUNvbnRhaW5lci5pbm5lclRleHQgPSAnJztcbiAgICB9LCA1MDAwKTtcbn07XG4gICAgXG4gIH0gZWxzZSBpZiAoZ2FtZUxldmVsID09ICdhZHZhbmNlZCcpe1xuICAgIG51bU9mQ2FyZHMgPSA3XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZkNhcmRzOyBpICs9IDEpe1xuICAgIGRpc3BsYXllZENhcmRzLnB1c2goZmxhc2hDYXJkc1tpXSlcbiAgICBjYXJkRWxlbWVudCA9IGNyZWF0ZUNhcmQoZmxhc2hDYXJkc1tpXSk7XG4gICAgY2FyZEVsZW1lbnQuaWQgPSBgY2FyZCR7aX1gO1xuICAgIGNhcmRFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2FkdmFuY2VkJylcbiAgICBmbGFzaGVkQ2FyZHMuYXBwZW5kQ2hpbGQoY2FyZEVsZW1lbnQpO1xuICAgIGNvbnNvbGUubG9nKCdmbGFzaENhcmRzIDo+PiAnLCBmbGFzaENhcmRzKTtcbiAgICBjb25zb2xlLmxvZygnZGlzcGxheWVkQ2FyZHMgOj4+ICcsIGRpc3BsYXllZENhcmRzKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBnYW1lQ29udGFpbmVyLmlubmVyVGV4dCA9ICcnO1xuICAgIH0sIDcwMDApO1xuICB9O1xuICB9IGVsc2Uge1xuICAgIG51bU9mQ2FyZHMgPSAxMFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT2ZDYXJkczsgaSArPSAxKXtcbiAgICBkaXNwbGF5ZWRDYXJkcy5wdXNoKGZsYXNoQ2FyZHNbaV0pXG4gICAgY2FyZEVsZW1lbnQgPSBjcmVhdGVDYXJkKGZsYXNoQ2FyZHNbaV0pO1xuICAgIGNhcmRFbGVtZW50LmlkID0gYGNhcmQke2l9YDtcbiAgICBjYXJkRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdleHBlcnQnKVxuICAgIGZsYXNoZWRDYXJkcy5hcHBlbmRDaGlsZChjYXJkRWxlbWVudCk7XG4gICAgY29uc29sZS5sb2coJ2ZsYXNoQ2FyZHMgOj4+ICcsIGZsYXNoQ2FyZHMpO1xuICAgIGNvbnNvbGUubG9nKCdkaXNwbGF5ZWRDYXJkcyA6Pj4gJywgZGlzcGxheWVkQ2FyZHMpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGdhbWVDb250YWluZXIuaW5uZXJUZXh0ID0gJyc7XG4gICAgfSwgMTAwMDApO1xuICB9O1xuICB9XG4gICAgY29uc29sZS5sb2coJ2ZsYXNoQ2FyZHMgOj4+ICcsIGZsYXNoQ2FyZHMpO1xuICAgIGZsYXNoZWRDYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKGZsYXNoZWRDYXJkcyk7XG4gICAgZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChmbGFzaGVkQ2FyZENvbnRhaW5lcik7XG4gIFxuXG59XG5cbi8vIGRpc3BsYXkgYWxsIGNhcmRzIGluIGFycmF5IGZvciB1c2VyIHRvIHNlbGVjdCBvcmRlclxuY29uc3QgZGlzcGxheUNhcmRzID0gKHsgZmxhc2hDYXJkcyx9KSA9Plxue1xuICBsZXQgY2FyZEVsZW1lbnQ7XG4gICAgLy8gc2h1ZmZsZSB0aGUgbWl4ZWQgZmxhc2ggY2FyZCBhcnJheVxuICBmb3IgKGxldCBpID0gZmxhc2hDYXJkcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgW2ZsYXNoQ2FyZHNbaV0sIGZsYXNoQ2FyZHNbal1dID0gW2ZsYXNoQ2FyZHNbal0sIGZsYXNoQ2FyZHNbaV1dO1xuICAgIH1cbiAgICBcbiAgLy8gYXBwZW5kIGFsbCAxMCBjYXJkcyBmb3Igc2VsZWN0aW9uXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmxhc2hDYXJkcy5sZW5ndGg7IGkgKz0gMSl7XG4gICAgY2FyZEVsZW1lbnQgPSBjcmVhdGVDYXJkKGZsYXNoQ2FyZHNbaV0pO1xuICAgIGNhcmRFbGVtZW50LmlkID0gYGNhcmQke2l9YDtcbiAgICBhbGxDYXJkcy5hcHBlbmRDaGlsZChjYXJkRWxlbWVudCk7XG4gIH1cbiAgYWxsQ2FyZHNDb250YWluZXIuYXBwZW5kQ2hpbGQoYWxsQ2FyZHMpXG4gIGNhcmRTZWxlY3Rpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoYWxsQ2FyZHNDb250YWluZXIpO1xufVxuXG4vLyBldmVudCBsaXN0ZW5lciBmb3IgYWxsIGRpc3BsYXllZCBjYXJkcyBzbGF0ZWQgZm9yIHNlbGVjdGlvblxuY29uc3QgY2FyZFNlbGVjdGlvbiA9ICgpID0+IHtcbmNvbnN0IGNhcmQwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQwJyk7XG5jYXJkMC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhcmRTZWxlY3RlZCk7XG5jb25zdCBjYXJkMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkMScpO1xuY2FyZDEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkMicpO1xuY2FyZDIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkMyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkMycpO1xuY2FyZDMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkNCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkNCcpO1xuY2FyZDQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkNSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkNScpO1xuY2FyZDUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkNiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkNicpO1xuY2FyZDYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkNyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkNycpO1xuY2FyZDcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkOCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkOCcpO1xuY2FyZDguYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG5jb25zdCBjYXJkOSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkOScpO1xuY2FyZDkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpXG59XG5cbi8vIHNlbGVjdGVkIGNhcmRzIHRvIGJlIGFwcGVuZGVkIHRvIHNvbHV0aW9uIGFycmF5IGFuZCBkaXNhcHBlYXJcbmNvbnN0IGNhcmRTZWxlY3RlZCA9IChlKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZS5jdXJyZW50VGFyZ2V0LmlkKS5yZW1vdmUoKVxuICAgIGNvbnN0IGRpc3BsYXlOYW1lID0gZS5jdXJyZW50VGFyZ2V0LmZpcnN0Q2hpbGQuaW5uZXJUZXh0O1xuICAgIGNvbnN0IGNhcmRTdWl0U3ltYm9sID0gZS5jdXJyZW50VGFyZ2V0Lmxhc3RDaGlsZC5pbm5lclRleHQ7XG4gICAgY29uc29sZS5sb2coZS5jdXJyZW50VGFyZ2V0LmZpcnN0Q2hpbGQuaW5uZXJUZXh0KVxuICAgIGNvbnNvbGUubG9nKGUuY3VycmVudFRhcmdldC5sYXN0Q2hpbGQuaW5uZXJUZXh0KVxuICAgIHNlbGVjdGVkQ2FyZHMucHVzaCh7ZGlzcGxheU5hbWUsIHN1aXRTeW1ib2w6IGNhcmRTdWl0U3ltYm9sIH0pXG4gICAgY29uc29sZS5sb2coJ3NlbGVjdGVkQ2FyZHMgOj4+ICcsIHNlbGVjdGVkQ2FyZHMpO1xufVxuXG5jb25zdCBkaXNwbGF5RmluYWxSZXN1bHRzID0gKCkgPT4ge1xuICBsZXQgY2FyZEVsZW1lbnQ7XG4gIFxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkQ2FyZHMubGVuZ3RoOyBpICs9IDEpe1xuICAgIGNhcmRFbGVtZW50ID0gY3JlYXRlQ2FyZChzZWxlY3RlZENhcmRzW2ldKTtcbiAgICBhbGxDYXJkcy5hcHBlbmRDaGlsZChjYXJkRWxlbWVudCk7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwbGF5ZWRDYXJkcy5sZW5ndGg7IGkgKz0gMSl7XG4gICAgY2FyZEVsZW1lbnQgPSBjcmVhdGVDYXJkKGRpc3BsYXllZENhcmRzW2ldKTtcbiAgICByZXN1bHRGbGFzaGVkQ2FyZHMuYXBwZW5kQ2hpbGQoY2FyZEVsZW1lbnQpO1xuICB9XG4gIGZsYXNoZWRDYXJkQ29udGFpbmVyLmlubmVyVGV4dCA9IFwiQWN0dWFsIENhcmQgT3JkZXJcIlxuICBmbGFzaGVkQ2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChyZXN1bHRGbGFzaGVkQ2FyZHMpXG4gIGdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoZmxhc2hlZENhcmRDb250YWluZXIpO1xuICBhbGxDYXJkc0NvbnRhaW5lci5pbm5lclRleHQgPSBcIllvdXIgU2VsZWN0ZWQgT3JkZXJcIlxuICBhbGxDYXJkc0NvbnRhaW5lci5hcHBlbmRDaGlsZChhbGxDYXJkcylcbiAgY2FyZFNlbGVjdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChhbGxDYXJkc0NvbnRhaW5lcik7XG59XG5cbnJlZ2lzdHJhdGlvbkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgY29uc3QgcmVnaXN0ZXJEYXRhID0ge1xuICAgIG5hbWU6IHJlZ1VzZXJOYW1lLnZhbHVlLFxuICAgIHBhc3N3b3JkOiByZWdQYXNzd29yZC52YWx1ZSxcbiAgfTtcbiAgXG4gIGNvbnNvbGUubG9nKHJlZ2lzdGVyRGF0YSk7XG4gIGF4aW9zXG4gICAgLnBvc3QoJy9yZWdpc3RlcicsIHJlZ2lzdGVyRGF0YSlcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdoZWxsbG9vdz4+Pj4+PicsIHJlc3BvbnNlLmRhdGEpO1xuICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuZXJyb3Ipe1xuICAgICAgICB0aHJvdyByZXNwb25zZS5kYXRhLmVycm9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChyZWdpc3RyYXRpb25Db250YWluZXIpO1xuICAgICAgICByZWdpc3RyYXRpb25Db250YWluZXIucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBlcnJvckNvbnRhaW5lci5pbm5lckhUTUwgPSAnPHAgc3R5bGU9XCJjb2xvcjpyZWRcIj5JbnZhbGlkIFJlZ2lzdHJhdGlvbiBEZXRhaWxzPC9wPic7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSlcbiAgICAgY2hlY2tMb2dnZWRJbigpO1xufSk7XG5cbmxvZ2luQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBjb25zdCBsb2dpbkRhdGEgPSB7XG4gICAgbmFtZTogdXNlck5hbWUudmFsdWUsXG4gICAgcGFzc3dvcmQ6IHBhc3N3b3JkLnZhbHVlLFxuICB9O1xuICBjb25zb2xlLmxvZyhsb2dpbkRhdGEpO1xuICBheGlvc1xuICAgIC5wb3N0KCcvbG9naW4nLCBsb2dpbkRhdGEpXG4gICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnaGVsbGxvb3c+Pj4+Pj4nLCByZXNwb25zZS5kYXRhKTtcbiAgICAgIGlmIChyZXNwb25zZS5kYXRhLmVycm9yKVxuICAgICAge1xuICAgICAgICAgdGhyb3cgcmVzcG9uc2UuZGF0YS5lcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHVzZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGFzaGJvYXJkRGl2LmFwcGVuZENoaWxkKHVzZXJEaXYpO1xuXG4gICAgICAgIGF4aW9zXG4gICAgICAgIC5nZXQoJy91c2VyJylcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlVXNlcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlVXNlci5kYXRhKTtcbiAgICAgICAgICB1c2VyRGl2LmlubmVySFRNTCA9IGBVc2VyOiAke3Jlc3BvbnNlVXNlci5kYXRhLnVzZXIubmFtZX0gPGJyPiBXaW5zIFJlY29yZDogWFhgO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiBjb25zb2xlLmxvZyhlcnJvcikpO1xuICAgICAgXG4gICAgICAgIGdhbWVJbmZvQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5lcicsICdmb3JtLXNpZ25pbicsICdiZy1saWdodCcpO1xuICAgICAgICBnYW1lSW5mb0NvbnRhaW5lci5pbm5lckhUTUwgPSAnLUEgc2VyaWVzIG9mIGNhcmRzIHdpbGwgYmUgZmxhc2hlZCBmb3IgMSBzZWMgZWFjaCA8YnI+LUF0IHRoZSBlbmQgb2YgdGhlIGZsYXNoaW5nLCBwbHMgc2VsZWN0IHRoZSBjYXJkcyBpbiB0aGUgb3JkZXIgdGhhdCB0aGV5IHdlcmUgZmxhc2hlZC4gPGJyPiAtVG8gd2luIHRoZSBnYW1lLCB0aGUgZXhhY3Qgb3JkZXIgb2YgdGhlIGNhcmRzIG11c3QgYmUgY29ycmVjdCA8YnI+IEJlZ2lubmVyIC0gNSBjYXJkcyA8YnI+IEFkdmFuY2VkIC0gNyBjYXJkcyA8YnI+IEV4cGVydCAtIDEwIGNhcmRzJztcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpZmZDb250YWluZXIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBsYXlCdG4pO1xuICAgICAgICAvLyBsb2dpbkNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgbG9naW5Db250YWluZXIucmVtb3ZlKClcbiAgICAgICAgcmVnaXN0cmF0aW9uQ29udGFpbmVyLnJlbW92ZSgpXG4gICAgICAgIGVycm9yQ29udGFpbmVyLnJlbW92ZSgpXG4gICAgICBcbiAgICAgIH1cbiAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgZXJyb3JDb250YWluZXIuaW5uZXJIVE1MID0gJzxwIHN0eWxlPVwiY29sb3I6cmVkXCI+SW52YWxpZCBMb2dpbiBEZXRhaWxzPC9wPic7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSlcbiAgICAgY2hlY2tMb2dnZWRJbigpO1xufSk7XG5cbnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocGxheUJ0bik7XG4gIC8vIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZ2FtZUluZm9Db250YWluZXIpO1xuICBnYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGZsYXNoZWRDYXJkQ29udGFpbmVyKTtcbiAgLy8gTWFrZSBhIHJlcXVlc3QgdG8gY3JlYXRlIGEgbmV3IGdhbWVcbiAgYXhpb3NcbiAgIC5wb3N0KCcvZ2FtZXMnKVxuICAgLnRoZW4oIChyZXNwb25zZSkgPT4ge1xuICAgIC8vIHNldCB0aGUgZ2xvYmFsIHZhbHVlIHRvIHRoZSBuZXcgZ2FtZS5cbiAgICAgIGN1cnJlbnRHYW1lID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGNvbnNvbGUubG9nKCdjdXJyZW50R2FtZT4+Pj4+Pj4nLGN1cnJlbnRHYW1lKTtcbiAgICAgIGNvbnN0IGRpZmZpY3VsdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiZGlmZmljdWx0eVwiXTpjaGVja2VkJyk7XG4gICAgICBjb25zdCBnYW1lTGV2ZWwgPSBkaWZmaWN1bHR5LnZhbHVlXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRpZmZDb250YWluZXIpO1xuICAgICAgLy8gZGlzcGxheSBpdCBvdXQgdG8gdGhlIHVzZXJcbiAgICAgIGZsYXNoaW5nQ2FyZHMoY3VycmVudEdhbWUsIGdhbWVMZXZlbCk7XG4gICAgICBpZiAobnVtT2ZDYXJkcyA9PSA1KXtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZGlzcGxheUNhcmRzKGN1cnJlbnRHYW1lKTtcbiAgICAgIGNhcmRTZWxlY3Rpb24oKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3VibWl0QW5zQnRuKTtcbiAgICB9LCA2MDAwKTt9IGVsc2UgaWYgKG51bU9mQ2FyZHMgPT0gNyl7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRpc3BsYXlDYXJkcyhjdXJyZW50R2FtZSk7XG4gICAgICBjYXJkU2VsZWN0aW9uKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN1Ym1pdEFuc0J0bik7XG4gICAgfSwgODAwMCk7fSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZGlzcGxheUNhcmRzKGN1cnJlbnRHYW1lKTtcbiAgICAgIGNhcmRTZWxlY3Rpb24oKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3VibWl0QW5zQnRuKTtcbiAgICB9LCAxMDAwMCk7fVxuICAgICBcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIC8vIGhhbmRsZSBlcnJvclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pO1xufSk7XG5cbnN1Ym1pdEFuc0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgbGV0IGlzV29uID0gZmFsc2VcbiAgbGV0IGNhcmREaWZmZXJlbmNlID0gZGlzcGxheWVkQ2FyZHMubGVuZ3RoIC0gc2VsZWN0ZWRDYXJkcy5sZW5ndGg7XG5cbiAgaWYoZGlzcGxheWVkQ2FyZHMubGVuZ3RoID4gc2VsZWN0ZWRDYXJkcy5sZW5ndGggfHwgc2VsZWN0ZWRDYXJkcy5sZW5ndGggPT09IDApeyBcbiAgICBhbGVydChgTnVtYmVyIG9mIHNlbGVjdGVkIGNhcmRzIGlzIGxlc3NlciB0aGF0IHRob3NlIGRpc3BsYXllZC4gUGxzIHNlbGVjdCAke2NhcmREaWZmZXJlbmNlfSBtb3JlIGNhcmRzIWApXG4gIH0gZWxzZSB7XG4gIGFsbENhcmRzLmlubmVySFRNTCA9IFwiXCJcbiAgZmxhc2hlZENhcmRzLmlubmVySFRNTCA9IFwiXCJcbiAgY2FyZFNlbGVjdGlvbkNvbnRhaW5lci5yZW1vdmVDaGlsZChhbGxDYXJkc0NvbnRhaW5lcik7XG4gIGxldCBjb3VudCA9IDA7XG4gIFxuICAvLyBjaGVjayBmb3Igd2luIGNvbmRpdGlvbnNcbiAgZm9yKGxldCBpID0gMDsgaSA8IGRpc3BsYXllZENhcmRzLmxlbmd0aDsgaSArPSAxKXtcbiAgaWYoZGlzcGxheWVkQ2FyZHNbaV0uZGlzcGxheU5hbWUgPT09IHNlbGVjdGVkQ2FyZHNbaV0uZGlzcGxheU5hbWUgJiYgXG4gICAgICBkaXNwbGF5ZWRDYXJkc1tpXS5zdWl0U3ltYm9sID09PSBzZWxlY3RlZENhcmRzW2ldLnN1aXRTeW1ib2wpe1xuICAgICAgICBjb3VudCArPSAxOyAgICAgICBcbiAgICAgIH1cbiAgfVxuICBpZihjb3VudCA9PT0gZGlzcGxheWVkQ2FyZHMubGVuZ3RoKXtcbiAgICAgIGlzV29uID0gdHJ1ZTtcbiAgICAgIHJlc3VsdE91dGNvbWUuaW5uZXJUZXh0ID0gJ1lvdSB3b24nXG4gICAgICBjb25zb2xlLmxvZygneW91IHdvbicpXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHN1Ym1pdEFuc0J0bik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgaXNXb24gPSBmYWxzZVxuICAgICAgcmVzdWx0T3V0Y29tZS5pbm5lclRleHQgPSAnWW91IGxvc3QnXG4gICAgICBjb25zb2xlLmxvZygneW91IGxvc3QgJyk7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHN1Ym1pdEFuc0J0bik7XG4gICAgICB9XG4gICAgZGlzcGxheUZpbmFsUmVzdWx0cygpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVzdWx0T3V0Y29tZSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBsYXlBZ2FpbkJ0bilcbiAgfVxuICBjb25zdCBnYW1lUmVzdWx0ID0ge1xuICAgIGlkOiBuZXdHYW1lLmlkLFxuICAgIGlzQ29tcGxldGVkOiB0cnVlLFxuICAgIGlzV29uOiBpc1dvblxuICB9O1xuICBheGlvc1xuICAgIC5wdXQoJ2dhbWVPdXRjb21lJywgZ2FtZVJlc3VsdClcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgZ2FtZSBvdXRjb21lOj4+Pj4+JywgcmVzcG9uc2UuZGF0YSlcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBpbiBnYW1lIG91dGNvbWU6Pj4gJywgZXJyb3IpO1xuICAgIH0pXG4gIH0pO1xuXG5wbGF5QWdhaW5CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PntcbiAgZmxhc2hlZENhcmRDb250YWluZXIuaW5uZXJUZXh0ID0gXCJcIlxuICBhbGxDYXJkc0NvbnRhaW5lci5pbm5lclRleHQgPSBcIlNlbGVjdCB0aGUgY2FyZCBvcmRlclwiXG4gIGFsbENhcmRzLmlubmVySFRNTCA9IFwiXCJcbiAgcmVzdWx0Rmxhc2hlZENhcmRzLmlubmVySFRNTCA9IFwiXCJcbiAgY2FyZFNlbGVjdGlvbkNvbnRhaW5lci5yZW1vdmVDaGlsZChhbGxDYXJkc0NvbnRhaW5lcik7XG4gIGdhbWVDb250YWluZXIucmVtb3ZlQ2hpbGQoZmxhc2hlZENhcmRDb250YWluZXIpO1xuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHJlc3VsdE91dGNvbWUpXG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocGxheUFnYWluQnRuKVxuICBjdXJyZW50R2FtZSA9IG51bGw7XG4gIGRpc3BsYXllZENhcmRzID0gW11cbiAgc2VsZWN0ZWRDYXJkcyA9IFtdXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGlmZkNvbnRhaW5lcik7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGxheUJ0bik7XG59KTtcblxuY2hlY2tMb2dnZWRJbigpIiwiLypcbiAqIEVKUyBFbWJlZGRlZCBKYXZhU2NyaXB0IHRlbXBsYXRlc1xuICogQ29weXJpZ2h0IDIxMTIgTWF0dGhldyBFZXJuaXNzZSAobWRlQGZsZWVnaXgub3JnKVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBmaWxlIEVtYmVkZGVkIEphdmFTY3JpcHQgdGVtcGxhdGluZyBlbmdpbmUuIHtAbGluayBodHRwOi8vZWpzLmNvfVxuICogQGF1dGhvciBNYXR0aGV3IEVlcm5pc3NlIDxtZGVAZmxlZWdpeC5vcmc+XG4gKiBAYXV0aG9yIFRpYW5jaGVuZyBcIlRpbW90aHlcIiBHdSA8dGltb3RoeWd1OTlAZ21haWwuY29tPlxuICogQHByb2plY3QgRUpTXG4gKiBAbGljZW5zZSB7QGxpbmsgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMH1cbiAqL1xuXG4vKipcbiAqIEVKUyBpbnRlcm5hbCBmdW5jdGlvbnMuXG4gKlxuICogVGVjaG5pY2FsbHkgdGhpcyBcIm1vZHVsZVwiIGxpZXMgaW4gdGhlIHNhbWUgZmlsZSBhcyB7QGxpbmsgbW9kdWxlOmVqc30sIGZvclxuICogdGhlIHNha2Ugb2Ygb3JnYW5pemF0aW9uIGFsbCB0aGUgcHJpdmF0ZSBmdW5jdGlvbnMgcmUgZ3JvdXBlZCBpbnRvIHRoaXNcbiAqIG1vZHVsZS5cbiAqXG4gKiBAbW9kdWxlIGVqcy1pbnRlcm5hbFxuICogQHByaXZhdGVcbiAqL1xuXG4vKipcbiAqIEVtYmVkZGVkIEphdmFTY3JpcHQgdGVtcGxhdGluZyBlbmdpbmUuXG4gKlxuICogQG1vZHVsZSBlanNcbiAqIEBwdWJsaWNcbiAqL1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBzY29wZU9wdGlvbldhcm5lZCA9IGZhbHNlO1xuLyoqIEB0eXBlIHtzdHJpbmd9ICovXG52YXIgX1ZFUlNJT05fU1RSSU5HID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvbjtcbnZhciBfREVGQVVMVF9PUEVOX0RFTElNSVRFUiA9ICc8JztcbnZhciBfREVGQVVMVF9DTE9TRV9ERUxJTUlURVIgPSAnPic7XG52YXIgX0RFRkFVTFRfREVMSU1JVEVSID0gJyUnO1xudmFyIF9ERUZBVUxUX0xPQ0FMU19OQU1FID0gJ2xvY2Fscyc7XG52YXIgX05BTUUgPSAnZWpzJztcbnZhciBfUkVHRVhfU1RSSU5HID0gJyg8JSV8JSU+fDwlPXw8JS18PCVffDwlI3w8JXwlPnwtJT58XyU+KSc7XG52YXIgX09QVFNfUEFTU0FCTEVfV0lUSF9EQVRBID0gWydkZWxpbWl0ZXInLCAnc2NvcGUnLCAnY29udGV4dCcsICdkZWJ1ZycsICdjb21waWxlRGVidWcnLFxuICAnY2xpZW50JywgJ193aXRoJywgJ3JtV2hpdGVzcGFjZScsICdzdHJpY3QnLCAnZmlsZW5hbWUnLCAnYXN5bmMnXTtcbi8vIFdlIGRvbid0IGFsbG93ICdjYWNoZScgb3B0aW9uIHRvIGJlIHBhc3NlZCBpbiB0aGUgZGF0YSBvYmogZm9yXG4vLyB0aGUgbm9ybWFsIGByZW5kZXJgIGNhbGwsIGJ1dCB0aGlzIGlzIHdoZXJlIEV4cHJlc3MgMiAmIDMgcHV0IGl0XG4vLyBzbyB3ZSBtYWtlIGFuIGV4Y2VwdGlvbiBmb3IgYHJlbmRlckZpbGVgXG52YXIgX09QVFNfUEFTU0FCTEVfV0lUSF9EQVRBX0VYUFJFU1MgPSBfT1BUU19QQVNTQUJMRV9XSVRIX0RBVEEuY29uY2F0KCdjYWNoZScpO1xudmFyIF9CT00gPSAvXlxcdUZFRkYvO1xuXG4vKipcbiAqIEVKUyB0ZW1wbGF0ZSBmdW5jdGlvbiBjYWNoZS4gVGhpcyBjYW4gYmUgYSBMUlUgb2JqZWN0IGZyb20gbHJ1LWNhY2hlIE5QTVxuICogbW9kdWxlLiBCeSBkZWZhdWx0LCBpdCBpcyB7QGxpbmsgbW9kdWxlOnV0aWxzLmNhY2hlfSwgYSBzaW1wbGUgaW4tcHJvY2Vzc1xuICogY2FjaGUgdGhhdCBncm93cyBjb250aW51b3VzbHkuXG4gKlxuICogQHR5cGUge0NhY2hlfVxuICovXG5cbmV4cG9ydHMuY2FjaGUgPSB1dGlscy5jYWNoZTtcblxuLyoqXG4gKiBDdXN0b20gZmlsZSBsb2FkZXIuIFVzZWZ1bCBmb3IgdGVtcGxhdGUgcHJlcHJvY2Vzc2luZyBvciByZXN0cmljdGluZyBhY2Nlc3NcbiAqIHRvIGEgY2VydGFpbiBwYXJ0IG9mIHRoZSBmaWxlc3lzdGVtLlxuICpcbiAqIEB0eXBlIHtmaWxlTG9hZGVyfVxuICovXG5cbmV4cG9ydHMuZmlsZUxvYWRlciA9IGZzLnJlYWRGaWxlU3luYztcblxuLyoqXG4gKiBOYW1lIG9mIHRoZSBvYmplY3QgY29udGFpbmluZyB0aGUgbG9jYWxzLlxuICpcbiAqIFRoaXMgdmFyaWFibGUgaXMgb3ZlcnJpZGRlbiBieSB7QGxpbmsgT3B0aW9uc31gLmxvY2Fsc05hbWVgIGlmIGl0IGlzIG5vdFxuICogYHVuZGVmaW5lZGAuXG4gKlxuICogQHR5cGUge1N0cmluZ31cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmxvY2Fsc05hbWUgPSBfREVGQVVMVF9MT0NBTFNfTkFNRTtcblxuLyoqXG4gKiBQcm9taXNlIGltcGxlbWVudGF0aW9uIC0tIGRlZmF1bHRzIHRvIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24gaWYgYXZhaWxhYmxlXG4gKiBUaGlzIGlzIG1vc3RseSBqdXN0IGZvciB0ZXN0YWJpbGl0eVxuICpcbiAqIEB0eXBlIHtQcm9taXNlQ29uc3RydWN0b3JMaWtlfVxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMucHJvbWlzZUltcGwgPSAobmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpczsnKSkoKS5Qcm9taXNlO1xuXG4vKipcbiAqIEdldCB0aGUgcGF0aCB0byB0aGUgaW5jbHVkZWQgZmlsZSBmcm9tIHRoZSBwYXJlbnQgZmlsZSBwYXRoIGFuZCB0aGVcbiAqIHNwZWNpZmllZCBwYXRoLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSAgbmFtZSAgICAgc3BlY2lmaWVkIHBhdGhcbiAqIEBwYXJhbSB7U3RyaW5nfSAgZmlsZW5hbWUgcGFyZW50IGZpbGUgcGF0aFxuICogQHBhcmFtIHtCb29sZWFufSBbaXNEaXI9ZmFsc2VdIHdoZXRoZXIgdGhlIHBhcmVudCBmaWxlIHBhdGggaXMgYSBkaXJlY3RvcnlcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5yZXNvbHZlSW5jbHVkZSA9IGZ1bmN0aW9uKG5hbWUsIGZpbGVuYW1lLCBpc0Rpcikge1xuICB2YXIgZGlybmFtZSA9IHBhdGguZGlybmFtZTtcbiAgdmFyIGV4dG5hbWUgPSBwYXRoLmV4dG5hbWU7XG4gIHZhciByZXNvbHZlID0gcGF0aC5yZXNvbHZlO1xuICB2YXIgaW5jbHVkZVBhdGggPSByZXNvbHZlKGlzRGlyID8gZmlsZW5hbWUgOiBkaXJuYW1lKGZpbGVuYW1lKSwgbmFtZSk7XG4gIHZhciBleHQgPSBleHRuYW1lKG5hbWUpO1xuICBpZiAoIWV4dCkge1xuICAgIGluY2x1ZGVQYXRoICs9ICcuZWpzJztcbiAgfVxuICByZXR1cm4gaW5jbHVkZVBhdGg7XG59O1xuXG4vKipcbiAqIFRyeSB0byByZXNvbHZlIGZpbGUgcGF0aCBvbiBtdWx0aXBsZSBkaXJlY3Rvcmllc1xuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgIG5hbWUgIHNwZWNpZmllZCBwYXRoXG4gKiBAcGFyYW0gIHtBcnJheTxTdHJpbmc+fSBwYXRocyBsaXN0IG9mIHBvc3NpYmxlIHBhcmVudCBkaXJlY3RvcnkgcGF0aHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZVBhdGhzKG5hbWUsIHBhdGhzKSB7XG4gIHZhciBmaWxlUGF0aDtcbiAgaWYgKHBhdGhzLnNvbWUoZnVuY3Rpb24gKHYpIHtcbiAgICBmaWxlUGF0aCA9IGV4cG9ydHMucmVzb2x2ZUluY2x1ZGUobmFtZSwgdiwgdHJ1ZSk7XG4gICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpO1xuICB9KSkge1xuICAgIHJldHVybiBmaWxlUGF0aDtcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGF0aCB0byB0aGUgaW5jbHVkZWQgZmlsZSBieSBPcHRpb25zXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSAgcGF0aCAgICBzcGVjaWZpZWQgcGF0aFxuICogQHBhcmFtICB7T3B0aW9uc30gb3B0aW9ucyBjb21waWxhdGlvbiBvcHRpb25zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldEluY2x1ZGVQYXRoKHBhdGgsIG9wdGlvbnMpIHtcbiAgdmFyIGluY2x1ZGVQYXRoO1xuICB2YXIgZmlsZVBhdGg7XG4gIHZhciB2aWV3cyA9IG9wdGlvbnMudmlld3M7XG4gIHZhciBtYXRjaCA9IC9eW0EtWmEtel0rOlxcXFx8XlxcLy8uZXhlYyhwYXRoKTtcblxuICAvLyBBYnMgcGF0aFxuICBpZiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoKSB7XG4gICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXlxcLyovLCAnJyk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5yb290KSkge1xuICAgICAgaW5jbHVkZVBhdGggPSByZXNvbHZlUGF0aHMocGF0aCwgb3B0aW9ucy5yb290KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5jbHVkZVBhdGggPSBleHBvcnRzLnJlc29sdmVJbmNsdWRlKHBhdGgsIG9wdGlvbnMucm9vdCB8fCAnLycsIHRydWUpO1xuICAgIH1cbiAgfVxuICAvLyBSZWxhdGl2ZSBwYXRoc1xuICBlbHNlIHtcbiAgICAvLyBMb29rIHJlbGF0aXZlIHRvIGEgcGFzc2VkIGZpbGVuYW1lIGZpcnN0XG4gICAgaWYgKG9wdGlvbnMuZmlsZW5hbWUpIHtcbiAgICAgIGZpbGVQYXRoID0gZXhwb3J0cy5yZXNvbHZlSW5jbHVkZShwYXRoLCBvcHRpb25zLmZpbGVuYW1lKTtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgICBpbmNsdWRlUGF0aCA9IGZpbGVQYXRoO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBUaGVuIGxvb2sgaW4gYW55IHZpZXdzIGRpcmVjdG9yaWVzXG4gICAgaWYgKCFpbmNsdWRlUGF0aCAmJiBBcnJheS5pc0FycmF5KHZpZXdzKSkge1xuICAgICAgaW5jbHVkZVBhdGggPSByZXNvbHZlUGF0aHMocGF0aCwgdmlld3MpO1xuICAgIH1cbiAgICBpZiAoIWluY2x1ZGVQYXRoICYmIHR5cGVvZiBvcHRpb25zLmluY2x1ZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIHRoZSBpbmNsdWRlIGZpbGUgXCInICtcbiAgICAgICAgICBvcHRpb25zLmVzY2FwZUZ1bmN0aW9uKHBhdGgpICsgJ1wiJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBpbmNsdWRlUGF0aDtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHRlbXBsYXRlIGZyb20gYSBzdHJpbmcgb3IgYSBmaWxlLCBlaXRoZXIgY29tcGlsZWQgb24tdGhlLWZseSBvclxuICogcmVhZCBmcm9tIGNhY2hlIChpZiBlbmFibGVkKSwgYW5kIGNhY2hlIHRoZSB0ZW1wbGF0ZSBpZiBuZWVkZWQuXG4gKlxuICogSWYgYHRlbXBsYXRlYCBpcyBub3Qgc2V0LCB0aGUgZmlsZSBzcGVjaWZpZWQgaW4gYG9wdGlvbnMuZmlsZW5hbWVgIHdpbGwgYmVcbiAqIHJlYWQuXG4gKlxuICogSWYgYG9wdGlvbnMuY2FjaGVgIGlzIHRydWUsIHRoaXMgZnVuY3Rpb24gcmVhZHMgdGhlIGZpbGUgZnJvbVxuICogYG9wdGlvbnMuZmlsZW5hbWVgIHNvIGl0IG11c3QgYmUgc2V0IHByaW9yIHRvIGNhbGxpbmcgdGhpcyBmdW5jdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmVqcy1pbnRlcm5hbFxuICogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zICAgY29tcGlsYXRpb24gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IFt0ZW1wbGF0ZV0gdGVtcGxhdGUgc291cmNlXG4gKiBAcmV0dXJuIHsoVGVtcGxhdGVGdW5jdGlvbnxDbGllbnRGdW5jdGlvbil9XG4gKiBEZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGBvcHRpb25zLmNsaWVudGAsIGVpdGhlciB0eXBlIG1pZ2h0IGJlIHJldHVybmVkLlxuICogQHN0YXRpY1xuICovXG5cbmZ1bmN0aW9uIGhhbmRsZUNhY2hlKG9wdGlvbnMsIHRlbXBsYXRlKSB7XG4gIHZhciBmdW5jO1xuICB2YXIgZmlsZW5hbWUgPSBvcHRpb25zLmZpbGVuYW1lO1xuICB2YXIgaGFzVGVtcGxhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMTtcblxuICBpZiAob3B0aW9ucy5jYWNoZSkge1xuICAgIGlmICghZmlsZW5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2FjaGUgb3B0aW9uIHJlcXVpcmVzIGEgZmlsZW5hbWUnKTtcbiAgICB9XG4gICAgZnVuYyA9IGV4cG9ydHMuY2FjaGUuZ2V0KGZpbGVuYW1lKTtcbiAgICBpZiAoZnVuYykge1xuICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgfVxuICAgIGlmICghaGFzVGVtcGxhdGUpIHtcbiAgICAgIHRlbXBsYXRlID0gZmlsZUxvYWRlcihmaWxlbmFtZSkudG9TdHJpbmcoKS5yZXBsYWNlKF9CT00sICcnKTtcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAoIWhhc1RlbXBsYXRlKSB7XG4gICAgLy8gaXN0YW5idWwgaWdub3JlIGlmOiBzaG91bGQgbm90IGhhcHBlbiBhdCBhbGxcbiAgICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludGVybmFsIEVKUyBlcnJvcjogbm8gZmlsZSBuYW1lIG9yIHRlbXBsYXRlICdcbiAgICAgICAgICAgICAgICAgICAgKyAncHJvdmlkZWQnKTtcbiAgICB9XG4gICAgdGVtcGxhdGUgPSBmaWxlTG9hZGVyKGZpbGVuYW1lKS50b1N0cmluZygpLnJlcGxhY2UoX0JPTSwgJycpO1xuICB9XG4gIGZ1bmMgPSBleHBvcnRzLmNvbXBpbGUodGVtcGxhdGUsIG9wdGlvbnMpO1xuICBpZiAob3B0aW9ucy5jYWNoZSkge1xuICAgIGV4cG9ydHMuY2FjaGUuc2V0KGZpbGVuYW1lLCBmdW5jKTtcbiAgfVxuICByZXR1cm4gZnVuYztcbn1cblxuLyoqXG4gKiBUcnkgY2FsbGluZyBoYW5kbGVDYWNoZSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zIGFuZCBkYXRhIGFuZCBjYWxsIHRoZVxuICogY2FsbGJhY2sgd2l0aCB0aGUgcmVzdWx0LiBJZiBhbiBlcnJvciBvY2N1cnMsIGNhbGwgdGhlIGNhbGxiYWNrIHdpdGhcbiAqIHRoZSBlcnJvci4gVXNlZCBieSByZW5kZXJGaWxlKCkuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTplanMtaW50ZXJuYWxcbiAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9ucyAgICBjb21waWxhdGlvbiBvcHRpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAgICAgICAgdGVtcGxhdGUgZGF0YVxuICogQHBhcmFtIHtSZW5kZXJGaWxlQ2FsbGJhY2t9IGNiIGNhbGxiYWNrXG4gKiBAc3RhdGljXG4gKi9cblxuZnVuY3Rpb24gdHJ5SGFuZGxlQ2FjaGUob3B0aW9ucywgZGF0YSwgY2IpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCFjYikge1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cy5wcm9taXNlSW1wbCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gbmV3IGV4cG9ydHMucHJvbWlzZUltcGwoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZUNhY2hlKG9wdGlvbnMpKGRhdGEpO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHByb3ZpZGUgYSBjYWxsYmFjayBmdW5jdGlvbicpO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gaGFuZGxlQ2FjaGUob3B0aW9ucykoZGF0YSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBjYihlcnIpO1xuICAgIH1cblxuICAgIGNiKG51bGwsIHJlc3VsdCk7XG4gIH1cbn1cblxuLyoqXG4gKiBmaWxlTG9hZGVyIGlzIGluZGVwZW5kZW50XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoIGVqcyBmaWxlIHBhdGguXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBjb250ZW50cyBvZiB0aGUgc3BlY2lmaWVkIGZpbGUuXG4gKiBAc3RhdGljXG4gKi9cblxuZnVuY3Rpb24gZmlsZUxvYWRlcihmaWxlUGF0aCl7XG4gIHJldHVybiBleHBvcnRzLmZpbGVMb2FkZXIoZmlsZVBhdGgpO1xufVxuXG4vKipcbiAqIEdldCB0aGUgdGVtcGxhdGUgZnVuY3Rpb24uXG4gKlxuICogSWYgYG9wdGlvbnMuY2FjaGVgIGlzIGB0cnVlYCwgdGhlbiB0aGUgdGVtcGxhdGUgaXMgY2FjaGVkLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6ZWpzLWludGVybmFsXG4gKiBAcGFyYW0ge1N0cmluZ30gIHBhdGggICAgcGF0aCBmb3IgdGhlIHNwZWNpZmllZCBmaWxlXG4gKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xuICogQHJldHVybiB7KFRlbXBsYXRlRnVuY3Rpb258Q2xpZW50RnVuY3Rpb24pfVxuICogRGVwZW5kaW5nIG9uIHRoZSB2YWx1ZSBvZiBgb3B0aW9ucy5jbGllbnRgLCBlaXRoZXIgdHlwZSBtaWdodCBiZSByZXR1cm5lZFxuICogQHN0YXRpY1xuICovXG5cbmZ1bmN0aW9uIGluY2x1ZGVGaWxlKHBhdGgsIG9wdGlvbnMpIHtcbiAgdmFyIG9wdHMgPSB1dGlscy5zaGFsbG93Q29weSh7fSwgb3B0aW9ucyk7XG4gIG9wdHMuZmlsZW5hbWUgPSBnZXRJbmNsdWRlUGF0aChwYXRoLCBvcHRzKTtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmluY2x1ZGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIGluY2x1ZGVyUmVzdWx0ID0gb3B0aW9ucy5pbmNsdWRlcihwYXRoLCBvcHRzLmZpbGVuYW1lKTtcbiAgICBpZiAoaW5jbHVkZXJSZXN1bHQpIHtcbiAgICAgIGlmIChpbmNsdWRlclJlc3VsdC5maWxlbmFtZSkge1xuICAgICAgICBvcHRzLmZpbGVuYW1lID0gaW5jbHVkZXJSZXN1bHQuZmlsZW5hbWU7XG4gICAgICB9XG4gICAgICBpZiAoaW5jbHVkZXJSZXN1bHQudGVtcGxhdGUpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZUNhY2hlKG9wdHMsIGluY2x1ZGVyUmVzdWx0LnRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGhhbmRsZUNhY2hlKG9wdHMpO1xufVxuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZSBgc3RyYCBvZiBlanMsIGBmaWxlbmFtZWAsIGFuZFxuICogYGxpbmVub2AuXG4gKlxuICogQGltcGxlbWVudHMge1JldGhyb3dDYWxsYmFja31cbiAqIEBtZW1iZXJvZiBtb2R1bGU6ZWpzLWludGVybmFsXG4gKiBAcGFyYW0ge0Vycm9yfSAgZXJyICAgICAgRXJyb3Igb2JqZWN0XG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyICAgICAgRUpTIHNvdXJjZVxuICogQHBhcmFtIHtTdHJpbmd9IGZsbm0gICAgIGZpbGUgbmFtZSBvZiB0aGUgRUpTIGZpbGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBsaW5lbm8gICBsaW5lIG51bWJlciBvZiB0aGUgZXJyb3JcbiAqIEBwYXJhbSB7RXNjYXBlQ2FsbGJhY2t9IGVzY1xuICogQHN0YXRpY1xuICovXG5cbmZ1bmN0aW9uIHJldGhyb3coZXJyLCBzdHIsIGZsbm0sIGxpbmVubywgZXNjKSB7XG4gIHZhciBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJyk7XG4gIHZhciBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIDMsIDApO1xuICB2YXIgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyAzKTtcbiAgdmFyIGZpbGVuYW1lID0gZXNjKGZsbm0pO1xuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uIChsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgPj4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdlanMnKSArICc6J1xuICAgICsgbGluZW5vICsgJ1xcbidcbiAgICArIGNvbnRleHQgKyAnXFxuXFxuJ1xuICAgICsgZXJyLm1lc3NhZ2U7XG5cbiAgdGhyb3cgZXJyO1xufVxuXG5mdW5jdGlvbiBzdHJpcFNlbWkoc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC87KFxccyokKS8sICckMScpO1xufVxuXG4vKipcbiAqIENvbXBpbGUgdGhlIGdpdmVuIGBzdHJgIG9mIGVqcyBpbnRvIGEgdGVtcGxhdGUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9ICB0ZW1wbGF0ZSBFSlMgdGVtcGxhdGVcbiAqXG4gKiBAcGFyYW0ge09wdGlvbnN9IFtvcHRzXSBjb21waWxhdGlvbiBvcHRpb25zXG4gKlxuICogQHJldHVybiB7KFRlbXBsYXRlRnVuY3Rpb258Q2xpZW50RnVuY3Rpb24pfVxuICogRGVwZW5kaW5nIG9uIHRoZSB2YWx1ZSBvZiBgb3B0cy5jbGllbnRgLCBlaXRoZXIgdHlwZSBtaWdodCBiZSByZXR1cm5lZC5cbiAqIE5vdGUgdGhhdCB0aGUgcmV0dXJuIHR5cGUgb2YgdGhlIGZ1bmN0aW9uIGFsc28gZGVwZW5kcyBvbiB0aGUgdmFsdWUgb2YgYG9wdHMuYXN5bmNgLlxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuY29tcGlsZSA9IGZ1bmN0aW9uIGNvbXBpbGUodGVtcGxhdGUsIG9wdHMpIHtcbiAgdmFyIHRlbXBsO1xuXG4gIC8vIHYxIGNvbXBhdFxuICAvLyAnc2NvcGUnIGlzICdjb250ZXh0J1xuICAvLyBGSVhNRTogUmVtb3ZlIHRoaXMgaW4gYSBmdXR1cmUgdmVyc2lvblxuICBpZiAob3B0cyAmJiBvcHRzLnNjb3BlKSB7XG4gICAgaWYgKCFzY29wZU9wdGlvbldhcm5lZCl7XG4gICAgICBjb25zb2xlLndhcm4oJ2BzY29wZWAgb3B0aW9uIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBFSlMgMycpO1xuICAgICAgc2NvcGVPcHRpb25XYXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIW9wdHMuY29udGV4dCkge1xuICAgICAgb3B0cy5jb250ZXh0ID0gb3B0cy5zY29wZTtcbiAgICB9XG4gICAgZGVsZXRlIG9wdHMuc2NvcGU7XG4gIH1cbiAgdGVtcGwgPSBuZXcgVGVtcGxhdGUodGVtcGxhdGUsIG9wdHMpO1xuICByZXR1cm4gdGVtcGwuY29tcGlsZSgpO1xufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGB0ZW1wbGF0ZWAgb2YgZWpzLlxuICpcbiAqIElmIHlvdSB3b3VsZCBsaWtlIHRvIGluY2x1ZGUgb3B0aW9ucyBidXQgbm90IGRhdGEsIHlvdSBuZWVkIHRvIGV4cGxpY2l0bHlcbiAqIGNhbGwgdGhpcyBmdW5jdGlvbiB3aXRoIGBkYXRhYCBiZWluZyBhbiBlbXB0eSBvYmplY3Qgb3IgYG51bGxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSAgIHRlbXBsYXRlIEVKUyB0ZW1wbGF0ZVxuICogQHBhcmFtIHtPYmplY3R9ICBbZGF0YT17fV0gdGVtcGxhdGUgZGF0YVxuICogQHBhcmFtIHtPcHRpb25zfSBbb3B0cz17fV0gY29tcGlsYXRpb24gYW5kIHJlbmRlcmluZyBvcHRpb25zXG4gKiBAcmV0dXJuIHsoU3RyaW5nfFByb21pc2U8U3RyaW5nPil9XG4gKiBSZXR1cm4gdmFsdWUgdHlwZSBkZXBlbmRzIG9uIGBvcHRzLmFzeW5jYC5cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnJlbmRlciA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgZCwgbykge1xuICB2YXIgZGF0YSA9IGQgfHwge307XG4gIHZhciBvcHRzID0gbyB8fCB7fTtcblxuICAvLyBObyBvcHRpb25zIG9iamVjdCAtLSBpZiB0aGVyZSBhcmUgb3B0aW9ueSBuYW1lc1xuICAvLyBpbiB0aGUgZGF0YSwgY29weSB0aGVtIHRvIG9wdGlvbnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xuICAgIHV0aWxzLnNoYWxsb3dDb3B5RnJvbUxpc3Qob3B0cywgZGF0YSwgX09QVFNfUEFTU0FCTEVfV0lUSF9EQVRBKTtcbiAgfVxuXG4gIHJldHVybiBoYW5kbGVDYWNoZShvcHRzLCB0ZW1wbGF0ZSkoZGF0YSk7XG59O1xuXG4vKipcbiAqIFJlbmRlciBhbiBFSlMgZmlsZSBhdCB0aGUgZ2l2ZW4gYHBhdGhgIGFuZCBjYWxsYmFjayBgY2IoZXJyLCBzdHIpYC5cbiAqXG4gKiBJZiB5b3Ugd291bGQgbGlrZSB0byBpbmNsdWRlIG9wdGlvbnMgYnV0IG5vdCBkYXRhLCB5b3UgbmVlZCB0byBleHBsaWNpdGx5XG4gKiBjYWxsIHRoaXMgZnVuY3Rpb24gd2l0aCBgZGF0YWAgYmVpbmcgYW4gZW1wdHkgb2JqZWN0IG9yIGBudWxsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgICAgcGF0aCAgICAgcGF0aCB0byB0aGUgRUpTIGZpbGVcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgICAgIFtkYXRhPXt9XSB0ZW1wbGF0ZSBkYXRhXG4gKiBAcGFyYW0ge09wdGlvbnN9ICAgICAgICAgICBbb3B0cz17fV0gY29tcGlsYXRpb24gYW5kIHJlbmRlcmluZyBvcHRpb25zXG4gKiBAcGFyYW0ge1JlbmRlckZpbGVDYWxsYmFja30gY2IgY2FsbGJhY2tcbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnJlbmRlckZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgdmFyIGZpbGVuYW1lID0gYXJncy5zaGlmdCgpO1xuICB2YXIgY2I7XG4gIHZhciBvcHRzID0ge2ZpbGVuYW1lOiBmaWxlbmFtZX07XG4gIHZhciBkYXRhO1xuICB2YXIgdmlld09wdHM7XG5cbiAgLy8gRG8gd2UgaGF2ZSBhIGNhbGxiYWNrP1xuICBpZiAodHlwZW9mIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gYXJncy5wb3AoKTtcbiAgfVxuICAvLyBEbyB3ZSBoYXZlIGRhdGEvb3B0cz9cbiAgaWYgKGFyZ3MubGVuZ3RoKSB7XG4gICAgLy8gU2hvdWxkIGFsd2F5cyBoYXZlIGRhdGEgb2JqXG4gICAgZGF0YSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAvLyBOb3JtYWwgcGFzc2VkIG9wdHMgKGRhdGEgb2JqICsgb3B0cyBvYmopXG4gICAgaWYgKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAvLyBVc2Ugc2hhbGxvd0NvcHkgc28gd2UgZG9uJ3QgcG9sbHV0ZSBwYXNzZWQgaW4gb3B0cyBvYmogd2l0aCBuZXcgdmFsc1xuICAgICAgdXRpbHMuc2hhbGxvd0NvcHkob3B0cywgYXJncy5wb3AoKSk7XG4gICAgfVxuICAgIC8vIFNwZWNpYWwgY2FzaW5nIGZvciBFeHByZXNzIChzZXR0aW5ncyArIG9wdHMtaW4tZGF0YSlcbiAgICBlbHNlIHtcbiAgICAgIC8vIEV4cHJlc3MgMyBhbmQgNFxuICAgICAgaWYgKGRhdGEuc2V0dGluZ3MpIHtcbiAgICAgICAgLy8gUHVsbCBhIGZldyB0aGluZ3MgZnJvbSBrbm93biBsb2NhdGlvbnNcbiAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3Mudmlld3MpIHtcbiAgICAgICAgICBvcHRzLnZpZXdzID0gZGF0YS5zZXR0aW5ncy52aWV3cztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5zZXR0aW5nc1sndmlldyBjYWNoZSddKSB7XG4gICAgICAgICAgb3B0cy5jYWNoZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVW5kb2N1bWVudGVkIGFmdGVyIEV4cHJlc3MgMiwgYnV0IHN0aWxsIHVzYWJsZSwgZXNwLiBmb3JcbiAgICAgICAgLy8gaXRlbXMgdGhhdCBhcmUgdW5zYWZlIHRvIGJlIHBhc3NlZCBhbG9uZyB3aXRoIGRhdGEsIGxpa2UgYHJvb3RgXG4gICAgICAgIHZpZXdPcHRzID0gZGF0YS5zZXR0aW5nc1sndmlldyBvcHRpb25zJ107XG4gICAgICAgIGlmICh2aWV3T3B0cykge1xuICAgICAgICAgIHV0aWxzLnNoYWxsb3dDb3B5KG9wdHMsIHZpZXdPcHRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRXhwcmVzcyAyIGFuZCBsb3dlciwgdmFsdWVzIHNldCBpbiBhcHAubG9jYWxzLCBvciBwZW9wbGUgd2hvIGp1c3RcbiAgICAgIC8vIHdhbnQgdG8gcGFzcyBvcHRpb25zIGluIHRoZWlyIGRhdGEuIE5PVEU6IFRoZXNlIHZhbHVlcyB3aWxsIG92ZXJyaWRlXG4gICAgICAvLyBhbnl0aGluZyBwcmV2aW91c2x5IHNldCBpbiBzZXR0aW5ncyAgb3Igc2V0dGluZ3NbJ3ZpZXcgb3B0aW9ucyddXG4gICAgICB1dGlscy5zaGFsbG93Q29weUZyb21MaXN0KG9wdHMsIGRhdGEsIF9PUFRTX1BBU1NBQkxFX1dJVEhfREFUQV9FWFBSRVNTKTtcbiAgICB9XG4gICAgb3B0cy5maWxlbmFtZSA9IGZpbGVuYW1lO1xuICB9XG4gIGVsc2Uge1xuICAgIGRhdGEgPSB7fTtcbiAgfVxuXG4gIHJldHVybiB0cnlIYW5kbGVDYWNoZShvcHRzLCBkYXRhLCBjYik7XG59O1xuXG4vKipcbiAqIENsZWFyIGludGVybWVkaWF0ZSBKYXZhU2NyaXB0IGNhY2hlLiBDYWxscyB7QGxpbmsgQ2FjaGUjcmVzZXR9LlxuICogQHB1YmxpY1xuICovXG5cbi8qKlxuICogRUpTIHRlbXBsYXRlIGNsYXNzXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydHMuVGVtcGxhdGUgPSBUZW1wbGF0ZTtcblxuZXhwb3J0cy5jbGVhckNhY2hlID0gZnVuY3Rpb24gKCkge1xuICBleHBvcnRzLmNhY2hlLnJlc2V0KCk7XG59O1xuXG5mdW5jdGlvbiBUZW1wbGF0ZSh0ZXh0LCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xuICB2YXIgb3B0aW9ucyA9IHt9O1xuICB0aGlzLnRlbXBsYXRlVGV4dCA9IHRleHQ7XG4gIC8qKiBAdHlwZSB7c3RyaW5nIHwgbnVsbH0gKi9cbiAgdGhpcy5tb2RlID0gbnVsbDtcbiAgdGhpcy50cnVuY2F0ZSA9IGZhbHNlO1xuICB0aGlzLmN1cnJlbnRMaW5lID0gMTtcbiAgdGhpcy5zb3VyY2UgPSAnJztcbiAgb3B0aW9ucy5jbGllbnQgPSBvcHRzLmNsaWVudCB8fCBmYWxzZTtcbiAgb3B0aW9ucy5lc2NhcGVGdW5jdGlvbiA9IG9wdHMuZXNjYXBlIHx8IG9wdHMuZXNjYXBlRnVuY3Rpb24gfHwgdXRpbHMuZXNjYXBlWE1MO1xuICBvcHRpb25zLmNvbXBpbGVEZWJ1ZyA9IG9wdHMuY29tcGlsZURlYnVnICE9PSBmYWxzZTtcbiAgb3B0aW9ucy5kZWJ1ZyA9ICEhb3B0cy5kZWJ1ZztcbiAgb3B0aW9ucy5maWxlbmFtZSA9IG9wdHMuZmlsZW5hbWU7XG4gIG9wdGlvbnMub3BlbkRlbGltaXRlciA9IG9wdHMub3BlbkRlbGltaXRlciB8fCBleHBvcnRzLm9wZW5EZWxpbWl0ZXIgfHwgX0RFRkFVTFRfT1BFTl9ERUxJTUlURVI7XG4gIG9wdGlvbnMuY2xvc2VEZWxpbWl0ZXIgPSBvcHRzLmNsb3NlRGVsaW1pdGVyIHx8IGV4cG9ydHMuY2xvc2VEZWxpbWl0ZXIgfHwgX0RFRkFVTFRfQ0xPU0VfREVMSU1JVEVSO1xuICBvcHRpb25zLmRlbGltaXRlciA9IG9wdHMuZGVsaW1pdGVyIHx8IGV4cG9ydHMuZGVsaW1pdGVyIHx8IF9ERUZBVUxUX0RFTElNSVRFUjtcbiAgb3B0aW9ucy5zdHJpY3QgPSBvcHRzLnN0cmljdCB8fCBmYWxzZTtcbiAgb3B0aW9ucy5jb250ZXh0ID0gb3B0cy5jb250ZXh0O1xuICBvcHRpb25zLmNhY2hlID0gb3B0cy5jYWNoZSB8fCBmYWxzZTtcbiAgb3B0aW9ucy5ybVdoaXRlc3BhY2UgPSBvcHRzLnJtV2hpdGVzcGFjZTtcbiAgb3B0aW9ucy5yb290ID0gb3B0cy5yb290O1xuICBvcHRpb25zLmluY2x1ZGVyID0gb3B0cy5pbmNsdWRlcjtcbiAgb3B0aW9ucy5vdXRwdXRGdW5jdGlvbk5hbWUgPSBvcHRzLm91dHB1dEZ1bmN0aW9uTmFtZTtcbiAgb3B0aW9ucy5sb2NhbHNOYW1lID0gb3B0cy5sb2NhbHNOYW1lIHx8IGV4cG9ydHMubG9jYWxzTmFtZSB8fCBfREVGQVVMVF9MT0NBTFNfTkFNRTtcbiAgb3B0aW9ucy52aWV3cyA9IG9wdHMudmlld3M7XG4gIG9wdGlvbnMuYXN5bmMgPSBvcHRzLmFzeW5jO1xuICBvcHRpb25zLmRlc3RydWN0dXJlZExvY2FscyA9IG9wdHMuZGVzdHJ1Y3R1cmVkTG9jYWxzO1xuICBvcHRpb25zLmxlZ2FjeUluY2x1ZGUgPSB0eXBlb2Ygb3B0cy5sZWdhY3lJbmNsdWRlICE9ICd1bmRlZmluZWQnID8gISFvcHRzLmxlZ2FjeUluY2x1ZGUgOiB0cnVlO1xuXG4gIGlmIChvcHRpb25zLnN0cmljdCkge1xuICAgIG9wdGlvbnMuX3dpdGggPSBmYWxzZTtcbiAgfVxuICBlbHNlIHtcbiAgICBvcHRpb25zLl93aXRoID0gdHlwZW9mIG9wdHMuX3dpdGggIT0gJ3VuZGVmaW5lZCcgPyBvcHRzLl93aXRoIDogdHJ1ZTtcbiAgfVxuXG4gIHRoaXMub3B0cyA9IG9wdGlvbnM7XG5cbiAgdGhpcy5yZWdleCA9IHRoaXMuY3JlYXRlUmVnZXgoKTtcbn1cblxuVGVtcGxhdGUubW9kZXMgPSB7XG4gIEVWQUw6ICdldmFsJyxcbiAgRVNDQVBFRDogJ2VzY2FwZWQnLFxuICBSQVc6ICdyYXcnLFxuICBDT01NRU5UOiAnY29tbWVudCcsXG4gIExJVEVSQUw6ICdsaXRlcmFsJ1xufTtcblxuVGVtcGxhdGUucHJvdG90eXBlID0ge1xuICBjcmVhdGVSZWdleDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdHIgPSBfUkVHRVhfU1RSSU5HO1xuICAgIHZhciBkZWxpbSA9IHV0aWxzLmVzY2FwZVJlZ0V4cENoYXJzKHRoaXMub3B0cy5kZWxpbWl0ZXIpO1xuICAgIHZhciBvcGVuID0gdXRpbHMuZXNjYXBlUmVnRXhwQ2hhcnModGhpcy5vcHRzLm9wZW5EZWxpbWl0ZXIpO1xuICAgIHZhciBjbG9zZSA9IHV0aWxzLmVzY2FwZVJlZ0V4cENoYXJzKHRoaXMub3B0cy5jbG9zZURlbGltaXRlcik7XG4gICAgc3RyID0gc3RyLnJlcGxhY2UoLyUvZywgZGVsaW0pXG4gICAgICAucmVwbGFjZSgvPC9nLCBvcGVuKVxuICAgICAgLnJlcGxhY2UoLz4vZywgY2xvc2UpO1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHN0cik7XG4gIH0sXG5cbiAgY29tcGlsZTogZnVuY3Rpb24gKCkge1xuICAgIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xuICAgIHZhciBzcmM7XG4gICAgLyoqIEB0eXBlIHtDbGllbnRGdW5jdGlvbn0gKi9cbiAgICB2YXIgZm47XG4gICAgdmFyIG9wdHMgPSB0aGlzLm9wdHM7XG4gICAgdmFyIHByZXBlbmRlZCA9ICcnO1xuICAgIHZhciBhcHBlbmRlZCA9ICcnO1xuICAgIC8qKiBAdHlwZSB7RXNjYXBlQ2FsbGJhY2t9ICovXG4gICAgdmFyIGVzY2FwZUZuID0gb3B0cy5lc2NhcGVGdW5jdGlvbjtcbiAgICAvKiogQHR5cGUge0Z1bmN0aW9uQ29uc3RydWN0b3J9ICovXG4gICAgdmFyIGN0b3I7XG5cbiAgICBpZiAoIXRoaXMuc291cmNlKSB7XG4gICAgICB0aGlzLmdlbmVyYXRlU291cmNlKCk7XG4gICAgICBwcmVwZW5kZWQgKz1cbiAgICAgICAgJyAgdmFyIF9fb3V0cHV0ID0gXCJcIjtcXG4nICtcbiAgICAgICAgJyAgZnVuY3Rpb24gX19hcHBlbmQocykgeyBpZiAocyAhPT0gdW5kZWZpbmVkICYmIHMgIT09IG51bGwpIF9fb3V0cHV0ICs9IHMgfVxcbic7XG4gICAgICBpZiAob3B0cy5vdXRwdXRGdW5jdGlvbk5hbWUpIHtcbiAgICAgICAgcHJlcGVuZGVkICs9ICcgIHZhciAnICsgb3B0cy5vdXRwdXRGdW5jdGlvbk5hbWUgKyAnID0gX19hcHBlbmQ7JyArICdcXG4nO1xuICAgICAgfVxuICAgICAgaWYgKG9wdHMuZGVzdHJ1Y3R1cmVkTG9jYWxzICYmIG9wdHMuZGVzdHJ1Y3R1cmVkTG9jYWxzLmxlbmd0aCkge1xuICAgICAgICB2YXIgZGVzdHJ1Y3R1cmluZyA9ICcgIHZhciBfX2xvY2FscyA9ICgnICsgb3B0cy5sb2NhbHNOYW1lICsgJyB8fCB7fSksXFxuJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcHRzLmRlc3RydWN0dXJlZExvY2Fscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBuYW1lID0gb3B0cy5kZXN0cnVjdHVyZWRMb2NhbHNbaV07XG4gICAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgICBkZXN0cnVjdHVyaW5nICs9ICcsXFxuICAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZXN0cnVjdHVyaW5nICs9IG5hbWUgKyAnID0gX19sb2NhbHMuJyArIG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJlcGVuZGVkICs9IGRlc3RydWN0dXJpbmcgKyAnO1xcbic7XG4gICAgICB9XG4gICAgICBpZiAob3B0cy5fd2l0aCAhPT0gZmFsc2UpIHtcbiAgICAgICAgcHJlcGVuZGVkICs9ICAnICB3aXRoICgnICsgb3B0cy5sb2NhbHNOYW1lICsgJyB8fCB7fSkgeycgKyAnXFxuJztcbiAgICAgICAgYXBwZW5kZWQgKz0gJyAgfScgKyAnXFxuJztcbiAgICAgIH1cbiAgICAgIGFwcGVuZGVkICs9ICcgIHJldHVybiBfX291dHB1dDsnICsgJ1xcbic7XG4gICAgICB0aGlzLnNvdXJjZSA9IHByZXBlbmRlZCArIHRoaXMuc291cmNlICsgYXBwZW5kZWQ7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuY29tcGlsZURlYnVnKSB7XG4gICAgICBzcmMgPSAndmFyIF9fbGluZSA9IDEnICsgJ1xcbidcbiAgICAgICAgKyAnICAsIF9fbGluZXMgPSAnICsgSlNPTi5zdHJpbmdpZnkodGhpcy50ZW1wbGF0ZVRleHQpICsgJ1xcbidcbiAgICAgICAgKyAnICAsIF9fZmlsZW5hbWUgPSAnICsgKG9wdHMuZmlsZW5hbWUgP1xuICAgICAgICBKU09OLnN0cmluZ2lmeShvcHRzLmZpbGVuYW1lKSA6ICd1bmRlZmluZWQnKSArICc7JyArICdcXG4nXG4gICAgICAgICsgJ3RyeSB7JyArICdcXG4nXG4gICAgICAgICsgdGhpcy5zb3VyY2VcbiAgICAgICAgKyAnfSBjYXRjaCAoZSkgeycgKyAnXFxuJ1xuICAgICAgICArICcgIHJldGhyb3coZSwgX19saW5lcywgX19maWxlbmFtZSwgX19saW5lLCBlc2NhcGVGbik7JyArICdcXG4nXG4gICAgICAgICsgJ30nICsgJ1xcbic7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc3JjID0gdGhpcy5zb3VyY2U7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuY2xpZW50KSB7XG4gICAgICBzcmMgPSAnZXNjYXBlRm4gPSBlc2NhcGVGbiB8fCAnICsgZXNjYXBlRm4udG9TdHJpbmcoKSArICc7JyArICdcXG4nICsgc3JjO1xuICAgICAgaWYgKG9wdHMuY29tcGlsZURlYnVnKSB7XG4gICAgICAgIHNyYyA9ICdyZXRocm93ID0gcmV0aHJvdyB8fCAnICsgcmV0aHJvdy50b1N0cmluZygpICsgJzsnICsgJ1xcbicgKyBzcmM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuc3RyaWN0KSB7XG4gICAgICBzcmMgPSAnXCJ1c2Ugc3RyaWN0XCI7XFxuJyArIHNyYztcbiAgICB9XG4gICAgaWYgKG9wdHMuZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKHNyYyk7XG4gICAgfVxuICAgIGlmIChvcHRzLmNvbXBpbGVEZWJ1ZyAmJiBvcHRzLmZpbGVuYW1lKSB7XG4gICAgICBzcmMgPSBzcmMgKyAnXFxuJ1xuICAgICAgICArICcvLyMgc291cmNlVVJMPScgKyBvcHRzLmZpbGVuYW1lICsgJ1xcbic7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChvcHRzLmFzeW5jKSB7XG4gICAgICAgIC8vIEhhdmUgdG8gdXNlIGdlbmVyYXRlZCBmdW5jdGlvbiBmb3IgdGhpcywgc2luY2UgaW4gZW52cyB3aXRob3V0IHN1cHBvcnQsXG4gICAgICAgIC8vIGl0IGJyZWFrcyBpbiBwYXJzaW5nXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY3RvciA9IChuZXcgRnVuY3Rpb24oJ3JldHVybiAoYXN5bmMgZnVuY3Rpb24oKXt9KS5jb25zdHJ1Y3RvcjsnKSkoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGVudmlyb25tZW50IGRvZXMgbm90IHN1cHBvcnQgYXN5bmMvYXdhaXQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGN0b3IgPSBGdW5jdGlvbjtcbiAgICAgIH1cbiAgICAgIGZuID0gbmV3IGN0b3Iob3B0cy5sb2NhbHNOYW1lICsgJywgZXNjYXBlRm4sIGluY2x1ZGUsIHJldGhyb3cnLCBzcmMpO1xuICAgIH1cbiAgICBjYXRjaChlKSB7XG4gICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgZWxzZVxuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xuICAgICAgICBpZiAob3B0cy5maWxlbmFtZSkge1xuICAgICAgICAgIGUubWVzc2FnZSArPSAnIGluICcgKyBvcHRzLmZpbGVuYW1lO1xuICAgICAgICB9XG4gICAgICAgIGUubWVzc2FnZSArPSAnIHdoaWxlIGNvbXBpbGluZyBlanNcXG5cXG4nO1xuICAgICAgICBlLm1lc3NhZ2UgKz0gJ0lmIHRoZSBhYm92ZSBlcnJvciBpcyBub3QgaGVscGZ1bCwgeW91IG1heSB3YW50IHRvIHRyeSBFSlMtTGludDpcXG4nO1xuICAgICAgICBlLm1lc3NhZ2UgKz0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9SeWFuWmltL0VKUy1MaW50JztcbiAgICAgICAgaWYgKCFvcHRzLmFzeW5jKSB7XG4gICAgICAgICAgZS5tZXNzYWdlICs9ICdcXG4nO1xuICAgICAgICAgIGUubWVzc2FnZSArPSAnT3IsIGlmIHlvdSBtZWFudCB0byBjcmVhdGUgYW4gYXN5bmMgZnVuY3Rpb24sIHBhc3MgYGFzeW5jOiB0cnVlYCBhcyBhbiBvcHRpb24uJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBjYWxsYWJsZSBmdW5jdGlvbiB3aGljaCB3aWxsIGV4ZWN1dGUgdGhlIGZ1bmN0aW9uXG4gICAgLy8gY3JlYXRlZCBieSB0aGUgc291cmNlLWNvZGUsIHdpdGggdGhlIHBhc3NlZCBkYXRhIGFzIGxvY2Fsc1xuICAgIC8vIEFkZHMgYSBsb2NhbCBgaW5jbHVkZWAgZnVuY3Rpb24gd2hpY2ggYWxsb3dzIGZ1bGwgcmVjdXJzaXZlIGluY2x1ZGVcbiAgICB2YXIgcmV0dXJuZWRGbiA9IG9wdHMuY2xpZW50ID8gZm4gOiBmdW5jdGlvbiBhbm9ueW1vdXMoZGF0YSkge1xuICAgICAgdmFyIGluY2x1ZGUgPSBmdW5jdGlvbiAocGF0aCwgaW5jbHVkZURhdGEpIHtcbiAgICAgICAgdmFyIGQgPSB1dGlscy5zaGFsbG93Q29weSh7fSwgZGF0YSk7XG4gICAgICAgIGlmIChpbmNsdWRlRGF0YSkge1xuICAgICAgICAgIGQgPSB1dGlscy5zaGFsbG93Q29weShkLCBpbmNsdWRlRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluY2x1ZGVGaWxlKHBhdGgsIG9wdHMpKGQpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBmbi5hcHBseShvcHRzLmNvbnRleHQsIFtkYXRhIHx8IHt9LCBlc2NhcGVGbiwgaW5jbHVkZSwgcmV0aHJvd10pO1xuICAgIH07XG4gICAgaWYgKG9wdHMuZmlsZW5hbWUgJiYgdHlwZW9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIGZpbGVuYW1lID0gb3B0cy5maWxlbmFtZTtcbiAgICAgIHZhciBiYXNlbmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZW5hbWUsIHBhdGguZXh0bmFtZShmaWxlbmFtZSkpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJldHVybmVkRm4sICduYW1lJywge1xuICAgICAgICAgIHZhbHVlOiBiYXNlbmFtZSxcbiAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkgey8qIGlnbm9yZSAqL31cbiAgICB9XG4gICAgcmV0dXJuIHJldHVybmVkRm47XG4gIH0sXG5cbiAgZ2VuZXJhdGVTb3VyY2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0cyA9IHRoaXMub3B0cztcblxuICAgIGlmIChvcHRzLnJtV2hpdGVzcGFjZSkge1xuICAgICAgLy8gSGF2ZSB0byB1c2UgdHdvIHNlcGFyYXRlIHJlcGxhY2UgaGVyZSBhcyBgXmAgYW5kIGAkYCBvcGVyYXRvcnMgZG9uJ3RcbiAgICAgIC8vIHdvcmsgd2VsbCB3aXRoIGBcXHJgIGFuZCBlbXB0eSBsaW5lcyBkb24ndCB3b3JrIHdlbGwgd2l0aCB0aGUgYG1gIGZsYWcuXG4gICAgICB0aGlzLnRlbXBsYXRlVGV4dCA9XG4gICAgICAgIHRoaXMudGVtcGxhdGVUZXh0LnJlcGxhY2UoL1tcXHJcXG5dKy9nLCAnXFxuJykucmVwbGFjZSgvXlxccyt8XFxzKyQvZ20sICcnKTtcbiAgICB9XG5cbiAgICAvLyBTbHVycCBzcGFjZXMgYW5kIHRhYnMgYmVmb3JlIDwlXyBhbmQgYWZ0ZXIgXyU+XG4gICAgdGhpcy50ZW1wbGF0ZVRleHQgPVxuICAgICAgdGhpcy50ZW1wbGF0ZVRleHQucmVwbGFjZSgvWyBcXHRdKjwlXy9nbSwgJzwlXycpLnJlcGxhY2UoL18lPlsgXFx0XSovZ20sICdfJT4nKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbWF0Y2hlcyA9IHRoaXMucGFyc2VUZW1wbGF0ZVRleHQoKTtcbiAgICB2YXIgZCA9IHRoaXMub3B0cy5kZWxpbWl0ZXI7XG4gICAgdmFyIG8gPSB0aGlzLm9wdHMub3BlbkRlbGltaXRlcjtcbiAgICB2YXIgYyA9IHRoaXMub3B0cy5jbG9zZURlbGltaXRlcjtcblxuICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGxpbmUsIGluZGV4KSB7XG4gICAgICAgIHZhciBjbG9zaW5nO1xuICAgICAgICAvLyBJZiB0aGlzIGlzIGFuIG9wZW5pbmcgdGFnLCBjaGVjayBmb3IgY2xvc2luZyB0YWdzXG4gICAgICAgIC8vIEZJWE1FOiBNYXkgZW5kIHVwIHdpdGggc29tZSBmYWxzZSBwb3NpdGl2ZXMgaGVyZVxuICAgICAgICAvLyBCZXR0ZXIgdG8gc3RvcmUgbW9kZXMgYXMgay92IHdpdGggb3BlbkRlbGltaXRlciArIGRlbGltaXRlciBhcyBrZXlcbiAgICAgICAgLy8gVGhlbiB0aGlzIGNhbiBzaW1wbHkgY2hlY2sgYWdhaW5zdCB0aGUgbWFwXG4gICAgICAgIGlmICggbGluZS5pbmRleE9mKG8gKyBkKSA9PT0gMCAgICAgICAgLy8gSWYgaXQgaXMgYSB0YWdcbiAgICAgICAgICAmJiBsaW5lLmluZGV4T2YobyArIGQgKyBkKSAhPT0gMCkgeyAvLyBhbmQgaXMgbm90IGVzY2FwZWRcbiAgICAgICAgICBjbG9zaW5nID0gbWF0Y2hlc1tpbmRleCArIDJdO1xuICAgICAgICAgIGlmICghKGNsb3NpbmcgPT0gZCArIGMgfHwgY2xvc2luZyA9PSAnLScgKyBkICsgYyB8fCBjbG9zaW5nID09ICdfJyArIGQgKyBjKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCBtYXRjaGluZyBjbG9zZSB0YWcgZm9yIFwiJyArIGxpbmUgKyAnXCIuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNlbGYuc2NhbkxpbmUobGluZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfSxcblxuICBwYXJzZVRlbXBsYXRlVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdHIgPSB0aGlzLnRlbXBsYXRlVGV4dDtcbiAgICB2YXIgcGF0ID0gdGhpcy5yZWdleDtcbiAgICB2YXIgcmVzdWx0ID0gcGF0LmV4ZWMoc3RyKTtcbiAgICB2YXIgYXJyID0gW107XG4gICAgdmFyIGZpcnN0UG9zO1xuXG4gICAgd2hpbGUgKHJlc3VsdCkge1xuICAgICAgZmlyc3RQb3MgPSByZXN1bHQuaW5kZXg7XG5cbiAgICAgIGlmIChmaXJzdFBvcyAhPT0gMCkge1xuICAgICAgICBhcnIucHVzaChzdHIuc3Vic3RyaW5nKDAsIGZpcnN0UG9zKSk7XG4gICAgICAgIHN0ciA9IHN0ci5zbGljZShmaXJzdFBvcyk7XG4gICAgICB9XG5cbiAgICAgIGFyci5wdXNoKHJlc3VsdFswXSk7XG4gICAgICBzdHIgPSBzdHIuc2xpY2UocmVzdWx0WzBdLmxlbmd0aCk7XG4gICAgICByZXN1bHQgPSBwYXQuZXhlYyhzdHIpO1xuICAgIH1cblxuICAgIGlmIChzdHIpIHtcbiAgICAgIGFyci5wdXNoKHN0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycjtcbiAgfSxcblxuICBfYWRkT3V0cHV0OiBmdW5jdGlvbiAobGluZSkge1xuICAgIGlmICh0aGlzLnRydW5jYXRlKSB7XG4gICAgICAvLyBPbmx5IHJlcGxhY2Ugc2luZ2xlIGxlYWRpbmcgbGluZWJyZWFrIGluIHRoZSBsaW5lIGFmdGVyXG4gICAgICAvLyAtJT4gdGFnIC0tIHRoaXMgaXMgdGhlIHNpbmdsZSwgdHJhaWxpbmcgbGluZWJyZWFrXG4gICAgICAvLyBhZnRlciB0aGUgdGFnIHRoYXQgdGhlIHRydW5jYXRpb24gbW9kZSByZXBsYWNlc1xuICAgICAgLy8gSGFuZGxlIFdpbiAvIFVuaXggLyBvbGQgTWFjIGxpbmVicmVha3MgLS0gZG8gdGhlIFxcclxcblxuICAgICAgLy8gY29tYm8gZmlyc3QgaW4gdGhlIHJlZ2V4LW9yXG4gICAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9eKD86XFxyXFxufFxccnxcXG4pLywgJycpO1xuICAgICAgdGhpcy50cnVuY2F0ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWxpbmUpIHtcbiAgICAgIHJldHVybiBsaW5lO1xuICAgIH1cblxuICAgIC8vIFByZXNlcnZlIGxpdGVyYWwgc2xhc2hlc1xuICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJyk7XG5cbiAgICAvLyBDb252ZXJ0IGxpbmVicmVha3NcbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJyk7XG4gICAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxyL2csICdcXFxccicpO1xuXG4gICAgLy8gRXNjYXBlIGRvdWJsZS1xdW90ZXNcbiAgICAvLyAtIHRoaXMgd2lsbCBiZSB0aGUgZGVsaW1pdGVyIGR1cmluZyBleGVjdXRpb25cbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJyk7XG4gICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKFwiJyArIGxpbmUgKyAnXCIpJyArICdcXG4nO1xuICB9LFxuXG4gIHNjYW5MaW5lOiBmdW5jdGlvbiAobGluZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZCA9IHRoaXMub3B0cy5kZWxpbWl0ZXI7XG4gICAgdmFyIG8gPSB0aGlzLm9wdHMub3BlbkRlbGltaXRlcjtcbiAgICB2YXIgYyA9IHRoaXMub3B0cy5jbG9zZURlbGltaXRlcjtcbiAgICB2YXIgbmV3TGluZUNvdW50ID0gMDtcblxuICAgIG5ld0xpbmVDb3VudCA9IChsaW5lLnNwbGl0KCdcXG4nKS5sZW5ndGggLSAxKTtcblxuICAgIHN3aXRjaCAobGluZSkge1xuICAgIGNhc2UgbyArIGQ6XG4gICAgY2FzZSBvICsgZCArICdfJzpcbiAgICAgIHRoaXMubW9kZSA9IFRlbXBsYXRlLm1vZGVzLkVWQUw7XG4gICAgICBicmVhaztcbiAgICBjYXNlIG8gKyBkICsgJz0nOlxuICAgICAgdGhpcy5tb2RlID0gVGVtcGxhdGUubW9kZXMuRVNDQVBFRDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbyArIGQgKyAnLSc6XG4gICAgICB0aGlzLm1vZGUgPSBUZW1wbGF0ZS5tb2Rlcy5SQVc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIG8gKyBkICsgJyMnOlxuICAgICAgdGhpcy5tb2RlID0gVGVtcGxhdGUubW9kZXMuQ09NTUVOVDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbyArIGQgKyBkOlxuICAgICAgdGhpcy5tb2RlID0gVGVtcGxhdGUubW9kZXMuTElURVJBTDtcbiAgICAgIHRoaXMuc291cmNlICs9ICcgICAgOyBfX2FwcGVuZChcIicgKyBsaW5lLnJlcGxhY2UobyArIGQgKyBkLCBvICsgZCkgKyAnXCIpJyArICdcXG4nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBkICsgZCArIGM6XG4gICAgICB0aGlzLm1vZGUgPSBUZW1wbGF0ZS5tb2Rlcy5MSVRFUkFMO1xuICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKFwiJyArIGxpbmUucmVwbGFjZShkICsgZCArIGMsIGQgKyBjKSArICdcIiknICsgJ1xcbic7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGQgKyBjOlxuICAgIGNhc2UgJy0nICsgZCArIGM6XG4gICAgY2FzZSAnXycgKyBkICsgYzpcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gVGVtcGxhdGUubW9kZXMuTElURVJBTCkge1xuICAgICAgICB0aGlzLl9hZGRPdXRwdXQobGluZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW9kZSA9IG51bGw7XG4gICAgICB0aGlzLnRydW5jYXRlID0gbGluZS5pbmRleE9mKCctJykgPT09IDAgfHwgbGluZS5pbmRleE9mKCdfJykgPT09IDA7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gSW4gc2NyaXB0IG1vZGUsIGRlcGVuZHMgb24gdHlwZSBvZiB0YWdcbiAgICAgIGlmICh0aGlzLm1vZGUpIHtcbiAgICAgICAgLy8gSWYgJy8vJyBpcyBmb3VuZCB3aXRob3V0IGEgbGluZSBicmVhaywgYWRkIGEgbGluZSBicmVhay5cbiAgICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5FVkFMOlxuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLkVTQ0FQRUQ6XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuUkFXOlxuICAgICAgICAgIGlmIChsaW5lLmxhc3RJbmRleE9mKCcvLycpID4gbGluZS5sYXN0SW5kZXhPZignXFxuJykpIHtcbiAgICAgICAgICAgIGxpbmUgKz0gJ1xcbic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICAgIC8vIEp1c3QgZXhlY3V0aW5nIGNvZGVcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5FVkFMOlxuICAgICAgICAgIHRoaXMuc291cmNlICs9ICcgICAgOyAnICsgbGluZSArICdcXG4nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIC8vIEV4ZWMsIGVzYywgYW5kIG91dHB1dFxuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLkVTQ0FQRUQ6XG4gICAgICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKGVzY2FwZUZuKCcgKyBzdHJpcFNlbWkobGluZSkgKyAnKSknICsgJ1xcbic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgLy8gRXhlYyBhbmQgb3V0cHV0XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuUkFXOlxuICAgICAgICAgIHRoaXMuc291cmNlICs9ICcgICAgOyBfX2FwcGVuZCgnICsgc3RyaXBTZW1pKGxpbmUpICsgJyknICsgJ1xcbic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuQ09NTUVOVDpcbiAgICAgICAgICAvLyBEbyBub3RoaW5nXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgLy8gTGl0ZXJhbCA8JSUgbW9kZSwgYXBwZW5kIGFzIHJhdyBvdXRwdXRcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5MSVRFUkFMOlxuICAgICAgICAgIHRoaXMuX2FkZE91dHB1dChsaW5lKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gSW4gc3RyaW5nIG1vZGUsIGp1c3QgYWRkIHRoZSBvdXRwdXRcbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9hZGRPdXRwdXQobGluZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYub3B0cy5jb21waWxlRGVidWcgJiYgbmV3TGluZUNvdW50KSB7XG4gICAgICB0aGlzLmN1cnJlbnRMaW5lICs9IG5ld0xpbmVDb3VudDtcbiAgICAgIHRoaXMuc291cmNlICs9ICcgICAgOyBfX2xpbmUgPSAnICsgdGhpcy5jdXJyZW50TGluZSArICdcXG4nO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBFc2NhcGUgY2hhcmFjdGVycyByZXNlcnZlZCBpbiBYTUwuXG4gKlxuICogVGhpcyBpcyBzaW1wbHkgYW4gZXhwb3J0IG9mIHtAbGluayBtb2R1bGU6dXRpbHMuZXNjYXBlWE1MfS5cbiAqXG4gKiBJZiBgbWFya3VwYCBpcyBgdW5kZWZpbmVkYCBvciBgbnVsbGAsIHRoZSBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1hcmt1cCBJbnB1dCBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ30gRXNjYXBlZCBzdHJpbmdcbiAqIEBwdWJsaWNcbiAqIEBmdW5jXG4gKiAqL1xuZXhwb3J0cy5lc2NhcGVYTUwgPSB1dGlscy5lc2NhcGVYTUw7XG5cbi8qKlxuICogRXhwcmVzcy5qcyBzdXBwb3J0LlxuICpcbiAqIFRoaXMgaXMgYW4gYWxpYXMgZm9yIHtAbGluayBtb2R1bGU6ZWpzLnJlbmRlckZpbGV9LCBpbiBvcmRlciB0byBzdXBwb3J0XG4gKiBFeHByZXNzLmpzIG91dC1vZi10aGUtYm94LlxuICpcbiAqIEBmdW5jXG4gKi9cblxuZXhwb3J0cy5fX2V4cHJlc3MgPSBleHBvcnRzLnJlbmRlckZpbGU7XG5cbi8qKlxuICogVmVyc2lvbiBvZiBFSlMuXG4gKlxuICogQHJlYWRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuVkVSU0lPTiA9IF9WRVJTSU9OX1NUUklORztcblxuLyoqXG4gKiBOYW1lIGZvciBkZXRlY3Rpb24gb2YgRUpTLlxuICpcbiAqIEByZWFkb25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLm5hbWUgPSBfTkFNRTtcblxuLyogaXN0YW5idWwgaWdub3JlIGlmICovXG5pZiAodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuZWpzID0gZXhwb3J0cztcbn1cbiIsIi8qXG4gKiBFSlMgRW1iZWRkZWQgSmF2YVNjcmlwdCB0ZW1wbGF0ZXNcbiAqIENvcHlyaWdodCAyMTEyIE1hdHRoZXcgRWVybmlzc2UgKG1kZUBmbGVlZ2l4Lm9yZylcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiovXG5cbi8qKlxuICogUHJpdmF0ZSB1dGlsaXR5IGZ1bmN0aW9uc1xuICogQG1vZHVsZSB1dGlsc1xuICogQHByaXZhdGVcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciByZWdFeHBDaGFycyA9IC9bfFxcXFx7fSgpW1xcXV4kKyo/Ll0vZztcblxuLyoqXG4gKiBFc2NhcGUgY2hhcmFjdGVycyByZXNlcnZlZCBpbiByZWd1bGFyIGV4cHJlc3Npb25zLlxuICpcbiAqIElmIGBzdHJpbmdgIGlzIGB1bmRlZmluZWRgIG9yIGBudWxsYCwgdGhlIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIElucHV0IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSBFc2NhcGVkIHN0cmluZ1xuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0cy5lc2NhcGVSZWdFeHBDaGFycyA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmICghc3RyaW5nKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKHJlZ0V4cENoYXJzLCAnXFxcXCQmJyk7XG59O1xuXG52YXIgX0VOQ09ERV9IVE1MX1JVTEVTID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyYjMzQ7JyxcbiAgXCInXCI6ICcmIzM5Oydcbn07XG52YXIgX01BVENIX0hUTUwgPSAvWyY8PidcIl0vZztcblxuZnVuY3Rpb24gZW5jb2RlX2NoYXIoYykge1xuICByZXR1cm4gX0VOQ09ERV9IVE1MX1JVTEVTW2NdIHx8IGM7XG59XG5cbi8qKlxuICogU3RyaW5naWZpZWQgdmVyc2lvbiBvZiBjb25zdGFudHMgdXNlZCBieSB7QGxpbmsgbW9kdWxlOnV0aWxzLmVzY2FwZVhNTH0uXG4gKlxuICogSXQgaXMgdXNlZCBpbiB0aGUgcHJvY2VzcyBvZiBnZW5lcmF0aW5nIHtAbGluayBDbGllbnRGdW5jdGlvbn1zLlxuICpcbiAqIEByZWFkb25seVxuICogQHR5cGUge1N0cmluZ31cbiAqL1xuXG52YXIgZXNjYXBlRnVuY1N0ciA9XG4gICd2YXIgX0VOQ09ERV9IVE1MX1JVTEVTID0ge1xcbidcbisgJyAgICAgIFwiJlwiOiBcIiZhbXA7XCJcXG4nXG4rICcgICAgLCBcIjxcIjogXCImbHQ7XCJcXG4nXG4rICcgICAgLCBcIj5cIjogXCImZ3Q7XCJcXG4nXG4rICcgICAgLCBcXCdcIlxcJzogXCImIzM0O1wiXFxuJ1xuKyAnICAgICwgXCJcXCdcIjogXCImIzM5O1wiXFxuJ1xuKyAnICAgIH1cXG4nXG4rICcgICwgX01BVENIX0hUTUwgPSAvWyY8PlxcJ1wiXS9nO1xcbidcbisgJ2Z1bmN0aW9uIGVuY29kZV9jaGFyKGMpIHtcXG4nXG4rICcgIHJldHVybiBfRU5DT0RFX0hUTUxfUlVMRVNbY10gfHwgYztcXG4nXG4rICd9O1xcbic7XG5cbi8qKlxuICogRXNjYXBlIGNoYXJhY3RlcnMgcmVzZXJ2ZWQgaW4gWE1MLlxuICpcbiAqIElmIGBtYXJrdXBgIGlzIGB1bmRlZmluZWRgIG9yIGBudWxsYCwgdGhlIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZC5cbiAqXG4gKiBAaW1wbGVtZW50cyB7RXNjYXBlQ2FsbGJhY2t9XG4gKiBAcGFyYW0ge1N0cmluZ30gbWFya3VwIElucHV0IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSBFc2NhcGVkIHN0cmluZ1xuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZVhNTCA9IGZ1bmN0aW9uIChtYXJrdXApIHtcbiAgcmV0dXJuIG1hcmt1cCA9PSB1bmRlZmluZWRcbiAgICA/ICcnXG4gICAgOiBTdHJpbmcobWFya3VwKVxuICAgICAgLnJlcGxhY2UoX01BVENIX0hUTUwsIGVuY29kZV9jaGFyKTtcbn07XG5leHBvcnRzLmVzY2FwZVhNTC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRoaXMpICsgJztcXG4nICsgZXNjYXBlRnVuY1N0cjtcbn07XG5cbi8qKlxuICogTmFpdmUgY29weSBvZiBwcm9wZXJ0aWVzIGZyb20gb25lIG9iamVjdCB0byBhbm90aGVyLlxuICogRG9lcyBub3QgcmVjdXJzZSBpbnRvIG5vbi1zY2FsYXIgcHJvcGVydGllc1xuICogRG9lcyBub3QgY2hlY2sgdG8gc2VlIGlmIHRoZSBwcm9wZXJ0eSBoYXMgYSB2YWx1ZSBiZWZvcmUgY29weWluZ1xuICpcbiAqIEBwYXJhbSAge09iamVjdH0gdG8gICBEZXN0aW5hdGlvbiBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gZnJvbSBTb3VyY2Ugb2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgRGVzdGluYXRpb24gb2JqZWN0XG4gKiBAc3RhdGljXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnRzLnNoYWxsb3dDb3B5ID0gZnVuY3Rpb24gKHRvLCBmcm9tKSB7XG4gIGZyb20gPSBmcm9tIHx8IHt9O1xuICBmb3IgKHZhciBwIGluIGZyb20pIHtcbiAgICB0b1twXSA9IGZyb21bcF07XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBOYWl2ZSBjb3B5IG9mIGEgbGlzdCBvZiBrZXkgbmFtZXMsIGZyb20gb25lIG9iamVjdCB0byBhbm90aGVyLlxuICogT25seSBjb3BpZXMgcHJvcGVydHkgaWYgaXQgaXMgYWN0dWFsbHkgZGVmaW5lZFxuICogRG9lcyBub3QgcmVjdXJzZSBpbnRvIG5vbi1zY2FsYXIgcHJvcGVydGllc1xuICpcbiAqIEBwYXJhbSAge09iamVjdH0gdG8gICBEZXN0aW5hdGlvbiBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gZnJvbSBTb3VyY2Ugb2JqZWN0XG4gKiBAcGFyYW0gIHtBcnJheX0gbGlzdCBMaXN0IG9mIHByb3BlcnRpZXMgdG8gY29weVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgIERlc3RpbmF0aW9uIG9iamVjdFxuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0cy5zaGFsbG93Q29weUZyb21MaXN0ID0gZnVuY3Rpb24gKHRvLCBmcm9tLCBsaXN0KSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwID0gbGlzdFtpXTtcbiAgICBpZiAodHlwZW9mIGZyb21bcF0gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRvW3BdID0gZnJvbVtwXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBTaW1wbGUgaW4tcHJvY2VzcyBjYWNoZSBpbXBsZW1lbnRhdGlvbi4gRG9lcyBub3QgaW1wbGVtZW50IGxpbWl0cyBvZiBhbnlcbiAqIHNvcnQuXG4gKlxuICogQGltcGxlbWVudHMge0NhY2hlfVxuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0cy5jYWNoZSA9IHtcbiAgX2RhdGE6IHt9LFxuICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbDtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XTtcbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XTtcbiAgfSxcbiAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9kYXRhID0ge307XG4gIH1cbn07XG5cbi8qKlxuICogVHJhbnNmb3JtcyBoeXBoZW4gY2FzZSB2YXJpYWJsZSBpbnRvIGNhbWVsIGNhc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBIeXBoZW4gY2FzZSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ30gQ2FtZWwgY2FzZSBzdHJpbmdcbiAqIEBzdGF0aWNcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydHMuaHlwaGVuVG9DYW1lbCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8tW2Etel0vZywgZnVuY3Rpb24gKG1hdGNoKSB7IHJldHVybiBtYXRjaFsxXS50b1VwcGVyQ2FzZSgpOyB9KTtcbn07XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IG1vZHVsZVsnZGVmYXVsdCddIDpcblx0XHQoKSA9PiBtb2R1bGU7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9