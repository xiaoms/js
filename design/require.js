(function () {

    function require(deps, callback, errback) {
        var context = getContext()
        setContextConfig()
        context.require();
    }

    function createContext(cfg) {
        var config = {
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
        var definedMods = [{
                name: "cQuery",
                url: "http://webresource.c-ctrip.com/code/cquery/cQuery_110421.src.js?ReleaseNo=CR2014_03_17_17_58_39",
                exports: {test: 12},
                deps: []
            }],
            requireQueue = [{
                name: "cQuery",
                url: "http://webresource.c-ctrip.com/code/cquery/cQuery_110421.src.js?ReleaseNo=CR2014_03_17_17_58_39",
                exports: "cQuery",
                deps: []
            }],
            failedQueue = [];

        function normalizeUrl(modName) {

        }

        function getModMap(deps) {
            return {
                cQuery: {
                    name: "cQuery",
                    url: "http://webresource.c-ctrip.com/code/cquery/cQuery_110421.src.js?ReleaseNo=CR2014_03_17_17_58_39",
                    exports: "cQuery",
                    deps: [],
                    state: "loading"
                }
            };
        }

        function getCombineUrl(deps) {
            each(deps, function (modName, i) {
                normalizeUrl(modName);
            });
            return "http://webresource.c-ctrip.com/flightbook/r2/";
        }

        function checkLoaded(modMap) {
            eachProp(modMap, function (value, key) {

            });
        }

        var context = {
            require: function (deps, callback, errback) {
                var combineUrl = "";
                if (this.config.isCombineMods) {
                    combineUrl = getCombineUrl(deps);
                }
                var modMap = getModMap(deps);

            }
        };
    }

    function define(name, deps, callback) {

    }
})();
