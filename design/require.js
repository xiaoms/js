(function () {

    function require(deps, callback, errback) {
        var context = getContext()
        setContextConfig()
        context.require();
    }

    function createContext(cfg) {
        var isChecking,
            checkTimeoutId,
            config = {
                baseUrl: "",//模块根目录
                context: "newContext",//require环境
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
        var definedMods = {},
            requireQueue = [],
            failedQueue = [];

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
            each(deps, function (value, key) {

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
            each(deps, function (modName, i) {
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
            each(modMap, function (mod, key) {
                var state = getModState(mod.name);
                //如果没有初始化，创建script标签进行加载
                if (state === "notinited") {
                    //把mod放入请求的队列
                    requireQueue.push(mod);
                    loadScript(mod.url, function () {
                        //外部模块适配
                        if(mod.adapter&&mod.adapter.exports) {
                            mod.exports=eval(mod.adapter.exports);
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

            if(isloaded){
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
    }

})();
