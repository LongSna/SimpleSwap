"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/err-code@2.0.3";
exports.ids = ["vendor-chunks/err-code@2.0.3"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/err-code@2.0.3/node_modules/err-code/index.js":
/*!**************************************************************************!*\
  !*** ./node_modules/.pnpm/err-code@2.0.3/node_modules/err-code/index.js ***!
  \**************************************************************************/
/***/ ((module) => {

eval("\n\nfunction assign(obj, props) {\n    for (const key in props) {\n        Object.defineProperty(obj, key, {\n            value: props[key],\n            enumerable: true,\n            configurable: true,\n        });\n    }\n\n    return obj;\n}\n\nfunction createError(err, code, props) {\n    if (!err || typeof err === 'string') {\n        throw new TypeError('Please pass an Error to err-code');\n    }\n\n    if (!props) {\n        props = {};\n    }\n\n    if (typeof code === 'object') {\n        props = code;\n        code = undefined;\n    }\n\n    if (code != null) {\n        props.code = code;\n    }\n\n    try {\n        return assign(err, props);\n    } catch (_) {\n        props.message = err.message;\n        props.stack = err.stack;\n\n        const ErrClass = function () {};\n\n        ErrClass.prototype = Object.create(Object.getPrototypeOf(err));\n\n        return assign(new ErrClass(), props);\n    }\n}\n\nmodule.exports = createError;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vZXJyLWNvZGVAMi4wLjMvbm9kZV9tb2R1bGVzL2Vyci1jb2RlL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL3NpbXBsZXN3YXAvLi9ub2RlX21vZHVsZXMvLnBucG0vZXJyLWNvZGVAMi4wLjMvbm9kZV9tb2R1bGVzL2Vyci1jb2RlL2luZGV4LmpzP2U3MTgiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBhc3NpZ24ob2JqLCBwcm9wcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgICAgICAgdmFsdWU6IHByb3BzW2tleV0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFcnJvcihlcnIsIGNvZGUsIHByb3BzKSB7XG4gICAgaWYgKCFlcnIgfHwgdHlwZW9mIGVyciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUGxlYXNlIHBhc3MgYW4gRXJyb3IgdG8gZXJyLWNvZGUnKTtcbiAgICB9XG5cbiAgICBpZiAoIXByb3BzKSB7XG4gICAgICAgIHByb3BzID0ge307XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjb2RlID09PSAnb2JqZWN0Jykge1xuICAgICAgICBwcm9wcyA9IGNvZGU7XG4gICAgICAgIGNvZGUgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgIT0gbnVsbCkge1xuICAgICAgICBwcm9wcy5jb2RlID0gY29kZTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXNzaWduKGVyciwgcHJvcHMpO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgcHJvcHMubWVzc2FnZSA9IGVyci5tZXNzYWdlO1xuICAgICAgICBwcm9wcy5zdGFjayA9IGVyci5zdGFjaztcblxuICAgICAgICBjb25zdCBFcnJDbGFzcyA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgICAgIEVyckNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKGVycikpO1xuXG4gICAgICAgIHJldHVybiBhc3NpZ24obmV3IEVyckNsYXNzKCksIHByb3BzKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRXJyb3I7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/err-code@2.0.3/node_modules/err-code/index.js\n");

/***/ })

};
;