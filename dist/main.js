'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var config = {
  driver: 'InfluxDB', // Graphite, InfluxDB
  format: 'plain', // Or JSON, only applies to Graphite driver
  types: ['memory', 'segment', 'console'], // memory, segment, console (the agent limits memory and segment to 15 second poll intervals)
  key: '__stats',
  segment: 30,
  baseStats: true,
  measureMemoryParse: true,
  usermap: { // use module.user in console to get userID for mapping. Defaults to username of Spawn1 if not defined
     '63760200931f7f6': 'Juicy',
  }
};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var util = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port;
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;
});
var util_1 = util.getArg;
var util_2 = util.urlParse;
var util_3 = util.urlGenerate;
var util_4 = util.normalize;
var util_5 = util.join;
var util_6 = util.isAbsolute;
var util_7 = util.relative;
var util_8 = util.toSetString;
var util_9 = util.fromSetString;
var util_10 = util.compareByOriginalPositions;
var util_11 = util.compareByGeneratedPositionsDeflated;
var util_12 = util.compareByGeneratedPositionsInflated;
var util_13 = util.parseSourceMapInput;
var util_14 = util.computeSourceURL;

var util$1 = /*#__PURE__*/Object.freeze({
  default: util,
  __moduleExports: util,
  getArg: util_1,
  urlParse: util_2,
  urlGenerate: util_3,
  normalize: util_4,
  join: util_5,
  isAbsolute: util_6,
  relative: util_7,
  toSetString: util_8,
  fromSetString: util_9,
  compareByOriginalPositions: util_10,
  compareByGeneratedPositionsDeflated: util_11,
  compareByGeneratedPositionsInflated: util_12,
  parseSourceMapInput: util_13,
  computeSourceURL: util_14
});

var binarySearch = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};
});
var binarySearch_1 = binarySearch.GREATEST_LOWER_BOUND;
var binarySearch_2 = binarySearch.LEAST_UPPER_BOUND;
var binarySearch_3 = binarySearch.search;

var binarySearch$1 = /*#__PURE__*/Object.freeze({
  default: binarySearch,
  __moduleExports: binarySearch,
  GREATEST_LOWER_BOUND: binarySearch_1,
  LEAST_UPPER_BOUND: binarySearch_2,
  search: binarySearch_3
});

var util$2 = ( util$1 && util ) || util$1;

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */


var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util$2.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util$2.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util$2.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

var ArraySet_1 = ArraySet;

var arraySet = {
	ArraySet: ArraySet_1
};

var arraySet$1 = /*#__PURE__*/Object.freeze({
  default: arraySet,
  __moduleExports: arraySet,
  ArraySet: ArraySet_1
});

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
var encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
var decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

var base64 = {
	encode: encode,
	decode: decode
};

var base64$1 = /*#__PURE__*/Object.freeze({
  default: base64,
  __moduleExports: base64,
  encode: encode,
  decode: decode
});

var base64$2 = ( base64$1 && base64 ) || base64$1;

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
var encode$1 = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64$2.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
var decode$1 = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64$2.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

var base64Vlq = {
	encode: encode$1,
	decode: decode$1
};

var base64Vlq$1 = /*#__PURE__*/Object.freeze({
  default: base64Vlq,
  __moduleExports: base64Vlq,
  encode: encode$1,
  decode: decode$1
});

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
var quickSort_1 = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

var quickSort = {
	quickSort: quickSort_1
};

var quickSort$1 = /*#__PURE__*/Object.freeze({
  default: quickSort,
  __moduleExports: quickSort,
  quickSort: quickSort_1
});

var binarySearch$2 = ( binarySearch$1 && binarySearch ) || binarySearch$1;

var require$$0 = ( arraySet$1 && arraySet ) || arraySet$1;

var base64VLQ = ( base64Vlq$1 && base64Vlq ) || base64Vlq$1;

var require$$1 = ( quickSort$1 && quickSort ) || quickSort$1;

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */



var ArraySet$1 = require$$0.ArraySet;

var quickSort$2 = require$$1.quickSort;

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util$2.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
};

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util$2.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util$2.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util$2.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util$2.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util$2.compareByOriginalPositions,
                                  binarySearch$2.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util$2.getArg(mapping, 'generatedLine', null),
            column: util$2.getArg(mapping, 'generatedColumn', null),
            lastColumn: util$2.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util$2.getArg(mapping, 'generatedLine', null),
            column: util$2.getArg(mapping, 'generatedColumn', null),
            lastColumn: util$2.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

