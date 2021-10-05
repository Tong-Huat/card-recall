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
  }; // axios
  //   .put('/gameOutcome', gameResult)
  //   .then((response) => {
  //     console.log('update game outcome:>>>>>', response.data)
  //   })
  //   .catch((error) => {
  //     console.log('error in game outcome:>> ', error);
  //   })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9lanMvbGliL2Vqcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2Vqcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL3NyYy9zdHlsZXMuc2NzcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6WyJjdXJyZW50R2FtZSIsImRpc3BsYXllZENhcmRzIiwic2VsZWN0ZWRDYXJkcyIsIm51bU9mQ2FyZHMiLCJkYXNoYm9hcmREaXYiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnYW1lQ29udGFpbmVyIiwiY2FyZFNlbGVjdGlvbkNvbnRhaW5lciIsImVycm9yQ29udGFpbmVyIiwiZ2FtZUluZm9Db250YWluZXIiLCJyZWdpc3RyYXRpb25Db250YWluZXIiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwicmVnaXN0cmF0aW9uVGV4dCIsImlubmVyVGV4dCIsInJlZ1VzZXJOYW1lRGl2IiwicmVnVXNlck5hbWUiLCJwbGFjZWhvbGRlciIsInJlZ1Bhc3N3b3JkRGl2IiwicmVnUGFzc3dvcmQiLCJyZWdpc3RyYXRpb25CdG4iLCJhcHBlbmRDaGlsZCIsImxvZ2luQ29udGFpbmVyIiwibG9naW5UZXh0IiwidXNlck5hbWVEaXYiLCJ1c2VyTmFtZSIsInBhc3N3b3JkRGl2IiwicGFzc3dvcmQiLCJsb2dpbkJ0biIsImNoZWNrTG9nZ2VkSW4iLCJheGlvcyIsInRoZW4iLCJyZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJkYXRhIiwiaXNMb2dnZWRJbiIsImJvZHkiLCJkaWZmQ29udGFpbmVyIiwicGxheUJ0biIsImVycm9yIiwiYmduQnRuIiwidHlwZSIsIm5hbWUiLCJjaGVja2VkIiwidmFsdWUiLCJiZ25MYWJlbCIsImJnbkRlc2NyaXB0aW9uIiwiY3JlYXRlVGV4dE5vZGUiLCJhZHZCdG4iLCJhZHZMYWJlbCIsImFkdkRlc2NyaXB0aW9uIiwiZXhwQnRuIiwiZXhwTGFiZWwiLCJleHBEZXNjcmlwdGlvbiIsImZsYXNoZWRDYXJkcyIsImZsYXNoZWRDYXJkQ29udGFpbmVyIiwiYWxsQ2FyZHMiLCJhbGxDYXJkc0NvbnRhaW5lciIsInJlc3VsdEZsYXNoZWRDYXJkcyIsInN1Ym1pdEFuc0J0biIsInJlc3VsdE91dGNvbWUiLCJwbGF5QWdhaW5CdG4iLCJjcmVhdGVDYXJkIiwiY2FyZEluZm8iLCJzdWl0Iiwic3VpdFN5bWJvbCIsImNvbG9yIiwiZGlzcGxheU5hbWUiLCJjYXJkIiwiZmxhc2hpbmdDYXJkcyIsImdhbWVMZXZlbCIsImZsYXNoQ2FyZHMiLCJjYXJkRWxlbWVudCIsImkiLCJwdXNoIiwiaWQiLCJ0b2dnbGUiLCJzZXRUaW1lb3V0IiwiZGlzcGxheUNhcmRzIiwibGVuZ3RoIiwiaiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNhcmRTZWxlY3Rpb24iLCJjYXJkMCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNhcmRTZWxlY3RlZCIsImNhcmQxIiwiY2FyZDIiLCJjYXJkMyIsImNhcmQ0IiwiY2FyZDUiLCJjYXJkNiIsImNhcmQ3IiwiY2FyZDgiLCJjYXJkOSIsImUiLCJjdXJyZW50VGFyZ2V0IiwicmVtb3ZlIiwiZmlyc3RDaGlsZCIsImNhcmRTdWl0U3ltYm9sIiwibGFzdENoaWxkIiwiZGlzcGxheUZpbmFsUmVzdWx0cyIsInJlZ2lzdGVyRGF0YSIsImlubmVySFRNTCIsImxvZ2luRGF0YSIsInVzZXJEaXYiLCJyZXNwb25zZVVzZXIiLCJ1c2VyIiwicmVtb3ZlQ2hpbGQiLCJkaWZmaWN1bHR5IiwiaXNXb24iLCJjYXJkRGlmZmVyZW5jZSIsImFsZXJ0IiwiY291bnQiLCJnYW1lUmVzdWx0IiwibmV3R2FtZSIsImlzQ29tcGxldGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw0RkFBdUMsQzs7Ozs7Ozs7Ozs7QUNBMUI7O0FBRWIs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Q0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixrREFBa0QsK0JBQStCLEVBQUU7QUFDbkY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xMQTs7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsZ0NBQWdDLFlBQVk7V0FDNUM7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6Im1haW4tYTE4MDAyZTI5M2VhZWE5MDFlNDIuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBjb29raWVzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2Nvb2tpZXMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlKCcuLi9jb3JlL2J1aWxkRnVsbFBhdGgnKTtcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzJyk7XG52YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbicpO1xudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcbiAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9XG5cbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCA/IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChjb25maWcuYXV0aC5wYXNzd29yZCkpIDogJyc7XG4gICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuICAgIH1cblxuICAgIHZhciBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblxuICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcbiAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcbiAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGJyb3dzZXIgcmVxdWVzdCBjYW5jZWxsYXRpb24gKGFzIG9wcG9zZWQgdG8gYSBtYW51YWwgY2FuY2VsbGF0aW9uKVxuICAgIHJlcXVlc3Qub25hYm9ydCA9IGZ1bmN0aW9uIGhhbmRsZUFib3J0KCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdSZXF1ZXN0IGFib3J0ZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHZhciB0aW1lb3V0RXJyb3JNZXNzYWdlID0gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJztcbiAgICAgIGlmIChjb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2U7XG4gICAgICB9XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IodGltZW91dEVycm9yTWVzc2FnZSwgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgICB2YXIgeHNyZlZhbHVlID0gKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgaXNVUkxTYW1lT3JpZ2luKGZ1bGxQYXRoKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cbiAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh4c3JmVmFsdWUpIHtcbiAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3REYXRhID09PSAndW5kZWZpbmVkJyAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3RcbiAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcud2l0aENyZWRlbnRpYWxzKSkge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSAhIWNvbmZpZy53aXRoQ3JlZGVudGlhbHM7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIEV4cGVjdGVkIERPTUV4Y2VwdGlvbiB0aHJvd24gYnkgYnJvd3NlcnMgbm90IGNvbXBhdGlibGUgWE1MSHR0cFJlcXVlc3QgTGV2ZWwgMi5cbiAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cbiAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG4gICAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXJlcXVlc3REYXRhKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL2NvcmUvbWVyZ2VDb25maWcnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoYXhpb3MuZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG4vLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5heGlvcy5pc0F4aW9zRXJyb3IgPSByZXF1aXJlKCcuL2hlbHBlcnMvaXNBeGlvc0Vycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cbi8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICovXG5DYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG4gIHZhciBjYW5jZWw7XG4gIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgY2FuY2VsID0gYztcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdG9rZW46IHRva2VuLFxuICAgIGNhbmNlbDogY2FuY2VsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBJbnRlcmNlcHRvck1hbmFnZXIgPSByZXF1aXJlKCcuL0ludGVyY2VwdG9yTWFuYWdlcicpO1xudmFyIGRpc3BhdGNoUmVxdWVzdCA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hSZXF1ZXN0Jyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL21lcmdlQ29uZmlnJyk7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG4gIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcbiAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcbiAgfTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcbiAqL1xuQXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25maWcgPSBhcmd1bWVudHNbMV0gfHwge307XG4gICAgY29uZmlnLnVybCA9IGFyZ3VtZW50c1swXTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gIH1cblxuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuXG4gIC8vIFNldCBjb25maWcubWV0aG9kXG4gIGlmIChjb25maWcubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRzLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSB0aGlzLmRlZmF1bHRzLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZy5tZXRob2QgPSAnZ2V0JztcbiAgfVxuXG4gIC8vIEhvb2sgdXAgaW50ZXJjZXB0b3JzIG1pZGRsZXdhcmVcbiAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdW5kZWZpbmVkXTtcbiAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcblxuICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59O1xuXG5BeGlvcy5wcm90b3R5cGUuZ2V0VXJpID0gZnVuY3Rpb24gZ2V0VXJpKGNvbmZpZykge1xuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICByZXR1cm4gYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLnJlcGxhY2UoL15cXD8vLCAnJyk7XG59O1xuXG4vLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiAoY29uZmlnIHx8IHt9KS5kYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWRcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0Fic29sdXRlVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9pc0Fic29sdXRlVVJMJyk7XG52YXIgY29tYmluZVVSTHMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBiYXNlVVJMIHdpdGggdGhlIHJlcXVlc3RlZFVSTCxcbiAqIG9ubHkgd2hlbiB0aGUgcmVxdWVzdGVkVVJMIGlzIG5vdCBhbHJlYWR5IGFuIGFic29sdXRlIFVSTC5cbiAqIElmIHRoZSByZXF1ZXN0VVJMIGlzIGFic29sdXRlLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHJlcXVlc3RlZFVSTCB1bnRvdWNoZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdGVkVVJMIEFic29sdXRlIG9yIHJlbGF0aXZlIFVSTCB0byBjb21iaW5lXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgZnVsbCBwYXRoXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRGdWxsUGF0aChiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpIHtcbiAgaWYgKGJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwocmVxdWVzdGVkVVJMKSkge1xuICAgIHJldHVybiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpO1xuICB9XG4gIHJldHVybiByZXF1ZXN0ZWRVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9lbmhhbmNlRXJyb3InKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHRyYW5zZm9ybURhdGEgPSByZXF1aXJlKCcuL3RyYW5zZm9ybURhdGEnKTtcbnZhciBpc0NhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9pc0NhbmNlbCcpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgIGNvbmZpZy5kYXRhLFxuICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzXG4gICk7XG5cbiAgdXRpbHMuZm9yRWFjaChcbiAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgIH1cbiAgKTtcblxuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cblxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgZXJyb3IuaXNBeGlvc0Vycm9yID0gdHJ1ZTtcblxuICBlcnJvci50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFN0YW5kYXJkXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAvLyBNaWNyb3NvZnRcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgbnVtYmVyOiB0aGlzLm51bWJlcixcbiAgICAgIC8vIE1vemlsbGFcbiAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLFxuICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxuICAgICAgY29sdW1uTnVtYmVyOiB0aGlzLmNvbHVtbk51bWJlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgLy8gQXhpb3NcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBjb2RlOiB0aGlzLmNvZGVcbiAgICB9O1xuICB9O1xuICByZXR1cm4gZXJyb3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgdmFyIGNvbmZpZyA9IHt9O1xuXG4gIHZhciB2YWx1ZUZyb21Db25maWcyS2V5cyA9IFsndXJsJywgJ21ldGhvZCcsICdkYXRhJ107XG4gIHZhciBtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cyA9IFsnaGVhZGVycycsICdhdXRoJywgJ3Byb3h5JywgJ3BhcmFtcyddO1xuICB2YXIgZGVmYXVsdFRvQ29uZmlnMktleXMgPSBbXG4gICAgJ2Jhc2VVUkwnLCAndHJhbnNmb3JtUmVxdWVzdCcsICd0cmFuc2Zvcm1SZXNwb25zZScsICdwYXJhbXNTZXJpYWxpemVyJyxcbiAgICAndGltZW91dCcsICd0aW1lb3V0TWVzc2FnZScsICd3aXRoQ3JlZGVudGlhbHMnLCAnYWRhcHRlcicsICdyZXNwb25zZVR5cGUnLCAneHNyZkNvb2tpZU5hbWUnLFxuICAgICd4c3JmSGVhZGVyTmFtZScsICdvblVwbG9hZFByb2dyZXNzJywgJ29uRG93bmxvYWRQcm9ncmVzcycsICdkZWNvbXByZXNzJyxcbiAgICAnbWF4Q29udGVudExlbmd0aCcsICdtYXhCb2R5TGVuZ3RoJywgJ21heFJlZGlyZWN0cycsICd0cmFuc3BvcnQnLCAnaHR0cEFnZW50JyxcbiAgICAnaHR0cHNBZ2VudCcsICdjYW5jZWxUb2tlbicsICdzb2NrZXRQYXRoJywgJ3Jlc3BvbnNlRW5jb2RpbmcnXG4gIF07XG4gIHZhciBkaXJlY3RNZXJnZUtleXMgPSBbJ3ZhbGlkYXRlU3RhdHVzJ107XG5cbiAgZnVuY3Rpb24gZ2V0TWVyZ2VkVmFsdWUodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdCh0YXJnZXQpICYmIHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHRhcmdldCwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHt9LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gc291cmNlLnNsaWNlKCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZURlZXBQcm9wZXJ0aWVzKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICB1dGlscy5mb3JFYWNoKHZhbHVlRnJvbUNvbmZpZzJLZXlzLCBmdW5jdGlvbiB2YWx1ZUZyb21Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cywgbWVyZ2VEZWVwUHJvcGVydGllcyk7XG5cbiAgdXRpbHMuZm9yRWFjaChkZWZhdWx0VG9Db25maWcyS2V5cywgZnVuY3Rpb24gZGVmYXVsdFRvQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHV0aWxzLmZvckVhY2goZGlyZWN0TWVyZ2VLZXlzLCBmdW5jdGlvbiBtZXJnZShwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmIChwcm9wIGluIGNvbmZpZzEpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB2YXIgYXhpb3NLZXlzID0gdmFsdWVGcm9tQ29uZmlnMktleXNcbiAgICAuY29uY2F0KG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzKVxuICAgIC5jb25jYXQoZGVmYXVsdFRvQ29uZmlnMktleXMpXG4gICAgLmNvbmNhdChkaXJlY3RNZXJnZUtleXMpO1xuXG4gIHZhciBvdGhlcktleXMgPSBPYmplY3RcbiAgICAua2V5cyhjb25maWcxKVxuICAgIC5jb25jYXQoT2JqZWN0LmtleXMoY29uZmlnMikpXG4gICAgLmZpbHRlcihmdW5jdGlvbiBmaWx0ZXJBeGlvc0tleXMoa2V5KSB7XG4gICAgICByZXR1cm4gYXhpb3NLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTE7XG4gICAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChvdGhlcktleXMsIG1lcmdlRGVlcFByb3BlcnRpZXMpO1xuXG4gIHJldHVybiBjb25maWc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuKGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUnKTtcblxudmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbmZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSkge1xuICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG4gIHZhciBhZGFwdGVyO1xuICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy94aHInKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG52YXIgZGVmYXVsdHMgPSB7XG4gIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0FjY2VwdCcpO1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7IC8qIElnbm9yZSAqLyB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcbiAgbWF4Qm9keUxlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfVxufTtcblxuZGVmYXVsdHMuaGVhZGVycyA9IHtcbiAgY29tbW9uOiB7XG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG4gIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFydHMgPSBbXTtcblxuICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGtleSA9IGtleSArICdbXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICAgIH1cblxuICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG4gICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgdmFyIGhhc2htYXJrSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cblxuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICAgIHZhciBjb29raWUgPSBbXTtcbiAgICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zXG4gKlxuICogQHBhcmFtIHsqfSBwYXlsb2FkIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3MsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXhpb3NFcnJvcihwYXlsb2FkKSB7XG4gIHJldHVybiAodHlwZW9mIHBheWxvYWQgPT09ICdvYmplY3QnKSAmJiAocGF5bG9hZC5pc0F4aW9zRXJyb3IgPT09IHRydWUpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG4gIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG4gICAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXG4gICAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuICAgICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG4gICAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcbiAgICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgICAgLyoqXG4gICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAgICovXG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgfVxuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLy8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbnZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcbiAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcbiAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG4gICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5dO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gIHZhciBwYXJzZWQgPSB7fTtcbiAgdmFyIGtleTtcbiAgdmFyIHZhbDtcbiAgdmFyIGk7XG5cbiAgaWYgKCFoZWFkZXJzKSB7IHJldHVybiBwYXJzZWQ7IH1cblxuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwYXJzZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG5cbi8qZ2xvYmFsIHRvU3RyaW5nOnRydWUqL1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG4gIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAodmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XG4gIGlmICh0b1N0cmluZy5jYWxsKHZhbCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gcHJvdG90eXBlID09PSBudWxsIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqIG5hdGl2ZXNjcmlwdFxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdOYXRpdmVTY3JpcHQnIG9yICdOUydcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiAobmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05hdGl2ZVNjcmlwdCcgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05TJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG4gKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cbiAqXG4gKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChyZXN1bHRba2V5XSkgJiYgaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHt9LCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbC5zbGljZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbi8qKlxuICogUmVtb3ZlIGJ5dGUgb3JkZXIgbWFya2VyLiBUaGlzIGNhdGNoZXMgRUYgQkIgQkYgKHRoZSBVVEYtOCBCT00pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnQgd2l0aCBCT01cbiAqIEByZXR1cm4ge3N0cmluZ30gY29udGVudCB2YWx1ZSB3aXRob3V0IEJPTVxuICovXG5mdW5jdGlvbiBzdHJpcEJPTShjb250ZW50KSB7XG4gIGlmIChjb250ZW50LmNoYXJDb2RlQXQoMCkgPT09IDB4RkVGRikge1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnNsaWNlKDEpO1xuICB9XG4gIHJldHVybiBjb250ZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzUGxhaW5PYmplY3Q6IGlzUGxhaW5PYmplY3QsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlOiBpc0RhdGUsXG4gIGlzRmlsZTogaXNGaWxlLFxuICBpc0Jsb2I6IGlzQmxvYixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNTdHJlYW06IGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgZm9yRWFjaDogZm9yRWFjaCxcbiAgbWVyZ2U6IG1lcmdlLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHJpbTogdHJpbSxcbiAgc3RyaXBCT006IHN0cmlwQk9NXG59O1xuIiwiaW1wb3J0ICcuL3N0eWxlcy5zY3NzJztcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgeyByZXNvbHZlSW5jbHVkZSB9IGZyb20gJ2Vqcyc7XG4vLyBnbG9iYWwgdmFsdWUgdGhhdCBob2xkcyBpbmZvIGFib3V0IHRoZSBjdXJyZW50IGhhbmQuXG5sZXQgY3VycmVudEdhbWUgPSBudWxsO1xubGV0IGRpc3BsYXllZENhcmRzID0gW11cbmxldCBzZWxlY3RlZENhcmRzID0gW11cbmxldCBudW1PZkNhcmRzO1xuLy8gcXVlcnkgZm9yIGdhbWUsY2FyZCwgZXJyb3IgYW5kIGluc3RydXRpb25zIGNvbnRhaW5lclxuY29uc3QgZGFzaGJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Rhc2hib2FyZCcpO1xuY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lLWNvbnRhaW5lcicpO1xuY29uc3QgY2FyZFNlbGVjdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWxlY3QtY29udGFpbmVyJyk7XG5jb25zdCBlcnJvckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlcnJvci1jb250YWluZXInKTtcbmNvbnN0IGdhbWVJbmZvQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2luZm8tY29udGFpbmVyJyk7XG4vLyBjcmVhdGUgcmVnaXN0cmF0aW9ucyBvbiBsYW5kaW5nIHBhZ2VcbmNvbnN0IHJlZ2lzdHJhdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucmVnaXN0cmF0aW9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5lcicsICdmb3JtLXNpZ25pbicsICdiZy1saWdodCcpO1xuXG4vLyBjcmVhdGUgcmVnaXN0cmF0aW9uIGVsZW1lbnRzOiB1c2VyIG5hbWUgYW5kIHB3XG5jb25zdCByZWdpc3RyYXRpb25UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbnJlZ2lzdHJhdGlvblRleHQuaW5uZXJUZXh0ID0gJ1JlZ2lzdHJhdGlvbiBGb3JtJztcblxuY29uc3QgcmVnVXNlck5hbWVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnJlZ1VzZXJOYW1lRGl2LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tZmxvYXRpbmcnKTtcbmNvbnN0IHJlZ1VzZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbnJlZ1VzZXJOYW1lLnBsYWNlaG9sZGVyID0gJ0lucHV0IFVzZXJuYW1lJztcblxuY29uc3QgcmVnUGFzc3dvcmREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnJlZ1Bhc3N3b3JkRGl2LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tZmxvYXRpbmcnKTtcbmNvbnN0IHJlZ1Bhc3N3b3JkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbnJlZ1Bhc3N3b3JkLnBsYWNlaG9sZGVyID0gJ0lucHV0IFBhc3N3b3JkJztcblxuY29uc3QgcmVnaXN0cmF0aW9uQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5yZWdpc3RyYXRpb25CdG4uaW5uZXJUZXh0ID0gJ1JlZ2lzdGVyJztcblxucmVnVXNlck5hbWVEaXYuYXBwZW5kQ2hpbGQocmVnVXNlck5hbWUpO1xucmVnUGFzc3dvcmREaXYuYXBwZW5kQ2hpbGQocmVnUGFzc3dvcmQpO1xucmVnaXN0cmF0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHJlZ2lzdHJhdGlvblRleHQpO1xucmVnaXN0cmF0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHJlZ1VzZXJOYW1lRGl2KTtcbnJlZ2lzdHJhdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChyZWdQYXNzd29yZERpdik7XG5yZWdpc3RyYXRpb25Db250YWluZXIuYXBwZW5kQ2hpbGQocmVnaXN0cmF0aW9uQnRuKTtcblxuLy8gKioqKioqKioqKioqKiogY3JlYXRlIGxvZ2luIG9uIGxhbmRpbmcgcGFnZSAqKioqKioqKioqKioqKi8vXG5jb25zdCBsb2dpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xubG9naW5Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29udGFpbmVyJywgJ2Zvcm0tc2lnbmluJywgJ2JnLWxpZ2h0Jyk7XG5cbi8vIGNyZWF0ZSBsb2dpbiBlbGVtZW50czogVXNlck5hbWUgYW5kIHB3XG5jb25zdCBsb2dpblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xubG9naW5UZXh0LmlubmVyVGV4dCA9ICdMb2dpbiBGb3JtJztcblxuY29uc3QgdXNlck5hbWVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnVzZXJOYW1lRGl2LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tZmxvYXRpbmcnKTtcbmNvbnN0IHVzZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbnVzZXJOYW1lLnBsYWNlaG9sZGVyID0gJ0lucHV0IFVzZXIgTmFtZSc7XG5cbmNvbnN0IHBhc3N3b3JkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5wYXNzd29yZERpdi5jbGFzc0xpc3QuYWRkKCdmb3JtLWZsb2F0aW5nJyk7XG5jb25zdCBwYXNzd29yZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5wYXNzd29yZC5wbGFjZWhvbGRlciA9ICdJbnB1dCBQYXNzd29yZCc7XG5cbmNvbnN0IGxvZ2luQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5sb2dpbkJ0bi5pbm5lclRleHQgPSAnTG9naW4nO1xuXG51c2VyTmFtZURpdi5hcHBlbmRDaGlsZCh1c2VyTmFtZSk7XG5wYXNzd29yZERpdi5hcHBlbmRDaGlsZChwYXNzd29yZCk7XG5sb2dpbkNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2dpblRleHQpO1xubG9naW5Db250YWluZXIuYXBwZW5kQ2hpbGQodXNlck5hbWVEaXYpO1xubG9naW5Db250YWluZXIuYXBwZW5kQ2hpbGQocGFzc3dvcmREaXYpO1xubG9naW5Db250YWluZXIuYXBwZW5kQ2hpbGQobG9naW5CdG4pO1xuXG5jb25zdCBjaGVja0xvZ2dlZEluID0gKCkgPT4ge1xuICBheGlvcy5nZXQoJy9pc2xvZ2dlZGluJylcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIGxvZ2luIDo+PiAnLCByZXNwb25zZSk7XG4gICAgICBpZiAocmVzcG9uc2UuZGF0YS5pc0xvZ2dlZEluID09PSB0cnVlKVxuICAgICAge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpZmZDb250YWluZXIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBsYXlCdG4pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIHJlbmRlciBvdGhlciBidXR0b25zXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVnaXN0cmF0aW9uQ29udGFpbmVyKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsb2dpbkNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiBjb25zb2xlLmxvZygnZXJyb3IgZnJvbSBsb2dnaW5nIGluJywgZXJyb3IpKTtcbn07XG5cbi8vICoqKioqKioqKioqKioqIGNyZWF0ZSBkaWZmaWN1bHR5IHNlbGVjdGlvbiBlbGVtZW50cyAqKioqKioqKioqKioqKi8vXG5jb25zdCBkaWZmQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5kaWZmQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5lcicsICdiZy1saWdodCcsICdjYXJkQ29udGFpbmVyJyk7XG5cbmNvbnN0IGJnbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5iZ25CdG4udHlwZSA9ICdyYWRpbyc7XG5iZ25CdG4ubmFtZSA9ICdkaWZmaWN1bHR5JztcbmJnbkJ0bi5jaGVja2VkID0gZmFsc2U7XG5iZ25CdG4udmFsdWUgPSAnYmVnaW5uZXInO1xuY29uc3QgYmduTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuY29uc3QgYmduRGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQmVnaW5uZXInKTtcbmJnbkxhYmVsLmFwcGVuZENoaWxkKGJnbkRlc2NyaXB0aW9uKTtcblxuY29uc3QgYWR2QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbmFkdkJ0bi50eXBlID0gJ3JhZGlvJztcbmFkdkJ0bi5uYW1lID0gJ2RpZmZpY3VsdHknO1xuYWR2QnRuLmNoZWNrZWQgPSBmYWxzZTtcbmFkdkJ0bi52YWx1ZSA9ICdhZHZhbmNlZCc7XG5jb25zdCBhZHZMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5jb25zdCBhZHZEZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdBZHZhbmNlZCcpO1xuYWR2TGFiZWwuYXBwZW5kQ2hpbGQoYWR2RGVzY3JpcHRpb24pO1xuXG5jb25zdCBleHBCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuZXhwQnRuLnR5cGUgPSAncmFkaW8nO1xuZXhwQnRuLm5hbWUgPSAnZGlmZmljdWx0eSc7XG5leHBCdG4uY2hlY2tlZCA9IGZhbHNlO1xuZXhwQnRuLnZhbHVlID0gJ2V4cGVydCc7XG5jb25zdCBleHBMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5jb25zdCBleHBEZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdFeHBlcnQnKTtcbmV4cExhYmVsLmFwcGVuZENoaWxkKGV4cERlc2NyaXB0aW9uKTtcblxuZGlmZkNvbnRhaW5lci5hcHBlbmRDaGlsZChiZ25CdG4pXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGJnbkxhYmVsKVxuZGlmZkNvbnRhaW5lci5hcHBlbmRDaGlsZChhZHZCdG4pXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGFkdkxhYmVsKVxuZGlmZkNvbnRhaW5lci5hcHBlbmRDaGlsZChleHBCdG4pXG5kaWZmQ29udGFpbmVyLmFwcGVuZENoaWxkKGV4cExhYmVsKVxuXG4vLyBjcmVhdGUgcGxheSBnYW1lIGJ0biB0byBzdGFydCAxc3QgZ2FtZVxuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xucGxheUJ0bi5pbm5lclRleHQgPSAnUGxheSBHYW1lJztcblxuXG4vLyAqKioqKioqKioqKioqKiBjcmVhdGUgY2FyZCBhbmQgY2FyZCBob2xkZXJzICoqKioqKioqKioqKioqLy9cbmNvbnN0IGZsYXNoZWRDYXJkcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g1Jyk7XG5mbGFzaGVkQ2FyZHMuY2xhc3NMaXN0LmFkZCgnZmxhc2hlZENhcmQnKVxuY29uc3QgZmxhc2hlZENhcmRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmZsYXNoZWRDYXJkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvbnRhaW5lcicsICdiZy1saWdodCcsICdjYXJkQ29udGFpbmVyJyk7XG5mbGFzaGVkQ2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChmbGFzaGVkQ2FyZHMpXG5cbmNvbnN0IGFsbENhcmRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDUnKTtcbmNvbnN0IGFsbENhcmRzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5hbGxDYXJkc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjb250YWluZXInLCAnYmctbGlnaHQnLCAnY2FyZENvbnRhaW5lcicpO1xuYWxsQ2FyZHNDb250YWluZXIuaW5uZXJUZXh0ID0gXCJTZWxlY3QgdGhlIGNhcmQgb3JkZXJcIlxuXG5jb25zdCByZXN1bHRGbGFzaGVkQ2FyZHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnJlc3VsdEZsYXNoZWRDYXJkcy5jbGFzc0xpc3QuYWRkKCdyZXN1bHRDYXJkJylcbi8vIGNyZWF0ZSBzdWJtaXQgYW5zIGJ1dHRvblxuY29uc3Qgc3VibWl0QW5zQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5zdWJtaXRBbnNCdG4uaW5uZXJUZXh0ID0gJ1N1Ym1pdCc7XG5cbmNvbnN0IHJlc3VsdE91dGNvbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xuXG4vLyBjcmVhdGUgcGxheSBhZ2FpbiBidG5cbmNvbnN0IHBsYXlBZ2FpbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xucGxheUFnYWluQnRuLmlubmVyVGV4dCA9ICdQbGF5IEFnYWluJztcblxuXG5cbi8vIGNyZWF0ZSBjYXJkIGZ1bmN0aW9uXG5jb25zdCBjcmVhdGVDYXJkID0gKGNhcmRJbmZvKSA9PiB7XG4gIGNvbnN0IHN1aXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgc3VpdC5jbGFzc0xpc3QuYWRkKCdzdWl0Jyk7XG4gIHN1aXQuaW5uZXJUZXh0ID0gY2FyZEluZm8uc3VpdFN5bWJvbDtcblxuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIG5hbWUuY2xhc3NMaXN0LmFkZCgnbmFtZScsIGNhcmRJbmZvLmNvbG9yKTtcbiAgbmFtZS5pbm5lclRleHQgPSBjYXJkSW5mby5kaXNwbGF5TmFtZTtcblxuICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNhcmQuY2xhc3NMaXN0LmFkZCgnY2FyZCcpO1xuIFxuICBjYXJkLmFwcGVuZENoaWxkKG5hbWUpO1xuICBjYXJkLmFwcGVuZENoaWxkKHN1aXQpO1xuXG4gIHJldHVybiBjYXJkO1xufTtcblxuLy8gY3JlYXRlIG51bSBvZiBjYXJkcyB0byBiZSBmbGFzaGVkIGFjY29yZGluZyB0byBkaWZmaWN1bHR5IGxldmVsIFxuY29uc3QgZmxhc2hpbmdDYXJkcyA9ICh7IGZsYXNoQ2FyZHMsIH0sIGdhbWVMZXZlbCkgPT4ge1xuICBsZXQgY2FyZEVsZW1lbnQ7XG4gIFxuICAvLyBtYW5pcHVsYXRlIERPTVxuICBpZiAoZ2FtZUxldmVsID09ICdiZWdpbm5lcicpe1xuICAgIG51bU9mQ2FyZHMgPSA1ICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mQ2FyZHM7IGkgKz0gMSl7XG4gICAgZGlzcGxheWVkQ2FyZHMucHVzaChmbGFzaENhcmRzW2ldKVxuICAgIGNhcmRFbGVtZW50ID0gY3JlYXRlQ2FyZChmbGFzaENhcmRzW2ldKTtcbiAgICBjYXJkRWxlbWVudC5pZCA9IGBjYXJkJHtpfWA7XG4gICAgY2FyZEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnYmVnaW5uZXInKVxuICAgIGZsYXNoZWRDYXJkcy5hcHBlbmRDaGlsZChjYXJkRWxlbWVudCk7XG4gICAgY29uc29sZS5sb2coJ2ZsYXNoQ2FyZHMgOj4+ICcsIGZsYXNoQ2FyZHMpO1xuICAgIGNvbnNvbGUubG9nKCdkaXNwbGF5ZWRDYXJkcyA6Pj4gJywgZGlzcGxheWVkQ2FyZHMpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGdhbWVDb250YWluZXIuaW5uZXJUZXh0ID0gJyc7XG4gICAgfSwgNTAwMCk7XG59O1xuICAgIFxuICB9IGVsc2UgaWYgKGdhbWVMZXZlbCA9PSAnYWR2YW5jZWQnKXtcbiAgICBudW1PZkNhcmRzID0gN1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtT2ZDYXJkczsgaSArPSAxKXtcbiAgICBkaXNwbGF5ZWRDYXJkcy5wdXNoKGZsYXNoQ2FyZHNbaV0pXG4gICAgY2FyZEVsZW1lbnQgPSBjcmVhdGVDYXJkKGZsYXNoQ2FyZHNbaV0pO1xuICAgIGNhcmRFbGVtZW50LmlkID0gYGNhcmQke2l9YDtcbiAgICBjYXJkRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdhZHZhbmNlZCcpXG4gICAgZmxhc2hlZENhcmRzLmFwcGVuZENoaWxkKGNhcmRFbGVtZW50KTtcbiAgICBjb25zb2xlLmxvZygnZmxhc2hDYXJkcyA6Pj4gJywgZmxhc2hDYXJkcyk7XG4gICAgY29uc29sZS5sb2coJ2Rpc3BsYXllZENhcmRzIDo+PiAnLCBkaXNwbGF5ZWRDYXJkcyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZ2FtZUNvbnRhaW5lci5pbm5lclRleHQgPSAnJztcbiAgICB9LCA3MDAwKTtcbiAgfTtcbiAgfSBlbHNlIHtcbiAgICBudW1PZkNhcmRzID0gMTBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU9mQ2FyZHM7IGkgKz0gMSl7XG4gICAgZGlzcGxheWVkQ2FyZHMucHVzaChmbGFzaENhcmRzW2ldKVxuICAgIGNhcmRFbGVtZW50ID0gY3JlYXRlQ2FyZChmbGFzaENhcmRzW2ldKTtcbiAgICBjYXJkRWxlbWVudC5pZCA9IGBjYXJkJHtpfWA7XG4gICAgY2FyZEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnZXhwZXJ0JylcbiAgICBmbGFzaGVkQ2FyZHMuYXBwZW5kQ2hpbGQoY2FyZEVsZW1lbnQpO1xuICAgIGNvbnNvbGUubG9nKCdmbGFzaENhcmRzIDo+PiAnLCBmbGFzaENhcmRzKTtcbiAgICBjb25zb2xlLmxvZygnZGlzcGxheWVkQ2FyZHMgOj4+ICcsIGRpc3BsYXllZENhcmRzKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBnYW1lQ29udGFpbmVyLmlubmVyVGV4dCA9ICcnO1xuICAgIH0sIDEwMDAwKTtcbiAgfTtcbiAgfVxuICAgIGNvbnNvbGUubG9nKCdmbGFzaENhcmRzIDo+PiAnLCBmbGFzaENhcmRzKTtcbiAgICBmbGFzaGVkQ2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChmbGFzaGVkQ2FyZHMpO1xuICAgIGdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoZmxhc2hlZENhcmRDb250YWluZXIpO1xuICBcblxufVxuXG4vLyBkaXNwbGF5IGFsbCBjYXJkcyBpbiBhcnJheSBmb3IgdXNlciB0byBzZWxlY3Qgb3JkZXJcbmNvbnN0IGRpc3BsYXlDYXJkcyA9ICh7IGZsYXNoQ2FyZHMsfSkgPT5cbntcbiAgbGV0IGNhcmRFbGVtZW50O1xuICAgIC8vIHNodWZmbGUgdGhlIG1peGVkIGZsYXNoIGNhcmQgYXJyYXlcbiAgZm9yIChsZXQgaSA9IGZsYXNoQ2FyZHMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgIFtmbGFzaENhcmRzW2ldLCBmbGFzaENhcmRzW2pdXSA9IFtmbGFzaENhcmRzW2pdLCBmbGFzaENhcmRzW2ldXTtcbiAgICB9XG4gICAgXG4gIC8vIGFwcGVuZCBhbGwgMTAgY2FyZHMgZm9yIHNlbGVjdGlvblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZsYXNoQ2FyZHMubGVuZ3RoOyBpICs9IDEpe1xuICAgIGNhcmRFbGVtZW50ID0gY3JlYXRlQ2FyZChmbGFzaENhcmRzW2ldKTtcbiAgICBjYXJkRWxlbWVudC5pZCA9IGBjYXJkJHtpfWA7XG4gICAgYWxsQ2FyZHMuYXBwZW5kQ2hpbGQoY2FyZEVsZW1lbnQpO1xuICB9XG4gIGFsbENhcmRzQ29udGFpbmVyLmFwcGVuZENoaWxkKGFsbENhcmRzKVxuICBjYXJkU2VsZWN0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGFsbENhcmRzQ29udGFpbmVyKTtcbn1cblxuLy8gZXZlbnQgbGlzdGVuZXIgZm9yIGFsbCBkaXNwbGF5ZWQgY2FyZHMgc2xhdGVkIGZvciBzZWxlY3Rpb25cbmNvbnN0IGNhcmRTZWxlY3Rpb24gPSAoKSA9PiB7XG5jb25zdCBjYXJkMCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkMCcpO1xuY2FyZDAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYXJkU2VsZWN0ZWQpO1xuY29uc3QgY2FyZDEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDEnKTtcbmNhcmQxLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDInKTtcbmNhcmQyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDMnKTtcbmNhcmQzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDQnKTtcbmNhcmQ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDUnKTtcbmNhcmQ1LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDYnKTtcbmNhcmQ2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDcnKTtcbmNhcmQ3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDgnKTtcbmNhcmQ4LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxuY29uc3QgY2FyZDkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZDknKTtcbmNhcmQ5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FyZFNlbGVjdGVkKVxufVxuXG4vLyBzZWxlY3RlZCBjYXJkcyB0byBiZSBhcHBlbmRlZCB0byBzb2x1dGlvbiBhcnJheSBhbmQgZGlzYXBwZWFyXG5jb25zdCBjYXJkU2VsZWN0ZWQgPSAoZSkgPT4ge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGUuY3VycmVudFRhcmdldC5pZCkucmVtb3ZlKClcbiAgICBjb25zdCBkaXNwbGF5TmFtZSA9IGUuY3VycmVudFRhcmdldC5maXJzdENoaWxkLmlubmVyVGV4dDtcbiAgICBjb25zdCBjYXJkU3VpdFN5bWJvbCA9IGUuY3VycmVudFRhcmdldC5sYXN0Q2hpbGQuaW5uZXJUZXh0O1xuICAgIGNvbnNvbGUubG9nKGUuY3VycmVudFRhcmdldC5maXJzdENoaWxkLmlubmVyVGV4dClcbiAgICBjb25zb2xlLmxvZyhlLmN1cnJlbnRUYXJnZXQubGFzdENoaWxkLmlubmVyVGV4dClcbiAgICBzZWxlY3RlZENhcmRzLnB1c2goe2Rpc3BsYXlOYW1lLCBzdWl0U3ltYm9sOiBjYXJkU3VpdFN5bWJvbCB9KVxuICAgIGNvbnNvbGUubG9nKCdzZWxlY3RlZENhcmRzIDo+PiAnLCBzZWxlY3RlZENhcmRzKTtcbn1cblxuY29uc3QgZGlzcGxheUZpbmFsUmVzdWx0cyA9ICgpID0+IHtcbiAgbGV0IGNhcmRFbGVtZW50O1xuICBcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZENhcmRzLmxlbmd0aDsgaSArPSAxKXtcbiAgICBjYXJkRWxlbWVudCA9IGNyZWF0ZUNhcmQoc2VsZWN0ZWRDYXJkc1tpXSk7XG4gICAgYWxsQ2FyZHMuYXBwZW5kQ2hpbGQoY2FyZEVsZW1lbnQpO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGlzcGxheWVkQ2FyZHMubGVuZ3RoOyBpICs9IDEpe1xuICAgIGNhcmRFbGVtZW50ID0gY3JlYXRlQ2FyZChkaXNwbGF5ZWRDYXJkc1tpXSk7XG4gICAgcmVzdWx0Rmxhc2hlZENhcmRzLmFwcGVuZENoaWxkKGNhcmRFbGVtZW50KTtcbiAgfVxuICBmbGFzaGVkQ2FyZENvbnRhaW5lci5pbm5lclRleHQgPSBcIkFjdHVhbCBDYXJkIE9yZGVyXCJcbiAgZmxhc2hlZENhcmRDb250YWluZXIuYXBwZW5kQ2hpbGQocmVzdWx0Rmxhc2hlZENhcmRzKVxuICBnYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGZsYXNoZWRDYXJkQ29udGFpbmVyKTtcbiAgYWxsQ2FyZHNDb250YWluZXIuaW5uZXJUZXh0ID0gXCJZb3VyIFNlbGVjdGVkIE9yZGVyXCJcbiAgYWxsQ2FyZHNDb250YWluZXIuYXBwZW5kQ2hpbGQoYWxsQ2FyZHMpXG4gIGNhcmRTZWxlY3Rpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoYWxsQ2FyZHNDb250YWluZXIpO1xufVxuXG5yZWdpc3RyYXRpb25CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGNvbnN0IHJlZ2lzdGVyRGF0YSA9IHtcbiAgICBuYW1lOiByZWdVc2VyTmFtZS52YWx1ZSxcbiAgICBwYXNzd29yZDogcmVnUGFzc3dvcmQudmFsdWUsXG4gIH07XG4gIFxuICBjb25zb2xlLmxvZyhyZWdpc3RlckRhdGEpO1xuICBheGlvc1xuICAgIC5wb3N0KCcvcmVnaXN0ZXInLCByZWdpc3RlckRhdGEpXG4gICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnaGVsbGxvb3c+Pj4+Pj4nLCByZXNwb25zZS5kYXRhKTtcbiAgICAgIGlmIChyZXNwb25zZS5kYXRhLmVycm9yKXtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2UuZGF0YS5lcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocmVnaXN0cmF0aW9uQ29udGFpbmVyKTtcbiAgICAgICAgcmVnaXN0cmF0aW9uQ29udGFpbmVyLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgZXJyb3JDb250YWluZXIuaW5uZXJIVE1MID0gJzxwIHN0eWxlPVwiY29sb3I6cmVkXCI+SW52YWxpZCBSZWdpc3RyYXRpb24gRGV0YWlsczwvcD4nO1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pXG4gICAgIGNoZWNrTG9nZ2VkSW4oKTtcbn0pO1xuXG5sb2dpbkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgY29uc3QgbG9naW5EYXRhID0ge1xuICAgIG5hbWU6IHVzZXJOYW1lLnZhbHVlLFxuICAgIHBhc3N3b3JkOiBwYXNzd29yZC52YWx1ZSxcbiAgfTtcbiAgY29uc29sZS5sb2cobG9naW5EYXRhKTtcbiAgYXhpb3NcbiAgICAucG9zdCgnL2xvZ2luJywgbG9naW5EYXRhKVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2hlbGxsb293Pj4+Pj4+JywgcmVzcG9uc2UuZGF0YSk7XG4gICAgICBpZiAocmVzcG9uc2UuZGF0YS5lcnJvcilcbiAgICAgIHtcbiAgICAgICAgIHRocm93IHJlc3BvbnNlLmRhdGEuZXJyb3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB1c2VyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRhc2hib2FyZERpdi5hcHBlbmRDaGlsZCh1c2VyRGl2KTtcblxuICAgICAgICBheGlvc1xuICAgICAgICAuZ2V0KCcvdXNlcicpXG4gICAgICAgIC50aGVuKChyZXNwb25zZVVzZXIpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZVVzZXIuZGF0YSk7XG4gICAgICAgICAgdXNlckRpdi5pbm5lckhUTUwgPSBgVXNlcjogJHtyZXNwb25zZVVzZXIuZGF0YS51c2VyLm5hbWV9IDxicj4gV2lucyBSZWNvcmQ6IFhYYDtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbiAgICAgIFxuICAgICAgICBnYW1lSW5mb0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjb250YWluZXInLCAnZm9ybS1zaWduaW4nLCAnYmctbGlnaHQnKTtcbiAgICAgICAgZ2FtZUluZm9Db250YWluZXIuaW5uZXJIVE1MID0gJy1BIHNlcmllcyBvZiBjYXJkcyB3aWxsIGJlIGZsYXNoZWQgZm9yIDEgc2VjIGVhY2ggPGJyPi1BdCB0aGUgZW5kIG9mIHRoZSBmbGFzaGluZywgcGxzIHNlbGVjdCB0aGUgY2FyZHMgaW4gdGhlIG9yZGVyIHRoYXQgdGhleSB3ZXJlIGZsYXNoZWQuIDxicj4gLVRvIHdpbiB0aGUgZ2FtZSwgdGhlIGV4YWN0IG9yZGVyIG9mIHRoZSBjYXJkcyBtdXN0IGJlIGNvcnJlY3QgPGJyPiBCZWdpbm5lciAtIDUgY2FyZHMgPGJyPiBBZHZhbmNlZCAtIDcgY2FyZHMgPGJyPiBFeHBlcnQgLSAxMCBjYXJkcyc7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaWZmQ29udGFpbmVyKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICAgICAgLy8gbG9naW5Db250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIGxvZ2luQ29udGFpbmVyLnJlbW92ZSgpXG4gICAgICAgIHJlZ2lzdHJhdGlvbkNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgICBlcnJvckNvbnRhaW5lci5yZW1vdmUoKVxuICAgICAgXG4gICAgICB9XG4gICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGVycm9yQ29udGFpbmVyLmlubmVySFRNTCA9ICc8cCBzdHlsZT1cImNvbG9yOnJlZFwiPkludmFsaWQgTG9naW4gRGV0YWlsczwvcD4nO1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pXG4gICAgIGNoZWNrTG9nZ2VkSW4oKTtcbn0pO1xuXG5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHBsYXlCdG4pO1xuICAvLyBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGdhbWVJbmZvQ29udGFpbmVyKTtcbiAgZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChmbGFzaGVkQ2FyZENvbnRhaW5lcik7XG4gIC8vIE1ha2UgYSByZXF1ZXN0IHRvIGNyZWF0ZSBhIG5ldyBnYW1lXG4gIGF4aW9zXG4gICAucG9zdCgnL2dhbWVzJylcbiAgIC50aGVuKCAocmVzcG9uc2UpID0+IHtcbiAgICAvLyBzZXQgdGhlIGdsb2JhbCB2YWx1ZSB0byB0aGUgbmV3IGdhbWUuXG4gICAgICBjdXJyZW50R2FtZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBjb25zb2xlLmxvZygnY3VycmVudEdhbWU+Pj4+Pj4+JyxjdXJyZW50R2FtZSk7XG4gICAgICBjb25zdCBkaWZmaWN1bHR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImRpZmZpY3VsdHlcIl06Y2hlY2tlZCcpO1xuICAgICAgY29uc3QgZ2FtZUxldmVsID0gZGlmZmljdWx0eS52YWx1ZVxuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaWZmQ29udGFpbmVyKTtcbiAgICAgIC8vIGRpc3BsYXkgaXQgb3V0IHRvIHRoZSB1c2VyXG4gICAgICBmbGFzaGluZ0NhcmRzKGN1cnJlbnRHYW1lLCBnYW1lTGV2ZWwpO1xuICAgICAgaWYgKG51bU9mQ2FyZHMgPT0gNSl7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRpc3BsYXlDYXJkcyhjdXJyZW50R2FtZSk7XG4gICAgICBjYXJkU2VsZWN0aW9uKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN1Ym1pdEFuc0J0bik7XG4gICAgfSwgNjAwMCk7fSBlbHNlIGlmIChudW1PZkNhcmRzID09IDcpe1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkaXNwbGF5Q2FyZHMoY3VycmVudEdhbWUpO1xuICAgICAgY2FyZFNlbGVjdGlvbigpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdWJtaXRBbnNCdG4pO1xuICAgIH0sIDgwMDApO30gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRpc3BsYXlDYXJkcyhjdXJyZW50R2FtZSk7XG4gICAgICBjYXJkU2VsZWN0aW9uKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN1Ym1pdEFuc0J0bik7XG4gICAgfSwgMTAwMDApO31cbiAgICAgXG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAvLyBoYW5kbGUgZXJyb3JcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcbn0pO1xuXG5zdWJtaXRBbnNCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGxldCBpc1dvbiA9IGZhbHNlXG4gIGxldCBjYXJkRGlmZmVyZW5jZSA9IGRpc3BsYXllZENhcmRzLmxlbmd0aCAtIHNlbGVjdGVkQ2FyZHMubGVuZ3RoO1xuXG4gIGlmKGRpc3BsYXllZENhcmRzLmxlbmd0aCA+IHNlbGVjdGVkQ2FyZHMubGVuZ3RoIHx8IHNlbGVjdGVkQ2FyZHMubGVuZ3RoID09PSAwKXsgXG4gICAgYWxlcnQoYE51bWJlciBvZiBzZWxlY3RlZCBjYXJkcyBpcyBsZXNzZXIgdGhhdCB0aG9zZSBkaXNwbGF5ZWQuIFBscyBzZWxlY3QgJHtjYXJkRGlmZmVyZW5jZX0gbW9yZSBjYXJkcyFgKVxuICB9IGVsc2Uge1xuICBhbGxDYXJkcy5pbm5lckhUTUwgPSBcIlwiXG4gIGZsYXNoZWRDYXJkcy5pbm5lckhUTUwgPSBcIlwiXG4gIGNhcmRTZWxlY3Rpb25Db250YWluZXIucmVtb3ZlQ2hpbGQoYWxsQ2FyZHNDb250YWluZXIpO1xuICBsZXQgY291bnQgPSAwO1xuICBcbiAgLy8gY2hlY2sgZm9yIHdpbiBjb25kaXRpb25zXG4gIGZvcihsZXQgaSA9IDA7IGkgPCBkaXNwbGF5ZWRDYXJkcy5sZW5ndGg7IGkgKz0gMSl7XG4gIGlmKGRpc3BsYXllZENhcmRzW2ldLmRpc3BsYXlOYW1lID09PSBzZWxlY3RlZENhcmRzW2ldLmRpc3BsYXlOYW1lICYmIFxuICAgICAgZGlzcGxheWVkQ2FyZHNbaV0uc3VpdFN5bWJvbCA9PT0gc2VsZWN0ZWRDYXJkc1tpXS5zdWl0U3ltYm9sKXtcbiAgICAgICAgY291bnQgKz0gMTsgICAgICAgXG4gICAgICB9XG4gIH1cbiAgaWYoY291bnQgPT09IGRpc3BsYXllZENhcmRzLmxlbmd0aCl7XG4gICAgICBpc1dvbiA9IHRydWU7XG4gICAgICByZXN1bHRPdXRjb21lLmlubmVyVGV4dCA9ICdZb3Ugd29uJ1xuICAgICAgY29uc29sZS5sb2coJ3lvdSB3b24nKVxuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzdWJtaXRBbnNCdG4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgIGlzV29uID0gZmFsc2VcbiAgICAgIHJlc3VsdE91dGNvbWUuaW5uZXJUZXh0ID0gJ1lvdSBsb3N0J1xuICAgICAgY29uc29sZS5sb2coJ3lvdSBsb3N0ICcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzdWJtaXRBbnNCdG4pO1xuICAgICAgfVxuICAgIGRpc3BsYXlGaW5hbFJlc3VsdHMoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlc3VsdE91dGNvbWUpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwbGF5QWdhaW5CdG4pXG4gIH1cbiAgY29uc3QgZ2FtZVJlc3VsdCA9IHtcbiAgICBpZDogbmV3R2FtZS5pZCxcbiAgICBpc0NvbXBsZXRlZDogdHJ1ZSxcbiAgICBpc1dvbjogaXNXb25cbiAgfTtcbiAgLy8gYXhpb3NcbiAgLy8gICAucHV0KCcvZ2FtZU91dGNvbWUnLCBnYW1lUmVzdWx0KVxuICAvLyAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAvLyAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBnYW1lIG91dGNvbWU6Pj4+Pj4nLCByZXNwb25zZS5kYXRhKVxuICAvLyAgIH0pXG4gIC8vICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAvLyAgICAgY29uc29sZS5sb2coJ2Vycm9yIGluIGdhbWUgb3V0Y29tZTo+PiAnLCBlcnJvcik7XG4gIC8vICAgfSlcbiAgfSk7XG5cbnBsYXlBZ2FpbkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+e1xuICBmbGFzaGVkQ2FyZENvbnRhaW5lci5pbm5lclRleHQgPSBcIlwiXG4gIGFsbENhcmRzQ29udGFpbmVyLmlubmVyVGV4dCA9IFwiU2VsZWN0IHRoZSBjYXJkIG9yZGVyXCJcbiAgYWxsQ2FyZHMuaW5uZXJIVE1MID0gXCJcIlxuICByZXN1bHRGbGFzaGVkQ2FyZHMuaW5uZXJIVE1MID0gXCJcIlxuICBjYXJkU2VsZWN0aW9uQ29udGFpbmVyLnJlbW92ZUNoaWxkKGFsbENhcmRzQ29udGFpbmVyKTtcbiAgZ2FtZUNvbnRhaW5lci5yZW1vdmVDaGlsZChmbGFzaGVkQ2FyZENvbnRhaW5lcik7XG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocmVzdWx0T3V0Y29tZSlcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChwbGF5QWdhaW5CdG4pXG4gIGN1cnJlbnRHYW1lID0gbnVsbDtcbiAgZGlzcGxheWVkQ2FyZHMgPSBbXVxuICBzZWxlY3RlZENhcmRzID0gW11cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaWZmQ29udGFpbmVyKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbn0pO1xuXG5jaGVja0xvZ2dlZEluKCkiLCIvKlxuICogRUpTIEVtYmVkZGVkIEphdmFTY3JpcHQgdGVtcGxhdGVzXG4gKiBDb3B5cmlnaHQgMjExMiBNYXR0aGV3IEVlcm5pc3NlIChtZGVAZmxlZWdpeC5vcmcpXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4qL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQGZpbGUgRW1iZWRkZWQgSmF2YVNjcmlwdCB0ZW1wbGF0aW5nIGVuZ2luZS4ge0BsaW5rIGh0dHA6Ly9lanMuY299XG4gKiBAYXV0aG9yIE1hdHRoZXcgRWVybmlzc2UgPG1kZUBmbGVlZ2l4Lm9yZz5cbiAqIEBhdXRob3IgVGlhbmNoZW5nIFwiVGltb3RoeVwiIEd1IDx0aW1vdGh5Z3U5OUBnbWFpbC5jb20+XG4gKiBAcHJvamVjdCBFSlNcbiAqIEBsaWNlbnNlIHtAbGluayBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjAgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wfVxuICovXG5cbi8qKlxuICogRUpTIGludGVybmFsIGZ1bmN0aW9ucy5cbiAqXG4gKiBUZWNobmljYWxseSB0aGlzIFwibW9kdWxlXCIgbGllcyBpbiB0aGUgc2FtZSBmaWxlIGFzIHtAbGluayBtb2R1bGU6ZWpzfSwgZm9yXG4gKiB0aGUgc2FrZSBvZiBvcmdhbml6YXRpb24gYWxsIHRoZSBwcml2YXRlIGZ1bmN0aW9ucyByZSBncm91cGVkIGludG8gdGhpc1xuICogbW9kdWxlLlxuICpcbiAqIEBtb2R1bGUgZWpzLWludGVybmFsXG4gKiBAcHJpdmF0ZVxuICovXG5cbi8qKlxuICogRW1iZWRkZWQgSmF2YVNjcmlwdCB0ZW1wbGF0aW5nIGVuZ2luZS5cbiAqXG4gKiBAbW9kdWxlIGVqc1xuICogQHB1YmxpY1xuICovXG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIHNjb3BlT3B0aW9uV2FybmVkID0gZmFsc2U7XG4vKiogQHR5cGUge3N0cmluZ30gKi9cbnZhciBfVkVSU0lPTl9TVFJJTkcgPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uO1xudmFyIF9ERUZBVUxUX09QRU5fREVMSU1JVEVSID0gJzwnO1xudmFyIF9ERUZBVUxUX0NMT1NFX0RFTElNSVRFUiA9ICc+JztcbnZhciBfREVGQVVMVF9ERUxJTUlURVIgPSAnJSc7XG52YXIgX0RFRkFVTFRfTE9DQUxTX05BTUUgPSAnbG9jYWxzJztcbnZhciBfTkFNRSA9ICdlanMnO1xudmFyIF9SRUdFWF9TVFJJTkcgPSAnKDwlJXwlJT58PCU9fDwlLXw8JV98PCUjfDwlfCU+fC0lPnxfJT4pJztcbnZhciBfT1BUU19QQVNTQUJMRV9XSVRIX0RBVEEgPSBbJ2RlbGltaXRlcicsICdzY29wZScsICdjb250ZXh0JywgJ2RlYnVnJywgJ2NvbXBpbGVEZWJ1ZycsXG4gICdjbGllbnQnLCAnX3dpdGgnLCAncm1XaGl0ZXNwYWNlJywgJ3N0cmljdCcsICdmaWxlbmFtZScsICdhc3luYyddO1xuLy8gV2UgZG9uJ3QgYWxsb3cgJ2NhY2hlJyBvcHRpb24gdG8gYmUgcGFzc2VkIGluIHRoZSBkYXRhIG9iaiBmb3Jcbi8vIHRoZSBub3JtYWwgYHJlbmRlcmAgY2FsbCwgYnV0IHRoaXMgaXMgd2hlcmUgRXhwcmVzcyAyICYgMyBwdXQgaXRcbi8vIHNvIHdlIG1ha2UgYW4gZXhjZXB0aW9uIGZvciBgcmVuZGVyRmlsZWBcbnZhciBfT1BUU19QQVNTQUJMRV9XSVRIX0RBVEFfRVhQUkVTUyA9IF9PUFRTX1BBU1NBQkxFX1dJVEhfREFUQS5jb25jYXQoJ2NhY2hlJyk7XG52YXIgX0JPTSA9IC9eXFx1RkVGRi87XG5cbi8qKlxuICogRUpTIHRlbXBsYXRlIGZ1bmN0aW9uIGNhY2hlLiBUaGlzIGNhbiBiZSBhIExSVSBvYmplY3QgZnJvbSBscnUtY2FjaGUgTlBNXG4gKiBtb2R1bGUuIEJ5IGRlZmF1bHQsIGl0IGlzIHtAbGluayBtb2R1bGU6dXRpbHMuY2FjaGV9LCBhIHNpbXBsZSBpbi1wcm9jZXNzXG4gKiBjYWNoZSB0aGF0IGdyb3dzIGNvbnRpbnVvdXNseS5cbiAqXG4gKiBAdHlwZSB7Q2FjaGV9XG4gKi9cblxuZXhwb3J0cy5jYWNoZSA9IHV0aWxzLmNhY2hlO1xuXG4vKipcbiAqIEN1c3RvbSBmaWxlIGxvYWRlci4gVXNlZnVsIGZvciB0ZW1wbGF0ZSBwcmVwcm9jZXNzaW5nIG9yIHJlc3RyaWN0aW5nIGFjY2Vzc1xuICogdG8gYSBjZXJ0YWluIHBhcnQgb2YgdGhlIGZpbGVzeXN0ZW0uXG4gKlxuICogQHR5cGUge2ZpbGVMb2FkZXJ9XG4gKi9cblxuZXhwb3J0cy5maWxlTG9hZGVyID0gZnMucmVhZEZpbGVTeW5jO1xuXG4vKipcbiAqIE5hbWUgb2YgdGhlIG9iamVjdCBjb250YWluaW5nIHRoZSBsb2NhbHMuXG4gKlxuICogVGhpcyB2YXJpYWJsZSBpcyBvdmVycmlkZGVuIGJ5IHtAbGluayBPcHRpb25zfWAubG9jYWxzTmFtZWAgaWYgaXQgaXMgbm90XG4gKiBgdW5kZWZpbmVkYC5cbiAqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMubG9jYWxzTmFtZSA9IF9ERUZBVUxUX0xPQ0FMU19OQU1FO1xuXG4vKipcbiAqIFByb21pc2UgaW1wbGVtZW50YXRpb24gLS0gZGVmYXVsdHMgdG8gdGhlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBpZiBhdmFpbGFibGVcbiAqIFRoaXMgaXMgbW9zdGx5IGp1c3QgZm9yIHRlc3RhYmlsaXR5XG4gKlxuICogQHR5cGUge1Byb21pc2VDb25zdHJ1Y3Rvckxpa2V9XG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy5wcm9taXNlSW1wbCA9IChuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzOycpKSgpLlByb21pc2U7XG5cbi8qKlxuICogR2V0IHRoZSBwYXRoIHRvIHRoZSBpbmNsdWRlZCBmaWxlIGZyb20gdGhlIHBhcmVudCBmaWxlIHBhdGggYW5kIHRoZVxuICogc3BlY2lmaWVkIHBhdGguXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9ICBuYW1lICAgICBzcGVjaWZpZWQgcGF0aFxuICogQHBhcmFtIHtTdHJpbmd9ICBmaWxlbmFtZSBwYXJlbnQgZmlsZSBwYXRoXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtpc0Rpcj1mYWxzZV0gd2hldGhlciB0aGUgcGFyZW50IGZpbGUgcGF0aCBpcyBhIGRpcmVjdG9yeVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLnJlc29sdmVJbmNsdWRlID0gZnVuY3Rpb24obmFtZSwgZmlsZW5hbWUsIGlzRGlyKSB7XG4gIHZhciBkaXJuYW1lID0gcGF0aC5kaXJuYW1lO1xuICB2YXIgZXh0bmFtZSA9IHBhdGguZXh0bmFtZTtcbiAgdmFyIHJlc29sdmUgPSBwYXRoLnJlc29sdmU7XG4gIHZhciBpbmNsdWRlUGF0aCA9IHJlc29sdmUoaXNEaXIgPyBmaWxlbmFtZSA6IGRpcm5hbWUoZmlsZW5hbWUpLCBuYW1lKTtcbiAgdmFyIGV4dCA9IGV4dG5hbWUobmFtZSk7XG4gIGlmICghZXh0KSB7XG4gICAgaW5jbHVkZVBhdGggKz0gJy5lanMnO1xuICB9XG4gIHJldHVybiBpbmNsdWRlUGF0aDtcbn07XG5cbi8qKlxuICogVHJ5IHRvIHJlc29sdmUgZmlsZSBwYXRoIG9uIG11bHRpcGxlIGRpcmVjdG9yaWVzXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgbmFtZSAgc3BlY2lmaWVkIHBhdGhcbiAqIEBwYXJhbSAge0FycmF5PFN0cmluZz59IHBhdGhzIGxpc3Qgb2YgcG9zc2libGUgcGFyZW50IGRpcmVjdG9yeSBwYXRoc1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiByZXNvbHZlUGF0aHMobmFtZSwgcGF0aHMpIHtcbiAgdmFyIGZpbGVQYXRoO1xuICBpZiAocGF0aHMuc29tZShmdW5jdGlvbiAodikge1xuICAgIGZpbGVQYXRoID0gZXhwb3J0cy5yZXNvbHZlSW5jbHVkZShuYW1lLCB2LCB0cnVlKTtcbiAgICByZXR1cm4gZnMuZXhpc3RzU3luYyhmaWxlUGF0aCk7XG4gIH0pKSB7XG4gICAgcmV0dXJuIGZpbGVQYXRoO1xuICB9XG59XG5cbi8qKlxuICogR2V0IHRoZSBwYXRoIHRvIHRoZSBpbmNsdWRlZCBmaWxlIGJ5IE9wdGlvbnNcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICBwYXRoICAgIHNwZWNpZmllZCBwYXRoXG4gKiBAcGFyYW0gIHtPcHRpb25zfSBvcHRpb25zIGNvbXBpbGF0aW9uIG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0SW5jbHVkZVBhdGgocGF0aCwgb3B0aW9ucykge1xuICB2YXIgaW5jbHVkZVBhdGg7XG4gIHZhciBmaWxlUGF0aDtcbiAgdmFyIHZpZXdzID0gb3B0aW9ucy52aWV3cztcbiAgdmFyIG1hdGNoID0gL15bQS1aYS16XSs6XFxcXHxeXFwvLy5leGVjKHBhdGgpO1xuXG4gIC8vIEFicyBwYXRoXG4gIGlmIChtYXRjaCAmJiBtYXRjaC5sZW5ndGgpIHtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwvKi8sICcnKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zLnJvb3QpKSB7XG4gICAgICBpbmNsdWRlUGF0aCA9IHJlc29sdmVQYXRocyhwYXRoLCBvcHRpb25zLnJvb3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbmNsdWRlUGF0aCA9IGV4cG9ydHMucmVzb2x2ZUluY2x1ZGUocGF0aCwgb3B0aW9ucy5yb290IHx8ICcvJywgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIC8vIFJlbGF0aXZlIHBhdGhzXG4gIGVsc2Uge1xuICAgIC8vIExvb2sgcmVsYXRpdmUgdG8gYSBwYXNzZWQgZmlsZW5hbWUgZmlyc3RcbiAgICBpZiAob3B0aW9ucy5maWxlbmFtZSkge1xuICAgICAgZmlsZVBhdGggPSBleHBvcnRzLnJlc29sdmVJbmNsdWRlKHBhdGgsIG9wdGlvbnMuZmlsZW5hbWUpO1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgICAgIGluY2x1ZGVQYXRoID0gZmlsZVBhdGg7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFRoZW4gbG9vayBpbiBhbnkgdmlld3MgZGlyZWN0b3JpZXNcbiAgICBpZiAoIWluY2x1ZGVQYXRoICYmIEFycmF5LmlzQXJyYXkodmlld3MpKSB7XG4gICAgICBpbmNsdWRlUGF0aCA9IHJlc29sdmVQYXRocyhwYXRoLCB2aWV3cyk7XG4gICAgfVxuICAgIGlmICghaW5jbHVkZVBhdGggJiYgdHlwZW9mIG9wdGlvbnMuaW5jbHVkZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgdGhlIGluY2x1ZGUgZmlsZSBcIicgK1xuICAgICAgICAgIG9wdGlvbnMuZXNjYXBlRnVuY3Rpb24ocGF0aCkgKyAnXCInKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGluY2x1ZGVQYXRoO1xufVxuXG4vKipcbiAqIEdldCB0aGUgdGVtcGxhdGUgZnJvbSBhIHN0cmluZyBvciBhIGZpbGUsIGVpdGhlciBjb21waWxlZCBvbi10aGUtZmx5IG9yXG4gKiByZWFkIGZyb20gY2FjaGUgKGlmIGVuYWJsZWQpLCBhbmQgY2FjaGUgdGhlIHRlbXBsYXRlIGlmIG5lZWRlZC5cbiAqXG4gKiBJZiBgdGVtcGxhdGVgIGlzIG5vdCBzZXQsIHRoZSBmaWxlIHNwZWNpZmllZCBpbiBgb3B0aW9ucy5maWxlbmFtZWAgd2lsbCBiZVxuICogcmVhZC5cbiAqXG4gKiBJZiBgb3B0aW9ucy5jYWNoZWAgaXMgdHJ1ZSwgdGhpcyBmdW5jdGlvbiByZWFkcyB0aGUgZmlsZSBmcm9tXG4gKiBgb3B0aW9ucy5maWxlbmFtZWAgc28gaXQgbXVzdCBiZSBzZXQgcHJpb3IgdG8gY2FsbGluZyB0aGlzIGZ1bmN0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6ZWpzLWludGVybmFsXG4gKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnMgICBjb21waWxhdGlvbiBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gW3RlbXBsYXRlXSB0ZW1wbGF0ZSBzb3VyY2VcbiAqIEByZXR1cm4geyhUZW1wbGF0ZUZ1bmN0aW9ufENsaWVudEZ1bmN0aW9uKX1cbiAqIERlcGVuZGluZyBvbiB0aGUgdmFsdWUgb2YgYG9wdGlvbnMuY2xpZW50YCwgZWl0aGVyIHR5cGUgbWlnaHQgYmUgcmV0dXJuZWQuXG4gKiBAc3RhdGljXG4gKi9cblxuZnVuY3Rpb24gaGFuZGxlQ2FjaGUob3B0aW9ucywgdGVtcGxhdGUpIHtcbiAgdmFyIGZ1bmM7XG4gIHZhciBmaWxlbmFtZSA9IG9wdGlvbnMuZmlsZW5hbWU7XG4gIHZhciBoYXNUZW1wbGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxO1xuXG4gIGlmIChvcHRpb25zLmNhY2hlKSB7XG4gICAgaWYgKCFmaWxlbmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYWNoZSBvcHRpb24gcmVxdWlyZXMgYSBmaWxlbmFtZScpO1xuICAgIH1cbiAgICBmdW5jID0gZXhwb3J0cy5jYWNoZS5nZXQoZmlsZW5hbWUpO1xuICAgIGlmIChmdW5jKSB7XG4gICAgICByZXR1cm4gZnVuYztcbiAgICB9XG4gICAgaWYgKCFoYXNUZW1wbGF0ZSkge1xuICAgICAgdGVtcGxhdGUgPSBmaWxlTG9hZGVyKGZpbGVuYW1lKS50b1N0cmluZygpLnJlcGxhY2UoX0JPTSwgJycpO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmICghaGFzVGVtcGxhdGUpIHtcbiAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWY6IHNob3VsZCBub3QgaGFwcGVuIGF0IGFsbFxuICAgIGlmICghZmlsZW5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW50ZXJuYWwgRUpTIGVycm9yOiBubyBmaWxlIG5hbWUgb3IgdGVtcGxhdGUgJ1xuICAgICAgICAgICAgICAgICAgICArICdwcm92aWRlZCcpO1xuICAgIH1cbiAgICB0ZW1wbGF0ZSA9IGZpbGVMb2FkZXIoZmlsZW5hbWUpLnRvU3RyaW5nKCkucmVwbGFjZShfQk9NLCAnJyk7XG4gIH1cbiAgZnVuYyA9IGV4cG9ydHMuY29tcGlsZSh0ZW1wbGF0ZSwgb3B0aW9ucyk7XG4gIGlmIChvcHRpb25zLmNhY2hlKSB7XG4gICAgZXhwb3J0cy5jYWNoZS5zZXQoZmlsZW5hbWUsIGZ1bmMpO1xuICB9XG4gIHJldHVybiBmdW5jO1xufVxuXG4vKipcbiAqIFRyeSBjYWxsaW5nIGhhbmRsZUNhY2hlIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgYW5kIGRhdGEgYW5kIGNhbGwgdGhlXG4gKiBjYWxsYmFjayB3aXRoIHRoZSByZXN1bHQuIElmIGFuIGVycm9yIG9jY3VycywgY2FsbCB0aGUgY2FsbGJhY2sgd2l0aFxuICogdGhlIGVycm9yLiBVc2VkIGJ5IHJlbmRlckZpbGUoKS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmVqcy1pbnRlcm5hbFxuICogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zICAgIGNvbXBpbGF0aW9uIG9wdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhICAgICAgICB0ZW1wbGF0ZSBkYXRhXG4gKiBAcGFyYW0ge1JlbmRlckZpbGVDYWxsYmFja30gY2IgY2FsbGJhY2tcbiAqIEBzdGF0aWNcbiAqL1xuXG5mdW5jdGlvbiB0cnlIYW5kbGVDYWNoZShvcHRpb25zLCBkYXRhLCBjYikge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoIWNiKSB7XG4gICAgaWYgKHR5cGVvZiBleHBvcnRzLnByb21pc2VJbXBsID09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBuZXcgZXhwb3J0cy5wcm9taXNlSW1wbChmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmVzdWx0ID0gaGFuZGxlQ2FjaGUob3B0aW9ucykoZGF0YSk7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIGNhbGxiYWNrIGZ1bmN0aW9uJyk7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBoYW5kbGVDYWNoZShvcHRpb25zKShkYXRhKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgfVxuXG4gICAgY2IobnVsbCwgcmVzdWx0KTtcbiAgfVxufVxuXG4vKipcbiAqIGZpbGVMb2FkZXIgaXMgaW5kZXBlbmRlbnRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGggZWpzIGZpbGUgcGF0aC5cbiAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGNvbnRlbnRzIG9mIHRoZSBzcGVjaWZpZWQgZmlsZS5cbiAqIEBzdGF0aWNcbiAqL1xuXG5mdW5jdGlvbiBmaWxlTG9hZGVyKGZpbGVQYXRoKXtcbiAgcmV0dXJuIGV4cG9ydHMuZmlsZUxvYWRlcihmaWxlUGF0aCk7XG59XG5cbi8qKlxuICogR2V0IHRoZSB0ZW1wbGF0ZSBmdW5jdGlvbi5cbiAqXG4gKiBJZiBgb3B0aW9ucy5jYWNoZWAgaXMgYHRydWVgLCB0aGVuIHRoZSB0ZW1wbGF0ZSBpcyBjYWNoZWQuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTplanMtaW50ZXJuYWxcbiAqIEBwYXJhbSB7U3RyaW5nfSAgcGF0aCAgICBwYXRoIGZvciB0aGUgc3BlY2lmaWVkIGZpbGVcbiAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9ucyBjb21waWxhdGlvbiBvcHRpb25zXG4gKiBAcmV0dXJuIHsoVGVtcGxhdGVGdW5jdGlvbnxDbGllbnRGdW5jdGlvbil9XG4gKiBEZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGBvcHRpb25zLmNsaWVudGAsIGVpdGhlciB0eXBlIG1pZ2h0IGJlIHJldHVybmVkXG4gKiBAc3RhdGljXG4gKi9cblxuZnVuY3Rpb24gaW5jbHVkZUZpbGUocGF0aCwgb3B0aW9ucykge1xuICB2YXIgb3B0cyA9IHV0aWxzLnNoYWxsb3dDb3B5KHt9LCBvcHRpb25zKTtcbiAgb3B0cy5maWxlbmFtZSA9IGdldEluY2x1ZGVQYXRoKHBhdGgsIG9wdHMpO1xuICBpZiAodHlwZW9mIG9wdGlvbnMuaW5jbHVkZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgaW5jbHVkZXJSZXN1bHQgPSBvcHRpb25zLmluY2x1ZGVyKHBhdGgsIG9wdHMuZmlsZW5hbWUpO1xuICAgIGlmIChpbmNsdWRlclJlc3VsdCkge1xuICAgICAgaWYgKGluY2x1ZGVyUmVzdWx0LmZpbGVuYW1lKSB7XG4gICAgICAgIG9wdHMuZmlsZW5hbWUgPSBpbmNsdWRlclJlc3VsdC5maWxlbmFtZTtcbiAgICAgIH1cbiAgICAgIGlmIChpbmNsdWRlclJlc3VsdC50ZW1wbGF0ZSkge1xuICAgICAgICByZXR1cm4gaGFuZGxlQ2FjaGUob3B0cywgaW5jbHVkZXJSZXN1bHQudGVtcGxhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gaGFuZGxlQ2FjaGUob3B0cyk7XG59XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlIGBzdHJgIG9mIGVqcywgYGZpbGVuYW1lYCwgYW5kXG4gKiBgbGluZW5vYC5cbiAqXG4gKiBAaW1wbGVtZW50cyB7UmV0aHJvd0NhbGxiYWNrfVxuICogQG1lbWJlcm9mIG1vZHVsZTplanMtaW50ZXJuYWxcbiAqIEBwYXJhbSB7RXJyb3J9ICBlcnIgICAgICBFcnJvciBvYmplY3RcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgICAgICBFSlMgc291cmNlXG4gKiBAcGFyYW0ge1N0cmluZ30gZmxubSAgICAgZmlsZSBuYW1lIG9mIHRoZSBFSlMgZmlsZVxuICogQHBhcmFtIHtOdW1iZXJ9IGxpbmVubyAgIGxpbmUgbnVtYmVyIG9mIHRoZSBlcnJvclxuICogQHBhcmFtIHtFc2NhcGVDYWxsYmFja30gZXNjXG4gKiBAc3RhdGljXG4gKi9cblxuZnVuY3Rpb24gcmV0aHJvdyhlcnIsIHN0ciwgZmxubSwgbGluZW5vLCBlc2MpIHtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKTtcbiAgdmFyIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gMywgMCk7XG4gIHZhciBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIDMpO1xuICB2YXIgZmlsZW5hbWUgPSBlc2MoZmxubSk7XG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24gKGxpbmUsIGkpe1xuICAgIHZhciBjdXJyID0gaSArIHN0YXJ0ICsgMTtcbiAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyA+PiAnIDogJyAgICAnKVxuICAgICAgKyBjdXJyXG4gICAgICArICd8ICdcbiAgICAgICsgbGluZTtcbiAgfSkuam9pbignXFxuJyk7XG5cbiAgLy8gQWx0ZXIgZXhjZXB0aW9uIG1lc3NhZ2VcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgZXJyLm1lc3NhZ2UgPSAoZmlsZW5hbWUgfHwgJ2VqcycpICsgJzonXG4gICAgKyBsaW5lbm8gKyAnXFxuJ1xuICAgICsgY29udGV4dCArICdcXG5cXG4nXG4gICAgKyBlcnIubWVzc2FnZTtcblxuICB0aHJvdyBlcnI7XG59XG5cbmZ1bmN0aW9uIHN0cmlwU2VtaShzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLzsoXFxzKiQpLywgJyQxJyk7XG59XG5cbi8qKlxuICogQ29tcGlsZSB0aGUgZ2l2ZW4gYHN0cmAgb2YgZWpzIGludG8gYSB0ZW1wbGF0ZSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gIHRlbXBsYXRlIEVKUyB0ZW1wbGF0ZVxuICpcbiAqIEBwYXJhbSB7T3B0aW9uc30gW29wdHNdIGNvbXBpbGF0aW9uIG9wdGlvbnNcbiAqXG4gKiBAcmV0dXJuIHsoVGVtcGxhdGVGdW5jdGlvbnxDbGllbnRGdW5jdGlvbil9XG4gKiBEZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGBvcHRzLmNsaWVudGAsIGVpdGhlciB0eXBlIG1pZ2h0IGJlIHJldHVybmVkLlxuICogTm90ZSB0aGF0IHRoZSByZXR1cm4gdHlwZSBvZiB0aGUgZnVuY3Rpb24gYWxzbyBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBvZiBgb3B0cy5hc3luY2AuXG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy5jb21waWxlID0gZnVuY3Rpb24gY29tcGlsZSh0ZW1wbGF0ZSwgb3B0cykge1xuICB2YXIgdGVtcGw7XG5cbiAgLy8gdjEgY29tcGF0XG4gIC8vICdzY29wZScgaXMgJ2NvbnRleHQnXG4gIC8vIEZJWE1FOiBSZW1vdmUgdGhpcyBpbiBhIGZ1dHVyZSB2ZXJzaW9uXG4gIGlmIChvcHRzICYmIG9wdHMuc2NvcGUpIHtcbiAgICBpZiAoIXNjb3BlT3B0aW9uV2FybmVkKXtcbiAgICAgIGNvbnNvbGUud2FybignYHNjb3BlYCBvcHRpb24gaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIEVKUyAzJyk7XG4gICAgICBzY29wZU9wdGlvbldhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIGlmICghb3B0cy5jb250ZXh0KSB7XG4gICAgICBvcHRzLmNvbnRleHQgPSBvcHRzLnNjb3BlO1xuICAgIH1cbiAgICBkZWxldGUgb3B0cy5zY29wZTtcbiAgfVxuICB0ZW1wbCA9IG5ldyBUZW1wbGF0ZSh0ZW1wbGF0ZSwgb3B0cyk7XG4gIHJldHVybiB0ZW1wbC5jb21waWxlKCk7XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCBvZiBlanMuXG4gKlxuICogSWYgeW91IHdvdWxkIGxpa2UgdG8gaW5jbHVkZSBvcHRpb25zIGJ1dCBub3QgZGF0YSwgeW91IG5lZWQgdG8gZXhwbGljaXRseVxuICogY2FsbCB0aGlzIGZ1bmN0aW9uIHdpdGggYGRhdGFgIGJlaW5nIGFuIGVtcHR5IG9iamVjdCBvciBgbnVsbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9ICAgdGVtcGxhdGUgRUpTIHRlbXBsYXRlXG4gKiBAcGFyYW0ge09iamVjdH0gIFtkYXRhPXt9XSB0ZW1wbGF0ZSBkYXRhXG4gKiBAcGFyYW0ge09wdGlvbnN9IFtvcHRzPXt9XSBjb21waWxhdGlvbiBhbmQgcmVuZGVyaW5nIG9wdGlvbnNcbiAqIEByZXR1cm4geyhTdHJpbmd8UHJvbWlzZTxTdHJpbmc+KX1cbiAqIFJldHVybiB2YWx1ZSB0eXBlIGRlcGVuZHMgb24gYG9wdHMuYXN5bmNgLlxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMucmVuZGVyID0gZnVuY3Rpb24gKHRlbXBsYXRlLCBkLCBvKSB7XG4gIHZhciBkYXRhID0gZCB8fCB7fTtcbiAgdmFyIG9wdHMgPSBvIHx8IHt9O1xuXG4gIC8vIE5vIG9wdGlvbnMgb2JqZWN0IC0tIGlmIHRoZXJlIGFyZSBvcHRpb255IG5hbWVzXG4gIC8vIGluIHRoZSBkYXRhLCBjb3B5IHRoZW0gdG8gb3B0aW9uc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XG4gICAgdXRpbHMuc2hhbGxvd0NvcHlGcm9tTGlzdChvcHRzLCBkYXRhLCBfT1BUU19QQVNTQUJMRV9XSVRIX0RBVEEpO1xuICB9XG5cbiAgcmV0dXJuIGhhbmRsZUNhY2hlKG9wdHMsIHRlbXBsYXRlKShkYXRhKTtcbn07XG5cbi8qKlxuICogUmVuZGVyIGFuIEVKUyBmaWxlIGF0IHRoZSBnaXZlbiBgcGF0aGAgYW5kIGNhbGxiYWNrIGBjYihlcnIsIHN0cilgLlxuICpcbiAqIElmIHlvdSB3b3VsZCBsaWtlIHRvIGluY2x1ZGUgb3B0aW9ucyBidXQgbm90IGRhdGEsIHlvdSBuZWVkIHRvIGV4cGxpY2l0bHlcbiAqIGNhbGwgdGhpcyBmdW5jdGlvbiB3aXRoIGBkYXRhYCBiZWluZyBhbiBlbXB0eSBvYmplY3Qgb3IgYG51bGxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSAgICAgICAgICAgICBwYXRoICAgICBwYXRoIHRvIHRoZSBFSlMgZmlsZVxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICAgW2RhdGE9e31dIHRlbXBsYXRlIGRhdGFcbiAqIEBwYXJhbSB7T3B0aW9uc30gICAgICAgICAgIFtvcHRzPXt9XSBjb21waWxhdGlvbiBhbmQgcmVuZGVyaW5nIG9wdGlvbnNcbiAqIEBwYXJhbSB7UmVuZGVyRmlsZUNhbGxiYWNrfSBjYiBjYWxsYmFja1xuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMucmVuZGVyRmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICB2YXIgZmlsZW5hbWUgPSBhcmdzLnNoaWZ0KCk7XG4gIHZhciBjYjtcbiAgdmFyIG9wdHMgPSB7ZmlsZW5hbWU6IGZpbGVuYW1lfTtcbiAgdmFyIGRhdGE7XG4gIHZhciB2aWV3T3B0cztcblxuICAvLyBEbyB3ZSBoYXZlIGEgY2FsbGJhY2s/XG4gIGlmICh0eXBlb2YgYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBhcmdzLnBvcCgpO1xuICB9XG4gIC8vIERvIHdlIGhhdmUgZGF0YS9vcHRzP1xuICBpZiAoYXJncy5sZW5ndGgpIHtcbiAgICAvLyBTaG91bGQgYWx3YXlzIGhhdmUgZGF0YSBvYmpcbiAgICBkYXRhID0gYXJncy5zaGlmdCgpO1xuICAgIC8vIE5vcm1hbCBwYXNzZWQgb3B0cyAoZGF0YSBvYmogKyBvcHRzIG9iailcbiAgICBpZiAoYXJncy5sZW5ndGgpIHtcbiAgICAgIC8vIFVzZSBzaGFsbG93Q29weSBzbyB3ZSBkb24ndCBwb2xsdXRlIHBhc3NlZCBpbiBvcHRzIG9iaiB3aXRoIG5ldyB2YWxzXG4gICAgICB1dGlscy5zaGFsbG93Q29weShvcHRzLCBhcmdzLnBvcCgpKTtcbiAgICB9XG4gICAgLy8gU3BlY2lhbCBjYXNpbmcgZm9yIEV4cHJlc3MgKHNldHRpbmdzICsgb3B0cy1pbi1kYXRhKVxuICAgIGVsc2Uge1xuICAgICAgLy8gRXhwcmVzcyAzIGFuZCA0XG4gICAgICBpZiAoZGF0YS5zZXR0aW5ncykge1xuICAgICAgICAvLyBQdWxsIGEgZmV3IHRoaW5ncyBmcm9tIGtub3duIGxvY2F0aW9uc1xuICAgICAgICBpZiAoZGF0YS5zZXR0aW5ncy52aWV3cykge1xuICAgICAgICAgIG9wdHMudmlld3MgPSBkYXRhLnNldHRpbmdzLnZpZXdzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLnNldHRpbmdzWyd2aWV3IGNhY2hlJ10pIHtcbiAgICAgICAgICBvcHRzLmNhY2hlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBVbmRvY3VtZW50ZWQgYWZ0ZXIgRXhwcmVzcyAyLCBidXQgc3RpbGwgdXNhYmxlLCBlc3AuIGZvclxuICAgICAgICAvLyBpdGVtcyB0aGF0IGFyZSB1bnNhZmUgdG8gYmUgcGFzc2VkIGFsb25nIHdpdGggZGF0YSwgbGlrZSBgcm9vdGBcbiAgICAgICAgdmlld09wdHMgPSBkYXRhLnNldHRpbmdzWyd2aWV3IG9wdGlvbnMnXTtcbiAgICAgICAgaWYgKHZpZXdPcHRzKSB7XG4gICAgICAgICAgdXRpbHMuc2hhbGxvd0NvcHkob3B0cywgdmlld09wdHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFeHByZXNzIDIgYW5kIGxvd2VyLCB2YWx1ZXMgc2V0IGluIGFwcC5sb2NhbHMsIG9yIHBlb3BsZSB3aG8ganVzdFxuICAgICAgLy8gd2FudCB0byBwYXNzIG9wdGlvbnMgaW4gdGhlaXIgZGF0YS4gTk9URTogVGhlc2UgdmFsdWVzIHdpbGwgb3ZlcnJpZGVcbiAgICAgIC8vIGFueXRoaW5nIHByZXZpb3VzbHkgc2V0IGluIHNldHRpbmdzICBvciBzZXR0aW5nc1sndmlldyBvcHRpb25zJ11cbiAgICAgIHV0aWxzLnNoYWxsb3dDb3B5RnJvbUxpc3Qob3B0cywgZGF0YSwgX09QVFNfUEFTU0FCTEVfV0lUSF9EQVRBX0VYUFJFU1MpO1xuICAgIH1cbiAgICBvcHRzLmZpbGVuYW1lID0gZmlsZW5hbWU7XG4gIH1cbiAgZWxzZSB7XG4gICAgZGF0YSA9IHt9O1xuICB9XG5cbiAgcmV0dXJuIHRyeUhhbmRsZUNhY2hlKG9wdHMsIGRhdGEsIGNiKTtcbn07XG5cbi8qKlxuICogQ2xlYXIgaW50ZXJtZWRpYXRlIEphdmFTY3JpcHQgY2FjaGUuIENhbGxzIHtAbGluayBDYWNoZSNyZXNldH0uXG4gKiBAcHVibGljXG4gKi9cblxuLyoqXG4gKiBFSlMgdGVtcGxhdGUgY2xhc3NcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0cy5UZW1wbGF0ZSA9IFRlbXBsYXRlO1xuXG5leHBvcnRzLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiAoKSB7XG4gIGV4cG9ydHMuY2FjaGUucmVzZXQoKTtcbn07XG5cbmZ1bmN0aW9uIFRlbXBsYXRlKHRleHQsIG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge307XG4gIHZhciBvcHRpb25zID0ge307XG4gIHRoaXMudGVtcGxhdGVUZXh0ID0gdGV4dDtcbiAgLyoqIEB0eXBlIHtzdHJpbmcgfCBudWxsfSAqL1xuICB0aGlzLm1vZGUgPSBudWxsO1xuICB0aGlzLnRydW5jYXRlID0gZmFsc2U7XG4gIHRoaXMuY3VycmVudExpbmUgPSAxO1xuICB0aGlzLnNvdXJjZSA9ICcnO1xuICBvcHRpb25zLmNsaWVudCA9IG9wdHMuY2xpZW50IHx8IGZhbHNlO1xuICBvcHRpb25zLmVzY2FwZUZ1bmN0aW9uID0gb3B0cy5lc2NhcGUgfHwgb3B0cy5lc2NhcGVGdW5jdGlvbiB8fCB1dGlscy5lc2NhcGVYTUw7XG4gIG9wdGlvbnMuY29tcGlsZURlYnVnID0gb3B0cy5jb21waWxlRGVidWcgIT09IGZhbHNlO1xuICBvcHRpb25zLmRlYnVnID0gISFvcHRzLmRlYnVnO1xuICBvcHRpb25zLmZpbGVuYW1lID0gb3B0cy5maWxlbmFtZTtcbiAgb3B0aW9ucy5vcGVuRGVsaW1pdGVyID0gb3B0cy5vcGVuRGVsaW1pdGVyIHx8IGV4cG9ydHMub3BlbkRlbGltaXRlciB8fCBfREVGQVVMVF9PUEVOX0RFTElNSVRFUjtcbiAgb3B0aW9ucy5jbG9zZURlbGltaXRlciA9IG9wdHMuY2xvc2VEZWxpbWl0ZXIgfHwgZXhwb3J0cy5jbG9zZURlbGltaXRlciB8fCBfREVGQVVMVF9DTE9TRV9ERUxJTUlURVI7XG4gIG9wdGlvbnMuZGVsaW1pdGVyID0gb3B0cy5kZWxpbWl0ZXIgfHwgZXhwb3J0cy5kZWxpbWl0ZXIgfHwgX0RFRkFVTFRfREVMSU1JVEVSO1xuICBvcHRpb25zLnN0cmljdCA9IG9wdHMuc3RyaWN0IHx8IGZhbHNlO1xuICBvcHRpb25zLmNvbnRleHQgPSBvcHRzLmNvbnRleHQ7XG4gIG9wdGlvbnMuY2FjaGUgPSBvcHRzLmNhY2hlIHx8IGZhbHNlO1xuICBvcHRpb25zLnJtV2hpdGVzcGFjZSA9IG9wdHMucm1XaGl0ZXNwYWNlO1xuICBvcHRpb25zLnJvb3QgPSBvcHRzLnJvb3Q7XG4gIG9wdGlvbnMuaW5jbHVkZXIgPSBvcHRzLmluY2x1ZGVyO1xuICBvcHRpb25zLm91dHB1dEZ1bmN0aW9uTmFtZSA9IG9wdHMub3V0cHV0RnVuY3Rpb25OYW1lO1xuICBvcHRpb25zLmxvY2Fsc05hbWUgPSBvcHRzLmxvY2Fsc05hbWUgfHwgZXhwb3J0cy5sb2NhbHNOYW1lIHx8IF9ERUZBVUxUX0xPQ0FMU19OQU1FO1xuICBvcHRpb25zLnZpZXdzID0gb3B0cy52aWV3cztcbiAgb3B0aW9ucy5hc3luYyA9IG9wdHMuYXN5bmM7XG4gIG9wdGlvbnMuZGVzdHJ1Y3R1cmVkTG9jYWxzID0gb3B0cy5kZXN0cnVjdHVyZWRMb2NhbHM7XG4gIG9wdGlvbnMubGVnYWN5SW5jbHVkZSA9IHR5cGVvZiBvcHRzLmxlZ2FjeUluY2x1ZGUgIT0gJ3VuZGVmaW5lZCcgPyAhIW9wdHMubGVnYWN5SW5jbHVkZSA6IHRydWU7XG5cbiAgaWYgKG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgb3B0aW9ucy5fd2l0aCA9IGZhbHNlO1xuICB9XG4gIGVsc2Uge1xuICAgIG9wdGlvbnMuX3dpdGggPSB0eXBlb2Ygb3B0cy5fd2l0aCAhPSAndW5kZWZpbmVkJyA/IG9wdHMuX3dpdGggOiB0cnVlO1xuICB9XG5cbiAgdGhpcy5vcHRzID0gb3B0aW9ucztcblxuICB0aGlzLnJlZ2V4ID0gdGhpcy5jcmVhdGVSZWdleCgpO1xufVxuXG5UZW1wbGF0ZS5tb2RlcyA9IHtcbiAgRVZBTDogJ2V2YWwnLFxuICBFU0NBUEVEOiAnZXNjYXBlZCcsXG4gIFJBVzogJ3JhdycsXG4gIENPTU1FTlQ6ICdjb21tZW50JyxcbiAgTElURVJBTDogJ2xpdGVyYWwnXG59O1xuXG5UZW1wbGF0ZS5wcm90b3R5cGUgPSB7XG4gIGNyZWF0ZVJlZ2V4OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0ciA9IF9SRUdFWF9TVFJJTkc7XG4gICAgdmFyIGRlbGltID0gdXRpbHMuZXNjYXBlUmVnRXhwQ2hhcnModGhpcy5vcHRzLmRlbGltaXRlcik7XG4gICAgdmFyIG9wZW4gPSB1dGlscy5lc2NhcGVSZWdFeHBDaGFycyh0aGlzLm9wdHMub3BlbkRlbGltaXRlcik7XG4gICAgdmFyIGNsb3NlID0gdXRpbHMuZXNjYXBlUmVnRXhwQ2hhcnModGhpcy5vcHRzLmNsb3NlRGVsaW1pdGVyKTtcbiAgICBzdHIgPSBzdHIucmVwbGFjZSgvJS9nLCBkZWxpbSlcbiAgICAgIC5yZXBsYWNlKC88L2csIG9wZW4pXG4gICAgICAucmVwbGFjZSgvPi9nLCBjbG9zZSk7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoc3RyKTtcbiAgfSxcblxuICBjb21waWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXG4gICAgdmFyIHNyYztcbiAgICAvKiogQHR5cGUge0NsaWVudEZ1bmN0aW9ufSAqL1xuICAgIHZhciBmbjtcbiAgICB2YXIgb3B0cyA9IHRoaXMub3B0cztcbiAgICB2YXIgcHJlcGVuZGVkID0gJyc7XG4gICAgdmFyIGFwcGVuZGVkID0gJyc7XG4gICAgLyoqIEB0eXBlIHtFc2NhcGVDYWxsYmFja30gKi9cbiAgICB2YXIgZXNjYXBlRm4gPSBvcHRzLmVzY2FwZUZ1bmN0aW9uO1xuICAgIC8qKiBAdHlwZSB7RnVuY3Rpb25Db25zdHJ1Y3Rvcn0gKi9cbiAgICB2YXIgY3RvcjtcblxuICAgIGlmICghdGhpcy5zb3VyY2UpIHtcbiAgICAgIHRoaXMuZ2VuZXJhdGVTb3VyY2UoKTtcbiAgICAgIHByZXBlbmRlZCArPVxuICAgICAgICAnICB2YXIgX19vdXRwdXQgPSBcIlwiO1xcbicgK1xuICAgICAgICAnICBmdW5jdGlvbiBfX2FwcGVuZChzKSB7IGlmIChzICE9PSB1bmRlZmluZWQgJiYgcyAhPT0gbnVsbCkgX19vdXRwdXQgKz0gcyB9XFxuJztcbiAgICAgIGlmIChvcHRzLm91dHB1dEZ1bmN0aW9uTmFtZSkge1xuICAgICAgICBwcmVwZW5kZWQgKz0gJyAgdmFyICcgKyBvcHRzLm91dHB1dEZ1bmN0aW9uTmFtZSArICcgPSBfX2FwcGVuZDsnICsgJ1xcbic7XG4gICAgICB9XG4gICAgICBpZiAob3B0cy5kZXN0cnVjdHVyZWRMb2NhbHMgJiYgb3B0cy5kZXN0cnVjdHVyZWRMb2NhbHMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBkZXN0cnVjdHVyaW5nID0gJyAgdmFyIF9fbG9jYWxzID0gKCcgKyBvcHRzLmxvY2Fsc05hbWUgKyAnIHx8IHt9KSxcXG4nO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wdHMuZGVzdHJ1Y3R1cmVkTG9jYWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIG5hbWUgPSBvcHRzLmRlc3RydWN0dXJlZExvY2Fsc1tpXTtcbiAgICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICAgIGRlc3RydWN0dXJpbmcgKz0gJyxcXG4gICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlc3RydWN0dXJpbmcgKz0gbmFtZSArICcgPSBfX2xvY2Fscy4nICsgbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBwcmVwZW5kZWQgKz0gZGVzdHJ1Y3R1cmluZyArICc7XFxuJztcbiAgICAgIH1cbiAgICAgIGlmIChvcHRzLl93aXRoICE9PSBmYWxzZSkge1xuICAgICAgICBwcmVwZW5kZWQgKz0gICcgIHdpdGggKCcgKyBvcHRzLmxvY2Fsc05hbWUgKyAnIHx8IHt9KSB7JyArICdcXG4nO1xuICAgICAgICBhcHBlbmRlZCArPSAnICB9JyArICdcXG4nO1xuICAgICAgfVxuICAgICAgYXBwZW5kZWQgKz0gJyAgcmV0dXJuIF9fb3V0cHV0OycgKyAnXFxuJztcbiAgICAgIHRoaXMuc291cmNlID0gcHJlcGVuZGVkICsgdGhpcy5zb3VyY2UgKyBhcHBlbmRlZDtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5jb21waWxlRGVidWcpIHtcbiAgICAgIHNyYyA9ICd2YXIgX19saW5lID0gMScgKyAnXFxuJ1xuICAgICAgICArICcgICwgX19saW5lcyA9ICcgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnRlbXBsYXRlVGV4dCkgKyAnXFxuJ1xuICAgICAgICArICcgICwgX19maWxlbmFtZSA9ICcgKyAob3B0cy5maWxlbmFtZSA/XG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG9wdHMuZmlsZW5hbWUpIDogJ3VuZGVmaW5lZCcpICsgJzsnICsgJ1xcbidcbiAgICAgICAgKyAndHJ5IHsnICsgJ1xcbidcbiAgICAgICAgKyB0aGlzLnNvdXJjZVxuICAgICAgICArICd9IGNhdGNoIChlKSB7JyArICdcXG4nXG4gICAgICAgICsgJyAgcmV0aHJvdyhlLCBfX2xpbmVzLCBfX2ZpbGVuYW1lLCBfX2xpbmUsIGVzY2FwZUZuKTsnICsgJ1xcbidcbiAgICAgICAgKyAnfScgKyAnXFxuJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzcmMgPSB0aGlzLnNvdXJjZTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5jbGllbnQpIHtcbiAgICAgIHNyYyA9ICdlc2NhcGVGbiA9IGVzY2FwZUZuIHx8ICcgKyBlc2NhcGVGbi50b1N0cmluZygpICsgJzsnICsgJ1xcbicgKyBzcmM7XG4gICAgICBpZiAob3B0cy5jb21waWxlRGVidWcpIHtcbiAgICAgICAgc3JjID0gJ3JldGhyb3cgPSByZXRocm93IHx8ICcgKyByZXRocm93LnRvU3RyaW5nKCkgKyAnOycgKyAnXFxuJyArIHNyYztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0cy5zdHJpY3QpIHtcbiAgICAgIHNyYyA9ICdcInVzZSBzdHJpY3RcIjtcXG4nICsgc3JjO1xuICAgIH1cbiAgICBpZiAob3B0cy5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coc3JjKTtcbiAgICB9XG4gICAgaWYgKG9wdHMuY29tcGlsZURlYnVnICYmIG9wdHMuZmlsZW5hbWUpIHtcbiAgICAgIHNyYyA9IHNyYyArICdcXG4nXG4gICAgICAgICsgJy8vIyBzb3VyY2VVUkw9JyArIG9wdHMuZmlsZW5hbWUgKyAnXFxuJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaWYgKG9wdHMuYXN5bmMpIHtcbiAgICAgICAgLy8gSGF2ZSB0byB1c2UgZ2VuZXJhdGVkIGZ1bmN0aW9uIGZvciB0aGlzLCBzaW5jZSBpbiBlbnZzIHdpdGhvdXQgc3VwcG9ydCxcbiAgICAgICAgLy8gaXQgYnJlYWtzIGluIHBhcnNpbmdcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjdG9yID0gKG5ldyBGdW5jdGlvbigncmV0dXJuIChhc3luYyBmdW5jdGlvbigpe30pLmNvbnN0cnVjdG9yOycpKSgpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGUpIHtcbiAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgZW52aXJvbm1lbnQgZG9lcyBub3Qgc3VwcG9ydCBhc3luYy9hd2FpdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY3RvciA9IEZ1bmN0aW9uO1xuICAgICAgfVxuICAgICAgZm4gPSBuZXcgY3RvcihvcHRzLmxvY2Fsc05hbWUgKyAnLCBlc2NhcGVGbiwgaW5jbHVkZSwgcmV0aHJvdycsIHNyYyk7XG4gICAgfVxuICAgIGNhdGNoKGUpIHtcbiAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBlbHNlXG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICAgIGlmIChvcHRzLmZpbGVuYW1lKSB7XG4gICAgICAgICAgZS5tZXNzYWdlICs9ICcgaW4gJyArIG9wdHMuZmlsZW5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZS5tZXNzYWdlICs9ICcgd2hpbGUgY29tcGlsaW5nIGVqc1xcblxcbic7XG4gICAgICAgIGUubWVzc2FnZSArPSAnSWYgdGhlIGFib3ZlIGVycm9yIGlzIG5vdCBoZWxwZnVsLCB5b3UgbWF5IHdhbnQgdG8gdHJ5IEVKUy1MaW50Olxcbic7XG4gICAgICAgIGUubWVzc2FnZSArPSAnaHR0cHM6Ly9naXRodWIuY29tL1J5YW5aaW0vRUpTLUxpbnQnO1xuICAgICAgICBpZiAoIW9wdHMuYXN5bmMpIHtcbiAgICAgICAgICBlLm1lc3NhZ2UgKz0gJ1xcbic7XG4gICAgICAgICAgZS5tZXNzYWdlICs9ICdPciwgaWYgeW91IG1lYW50IHRvIGNyZWF0ZSBhbiBhc3luYyBmdW5jdGlvbiwgcGFzcyBgYXN5bmM6IHRydWVgIGFzIGFuIG9wdGlvbi4nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhIGNhbGxhYmxlIGZ1bmN0aW9uIHdoaWNoIHdpbGwgZXhlY3V0ZSB0aGUgZnVuY3Rpb25cbiAgICAvLyBjcmVhdGVkIGJ5IHRoZSBzb3VyY2UtY29kZSwgd2l0aCB0aGUgcGFzc2VkIGRhdGEgYXMgbG9jYWxzXG4gICAgLy8gQWRkcyBhIGxvY2FsIGBpbmNsdWRlYCBmdW5jdGlvbiB3aGljaCBhbGxvd3MgZnVsbCByZWN1cnNpdmUgaW5jbHVkZVxuICAgIHZhciByZXR1cm5lZEZuID0gb3B0cy5jbGllbnQgPyBmbiA6IGZ1bmN0aW9uIGFub255bW91cyhkYXRhKSB7XG4gICAgICB2YXIgaW5jbHVkZSA9IGZ1bmN0aW9uIChwYXRoLCBpbmNsdWRlRGF0YSkge1xuICAgICAgICB2YXIgZCA9IHV0aWxzLnNoYWxsb3dDb3B5KHt9LCBkYXRhKTtcbiAgICAgICAgaWYgKGluY2x1ZGVEYXRhKSB7XG4gICAgICAgICAgZCA9IHV0aWxzLnNoYWxsb3dDb3B5KGQsIGluY2x1ZGVEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5jbHVkZUZpbGUocGF0aCwgb3B0cykoZCk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KG9wdHMuY29udGV4dCwgW2RhdGEgfHwge30sIGVzY2FwZUZuLCBpbmNsdWRlLCByZXRocm93XSk7XG4gICAgfTtcbiAgICBpZiAob3B0cy5maWxlbmFtZSAmJiB0eXBlb2YgT2JqZWN0LmRlZmluZVByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgZmlsZW5hbWUgPSBvcHRzLmZpbGVuYW1lO1xuICAgICAgdmFyIGJhc2VuYW1lID0gcGF0aC5iYXNlbmFtZShmaWxlbmFtZSwgcGF0aC5leHRuYW1lKGZpbGVuYW1lKSk7XG4gICAgICB0cnkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmV0dXJuZWRGbiwgJ25hbWUnLCB7XG4gICAgICAgICAgdmFsdWU6IGJhc2VuYW1lLFxuICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7LyogaWdub3JlICovfVxuICAgIH1cbiAgICByZXR1cm4gcmV0dXJuZWRGbjtcbiAgfSxcblxuICBnZW5lcmF0ZVNvdXJjZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRzID0gdGhpcy5vcHRzO1xuXG4gICAgaWYgKG9wdHMucm1XaGl0ZXNwYWNlKSB7XG4gICAgICAvLyBIYXZlIHRvIHVzZSB0d28gc2VwYXJhdGUgcmVwbGFjZSBoZXJlIGFzIGBeYCBhbmQgYCRgIG9wZXJhdG9ycyBkb24ndFxuICAgICAgLy8gd29yayB3ZWxsIHdpdGggYFxccmAgYW5kIGVtcHR5IGxpbmVzIGRvbid0IHdvcmsgd2VsbCB3aXRoIHRoZSBgbWAgZmxhZy5cbiAgICAgIHRoaXMudGVtcGxhdGVUZXh0ID1cbiAgICAgICAgdGhpcy50ZW1wbGF0ZVRleHQucmVwbGFjZSgvW1xcclxcbl0rL2csICdcXG4nKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpO1xuICAgIH1cblxuICAgIC8vIFNsdXJwIHNwYWNlcyBhbmQgdGFicyBiZWZvcmUgPCVfIGFuZCBhZnRlciBfJT5cbiAgICB0aGlzLnRlbXBsYXRlVGV4dCA9XG4gICAgICB0aGlzLnRlbXBsYXRlVGV4dC5yZXBsYWNlKC9bIFxcdF0qPCVfL2dtLCAnPCVfJykucmVwbGFjZSgvXyU+WyBcXHRdKi9nbSwgJ18lPicpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBtYXRjaGVzID0gdGhpcy5wYXJzZVRlbXBsYXRlVGV4dCgpO1xuICAgIHZhciBkID0gdGhpcy5vcHRzLmRlbGltaXRlcjtcbiAgICB2YXIgbyA9IHRoaXMub3B0cy5vcGVuRGVsaW1pdGVyO1xuICAgIHZhciBjID0gdGhpcy5vcHRzLmNsb3NlRGVsaW1pdGVyO1xuXG4gICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGgpIHtcbiAgICAgIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbiAobGluZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGNsb3Npbmc7XG4gICAgICAgIC8vIElmIHRoaXMgaXMgYW4gb3BlbmluZyB0YWcsIGNoZWNrIGZvciBjbG9zaW5nIHRhZ3NcbiAgICAgICAgLy8gRklYTUU6IE1heSBlbmQgdXAgd2l0aCBzb21lIGZhbHNlIHBvc2l0aXZlcyBoZXJlXG4gICAgICAgIC8vIEJldHRlciB0byBzdG9yZSBtb2RlcyBhcyBrL3Ygd2l0aCBvcGVuRGVsaW1pdGVyICsgZGVsaW1pdGVyIGFzIGtleVxuICAgICAgICAvLyBUaGVuIHRoaXMgY2FuIHNpbXBseSBjaGVjayBhZ2FpbnN0IHRoZSBtYXBcbiAgICAgICAgaWYgKCBsaW5lLmluZGV4T2YobyArIGQpID09PSAwICAgICAgICAvLyBJZiBpdCBpcyBhIHRhZ1xuICAgICAgICAgICYmIGxpbmUuaW5kZXhPZihvICsgZCArIGQpICE9PSAwKSB7IC8vIGFuZCBpcyBub3QgZXNjYXBlZFxuICAgICAgICAgIGNsb3NpbmcgPSBtYXRjaGVzW2luZGV4ICsgMl07XG4gICAgICAgICAgaWYgKCEoY2xvc2luZyA9PSBkICsgYyB8fCBjbG9zaW5nID09ICctJyArIGQgKyBjIHx8IGNsb3NpbmcgPT0gJ18nICsgZCArIGMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIG1hdGNoaW5nIGNsb3NlIHRhZyBmb3IgXCInICsgbGluZSArICdcIi4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5zY2FuTGluZShsaW5lKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICB9LFxuXG4gIHBhcnNlVGVtcGxhdGVUZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0ciA9IHRoaXMudGVtcGxhdGVUZXh0O1xuICAgIHZhciBwYXQgPSB0aGlzLnJlZ2V4O1xuICAgIHZhciByZXN1bHQgPSBwYXQuZXhlYyhzdHIpO1xuICAgIHZhciBhcnIgPSBbXTtcbiAgICB2YXIgZmlyc3RQb3M7XG5cbiAgICB3aGlsZSAocmVzdWx0KSB7XG4gICAgICBmaXJzdFBvcyA9IHJlc3VsdC5pbmRleDtcblxuICAgICAgaWYgKGZpcnN0UG9zICE9PSAwKSB7XG4gICAgICAgIGFyci5wdXNoKHN0ci5zdWJzdHJpbmcoMCwgZmlyc3RQb3MpKTtcbiAgICAgICAgc3RyID0gc3RyLnNsaWNlKGZpcnN0UG9zKTtcbiAgICAgIH1cblxuICAgICAgYXJyLnB1c2gocmVzdWx0WzBdKTtcbiAgICAgIHN0ciA9IHN0ci5zbGljZShyZXN1bHRbMF0ubGVuZ3RoKTtcbiAgICAgIHJlc3VsdCA9IHBhdC5leGVjKHN0cik7XG4gICAgfVxuXG4gICAgaWYgKHN0cikge1xuICAgICAgYXJyLnB1c2goc3RyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyO1xuICB9LFxuXG4gIF9hZGRPdXRwdXQ6IGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgaWYgKHRoaXMudHJ1bmNhdGUpIHtcbiAgICAgIC8vIE9ubHkgcmVwbGFjZSBzaW5nbGUgbGVhZGluZyBsaW5lYnJlYWsgaW4gdGhlIGxpbmUgYWZ0ZXJcbiAgICAgIC8vIC0lPiB0YWcgLS0gdGhpcyBpcyB0aGUgc2luZ2xlLCB0cmFpbGluZyBsaW5lYnJlYWtcbiAgICAgIC8vIGFmdGVyIHRoZSB0YWcgdGhhdCB0aGUgdHJ1bmNhdGlvbiBtb2RlIHJlcGxhY2VzXG4gICAgICAvLyBIYW5kbGUgV2luIC8gVW5peCAvIG9sZCBNYWMgbGluZWJyZWFrcyAtLSBkbyB0aGUgXFxyXFxuXG4gICAgICAvLyBjb21ibyBmaXJzdCBpbiB0aGUgcmVnZXgtb3JcbiAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL14oPzpcXHJcXG58XFxyfFxcbikvLCAnJyk7XG4gICAgICB0aGlzLnRydW5jYXRlID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICghbGluZSkge1xuICAgICAgcmV0dXJuIGxpbmU7XG4gICAgfVxuXG4gICAgLy8gUHJlc2VydmUgbGl0ZXJhbCBzbGFzaGVzXG4gICAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKTtcblxuICAgIC8vIENvbnZlcnQgbGluZWJyZWFrc1xuICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKTtcbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJyk7XG5cbiAgICAvLyBFc2NhcGUgZG91YmxlLXF1b3Rlc1xuICAgIC8vIC0gdGhpcyB3aWxsIGJlIHRoZSBkZWxpbWl0ZXIgZHVyaW5nIGV4ZWN1dGlvblxuICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKTtcbiAgICB0aGlzLnNvdXJjZSArPSAnICAgIDsgX19hcHBlbmQoXCInICsgbGluZSArICdcIiknICsgJ1xcbic7XG4gIH0sXG5cbiAgc2NhbkxpbmU6IGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkID0gdGhpcy5vcHRzLmRlbGltaXRlcjtcbiAgICB2YXIgbyA9IHRoaXMub3B0cy5vcGVuRGVsaW1pdGVyO1xuICAgIHZhciBjID0gdGhpcy5vcHRzLmNsb3NlRGVsaW1pdGVyO1xuICAgIHZhciBuZXdMaW5lQ291bnQgPSAwO1xuXG4gICAgbmV3TGluZUNvdW50ID0gKGxpbmUuc3BsaXQoJ1xcbicpLmxlbmd0aCAtIDEpO1xuXG4gICAgc3dpdGNoIChsaW5lKSB7XG4gICAgY2FzZSBvICsgZDpcbiAgICBjYXNlIG8gKyBkICsgJ18nOlxuICAgICAgdGhpcy5tb2RlID0gVGVtcGxhdGUubW9kZXMuRVZBTDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbyArIGQgKyAnPSc6XG4gICAgICB0aGlzLm1vZGUgPSBUZW1wbGF0ZS5tb2Rlcy5FU0NBUEVEO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBvICsgZCArICctJzpcbiAgICAgIHRoaXMubW9kZSA9IFRlbXBsYXRlLm1vZGVzLlJBVztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbyArIGQgKyAnIyc6XG4gICAgICB0aGlzLm1vZGUgPSBUZW1wbGF0ZS5tb2Rlcy5DT01NRU5UO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBvICsgZCArIGQ6XG4gICAgICB0aGlzLm1vZGUgPSBUZW1wbGF0ZS5tb2Rlcy5MSVRFUkFMO1xuICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKFwiJyArIGxpbmUucmVwbGFjZShvICsgZCArIGQsIG8gKyBkKSArICdcIiknICsgJ1xcbic7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGQgKyBkICsgYzpcbiAgICAgIHRoaXMubW9kZSA9IFRlbXBsYXRlLm1vZGVzLkxJVEVSQUw7XG4gICAgICB0aGlzLnNvdXJjZSArPSAnICAgIDsgX19hcHBlbmQoXCInICsgbGluZS5yZXBsYWNlKGQgKyBkICsgYywgZCArIGMpICsgJ1wiKScgKyAnXFxuJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgZCArIGM6XG4gICAgY2FzZSAnLScgKyBkICsgYzpcbiAgICBjYXNlICdfJyArIGQgKyBjOlxuICAgICAgaWYgKHRoaXMubW9kZSA9PSBUZW1wbGF0ZS5tb2Rlcy5MSVRFUkFMKSB7XG4gICAgICAgIHRoaXMuX2FkZE91dHB1dChsaW5lKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tb2RlID0gbnVsbDtcbiAgICAgIHRoaXMudHJ1bmNhdGUgPSBsaW5lLmluZGV4T2YoJy0nKSA9PT0gMCB8fCBsaW5lLmluZGV4T2YoJ18nKSA9PT0gMDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBJbiBzY3JpcHQgbW9kZSwgZGVwZW5kcyBvbiB0eXBlIG9mIHRhZ1xuICAgICAgaWYgKHRoaXMubW9kZSkge1xuICAgICAgICAvLyBJZiAnLy8nIGlzIGZvdW5kIHdpdGhvdXQgYSBsaW5lIGJyZWFrLCBhZGQgYSBsaW5lIGJyZWFrLlxuICAgICAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLkVWQUw6XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuRVNDQVBFRDpcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5SQVc6XG4gICAgICAgICAgaWYgKGxpbmUubGFzdEluZGV4T2YoJy8vJykgPiBsaW5lLmxhc3RJbmRleE9mKCdcXG4nKSkge1xuICAgICAgICAgICAgbGluZSArPSAnXFxuJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgICAgLy8gSnVzdCBleGVjdXRpbmcgY29kZVxuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLkVWQUw6XG4gICAgICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7ICcgKyBsaW5lICsgJ1xcbic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgLy8gRXhlYywgZXNjLCBhbmQgb3V0cHV0XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuRVNDQVBFRDpcbiAgICAgICAgICB0aGlzLnNvdXJjZSArPSAnICAgIDsgX19hcHBlbmQoZXNjYXBlRm4oJyArIHN0cmlwU2VtaShsaW5lKSArICcpKScgKyAnXFxuJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICAvLyBFeGVjIGFuZCBvdXRwdXRcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5SQVc6XG4gICAgICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKCcgKyBzdHJpcFNlbWkobGluZSkgKyAnKScgKyAnXFxuJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5DT01NRU5UOlxuICAgICAgICAgIC8vIERvIG5vdGhpbmdcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICAvLyBMaXRlcmFsIDwlJSBtb2RlLCBhcHBlbmQgYXMgcmF3IG91dHB1dFxuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLkxJVEVSQUw6XG4gICAgICAgICAgdGhpcy5fYWRkT3V0cHV0KGxpbmUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBJbiBzdHJpbmcgbW9kZSwganVzdCBhZGQgdGhlIG91dHB1dFxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX2FkZE91dHB1dChsaW5lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2VsZi5vcHRzLmNvbXBpbGVEZWJ1ZyAmJiBuZXdMaW5lQ291bnQpIHtcbiAgICAgIHRoaXMuY3VycmVudExpbmUgKz0gbmV3TGluZUNvdW50O1xuICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fbGluZSA9ICcgKyB0aGlzLmN1cnJlbnRMaW5lICsgJ1xcbic7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEVzY2FwZSBjaGFyYWN0ZXJzIHJlc2VydmVkIGluIFhNTC5cbiAqXG4gKiBUaGlzIGlzIHNpbXBseSBhbiBleHBvcnQgb2Yge0BsaW5rIG1vZHVsZTp1dGlscy5lc2NhcGVYTUx9LlxuICpcbiAqIElmIGBtYXJrdXBgIGlzIGB1bmRlZmluZWRgIG9yIGBudWxsYCwgdGhlIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWFya3VwIElucHV0IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSBFc2NhcGVkIHN0cmluZ1xuICogQHB1YmxpY1xuICogQGZ1bmNcbiAqICovXG5leHBvcnRzLmVzY2FwZVhNTCA9IHV0aWxzLmVzY2FwZVhNTDtcblxuLyoqXG4gKiBFeHByZXNzLmpzIHN1cHBvcnQuXG4gKlxuICogVGhpcyBpcyBhbiBhbGlhcyBmb3Ige0BsaW5rIG1vZHVsZTplanMucmVuZGVyRmlsZX0sIGluIG9yZGVyIHRvIHN1cHBvcnRcbiAqIEV4cHJlc3MuanMgb3V0LW9mLXRoZS1ib3guXG4gKlxuICogQGZ1bmNcbiAqL1xuXG5leHBvcnRzLl9fZXhwcmVzcyA9IGV4cG9ydHMucmVuZGVyRmlsZTtcblxuLyoqXG4gKiBWZXJzaW9uIG9mIEVKUy5cbiAqXG4gKiBAcmVhZG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy5WRVJTSU9OID0gX1ZFUlNJT05fU1RSSU5HO1xuXG4vKipcbiAqIE5hbWUgZm9yIGRldGVjdGlvbiBvZiBFSlMuXG4gKlxuICogQHJlYWRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMubmFtZSA9IF9OQU1FO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbmlmICh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy5lanMgPSBleHBvcnRzO1xufVxuIiwiLypcbiAqIEVKUyBFbWJlZGRlZCBKYXZhU2NyaXB0IHRlbXBsYXRlc1xuICogQ29weXJpZ2h0IDIxMTIgTWF0dGhldyBFZXJuaXNzZSAobWRlQGZsZWVnaXgub3JnKVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuKi9cblxuLyoqXG4gKiBQcml2YXRlIHV0aWxpdHkgZnVuY3Rpb25zXG4gKiBAbW9kdWxlIHV0aWxzXG4gKiBAcHJpdmF0ZVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHJlZ0V4cENoYXJzID0gL1t8XFxcXHt9KClbXFxdXiQrKj8uXS9nO1xuXG4vKipcbiAqIEVzY2FwZSBjaGFyYWN0ZXJzIHJlc2VydmVkIGluIHJlZ3VsYXIgZXhwcmVzc2lvbnMuXG4gKlxuICogSWYgYHN0cmluZ2AgaXMgYHVuZGVmaW5lZGAgb3IgYG51bGxgLCB0aGUgZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgSW5wdXQgc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9IEVzY2FwZWQgc3RyaW5nXG4gKiBAc3RhdGljXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnRzLmVzY2FwZVJlZ0V4cENoYXJzID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKCFzdHJpbmcpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVnRXhwQ2hhcnMsICdcXFxcJCYnKTtcbn07XG5cbnZhciBfRU5DT0RFX0hUTUxfUlVMRVMgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJiMzNDsnLFxuICBcIidcIjogJyYjMzk7J1xufTtcbnZhciBfTUFUQ0hfSFRNTCA9IC9bJjw+J1wiXS9nO1xuXG5mdW5jdGlvbiBlbmNvZGVfY2hhcihjKSB7XG4gIHJldHVybiBfRU5DT0RFX0hUTUxfUlVMRVNbY10gfHwgYztcbn1cblxuLyoqXG4gKiBTdHJpbmdpZmllZCB2ZXJzaW9uIG9mIGNvbnN0YW50cyB1c2VkIGJ5IHtAbGluayBtb2R1bGU6dXRpbHMuZXNjYXBlWE1MfS5cbiAqXG4gKiBJdCBpcyB1c2VkIGluIHRoZSBwcm9jZXNzIG9mIGdlbmVyYXRpbmcge0BsaW5rIENsaWVudEZ1bmN0aW9ufXMuXG4gKlxuICogQHJlYWRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG5cbnZhciBlc2NhcGVGdW5jU3RyID1cbiAgJ3ZhciBfRU5DT0RFX0hUTUxfUlVMRVMgPSB7XFxuJ1xuKyAnICAgICAgXCImXCI6IFwiJmFtcDtcIlxcbidcbisgJyAgICAsIFwiPFwiOiBcIiZsdDtcIlxcbidcbisgJyAgICAsIFwiPlwiOiBcIiZndDtcIlxcbidcbisgJyAgICAsIFxcJ1wiXFwnOiBcIiYjMzQ7XCJcXG4nXG4rICcgICAgLCBcIlxcJ1wiOiBcIiYjMzk7XCJcXG4nXG4rICcgICAgfVxcbidcbisgJyAgLCBfTUFUQ0hfSFRNTCA9IC9bJjw+XFwnXCJdL2c7XFxuJ1xuKyAnZnVuY3Rpb24gZW5jb2RlX2NoYXIoYykge1xcbidcbisgJyAgcmV0dXJuIF9FTkNPREVfSFRNTF9SVUxFU1tjXSB8fCBjO1xcbidcbisgJ307XFxuJztcblxuLyoqXG4gKiBFc2NhcGUgY2hhcmFjdGVycyByZXNlcnZlZCBpbiBYTUwuXG4gKlxuICogSWYgYG1hcmt1cGAgaXMgYHVuZGVmaW5lZGAgb3IgYG51bGxgLCB0aGUgZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkLlxuICpcbiAqIEBpbXBsZW1lbnRzIHtFc2NhcGVDYWxsYmFja31cbiAqIEBwYXJhbSB7U3RyaW5nfSBtYXJrdXAgSW5wdXQgc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9IEVzY2FwZWQgc3RyaW5nXG4gKiBAc3RhdGljXG4gKiBAcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuZXNjYXBlWE1MID0gZnVuY3Rpb24gKG1hcmt1cCkge1xuICByZXR1cm4gbWFya3VwID09IHVuZGVmaW5lZFxuICAgID8gJydcbiAgICA6IFN0cmluZyhtYXJrdXApXG4gICAgICAucmVwbGFjZShfTUFUQ0hfSFRNTCwgZW5jb2RlX2NoYXIpO1xufTtcbmV4cG9ydHMuZXNjYXBlWE1MLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcykgKyAnO1xcbicgKyBlc2NhcGVGdW5jU3RyO1xufTtcblxuLyoqXG4gKiBOYWl2ZSBjb3B5IG9mIHByb3BlcnRpZXMgZnJvbSBvbmUgb2JqZWN0IHRvIGFub3RoZXIuXG4gKiBEb2VzIG5vdCByZWN1cnNlIGludG8gbm9uLXNjYWxhciBwcm9wZXJ0aWVzXG4gKiBEb2VzIG5vdCBjaGVjayB0byBzZWUgaWYgdGhlIHByb3BlcnR5IGhhcyBhIHZhbHVlIGJlZm9yZSBjb3B5aW5nXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSB0byAgIERlc3RpbmF0aW9uIG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBmcm9tIFNvdXJjZSBvYmplY3RcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICBEZXN0aW5hdGlvbiBvYmplY3RcbiAqIEBzdGF0aWNcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydHMuc2hhbGxvd0NvcHkgPSBmdW5jdGlvbiAodG8sIGZyb20pIHtcbiAgZnJvbSA9IGZyb20gfHwge307XG4gIGZvciAodmFyIHAgaW4gZnJvbSkge1xuICAgIHRvW3BdID0gZnJvbVtwXTtcbiAgfVxuICByZXR1cm4gdG87XG59O1xuXG4vKipcbiAqIE5haXZlIGNvcHkgb2YgYSBsaXN0IG9mIGtleSBuYW1lcywgZnJvbSBvbmUgb2JqZWN0IHRvIGFub3RoZXIuXG4gKiBPbmx5IGNvcGllcyBwcm9wZXJ0eSBpZiBpdCBpcyBhY3R1YWxseSBkZWZpbmVkXG4gKiBEb2VzIG5vdCByZWN1cnNlIGludG8gbm9uLXNjYWxhciBwcm9wZXJ0aWVzXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSB0byAgIERlc3RpbmF0aW9uIG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBmcm9tIFNvdXJjZSBvYmplY3RcbiAqIEBwYXJhbSAge0FycmF5fSBsaXN0IExpc3Qgb2YgcHJvcGVydGllcyB0byBjb3B5XG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgRGVzdGluYXRpb24gb2JqZWN0XG4gKiBAc3RhdGljXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnRzLnNoYWxsb3dDb3B5RnJvbUxpc3QgPSBmdW5jdGlvbiAodG8sIGZyb20sIGxpc3QpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHAgPSBsaXN0W2ldO1xuICAgIGlmICh0eXBlb2YgZnJvbVtwXSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgdG9bcF0gPSBmcm9tW3BdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdG87XG59O1xuXG4vKipcbiAqIFNpbXBsZSBpbi1wcm9jZXNzIGNhY2hlIGltcGxlbWVudGF0aW9uLiBEb2VzIG5vdCBpbXBsZW1lbnQgbGltaXRzIG9mIGFueVxuICogc29ydC5cbiAqXG4gKiBAaW1wbGVtZW50cyB7Q2FjaGV9XG4gKiBAc3RhdGljXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnRzLmNhY2hlID0ge1xuICBfZGF0YToge30sXG4gIHNldDogZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgdGhpcy5fZGF0YVtrZXldID0gdmFsO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldO1xuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldO1xuICB9LFxuICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgfVxufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIGh5cGhlbiBjYXNlIHZhcmlhYmxlIGludG8gY2FtZWwgY2FzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIEh5cGhlbiBjYXNlIHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSBDYW1lbCBjYXNlIHN0cmluZ1xuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0cy5oeXBoZW5Ub0NhbWVsID0gZnVuY3Rpb24gKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLy1bYS16XS9nLCBmdW5jdGlvbiAobWF0Y2gpIHsgcmV0dXJuIG1hdGNoWzFdLnRvVXBwZXJDYXNlKCk7IH0pO1xufTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gbW9kdWxlWydkZWZhdWx0J10gOlxuXHRcdCgpID0+IG1vZHVsZTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=