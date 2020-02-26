'use strict';

/**
 * ES6 Promise utility functions that mimic Q promise semantics.
 * 
 * @module lib/promise
 */

/**
 * new Q() semantics
 *
 * @param {Object} value - The value to resolve with
 * 
 * @returns {Promise} A promise that is resolved with the value
 */
module.exports = function(value) {
    return Promise.resolve(value);
};

/**
 * Q timeout semantics
 *
 * @param {integer} ms - The timeout in milliseconds
 * @param {Object} value - The value to reject with
 * 
 * @returns {Promise} A promise that is rejected with the value after at least ms milliseconds
 */
module.exports.timeout = function(ms, value) {
    return new Promise((resolve, reject) => {
        setTimeout(reject.bind(null, value), ms);
    });
};

/**
 * Q delay semantics
 *
 * @param {integer} ms - The timeout in milliseconds
 * @param {Object} value - The value to resolve with
 * 
 * @returns {Promise} A promise that is resolved with the value after at least ms milliseconds
 */
module.exports.delay = function(ms, value) {
    return new Promise((resolve) => {
        setTimeout(resolve.bind(null, value), ms);
    });
};

/**
 * Q fcall semantics
 *
 * @param {Function} func - The function to call
 * @param {Array} args - The arguments to pass to the function
 * 
 * @returns {Promise} A promise that is resolved with the results of the function call
 * or rejected with any thrown exceptions
 */
module.exports.fcall = function(func, ...args) {
    return new Promise((resolve, reject) => {
        try {
            resolve(func.apply(null, args));
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Q nfcall semantics
 *
 * @param {Function} func - The Node style function to call
 * @param {Array} args - The arguments to pass to the function
 * 
 * @returns {Promise} A promise that is resolved with the results of the function call
 * or rejected with any thrown exceptions or returned errors
 */
module.exports.nfcall = function(func, ...args) {
    return new Promise((resolve, reject) => {
        args.push((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });

        try {
            func.apply(null, args);
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Alias of Promise.all
 */
module.exports.all = Promise.all;

/**
 * Alias of Promise.allSettled
 */
module.exports.allSettled = Promise.allSettled;

/**
 * Alias of Promise.race
 */
module.exports.race = Promise.race;

/**
 * Alias of Promise.reject
 */
module.exports.reject = Promise.reject;

/**
 * Alias of Promise.resolve
 */
module.exports.resolve = Promise.resolve;