var SourceMapConsumer_1 = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util$2.parseSourceMapInput(aSourceMap);
  }

  var version = util$2.getArg(sourceMap, 'version');
  var sources = util$2.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util$2.getArg(sourceMap, 'names', []);
  var sourceRoot = util$2.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util$2.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util$2.getArg(sourceMap, 'mappings');
  var file = util$2.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util$2.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util$2.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util$2.isAbsolute(sourceRoot) && util$2.isAbsolute(source)
        ? util$2.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet$1.fromArray(names.map(String), true);
  this._sources = ArraySet$1.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util$2.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util$2.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet$1.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet$1.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util$2.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort$2(smc.__originalMappings, util$2.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort$2(generatedMappings, util$2.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort$2(originalMappings, util$2.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch$2.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util$2.getArg(aArgs, 'line'),
      generatedColumn: util$2.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util$2.compareByGeneratedPositionsDeflated,
      util$2.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util$2.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util$2.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util$2.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util$2.getArg(mapping, 'originalLine', null),
          column: util$2.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util$2.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util$2.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util$2.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util$2.getArg(aArgs, 'line'),
      originalColumn: util$2.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util$2.compareByOriginalPositions,
      util$2.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util$2.getArg(mapping, 'generatedLine', null),
          column: util$2.getArg(mapping, 'generatedColumn', null),
          lastColumn: util$2.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util$2.parseSourceMapInput(aSourceMap);
  }

  var version = util$2.getArg(sourceMap, 'version');
  var sections = util$2.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet$1();
  this._names = new ArraySet$1();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util$2.getArg(s, 'offset');
    var offsetLine = util$2.getArg(offset, 'line');
    var offsetColumn = util$2.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util$2.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util$2.getArg(aArgs, 'line'),
      generatedColumn: util$2.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch$2.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util$2.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util$2.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort$2(this.__generatedMappings, util$2.compareByGeneratedPositionsDeflated);
    quickSort$2(this.__originalMappings, util$2.compareByOriginalPositions);
  };

var stackTrace = createCommonjsModule(function (module, exports) {
exports.get = function(belowFn) {
  var oldLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;

  var dummyObject = {};

  var v8Handler = Error.prepareStackTrace;
  Error.prepareStackTrace = function(dummyObject, v8StackTrace) {
    return v8StackTrace;
  };
  Error.captureStackTrace(dummyObject, belowFn || exports.get);

  var v8StackTrace = dummyObject.stack;
  Error.prepareStackTrace = v8Handler;
  Error.stackTraceLimit = oldLimit;

  return v8StackTrace;
};

exports.parse = function(err) {
  if (!err.stack) {
    return [];
  }

  var self = this;
  var lines = err.stack.split('\n').slice(1);

  return lines
    .map(function(line) {
      if (line.match(/^\s*[-]{4,}$/)) {
        return self._createParsedCallSite({
          fileName: line,
          lineNumber: null,
          functionName: null,
          typeName: null,
          methodName: null,
          columnNumber: null,
          'native': null,
        });
      }

      var lineMatch = line.match(/at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/);
      if (!lineMatch) {
        return;
      }

      var object = null;
      var method = null;
      var functionName = null;
      var typeName = null;
      var methodName = null;
      var isNative = (lineMatch[5] === 'native');

      if (lineMatch[1]) {
        functionName = lineMatch[1];
        var methodStart = functionName.lastIndexOf('.');
        if (functionName[methodStart-1] == '.')
          methodStart--;
        if (methodStart > 0) {
          object = functionName.substr(0, methodStart);
          method = functionName.substr(methodStart + 1);
          var objectEnd = object.indexOf('.Module');
          if (objectEnd > 0) {
            functionName = functionName.substr(objectEnd + 1);
            object = object.substr(0, objectEnd);
          }
        }
        typeName = null;
      }

      if (method) {
        typeName = object;
        methodName = method;
      }

      if (method === '<anonymous>') {
        methodName = null;
        functionName = null;
      }

      var properties = {
        fileName: lineMatch[2] || null,
        lineNumber: parseInt(lineMatch[3], 10) || null,
        functionName: functionName,
        typeName: typeName,
        methodName: methodName,
        columnNumber: parseInt(lineMatch[4], 10) || null,
        'native': isNative,
      };

      return self._createParsedCallSite(properties);
    })
    .filter(function(callSite) {
      return !!callSite;
    });
};

function CallSite(properties) {
  for (var property in properties) {
    this[property] = properties[property];
  }
}

var strProperties = [
  'this',
  'typeName',
  'functionName',
  'methodName',
  'fileName',
  'lineNumber',
  'columnNumber',
  'function',
  'evalOrigin'
];
var boolProperties = [
  'topLevel',
  'eval',
  'native',
  'constructor'
];
strProperties.forEach(function (property) {
  CallSite.prototype[property] = null;
  CallSite.prototype['get' + property[0].toUpperCase() + property.substr(1)] = function () {
    return this[property];
  };
});
boolProperties.forEach(function (property) {
  CallSite.prototype[property] = false;
  CallSite.prototype['is' + property[0].toUpperCase() + property.substr(1)] = function () {
    return this[property];
  };
});

exports._createParsedCallSite = function(properties) {
  return new CallSite(properties);
};
});
var stackTrace_1 = stackTrace.get;
var stackTrace_2 = stackTrace.parse;
var stackTrace_3 = stackTrace._createParsedCallSite;

// Original idea taken from https://github.com/screepers/screeps-typescript-starter/blob/master/src/utils/ErrorMapper.ts

class ErrorMapper {
  static get consumer () {
    if (!this._consumer) {
      this._consumer = new SourceMapConsumer_1(require(`${module.name}.js.map`));
    }
    return this._consumer
  }
  static map (error) {
    this.cache = this.cache || {};
    if (this.cache.hasOwnProperty(error.stack)) {
      return this.cache[error.stack]
    }
    let trace = stackTrace.parse(error);
    let ret = trace.map(cs => {
      let name = cs.getFunctionName();
      let source = cs.getFileName();
      let line = cs.getLineNumber() || 1;
      let column = cs.getColumnNumber();
      let pos = this.consumer.originalPositionFor({ line, column });
      line = pos.line || line;
      column = pos.column || column;
      name = pos.name || name;
      source = pos.source || source || '';
      let trace = `${source}:${line}:${column}`;
      if (name) {
        trace = `${name} (${trace})`;
      }
      return `    at ${trace}`
    }).join('\n');
    ret = `Error: ${error.message}\n${ret}`;
    this.cache[error.stack] = ret;
    return ret
  }
}

// Use for HTML styling (Colors loosely match screeps_console)

const LogLevel = {
  SILLY: -1,
  DEBUG: 0,
  INFO: 1,
  ALERT: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
};

const styles = {
  default: 'color: white; background-color: black',
  [LogLevel.SILLY]: 'color: darkblue',
  [LogLevel.DEBUG]: 'color: darkblue',
  [LogLevel.INFO]: 'color: darkgreen',
  [LogLevel.ALERT]: 'color: cyan',
  [LogLevel.WARN]: 'color: white',
  [LogLevel.ERROR]: 'color: red',
  [LogLevel.FATAL]: 'color: yellow; background-color: red'
};

let y = 0;
let tick = 0;

class Logger {
  static get LogLevel () {
    return LogLevel
  }
  constructor (prefix = '') {
    this.prefix = prefix;
    this.level = Memory.loglevel && Memory.loglevel.default || LogLevel.INFO;
    this._log = console.log; // This allows for console hooking
  }
  hook (level = 'info') {
    Object.defineProperty(console, 'log', {
      value: (...a) => {
        this[level](a.join(' '));
      }
    });
  }
  unhook () {
    Object.defineProperty(console, 'log', {
      value: this._log
    });
  }
  log (level, message) {
    if (level >= this.level) {
      if (typeof message === 'function') {
        message = message();
      }
      let style = styles[level] || styles.default;
      this._log(`<log severity="${level}" style="${style}">[${level}] ${this.prefix} ${message}</log>`);
      // this.vlog(level, `[${level}] ${this.prefix} ${message}`)
    }
  }
  vlog (level, message) {
    if (tick !== Game.time) y = 0.2;
    tick = Game.time;
    let style = styles[level] || styles.default;
    let color = style.match(/color: ([a-z]*)/)[1];
    let vis = new RoomVisual();
    try {
      vis.text(message, 0, y, { align: 'left', color });
    } catch (e) {}
    y += 0.8;
  }
  debug (message) {
    this.log(LogLevel.DEBUG, message);
  }
  info (message) {
    this.log(LogLevel.INFO, message);
  }
  warn (message) {
    this.log(LogLevel.WARN, message);
  }
  alert (message) {
    this.log(LogLevel.ALERT, message);
  }
  error (message) {
    if(message instanceof Error) {
      message = ErrorMapper.map(message);
    }
    this.log(LogLevel.ERROR, message);
  }
  fatal (message) {
    this.log(LogLevel.FATAL, message);
  }
}

/* USAGE:
Configure CONFIG below
At VERY top of main.js:
> const stats = require('stats')

At top of loop():
> stats.reset()

At bottom of loop():
> stats.commit()

to add a stat, just call
> stats.addSimpleStat(key,value)
or more advanced
> stats.addStat('scheduler',{ queue: 1 },{ count: 5, max: 5, min: 2, amount: 3 })

Tags (second argument) should not contain data that varies a lot, for example, don't
put stuff like object ids in tags doing so ends up causing massive performance hits
as the tag indexes get too large too quickly. Good data for tags is more static stuff
such as roomName, sectorName, etc, low overall spread.

*/
const CONFIG = {
  driver: 'Graphite',
  types: ['memory'], // memory, segment, console
  key: '__stats',
  ticksToKeep: 20,
  segmentBase: 30,
  baseStats: true,
  measureMemoryParse: true,
  divider: ';',  // "\n",
  usermap: { // use module.user in console to get userID for mapping.
    '63760200931f7f6': 'Juicy',
  }
};

class InfluxDB {
  get mem () {
    Memory[this.opts.key] = Memory[this.opts.key] || { index: 0, last: 0 };
    return Memory[this.opts.key]
  }
  register () {}
  pretick () {
    this.reset();
  }
  posttick () {
    this.commit();
  }
  constructor (opts = {}) {
    this.opts = Object.assign(CONFIG, opts);
    this.log = new Logger('stats');
    global.influxdb = this;
    this.reset();
    this.startTick = Game.time;
    this.shard = (Game.shard && Game.shard.name) || 'shard3';
    this.user = _.find(Game.spawns, v => v).owner.username;
  }
  reset () {
    if (Game.time === this.startTick) return // Don't reset on new tick
    this.stats = [];
    this.cpuReset = Game.cpu.getUsed();

    if (!this.opts.measureMemoryParse) return
    let start = Game.cpu.getUsed();
    if (this.lastTime && global.LastMemory && Game.time === (this.lastTime + 1)) {
      delete global.Memory;
      global.Memory = global.LastMemory;
      RawMemory._parsed = global.LastMemory;
      this.log.info('Tick has same GID!');
    } else {
      global.LastMemory = RawMemory._parsed;
    }
    this.lastTime = Game.time;
    let end = Game.cpu.getUsed();
    let el = end - start;
    this.memoryParseTime = el;
    this.addStat('memory', {}, {
      parse: el,
      size: RawMemory.get().length
    });
    this.endReset = Game.cpu.getUsed();
    this.log.info(`Entry: ${this.cpuReset.toFixed(3)} - Exit: ${(this.endReset - this.cpuReset).toFixed(3)} - Mem: ${this.memoryParseTime.toFixed(3)} (${(RawMemory.get().length / 1024).toFixed(2)}kb)`);
  }
  addSimpleStat (name, value = 0) {
    this.addStat(name, {}, { value });
  }
  addStat (name, tags = {}, values = {}) {
    this.stats.push({ name, tags, values });
  }
  addBaseStats () {
    this.addStat('time', {}, {
      tick: Game.time,
      timestamp: Date.now(),
      duration: Memory.lastDur
    });
    this.addStat('gcl', {}, {
      level: Game.gcl.level,
      progress: Game.gcl.progress,
      progressTotal: Game.gcl.progressTotal,
      progressPercent: (Game.gcl.progress / Game.gcl.progressTotal) * 100
    });
    this.addStat('market', {}, {
      credits: Game.market.credits
    });
    _.each(Game.rooms, room => {
      let { controller, storage, terminal } = room;
      if (!controller || !controller.my) return
      this.addStat('room', {
        room: room.name
      }, {
        level: controller.level,
        progress: controller.progress,
        progressTotal: controller.progressTotal,
        progressPercent: (controller.progress / controller.progressTotal) * 100,
        energyAvailable: room.energyAvailable,
        energyCapacityAvailable: room.energyCapacityAvailable
      });
      if (controller) {
        this.addStat('controller', {
          room: room.name
        }, {
          level: controller.level,
          progress: controller.progress,
          progressTotal: controller.progressTotal,
          progressPercent: (controller.progress / controller.progressTotal) * 100
        });
      }
      if (storage) {
        this.addStat('storage', {
          room: room.name
        }, storage.store);
      }
      if (terminal) {
        this.addStat('terminal', {
          room: room.name
        }, terminal.store);
      }
    });
    if (typeof Game.cpu.getHeapStatistics === 'function') {
      this.addStat('heap', {}, Game.cpu.getHeapStatistics());
    }
    let used = Game.cpu.getUsed();
    this.addStat('cpu', {}, {
      bucket: Game.cpu.bucket,
      used: used,
      limit: Game.cpu.limit,
      start: this.cpuReset,
      percent: (used / Game.cpu.limit) * 100
    });
  }
  commit () {
    let start = Game.cpu.getUsed();
    if (this.opts.baseStats) this.addBaseStats();
    let stats = `text/${this.opts.driver.toLowerCase()}\n`;
    stats += `${Game.time}\n`;
    stats += `${Date.now()}\n`;
    let format = this[`format${this.opts.driver}`].bind(this);
    _.each(this.stats, (v, k) => {
      stats += format(v);
    });
    let end = Game.cpu.getUsed();
    stats += format({ name: 'stats', tags: {}, values: { count: this.stats.length, size: stats.length, cpu: end - start } });
    if (this.opts.types.includes('segment')) {
      RawMemory.segments[this.opts.segment] = stats;
    }
    if (this.opts.types.includes('memory')) {
      Memory[this.opts.key] = stats;
    }
    if (this.opts.types.includes('console')) {
      console.log('STATS;' + stats.replace(/\n/g, ';'));
    }
  }
  formatInfluxDB (stat) {
    let { name, tags, values } = stat;
    Object.assign(tags, { user: this.user, shard: this.shard });
    return `${name},${this.kv(tags)} ${this.kv(values)}\n`
  }
  formatGraphite (stat) {
    let { name, tags, values } = stat;
    if (!this.prefix) {
      this.prefix = `${this.user}`; // .${this.shard}`
    }
    let pre = [this.prefix, this.kv(tags, '.').join('.'), name].filter(v => v).join('.');
    return this.kv(values, ' ').map(v => `${pre}.${v}\n`).join('')
  }
  kv (obj, sep = '=') {
    return _.map(obj, (v, k) => `${k}${sep}${v}`)
  }
}

const driver = new InfluxDB(config);

var globals = {
  offset: Math.floor(Math.random() * 10),
  get memory () {
    Memory.__globals = Memory.__globals || {};
    return Memory.__globals
  },
  get meta () {
    return (this.memory.meta && this.memory.meta[this.id]) || {}
  },
  register () {
    this.init();
  },
  pretick () {
    this.tick();
  },
  posttick () {
    if (Game.time % 10 === this.offset) {
      this.cleanup();
    }
  },
  init () {
    this.memory.nextID = this.memory.nextID || 1;
    this.id = (this.memory.nextID++);
    this.memory.meta = this.memory.meta || {};
    this.memory.meta[this.id] = {
      id: this.id,
      init: Date.now(),
      firstTick: Game.time,
      dur: 0
    };
  },
  cleanup () {
    let keys = Object.keys(this.memory.meta);
    if (keys.length < 60) return
    keys.slice(0, -60).forEach(k => delete this.memory.meta[k]);
  },
  tick () {
    let now = Date.now();
    this.meta.lastRun = now;
    this.meta.lastTick = Game.time;
    this.meta.dur = Game.time - this.meta.firstTick;
    this.memory.lastID = this.id;

    if (this.statDriver) {
      this.statDriver.addStat('global', {}, this.meta);
    }
  }
};

var MemHack = {
  newGlobal: true,
  register () {
    this.doHack();
  },
  pretick () {
    if (this.newGlobal) {
      this.newGlobal = false;
      return // Skip hack on newGlobals since its already ran
    }
    this.doHack();
  },
  doHack () {
    let start = Game.cpu.getUsed();
    if (this.lastTime && this.memory && Game.time === (this.lastTime + 1)) {
      delete global.Memory;
      global.Memory = this.memory;
      RawMemory._parsed = this.memory;
      console.log('[1] Tick has same GID!');
    } else {
      this.memory = RawMemory._parsed;
    }
    this.lastTime = Game.time;
    let end = Game.cpu.getUsed();
    this.parseTime = end - start;
  }
};

/*
export default {
  register () {
    let start = Game.cpu.getUsed()
    Memory
    let end = Game.cpu.getUsed()
    this.parseTime = end - start
    this.memory = RawMemory._parsed
  }
  pretick () {
    delete global.Memory
    global.Memory = this.memory
  }
}
*/

var Traveler_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
class Traveler {
    /**
     * move creep to destination
     * @param creep
     * @param destination
     * @param options
     * @returns {number}
     */
    static travelTo(creep, destination, options = {}) {
        // uncomment if you would like to register hostile rooms entered
        // this.updateRoomStatus(creep.room);
        if (!destination) {
            return ERR_INVALID_ARGS;
        }
        if (creep.fatigue > 0) {
            Traveler.circle(creep.pos, "aqua", .3);
            return ERR_BUSY;
        }
        destination = this.normalizePos(destination);
        // manage case where creep is nearby destination
        let rangeToDestination = creep.pos.getRangeTo(destination);
        if (options.range && rangeToDestination <= options.range) {
            return OK;
        }
        else if (rangeToDestination <= 1) {
            if (rangeToDestination === 1 && !options.range) {
                let direction = creep.pos.getDirectionTo(destination);
                if (options.returnData) {
                    options.returnData.nextPos = destination;
                    options.returnData.path = direction.toString();
                }
                return creep.move(direction);
            }
            return OK;
        }
        // initialize data object
        if (!creep.memory._trav) {
            delete creep.memory._travel;
            creep.memory._trav = {};
        }
        let travelData = creep.memory._trav;
        let state = this.deserializeState(travelData, destination);
        // uncomment to visualize destination
        // this.circle(destination.pos, "orange");
        // check if creep is stuck
        if (this.isStuck(creep, state)) {
            state.stuckCount++;
            Traveler.circle(creep.pos, "magenta", state.stuckCount * .2);
        }
        else {
            state.stuckCount = 0;
        }
        // handle case where creep is stuck
        if (!options.stuckValue) {
            options.stuckValue = DEFAULT_STUCK_VALUE;
        }
        if (state.stuckCount >= options.stuckValue && Math.random() > .5) {
            options.ignoreCreeps = false;
            options.freshMatrix = true;
            delete travelData.path;
        }
        // TODO:handle case where creep moved by some other function, but destination is still the same
        // delete path cache if destination is different
        if (!this.samePos(state.destination, destination)) {
            if (options.movingTarget && state.destination.isNearTo(destination)) {
                travelData.path += state.destination.getDirectionTo(destination);
                state.destination = destination;
            }
            else {
                delete travelData.path;
            }
        }
        if (options.repath && Math.random() < options.repath) {
            // add some chance that you will find a new path randomly
            delete travelData.path;
        }
        // pathfinding
        let newPath = false;
        if (!travelData.path) {
            newPath = true;
            if (creep.spawning) {
                return ERR_BUSY;
            }
            state.destination = destination;
            let cpu = Game.cpu.getUsed();
            let ret = this.findTravelPath(creep.pos, destination, options);
            let cpuUsed = Game.cpu.getUsed() - cpu;
            state.cpu = _.round(cpuUsed + state.cpu);
            if (state.cpu > REPORT_CPU_THRESHOLD) {
                // see note at end of file for more info on this
                console.log(`TRAVELER: heavy cpu use: ${creep.name}, cpu: ${state.cpu} origin: ${creep.pos}, dest: ${destination}`);
            }
            let color = "orange";
            if (ret.incomplete) {
                // uncommenting this is a great way to diagnose creep behavior issues
                // console.log(`TRAVELER: incomplete path for ${creep.name}`);
                color = "red";
            }
            if (options.returnData) {
                options.returnData.pathfinderReturn = ret;
            }
            travelData.path = Traveler.serializePath(creep.pos, ret.path, color);
            state.stuckCount = 0;
        }
        this.serializeState(creep, destination, state, travelData);
        if (!travelData.path || travelData.path.length === 0) {
            return ERR_NO_PATH;
        }
        // consume path
        if (state.stuckCount === 0 && !newPath) {
            travelData.path = travelData.path.substr(1);
        }
        let nextDirection = parseInt(travelData.path[0], 10);
        if (options.returnData) {
            if (nextDirection) {
                let nextPos = Traveler.positionAtDirection(creep.pos, nextDirection);
                if (nextPos) {
                    options.returnData.nextPos = nextPos;
                }
            }
            options.returnData.state = state;
            options.returnData.path = travelData.path;
        }
        return creep.move(nextDirection);
    }
    /**
     * make position objects consistent so that either can be used as an argument
     * @param destination
     * @returns {any}
     */
    static normalizePos(destination) {
        if (!(destination instanceof RoomPosition)) {
            return destination.pos;
        }
        return destination;
    }
    /**
     * check if room should be avoided by findRoute algorithm
     * @param roomName
     * @returns {RoomMemory|number}
     */
    static checkAvoid(roomName) {
        return Memory.rooms && Memory.rooms[roomName] && Memory.rooms[roomName].avoid;
    }
    /**
     * check if a position is an exit
     * @param pos
     * @returns {boolean}
     */
    static isExit(pos) {
        return pos.x === 0 || pos.y === 0 || pos.x === 49 || pos.y === 49;
    }
    /**
     * check two coordinates match
     * @param pos1
     * @param pos2
     * @returns {boolean}
     */
    static sameCoord(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }
    /**
     * check if two positions match
     * @param pos1
     * @param pos2
     * @returns {boolean}
     */
    static samePos(pos1, pos2) {
        return this.sameCoord(pos1, pos2) && pos1.roomName === pos2.roomName;
    }
    /**
     * draw a circle at position
     * @param pos
     * @param color
     * @param opacity
     */
    static circle(pos, color, opacity) {
        new RoomVisual(pos.roomName).circle(pos, {
            radius: .45, fill: "transparent", stroke: color, strokeWidth: .15, opacity: opacity
        });
    }
    /**
     * update memory on whether a room should be avoided based on controller owner
     * @param room
     */
    static updateRoomStatus(room) {
        if (!room) {
            return;
        }
        if (room.controller) {
            if (room.controller.owner && !room.controller.my) {
                room.memory.avoid = 1;
            }
            else {
                delete room.memory.avoid;
            }
        }
    }
    /**
     * find a path from origin to destination
     * @param origin
     * @param destination
     * @param options
     * @returns {PathfinderReturn}
     */
    static findTravelPath(origin, destination, options = {}) {
        _.defaults(options, {
            ignoreCreeps: true,
            maxOps: DEFAULT_MAXOPS,
            range: 1,
        });
        if (options.movingTarget) {
            options.range = 0;
        }
        origin = this.normalizePos(origin);
        destination = this.normalizePos(destination);
        let originRoomName = origin.roomName;
        let destRoomName = destination.roomName;
        // check to see whether findRoute should be used
        let roomDistance = Game.map.getRoomLinearDistance(origin.roomName, destination.roomName);
        let allowedRooms = options.route;
        if (!allowedRooms && (options.useFindRoute || (options.useFindRoute === undefined && roomDistance > 2))) {
            let route = this.findRoute(origin.roomName, destination.roomName, options);
            if (route) {
                allowedRooms = route;
            }
        }
        let callback = (roomName) => {
            if (allowedRooms) {
                if (!allowedRooms[roomName]) {
                    return false;
                }
            }
            else if (!options.allowHostile && Traveler.checkAvoid(roomName)
                && roomName !== destRoomName && roomName !== originRoomName) {
                return false;
            }
            let matrix;
            let room = Game.rooms[roomName];
            if (room) {
                if (options.ignoreStructures) {
                    matrix = new PathFinder.CostMatrix();
                    if (!options.ignoreCreeps) {
                        Traveler.addCreepsToMatrix(room, matrix);
                    }
                }
                else if (options.ignoreCreeps || roomName !== originRoomName) {
                    matrix = this.getStructureMatrix(room, options.freshMatrix);
                }
                else {
                    matrix = this.getCreepMatrix(room);
                }
                if (options.obstacles) {
                    matrix = matrix.clone();
                    for (let obstacle of options.obstacles) {
                        if (obstacle.pos.roomName !== roomName) {
                            continue;
                        }
                        matrix.set(obstacle.pos.x, obstacle.pos.y, 0xff);
                    }
                }
            }
            if (options.roomCallback) {
                if (!matrix) {
                    matrix = new PathFinder.CostMatrix();
                }
                let outcome = options.roomCallback(roomName, matrix.clone());
                if (outcome !== undefined) {
                    return outcome;
                }
            }
            return matrix;
        };
        let ret = PathFinder.search(origin, { pos: destination, range: options.range }, {
            maxOps: options.maxOps,
            maxRooms: options.maxRooms,
            plainCost: options.offRoad ? 1 : options.ignoreRoads ? 1 : 2,
            swampCost: options.offRoad ? 1 : options.ignoreRoads ? 5 : 10,
            roomCallback: callback,
        });
        if (ret.incomplete && options.ensurePath) {
            if (options.useFindRoute === undefined) {
                // handle case where pathfinder failed at a short distance due to not using findRoute
                // can happen for situations where the creep would have to take an uncommonly indirect path
                // options.allowedRooms and options.routeCallback can also be used to handle this situation
                if (roomDistance <= 2) {
                    console.log(`TRAVELER: path failed without findroute, trying with options.useFindRoute = true`);
                    console.log(`from: ${origin}, destination: ${destination}`);
                    options.useFindRoute = true;
                    ret = this.findTravelPath(origin, destination, options);
                    console.log(`TRAVELER: second attempt was ${ret.incomplete ? "not " : ""}successful`);
                    return ret;
                }
                // TODO: handle case where a wall or some other obstacle is blocking the exit assumed by findRoute
            }
        }
        return ret;
    }
    /**
     * find a viable sequence of rooms that can be used to narrow down pathfinder's search algorithm
     * @param origin
     * @param destination
     * @param options
     * @returns {{}}
     */
    static findRoute(origin, destination, options = {}) {
        let restrictDistance = options.restrictDistance || Game.map.getRoomLinearDistance(origin, destination) + 10;
        let allowedRooms = { [origin]: true, [destination]: true };
        let highwayBias = 1;
        if (options.preferHighway) {
            highwayBias = 2.5;
            if (options.highwayBias) {
                highwayBias = options.highwayBias;
            }
        }
        let ret = Game.map.findRoute(origin, destination, {
            routeCallback: (roomName) => {
                if (options.routeCallback) {
                    let outcome = options.routeCallback(roomName);
                    if (outcome !== undefined) {
                        return outcome;
                    }
                }
                let rangeToRoom = Game.map.getRoomLinearDistance(origin, roomName);
                if (rangeToRoom > restrictDistance) {
                    // room is too far out of the way
                    return Number.POSITIVE_INFINITY;
                }
                if (!options.allowHostile && Traveler.checkAvoid(roomName) &&
                    roomName !== destination && roomName !== origin) {
                    // room is marked as "avoid" in room memory
                    return Number.POSITIVE_INFINITY;
                }
                let parsed;
                if (options.preferHighway) {
                    parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                    let isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
                    if (isHighway) {
                        return 1;
                    }
                }
                // SK rooms are avoided when there is no vision in the room, harvested-from SK rooms are allowed
                if (!options.allowSK && !Game.rooms[roomName]) {
                    if (!parsed) {
                        parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                    }
                    let fMod = parsed[1] % 10;
                    let sMod = parsed[2] % 10;
                    let isSK = !(fMod === 5 && sMod === 5) &&
                        ((fMod >= 4) && (fMod <= 6)) &&
                        ((sMod >= 4) && (sMod <= 6));
                    if (isSK) {
                        return 10 * highwayBias;
                    }
                }
                return highwayBias;
            },
        });
        if (!_.isArray(ret)) {
            console.log(`couldn't findRoute to ${destination}`);
            return;
        }
        for (let value of ret) {
            allowedRooms[value.room] = true;
        }
        return allowedRooms;
    }
    /**
     * check how many rooms were included in a route returned by findRoute
     * @param origin
     * @param destination
     * @returns {number}
     */
    static routeDistance(origin, destination) {
        let linearDistance = Game.map.getRoomLinearDistance(origin, destination);
        if (linearDistance >= 32) {
            return linearDistance;
        }
        let allowedRooms = this.findRoute(origin, destination);
        if (allowedRooms) {
            return Object.keys(allowedRooms).length;
        }
    }
    /**
     * build a cost matrix based on structures in the room. Will be cached for more than one tick. Requires vision.
     * @param room
     * @param freshMatrix
     * @returns {any}
     */
    static getStructureMatrix(room, freshMatrix) {
        if (!this.structureMatrixCache[room.name] || (freshMatrix && Game.time !== this.structureMatrixTick)) {
            this.structureMatrixTick = Game.time;
            let matrix = new PathFinder.CostMatrix();
            this.structureMatrixCache[room.name] = Traveler.addStructuresToMatrix(room, matrix, 1);
        }
        return this.structureMatrixCache[room.name];
    }
    /**
     * build a cost matrix based on creeps and structures in the room. Will be cached for one tick. Requires vision.
     * @param room
     * @returns {any}
     */
    static getCreepMatrix(room) {
        if (!this.creepMatrixCache[room.name] || Game.time !== this.creepMatrixTick) {
            this.creepMatrixTick = Game.time;
            this.creepMatrixCache[room.name] = Traveler.addCreepsToMatrix(room, this.getStructureMatrix(room, true).clone());
        }
        return this.creepMatrixCache[room.name];
    }
    /**
     * add structures to matrix so that impassible structures can be avoided and roads given a lower cost
     * @param room
     * @param matrix
     * @param roadCost
     * @returns {CostMatrix}
     */
    static addStructuresToMatrix(room, matrix, roadCost) {
        let impassibleStructures = [];
        for (let structure of room.find(FIND_STRUCTURES)) {
            if (structure instanceof StructureRampart) {
                if (!structure.my && !structure.isPublic) {
                    impassibleStructures.push(structure);
                }
            }
            else if (structure instanceof StructureRoad) {
                matrix.set(structure.pos.x, structure.pos.y, roadCost);
            }
            else if (structure instanceof StructureContainer) {
                matrix.set(structure.pos.x, structure.pos.y, 5);
            }
            else {
                impassibleStructures.push(structure);
            }
        }
        for (let site of room.find(FIND_MY_CONSTRUCTION_SITES)) {
            if (site.structureType === STRUCTURE_CONTAINER || site.structureType === STRUCTURE_ROAD
                || site.structureType === STRUCTURE_RAMPART) {
                continue;
            }
            matrix.set(site.pos.x, site.pos.y, 0xff);
        }
        for (let structure of impassibleStructures) {
            matrix.set(structure.pos.x, structure.pos.y, 0xff);
        }
        return matrix;
    }
    /**
     * add creeps to matrix so that they will be avoided by other creeps
     * @param room
     * @param matrix
     * @returns {CostMatrix}
     */
    static addCreepsToMatrix(room, matrix) {
        room.find(FIND_CREEPS).forEach((creep) => matrix.set(creep.pos.x, creep.pos.y, 0xff));
        return matrix;
    }
    /**
     * serialize a path, traveler style. Returns a string of directions.
     * @param startPos
     * @param path
     * @param color
     * @returns {string}
     */
    static serializePath(startPos, path, color = "orange") {
        let serializedPath = "";
        let lastPosition = startPos;
        this.circle(startPos, color);
        for (let position of path) {
            if (position.roomName === lastPosition.roomName) {
                new RoomVisual(position.roomName)
                    .line(position, lastPosition, { color: color, liRoomyle: "dashed" });
                serializedPath += lastPosition.getDirectionTo(position);
            }
            lastPosition = position;
        }
        return serializedPath;
    }
    /**
     * returns a position at a direction relative to origin
     * @param origin
     * @param direction
     * @returns {RoomPosition}
     */
    static positionAtDirection(origin, direction) {
        let offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
        let offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
        let x = origin.x + offsetX[direction];
        let y = origin.y + offsetY[direction];
        if (x > 49 || x < 0 || y > 49 || y < 0) {
            return;
        }
        return new RoomPosition(x, y, origin.roomName);
    }
    /**
     * convert room avoidance memory from the old pattern to the one currently used
     * @param cleanup
     */
    static patchMemory(cleanup = false) {
        if (!Memory.empire) {
            return;
        }
        if (!Memory.empire.hostileRooms) {
            return;
        }
        let count = 0;
        for (let roomName in Memory.empire.hostileRooms) {
            if (Memory.empire.hostileRooms[roomName]) {
                if (!Memory.rooms[roomName]) {
                    Memory.rooms[roomName] = {};
                }
                Memory.rooms[roomName].avoid = 1;
                count++;
            }
            if (cleanup) {
                delete Memory.empire.hostileRooms[roomName];
            }
        }
        if (cleanup) {
            delete Memory.empire.hostileRooms;
        }
        console.log(`TRAVELER: room avoidance data patched for ${count} rooms`);
    }
    static deserializeState(travelData, destination) {
        let state = {};
        if (travelData.state) {
            state.lastCoord = { x: travelData.state[STATE_PREV_X], y: travelData.state[STATE_PREV_Y] };
            state.cpu = travelData.state[STATE_CPU];
            state.stuckCount = travelData.state[STATE_STUCK];
            state.destination = new RoomPosition(travelData.state[STATE_DEST_X], travelData.state[STATE_DEST_Y], travelData.state[STATE_DEST_ROOMNAME]);
        }
        else {
            state.cpu = 0;
            state.destination = destination;
        }
        return state;
    }
    static serializeState(creep, destination, state, travelData) {
        travelData.state = [creep.pos.x, creep.pos.y, state.stuckCount, state.cpu, destination.x, destination.y,
            destination.roomName];
    }
    static isStuck(creep, state) {
        let stuck = false;
        if (state.lastCoord !== undefined) {
            if (this.sameCoord(creep.pos, state.lastCoord)) {
                // didn't move
                stuck = true;
            }
            else if (this.isExit(creep.pos) && this.isExit(state.lastCoord)) {
                // moved against exit
                stuck = true;
            }
        }
        return stuck;
    }
}
Traveler.structureMatrixCache = {};
Traveler.creepMatrixCache = {};
exports.Traveler = Traveler;
// this might be higher than you wish, setting it lower is a great way to diagnose creep behavior issues. When creeps
// need to repath to often or they aren't finding valid paths, it can sometimes point to problems elsewhere in your code
const REPORT_CPU_THRESHOLD = 1000;
const DEFAULT_MAXOPS = 20000;
const DEFAULT_STUCK_VALUE = 2;
const STATE_PREV_X = 0;
const STATE_PREV_Y = 1;
const STATE_STUCK = 2;
const STATE_CPU = 3;
const STATE_DEST_X = 4;
const STATE_DEST_Y = 5;
const STATE_DEST_ROOMNAME = 6;
// assigns a function to Creep.prototype: creep.travelTo(destination)
Creep.prototype.travelTo = function (destination, options) {
    return Traveler.travelTo(this, destination, options);
};
});

unwrapExports(Traveler_1);
var Traveler_2 = Traveler_1.Traveler;

const INT_STAGE = (function (Enum) {
  Enum[Enum['START'] = 1] = 'START';
  Enum[Enum['END'] = 2] = 'END';
  return Enum
})({});

