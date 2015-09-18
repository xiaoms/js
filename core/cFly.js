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
         * 数组反转
         * @param {Array} arr 待反转的数组
         * @returns {Array} 返回反转后的数组
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
         * 枚举对象属性
         * @param {Object} obj 待遍历的对象
         * @param {Function} func 调用函数，return false将跳出循环
         * @param context func执行上下文，不指定，默认为value
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
         * 顺序遍历数组
         * @param {Array} arr 要遍历的数组或对象
         * @param {Function} func 调用函数，return false将跳出循环
         * @param {Object} context func执行上下文，不指定，默认为item
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
        /**
         * 删除空白
         * @param value 要trim的字符串
         * @param chars 去除前后字符串
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

