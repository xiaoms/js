(function (global, O) {
    var doc = global.document,
        head = doc && (doc["head"] || doc.getElementsByTagName("head")[0]),
        baseEle = head && head.getElementsByTagName("base")[0],
        scriptQueue = [],
        absoluteUrlReg = /^http(s)*:\/\//,
        anonymousDef = null;

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

    var definedMods = {},
        requireQueue = [],
        failedQueue = [],
        isChecking,
        checkTimeoutId,
        config = {
            baseUrl: "",//模块根目录
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

    function localRequire(deps, callback, errback) {
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


    var require = function (deps, callback, errback, optional) {
        var config;
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

        localRequire(deps, callback, errback);
    };
    global.require = O.require = require;
    global.define = O.define = define;
    O.loadScript = loadScript;
})(window || this, cFly);