const INT_TYPE = (function (Enum) {
  Enum[Enum['VISION'] = 1] = 'VISION';
  Enum[Enum['SEGMENT'] = 2] = 'SEGMENT';
  Enum[Enum['CREEP'] = 3] = 'CREEP';
  Enum[Enum['TICK'] = 4] = 'TICK';
  Enum[Enum['SLEEP'] = 5] = 'SLEEP';
  Enum[Enum['NEW_CODE'] = 6] = 'NEW_CODE';
  return Enum
})({});

const INT_FUNC = (function (Enum) {
  Enum[Enum['INTERRUPT'] = 1] = 'INTERRUPT';
  Enum[Enum['WAKE'] = 2] = 'WAKE';
  return Enum
})({});

class InterruptHandler {
  constructor (memget) {
    this.trackers = trackers;
    this.memget = memget || (() => {
      Memory.interruptHandler = Memory.interruptHandler || {};
      return Memory.interruptHandler
    });
  }
  get memory () {
    return this.memget()
  }
  get hooks () {
    this.memory.hooks = this.memory.hooks || {};
    return this.memory.hooks
  }
  add (pid, type, stage, key, func = INT_FUNC.INTERRUPT) {
    if (typeof func === 'string' && INT_FUNC[func]) func = INT_FUNC[func];
    let hkey = [type, stage, key, pid].join(':');
    this.hooks[hkey] = { type, stage, key, pid, func };
  }
  remove (pid, type, stage, key) {
    let hkey = [type, stage, key, pid].join(':');
    delete this.hooks[hkey];
  }
  clear (pid) {
    // Not efficient, but shouldn't be called often
    let hkeys = Object.keys(this.hooks).filter(h => h.endsWith(pid));
    hkeys.forEach(hkey => delete this.hooks[hkey]);
  }
  run (stage = INT_STAGE.START) {
    let list = [];
    let trackers = {};
    _.each(this.trackers, tracker => {
      if (tracker.stages.indexOf(stage) === -1) {
        return
      }
      trackers[tracker.type] = {
        keys: tracker.getEvents(this.memory),
        cond: tracker.cond || ((hook, key) => hook.key === key)
      };
    });
    _.each(this.hooks, hook => {
      if (hook.stage !== stage) return
      if (!trackers[hook.type]) return
      let { keys, cond } = trackers[hook.type];
      _.each(keys, key => {
        if (!hook.key || cond(hook, key)) {
          list.push([hook, key]);
        }
      });
    });
    return list
  }
}

const trackers = [
  {
    type: INT_TYPE.VISION,
    stages: [INT_STAGE.START],
    getEvents () {
      return Object.keys(Game.rooms)
    }
  },
  {
    type: INT_TYPE.SEGMENT,
    stages: [INT_STAGE.START],
    getEvents () {
      return Object.keys(RawMemory.segments).map(v => parseInt(v))
    }
  },
  {
    type: INT_TYPE.CREEP,
    stages: [INT_STAGE.START],
    getEvents () {
      return Object.keys(Game.creeps)
    }
  },
  {
    type: INT_TYPE.TICK,
    stages: [INT_STAGE.START, INT_STAGE.END],
    getEvents () {
      return [Game.time]
    }
  },
  {
    type: INT_TYPE.SLEEP,
    stages: [INT_STAGE.START, INT_STAGE.END],
    getEvents () {
      return [Game.time]
    },
    cond (hook, key) {
      return Game.time >= parseInt(hook.key)
    }
  },
  {
    type: INT_TYPE.NEW_CODE,
    stages: [INT_STAGE.START],
    getEvents (mem) {
      if (mem.codeTimestamp !== module.timestamp) {
        mem.codeTimestamp = module.timestamp;
        return [module.timestamp]
      }
      return []
    }
  }
];

const segCnt = Symbol('segCnt');
const SEGMENTS = {
  [segCnt]: 0
};

function addSegment (segment) {
  // if (SEGMENTS[segment]) return
  console.log(`AddSegment ${segment} ${SEGMENTS[segCnt]}`);
  SEGMENTS[segment] = SEGMENTS[segCnt]++;
}

addSegment('CONFIG');
addSegment('KERNEL');
addSegment('INTERRUPT');
console.log(JSON.stringify(SEGMENTS));
const PROC_RUNNING = 1;
const PROC_KILLED = 2;
const PROC_CRASHED = 3;

const PINFO = {
  ID: 'i',
  PID: 'p',
  NAME: 'n',
  STATUS: 's',
  STARTED: 'S',
  WAIT: 'w',
  ENDED: 'e',
  PROCESS: 'P',
  ERROR: 'E'
};

var C$1 = {
  INT_FUNC,
  INT_STAGE,
  INT_TYPE,
  PROC_RUNNING,
  PROC_KILLED,
  PROC_CRASHED,
  PINFO,
  SEGMENTS,
  addSegment
};

C$1.addSegment('SPAWN');
C$1.addSegment('INTEL');

C$1.EPosisSpawnStatus = {
  ERROR: -1,
  QUEUED: 0,
  SPAWNING: 1,
  SPAWNED: 2
};

C$1.USER = C$1.USERNAME = Game.spawns.Spawn1 && Game.spawns.Spawn1.owner.username;

// Import global constants
Object.keys(global)
  .filter(k => k === k.toUpperCase())
  .forEach(k => {
    C$1[k] = global[k];
  });

C$1.RECIPES = {};
for (var a in REACTIONS) {
  for (var b in C$1.REACTIONS[a]) {
    C$1.RECIPES[C$1.REACTIONS[a][b]] = [a, b];
  }
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto$1.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$2.toString;

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$3.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$4 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$4.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(root, 'Map');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map$1),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map$1 && getTag(new Map$1) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

var getTag$1 = getTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$3.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$1 = '[object Map]',
    numberTag = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag = '[object String]',
    weakMapTag$1 = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$1] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
typedArrayTags[setTag$1] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag$1] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]',
    setTag$2 = '[object Set]';

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag$1(value);
  if (tag == mapTag$2 || tag == setTag$2) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty$4.call(value, key)) {
      return false;
    }
  }
  return true;
}

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$5.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$6.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$7.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$1 || ListCache),
    'string': new Hash
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map$1 || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    mapTag$3 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$3 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$2:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$1:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag$1:
      return object.name == other.name && object.message == other.message;

    case regexpTag$1:
    case stringTag$1:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$3:
      var convert = mapToArray;

    case setTag$3:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$a.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$8.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag$1 : getTag$1(object),
      othTag = othIsArr ? arrayTag$1 : getTag$1(other);

  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

  var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$9.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$9.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag$1);
}

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray(collection) ? arrayAggregator : baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
  };
}

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$d.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The order of grouped values
 * is determined by the order they occur in `collection`. The corresponding
 * value of each key is an array of elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': [4.2], '6': [6.1, 6.3] }
 *
 * // The `_.property` iteratee shorthand.
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */
var groupBy = createAggregator(function(result, value, key) {
  if (hasOwnProperty$a.call(result, key)) {
    result[key].push(value);
  } else {
    baseAssignValue(result, key, [value]);
  }
});

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

const STRUCTURES_TO_CHECK = [
  C$1.STRUCTURE_SPAWN,
  C$1.STRUCTURE_EXTENSION,
  C$1.STRUCTURE_STORAGE,
  C$1.STRUCTURE_TOWER,
  C$1.STRUCTURE_TERMINAL
  // Ignoring some for now
  // C.STRUCTURE_OBSERVER,
  // C.STRUCTURE_POWER_SPAWN,
  // C.STRUCTURE_NUKER,
  // C.STRUCTURE_LAB,
  // C.STRUCTURE_EXTRACTOR,
];

const multipleList = [
  STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_WALL,
  STRUCTURE_RAMPART, STRUCTURE_KEEPER_LAIR, STRUCTURE_PORTAL, STRUCTURE_LINK,
  STRUCTURE_TOWER, STRUCTURE_LAB, STRUCTURE_CONTAINER
];

const singleList = [
  STRUCTURE_OBSERVER, STRUCTURE_POWER_BANK, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR,
  STRUCTURE_NUKER        // STRUCTURE_TERMINAL,   STRUCTURE_CONTROLLER,   STRUCTURE_STORAGE,
];

let obj = {
  lookNear: {
    value: function (type, pos) {
      let { x, y } = pos.pos || pos;
      let res = [];
      for(let yo = -1; yo <= 1; yo++) {
        if(y + yo > 49 || y + yo < 0) continue
        for(let xo = -1; xo <= 1; xo++) {
          if(x + xo > 49 || x + xo < 0) continue
          res.push(...this.lookForAt(type, x + xo, y + yo));
        }
      }
      return res
    },
    enumerable: false,
    configurable: true
  },
  structures: {
    get: function () {
      if (!this._structures || isEmpty(this._structures)) {
        this._all_structures = this.find(FIND_STRUCTURES);
        this._structures = groupBy(this._all_structures, 'structureType');
        this._structures.all = this._all_structures;
      }
      return this._structures
    },
    enumerable: false,
    configurable: true
  },
  level: {
    get: function () {
      let RCL = this.controller && this.controller.level || 0;
      let PRL = RCL;
      forEach(STRUCTURES_TO_CHECK, (structure) => {
        let have = this.structures[structure] && this.structures[structure].length || 0;
        for (let i = 0; i <= PRL; i++) {
          if (have < C$1.CONTROLLER_STRUCTURES[structure][i]) {
            PRL = (i - 1);
          }
        }
      });
      return PRL
    },
    configurable: true
  }
};

multipleList.forEach(function (type) {
  obj[type + 's'] = {
    get: function () {
      return this.structures[type] || []
    },
    enumerable: false,
    configurable: true
  };
});

singleList.forEach(function (type) {
  obj[type] = {
    get: function () {
      return (this.structures[type] || [])[0]
    },
    enumerable: false,
    configurable: true
  };
});

Object.defineProperties(Room.prototype, obj);

/**
 * The base implementation of methods like `_.max` and `_.min` which accepts a
 * `comparator` to determine the extremum value.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per iteration.
 * @param {Function} comparator The comparator used to compare values.
 * @returns {*} Returns the extremum value.
 */
