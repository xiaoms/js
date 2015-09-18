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

    /**
     * �ж�Funciton�Ƿ���ԭ������
     * @param {Function} func ���жϵĺ���
     * @returns {boolean}
     */
    function isNative(func) {
        console.log(toString.call(func));
        return /^[^{]+\{\s*\[native code/.test(toString.call(func));
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
         * ȫ��ΨһID
         * @param {String} prefix ǰ׺
         * @returns {String}
         */
        guid: function (prefix) {
            return ( prefix || "") + (++internalGuid);
        },
        /**
         * �����ռ�
         * Ctrip.namespace("Ctrip.Flight")-->Ctrip.Flight={}
         * Ctrip.namespace("window.Ctrip.Flight")-->Ctrip.Flight={}
         * Ctrip.namespace("Ctrip.Flight","Ctrip.Hotel","Ctrip.Train")-->Ctrip.Flight={},Ctrip.Hotel={},Ctrip.Train={}
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
         * ���鷴ת
         * @param {Array} arr ����ת������
         * @returns {Array} ���ط�ת�������
         */
        reverse: function (arr) {
            if (!arr) {
                return;
            }
            var i = 0, j = arr.length - 1, temp;
            while (i < j) {
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                i++;
                j--;
            }
            return arr;
        },
        /**
         * ö�ٶ�������
         * @param {Object} obj �������Ķ���
         * @param {Function} func ���ú�����return false������ѭ��
         * @param context funcִ�������ģ���ָ����Ĭ��Ϊvalue
         */
        eachProp: function (obj, func, context) {
            if (!obj) {
                return;
            }
            for (var key in obj) {
                if (hasProp(obj, key)) {
                    if (func.call(context || obj[key], obj[key], key) === false) {
                        break;
                    }
                }
            }
        },
        /**
         * ˳���������
         * @param {Array} arr Ҫ��������������
         * @param {Function} func ���ú�����return false������ѭ��
         * @param {Object} context funcִ�������ģ���ָ����Ĭ��Ϊitem
         */
        each: function (arr, func, context) {
            if (!arr || !isArray(arr)) {
                return;
            }
            for (var i = 0, value = arr[i], len = arr.length; i < len; value = arr[++i]) {
                if (func.call(context || value, value, i) === false) {
                    break;
                }
            }
        },
        /**
         *������һ������������Ԫ��
         * @param {Array} arr ������������
         * @param {Function} func �����жϺ�����return true�����ظ�Ԫ��
         * @param {Object} context funcִ��������
         * @returns {*} ���ص�һ������������Ԫ��
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
         *�������з���������Ԫ��
         * @param {Array} arr ������������
         * @param {Function} func �����жϺ�����return true�����ظ�Ԫ��
         * @param {Object} context funcִ��������
         * @returns {Array} �������з���������Ԫ��
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
        /**
         * ɾ���հ�
         * @param value Ҫtrim���ַ���
         * @param chars ȥ��ǰ���ַ���
         */
        trim: function (value, chars) {
            var reg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            if (chars != null) {
                reg = new RegExp('^(' + chars + ')+|(' + chars + ')+$','g');
            }
            return value == null ? "" : (value + "").replace(reg, "");
        }
    });
    return O;
})(window || this, cFly);

