/**
 * Created by admin on 2015/8/20.
 */
var cFly = (function (global) {

    var O = {
        version: "1.0"
    };
    return O;
})(window || this);

/**
 * ����
 */
(function (global, O) {
    var op = Object.prototype,
        toString = op.toString,
        hasOwn = op.hasOwnProperty,
        identifyId = 0;

    /**
     * �ж�obj�Ƿ�Ϊfunction
     * @param {Object|Function|Array...} obj
     * @returns {boolean}
     */
    function isFunction(obj) {
        return toString.call(obj) === "[object Function]";
    }

    /**
     * �ж�obj�Ƿ�Ϊ����
     * @param {Object|Function|Array...} obj
     * @returns {boolean}
     */
    function isArray(obj) {
        return toString.call(obj) === "[object Array]";
    }

    /**
     * �ж�obj�Ƿ�ΪObject
     * @param {Object|Function|Array...} obj
     * @returns {boolean}
     */
    function isObject(obj) {
        return toString.call(obj) === "[object Object]";
    }

    function isNative(any) {
        return /^[^{]+\{\s*\[native code/.test(toString.call(any));
    }

    /**
     * �ж϶����Ƿ����prop����
     * @param {Object} obj ����
     * @param {String} prop ��������
     * @returns {boolean}
     */
    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * �ϲ�����
     * mix(target, [object...]source, overwrite, deepMix)
     * @param {Object} target Ŀ�����
     * @param {Object} source Ҫ�ϲ��Ķ��󣬿����Ƕ��
     * @param {Boolean} override �Ƿ񸲸�����
     * @param {Boolean} deepMix �Ƿ���Ⱥϲ�
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
     * ת�������飨Array��
     * Ctrip.makeArray(null)-->[]
     * Ctrip.makeArray{"msxiao"}-->["msxiao"]
     * Ctrip.makeArray({name:"msxiao"})-->[{name:"msxiao"}]
     * Ctrip.makeArray[arguments]-->[arguments[0],arguments[1]..]
     * @param args ��ת������
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

        //arguments ����������
        var ret = [];
        for (var i = 0, len = args.length; i < len; i++) {
            ret[i] = args[i];
        }
        return ret;
    }

    mix(O, {
        isFunction: isFunction,
        isArray: isArray,
        isObject: isObject,
        hasProp: hasProp,
        mix: mix,
        makeArray: makeArray
    });

    mix(O, {
        /**
         * ������Id
         * @param {String} prefix ǰ׺
         * @returns {*}
         */
        identifyId: function (prefix) {
            return ( prefix || "") + (++identifyId);
        },
        /**
         * �����ռ�
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
                for (j = (o[p[0]] == o) ? 1 : 0, nlen = p.length; j < nlen; j++) {
                    o = o[p[j]] = o[p[j]] || {};
                }
            }
            return o;
        },
        /**
         * ���������ö�ٶ���
         * @param {Array|Object} arr Ҫ��������������
         * @param {Function} func ���ú�����return true������ѭ��
         * @param {Object} context funcִ�������ģ���ָ����Ĭ��Ϊitem
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
        find: function (arr, func, context) {
            if (!arr || !isArray(arr)) {
                return;
            }
            for (var i = 0, value = arr[i], len = arr.length; i < len; value = arr[++i]) {
                if (func.call(context || value, value, i)) {
                    return value;
                }
            }
        },
        where: function (arr, func, context) {
            if (!arr || !isArray(arr)) {
                return;
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
})(window || this, cFly);

/**
 * event
 */
(function (global, O) {
    function addEventListener(node, eventName, callback) {
        if (node.attachEvent && O.isNative(node.attachEvent)) {
            node.attachEvent("on" + eventName, callback);
        } else {
            node.addEventListener(eventName, callback, false);
        }
    }

    function removeEventListener(node, eventName) {
        if (node.detachEvent && O.isNative(node.detachEvent)) {
            node.detachEvent("on" + eventName, eventName);
        } else {
            node.removeEventListener(eventName, eventName);
        }
    }
})(window || this, cFly);

(function (global, O) {
    var doc = global.document,
        head = doc && (doc["head"] || doc.getElementsByTagName("head")[0]),
        baseEle = head && head.getElementsByTagName("base")[0],
        scriptQueue = [],
        defaultContextName = "__default__",
        absoluteUrlReg = /^http(s)*:\/\//;

    var getScriptState = function (url) {
        return O.find(scriptQueue, function (value, i) {
            return value.url === url;
        });
    };

    /**
     * cFly.loadScript(url,callback,errorCallback)
     * url[String|Object]��
     * callback���ɹ�ʱ�ص�
     * errorCallback��ʧ��ʱ�ص�
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
            errorCallback = args.length > 2 && args[2],
            cfg = args[0];
        if (typeof cfg === "string") {
            cfg = {url: cfg};
        }
        O.mix(defaultcfg, cfg, true, true);

        var scriptInQueue = getScriptState(defaultcfg.url);
        if (scriptInQueue != null) {

        }
        var scriptInfo = {
            url: defaultcfg.url,
            state: "inited"
        };
        scriptQueue.push(scriptInfo);
        var onScriptload = function (evt) {
            if (evt.type === "load" || /^(complete|loaded)$/.test(ele.readyState)) {
                scriptInfo.state = "loaded";
                callback && callback();
            }
        }
        var onScriptError = function (evt) {
            scriptInfo.state = "error";
            errorCallback && errorCallback();
        }

        var ele = doc.createElement("script");
        ele.charset = defaultcfg.charset;
        ele.async = defaultcfg.async;
        ele.type = defaultcfg.type;

        if (ele.attachEvent && O.isNative(ele.attachEvent)) {
            ele.attachEvent("onreadystatechange", onScriptload);
        } else {
            ele.addEventListener("load", onScriptload, false);
            if (errorCallback) {
                ele.addEventListener("error", onScriptError, false);
            }
        }
        ele.src = defaultcfg.url;
        if (baseEle) {
            head.insertBefore(ele, baseEle);
        } else {
            head.appendChild(ele);
        }
        return ele;
    }

    var module = function () {

    };

    var cfg = {
        baseUrl: "",//ģ���Ŀ¼
        context: "newContext",//require����
        isCombineMods: true,//�Ƿ�ϲ�ģ��
        preloads: ["jquery"],//Ԥ����ģ��
        paths: {//ģ���ַӳ��
            "jquery": "http://code.jquery.com/jquery-2.1.4.js"
        },
        shim: {
            "cQuery": {
                "exports": "cQuery"
            }
        }
    };

    var configMod = function (cfg) {

    };

    var require = function (deps, callback, errorback) {

    };
    global.require = O.require = require;
    global.define = O.define = function (modname, deps, func) {

    };
})(window || this, cFly);