function baseExtremum(array, iteratee, comparator) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index],
        current = iteratee(value);

    if (current != null && (computed === undefined
          ? (current === current && !isSymbol(current))
          : comparator(current, computed)
        )) {
      var computed = current,
          result = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.lt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than `other`,
 *  else `false`.
 */
function baseLt(value, other) {
  return value < other;
}

/**
 * This method is like `_.min` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * _.minBy(objects, function(o) { return o.n; });
 * // => { 'n': 1 }
 *
 * // The `_.property` iteratee shorthand.
 * _.minBy(objects, 'n');
 * // => { 'n': 1 }
 */
function minBy(array, iteratee) {
  return (array && array.length)
    ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt)
    : undefined;
}

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map$1(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

class MemoryManager {
  get mem () {
    return this.memget()
  }
  get lru () {
    this.mem.lru = this.mem.lru || {};
    return this.mem.lru
  }
  constructor (memget) {
    this.memget = memget || (() => {
      Memory.__segments = Memory.__segments || {};
      return Memory.__segments
    });
    this.fixed = [0];
    this.segments = {};
    this.versions = {};
    this.pendingSaves = {};
    this.mem.pendingSaves = this.mem.pendingSaves || {};
    this.mem.versions = this.mem.versions || {};
    this.mem.active = this.mem.active || [0];
    this.mem.readable = this.mem.readable || {};
    this.mem.lru = this.mem.lru || {};
    if (this.mem.active.indexOf(0) === -1) this.mem.active.splice(0, 0, 0);
    this.config = this.getSegment(0);
    if (this.config) {
      if (this.config.named) {
        this.config.named.forEach((v, k) => {
          this.wrap(k, v);
          Object.defineProperty(this.segments, v, {
            get: () => this.getSegment(k),
            set: (v) => this.saveSegment(k, v)
          });
        });
      }
    }
  }
  activate (id) {
    if (!id && id !== 0) return
    if (this.mem.active.indexOf(id) === -1) {
      this.mem.active.push(id);
    }
    console.log(`MM: ${this.mem.active}`);
  }
  deactivate (id) {
    let ind = this.mem.active.indexOf(id);
    if (ind === -1) return
    this.mem.active.splice(ind, 1);
  }
  endOfTick () {
    try {
      while (this.mem.active.length > 10) {
        console.log(`MM: Active too long, pruning ${this.mem.active}`);
        let min = minBy(map$1(this.lru, (time, id) => ({ id, time })), 'time');
        let ind = min ? this.mem.active.indexOf(min.id) : -1;
        if (ind !== -1) {
          delete this.lru[min.id];
          this.mem.active.splice(ind, 1);
        }
      }
      RawMemory.setActiveSegments(this.mem.active);
    } catch (e) {
      console.log(`ERROR: Failed to set active. Reseting Active List ${e.stack}`);
      this.mem.active = [0];
    }
    Object.keys(RawMemory.segments).filter(k => k < 90).forEach(k => delete RawMemory.segments[k]);
    let rem = 10 - Object.keys(RawMemory.segments).length;
    _.each(this.mem.pendingSaves, (v, id) => {
      if (rem--) {
        this.saveSegment(id, v);
      }
    });
  }
  getSegment (id) {
    this.mem.versions = this.mem.versions || {};
    if (!this.mem.versions[id] || !this.versions[id] || this.mem.versions[id] !== this.versions[id]) {
      this.reloadSegment(id);
    }
    return this.mem.pendingSaves[id] || (typeof this.segments[id] === 'undefined' ? false : this.segments[id])
  }
  reloadSegment (id) {
    this.mem.versions[id] = this.mem.versions[id] || 0;
    this.versions[id] = this.mem.versions[id];
    if (this.mem.pendingSaves[id]) {
      return this.mem.pendingSaves[id]
    }
    if (this.hasSegment(id)) {
      let v = RawMemory.segments[id];
      if (v[0] === '{' || v[0] === '[') {
        v = JSON.parse(v);
      }
      this.segments[id] = v;
    }
    return false
  }
  initSegment (id, v = {}) {
    RawMemory.segments[id] = JSON.stringify(v);
  }
  hasSegment (id) {
    return typeof RawMemory.segments[id] !== 'undefined'
  }
  saveSegment (id, v) {
    if (typeof v === 'object') v = JSON.stringify(v, null, this.mem.readable[id] ? 2 : null);
    if (v.length > 100 * 1024) return
    RawMemory.segments[id] = v;
    delete this.mem.pendingSaves[id];
  }
  markForSaving (id, v) {
    this.mem.pendingSaves[id] = v;
    this.mem.versions[id] = this.mem.versions[id] || 0;
    this.mem.versions[id]++;
  }
  load (id) {
    if (!~this.fixed.indexOf(id)) {
      this.lru[id] = Game.time;
    }
    return this.getSegment(id)
  }
  save (id, v) {
    if (!~this.fixed.indexOf(id)) {
      this.lru[id] = Game.time;
    }
    this.markForSaving(id, v);
  }
  wrap (name, id) {
    Object.defineProperty(RawMemory, name, {
      get: function () {
        return this.mem.pendingSaves[id] || RawMemory.segments[id]
      },
      set: function (v) {
        return this.markForSaving(id, v)
      }
    });
  }
  posttick(){
    this.endOfTick();
  }
}
/*
interface SegmentExtension {
  // Returns undefined if segment isn't loaded,
  // else parsed JSON if contents is JSON, else string
  load(id: Number): SegmentValue | undefined;
  // marks segment for saving, implementations 
  // may save immediately or wait until end of tick
  // subsequent load calls within the same tick should
  // return this value
  save(id: Number, value: SegmentValue): void;
  // Should add ID to active list
  activate(id: Number): void;
}

interface SegmentValue {}

*/

// Use for HTML styling (Colors loosely match screeps_console)

const LogLevel$1 = {
  SILLY: -1,
  DEBUG: 0,
  INFO: 1,
  ALERT: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
};

const styles$1 = {
  default: 'color: white; background-color: black',
  [LogLevel$1.SILLY]: 'color: darkblue',
  [LogLevel$1.DEBUG]: 'color: darkblue',
  [LogLevel$1.INFO]: 'color: darkgreen',
  [LogLevel$1.ALERT]: 'color: cyan',
  [LogLevel$1.WARN]: 'color: white',
  [LogLevel$1.ERROR]: 'color: red',
  [LogLevel$1.FATAL]: 'color: yellow; background-color: red'
};

let y$1 = 0;
let tick$1 = 0;

class Logger$1 {
  static get LogLevel () {
    return LogLevel$1
  }
  constructor (prefix = '') {
    this.prefix = prefix;
    this.level = Memory.loglevel && Memory.loglevel.default || LogLevel$1.INFO;
    this._log = console.log; // This allows for console hooking
  }
  hook (level = 'info') {
    Object.defineProperty(console, 'log', {
      value: (...a) => {
        this[level](a.join(' '));
      }
    });
  }
  unhook () {
    Object.defineProperty(console, 'log', {
      value: this._log
    });
  }
  log (level, message) {
    if (level >= this.level) {
      if (typeof message === 'function') {
        message = message();
      }
      let style = styles$1[level] || styles$1.default;
      this._log(`<log severity="${level}" style="${style}">[${level}] ${this.prefix} ${message}</log>`);
      // this.vlog(level, `[${level}] ${this.prefix} ${message}`)
    }
  }
  vlog (level, message) {
    if (tick$1 !== Game.time) y$1 = 0.2;
    tick$1 = Game.time;
    let style = styles$1[level] || styles$1.default;
    let color = style.match(/color: ([a-z]*)/)[1];
    let vis = new RoomVisual();
    try {
      vis.text(message, 0, y$1, { align: 'left', color });
    } catch (e) {}
    y$1 += 0.8;
  }
  debug (message) {
    this.log(LogLevel$1.DEBUG, message);
  }
  info (message) {
    this.log(LogLevel$1.INFO, message);
  }
  warn (message) {
    this.log(LogLevel$1.WARN, message);
  }
  alert (message) {
    this.log(LogLevel$1.ALERT, message);
  }
  error (message) {
    if(message instanceof Error) {
      message = ErrorMapper.map(message);
    }
    this.log(LogLevel$1.ERROR, message);
  }
  fatal (message) {
    this.log(LogLevel$1.FATAL, message);
  }
}

const BURST_CPU_LIMIT = 300; // new-global burst limit
const BURST_BUCKET_LIMIT = 2000; // Only new-global burst above this

const calcCPULinear = () => Game.cpu.bucket < 500 ? 0 : Game.cpu.limit * ((((Game.cpu.bucket - 1000) * (1.1 - 0.4)) / 9000) + 0.4);
const calcCPUPID = (mem) => {
  const Kp = 0.03;
  const Ki = 0.02;
  const Kd = 0;
  const Mi = 500;
  const Se = 0.5;

  let e = mem.e || 0;
  let i = mem.i || 0;
  let le = e;
  e = Se * (Game.cpu.bucket - 9500);
  i = i + e;
  i = Math.min(Math.max(i, -Mi), Mi);

  let Up = (Kp * e);
  let Ui = (Ki * i);
  let Ud = Kd * (e / le) * e;

  const output = Up + Ui + Ud;

  mem.i = i;
  mem.e = e;

  const limit = Math.max(Game.cpu.limit + output - Game.cpu.getUsed(), Game.cpu.limit * 0.2);
  // console.table({e, i, Up, Ui, output, bucket: Game.cpu.bucket, limit})

  return limit
};

// These lines are just to make standard happy
calcCPULinear({});
calcCPUPID({});

const calcCPU = calcCPUPID;

const QUEUE_COUNT = 10;

let formula = (i) => 0.05 * i;

let amts = [];
for (let i = 0; i < QUEUE_COUNT; i++) {
  amts.push(formula(i));
}

const QUEUE_CPU_AMT = amts;
// Based on https://www.wikiwand.com/en/Multilevel_feedback_queue#/Process_Scheduling

class Scheduler {
  constructor (kernel, opts = {}) {
    this.kernel = kernel;
    this.opts = opts;
    this.startTick = true;
    this.idCache = {};
    this.log = new Logger$1('[Scheduler]');
  }
  get mem () {
    this.kmem.scheduler = this.kmem.scheduler || {};
    return this.kmem.scheduler
  }
  get kmem () {
    return this.kernel.memory
  }
  get procs () {
    return this.kernel.processTable
  }
  clear () {
    let qs = [];
    _.times(QUEUE_COUNT, () => qs.push([]));
    this.mem.queues = qs;
    this.idCache = {};
  }
  setup () {
    let start = Game.cpu.getUsed();
    this.usedQueueCPU = 0;
    this.cnt = 0;
    let maxCPU = Game.cpu.limit;
    this.queues = [];
    _.times(QUEUE_COUNT, () => this.queues.push([]));

    _.each(this.procs, proc => {
      proc._s = proc._s || { q: 0 };
      if (!proc[C$1.PINFO.ID] || proc[C$1.PINFO.STATUS] !== C$1.PROC_RUNNING) {
        return
      }
      let q = proc._s.q || 0;
      if (q < 0) q = 0;
      if (q >= QUEUE_COUNT) q = QUEUE_COUNT - 1;
      this.queues[q].push(proc);
      this.cnt++;
    });

    maxCPU = calcCPU(this.mem);

    if (this.startTick && Game.cpu.bucket > BURST_BUCKET_LIMIT) {
      maxCPU = BURST_CPU_LIMIT;
    }

    this.remainingCPU = Math.min(maxCPU, Game.cpu.bucket);
    this.mem.lastRem = this.remainingCPU;
    this.queue = 0;
    this.index = 0;
    this.stats = {};
    this.done = [];
    this.cpu = {};
    this.ql = this.queues.map(q => q.length);
    let end = Game.cpu.getUsed();
    let dur = end - start;
    this.log.info(`Setup Time: ${dur.toFixed(3)}   Total Queue Length: ${this.cnt}`);
    return this.cnt
  }
  addProcess (proc) {
    proc._s = proc._s || { q: 0 };
    this.queues[this.queue].push(proc);
  }
  removeProcess (pid) {
    let p = this.procs[pid];
    let ind = this.queues[p._s.q].indexOf(p);
    if (ind > -1) {
      this.queues[p._s.q].splice(ind, 1);
    }
  }
  getNextProcess () {
    while (this.queues[this.queue].length === 0) {
      if (this.queue === QUEUE_COUNT - 1) {
        return false
      }
      this.queue++;
    }
    let queue = this.queues[this.queue];
    let queueCPU = QUEUE_CPU_AMT[this.queue];
    this.usedQueueCPU += queueCPU;
    let proc = queue.pop();
    let pid = proc[C$1.PINFO.ID];
    let avail = this.remainingCPU - Math.max(Game.cpu.getUsed(), this.usedQueueCPU);
    if (avail < 0) {
      this.log.error(`CPU Threshhold reached. Used:${Game.cpu.getUsed()} Allowance:${Math.round(this.remainingCPU * 100) / 100} Avail: ${Math.round(avail * 100) / 100} Bucket:${Game.cpu.bucket} QueueCPU: ${queueCPU} UsedQueueCPU: ${Math.round(this.usedQueueCPU * 100) / 100}`);
      this.log.error(`Queue: ${this.queue}. Index: ${this.index}/${queue.length} LastPID: ${pid}`);
      return false
    }
    this.done.push(proc);
    return pid
  }
  setCPU (pid, v) {
    this.procs[pid]._s.c = v;
  }
  setMeta (pid, meta) {}
  cleanup () {
    let start = Game.cpu.getUsed();
    let pro, queue;
    let runcnt = this.done.length;
    let procnt = 0;
    let demcnt = 0;
    while (this.queue < QUEUE_COUNT) {
      if (this.queue === 0) break
      queue = this.queues[this.queue];
      if (queue.length && Math.random() < 0.50) {
        pro = queue.pop();
        this.queues[this.queue - 1].push(pro);
        procnt++;
      }
      this.queue++;
    }

    while (this.done.length) {
      let pid = this.done.pop();
      // let p = this.procs[pid]
      let p = pid;
      if (!p) {
        this.log.warn(`PID ${pid} not found`);
        continue
      }
      let {q, c} = p._s = p._s || { q: 0, c: 0};
      if (q > 0 && c < (QUEUE_CPU_AMT[q - 1] * 0.75)) {
        if (Math.random() < 0.50) continue
        p._s.q--;
        procnt++;
      } else if (q < (QUEUE_COUNT - 1) && c > QUEUE_CPU_AMT[q]) {
        p._s.q++;
        demcnt++;
      }
    }

    this.startTick = false;
    let end = Game.cpu.getUsed();
    let cur = end - start;
    this.log.info(QUEUE_CPU_AMT.map(v => v.toFixed(2)).join(', '));
    this.log.info(this.ql.map(q => ('    ' + q).slice(-4)).join(', '));
    this.log.info(`Promoted: ${procnt} Demoted: ${demcnt}`);
    this.log.info(`Counts: ${runcnt}/${this.cnt} (${Math.floor((runcnt / this.cnt) * 100)}%) ${this.cnt - runcnt} rem`);
    if (global.stats) {
      global.stats.addStat('scheduler', {
        v: 3
      }, {
        count: QUEUE_COUNT,
        queue: this.queue,
        promoted: procnt,
        demoted: demcnt,
        cleanupCPU: cur,
        processCount: this.cnt,
        runCnt: runcnt
      });
      this.ql.forEach((q, i) => {
        global.stats.addStat('schedulerQueue', {
          level: i
        }, {
          level: i,
          count: q
        });
      });
    }
  }
}

// export interface ProcessInfo {
//   id: PosisPID
//   pid: PosisPID
//   name: string
//   status: string
//   started: number
//   wake?: number
//   ended?: number
//   process?: IPosisProcess
//   error?: string
// }

// export interface ProcessTable {
//   [id: string]: ProcessInfo
// }

// export interface ProcessMemoryTable {
//   [id: string]: {}
// }

// export interface KernelMemory {
//   processTable: ProcessTable
//   processMemory: ProcessMemoryTable
// }

// declare global {
//   interface Memory {
//     kernel: KernelMemory
//   }
// }

class BaseKernel { // implements IPosisKernel, IPosisSleepExtension {
  get memory () {
    return this.memget()
  }
  get processTable () {
    this.memory.processTable = this.memory.processTable || {};
    return this.memory.processTable
  }
  get processMemory () {
    Memory.JuicedOS = Memory.JuicedOS || {};
    Memory.JuicedOS.processMemory = Memory.JuicedOS.processMemory || {};
    return Memory.JuicedOS.processMemory
  }

  get uptime () {
    return (Game.time - this.time) + 1
  }

  constructor (processRegistry, extensionRegistry) {
    this.time = Game.time;
    this.rand = Game.time % 10;
    this.segments = extensionRegistry.getExtension('segments');
    this.scheduler = new Scheduler(this);
    this.segments.activate(C$1.SEGMENTS.KERNEL);
    this.mem = this.segments.load(C$1.SEGMENTS.KERNEL);
    if (this.mem === '') this.mem = {};
    if (this.imem === '') this.imem = {};

    this.memget = () => this.mem;
    this.processRegistry = processRegistry;
    this.extensionRegistry = extensionRegistry;

    this.interruptHandler = new InterruptHandler(() => {
      let mem = this.segments.load(C$1.SEGMENTS.INTERRUPT);
      if (mem === '') {
        mem = {};
        this.segments.save(C$1.SEGMENTS.INTERRUPT, mem);
      }
      return mem
    });
    this.processInstanceCache = {};
    this.currentId = 'ROOT';
    this.log = new Logger$1('[Kernel]');
    // if (!Memory.spawnVersion) {
    //   Memory.spawnVersion = _.find(Game.spawns, a=>a).id
    // }
    // if (Memory.spawnVersion && Memory.spawnVersion !== _.find(Game.spawns, a=>a).id) {
    //   this.reboot()
    //   throw new Error('Reboot Forced')
    // }
  }

  UID () {
    return ('P' + Game.time.toString(36).slice(-6) + Math.random().toString(36).slice(-3)).toUpperCase()
  }

  allowSuper (imageName) {
    return imageName
  }

  startProcess (imageName, startContext) { // : { pid: PosisPID; process: IPosisProcess; } | undefined {
    let id = this.UID();
    let pinfo = {
      i: id,
      p: this.currentId,
      n: imageName,
      s: C$1.PROC_RUNNING,
      S: Game.time,
      x: this.allowSuper(imageName)
    };
    this.processTable[id] = pinfo;
    this.processMemory[pinfo.i] = startContext || undefined;
    let process = this.createProcess(id);
    this.log.debug(() => `startProcess ${imageName}`);
    this.scheduler.addProcess(pinfo);
    return { pid: id, process }
  }

  queryPosisInterface (ext) {
    return this.extensionRegistry.getExtension(ext)
  }

  queryPosisInterfaceSuper (ext) {
    if (ext === 'JuicedOS/kernel') {
      return this
    }
    return this.extensionRegistry.getExtension(ext)
  }

  createProcess (id) {
    this.log.debug(() => `createProcess ${id}`);
    let pinfo = this.processTable[id];
    if (!pinfo || pinfo.s !== C$1.PROC_RUNNING) throw new Error(`Process ${pinfo.i} ${pinfo.n} not running`)
    const self = this;
    const qpi = pinfo.x ? this.queryPosisInterfaceSuper : this.queryPosisInterface;
    let context = {
      id: pinfo.i,
      get parentId () {
        return (self.processTable[id] && self.processTable[id].pid) || ''
      },
      imageName: pinfo.n,
      log: new Logger$1(`[${pinfo.i}) ${pinfo.n}]`),
      get memory () {
        self.processMemory[pinfo.i] = self.processMemory[pinfo.i] || {};
        return self.processMemory[pinfo.i]
      },
      queryPosisInterface: qpi.bind(self)
    };
    Object.freeze(context);
    let process = this.processRegistry.getNewProcess(pinfo.n, context);
    if (!process) throw new Error(`Could not create process ${pinfo.i} ${pinfo.n}`)
    this.processInstanceCache[id] = { context, process };
    return process
  }

  // killProcess also kills all children of this process
  // note to the wise: probably absorb any calls to this that would wipe out your entire process tree.
  killProcess (id) {
    let pinfo = this.processTable[id];
    if (!pinfo) return
    this.log.warn(() => `killed ${id}`);
    pinfo.s = C$1.PROC_KILLED;
    pinfo.e = Game.time;
    this.interruptHandler.clear(id);
    if (pinfo.p === '') return
    let ids = Object.keys(this.processTable);
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];
      let pi = this.processTable[id];
      if (pi.pid === pinfo.i) {
        if (pi.status === C$1.PROC_RUNNING) {
          this.killProcess(id);
        }
      }
    }
  }

  getProcessById (id) {
    return this.processTable[id] &&
      this.processTable[id].s === C$1.PROC_RUNNING &&
      ((this.processInstanceCache[id] &&
        this.processInstanceCache[id].process) ||
        this.createProcess(id))
  }

  getChildren (id) {
    return map(filter(this.processTable, (p) => p.p === id), (p) => this.getProcessById(p.i))
  }

  // passing undefined as parentId means 'make me a root process'
  // i.e. one that will not be killed if another process is killed
  setParent (id, parentId = 'ROOT') {
    if (!this.processTable[id]) return false
    this.processTable[id].pid = parentId;
    return true
  }

  setInterrupt (type, stage, key) {
    return this.interruptHandler.add(this.currentId, type, stage, key)
  }

  clearInterrupt (type, stage, key) {
    return this.interruptHandler.remove(this.currentId, type, stage, key)
  }
  clearAllInterrupts () {
    return this.interruptHandler.clear(this.currentId)
  }
  runProc (id, func = 'run', ...params) {
    let pinfo = this.processTable[id];
    if (!pinfo) return false
    if (pinfo.s !== C$1.PROC_RUNNING && pinfo.e < Game.time - 5) {
      delete this.processMemory[id];
      delete this.processTable[id];
    }
    if (pinfo.s !== C$1.PROC_RUNNING) return false
    let parentInfo = this.processTable[pinfo.p];
    if (pinfo.p !== 'ROOT' && (!parentInfo || parentInfo.s !== C$1.PROC_RUNNING)) {
      this.killProcess(id);
      pinfo.Eq = 'Missing Parent';
      this.log.error(() => `[${id}] ${pinfo.n} missing parent, reaping.`);
      return false
    }
    if (func === C$1.INT_FUNC.WAKE) {
      delete pinfo.w;
    } else if (pinfo.w > Game.time) {
      return false
    } else {
      delete pinfo.w;
    }
    try {
      let proc = this.getProcessById(id);
      if (!proc) throw new Error(`Could not get process ${id} ${pinfo.n}`)
      if (proc[func]) {
        this.currentId = id;
        proc[func](...params);
        this.currentId = 'ROOT';
      }
      return true
    } catch (e) {
      this.killProcess(id);
      this.currentId = 'ROOT';
      let err = e;
      try {
        err = ErrorMapper.map(err);
      } catch (e) {
        // Couldn't remap
        this.log.warn(() => `Unable to remap error`);
        err = e.stack || e;
      }
      pinfo.Eq = err.toString();
      this.log.error(() => `[${id}] ${pinfo.n} crashed\n${err}`);
      return false
    }
  }
  pretick() {
    this.ktime = 0;
    const start = Game.cpu.getUsed();
    this.mem = this.segments.load(C$1.SEGMENTS.KERNEL);
    this.imem = this.segments.load(C$1.SEGMENTS.INTERRUPT);
    if (this.mem === '') this.mem = {};
    if (this.imem === '') this.imem = {};
    if (Game.time % 10 === this.rand) {
      let ids = Object.keys(this.processMemory);
      this.log.info(`Cleaning Process Memory... (${ids.length} items)`);
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        if (!this.processTable[id] || Object.keys(this.processMemory[id] || {}).length === 0) {
          delete this.processMemory[id];
        }
      }
    }
    if (Game.time % 10 === (this.rand + 5) % 10) {
      let ids = Object.keys(this.processTable);
      this.log.info(`Cleaning Process Table... (${ids.length} items)`);
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        if (this.processTable[id].s !== C$1.PROC_RUNNING) {
          delete this.processTable[id];
        }
      }
    }
    _.each(Memory.creeps, (c, name) => {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    });
    const end = Game.cpu.getUsed();
    this.ktime += end - start;

  }
  loop () {
    let loopStart = Game.cpu.getUsed();
    let procUsed = 0;
    if (this.mem === false || this.imem === false) {
      this.log.warn(`Kernel Segments not loaded. Activating. Break early. ${C$1.SEGMENTS.KERNEL} ${C$1.SEGMENTS.INTERRUPT}`);
      this.segments.activate(C$1.SEGMENTS.KERNEL);
      this.segments.activate(C$1.SEGMENTS.INTERRUPT);
      return
    }
    if (!this.mem.type === 'kernel') {
      this.mem = { type: 'kernel' };
      this.segments.save(C$1.SEGMENTS.KERNEL, this.mem);
    }
    if (!this.imem.type === 'interrupt') {
      this.imem = { type: 'interrupt' };
      this.segments.save(C$1.SEGMENTS.INTERRUPT, this.imem);
    }
    this.memory.processTable = this.memory.processTable || {};
    let interrupts = this.interruptHandler.run(C$1.INT_STAGE.START);
    _.each(interrupts, ([hook, key]) => {
      let start = Game.cpu.getUsed();
      let func = C$1.INT_FUNC[hook.func] || hook.func;
      let ret = this.runProc(hook.pid, func || C$1.INT_FUNC.INTERRUPT, { hook, key });
      let end = Game.cpu.getUsed();
      procUsed += end - start;
      if (ret === false || hook.func === C$1.INT_FUNC.WAKE) {
        this.interruptHandler.remove(hook.pid, hook.type, hook.stage, hook.key);
      }
    });

    let cnt = this.scheduler.setup();
    if (cnt === 0) {
      this.startProcess('init', {});
    }

    let stats = [];
    this.log.debug('loop');
    while (true) {
      let pid = this.scheduler.getNextProcess();
      this.log.debug('pid', pid);
      if (pid === false) { // Hard stop
        _.each(stats, stat => {
          this.log.debug(`-- ${stat.id} ${stat.cpu.toFixed(3)} ${stat.end.toFixed(3)} ${stat.pinfo.n}`);
        });
      }
      if (!pid) break
      this.log.debug('process');
      let start = Game.cpu.getUsed();
      this.runProc(pid);
      let end = Game.cpu.getUsed();
      let dur = end - start;
      let ts;
      let te;
      ts = Game.cpu.getUsed();
      this.scheduler.setCPU(pid, dur.toFixed(3));
      let pinfo = this.getProcessById(pid);
      if (pinfo === false) {
        this.log.info(`Stats collection: PID ${pid} was not found`);
        return
      }
      pinfo.c = dur;
      procUsed += dur;
      te = Game.cpu.getUsed();
      this.log.debug(() => `${pinfo.i} scheduler setCPU ${(te - ts).toFixed(3)}`);
      ts = Game.cpu.getUsed();
      global.stats.addStat('process', {
        name: pinfo.context.imageName
      }, {
        cpu: dur
        // id: pinfo.i,
        // parent: pinfo.p
      });
      te = Game.cpu.getUsed();
      this.log.debug(() => `${pinfo.i} influx addStat ${(te - ts).toFixed(3)}`);
      ts = Game.cpu.getUsed();
      stats.push({
        pinfo,
        cpu: dur,
        id: pinfo.i,
        end,
        parent: pinfo.p
      });
      te = Game.cpu.getUsed();
      this.log.debug(() => `${pinfo.i} stats push ${(te - ts).toFixed(3)}`);
    }
    this.scheduler.cleanup();
    interrupts = this.interruptHandler.run(C$1.INT_STAGE.END);
    _.each(interrupts, ([hook, key]) => {
      let start = Game.cpu.getUsed();
      let func = C$1.INT_FUNC[hook.func] || hook.func;
      let ret = this.runProc(hook.pid, func || C$1.INT_FUNC.INTERRUPT, { hook, key });
      let end = Game.cpu.getUsed();
      procUsed += end - start;
      if (ret === false || hook.func === C$1.INT_FUNC.WAKE) {
        this.interruptHandler.remove(hook.pid, hook.type, hook.stage, hook.key);
      }
    });
    this.segments.save(C$1.SEGMENTS.KERNEL, this.memory);
    this.segments.save(C$1.SEGMENTS.INTERRUPT, this.segments.load(C$1.SEGMENTS.INTERRUPT));
    let loopEnd = Game.cpu.getUsed();
    let loopDur = loopEnd - loopStart;
    this.ktime += loopDur - procUsed;
    if (!RawMemory.segments[C$1.SEGMENTS.KERNEL]) {
      this.log.error('ERROR: Segment not saved! Too big?');
    }
    this.log.info(`CPU Used: ${Game.cpu.getUsed().toFixed(3)}, uptime: ${this.uptime}, ktime: ${this.ktime.toFixed(3)}, ptime: ${procUsed.toFixed(3)}, kmem: ${RawMemory.segments[C$1.SEGMENTS.KERNEL] && RawMemory.segments[C$1.SEGMENTS.KERNEL].length}, imem: ${RawMemory.segments[C$1.SEGMENTS.INTERRUPT] && RawMemory.segments[C$1.SEGMENTS.INTERRUPT].length}`);
  }

  sleep (ticks) {
    this.processTable[this.currentId].w = Game.time + ticks;
    // this.wait(C.INT_TYPE.SLEEP, C.INT_STAGE.START, Game.time + ticks, C.INT_FUNC.WAKE)
  }

  wait (type, stage, key) {
    this.interruptHandler.add(this.currentId, type, stage, key, C$1.INT_FUNC.WAKE);
    this.processTable[this.currentId].w = true;
  }

  reboot () {
    this.extensionRegistry.reboot();
    this.segments.save(C$1.SEGMENTS.KERNEL, {});
    this.segments.posttick();
  }
}

let logger = new Logger$1('[ProcessRegistry]');
logger.level = Logger$1.LogLevel.DEBUG;

class ProcessRegistry {
  constructor () {
    this.registry = {}; // { [name: string]: PosisProcessConstructor } = {}
  }
  register (name, constructor) {
    if (this.registry[name]) {
      logger.error(`Name already registered: ${name}`);
      return false
    }
    logger.debug(`Registered ${name}`);
    this.registry[name] = constructor;
    return true
  }
  install (bundle) {
    bundle.install(this);
  }
  getNewProcess (name, context) {
    if (!this.registry[name]) return
    logger.debug(`Created ${name}`);
    return new this.registry[name](context)
  }
}

