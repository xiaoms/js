cFly.define("cFly.notifier", function () {
    var _cache = {},
        tokenPrefix = "";

    /**
     * 发布通知
     * @param {String} type 通知类型
     * @param {Object} args 通知数据
     */
    var notify = function (type, args) {
        var item = _cache[type],
            handlers;

        if (!item) {
            item = _cache[type] = {
                lastData: null,
                handlers: []
            };
        }
        handlers = item.handlers;
        //记录最后一次发送的数据
        item.lastData = args;

        if (handlers.length > 0) {
            var i = 0, info;
            while (info = handlers[i++]) {
                if (info.handler) {
                    try {
                        info.handler.call(info.context, args);
                    } catch (ex) {

                    }
                }
            }
        }
    };

    /**
     * 订阅通知
     * @param {String|Array} types 通知类型
     * @param {Function} callback 通知回调函数
     * @param {Object} context callback执行环境
     * @param {Boolean} exeLastData 是否执行最后一次通知事件
     * @returns {String} token:订阅号
     */
    var register = function (types, handler, context, execLastData) {
        if (!types || !handler) {
            return false;
        }

        //fix argument
        types = cFly.makeArray(types);
        if (typeof context === "boolean") {
            execLastData = context;
            context = null;
        }

        for (var i = 0, l = types.length; i < l; i++) {
            var type = types[i],
                handlers,
                initialized = true,
                token = cFly.guid(tokenPrefix),
                item = _cache[type];
            if (!item) {
                initialized = false;
                item = _cache[type] = {
                    lastData: null,
                    handlers: []
                };
            }
            handlers = item.handlers;
            var info = {
                token: token,
                handler: handler,
                context: context
            };
            handlers.push(info);

            if (execLastData && initialized) {
                try {
                    info.handler.call(info.context, item.lastData);
                } catch (ex) {

                }
            }
        }
        return token;
    };

    /**
     * 退订通知
     * notifier.remove("CHANGE_EVENT",onChange)  根据what,callback退订
     * notifier.remove(10343)  根据订阅号退订
     */
    var remove = function () {
        var args = cFly.makeArray(arguments);
        if (args.length === 0) {
            return;
        }
        var type = args[0],
            token = args.length === 1 && args[0],
            callback = args.length > 1 && args[1];

        var internalRemove = function (type, removeType, value) {
            var item = _cache[type],
                handlers = item.handlers,
                i = handlers ? handlers.length - 1 : 0,
                info;

            while (info = handlers[i--]) {
                if (info && info[removeType] === value) {
                    handlers.splice(i, 1);
                }
            }
        };
        if (token) {
            for (type in _cache) {
                internalRemove(type, "token", token);
            }
        } else {
            internalRemove(type, "callback", callback);
        }
    };
    return {
        EVENTTYPE:{},
        notify: notify,
        register: register,
        remove: remove
    };
});