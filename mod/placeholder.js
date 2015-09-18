cFly.define("cFly.placeholder", function () {
    var isSupport = ('placeholder' in document.createElement('input'));

    function focus(el, className) {
        var tipValue = el.getAttribute('placeholder');
        if (el.value === tipValue) {
            el.value = '';
            removeClass(el, className);
        }
    }

    function blur(el, className) {
        var tipValue = el.getAttribute('placeholder');
        if (el.value === tipValue || el.value == '') {
            el.value = tipValue;
            addClass(el, className);
        }
    }

    function getClasseNames(className) {
        return (className || '').match(/\S+/g) || [];
    }

    function addClass(el, className) {
        var oValue = cFly.trim(el.getAttribute("class") || ''),
            target = " " + oValue + " ",
            source = getClasseNames(className),
            i = 0,
            curr;
        while (curr = source[i++]) {
            if ((target).indexOf(" " + curr + " ") < 0) {
                target += curr + " ";
            }
        }
        target = cFly.trim(target);
        if (target !== oValue) {
            el.setAttribute("class", target);
        }
    }

    function removeClass(el, className) {
        var oValue = cFly.trim(el.getAttribute("class") || ''),
            target = " " + oValue + " ",
            source = getClasseNames(className),
            i = 0,
            curr;
        while (curr = source[i++]) {
            while ((target).indexOf(" " + curr + " ") > -1) {
                target = target.replace(" " + curr + " ", " ");
            }
        }
        target = cFly.trim(target);
        if (target !== oValue) {
            el.setAttribute("class", target);
        }
    }

    return {
        fix: function (el, className) {
            if (isSupport || !el || (el.getAttribute("type") && cFly.trim(el.getAttribute("type").toLowerCase()) != "text")) {
                return;
            }
            var els = cFly.makeArray(el),
                className = className || 'watermark',
                e;
            for (var i = 0, l = els.length; i < l; i++) {
                e = els[i];
                if (!e["placeholder_fixed"]) {
                    e["placeholder_fixed"] = true;
                    if (e.addEventListener) {
                        e.addEventListener("focus", function () {
                            focus(e, className);
                        });
                        e.addEventListener("blur", function () {
                            blur(e, className);
                        });
                    } else {
                        e.attachEvent("onfocus", function () {
                            focus(e, className);
                        });
                        e.attachEvent("onblur", function () {
                            blur(e, className);
                        });
                    }
                }
                blur(e, className);
            }
        }
    };
});