let logger$1 = new Logger$1('[ExtensionRegistry]');
logger$1.level = Logger$1.LogLevel.DEBUG;

class ExtensionRegistry {
  constructor () {
    this.registry = {}; // [interfaceId: string]: IPosisExtension } = {}
    this.pre = [];
    this.post = [];
    this.register('JuicyExtensionRegistry', this);
    this.register('Juicy/ExtensionRegistry', this);
  }
  register (interfaceId, extension) {
    if (this.registry[interfaceId]) {
      logger$1.warn(`Interface Id already registered: ${interfaceId}`);
    }
    logger$1.debug(`Registered ${interfaceId}`);
    this.registry[interfaceId] = extension;
    if (extension instanceof ExtensionRegistry) return
    if (typeof extension.register === 'function') {
      extension.register();
    }
    if (typeof extension.pretick === 'function') {
      this.pre.push(() => extension.pretick());
    }
    if (typeof extension.posttick === 'function') {
      this.post.unshift(() => extension.posttick());
    }
    return true
  }
  getExtension (interfaceId) {
    if (!this.registry[interfaceId]) return
    return this.registry[interfaceId]
  }
  pretick() {
    this.pre.forEach(fn => fn());
  }
  posttick() {
    this.post.forEach(fn => fn());
  }
  reboot() {
    Object.keys(this.registry)
      .map(k => this.registry[k])
      .filter(ext => ext.onreboot)
      .forEach(ext => ext.onreboot());
  }
}

const RUN_CRONS = true;
const RUN_PROCESS_TREE_DUMP = true;


const config$1 = {
  services: [
    {
      id: 'cron',
      name: 'JuicedProcesses/cron',
      params: {},
      restart: true,
      enabled: RUN_CRONS
    },
    {
      id: 'Colony',
      name: 'JuicedProcesses/Colony',
      params: {},
      restart: true,
      enabled: true
    },
    {
      id: 'spawnManager',
      name: 'spawn/manager',
      params: {},
      restart: true,
      enabled: true
    },
    {
      id: 'processTreeDump',
      name: 'processTreeDump',
      params: {},
      restart: true,
      enabled: RUN_PROCESS_TREE_DUMP
    },
  ]
};

// interface IInitMemory {
//   posisTestId?: PosisPID,
//   sleepTestId?: PosisPID,
//   msg?: string,
//   services: { [id: string]: ServiceDefinition }
// }

// export interface ServiceDefinition {
//   restart: boolean
//   name: string
//   context: any
//   status: 'started' | 'stopped'
//   pid?: PosisPID
// }

class Init {
  constructor (context) {
    this.context = context;
    this.kernel = context.queryPosisInterface('baseKernel');
    this.sleep = context.queryPosisInterface('sleep');
    forEach(config$1.services, ({ id, name, params, restart, enabled }) => {
      this.addService(id, name, params, restart, enabled);
    });
  }
  get id () {
    return this.context.id
  }
  get log () {
    return this.context.log
  }
  get memory () {
    return this.context.memory
  }
  get services () {
    this.memory.services = this.memory.services || {};
    return this.memory.services
  }

  run () {
    this.log.info(`TICK! ${Game.time}`);
    this.manageServices();
    this.sleep.sleep(10);
  }

  addService (id, name, context = {}, restart = false, enabled = true) {
    this.services[id] = this.services[id] || {};
    Object.assign(this.services[id], {
        name,
        context,
        restart,
        enabled
    });
  }

  manageServices () {
    forEach(this.services, (service, id) => {
      let proc;
      this.log.info(`serv ${service.name}, ${service.status}, ${service.pid}, ${!!proc}`);
      if (service.pid) proc = this.kernel.getProcessById(service.pid);
      if (!service.enabled) {
        if (service.pid) {
          this.log.info(`Killing stopped process ${service.name} ${service.pid}`);
          this.kernel.killProcess(service.pid);
        }
        service.status = 'stopped';
      }
      if (service.enabled) {
        if (!proc) {
          service.status = 'stopped';
          if (service.restart || !service.pid) {
            let { pid } = this.kernel.startProcess(service.name, Object.assign({}, service.context));
            service.pid = pid;
            service.status = 'started';
          }
        }
      } else {
        if (proc || service.status === 'started') {
          this.log.info(`Killing stopped process ${service.name} ${service.pid}`);
          this.kernel.killProcess(service.pid);
        }
      }
    });
  }
}

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter$1(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

class ProcessTreeDump {
  constructor (context) {
    this.context = context;
    this.kernel = context.queryPosisInterface('JuicedOS/kernel');
  }

  get log () {
    return this.context.log
  }

  run () {
    let pt = this.kernel.processTable;
    let tree = `Process Tree:`;
    tree += this.getTree(pt, 'ROOT');
    this.log.info(tree);
  }

  getTree (pt, parent, prefix = '|') {
    let children = filter$1(pt, ({ p }) => p === parent);
    return children.map(p => {
      if (p.s !== C$1.PROC_RUNNING) return
      let desc; 
      try {
        desc = this.kernel.getProcessById(p.i).toString();
      } catch (e) {
        desc = e.message || e.toString();
      }
      let ret = `\n${prefix}- ${p.i} ${p.n} ${desc}`;
      ret += this.getTree(pt, p.i, `  ${prefix}`);
      return ret
    }).join('')
  }

  interrupt ({ hook: { type, stage }, key }) {
    this.log.info(`INT ${type} ${stage} ${key}`);
  }

  wake () {
    this.log.info('I Have awoken!');
  }
}

/**
 * The base implementation of `_.gt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than `other`,
 *  else `false`.
 */
function baseGt(value, other) {
  return value > other;
}

/**
 * This method is like `_.max` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * _.maxBy(objects, function(o) { return o.n; });
 * // => { 'n': 2 }
 *
 * // The `_.property` iteratee shorthand.
 * _.maxBy(objects, 'n');
 * // => { 'n': 2 }
 */
function maxBy(array, iteratee) {
  return (array && array.length)
    ? baseExtremum(array, baseIteratee(iteratee, 2), baseGt)
    : undefined;
}

/** Built-in value references. */
var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, [function(o) { return o.user; }]);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 */
var sortBy = baseRest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

class SpawnManager {
  constructor (context) {
    this.context = context;
    this.sleeper = this.context.queryPosisInterface('sleep');
    this.spawn = this.context.queryPosisInterface('spawn');
    this.kernel = this.context.queryPosisInterface('JuicedOS/kernel');
  }
  get id () { return this.context.id }
  get memory () {
    return this.context.memory
  }
  get log () {
    return this.context.log
  }
  get queue () {
    return this.spawn.queue
  }
  get status () {
    return this.spawn.status
  }

  run () {
    this.context.log.info(`Sleeping for 5 ticks (${Game.time})`);
    //this.sleeper.sleep(5)
    this.cleanup();
    if (this.queue.length) {
      let spawns = filter$1(Game.spawns, (spawn) => !spawn.spawning && spawn.isActive());
      for (let qi = 0; qi < this.queue.length; qi++) {
        let queue = this.queue[qi];
        let drop = [];
        for (let i = 0; i < queue.length; i++) {
          if (!spawns.length) break
          let item = queue[i];
          let status = this.status[item.statusId];
          try {
            if (item.pid && !this.kernel.getProcessById(item.pid)) {
              throw new Error('Spawning Process Dead')
            }
            let bodies = item.body.map(b => b.join());
            let orphans = this.spawn.getOrphans(item.rooms);
            for (let i in bodies) {
              let body = bodies[i];
              const [orphan] = orphans[body] || [];
              if (orphan) {
                delete this.status[orphan];
                status.name = orphan;
                status.status = C$1.EPosisSpawnStatus.SPAWNING;
                this.log.info(`Assigning orphan ${orphan} to ${item.statusId}`);
                this.spawn.getCreep(item.statusId);
              }
            }
            if (status.status === C$1.EPosisSpawnStatus.QUEUED) {
              let cspawns = map$1(spawns, (spawn, index) => {
                let dist = item.rooms && item.rooms[0] && (Game.map.getRoomLinearDistance(spawn.room.name, item.rooms[0]) || 0);
                let energy = spawn.room.energyAvailable;
                let rank = energy - (dist * 100);
                if (item.maxRange && item.maxRange < dist) {
                  rank -= 10000;
                }
                if (spawn.room.storage && spawn.room.storage.store.energy < 10000) {
                  rank -= 10000;
                }
                return { index, dist, energy, rank, spawn }
              });
              cspawns = sortBy(cspawns, (s) => s.rank);
              let bodies = map$1(item.body, (body) => {
                let cost = reduce(body, (l, v) => l + C$1.BODYPART_COST[v], 0);
                return { cost, body }
              });
              let { index, energy, spawn } = cspawns.pop();
              let { body } = maxBy(filter$1(bodies, (b) => b.cost <= energy), 'cost') || { body: false };
              if (!body) continue
              spawns.splice(index, 1);
              let ret = spawn.spawnCreep(body, item.statusId, { memory: { _p: this.kernel.currentId } });
              this.context.log.info(`Spawning ${item.statusId}`);
              if (ret === C$1.OK) {
                status.status = C$1.EPosisSpawnStatus.SPAWNING;
              } else {
                status.status = C$1.EPosisSpawnStatus.ERROR;
                status.message = this.spawnErrMsg(ret);
              }
            }
          } catch (e) {
            status.status = C$1.EPosisSpawnStatus.ERROR;
            status.message = e.message || e;
          }
          drop.push(i);
        }
        while (drop.length) {
          queue.splice(drop.pop(), 1);
        }
        if (queue.length) break
      }
    }
  }
  cleanup () {
    let keys = Object.keys(this.status);
    forEach(keys, k => {
      if (!this.status[k]) return
      let { name, status } = this.status[k];
      if (status !== C$1.EPosisSpawnStatus.QUEUED && !Game.creeps[name || k]) {
        delete this.status[k];
      }
    });
  }
  spawnErrMsg (err) {
    let errors = {
      [C$1.ERR_NOT_OWNER]: 'You are not the owner of this spawn.',
      [C$1.ERR_NAME_EXISTS]: 'There is a creep with the same name already.',
      [C$1.ERR_BUSY]: 'The spawn is already in process of spawning another creep.',
      [C$1.ERR_NOT_ENOUGH_ENERGY]: 'The spawn and its extensions contain not enough energy to create a creep with the given body.',
      [C$1.ERR_INVALID_ARGS]: 'Body is not properly described.',
      [C$1.ERR_RCL_NOT_ENOUGH]: 'Your Room Controller level is insufficient to use this spawn.'
    };
    return errors[err]
  }
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY$2 || value === -INFINITY$2) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$2 = 9007199254740991;

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Invokes the iteratee `n` times, returning an array of the results of
 * each invocation. The iteratee is invoked with one argument; (index).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.times(3, String);
 * // => ['0', '1', '2']
 *
 *  _.times(4, _.constant(0));
 * // => [0, 0, 0, 0]
 */
function times(n, iteratee) {
  n = toInteger(n);
  if (n < 1 || n > MAX_SAFE_INTEGER$2) {
    return [];
  }
  var index = MAX_ARRAY_LENGTH,
      length = nativeMin(n, MAX_ARRAY_LENGTH);

  iteratee = castFunction(iteratee);
  n -= MAX_ARRAY_LENGTH;

  var result = baseTimes(length, iteratee);
  while (++index < n) {
    iteratee(index);
  }
  return result;
}

// import { posisInterface } from "../common"

// interface SpawnManagerMemory {
//   queue: SpawnQueueItem[][],
//   status: SpawnQueueStatus
// }

const PRIORITY_COUNT = 10;

class SpawnExtension {
  get memory () {
    let mem = Memory.spawnSys = Memory.spawnSys || {};
    // this.mm.load(C.SEGMENTS.SPAWN)
    // if (mem !== false && (!mem.type === 'interrupt' || typeof mem === 'string')) {
    //   mem = { type: 'interrupt' }
    //   this.mm.save(C.SEGMENTS.INTERRUPT, mem)
    // }
    return mem
  }
  constructor (extensionRegistry) {
    if (!C$1.SEGMENTS.SPAWN) {
      C$1.addSegment('SPAWN');
    }
    this.extensionRegistry = extensionRegistry;
    this.kernel = extensionRegistry.getExtension('JuicedOS/kernel');
    this.mm = extensionRegistry.getExtension('segments');
    this.interrupt = extensionRegistry.getExtension('interrupt');
    if (this.memory === false) {
      this.mm.activate(C$1.SEGMENTS.SPAWN);
    }
  }
  get queue () {
    if (this.memory === false) return []
    if (!this.memory.queue || this.memory.queue.length !== PRIORITY_COUNT) {
      this.memory.queue = times(PRIORITY_COUNT, () => []);
    }
    this.memory.queue = this.memory.queue || [];
    return this.memory.queue
  }
  get queueLength () {
    let cnt = 0;
    for(const queue of this.queue) {
      cnt += queue.length;
    }
    return cnt
  }
  get status () {
    if (this.memory === false) return {}
    this.memory.status = this.memory.status || {};
    return this.memory.status
  }
  UID () {
    return ('C' + Game.time.toString(36).slice(-4) + Math.random().toString(36).slice(-2)).toUpperCase()
  }
  // Queues/Spawns the creep and returns an ID
  spawnCreep ({ rooms, body, priority = 5, maxRange = 10 }) {
    priority = Math.min(Math.max(priority, 0), 9);
    let bodies = body.map(b => b.join());
    let orphans = this.getOrphans(rooms);
    for (let i in bodies) {
      let body = bodies[i];
      const [orphan] = orphans[body] || [];
      if (orphan) {
        this.status[orphan] = {
          name: orphan,
          status: C$1.EPosisSpawnStatus.SPAWNING,
          lastAccess: Game.time
        };
        console.log(`Orphan returned ${orphan}`);
        this.getCreep(orphan);
        return orphan
      }
    }
    let uid = this.UID();
    let item = {
      statusId: uid,
      rooms,
      body,
      priority,
      maxRange,
      pid: this.kernel.currentId
    };
    this.queue[priority].push(item);
    this.status[uid] = {
      status: C$1.EPosisSpawnStatus.QUEUED,
      lastAccess: Game.time
    };
    return uid
  }
  getOrphans (rooms) {
    let returnMe = {};
    // let stats = {}
    // each(this.status, (stat, id) => stats[stat.name || id] = stat)
    for (let id in Game.creeps) {
      const creep = Game.creeps[id];
      // const { lastAccess = 0, status } = stats[id]
      if (!creep.memory._p || !this.kernel.getProcessById(creep.memory._p)) {
        if (rooms && !rooms.includes(creep.pos.roomName)) continue
        const body = creep.body.map(b => b.type).join();
        returnMe[body] = returnMe[body] || [];
        returnMe[body].push(id);
      }  
    }
    return returnMe
  }
  // Used to see if its been dropped from queue
  getStatus (id) {
    let stat = this.status[id] || { status: C$1.EPosisSpawnStatus.ERROR, message: `ID ${id} Doesn't Exist` };
    stat.lastAccess = Game.time;
    if (stat.status === C$1.EPosisSpawnStatus.SPAWNING && Game.creeps[id] && !Game.creeps[id].spawning) {
      stat.status = C$1.EPosisSpawnStatus.SPAWNED;
    }
    return stat
  }
  getCreep (id) {
    let stat = this.getStatus(id);
    if (stat.status !== C$1.EPosisSpawnStatus.QUEUED) {
      const creep = Game.creeps[stat.name || id];
      if (creep) {
        creep.memory._p = this.kernel.currentId;
      }
      if (stat.status === C$1.EPosisSpawnStatus.SPAWNED) {
        return creep
      }
    }
  }
  waitForCreep (id) {
    let stat = this.getStatus(id);
    if (stat.status === C$1.EPosisSpawnStatus.SPAWNING) {
      // This WILL NOT WORK!
      this.interrupt.wait(C$1.INT_TYPE.CREEP, C$1.INT_STAGE.START, stat.name || id);
    }
  }
}

const bundle = {
  install (processRegistry, extensionRegistry) {
    processRegistry.register('spawn/manager', SpawnManager);
    extensionRegistry.register('spawn', new SpawnExtension(extensionRegistry));
  }
};

class BaseProcess {
  constructor (context) {
    this.context = context;
    this.kernel = this.context.queryPosisInterface('baseKernel');
    this.spawn = this.context.queryPosisInterface('spawn');
    this.sleep = this.context.queryPosisInterface('sleep');
  }
  get log () {
    return this.context.log
  }
  get memory () {
    return this.context.memory
  }
  get children () {
    this.memory.children = this.memory.children || {};
    return this.memory.children
  }
  get creeps () {
    this.memory.creeps = this.memory.creeps || {};
    return this.memory.creeps
  }
  exit () {
    this.kernel.killProcess(this.id);
  }
  run () {}
  ensureChild (id, name, context) {
    let child = this.children[id];
    let proc;
    if (child) {
      proc = this.kernel.getProcessById(child);
    }
    if (!child || !proc) {
      this.log.info(`Process doesn't exist, spawning ${id} ${name}`);
      let { pid, process } = this.kernel.startProcess(name, context);
      proc = process;
      this.children[id] = pid;
    }
    return proc
  }
  removeChild (id) {
    const child = this.children[id];
    delete this.children[id];
    if (child) {
      this.kernel.killProcess(child);
    }
  }
  cleanChildren () {
    let keys = Object.keys(this.children);
    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];
      let proc = this.kernel.getProcessById(this.children[k]);
      if (!proc) {
        this.children[k] = undefined;
      }
    }
  }
  ensureCreep (id, def) {
    let cid = this.creeps[id];
    let stat = cid && this.spawn.getStatus(cid);
    let complete = stat && (stat.status === C.EPosisSpawnStatus.ERROR || stat.status === C.EPosisSpawnStatus.SPAWNED);
    let bodyTime = def.body[0].length * C.CREEP_SPAWN_TIME;
    let creep = this.spawn.getCreep(cid);
    let dyingOrDead = !creep || creep.ticksToLive < (bodyTime + 10);
    if (!cid || (complete && dyingOrDead)) {
      cid = this.spawn.spawnCreep(def);
      this.log.info(`Creep doesn't exist, spawning ${id} ${cid}`);
    }
    this.creeps[id] = cid;
    return cid
  }
}

const OFFICIAL = {
  allied: {
    'CrazedGod': true,
    'Juicy-Shark': true
  },
  friends: {
  
  }
};

const SHARD = {
  DEFAULT: {
    allied: {'CrazedGod': true,
    'Juicy-Shark': true},
    friends: {}
  },
  shard0: OFFICIAL,
  shard1: OFFICIAL,
  shard2: OFFICIAL,
  screepsplus1: {
    allied: {'CrazedGod': true,
    'Juicy-Shark': true},
    friends: {
      
    }
  }
};

const current = SHARD[Game.shard.name] || SHARD.DEFAULT;

class IFF {
  static isFriend (user) {
    if (current.friends[user]) return true
    if (IFF.isAlly(user)) return true
    else    return false
  }
  static isFoe (user) {
    return !IFF.isFriend(user)
  }
  static isAlly (user) {
    if (current.allied[user]) return true
    else    return false
  }
  static refresh () {
    // TODO: Use segment for server specific lists
    // TODO: Import LOAN segment if available
  }
  static notAlly({ owner: { username } = {}}) {
    return !IFF.isAlly(username)
  }

  static notFriend({ owner: { username } = {}}) {
    return !IFF.isFriend(username)
  }
}

class Room$1 extends BaseProcess {
  constructor (context) {
    super(context);
    this.context = context;
    this.kernel = context.queryPosisInterface('baseKernel');
    this.mm = context.queryPosisInterface('segments');
  }

  get log () {
    return this.context.log
  }

  get memory () {
    return this.context.memory
  }

  get children () {
    this.memory.children = this.memory.children || {};
    return this.memory.children
  }

  get roomName () {
    return this.memory.room
  }

  get room () {
    return Game.rooms[this.roomName]
  }
  

