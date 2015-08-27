/**
 * Created by admin on 2015/8/20.
 */
var cFly = (function (global) {

    var O = {
        version: "1.0"
    };

    var op = Object.prototype,
        toString = op.toString,
        hasOwn = op.hasOwnProperty,
        internalGuid = 0;

    /**
     * 判断obj是否为function
     * @param {Object|Function|Array...} obj
     * @returns {boolean}
     */
    function isFunction(obj) {
        return toString.call(obj) === "[object Function]";
    }

    /**
     * 判断obj是否为数组
     * @param {Object|Function|Array...} obj
     * @returns {boolean}
     */
    function isArray(obj) {
        return toString.call(obj) === "[object Array]";
    }

    /**
     * 判断obj是否为Object
     * @param {Object|Function|Array...} obj
     * @returns {boolean}
     */
    function isObject(obj) {
        return toString.call(obj) === "[object Object]";
    }

    /**
     * 判断Funciton是否是原生函数
     * @param {Function} func 待判断的函数
     * @returns {boolean}
     */
    function isNative(func) {
        console.log(toString.call(func));
        return /^[^{]+\{\s*\[native code/.test(toString.call(func));
    }

    /**
     * 判断对象是否包含prop属性
     * @param {Object} obj 对象
     * @param {String} prop 属性名称
     * @returns {boolean}
     */
    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * 合并对象
     * mix(target, [object...]source, overwrite, deepMix)
     * @param {Object} target 目标对象
     * @param {Object} source 要合并的对象，可以是多个
     * @param {Boolean} override 是否覆盖属性
     * @param {Boolean} deepMix 是否深度合并
     */
    function mix() {
        var args = makeArray(arguments),
            target = args[0],
            source, key, value, i, len = args.length,
            overwrite = len > 2 && args[len - 2] === true,
            deepMix = overwrite && len > 3 && args[len - 1] === true;
        deepMix && len--;
        overwrite && len--;

        for (i = 1; i < len; i++) {
            if (source = args[i]) {
                for (key in source) {
                    value = source[key];
                    if (overwrite || !hasProp(target, key)) {
                        if (deepMix && isObject(value) && value) {
                            if (!hasProp(target, key)) {
                                target[key] = {};
                            }
                            mix(target[key], value, overwrite, deepMix);
                        } else {
                            target[key] = value;
                        }
                    }
                }
            }
        }
    }

    /**
     * 转换成数组（Array）
     * Ctrip.makeArray(null)-->[]
     * Ctrip.makeArray{"msxiao"}-->["msxiao"]
     * Ctrip.makeArray({name:"msxiao"})-->[{name:"msxiao"}]
     * Ctrip.makeArray[arguments]-->[arguments[0],arguments[1]..]
     * @param args 待转换对象
     * @returns {Array}
     */
    function makeArray(args) {
        if (args == null) {
            return [];
        }

        if (isArray(args)) {
            return args;
        }

        var lenType = typeof args.length,
            argsType = typeof args;
        if (lenType !== "number" || argsType === "string") {
            return [args];
        }

        //arguments 并不是数组
        var ret = [];
        for (var i = 0, len = args.length; i < len; i++) {
            ret[i] = args[i];
        }
        return ret;
    }

    mix(O, {
        isNative: isNative,
        isFunction: isFunction,
        isArray: isArray,
        isObject: isObject,
        hasProp: hasProp,
        mix: mix,
        makeArray: makeArray
    });

    mix(O, {
        /**
         * 全局唯一ID
         * @param {String} prefix 前缀
         * @returns {String}
         */
        guid: function (prefix) {
            return ( prefix || "") + (++internalGuid);
        },
        /**
         * 命名空间
         * Ctrip.namespace("Ctrip.Flight")-->Ctrip.Flight={}
         * Ctrip.namespace("window.Ctrip.Flight")-->Ctrip.Flight={}
         * Ctrip.namespace("Ctrip.Flight","Ctrip.Hotel","Ctrip.Train")-->Ctrip.Flight={},Ctrip.Hotel={},Ctrip.Train={}
         * @
         */
        namespace: function () {
            var args = makeArray(arguments),
                o = global,
                p, i, len, j, nlen;

            for (i = 0, len = args.length; i < len; i++) {
                p = ('' + args[i]).split('.');
                for (j = (o[p[0]] === o) ? 1 : 0, nlen = p.length; j < nlen; j++) {
                    o = o[p[j]] = o[p[j]] || {};
                }
            }
            return o;
        },
        /**
         * 枚举对象属性
         * @param {Object} obj 待遍历的对象
         * @param {Function} func 调用函数，return true将跳出循环
         * @param context func执行上下文，不指定，默认为value
         */
        eachProp: function (obj, func, context) {
            if (!obj) {
                return;
            }
            for (var key in obj) {
                if (hasProp(obj, key)) {
                    if (func.call(context || obj[key], obj[key], key)) {
                        break;
                    }
                }
            }
        },
        /**
         * 顺序遍历数组
         * @param {Array} arr 要遍历的数组或对象
         * @param {Function} func 调用函数，return true将跳出循环
         * @param {Object} context func执行上下文，不指定，默认为item
         */
        each: function (arr, func, context) {
            if (!arr || !isArray(arr)) {
                return;
            }
            for (var i = 0, value = arr[i], len = arr.length; i < len; value = arr[++i]) {
                if (func.call(context || value, value, i)) {
                    break;
                }
            }
        },
        /**
         *搜索第一个符合条件的元素
         * @param {Array} arr 待遍历的数组
         * @param {Function} func 条件判断函数，return true将返回该元素
         * @param {Object} context func执行上下文
         * @returns {*} 返回第一个符合条件的元素
         */
        find: function (arr, func, context) {
            if (!arr || !isArray(arr)) {
                return null;
            }
            for (var i = 0, value = arr[i], len = arr.length; i < len; value = arr[++i]) {
                if (func.call(context || value, value, i)) {
                    return value;
                }
            }
        },
        /**
         *搜索所有符合条件的元素
         * @param {Array} arr 待遍历的数组
         * @param {Function} func 条件判断函数，return true将返回该元素
         * @param {Object} context func执行上下文
         * @returns {Array} 返回所有符合条件的元素
         */
        where: function (arr, func, context) {
            if (!arr || !isArray(arr)) {
                return [];
            }
            var ret = [];
            for (var i = 0, value = arr[i], len = arr.length; i < len; value = arr[++i]) {
                if (func.call(context || value, value, i)) {
                    ret.push(value);
                }
            }
            return ret;
        },
    });
    return O;
})(window || this, cFly);


(function (global, O) {
    var doc = global.document,
        head = doc && (doc["head"] || doc.getElementsByTagName("head")[0]),
        baseEle = head && head.getElementsByTagName("base")[0],
        scriptQueue = [],
        defaultContextName = "__default__",
        contexts = [],
        absoluteUrlReg = /^http(s)*:\/\//;

    var getScriptState = function (url) {
        return O.find(scriptQueue, function (value, i) {
            return value.url === url;
        });
    };

    /**
     * cFly.loadScript(url,callback,errorCallback)
     * url[String|Object]：
     * callback：成功时回调
     * errorCallback：失败时回调
     */
    var loadScript = function () {
        var args = O.makeArray(arguments);
        if (args.length === 0) {
            return;
        }
        var defaultcfg = {
            url: "",
            type: "text/javascript",
            charset: "utf-8",
            async: false
        };
        var callback = args.length > 1 && args[1],
            errback = args.length > 2 && args[2],
            cfg = args[0];
        if (typeof cfg === "string") {
            cfg = {url: cfg};
        }
        O.mix(defaultcfg, cfg, true, true);


        var onScriptLoad = function (evt) {
            evt = evt || global.event;
            console.log("readyState:" + node.readyState + ",type:" + evt.type);
            if (evt.type === "load" || /^(complete|loaded)$/.test(node.readyState)) {
                callback && callback();
            }
        }
        var onScriptError = function (evt) {
            evt = evt || global.event;
            errback && errback();
        }

        var node = doc.createElement("script");
        node.charset = defaultcfg.charset;
        node.async = defaultcfg.async;
        node.type = defaultcfg.type;
        node.setAttribute("data-context", "");
        node.onload = node.onreadystatechange = onScriptLoad;
        if (errback) {
            node.onerror = onScriptError;
        }

        node.src = defaultcfg.url;
        if (baseEle) {
            head.insertBefore(node, baseEle);
        } else {
            head.appendChild(node);
        }
        return node;
    }

    var module = function () {

    };

    var cfg = {
        baseUrl: "",//模块根目录
        context: "newContext",//require环境
        isCombineMods: true,//是否合并模块
        preloads: ["jquery"],//预加载模块
        paths: {//模块地址映射
            "jquery": "http://code.jquery.com/jquery-2.1.4.js"
        },
        shim: {
            "cQuery": {
                "exports": "cQuery"
            }
        }
    };

    function createContext(contextName) {
        var definedMods = {},
            requireQueue = [],
            failedQueue = [],
            isChecking,
            checkTimeoutId,
            config = {
                baseUrl: "",//模块根目录
                context: defaultContextName,//require环境
                isCombineMods: true,//是否合并模块
                preloads: ["jquery"],//预加载模块
                paths: {//模块地址映射
                    "jquery": "http://code.jquery.com/jquery-2.1.4.js"
                },
                adapter: {
                    "cQuery": {
                        "exports": "cQuery"
                    }
                }
            };

        function normalizeName(modName) {
            return modName;
        }

        function getModUrl(modName) {
            return config.baseUrl + "/" + modName + ".js";
        }

        function getModMap(deps) {
            var combineUrl = "";
            if (config.isCombineMods) {
                combineUrl = getCombineUrl(deps);
            }
            var map = {};
            O.each(deps, function (value, key) {

                var name = normalizeName(value);
                var url = getModUrl(name);
                var module = {
                    name: name,
                    originalName: value,
                    url: url
                };
                if (config.adapter) {
                    module.adapter = config.adapter[value];
                }
                map[name] = module;
            });
            return map;
        }

        function getCombineUrl(deps) {
            O.each(deps, function (modName, i) {
                normalizeUrl(modName);
            });
            return "http://webresource.c-ctrip.com/flightbook/r2/";
        }

        function checkLoaded(modMap, callback, errback) {
            if (isChecking) {
                return;
            }
            isChecking = true;
            var isloaded = true;
            O.each(modMap, function (mod, key) {
                var state = getModState(mod.name);
                //如果没有初始化，创建script标签进行加载
                if (state === "notinited") {
                    //把mod放入请求的队列
                    requireQueue.push(mod);
                    loadScript(mod.url, function () {
                        //外部模块适配
                        if (mod.adapter && mod.adapter.exports) {
                            mod.exports = eval(mod.adapter.exports);
                            definedMods.push(mod);
                        }
                    }, function () {
                        requireQueue.remove(mod);
                        failedQueue.push(mod);
                    });
                }
                if (state != "defined") {
                    isloaded = false;
                }
            });

            if (isloaded) {
                callback();
            }

            if (!isloaded && checkTimeoutId === 0) {
                checkTimeoutId = setTimeout(function () {
                    checkTimeoutId = 0;
                    checkLoaded(modMap);
                }, 50)
            }
            isChecking = false;
        }

        /**
         * 获取模块状态：notinited,loading,defined,error
         * @param modName
         */
        function getModState(modName) {
            if (definedMods[modName]) {
                return "defined";
            }
            var loading = find(requireQueue, function (value, i) {
                return value.name == modName;
            });
            if (loading) {
                return "loading";
            }
            var failed = find(failedQueue, function (value, i) {
                return value.name == modName;
            });
            if (failed) {
                return "error";
            }
            return "notinited"
        }

        function require(deps, callback, errback) {
            if (deps.length === 0) {
                callback();
                return;
            }
            var modMap = getModMap(deps);
            checkLoaded(modMap, callback, errback);
        }


        function define(name, deps, callback) {
            if (deps.length > 0) {
                require(deps, function () {
                    definedMods[name] = callback.apply(this, this.arguments);
                });
            } else {
                definedMods[name] = callback();
            }
        }

        return {
            contextName: contextName,
            require: require
        };
    };
    var require = function (deps, callback, errback, optional) {
        var config, context, contextName = defaultContextName;
        if (!O.isArray(deps) && typeof deps !== "string") {
            config = deps;
            if (O.isArray(callback)) {
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }
        if (config && config.context) {
            contextName = config.context;
        }
        context = contexts[contextName];
        if (!context) {
            context = contexts[contaxtName] = createContext(contextName);
        }
        context.require(deps, callback, errback);
    };
    global.require = O.require = require;
    global.define = O.define = function (modname, deps, func) {

    };
    O.loadScript = loadScript;
})(window || this, cFly);