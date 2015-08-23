flyCtrip.define("flyCtrip.notifier", function () {
    var subscribeCache = {},
        tokenPrefix = "__subscribe__";

    /**
     * ����֪ͨ
     * @param {String} what ֪ͨ����
     * @param {Object} args ֪ͨ����
     */
    var publish = function (what, args) {
        var callbacks = subscribeCache[what] || [];
        if (callbacks.length > 0) {
            var i, info = callbacks[0], len = callbacks.length;
            for (i = 0; i < len; callback = info[++i]) {
                if (info && info.callback) {
                    setTimeout(function () {
                        info.callback.call(info.context, args);
                    }, 0);
                }
            }
        }
    };

    /**
     * ����֪ͨ
     * @param {String} what ֪ͨ����
     * @param {Function} callback ֪ͨ�ص�����
     * @param {Object} context callbackִ�л���
     * @returns {String} token:���ĺ�
     */
    var subscribe = function (what, callback, context) {
        if (!callback) {
            return;
        }
        var token = flyCtrip.identifyId(tokenPrefix),
            callbacks = subscribeCache[what];
        var info = {
            token: token,
            callback: callback,
            context: context
        };

        if (!callbacks) {
            callbacks = [];
        }
        callbacks.push(info);
        return token;
    };

    /**
     * �˶�֪ͨ
     * notifier.unsubscribe("CHANGE_EVENT",onChange)  ����what,callback�˶�
     * notifier.unsubscribe("__subscribe__12343")  ���ݶ��ĺ��˶�
     */
    var unsubscribe = function () {
        var args = flyCtrip.makeArray(arguments);
        if (args.length === 0) {
            return;
        }
        var what = args[0],
            token = args.length === 1 && args[0],
            callback = args.length > 1 && args[1];

        var internalRemove = function (what, type, value) {
            var callbacks = subscribeCache[what],
                len = callbacks ? callbacks.length : 0;

            if (len > 0) {
                for (var i = len - 1, info = callbacks[i]; i > 0; info = callbacks[--i]) {
                    if (info && info[type] === value) {
                        callbacks.splice(i, 1);
                    }
                }
            }
        };
        if (token) {
            for (what in subscribeCache) {
                internalRemove(what, "token", token);
            }
        } else {
            internalRemove(what, "callback", callback);
        }
    };
    return {
        publish: publish,
        subscribe: subscribe,
        unsubscribe: unsubscribe
    };
});