  run () {
    if (!this.room || !this.room.controller || !this.room.controller.my) {
      this.log.warn(`Invalid Room, terminating. (${this.roomName},${JSON.stringify(this.memory)})`);
      this.kernel.killProcess(this.context.id);
    }
    this.sleep.sleep(5);
    const children = [
      ['JuicedProcesses/harvestManager', { room: this.roomName }],
      ['JuicedProcesses/upgradeManager', { room: this.roomName }],
      ['JuicedProcesses/towerDefense', { room: this.roomName }],
      ['JuicedProcesses/layout', { room: this.roomName }] ];
    forEach(children, ([child, context = {}]) => {
      this.ensureChild(child, child, context);
    });
    let [container] = this.room.lookNear(C$1.LOOK_STRUCTURES, this.room.spawns[0].pos)
    .filter((s) => s.structureType === C$1.STRUCTURE_CONTAINER);
    if(container){
    var feeders = 1;
    for (let i = 0; i < feeders; i++) {
      const cid = this.ensureCreep(`feeder_${i}`, {
        rooms: [this.roomName],
        body: [
          this.expand([1, C$1.CARRY, 1, C$1.MOVE])
        ],
        priority: 2
      });

      this.ensureChild(`feeder_${cid}`, 'JuicedProcesses/stackStateCreep', {
        spawnTicket: cid,
        base: ['feeder', this.roomName]
      });
    }
  }

    if (this.room.find(C$1.FIND_MY_CONSTRUCTION_SITES).length) {
      const cid = this.ensureCreep('builder_1', {
        rooms: [this.roomName],
        body: [
          this.expand([2, C$1.CARRY, 1, C$1.WORK, 1, C$1.MOVE])
        ],
        priority: 2
      });
       this.ensureChild(`builder_${cid}`, 'JuicedProcesses/stackStateCreep', {
         spawnTicket: cid,
          base: ['builder', this.roomName]
       });
    }
    const hostiles = this.room.find(C$1.FIND_HOSTILE_CREEPS).filter(IFF.notFriend);
    if (hostiles.length) {
      {
        const cid = this.ensureCreep('protector_1', {
          rooms: [this.roomName],
          body: [
            this.expand([2, C$1.ATTACK, 2, C$1.MOVE]),
            this.expand([1, C$1.ATTACK, 1, C$1.MOVE])
          ],
          priority: 0
        });
        this.ensureChild(`protector_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['protector', this.roomName]
        });
      }
    }

    const attackFlags = filter$1(Game.flags, flag => flag.color === COLOR_RED);
    if(attackFlags.length){   
        const cid = this.ensureCreep('protector_2', {
          rooms: [this.roomName],
          body: [
            this.expand([2, C$1.ATTACK, 2, C$1.MOVE]),
            this.expand([1, C$1.ATTACK, 1, C$1.MOVE])
          ],
          priority: 0
        });
        this.ensureChild(`protector_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['protector', attackFlags[0].pos.roomName]
        });
        attackFlags[0].remove();
    }

    this.cleanChildren();
  }
  toString () {
    return `${this.roomName} ${this.room.level}/${this.room.controller.level}`
  }

  expand (body) {
    this.bodyCache = this.bodyCache || {};
    const cacheKey = body.join('');
    if (this.bodyCache[cacheKey]) {
      return this.bodyCache[cacheKey]
    }
    let cnt = 1;
    const ret = this.bodyCache[cacheKey] = [];
    for (let i in body) {
      const t = body[i];
      if (typeof t === 'number') {
        cnt = t;
      } else {
        for (let ii = 0; ii < cnt; ii++) {
          ret.push(t);
        }
      }
    }
    return ret
  }
}

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

/**
 * The base implementation of `_.invoke` without support for individual
 * method arguments.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {Array} args The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 */
function baseInvoke(object, path, args) {
  path = castPath(path, object);
  object = parent(object, path);
  var func = object == null ? object : object[toKey(last(path))];
  return func == null ? undefined : apply(func, object, args);
}

/**
 * Invokes the method at `path` of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
 *
 * _.invoke(object, 'a[0].b.c.slice', 1, 3);
 * // => [2, 3]
 */
var invoke = baseRest(baseInvoke);

class Colony extends BaseProcess {
  constructor (context) {
    super(context);
    this.context = context;
    this.kernel = context.queryPosisInterface('baseKernel');
    this.mm = context.queryPosisInterface('segments');
  }

  get rooms () {
    this.memory.rooms = this.memory.rooms || {};
    return this.memory.rooms
  }

  run () {
    forEach(Game.rooms, (room, name) => {
      if (!room.controller || !room.controller.my) return
      if (!this.rooms[name]) {
        this.rooms[name] = {};
      }
       });
    forEach(this.rooms, (Room, room) => {
      let proc = this.kernel.getProcessById(Room.pid);
      if (!Game.rooms[room] || !Game.rooms[room].controller || !Game.rooms[room].controller.my) {
        if (proc) {
          this.kernel.killProcess(Room.pid);
        }
        delete this.rooms[room];
      }
      if (!proc) {
        this.log.info(`Room not managed, beginning management of ${room}`);
        let { pid } = this.kernel.startProcess('JuicedProcesses/Room', { room });
        Room.pid = pid;
      }
    });
  
    for (let i = 0; i < 1; i++) {
      let cid = this.ensureCreep(`creep_${i}`, {
        rooms: map$1(filter$1(Game.rooms, r => r.controller && r.controller.my), 'name'),
        body: [[TOUGH, MOVE]],
        priority: 10
      });
      this.ensureChild(`creep_${i}_${cid}`, 'JuicedProcesses/stackStateCreep', {
        spawnTicket: cid,
        base: ['scout']
      });
    }
    if (Game.flags.claim) {
      let { pos: { x, y, roomName } } = Game.flags.claim;
      let room = Game.rooms[roomName];
      if (room && room.controller.my) {
        invoke(room.find(FIND_HOSTILE_STRUCTURES), 'destroy');
        invoke(room.find(FIND_HOSTILE_CONSTRUCTION_SITES), 'remove');
        Game.flags.claim.remove();
      } else {
        let cid = this.ensureCreep(`claimer_${roomName}`, {
          rooms: [roomName],
          body: [[MOVE, CLAIM]],
          priority: 10
        });
        this.ensureChild(`claimer_${roomName}_${cid}`, 'JuicedProcesses/stackStateCreep', {
          spawnTicket: cid,
          base: ['claimer', { x, y, roomName }]
        });
      }
    }
    this.ensureChild('intel', 'JuicedProcesses/intel');
    this.sleep.sleep(5);
  }

  interrupt ({ hook: { type, stage }, key }) {
    this.log.info(`INT ${type} ${stage} ${key}`);
  }

  wake () {
    this.log.info('I Have awoken!');
  }

  toString () {
    let rooms = Object.keys(this.rooms);
    return `Rooms: ${rooms.length}`
  }
}

/**
 * A specialized version of `_.forEachRight` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEachRight(array, iteratee) {
  var length = array == null ? 0 : array.length;

  while (length--) {
    if (iteratee(array[length], length, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * This function is like `baseFor` except that it iterates over properties
 * in the opposite order.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseForRight = createBaseFor(true);

/**
 * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwnRight(object, iteratee) {
  return object && baseForRight(object, iteratee, keys);
}

/**
 * The base implementation of `_.forEachRight` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEachRight = createBaseEach(baseForOwnRight, true);

/**
 * This method is like `_.forEach` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @alias eachRight
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEach
 * @example
 *
 * _.forEachRight([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `2` then `1`.
 */
function forEachRight(collection, iteratee) {
  var func = isArray(collection) ? arrayEachRight : baseEachRight;
  return func(collection, castFunction(iteratee));
}

/**
 * The base implementation of `_.sum` and `_.sumBy` without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {number} Returns the sum.
 */
function baseSum(array, iteratee) {
  var result,
      index = -1,
      length = array.length;

  while (++index < length) {
    var current = iteratee(array[index]);
    if (current !== undefined) {
      result = result === undefined ? current : (result + current);
    }
  }
  return result;
}

/**
 * Computes the sum of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 3.4.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the sum.
 * @example
 *
 * _.sum([4, 2, 8, 6]);
 * // => 20
 */
