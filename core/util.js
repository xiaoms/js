/**
 * Created by admin on 2015/8/20.
 */
var Ctrip=(function(global){
    var op=Object.prototype,
        toString=op.toString,
        hasOwn=op.hasOwnProperty;

    function isFunction(obj){
       return toString.call(obj)==="[object Function]";
    }

    function isArray(obj){
       return toString.call(obj)==="[object Array]";
    }

    function hasProp(obj,prop){
       return hasOwn.call(obj,prop);
    }

    function mix(target,source,override,deepMix){

    }

    function each(obj,func,context){
        if(obj){
        if(isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {
                func.call(context, obj[i], i);
            }
        } else{
            for(var key in obj){
                if(hasProp(obj,key)){
                    func.call(context,obj[key],key);
                }
            }
        }

        }
    }

})(window||this);

