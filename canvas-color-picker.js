
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root['ColorPicker'] = factory();
  }
}(this, function () {

    var Helpers = {},
        // 
        // - Utilities
        //
        type = Helpers.type = function(o) {
            return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
        },
        toArray = Helpers.toArray = function(arr) {
            return Array.prototype.slice.call(arr, 0);
        },
        noop = Helpers.noop = function(){

        },
        // micro-template
        tmpl = Helpers.tmpl = (function() {
            var cache = {};

            var tmpl = function tmpl(str, data) {
                var fn = !/[^\w-_]/.test(str) ?
                    cache[str] = cache[str] ||
                    tmpl(document.getElementById(str).innerHTML) :

                    new Function("obj",
                        "var p=[]; with(obj){p.push('" +
                        str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'") + "');}return p.join('');");

                return data ? fn(data) : fn;
            };

            return tmpl;
        })(),
        // jQuery.extend
        extend = Helpers.extend = function(deep, dest, src) {
            var key,
                copy;
            if (deep !== true && deep !== false) {
                src = dest;
                dest = deep;
                deep = false;
            }

            for (key in src) {
                if (src.hasOwnProperty(key)) {
                    copy = src[key];
                    if (deep) {
                        // window.window === window
                        if (dest === copy) {
                            continue;
                        }
                        if (type(copy) === 'object') {
                            dest[key] = arguments.callee(dest[key] || {}, copy);
                        } else if (type(copy) === 'array') {
                            dest[key] = arguments.callee(dest[key] || [], copy);
                        } else {
                            dest[key] = copy;
                        }
                    } else {
                        dest[key] = copy;
                    }
                }
            }
            return dest;
        },
        //
        // - Dom
        //
        toDom = Helpers.toDom = function(html) {
            var container = document.createElement('div');
            container.innerHTML = html;
            return container.children;
        },
        appendHTML = Helpers.appendHTML = function(dom, html) {
            toArray(toDom(html)).forEach(function(child) {
                dom.appendChild(child);
            });
            return dom;
        },
        getElem = Helpers.getElem = function(from, selector) {
            if (type(from) === 'string') {
                selector = from;
                from = document;
            }
            return from.querySelector(selector);
        },
        getElems = Helpers.getElem = function(from, selector) {
            if (type(from) === 'string') {
                selector = from;
                from = document;
            }
            return from.querySelectorAll(selector);
        },
        getElemPos = Helpers.getElemPos = function(elem) {
            var left = 0,
                top = 0;
            while (elem && elem.offsetParent) {
                left += elem.offsetLeft;
                top += elem.offsetTop;
                elem = elem.offsetTParent;
            }
            return {
                x: left,
                y: top
            }
        },
        setCss = Helpers.setCss = function(elem, prop, value) {
            if (type(prop) === 'object') {
                for (var k in prop) {
                    arguments.callee(elem, k, prop[k]);
                }
                return elem;
            }

            prop = prop.replace(/-(\w)/g, function(w, l) {
                return l.toUpperCase();
            });

            elem.style[prop] = value;
            return elem;
        },
        getCss = Helpers.getCss = function(elem, prop) {
            prop = prop.replace(/-(\w)/g, function(w, l) {
                return l.toUpperCase();
            });

            return elem.style[prop];
        },
        //
        // - Color
        //
        rgb2Hex = Helpers.rgb2Hex = function(r, g, b) {
            if (type(r) === 'array') {
                b = r[2];
                g = r[1];
                r = r[0];
            } else if (type(r) === 'object') {
                b = r.b;
                g = r.g;
                r = r.r;
            }

            var getColor = function(c) {
                c = ((+c > 255 ? 255 : c) || 0).toString(16);
                return c.length < 2 ? '0' + c : c;
            }

            return '#' + getColor(r) + getColor(g) + getColor(b);
        },
        hex2Rgb = Helpers.hex2Rgb = function(hex) {
            if (hex.indexOf('#') === 0) {
                hex = hex.substring(1);
            }

            if (hex.length === 3) {
                return hex.split('').map(function(c) {
                    return parseInt(c, 16) * 17;
                });
            } else if (hex.length === 6) {
                var r = hex.slice(0, 2),
                    g = hex.slice(2, 4),
                    b = hex.slice(4, 6);
                return [r, g, b].map(function(c) {
                    return parseInt(c, 16);
                });
            } else {
                return [0, 0, 0];
            }
        };

    // TODO: promise
    function Promise(executor){
        if( this.constructor !== Promise ){
            throw new TypeError('Promise must be constructed via "new"');
        }
        if( type(executor) !== 'function' ){
            throw new TypeError('Executor must be a function');
        }

        this.status = Promise.STATUS.PENDING;
    }

    Promise.STATUS = {
        PENDING: 0,
        FULFILLED: 1,
        REJECTED: 2
    };

    extend(Promise,{
        all: function(){
            var iterable = toArray(arguments);
        },
        race: function(){
            var iterable = toArray(arguments);
        },
        reject: function(reason){

        },
        resolve: function(value){

        }
    })

    extend(Promise.prototype,{
        then: function(onFulfilled,onRejected){

        },
        catch: function(onRejected){

        }
    })

    var magnifierTmpl = [
        '<div id="_magnifier-container" style="position:absolute; width:150px; border:1px solid #F5F5F5; line-height:0; display:none; box-shadow:0 0 2px rgba(0, 0, 0, 0.8); transform:scale(0.8);">',
            '<div class="_magnifier-container" style="background-color:white;">',
                '<canvas class="_magnifier" width="150" height="150"></canvas>',
            '</div>',
            '<div class="_description" style="background-color:#505050; line-height:16px; border-top: 1px solid #F5F5F5; color:#EEE; font-size:12px; text-align:center;">',
                '<p class="_position" style="margin:0px; padding:0px;"></p>',
                '<p class="_color" style="margin:0px; padding:0px;"></p>',
            '</div>',
        '</div>'
    ].join('');

    function ColorPicker(canvas) {
        var cType = type(canvas);
        if (cType === 'htmlcanvaselement' || cType === 'object') {
            this.canvas = canvas;
        } else {
            this.canvas = getElem('#' + canvas);
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.id = canvas;
            }
        }
        this.ctx = this.canvas.getContext('2d');

        var magnifier = getElem('_magnifier-container');
        if (!magnifier) {
            appendHTML(document.body, tmpl(magnifierTmpl, {}));
            magnifier = getElem('#_magnifier-container');
        }
        this.magnifier = magnifier;
        return this;
    }

    ColorPicker.helpers = Helpers;

    extend(ColorPicker.prototype, {
        getColor: function(x, y, colorType) {
            var colorData = this.ctx.getImageData(x, y, 1, 1).data;
            colorType = colorType || 'rgb';
            if (colorType === 'hex') {
                return rgb2Hex(toArray(colorData));
            } else if (colorType === 'object') {
                return {
                    r: colorData[0],
                    g: colorData[1],
                    b: colorData[2],
                    a: (colorData[3] / 255)
                }
            } else if (colorType === 'rgb') {
                return toArray(colorData).slice(0, 3);
            } else if (colorType === 'rgba') {
                colorData = toArray(colorData);
                colorData[3] = ((colorData[3] / 255)*100 >> 0)/100;
                return colorData;
            }
            return colorData;
        },
        getImageData: function(sx,sy,sw,sh){
            return this.ctx.getImageData(sx,sy,sw,sh);
        },
        // http://stackoverflow.com/questions/3448347/how-to-scale-an-imagedata-in-html-canvas#answer-20452240
        scaleImageData: function(imageData,scale){
            var scaled = this.ctx.createImageData(imageData.width * scale, imageData.height * scale);
            var subLine = this.ctx.createImageData(scale, 1).data
            for (var row = 0; row < imageData.height; row++) {
                for (var col = 0; col < imageData.width; col++) {
                    var sourcePixel = imageData.data.subarray(
                        (row * imageData.width + col) * 4,
                        (row * imageData.width + col) * 4 + 4
                    );
                    for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x*4)
                    for (var y = 0; y < scale; y++) {
                        var destRow = row * scale + y;
                        var destCol = col * scale;
                        scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4)
                    }
                }
            }

            return scaled;        
        }
    });


    extend(ColorPicker.prototype, {
        init: function(config) {
            var canvas = this.canvas,
                self = this;

            if( type(config) === 'string' ){
                config = {
                    img: config
                };
            }

            config = extend(true,{
                img: '',
                panelOffset: {
                    x: 5,
                    y: 5
                },
                scaled: 4,
                colorType: 'hex',
                aimerColor: 'rgba(17,85,204,.3)',
                aimerSize: 5
            },config);

            var magnifier = self.magnifier,
                posElem = getElem(magnifier, '._position'),
                colorElem = getElem(magnifier, '._color'),
                magnifierCanvas = getElem(magnifier, 'canvas'),
                magnifierCtx = magnifierCanvas.getContext('2d'),
                viewSize = magnifierCanvas.width/config.scaled;

            self.pos = getElemPos(canvas);

            this.loadImg(config.img, function() {

                function drawMagnifierAimer(ctx){
                    ctx.beginPath();
                    ctx.moveTo(magnifierCanvas.width/2,0);
                    ctx.lineTo(magnifierCanvas.width/2,magnifierCanvas.height);
                    ctx.moveTo(0,magnifierCanvas.height/2);
                    ctx.lineTo(magnifierCanvas.width,magnifierCanvas.height/2);
                    ctx.lineWidth = +config.aimerSize;
                    ctx.strokeStyle = config.aimerColor;
                    ctx.stroke();
                }

                function onmousemove(pageX,pageY,e){
                    var x = pageX - self.pos.x,
                        y = pageY - self.pos.y;

                    if (getCss(self.magnifier,'display') == 'none') {
                        setCss(self.magnifier, {
                            display: 'block'
                        });
                    }
                    setCss(self.magnifier, {
                        top: pageY + config.panelOffset.x + 'px',
                        left: pageX + config.panelOffset.y + 'px'
                    });

                    var imgData = self.getImageData(x-viewSize/2,y-viewSize/2,viewSize,viewSize),
                        color = self.getColor(x,y,config.colorType);
                    magnifierCtx.putImageData(self.scaleImageData(imgData,config.scaled),0,0);
                    drawMagnifierAimer(magnifierCtx);
                    posElem.innerText = '(' + x + ',' + y + ')';
                    switch(config.colorType){
                        case 'rgb':
                            colorElem.innerText = 'RGB:(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
                            break;
                        case 'rgba':
                            colorElem.innerText = 'RGBA:(' + color[0] + ',' + color[1] + ',' + color[2] + ','+ color[3] + ')';
                            break;
                        case 'hex':
                            colorElem.innerText = color;
                            break;
                        default:
                            break;
                    }
                }

                function onmouseleave(){
                    setCss(self.magnifier, {
                        display: 'none'
                    });
                }

                function maybeOnleave(e){
                    var x = e.pageX - self.pos.x,
                        y = e.pageY - self.pos.y;

                    if( inCanvas(x,y) ){
                        onmousemove(x,y,e);
                        return;
                    }

                    onmouseleave();
                }

                function inCanvas(x,y){
                    var relateX = x - self.pos.x,
                        relateY = y - self.pos.y;
                    return relateX > 0 && relateY > 0 && relateX < canvas.width && relateY < canvas.height;
                }

                canvas.addEventListener('mousemove', function(e) {
                    onmousemove(e.pageX,e.pageY,e);
                });

                canvas.addEventListener('mouseleave', function(e) {
                    maybeOnleave(e);
                });

                self.magnifier.addEventListener('mousemove', function(e){
                    maybeOnleave(e);
                });
            });

            return this;
        },
        loadImg: function(src, callback) {
            var img = new Image(),
                canvas = this.canvas,
                ctx = this.ctx;
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                callback && callback(img);
            }
            img.src = src;
            return this;
        },
        update: function(){
            var self = this;
            self.pos = getElemPos(self.canvas);
            return self;
        },
        resize: function(width, height) {
            var canvas = this.canvas,
                imgData = canvas.toDataURL('image/png'),
                img = new Image();
            img.onload = function() {
                canvas.width = width;
                canvas.height = height;
                this.ctx.drawImage(imgData, 0, 0);
            }
            img.src = imgData;
            return canvas;
        }
    });

    return ColorPicker;
}));