function sum(array) {
  return (array && array.length)
    ? baseSum(array, identity)
    : 0;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

C$1.addSegment('SPAWN');
C$1.addSegment('INTEL');

C$1.EPosisSpawnStatus = {
  ERROR: -1,
  QUEUED: 0,
  SPAWNING: 1,
  SPAWNED: 2
};

C$1.USER = C$1.USERNAME = Game.spawns.Spawn1 && Game.spawns.Spawn1.owner.username;

// Import global constants
Object.keys(global)
  .filter(k => k === k.toUpperCase())
  .forEach(k => {
    C$1[k] = global[k];
  });

C$1.RECIPES = {};
for (var a$1 in REACTIONS) {
  for (var b$1 in C$1.REACTIONS[a$1]) {
    C$1.RECIPES[C$1.REACTIONS[a$1][b$1]] = [a$1, b$1];
  }
}

const SIGN_MSG = `Territory of Juicy Boys`;


var scout = {
  scout (state = {}) {
    const { room, pos, room: { controller } } = this.creep;
    this.status = pos.toString();
    const user = controller && ((controller.owner && controller.owner.username) || (controller.reservation && controller.reservation.username));
    const friend = user && IFF.isFriend(user) || false;
    const hostile = !friend && controller && controller.level > 0 && !controller.my;

    if (hostile) return this.log.warn(`${room.name} is hostile!`)

    let lastdir = 0;
    if (pos.y === 0) lastdir = C$1.TOP;
    if (pos.y === 49) lastdir = C$1.BOTTOM;
    if (pos.x === 0) lastdir = C$1.LEFT;
    if (pos.x === 49) lastdir = C$1.RIGHT;

    let exits = Game.map.describeExits(room.name);
    let dir = 0;
    while (!exits[dir] || (dir === lastdir && _.size(exits) > 1)) {
      dir = Math.ceil(Math.random() * 8);
    }

    let exit = pos.findClosestByRange(dir);
    let msg =  SIGN_MSG;
    if (!hostile && !friend && controller && (!controller.sign || controller.sign.text !== msg)) {
      this.creep.say('Signing');
      this.push('signController', controller.id, msg);
      this.push('moveNear', controller.pos);
      return this.runStack()
    }
    let roomCallback = `r => r === '${room.name}' ? undefined : false`;
    this.push('move', dir);
    this.push('moveNear', exit, { roomCallback });
    return this.runStack()
  }
};

var protector = {
  protector (target, cache = {}) {
    target = { x: 25, y: 25, roomName: target };
    const tgt = this.resolveTarget(target);
    if (this.creep.pos.roomName !== tgt.roomName) {
      this.push('moveToRoom', tgt);
      return this.runStack()
    }
    const { room, pos } = this.creep;
    const walls = room.find(C$1.FIND_STRUCTURES, {filter: (s) =>s.structureType === STRUCTURE_WALL});
    const hostiles = room.find(C$1.FIND_HOSTILE_CREEPS) || room.find(C$1.FIND_HOSTILE_STRUCTURES || walls.length);
    const hostile = pos.findClosestByRange(hostiles || walls);
    this.push('attack', hostile.id || walls.id);
    this.push('moveNear', hostile.id  || walls.id);
    this.runStack();
  }
};

var upgrader = {
  upgrader (target, cache = {}) {
    if (!cache.work) {
      cache.work = this.creep.getActiveBodyparts(C$1.WORK);
    } 

    const { room, pos, room: { controller } } = this.creep;
    if (this.creep.carry.energy) {
      this.status = 'Upgrading';
      let upCnt = Math.ceil(this.creep.carry.energy / cache.work);
      this.push('repeat', upCnt, 'upgradeController', controller.id);
      this.push('moveInRange', controller.id, 3);
      this.runStack();
    } else {
      this.status = 'Looking for energy';
      let tgt = room.storage || room.containers.find(c => c.store.energy) || room.structures[STRUCTURE_SPAWN] && room.structures[STRUCTURE_SPAWN][0];
      if (tgt) {
        if (tgt.structureType === 'storage' && tgt.store.energy < 10000 && (!controller.ticksToDowngrade || controller.ticksToDowngrade < 10000)) {
          this.push('sleep', Game.time + 10);
          return this.runStack()
        }
        this.push('withdraw', tgt.id, C$1.RESOURCE_ENERGY);
        this.push('moveNear', tgt.id);
        return this.runStack()
      }
    }
  }
};

var builder = {
  builder (target, cache = {}) {
    if (!cache.work) {
      cache.work = this.creep.getActiveBodyparts(C$1.WORK);
    }
    target = { x: 25, y: 25, roomName: target };
    let tgt = this.resolveTarget(target);
    if (this.creep.pos.roomName !== tgt.roomName) {
      this.push('moveToRoom', tgt);
      return this.runStack()
    }
    let { room, pos } = this.creep;
    if (this.creep.carry.energy) {
      this.status = 'Looking for target';
      let sites = this.creep.room.find(C$1.FIND_MY_CONSTRUCTION_SITES);
      if (!sites.length) return this.pop();
      sites = _.sortBy(sites, site => -site.progress / site.progressTotal);
      let site = _.first(sites);
      let hitsMax = Math.ceil(this.creep.carry.energy / (cache.work * C$1.BUILD_POWER));
      this.push('repeat', hitsMax, 'build', site.id);
      this.push('moveInRange', site.id, 3);
      this.runStack();
    } else {
      this.status = 'Looking for energy';
      let tgt = room.storage || room.containers.find(c => c.store.energy) ||  room.structures[STRUCTURE_SPAWN][0] || room.structures[STRUCTURE_SPAWN] || room.structures[STRUCTURE_EXTENSION];
      if (room.storage && room.storage.store.energy < 1000) {
        let { x, y, roomName } = room.storage.pos;
        this.push('repeat',5,'flee', [{ pos: { x, y, roomName }, range: 5 }]);
        return this.runStack()
      }
      if (tgt) {
        //removed sleeping if theres queue in spawn as caused a loop crashing builder process
        if (tgt.structureType ===  STRUCTURE_CONTAINER || STRUCTURE_STORAGE) {
          this.push('withdraw', tgt.id, C$1.RESOURCE_ENERGY);
        this.push('moveNear', tgt.id);
        return this.runStack()
        } else if(tgt.structureType === STRUCTURE_SPAWN || STRUCTURE_EXTENSION && this.creep.room.spawn.queueLength == 0){
          this.push('withdraw', tgt.id, C$1.RESOURCE_ENERGY);
          this.push('moveNear', tgt.id);
          return this.runStack()
        }
      }
    }
  },
  buildAt (type, target, opts = {}) {
    if (!opts.work) {
      opts.work = this.creep.getActiveBodyparts(C$1.WORK);
    }
    const tgt = this.resolveTarget(target);
    if (this.creep.carry.energy) {
      let [site] = tgt.lookFor(C$1.LOOK_CONSTRUCTION_SITES);
      if (!site) {
        let [struct] = tgt.lookFor(C$1.LOOK_STRUCTURES, {
          filter: (s) => s.structureType === type
        });
        if (struct) { // Structure exists/was completed
          this.pop();
          return this.runStack()
        }
        this.creep.say('CSITE');
        return tgt.createConstructionSite(type)
      }
      let hitsMax = Math.ceil(sum(values(this.creep.carry)) / (opts.work * C$1.BUILD_POWER));
      this.push('repeat', hitsMax, 'build', site.id);
      this.runStack();
    } else {
      if (opts.energyState) {
        this.push(...opts.energyState);
        this.runStack();
      } else {
        this.creep.say('T:BLD GTHR');
        this.pop();
      }
    }
  },
  store (res,cache = {}) {
    if (!cache.work) {
      cache.work = this.creep.getActiveBodyparts(C$1.WORK);
    }
    if (!this.creep.carry[res]) {
      this.pop();
      return this.runStack()
    }
    if (cache.work) {
      const road = this.creep.pos.lookFor(C$1.LOOK_STRUCTURES).find(s => s.structureType === C$1.STRUCTURE_ROAD);
      if (road && road.hits <= road.hitsMax < 100) {
        this.creep.repair(road);
      }
      let cs = this.pos.lookFor(C$1.LOOK_CONSTRUCTION_SITES).find(s=>s.structureType === C$1.STRUCTURE_ROAD);
      if (cs) {
        return this.build(cs)
      }
    }
    let [container] = this.creep.room.lookNear(C$1.LOOK_STRUCTURES, this.creep.room.spawns[0].pos)
    .filter((s) => s.structureType === C$1.STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity);
    let tgt = this.creep.room.storage || container || this.creep.room.spawns.find(s => s.energy < s.energyCapacity) || this.creep.room.extensions.find(s => s.energy < s.energyCapacity);
    if (tgt) {
      this.push('transfer', tgt.id, res);
      this.push('moveNear', tgt.id);
      return this.runStack()
    }
  }
};

var feeder = {
  feeder () {
    let { room, pos } = this.creep;
    if (sum(values(this.creep.carry)) === this.creep.carryCapacity) {
      let tgt;
      let types = [STRUCTURE_TOWER, STRUCTURE_EXTENSION, STRUCTURE_SPAWN];
      for (let i = 0; i < types.length; i++) {
        let tgts = (room.structures[types[i]] || []).filter(s => s.energy < s.energyCapacity);
        if (tgts.length) {
          tgt = pos.findClosestByRange(tgts).id;
          break
        }
      }
      if (tgt) {
        this.push('transfer', tgt, C.RESOURCE_ENERGY);
        this.push('moveNear', tgt);
        return this.runStack()
      }
      if (!tgt) {
        tgt = room.storage || room.structures[STRUCTURE_CONTAINER];
        if (tgt && pos.isNearTo(tgt)) {
          this.push('flee', [{ pos: tgt.pos, range: 2 }]);
          return this.runStack()
        }
      }
    } else {
      let tgt;
      if (room.storage && room.storage.store.energy > 50) {
        tgt = room.storage;
      } else {
        let conts = (room.structures[STRUCTURE_CONTAINER] || []).filter(c => c.store.energy);
        if (conts.length) {
          let cont = pos.findClosestByRange(conts);
          tgt = cont;
        }
      }
      if (tgt) {
        if (tgt.store.energy < 50) {
          let { x, y, roomName } = tgt.pos;
          this.push('repeat',5,'flee', [{ pos: { x, y, roomName }, range: 5 }]);
          return this.runStack()
        }
        this.push('withdraw', tgt.id, C.RESOURCE_ENERGY);
        this.push('moveNear', tgt.id);
        return this.runStack()
      } else {
        let list = room.containers;
        if (room.storage) { 
          list.push(room.storage);
        }
        list = list.map(({ pos: { x, y, roomName }}) => ({ pos: { x, y, roomName }, range: 5 }));
        this.push('repeat', 5, 'flee', list);
        return this.runStack()
      }
    }
  }
};

var collector = {
  collector (target, resourceType = C$1.RESOURCE_ENERGY) {
    this.status = 'collector';
    let tgt = this.resolveTarget(target);
    if (!this.creep.carryCapacity) {
      this.status = 'dying';
      this.creep.say('No CARRY', true);
      this.push('suicide');
      return this.runStack()
    }
    if (sum(values(this.creep.carry)) === this.creep.carryCapacity) {
      this.status = 'storing';
      this.push('store', resourceType);
      return this.runStack()
    }
    if (!this.creep.pos.inRangeTo(tgt, 3)) {
      this.status = 'traveling';
      this.log.info(`moveInRange`);
      this.push('moveInRange', target, 3);
      return this.runStack()
    }
    let { x, y } = tgt.pos;
    let resources = this.creep.room.lookNear(C$1.LOOK_RESOURCES, tgt.pos)
      .filter(r => r.resourceType === resourceType);
    if (resources[0]) {
      if(resources[0].amount > 49){
      this.status = 'picking up resource';
      this.push('pickup', resources[0].id);
      this.push('moveNear', resources[0].id);
      return this.runStack()
    }
  }
    let [cont] = this.creep.room.lookNear(C$1.LOOK_STRUCTURES, tgt.pos)
      .filter((s) => s.structureType === C$1.STRUCTURE_CONTAINER && s.store[resourceType]);
    if (cont) {
      if(cont.store[resourceType] < this.creep.carryCapacity) {
        this.status = 'sleeping';
        this.push('sleep', Game.time + 5);
      }
      this.status = 'withdraw';
      this.push('withdraw', cont.id, resourceType);
      this.push('moveNear', cont.id);
      return this.runStack()
    }
  }
};

var claimer = {
  claimer (target, id) {
    let tgt = this.resolveTarget(target);
    if (id) {
      this.push('suicide');
      this.push('say', 'GOT IT!', true);
      this.push('claimController', id);
      this.push('say', 'MINE!', true);
      this.push('moveNear', tgt);
    } else {
      if (this.creep.pos.roomName !== tgt.roomName) {
        this.push('moveToRoom', tgt);
      } else {
        let { controller } = this.creep.room;
        this.push('claimer',controller.pos, controller.id);
      }
    }
    this.runStack();
  },
  moveToRoom (target) {
    let tgt = this.resolveTarget(target);
    if (this.creep.pos.roomName === tgt.roomName) {
      this.pop();
      this.runStack();
    } else {
      this.creep.travelTo(tgt);
    }
  }
};

var miner = {
  miningWorker(target, cache = {}) {
    if (!cache.work) {
      cache.work = this.creep.getActiveBodyparts(C$1.WORK);
    }
    const tgt = this.resolveTarget(target);
    if (!this.creep.pos.isNearTo(tgt)) {
      this.push('moveNear', target);
      return this.runStack()
    }
    if (tgt instanceof RoomPosition) {
      const s = this.creep.pos.findClosestByRange(FIND_SOURCES);
      this.pop();
      this.push('miningWorker', s.id, cache);
      return this.runStack()
    }
    if (_.sum(this.creep.carry) == this.creep.carryCapacity) {
      this.creep.say('Zzzz..');
      return
    }
    if (tgt instanceof Source) {
      if (tgt.energy) {
        this.push('repeat', 5, 'harvest', tgt.id);
        this.push('moveNear', tgt.id);
      } else {
        this.push('sleep', Game.time + tgt.ticksToRegeneration);
      }
      this.runStack();
    }
  },
  miningCollector(target, wgroup, resourceType = C$1.RESOURCE_ENERGY, cache = {}) {
    const tgt = this.resolveTarget(target);
    if (!this.creep.carryCapacity) {
      this.creep.say('No CARRY', true);
      this.push('suicide');
      return this.runStack()
    }
    if (_.sum(_.values(this.creep.carry)) === this.creep.carryCapacity) {
      const room = Game.rooms[this.creep.memory.home];
      const spawn = room.spawns[0];
      const cont = spawn.pos.findClosestByRange(room.containers);
      const tgt = cont || spawn;
      if (cont && cont.store.energy === cont.storeCapacity) {
        this.push('flee', cont, 2);
        return this.runStack()
      } else {
        this.push('transfer', tgt.id, C$1.RESOURCE_ENERGY);
        this.push('moveNear', tgt.id);
      }
      return this.runStack()
    }
    if (!this.creep.pos.inRangeTo(tgt, 2)) {
      this.push('moveInRange', target, 2);
      return this.runStack()
    }
    // let { x, y } = tgt.pos
    // let [{ resource: res } = {}] = this.creep.room.lookForAtArea(C.LOOK_RESOURCES, y - 1, x - 1, y + 1, x + 1, true)
    const resources = this.creep.room.lookNear(C$1.LOOK_RESOURCES, tgt)
      .filter(r => r.resourceType === resourceType);
    if (resources.length) {
      this.push('pickup', resources[0].id);
      this.push('moveNear', resources[0].id);
      return this.runStack()
    }
    let creeps = tgt.findInRange(C$1.FIND_MY_CREEPS, 2);
    console.log(creeps.map(c => c.memory.group === wgroup));
    creeps = creeps.filter(c => c.memory.group === wgroup && c.carry.energy > 10);
    console.log(creeps);
    const creep = this.creep.pos.findClosestByRange(creeps);
    if (creep) {
      const vis = this.creep.room.visual;
      vis.line(creep.pos, this.creep.pos, { color: 'red' });
      vis.circle(creep.pos, { radius: 0.5, stroke: 'red', strokeWidth: 0.2 });
      this.push('revTransfer', creep.id, resourceType);
      this.push('moveNear', creep.id);
      return this.runStack()
    }
    // this.push('sleep', Game.time + 5)
    // return this.runStack()
  }
};

var harvester = {
  harvester (target, cache = {}) {
    if (!cache.work) {
      cache.work = this.creep.getActiveBodyparts(C$1.WORK);
    }
    let tgt = this.resolveTarget(target);
    if (!this.creep.pos.isNearTo(tgt)) {
      this.push('moveNear', target);
      return this.runStack()
    }
    let wantContainer = this.creep.body.length >= 8;
    if (wantContainer) {
      let { x, y, roomName } = this.creep.pos;
      let cont;
      if (cache.cont) {
        cont = Game.getObjectById(cache.cont);
      } else {
        // let conts = this.creep.room.lookForAtArea(C.LOOK_STRUCTURES, y - 1, x - 1, y + 1, x + 1, true)
        let conts = this.creep.room.lookNear(C$1.LOOK_STRUCTURES, tgt.pos)
          .filter(s => s.structureType === C$1.STRUCTURE_CONTAINER);
        cont = this.creep.pos.findClosestByRange(conts);
      }
      if (cont) {
        cache.cont = cont.id;
        if (!this.creep.pos.isEqualTo(cont.pos)) {
          this.push('travelTo', cont.id);
          return this.runStack()
        }
      } else {
        const fullHits = Math.floor(this.creep.carryCapacity / (cache.work * C$1.HARVEST_POWER));
        this.push('buildAt', C$1.STRUCTURE_CONTAINER, { x, y, roomName }, {
          energyState: ['repeat', fullHits, 'harvest', tgt.id]
        });
        return this.runStack()
      }
      if (this.creep.carry.energy >= cache.work &&
      (cont.hitsMax - cont.hits) >= (cache.work * C$1.REPAIR_POWER)) {
        this.push('repair', cont.id);
        return this.runStack()
      }
    }
    if (tgt instanceof Source) {
      if (tgt.energy) {
        this.push('repeat', 5, 'harvest', tgt.id);
        this.push('moveNear', tgt.id);
      } else {
        this.push('sleep', Game.time + tgt.ticksToRegeneration);
      }
      this.runStack();
    }
    if (tgt instanceof Mineral) {
      let [extractor] = tgt.pos.lookFor(C$1.LOOK_STRUCTURES);
      if (!extractor) {
        this.push('sleep', 5);
        this.say('No Extr');
      }
      if (extractor.cooldown) {
        this.push('sleep', Game.time + extractor.cooldown);
        return this.runStack()
      }
      if (tgt.mineralAmount) {
        this.push('sleep', C$1.EXTRACTOR_COOLDOWN);
        this.push('harvest', tgt.id);
        this.push('moveNear', tgt.id);
      } else {
        this.push('sleep', Game.time + tgt.ticksToRegeneration);
      }
      this.runStack();
    }
  }
};

var movement = {
  travelTo (target, opts = {maxOps: 3000}) {
    if (typeof opts.roomCallback === 'string') {
      opts.roomCallback = new Function(opts.roomCallback);
    }
    const tgt = this.resolveTarget(target);
    if (this.creep.pos.isEqualTo(tgt)) {
      this.pop();
      this.runStack();
    } else {
      this.creep.travelTo(tgt, opts);
    }
  },
  moveNear (target, opts = {maxOps: 1500}) {
    if (typeof opts.roomCallback === 'string') {
      opts.roomCallback = new Function(opts.roomCallback);
    }
    let tgt = this.resolveTarget(target);
    if (this.creep.pos.isNearTo(tgt)) {
      this.pop();
      this.runStack();
    } else {
      this.creep.travelTo(tgt, opts);
    }
  },
  moveInRange (target, range) {
    let tgt = this.resolveTarget(target);
    if (this.creep.pos.inRangeTo(tgt, range)) {
      this.pop();
      this.runStack();
    } else {
      this.creep.travelTo(tgt);
    }
  },
  flee (targets) {
    let { path } = PathFinder.search(this.creep.pos, targets, { 
      flee: true,
      roomCallback (room) {
        let cm = new PathFinder.CostMatrix();
        for(let i = 0; i < 2500; i++) {
          cm._bits[i] = 0;
        }
        let r = Game.rooms[room];
        if (r) {
          r.structures.all.forEach(({ structureType, pos: { x, y } }) => {
            if (OBSTACLE_OBJECT_TYPES.includes(structureType)) {
              cm.set(x,y,254);
            }
          });
        }
        return cm
      }
    });
    if (path && path.length) {
      this.creep.moveByPath(path);
    }
    this.pop();
  }
};

var base = {
  say (say, publ = false) {
    this.creep.say(say, publ);
    this.pop();
    this.runStack();
  },
  suicide () {
    this.creep.suicide();
    this.pop();
  },
  attack (target) {
    const tgt = this.resolveTarget(target);
    this.creep.attack(tgt);
    this.pop();
  },
  rangedAttack (target) {
    const tgt = this.resolveTarget(target);
    this.creep.rangedAttack(tgt);
    this.pop();
  },
  heal (target) {
    const tgt = this.resolveTarget(target);
    this.creep.heal(tgt);
    this.pop();
  },
  upgradeController (target) {
    const tgt = this.resolveTarget(target);
    this.creep.upgradeController(tgt);
    this.pop();
  },
  claimController (target) {
    const tgt = this.resolveTarget(target);
    this.creep.claimController(tgt);
    this.pop();
  },
  attackController (target) {
    const tgt = this.resolveTarget(target);
    this.creep.attackController(tgt);
    this.pop();
  },
  signController (target, msg) {
    const tgt = this.resolveTarget(target);
    this.creep.signController(tgt, msg);
    this.pop();
  },
  move (dir) {
    this.creep.move(dir);
    this.pop();
  },
  moveTo (target) {
    const tgt = this.resolveTarget(target);
    this.creep.moveTo(tgt);
    this.pop();
  },
  build (target) {
    const tgt = this.resolveTarget(target);
    this.creep.build(tgt);
    this.pop();
  },
  harvest (target) {
    const tgt = this.resolveTarget(target);
    this.creep.harvest(tgt);
    this.pop();
  },
  repair (target) {
    const tgt = this.resolveTarget(target);
    this.creep.repair(tgt);
    this.pop();
  },
  pickup (target) {
    let tgt = this.resolveTarget(target);
    this.creep.pickup(tgt);
    this.pop();
  },
  withdraw (target, res, amt) {
    let tgt = this.resolveTarget(target);
    this.creep.withdraw(tgt, res, amt);
    this.pop();
  },
  transfer (target, res, amt) {
    let tgt = this.resolveTarget(target);
    this.creep.transfer(tgt, res, amt);
    this.pop();
  }
};

var core = {
  runStack () {
    let [[name, ...args]] = this.stack.slice(-1) || [];
    this.log.debug(() => `runStack: ${name}`);
    let func = this[name];
    if (func) {
      func.apply(this, args);
    } else {
      this.log.error(`Invalid state ${name}`);
      this.kernel.killProcess(this.context.id);
    }
  },
  push (...arg) {
    this.stack.push(arg);
  },
  pop () {
    this.stack.pop();
  },
  noop () {
    this.pop();
  },
  idle (say = 'Idling') {
    this.say(say);
  },
  sleep (until = 0) {
    if (Game.time >= until) {
      this.pop();
      this.runStack();
    }
  },
  loop (states, count = 1) {
    this.pop();
    if (--count > 0) {
      this.push('loop', states, count);
    }
    forEachRight(states, state => this.push(...state));
    this.runStack();
  },
  repeat (count, ...state) {
    this.pop();
    if (count > 0) {
      this.push('repeat', --count, ...state);
    }
    this.push(...state);
    this.runStack();
  },
  resolveTarget (tgt) {
    if (typeof tgt === 'string') {
      return Game.getObjectById(tgt)
    }
    if (tgt.roomName && !(tgt instanceof RoomPosition)) {
      return new RoomPosition(tgt.x, tgt.y, tgt.roomName || tgt.room)
    }
    return tgt
  }
};

let parts = [
  core,
  base,
  movement,
  harvester,
  miner,
  claimer,
  collector,
  feeder,
  protector,
  upgrader,
  builder,
  scout
];

class states {}

parts.forEach(part => {
  for (let k in part) {
    Object.defineProperty(states.prototype, k, { value: part[k] });
  }
});

class StackStateCreep extends states {
  constructor (context) {
    super();
    this.context = context;
    this.kernel = context.queryPosisInterface('baseKernel');
    this.spawn = context.queryPosisInterface('spawn');
  }

  get log () {
    return this.context.log
  }

  get memory () {
    return this.context.memory
  }

  get stack () {
    this.memory.stack = this.memory.stack || [];
    if (!(this.memory.stack instanceof Array)) {
      this.memory.stack = [];
    }
    if (!this.memory.stack.length) {
      this.memory.stack = [this.memory.base || ['idle', 'No State']];
    }
    return this.memory.stack
  }

  get creep () {
    return this.spawn.getCreep(this.memory.spawnTicket)
  }

  run () {
    let start = Game.cpu.getUsed();
    let status = this.spawn.getStatus(this.memory.spawnTicket);
    if (status.status === C$1.EPosisSpawnStatus.ERROR) {
      throw new Error(`Spawn ticket error: ${status.message}`)
    }
    let creep = this.creep;
    if (!creep) {
      if (status.status === C$1.EPosisSpawnStatus.SPAWNED) {
        this.log.info(`Creep dead`);
        return this.kernel.killProcess(this.context.id)
      }
      this.status = `no creep ${status.status}`;
      return this.log.info(`Creep not ready ${status.status}`)// Still waiting on creep
    }
    try {
      this.runStack();
      // this.debug = true
      if (this.debug) {
        this.say(this.stack.slice(-1)[0]);
      }
    } catch (e) {
      this.log.error(`Stack: ${this.stack.map(v => JSON.stringify(v)).join('->')}`);
      throw e
    }
    let end = Game.cpu.getUsed();
    if (creep) {
      creep.room.visual.text(Math.round((end - start) * 100) / 100, creep.pos.x + 1, creep.pos.y, { size: 0.6 });
    }
  }

  toString () {
    return `${this.memory.spawnTicket} ${this.stack.slice(-1)[0]} ${this.status || ''}`
  }
}

class HarvestManager extends BaseProcess {
  constructor (context) {
    super(context);
    this.context = context;
    this.spawner = this.context.queryPosisInterface('spawn');
    this.kernel = this.context.queryPosisInterface('baseKernel');
    this.sleeper = this.context.queryPosisInterface('sleep');
    this.roads = {};
  }

  get room () {
    return Game.rooms[this.memory.room]
  }

  expand (body) {
    let count = 1;
    let returnMe = [];
    for (let a in body) {
      let t = body[a];
      if (typeof t === 'number') {
        count = t;
      } else {
        for (let b = 0; b < count; b++) {
          returnMe.push(t);
        }
      }
    }
    return returnMe
  }

  run () {
    this.sleeper.sleep(5);
    if (typeof this.memory.room === 'undefined') {
      throw new Error('Abort! Room not set')
    }
    if (!this.room) {
      this.log.warn(`No vision in ${this.memory.room}`);
      return
    }
    const spawns = [];
    const spawnQueue = {};
    const census = {};
    const sources = this.room.find(C$1.FIND_SOURCES);
    const minerals = this.room.find(C$1.FIND_MINERALS);
    spawnQueue[this.room.name] = [];
    census[this.room.name] = {};
    const creeps = this.room.find(FIND_MY_CREEPS);
    for(const creep of creeps){
      census[creep.memory.group] = census[creep.memory.group] || 0;
      census[creep.memory.group]++;
    }
    spawns.push(...(this.room.spawns || []));
    forEach(sources, source => {
      const smem = this.room.memory.sources = this.room.memory.sources || {};
      const data = smem[source.id] = smem[source.id] || {};
      data.pos = { roomName: source.pos.roomName, x: source.pos.x, y: source.pos.y };
      data.id = source.id;
      if (this.room.controller.level > 3) {
      const maxParts = Math.min(25, Math.floor(((this.room.energyCapacityAvailable / 50) * 0.8) / 2));
      const needed = Math.max(2, Math.ceil((source.energyCapacity / (C$1.ENERGY_REGEN_TIME / (data.dist * 2))) / 50)) + 2;
      const wantedCarry = Math.ceil(needed / maxParts);
      const wantedWork = Math.min(5, Math.floor((this.room.energyCapacityAvailable - 100) / 100));
      const cbody = this.expand([maxParts, C$1.CARRY, maxParts, C$1.MOVE]);
      const wbody = this.expand([1, C$1.CARRY, 1, C$1.MOVE, wantedWork, C$1.WORK]);
      const cgroup = `${source.id}c`;
      const wgroup = `${source.id}w`;
      const neededCreepsCarry = Math.max(0, wantedCarry - (census[cgroup] || 0));
      const neededCreepsWork = Math.max(0, Math.ceil(5 / wantedWork) - (census[wgroup] || 0));
      this.log.info(`${source.id} ${neededCreepsWork} ${neededCreepsCarry}`);
      if (neededCreepsWork) {
        spawnQueue[this.room.name].push({
          name: wgroup + Game.time,
          body: wbody,
          cost: wbody.reduce((t, p) => t + C$1.BODYPART_COST[p], 0),
          memory: {
            group: wgroup,
            home: this.room.name,
            stack: [['miningWorker', data.pos]]
          }
        });
      }
      if (neededCreepsCarry) {
        spawnQueue[this.room.name].push({
          name: cgroup + Game.time,
          body: cbody,
          cost: cbody.reduce((t, p) => t + C$1.BODYPART_COST[p], 0),
          memory: {
            group: cgroup,
            home: this.room.name,
            stack: [['miningCollector', data.pos, wgroup]]
          }
        });
      }
      for (const spawn of spawns) {
        if (spawn.spawning) continue
        const room = spawn.room;
        const [{ name, body, cost, memory } = {}] = spawnQueue[room.name].splice(0, 1);
        if (!name) continue
        if (spawn.room.energyAvailable < cost) continue
        const spawnTicket = this.ensureCreep(`${source.id}_`);
        log.info(`${spawn.room.name} Spawning ${name} ${memory.group}`);
        spawn.spawnCreep(body, name, { memory });
      }
    } else {
      const hasRoad = this.roads[source.id] && this.roads[source.id].complete;
      const maxParts = this.room.level > 2 && Math.min(hasRoad ? 33 : 25, Math.floor(((this.room.energyCapacity / 50) * 0.80) / 2)) || 1;
      
      const spawnTicket = this.ensureCreep(`${source.id}_harv`, {
        rooms: [this.memory.room],
        body: [
          this.expand([6, C$1.WORK, 3, C$1.MOVE]),
          this.expand([5, C$1.WORK, 3, C$1.MOVE]),
          this.expand([4, C$1.WORK, 3, C$1.MOVE]),
          this.expand([3, C$1.WORK, 2, C$1.MOVE]),
          this.expand([2, C$1.WORK, 1, C$1.MOVE])
        ],
        priority: 2
      });
      this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', { spawnTicket, base: ['harvester', source.id] });

      const dist = (this.roads[source.id] && this.roads[source.id].path.length) || (this.storage && this.storage.pos.findPathTo(s).length) || 30;
     const needed = Math.max(2, Math.ceil((source.energyCapacity / (C$1.ENERGY_REGEN_TIME / (dist * 2))) / 50)) + 2; 
      var wanted = Math.min(Math.ceil(needed / maxParts), 4) / 2;
      //var wanted = 1;
      const cbody = [this.expand([maxParts, C$1.CARRY, hasRoad ? Math.ceil(maxParts / 2) : maxParts, C$1.MOVE])];
      const wbody = [this.expand([maxParts-1, C$1.CARRY, hasRoad ? Math.ceil(maxParts / 2) : maxParts, C$1.MOVE, 1, C$1.WORK])];
      for (let i = 1; i <= wanted; i++) {
        const spawnTicket = this.ensureCreep(`${source.id}_coll_${i+1}`, {
          rooms: [this.memory.room],
          // body: i ? cbody : wbody,
          body : [
            this.expand([6, C$1.CARRY, 6, C$1.MOVE]),
            this.expand([4, C$1.CARRY, 4, C$1.MOVE]),
            this.expand([2, C$1.CARRY, 2, C$1.MOVE]),
            this.expand([1, C$1.CARRY, 1, C$1.MOVE])
          ],
          priority: 3
        });
        this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', { spawnTicket, base: ['collector', source.id] });
      }
        }
          });

    if (CONTROLLER_STRUCTURES[C$1.STRUCTURE_EXTRACTOR][this.room.level]) {      
      forEach(minerals, mineral => {
        let [extractor] = mineral.pos.lookFor(C$1.LOOK_STRUCTURES);
        if (!extractor) {
          let [csite] = mineral.pos.lookFor(C$1.LOOK_CONSTRUCTION_SITES);
          if (!csite) {
            csite = mineral.pos.createConstructionSite(C$1.STRUCTURE_EXTRACTOR);
          }
          return
        }
        {
          let spawnTicket = this.ensureCreep(`${mineral.id}_harv`, {
            rooms: [this.memory.room],
            body: [
              this.expand([49, C$1.WORK, 1, C$1.MOVE]),
              this.expand([40, C$1.WORK, 1, C$1.MOVE]),
              this.expand([30, C$1.WORK, 1, C$1.MOVE]),
              this.expand([25, C$1.WORK, 1, C$1.MOVE]),
              this.expand([20, C$1.WORK, 1, C$1.MOVE]),
              this.expand([15, C$1.WORK, 1, C$1.MOVE]),
              this.expand([10, C$1.WORK, 1, C$1.MOVE]),
            ],
            priority: 8,
            maxRange: 1
          });
          this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', { spawnTicket, base: ['harvester', mineral.id] });
        }
        {
          let spawnTicket = this.ensureCreep(`${mineral.id}_coll_1`, {
            rooms: [this.memory.room],
            body: [
              this.expand([8, C$1.CARRY, 8, C$1.MOVE]),
            ],
            priority: 8,
            maxRange: 1
          });
          this.ensureChild(spawnTicket, 'JuicedProcesses/stackStateCreep', { spawnTicket, base: ['collector', mineral.id, mineral.mineralType] });
        }
      });
    }
    this.buildRoads();
  }
  buildRoads (){
    const sources = this.room.find(C$1.FIND_SOURCES);
    const getStructureMatrix = this.getStructureMatrix;
    forEach(sources, source => {
      const { id } = source;
      if(!this.roads[id] || this.roads[id].expires < Game.time){
        const { storage, controller, spawn } = this.room;
        const target = storage || spawn;
        if (!target) return
        const { path } = PathFinder.search(source.pos,{
          pos: target.pos, 
          range: 1
        },{
          plainCost:2,
          swampCost:5,
          roomCallback(room){ 
            if (!Game.rooms[room]) return
            return getStructureMatrix(Game.rooms[room])
          }
        });
        this.roads[id] = {
          path: path.slice(1).filter(({x, y})=>x > 0 && y > 0 && x < 49 && y < 49),
          expires: Game.time + 50,
          complete: false
        };
      }
      const road = this.roads[id];
      const next = road.path.find(r=>{
        let room = Game.rooms[r.roomName];
        return room && !room.lookForAt(C$1.LOOK_STRUCTURES, r.x, r.y).find(s => s.structureType === C$1.STRUCTURE_ROAD)
      });
      if (next) {
        road.complete = false;
      } else {
        road.complete = true;
        return
      }
      const nextRoom = Game.rooms[next.roomName];
      if (!nextRoom.lookForAt(C$1.LOOK_CONSTRUCTION_SITES, next.x, next.y).length) {
        nextRoom.createConstructionSite(next.x, next.y, STRUCTURE_ROAD);
        road.expires = Game.time;
      }
      nextRoom.visual.poly(road.path.filter(r => r.roomName === nextRoom.name).map(r => [r.x,r.y]), { liRoomyle: 'dashed', color: '#CCC' });
    });
  }
  getStructureMatrix (room) {
    if(room._structureMatrix && room._structureMatrixTick == Game.time) 
      return room._structureMatrix
    let matrix = new PathFinder.CostMatrix();
    room._structureMatrix = matrix;
    room._structureMatrixTick = Game.time;
    room.find(C$1.FIND_STRUCTURES).forEach(s=>{
      let cost = 0;
      if(isObstacle(s))
        cost = 255;
      if(s.structureType == C$1.STRUCTURE_ROAD)
        cost = 1;
      matrix.set(s.pos.x,s.pos.y,cost);
    });  
    // matrix = room.costMatrixAvoidFlowers(matrix) || matrix
    return matrix
  }
  toString () {
    return this.memory.room
  }
}

function isObstacle(s){
  return !!~C$1.OBSTACLE_OBJECT_TYPES.indexOf(s.structureType) && (s.structureType !== C$1.STRUCTURE_RAMPART || s.my)
}

class UpgradeManager extends BaseProcess {
    constructor (context) {
      super(context);
      this.context = context;
      this.controller = this.context.queryPosisInterface('controller');
      this.kernel = this.context.queryPosisInterface('baseKernel');
      this.sleeper = this.context.queryPosisInterface('sleep');
    }

    get room () {
        return Game.rooms[this.memory.room]
      }

      expand (body) {
        let count = 1;
        let returnMe = [];
        for (let a in body) {
          let t = body[a];
          if (typeof t === 'number') {
            count = t;
          } else {
            for (let b = 0; b < count; b++) {
              returnMe.push(t);
            }
          }
        }
        return returnMe
      }

      run () {
        if (typeof this.memory.room === 'undefined') {
          throw new Error('Abort! Room not set')
        }
        if (!this.room) {
          this.log.warn(`No vision in ${this.memory.room}`);
          return
        }

        if (this.room.controller && this.room.controller.level && this.room.controller.level < 8) {
            let want = 0;
            const stored = this.room.storage && this.room.storage.store.energy || false;
            if (stored === false) {
              want = 1 + Math.floor(this.room.extensions.length / 4);
            } else {
              if (stored > 10000) {
                want = Math.min(3, stored / 10000);
              }
            }
            for(let i = 0; i < want; i++) {
              const cid = this.ensureCreep(`upgrader_${i}`, {
                rooms: [this.roomName],
                body: [
                  this.expand([2, C$1.CARRY, 1, C$1.WORK, 1, C$1.MOVE])
                ],
                priority: 7
              });
              this.ensureChild(`upgrader_${cid}`, 'JuicedProcesses/stackStateCreep', {
                spawnTicket: cid,
                base: ['upgrader', this.roomName]
              });   
            }
          }

      }

}

class TowerDefense extends BaseProcess {
  constructor (context) {
    super(context);
    this.context = context;
  }

  get room () {
    return Game.rooms[this.memory.room]
  }

  expand (body) {
    let cnt = 1;
    let ret = [];
    for (let i in body) {
      let t = body[i];
      if (typeof t === 'number') {
        cnt = t;
      } else {
        for (let ii = 0; ii < cnt; ii++) {
          ret.push(t);
        }
      }
    }
    return ret
  }

  run () {
    const room = this.room;
    if (!room) {
      this.log.warn(`No vision in ${this.memory.room}`);
      return
    }
    const vis = room.visual;
    const hostiles = room.find(FIND_HOSTILE_CREEPS).filter(({ pos: { x, y } }) => x && x !== 49 && y && y !== 49).filter(IFF.notAlly);
    if (hostiles.length) {
      console.log('Hostiles!',hostiles.map(h=>`${h} ${h.owner.username}`));
      room.towers.forEach(tower => {
        const tgt = tower.pos.findClosestByRange(hostiles);
        tower.attack(tgt);
        vis.line(tower.pos, tgt.pos, {
          width: 0.1,
          color: '#FF0000'
        });
        vis.line(tgt.pos.x - 0.4, tgt.pos.y, tgt.pos.x + 0.4, tgt.pos.y, {
          width: 0.1,
          color: '#FF0000',
        });
        vis.line(tgt.pos.x, tgt.pos.y - 0.4, tgt.pos.x, tgt.pos.y + 0.4, {
          width: 0.1,
          color: '#FF0000',
        });
        vis.circle(tgt.pos, {
          radius: 0.4,
          fill: '#dc0000',
          stroke: '#ff0000',
          opacity: 0.3
        });
      });
    } else {
      this.doTowerMaint();
    }    
  }
  doTowerMaint () {
    const room = this.room;
    const roads = room.find(C$1.FIND_STRUCTURES).filter(s => s.structureType === C$1.STRUCTURE_ROAD && s.hits < (s.hitsMax / 2));
    room.towers.forEach(tower => {
      if (tower.energy < (tower.energyCapacity / 2)) return 
      const road = roads.pop();
      if (road) tower.repair(road);
    });
  }
  toString () {
    return this.memory.room
  }
}

class Intel {
  constructor (context) {
    this.context = context;
    this.kernel = context.queryPosisInterface('baseKernel');
    this.sleep = context.queryPosisInterface('sleep');
    this.int = context.queryPosisInterface('interrupt');
    this.segments = context.queryPosisInterface('segments');
  }

  get log () {
    return this.context.log
  }

  run () {
    if (this.segments.load(C$1.SEGMENTS.INTEL) === false) {
      this.segments.activate(C$1.SEGMENTS.INTEL);
      this.int.clearAllInterrupts();
      this.int.wait(C$1.INT_TYPE.SEGMENT, C$1.INT_STAGE.START, C$1.SEGMENTS.INTEL);
    } else {
      this.int.setInterrupt(C$1.INT_TYPE.VISION, C$1.INT_STAGE.START);
      // this.sleep.sleep(10)
    }
    if (Game.flags.map) {
      this.log.warn('Map rendering is enabled');
      this.drawMap();
      this.drawMapImage();
    }
  }

  INTERRUPT ({ hook: { type, stage }, key }) {
    this.log.info(`Collecting intel on ${key}`);
    let room = Game.rooms[key];
    let mem = this.segments.load(C$1.SEGMENTS.INTEL) || {};
    let hr = mem.rooms = mem.rooms || {};
    let {
      name,
      controller: {
        id,
        level,
        pos,
        my,
        safeMode,
        owner: { username: owner } = {},
        reservation: { username: reserver, ticksToEnd } = {}
      } = {}
    } = room;

    let structs = room.structures.all;
    let byType = room.structures;
    let [ mineral ] = room.find(C$1.FIND_MINERALS);
    let { mineralType } = mineral || {};
    let smap = ({ id, pos }) => ({ id, pos });
    let cmap = ({ id, pos, body, hits, hitsMax }) => ({ id, pos, body, hits, hitsMax });
    hr[room.name] = {
      hostile: level && !my,
      name,
      level,
      owner,
      reserver,
      spawns: room.spawns.map(smap),
      towers: room.towers.map(smap),
      walls: room.constructedWalls.length,
      ramparts: room.ramparts.length,
      creeps: room.find(C$1.FIND_HOSTILE_CREEPS).map(cmap),
      safemode: safeMode || 0,
      controller: id && { id, pos },
      sources: room.find(C$1.FIND_SOURCES).map(smap),
      mineral: mineralType,
      ts: Game.time
    };
    this.segments.save(C$1.SEGMENTS.INTEL, mem);
  }
  }

/**
  distanceTransform
    @param {PathFinder.CostMatrix} foregroundPixels - object pixels. modified on output
    @param {number} oob - value used for pixels outside image bounds
    @return {PathFinder.CostMatrix}
  
  This function sets the non-zero positions in the input CostMatrix to the distance*
  to the nearest zero valued position.
  
  *distance is chessboard distance.
    the oob parameter is used so that if an object pixel is at the image boundary
    you can avoid having that reduce the pixel's value in the final output. Set
    it to a high value (e.g., 255) for this. Set oob to 0 to treat out of bounds
    as background pixels.
*/

class Layout extends BaseProcess {
  constructor (context) {
    super(context);
    this.context = context;
    this.kernel = context.queryPosisInterface('baseKernel');
    this.mm = context.queryPosisInterface('segments');
  }

  get roomName () {
    return this.memory.room
  }

  get room () {
    return Game.rooms[this.roomName]
  }

  run () {
    this.flex();
  }

  fixed () {
    
  }

  flex () {
    this.sleep.sleep(10);
    if (_.size(Game.constructionSites) === 100) return
    const room = this.room;
    const { controller: { level } } = this.room;
    let offGrid = [C$1.STRUCTURE_CONTAINER, C$1.STRUCTURE_ROAD];
    let wanted = [C$1.STRUCTURE_TOWER, C$1.STRUCTURE_EXTENSION, C$1.STRUCTURE_STORAGE, C$1.STRUCTURE_SPAWN, C$1.STRUCTURE_TERMINAL];
    let want = _.mapValues(_.pick(C$1.CONTROLLER_STRUCTURES, wanted), level);
    let allSites = room.find(C$1.FIND_MY_CONSTRUCTION_SITES);
    let sites = _.groupBy(allSites, 'structureType');
    let have = _.mapValues(room.structures, 'length');
    if (level > 1) {
      want[C$1.STRUCTURE_CONTAINER] = Math.min(level, C$1.CONTROLLER_STRUCTURES[C$1.STRUCTURE_CONTAINER][level]);
    }
    if (level >= 4) {
      want[C$1.STRUCTURE_CONTAINER] = 0;
    }
    // if (level < 3) {
    //   want[C.STRUCTURE_EXTENSION] = 0
    //   want[C.STRUCTURE_CONTAINER] = 0
    // }
    let src = room.spawns[0] || room.controller;
    for (let type in want) {
      let amount = want[type] - ((have[type] || 0) + (sites[type] || []).length);
      console.log(type, want[type], have[type] || 0, (sites[type] || []).length);
      if (amount <= 0) continue
      let positions = [
        ...allSites,
        ...room.structures.all,
        ...room.find(C$1.FIND_EXIT),
        ...room.find(C$1.FIND_SOURCES)
      ].map(this.getRange);
      console.log(`Want ${amount} of ${type}`);
      let pos = this.findPos(src.pos, positions, offGrid.includes(type));
      if (pos) {
        room.createConstructionSite(pos, type);
        return
      }
    }
  }

  getRange (s) {
    let range = 1;
    let { pos, x, y, roomName } = s;
    if (!pos) pos = { x, y, roomName };
    switch (s.structureType || s.type || '') {
      case '':
      case 'exit':
      case 'controller':
      case 'source':
        range = 3;
        break
      case 'spawn':
        // range = 3
        break
    }
    return { pos, range }
  }

  findPos (origin, avoid, invert = false) {
    console.log('findPos', invert, origin, avoid);
    let result = PathFinder.search(origin, avoid, {
      flee: true,
      roomCallback (room) {
        let cm = new PathFinder.CostMatrix();
        for (let x = 0; x < 50; x++) {
          for (let y = 0; y < 50; y++) {
            let grid = x % 2 === y % 2;
            if (invert) grid = !grid;
            let v = grid && x > 2 && x < 48 && y > 2 && y < 48;
            if (!v) cm.set(x, y, 255);
          }
        }
        avoid.forEach(({ pos: { x, y } }) => cm.set(x, y, 254));
        return cm
      }
    });
    if (result && result.path.length) {
      let vis = new RoomVisual();
      vis.poly(result.path.map(({x, y}) => [x, y]), { stroke: 'red' });
      return result.path.slice(-1)[0]
    }
  }
  toString () {
    return this.roomName
  }
}

var config$2 = {
  crons: [
 
  ]
};

class Cron extends BaseProcess {
  constructor (context) {
    super(context);

    let extensionRegistry = this.context.queryPosisInterface('JuicyExtensionRegistry');
    extensionRegistry.register('cron', this);

    forEach(config$2.crons, ([interval, name, params], ind) => {
      this.addCron(`etc_${ind}`, interval, name, params);
    });
  }

  get crons () {
    this.context.memory.crons = this.context.memory.crons || {};
    return this.context.memory.crons
  }

  run () {
    forEach(this.crons, cron => {
      if (Game.time % cron.interval === cron.offset) {
        try {
          this.kernel.startProcess(cron.name, cron.params);
          this.log.info(`Cron ran ${cron.id} ${cron.name}`);
        } catch (e) {
          this.log.error(`Cron failed to run ${cron.id} ${cron.name} ${e.stack || e}`);
        }
      }
    });
  }

  addCron (id, interval, name, params) {
    let cron = this.crons[id];
    if (cron) {
      Object.assign(cron, { interval, name, params });
    } else {
      this.crons[id] = {
        id,
        interval,
        name,
        params,
        offset: Math.floor(Math.random() * interval)
      };
    }
  }
}

const bundle$1 = {
  install (processRegistry, extensionRegistry) {
    processRegistry.register('JuicedProcesses/Colony', Colony);
    processRegistry.register('JuicedProcesses/Room', Room$1);
    processRegistry.register('JuicedProcesses/stackStateCreep', StackStateCreep);
    processRegistry.register('JuicedProcesses/harvestManager', HarvestManager);
    processRegistry.register('JuicedProcesses/upgradeManager', UpgradeManager);
    processRegistry.register('JuicedProcesses/towerDefense', TowerDefense);
    processRegistry.register('JuicedProcesses/intel', Intel);
    processRegistry.register('JuicedProcesses/layout', Layout);
    processRegistry.register('JuicedProcesses/cron', Cron);
  }
};

const bundle$2 = {
  install (processRegistry, extensionRegistry) {
    processRegistry.register('init', Init);
    processRegistry.register('processTreeDump', ProcessTreeDump);
    bundle.install(processRegistry, extensionRegistry);
    bundle$1.install(processRegistry, extensionRegistry);
  }
};

globals.statsDriver = driver;

const processRegistry = new ProcessRegistry();
const extensionRegistry = new ExtensionRegistry();

extensionRegistry.register('JuicedOS/memHack', MemHack);
extensionRegistry.register('JuicedOS/stats', driver);
extensionRegistry.register('JuicedOS/globals', globals);

const memoryManager = new MemoryManager();
extensionRegistry.register('segments', {
  posttick() { return memoryManager.posttick() },
  load(id) { return memoryManager.load(id) },
  save(id, value) { return memoryManager.save(id, value) },
  activate(id) { return memoryManager.activate(id) }
});

const kernel = new BaseKernel(processRegistry, extensionRegistry);
function extChange(func, oldExt, newExt) {
  const err = new Error(`'${func}' called on ${oldExt}! Use the '${newExt}' extension instead!`);
  const msg = ErrorMapper.map(err);
  kernel.log.warn(msg);
}
extensionRegistry.register('JuicedOS/kernel', kernel);
extensionRegistry.register('baseKernel', {
   pretick() { return kernel.pretick() },
  startProcess(imageName, startContext) {    return kernel.startProcess(imageName, startContext)  },
  killProcess(pid) { return kernel.killProcess(pid)  },
  getProcessById(pid) { return kernel.getProcessById(pid) },
  setParent(pid, parentId) { return kernel.setParent(pid, parentId) },
  sleep (time) { 
    extChange('sleep','baseKernel','sleep');
    return kernel.sleep(time)
  },
  setInterrupt (type, stage, key) { 
    extChange('setInterrupt','baseKernel','interrupt');
    return kernel.setInterrupt(type, stage, key) 
  },
  clearInterrupt (type, stage, key) { 
    extChange('clearInterrupt','baseKernel','interrupt');
    return kernel.clearInterrupt(type, stage, key) 
  },
  clearAllInterrupts () { 
    extChange('clearAllInterrupts','baseKernel','interrupt');
    return kernel.clearAllInterrupts() 
  },
  wait (type, stage, key) { 
    extChange('wait','baseKernel','interrupt');
    return kernel.wait(type, stage, key)
  }
});
extensionRegistry.register('sleep', {
  sleep (time) { return kernel.sleep(time) }
});
extensionRegistry.register('interrupt', {
  setInterrupt (type, stage, key) { return kernel.setInterrupt(type, stage, key) },
  clearInterrupt (type, stage, key) { return kernel.clearInterrupt(type, stage, key) },
  clearAllInterrupts () { return kernel.clearAllInterrupts() },
  wait (type, stage, key) { return kernel.wait(type, stage, key) }
});

bundle$2.install(processRegistry, extensionRegistry);

global.kernel = kernel;
global.stats = driver;
global.C = C$1;

function loop () {
  extensionRegistry.pretick();  
  kernel.loop();
  extensionRegistry.posttick();
  kernel.log.warn(`CPU Used: ${Game.cpu.getUsed().toFixed(4)} (FINAL)`);
  try {
    let { used_heap_size, heap_size_limit, total_available_size } = Game.cpu.getHeapStatistics();
    const MB = (v) => ((v / 1024) / 1024).toFixed(3);
    kernel.log.warn(`HEAP: Used: ${MB(used_heap_size)}MB Available: ${MB(total_available_size)}MB Limit: ${MB(heap_size_limit)}MB`);
  } catch (e) {
    kernel.log.warn('HEAP: Unavailable');
  }
}

exports.loop = loop;
//# sourceMappingURL=main.js.map
