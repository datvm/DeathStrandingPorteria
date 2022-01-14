// #region Window

globalThis.sleepAsync = function (ms) {
    return new Promise(r => window.setTimeout(r, ms));
}

// #endregion

// #region String

String.prototype.formatUnicorn = function () {
    let str = this.toString();
    if (arguments.length) {
        const t = typeof arguments[0];

        let args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (let key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

String.prototype.toElement = function () {
    const template = document.createElement("template");
    template.innerHTML = this;
    return template.content.firstElementChild;
}

String.prototype.loc = function () {
    return chrome.i18n.getMessage(this) || this;
}

// #endregion

// #region Node/HTMLElement

Node.prototype.createElement = function (name) {
    const el = document.createElement(name);
    this.appendChild(el);
    return el;
}

Node.prototype.setChildContent = function (selector, content, isHtml) {
    const el = this.querySelector(selector);

    if (el) {
        if (isHtml) {
            el.innerHTML = content;
        } else {
            el.innerText = content;
        }
    }

    return el;
}

Node.prototype.getElValue = function (selector) {
    return this.querySelector(selector).value;
}

Node.prototype.setChildContent = function (selector, content, isHtml) {
    const el = this.querySelector(selector);

    if (el) {
        if (isHtml) {
            el.innerHTML = content;
        } else {
            el.innerText = content;
        }
    }

    return el;
}

Node.prototype.appendScriptAsync = function (source, isModule) {
    return new Promise(resolve => {
        let script = document.createElement('script');
        script.async = 1;
        if (isModule) {
            script.type = "module";
        }

        script.onload = script.onreadystatechange = function (_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;
                script = undefined;

                if (!isAbort) {
                    resolve(script);
                }
            }
        };

        script.src = source;
        this.appendChild(script);
    });
}

Node.prototype.addDelegate = function (eventName, cssMatch, callback) {
    this.addEventListener(eventName, function (e) {
        for (let target = e.target; target && target != this; target = target.parentNode) {
            if (target.matches(cssMatch)) {
                callback(e, target);

                break;
            }
        }
    });
};

Node.prototype.addClick = function (callback) {
    this.addEventListener("click", callback);
    return this;
};

Node.prototype.loc = function () {
    this.querySelectorAll("[data-loc]:not([data-loc-done])").forEach(el => {
        const key = el.getAttribute("data-loc");
        el.innerHTML = key.loc();
        el.setAttribute("data-loc-done", "");
    });
};

Node.prototype.findAttr = function (attr) {
    let result = this.getAttribute(attr);
    if (result) { return result; }

    let el = this.querySelector(`[${attr}]`);
    if (el) { return el.getAttribute(attr); }

    el = this.closest(`[${attr}]`);
    if (el) { return el.getAttribute(attr); }

    return null;
}

Node.prototype.setDisplay = function (display) {
    this.classList.toggle("d-none", !display);
}

Node.prototype.setVisible = function (visible) {
    this.classList.toggle("invisible", !visible);
}

Node.prototype.setContent = function (frag, clear) {
    if (clear || clear === undefined) {
        this.innerHTML = "";
    }

    this.appendChild(frag);
}

// #endregion

// #region Array

Array.prototype.toDict = function (fn) {
    const r = {};
    for (let item of this) {
        r[fn(item)] = item;
    }



    return r;
};

// #endregion
