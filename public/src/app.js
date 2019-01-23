"use strict";

/* small idb wrapper library */

(function () {
  "use strict";

  function e() {
    return t || (t = new Promise(function (e, n) {
      var t = indexedDB.open("keyval-store", 1);
      t.onerror = function () {
        n(t.error);
      }, t.onupgradeneeded = function () {
        t.result.createObjectStore("keyval");
      }, t.onsuccess = function () {
        e(t.result);
      };
    })), t;
  }

  function n(n, t) {
    return e().then(function (e) {
      return new Promise(function (r, o) {
        var u = e.transaction("keyval", n);
        u.oncomplete = function () {
          r();
        }, u.onerror = function () {
          o(u.error);
        }, t(u.objectStore("keyval"));
      });
    });
  }
  var t,
      r = {
    get: function get(e) {
      var t;
      return n("readonly", function (n) {
        t = n.get(e);
      }).then(function () {
        return t.result;
      });
    },
    set: function set(e, t) {
      return n("readwrite", function (n) {
        n.put(t, e);
      });
    },
    "delete": function _delete(e) {
      return n("readwrite", function (n) {
        n["delete"](e);
      });
    },
    clear: function clear() {
      return n("readwrite", function (e) {
        e.clear();
      });
    },
    keys: function keys() {
      var e = [];
      return n("readonly", function (n) {
        (n.openKeyCursor || n.openCursor).call(n).onsuccess = function () {
          this.result && (e.push(this.result.key), this.result["continue"]());
        };
      }).then(function () {
        return e;
      });
    }
  };
  "undefined" != typeof module && module.exports ? module.exports = r : "function" == typeof define && define.amd ? define("idbKeyval", [], function () {
    return r;
  }) : self.idbKeyval = r;
})();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// updated 25/04/2018


//TODO: fix this

(function () {

	////////////////////////////
	/*    helper functions   */
	///////////////////////////


	// checks if string is url 
	function hakIsUrl(str) {
		var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
		return pattern.test(str);
	}

	// returns an object with properties:
	// width - the width of the screen in pixels
	// height - the height of the screen in pixels
	function hakGetScreenSize() {

		var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

		var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		return {
			width: width,
			height: height
		};
	}

	var hakScreenSize = hakGetScreenSize();

	window.addEventListener('resize', function () {
		hakScreenSize = hakGetScreenSize();
	});

	// hak scope variables that contain css properties
	// to be added to the document head in the next function
	var hasHakStyleEl = false,
	    hakStyleEl,
	    hakStyleElDynamic,
	    hakGlobalStyleList = [],
	    newStylesFunction = [],
	    updateStyles = function updateStyles() {
		newStylesFunctions.forEach(function () {
			f();
		});
	};

	// function that adds css strings to the document head.
	// takes string arguments or functions that are called each time the viewport 
	// changes, that return strings to be added to a style tag in the document header.
	// This function makes it easy to write css in javascript, that reacts to changes in 
	// the viewport size
	function hakAddStyle() {

		function newStyles() {
			var newCss = '';
			hakGlobalStyleList.forEach(function (val) {
				newCss += val(hakScreenSize);
			});
			while (hakStyleElDynamic.firstChild) {
				hakStyleElDynamic.removeChild(hakStyleElDynamic.firstChild);
			}
			if (hakStyleElDynamic.styleSheet) {
				// IE
				hakStyleElDynamic.styleSheet.cssText = newCss;
			} else {
				// the world
				hakStyleElDynamic.appendChild(document.createTextNode(newCss));
			}
		}

		if (!hasHakStyleEl) {
			hakStyleEl = document.createElement('style');
			hakStyleElDynamic = document.createElement('style');
			hakStyleEl.setAttribute('type', 'text/css');
			hakStyleElDynamic.setAttribute('type', 'text/css');
			var head = document.querySelector('head');
			head.appendChild(hakStyleEl);
			head.appendChild(hakStyleElDynamic);
			window.addEventListener('resize', newStyles);
			window.addEventListener('orientationchange', newStyles);
			newStylesFunction.push(newStyles);
			hasHakStyleEl = true;
		}

		var args = arguments;
		for (var i = 0; i < args.length; i++) {
			if (typeof args[i] === 'function') {
				hakGlobalStyleList.push(args[i]);
				if (hakStyleElDynamic.styleSheet) {
					// IE
					hakStyleElDynamic.styleSheet.cssText += args[i](hakScreenSize);
				} else {
					// the world
					hakStyleElDynamic.appendChild(document.createTextNode(args[i](hakScreenSize)));
				}
			}
			if (typeof args[i] === 'string') {
				if (hakStyleEl.styleSheet) {
					// IE
					hakStyleEl.styleSheet.cssText += args[i];
				} else {
					// the world
					hakStyleEl.appendChild(document.createTextNode(args[i]));
				}
			}
		}
	}

	// mounts its first arg, a dom element, to the 'root' element with an id of the second argument, a string.
	// supply a third boolean argument to empty the root element beforehand
	function attachToDom(e, id, empty) {
		if (typeof e === 'string') {
			var el = document.createElement('div');
			el.innerHTML = e;
			e = el;
		}

		id = id || '#root';
		var r = getEl(id);
		if (!r) {
			r = hakEl('div')();
			document.body.appendChild(r);
		}

		while (empty && r.firstChild) {
			r.removeChild(r.firstChild);
		}
		r.appendChild(e);
	}

	function hakIsObj(obj) {
		return obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj);
	}

	// deep merges any number of objects. 
	// The data inside however remains the same
	function hakMerge() {
		var args = arguments,
		    base = args[0],
		    i = 1;

		if (base === {}) {
			base = Object.assign({}, args[1]);
			i++;
		}

		for (; i < args.length; i++) {

			for (var prop in args[i]) {

				if (args[i].hasOwnProperty(prop)) {
					if (hakIsObj(args[i][prop]) && hakIsObj(base[prop])) {
						base[prop] = hakMerge(base[prop], args[i][prop]);
					} else {
						base[prop] = args[i][prop];
					}
				}
			}
		}

		return base;
	}

	function hakClone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	// adds audio elements to the dom, and can force preload them if desired
	function hakAddAudio(fileName, id, reset, dontLoad) {
		var aud = new Audio(fileName + '.mp3');
		aud.setAttribute('id', (id || '') + fileName);

		attachToDom(aud, 'audio', reset);
		if (!dontLoad) aud.preload = 'auto';

		return aud;
	}

	///////////////////////////////////
	// the meat of hak ////////////////
	///////////////////////////////////

	/*
 	This is a small library for quickly adding elements to the DOM 
 	via Javascript. It is a small project and I will definitely be
 	adding more to it. Get the minified version in the next file
 */

	/* declare all the elements that you want to add in via js */

	var hakVariables = {
		fetched: 0,
		htmlTags: ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'bgsound', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nobr', 'noembed', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'plaintext', 'pre', 'progress', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'xmp>']
	};

	// creates an element with the first arg as a tag name
	// then returns a function that takes objects as arguments and adds the properties as attributes to the created element.
	// then returns that element
	// eg. hakEl('div')({class: 'red', style: 'padding-top: 5px;'}, 'dog') 
	// returns <div class='red' style='padding-top: 5xp;'>dog</div>
	// this function will even add raw function onclick, oninput etc events as eventhandlers
	function hakEl(name) {
		return function () {
			var allArgs = arguments;
			var e = document.createElement(name);

			function cycleProps(args) {
				for (var i = 0, l = args.length; i < l; i++) {
					var prop = args[i];

					if (Array.isArray(prop)) {
						if (prop.length !== 0) {
							cycleProps(prop);
							continue;
						}
					}
					if (prop instanceof Node) {
						e.appendChild(prop);
						continue;
					}
					if (typeof prop === 'string') {
						var sp = document.createElement('span');
						sp.innerText += prop;
						e.appendChild(sp);
						continue;
					}
					if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object') {
						for (var attr in prop) {
							if (attr.substring(0, 2) === 'on' && typeof prop[attr] === 'function') {
								e.addEventListener(attr.substring(2), prop[attr], { passive: true });
								continue;
							}
							if (attr === 'class' && e.hasAttribute('class')) {
								e.className += ' ' + attr;
								continue;
							}
							if (prop.hasOwnProperty(attr)) {
								e.setAttribute('' + attr, prop[attr]);
							}
						}
					}
					if (!prop) e.appendChild(document.createElement('span'));
				}
			}

			cycleProps(allArgs);
			return e;
		};
	}

	// shorthand for document.querySelector
	function getEl(id) {
		return document.querySelector(id);
	}

	// attaches all possible hakEl functions to the window with a tag prefix 
	// eg after hakAddTag('_') is called, then globally, h2_({id: 'h2'}, 'ok') will return <h2 id='h2'>ok</h2> 
	// this function allows simulation of jsx but without the need for preprocessors
	function hakAddTag() {
		var HTML = hakVariables.htmlTags,
		    tags = {};

		for (var i = 0, l = HTML.length; i < l; i++) {
			tags[HTML[i]] = hakEl(HTML[i]);
		}

		/* add any additonal functions */
		tags['style'] = function (text) {
			var e = document.createElement('style');
			e.setAttribute('type', 'text/css');
			if (e.styleSheet) {
				// IE
				e.styleSheet.cssText = text;
			} else {
				// the world
				e.appendChild(document.createTextNode(text));
			}
			return e;
		};

		tags['tohtml'] = function (text) {
			var h = tags.div();
			h.innerHTML = text;
			return h;
		};
		return tags;
	}

	// hakComponent, a React like node component that updates its view according to
	// the data it receives from the store, and from its own local state.

	function hakComponent(constructData) {

		if (!constructData.hasOwnProperty('renderChildren')) {
			constructData.renderChildren = function (n) {
				if (!this.children) return null;
				if (n) {
					this.children = this.children.slice(0, n);
				}
				return hakEl('div')({
					style: 'margin: 0; padding: 0;'
				}, this.children.map(function (item, i) {
					return item;
				}));
			};
		}

		if (!constructData.hasOwnProperty('renderRoutes')) {
			constructData.renderRoutes = function () {
				return this.hakRouteNode || hakEl('div')();
			};
		}

		function Component(args) {

			/* initialize children and props */
			this.children = [];
			this.props = {
				style: ''
			};
			var _this = this;

			for (var i = 0, l = args.length; i < l; i++) {
				if (args[i] instanceof Node) {
					this.children.push(args[i]);
					continue;
				}
				if (typeof args[i] === 'string') {
					var sp = document.createElement('span');
					sp.innerText += args[i];
					this.children.push(sp);
					continue;
				}
				if (_typeof(args[i]) === 'object') {
					for (var prop in args[i]) {
						if (args[i].hasOwnProperty(prop)) {
							this.props[prop] = args[i][prop];
						}
					}
				}
			}

			/* add all custom keys */
			for (var key in constructData) {
				if (constructData.hasOwnProperty(key)) {
					if (typeof constructData[key] === 'function') {
						this[key] = constructData[key].bind(this);
					} else {
						this[key] = constructData[key];
					}
				}
			}

			/* initialize state, and bind component to store */

			this.state = this.state || {};
			this.id = this.props.id || this.state.id || 'hakComponent_' + Math.random();
			this.updateKey = 0;
			this.lastUpdate = 0;
			this.update = function () {
				var a = Math.random();
				_this.updateKey = a;
				_this.lastUpdate = a;
			};

			function createNode(firstRender) {
				// redo
				if (_this.shelf) {
					_this.shelf.hakCustomers = false;
				}
				var r = _this.render(),
				    el;

				if (typeof r === 'string') {
					el = hakEl('div')({
						id: _this.id
					});
					el.innerHTML = r;
				} else {
					el = hakEl('div')({
						id: _this.id
					}, r);
				}

				setTimeout(function () {
					if (!firstRender && !document.body.contains(_this.node)) {
						if (_this.hakRouteNodeId === '2') {
							_this.nodeActive = 'r';
						} else {
							_this.nodeActive = false;
						}
					}
					_this.componentDidRender && _this.componentDidRender();
				}, 10);

				return el;
			}

			var buyShelf = function buyShelf(newStuff) {

				if (!_this.nodeActive) {
					return false;
				}

				if (_this.nodeActive === 'r') {
					_this.shelf = hakMerge(_this.shelf, newStuff);
					_this.updateKey = 'needs updating';
					return false;
				}

				_this.shelf = hakMerge(_this.shelf, newStuff);
				hakReplaceNodes(_this.node, createNode());
				_this.update();
				return true;
			};

			var setState = function setState(newStuff) {
				this.state = hakMerge({}, this.state, newStuff);
				hakReplaceNodes(this.node, createNode());
				_this.update();
			};

			// var isNodeActive = function() {
			// 	return document.body.contains(_this.node)
			// }


			this.setState = setState.bind(this);

			this.connectCustomer = function (sub) {
				//console.log('calling sub')
				var subbed = sub(this.id, buyShelf);
				var actions = subbed.actions;
				this.shelf = hakMerge(this.shelf || {}, subbed.shelf);
				for (var prop in actions) {
					if (actions.hasOwnProperty(prop)) {
						this[prop] = actions[prop];
					}
				}
			};

			this.subscribeNew = function (store) {
				if (Array.isArray(store)) {
					for (var i = 0; i < store.length; i++) {
						this.connectCustomer(store[i]);
					}
				} else {
					this.connectCustomer(store);
				}
			};

			if (this.subscribe) {
				if (Array.isArray(this.subscribe)) {
					for (var i = 0; i < this.subscribe.length; i++) {
						this.connectCustomer(this.subscribe[i]);
					}
				} else {
					this.connectCustomer(this.subscribe);
				}
			}
			if (this.props.subscribe) {
				if (Array.isArray(this.props.subscribe)) {
					for (var i = 0; i < this.props.subscribe.length; i++) {
						this.connectCustomer(this.props.subscribe[i]);
					}
				} else {
					this.connectCustomer(this.props.subscribe);
				}
			}

			if (this.props.hakRouteInit) {
				this.hakRouteNodeId = 'Route-' + this.id;
				this.hakRouteNode = hakEl('div')({
					id: this.hakRouteNodeId
				});
				// var update = function() {
				// 	if (_this.lastUpdate !== _this.updateKey) {console.log('updating')
				// 		hakReplaceNodes(this.node, createNode())
				// 		_this.update();
				// 	}
				// 	console.log(_this.lastUpdate, _this.updateKey,'no updating')
				// 	_this.nodeActive = true;
				// }
				this.props.hakRouteInit(this.hakRouteNode /*, update*/);
			}

			this.Constructor && this.Constructor();

			this.render || (this.render = function () {
				return hakEl('div')();
			});

			this.nodeActive = true;
			this.node = createNode(true);
		}

		return function () {
			var c = new Component(arguments);
			c.componentDidMount && setTimeout(c.componentDidMount, 10);
			return c.node;
		};
	}

	function hakAnimate(prev, next) {
		var newStyle = {},
		    className = next.className,
		    cloned = next.cloneNode(true);
		cloned.style.opacity = '0';
		cloned.style.position = 'fixed';
		document.body.appendChild(cloned);

		for (var p in next.style) {
			if (p !== 'transition') {
				newStyle[p] = next.style[p];
			}
		}
		newStyle.height = cloned.offsetHeight + 'px';
		newStyle.width = cloned.offsetWidth + 'px';

		for (var p in prev.style) {
			if (p !== 'transition' && p !== 'parentRule' && p !== 'length') {
				next.style[p] = prev.style[p];
			}
		}
		next.className = prev.className;
		next.style.height = prev.offsetHeight + 'px';
		next.style.width = prev.offsetWidth + 'px';

		next.parentElement.replaceChild(next.cloneNode(true), next);
		prev.parentElement.replaceChild(next, prev);

		setTimeout(function () {
			next.style.transition = next.style.transition || prev.style.transition || '0.3s';
			for (var p in newStyle) {
				if (p !== 'transition' && p !== 'parentRule' && p !== 'length') {
					next.style[p] = newStyle[p];
				}
			}
			next.style.height = newStyle.height;
			next.style.width = newStyle.width;
			next.className = className;
			document.body.removeChild(cloned);
		}, 1);
	}

	function hakAnimateParent(prev, next, again) {
		prev.style.height = prev.offsetHeight;
		prev.style.width = prev.offsetWidth;
		prev.style.maxHeight = prev.offsetHeight;
		prev.style.maxWidth = prev.offsetWidth;
		prev.style.minHeight = prev.offsetHeight;
		prev.style.minWidth = prev.offsetWidth;

		setTimeout(function () {
			//console.log('d')
			var clone = next.cloneNode(true);
			var trans = prev.style.transition;
			var newStyle = {};
			for (var p in clone.style) {
				newStyle[p] = clone.style[p];
			}

			clone.style.opacity = '0';
			clone.style.position = 'fixed';
			document.body.appendChild(clone);

			setTimeout(function () {
				newStyle.height = clone.offsetHeight;
				newStyle.width = clone.offsetWidth;
				for (var p in newStyle) {
					if (newStyle.hasOwnProperty(p) && p !== 'parentRule' && p !== 'length') {
						prev.style[p] = newStyle[p];
					}
				}

				prev.style.height = clone.offsetHeight;
				prev.style.width = clone.offsetWidth;
				document.body.removeChild(clone);
			}, 1);
		}, 1);
	}

	function hakAnimateChild(parent, child, remove) {
		var style,
		    animate = child.getAttribute('hakAnimate'),
		    childClone = child.cloneNode(true);

		if (remove) {
			parent.removeChild(child);
		} else {

			setTimeout(function () {
				style = hakClone(childClone);
				childClone.style.opacity = '0';
				childClone.style.position = 'fixed';
				document.body.appendChild(childClone);

				child.style.transition = '0s';
				child.style.height = '0px';
				child.style.width = '0px';
				child.style.opacity = '0';
				parent.appendChild(child);

				setTimeout(function () {
					child.style.transition = style.transition || '0.25s';
					style.height = child.offsetHeight;
					style.width = child.offsetWidth;
					child.style = hakMerge(child.style, style);
					document.body.removeChild(childClone);
				}, 1);
			}, 1);
		}
	}

	function hakReplaceNodes(prev, next) {
		if (!prev) {
			return false;
		}

		var animated = prev.hasAttribute('hakAnimate'),
		    shouldAnimateParent = false;

		if (prev.hasChildNodes()) {
			if (!prev.cloneNode(false).isEqualNode(next.cloneNode(false))
			//&& !(prev.id.indexOf('hakComponent_') > -1 && prev.id === next.id)
			) {
					if (animated) {
						hakAnimate(prev, next);
					} else {
						next.parentElement.replaceChild(next.cloneNode(true), next);
						prev.parentElement.replaceChild(next, prev);
					}
					return true;
				}

			if (next.hasChildNodes()) {

				for (var i = 0; i < prev.children.length; i++) {
					if (!next.children[i]) {
						//removing children
						while (prev.children[i]) {
							if (prev.children[i].hasAttribute('hakAnimate')) {
								hakAnimateChild(prev, prev.children[i], true);
							} else {
								prev.removeChild(prev.children[i]);
							}
						}
						animated && (shouldAnimateParent = true);
					} else {
						hakReplaceNodes(prev.children[i], next.children[i]) && animated && (shouldAnimateParent = true);
					}
				}

				for (var j = prev.children.length; j < next.children.length; j++) {
					// adding children
					var kid = next.children[j];
					next.replaceChild(kid.cloneNode(true), kid);
					if (kid.hasAttribute('hakAnimate')) {
						hakAnimateChild(prev, kid);
					} else {
						prev.appendChild(kid);
					}
					if (j === next.children.length - 1) {
						animated && (shouldAnimateParent = true);
					}
				}
			} else {
				while (prev.firstChild) {
					//removing child
					if (prev.firstChild.hakAnimate) {
						hakAnimateChild(prev, prev.firstChild, true);
					} else {
						prev.removeChild(prev.firstChild);
					}
				}
				animated && (shouldAnimateParent = true);
			}
		}
		if (shouldAnimateParent) {
			hakAnimateParent(prev, next);
		}

		if (!prev.isEqualNode(next)
		//&& !(prev.id.indexOf('hakComponent_') > -1 && prev.id === next.id)
		) {
				if (animated) {
					hakAnimate(prev, next);
				} else {
					next.parentElement.replaceChild(next.cloneNode(true), next);
					prev.parentElement.replaceChild(next, prev);
				}
				return true;
			}
		return false;
	}

	function hakQuick() {
		var a = arguments,
		    data = {};

		for (var i = 0; i < a.length; i++) {
			if (_typeof(a[i]) === 'object' && !Array.isArray(a[i])) {
				hakMerge(data, a[i]);
			}
			if (typeof a[i] === 'function') {
				data.render = a[i];
			}
		}
		return hakComponent(data)();
	}

	/* Now for the Store 
 		A redux like immutable data container that updates its subscribed components 
 	whenever the data changes. 
 */

	function hakStore(initialData, storageName, dataBase) {

		var store = initialData || {
			Constructor: function Constructor() {
				console.log('No initial data given');
			}
		},
		    fetched = false,
		    paramData = {},
		    paramKeys = {},
		    firstParamSet = true,
		    settingStorage = false,
		    setStorage = function setStorage() {};

		function addMethods(shelf, customers, reset, isStore) {
			for (var prop in shelf) {
				if (shelf.hasOwnProperty(prop)) {
					if (_typeof(shelf[prop]) === 'object' && !Array.isArray(shelf[prop])) {
						addMethods(shelf[prop]);
					}
					if (typeof shelf[prop] === 'function') shelf[prop] = shelf[prop].bind(shelf);
				}
			}
			if (shelf.methodsAdded && !reset) return false;
			if (isStore) shelf.hakRootShelf = true;
			shelf.methodsAdded = true;
			shelf.stockStore = stockStore;
			shelf.stockShelf = stockShelf.bind(shelf);
			shelf.updateCustomers = updateCustomers.bind(shelf);
			shelf.addCustomer = addCustomer.bind(shelf);
			shelf.shelf_id = shelf.shelf_id || 'hakShelf' + Math.random();
			shelf.hakCustomers = reset ? customers || [] : shelf.hakCustomers || customers || [];
			if (shelf.hasOwnProperty('Constructor')) shelf.Constructor();
		}

		function stockShelf(newStuff) {
			newStuff = hakMerge({}, this, newStuff);
			if (this !== newStuff) {
				for (var prop in newStuff) {
					if (newStuff.hasOwnProperty(prop) && prop !== 'shelf_id') {
						this[prop] = newStuff[prop];
					}
				}
				updateAllCustomers(this.shelf_id);
				if (!settingStorage) {
					settingStorage = true;
					setTimeout(setStorage, 301);
				}
			}
		}

		function stockStore(newStuff) {
			store.stockShelf(newStuff);
		}

		function updateAllCustomers(_id) {
			function search(shelf, id) {
				if ((typeof shelf === 'undefined' ? 'undefined' : _typeof(shelf)) === 'object') {
					if (shelf.shelf_id === id) {
						shelf.updateCustomers(true);
						return true;
					}
					for (var prop in shelf) {
						if (shelf.hasOwnProperty(prop) && search(shelf[prop], id) && shelf.hasOwnProperty('updateCustomers')) {
							shelf.updateCustomers(false);
						}
					}
				}
				return false;
			}
			search(store, _id);
		}

		function updateCustomers(updateKids) {
			for (var i = 0; i < this.hakCustomers.length; i++) {
				var x = this;
				this.hakCustomers[i].buyShelf && this.hakCustomers[i].buyShelf(x);
			}
			if (updateKids) {
				for (var prop in this) {
					if (this.hasOwnProperty(prop) && hakIsObj(this[prop]) && this[prop].hasOwnProperty('updateCustomers')) {
						this[prop].updateCustomers(true);
					}
				}
			}
		}

		function addCustomer(subbed) {
			this.hakCustomers.push(subbed);
		}

		// Data manipulating functions


		function forceStockStore(oba) {
			store.stockStore(oba);
			paramData = hakMerge(paramData, oba);
		}

		function getMethods() {
			function filterIt(obj, shelf) {
				for (var prop in shelf) {
					if (shelf.hasOwnProperty(prop)) {
						if (hakIsObj(shelf[prop])) {
							obj[prop] = {};
							filterIt(obj[prop], shelf[prop]);
						} else {
							if (typeof shelf[prop] === 'function') obj[prop] = shelf[prop];
						}
					}
				}
			}
			var obn = {};
			filterIt(obn, store);
			return obn;
		}

		function getInPath(base, p) {
			if (!p) return base;
			if (typeof p === 'string') return base[p];
			if (Array.isArray(p)) {
				var b = base;
				for (var i = 0; i < p.length; i++) {
					if (!b[p[i]]) b[p[i]] = {};
					b = b[p[i]];
				}
				return b;
			}
		}

		function getData() {
			var data = {};

			function recur(obx, old) {
				if (Array.isArray(old)) {
					old.forEach(function (val, index) {
						if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
							obx[index] = Array.isArray(val) ? [] : {};
							recur(obx[index], val);
							return;
						}
						if (typeof val !== 'function') {
							obx[index] = val;
						} else {
							obx[index] = null;
						}
					});
				}

				if (old.hasOwnProperty('privateShelf') && old.privateShelf) return;
				for (var prop in old) {
					if (old.hasOwnProperty(prop)) {
						if (prop === 'hakCustomers' || prop === 'shelf_id' || prop === 'methodsAdded') continue;

						if (_typeof(old[prop]) === 'object') {
							obx[prop] = Array.isArray(old[prop]) ? [] : {};
							recur(obx[prop], old[prop]);
							continue;
						}
						if (typeof old[prop] !== 'function') {
							obx[prop] = old[prop];
						}
					}
				}
			}
			recur(data, store);
			return data;
		}

		if (storageName) {

			if (idbKeyval && store.useIndexDB && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB)) {

				hakVariables.fetched++;

				setStorage = function setStorage() {
					//console.log('setting storage', getData())
					idbKeyval.set(storageName, getData());
					settingStorage = false;
					// idbKeyval.get(storageName)
					// 	.then(console.log)
				};

				idbKeyval.get(storageName).then(function (data) {
					//console.log(data)
					if (!fetched) {
						if (data) {
							//console.log('applying data')
							var d = Object.assign(data, paramData);
							store.stockShelf(d);
							//console.log('store',store)
						} else {
							//console.log('no data, setting data')
							setStorage();
						}
					}
					hakVariables.fetched--;
				});
			} else {

				setStorage = function setStorage() {
					//console.log('setting')
					localStorage.setItem(storageName, JSON.stringify(getData()));
					settingStorage = false;
				};
				var loc = JSON.parse(localStorage.getItem(storageName) || '{}');
				//addMethods(loc, null, true);
				//console.log('loc',loc)
				loc && hakMerge(store, loc);
				//console.log('store',store)
			}
		}

		// var windowUnload = window.onunload,
		// 	windowOnBeforeUnload = window.onbeforeunload;

		// window.onbeforeunload = function() {
		// 	if (windowOnBeforeUnload)
		// 		windowOnBeforeUnload();
		// 	setStorage();
		// 	store.onExit && store.onExit();
		// };

		// window.onunload = function() {
		// 	if (windowUnload)
		// 		windowUnload();
		// 	setStorage();
		// 	store.onExit && store.onExit();
		// }


		if (dataBase) {
			if (window.fetch) {
				fetch(dataBase).then(function (data) {
					fetched = true;
					store.stockShelf(data);
					setStorage();
				});
			}
		}

		function setParams(ob) {
			paramKeys = hakMerge({}, paramKeys, ob);

			firstParamSet = false;

			function firstGo(oo, params) {
				var x = {};

				function mergeNew(newOb, oldOb) {
					for (var i in oldOb) {
						if (oldOb.hasOwnProperty(i)) {
							if (typeof oldOb[i] === 'string') {
								newOb[i] = oldOb[i].substring(0);
							} else {
								newOb[i] = {};
								mergeNew(newOb[i], oldOb[i]);
							}
						}
					}
				}

				function gogo(o) {
					if ((typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object') {
						for (var p in o) {
							if (o.hasOwnProperty(p)) {
								if (_typeof(o[p]) === 'object') {
									o[p] = gogo(o[p]);
								} else {
									o[p] = params[o[p]] || false;
								}
								//console.log('o after',o)
							}
						}
					}
					return o;
				}
				mergeNew(x, oo);
				return gogo(x);
			}

			function stockViaParams() {
				forceStockStore(firstGo(paramKeys, hakGetParams()));
				console.log('works');
			}

			stockViaParams();

			var w = window.onpopstate;
			window.onpopstate = function () {
				w && w();
				stockViaParams();
			};
		}

		addMethods(store, [], true, true);

		return {

			setParams: setParams,

			updated: fetched,

			getMethods: getMethods,

			getData: getData,

			getEntireStore: function getEntireStore() {
				return store;
			},

			stockInShelf: function stockInShelf() {
				var newStuff = {},
				    args = arguments,
				    list = [];
				for (var i in args) {
					if (hakIsObj(args[i])) {
						newStuff = hakMerge(newStuff, args[i]);
					} else {
						list.push[args[i]];
					}
				}
				getInPath(store, list).stockShelf(newStuff);
			},

			stockStore: stockStore,

			forceStockStore: forceStockStore,

			getShelf: function getShelf(shelf) {
				return hakMerge({}, getInPath(store, shelf));
			},

			subscribe: function subscribe() {
				var args = arguments;

				return function (id, buyShelf) {

					var shipment = {
						shelf: {},
						actions: {
							stockStore: stockStore
						}
					};

					for (var i = 0; i < args.length; i++) {
						if (Array.isArray(args[i])) {
							var shelf = getInPath(store, args[i]);
							addMethods(shelf);
							shipment.shelf[args[i][args[i].length - 1]] = shelf;

							shelf.addCustomer({
								id: id,
								buyShelf: buyShelf.bind(shelf)
							});
						} else {
							addMethods(store[args[i]]);
							shipment.shelf[args[i]] = store[args[i]];

							store[args[i]].addCustomer({
								id: id,
								buyShelf: buyShelf.bind(shelf)
							});
						}
					}

					if (args.length === 0) {
						shipment.shelf = store;
						store.addCustomer({
							id: id,
							buyShelf: buyShelf.bind(store)
						});
					}

					return shipment;
				};
			}

		};
	}

	/* Usage examples
 	var store = hakStore({ things: {item1: '1', item2: '2'}});
 	store.
 
 	*/

	function hakGetPathname(noHash) {
		if (!noHash) {
			var l = window.location.hash.split('?')[0].split('/');
			return l.filter(function (w) {
				return w !== '';
			});
		}
		var l = window.location.pathname.split('/');
		return l.map(function (item) {
			if (item === '') {
				return '/';
			}
			return item;
		});
	}

	function hakGetParams(aa) {
		var h = window.location.href.split('?'),
		    obj = {};

		h[1] && h[1].split('&').forEach(function (val) {
			var a = val.split('=');
			a[1] && (obj[a[0]] = a[1]);
		});
		if (aa) return obj[aa];
		return obj;
	}

	function hakSetParam(key, val, pushState) {
		var p = hakGetParams(),
		    l = [];
		if (val) {
			p[key] = val;
		} else {
			key && delete p[key];
		}

		for (var i in p) {
			if (p.hasOwnProperty(i) && p[i]) {
				l.push(i + '=' + p[i]);
			}
		}
		var s = l[0] ? '?' + l.join('&') : '';
		s = window.location.href.split('?')[0] + s;

		window.history[pushState ? 'pushState' : 'replaceState'](null, null, s);
	}

	function hakRouter(def, noHash) {

		var hasHash = !noHash;

		if (!window.location.hash && hasHash) {
			var uri = window.location.href.split('?');
			var search = uri[1];
			var params = search ? '?' + search : '';
			if (def) {
				window.history.replaceState(null, null, uri[0] + '#/' + def + params);
			} else {
				window.history.replaceState(null, null, uri[0] + '#/home' + params);
			}
		}

		var newRoutes = hakGetPathname(noHash),
		    oldRoutes = newRoutes,
		    componentList = [],
		    rootNodeList = [],
		    routes = {},
		    callbacks = {},
		    rendered = false,
		    middleware = [],
		    rootNode = hakEl('div')({
			id: 'hakRouter'
		});

		function getNodes(route) {
			var r;

			function linkUp(routeNode) {
				r = routeNode;
			}
			var n = route.component({
				hakRouteInit: linkUp
			});

			return {
				node: n,
				rootNode: r
			};
		}

		function updateRoutes(newRoute, middleware) {
			function fil(val) {
				return componentList.indexOf(val) > -1;
			}

			oldRoutes = newRoutes;
			newRoutes = hakGetPathname(noHash);
			!middleware && runMiddleware();

			var gogo = false,
			    oldRFiltered = oldRoutes.filter(fil),
			    newRFiltered = newRoutes.filter(fil);

			for (var i = 0; i < newRFiltered.length; i++) {

				if (!rendered || gogo || oldRFiltered[i] !== newRFiltered[i] || newRoute === newRFiltered[i]) {
					gogo = true;
					var nodes = getNodes(routes[newRFiltered[i]]),
					    rooT = i === 0 ? rootNode : rootNodeList[i - 1];

					while (rooT.firstChild) {
						rooT.removeChild(rooT.firstChild);
					}
					rooT.appendChild(nodes.node);
					callbacks[newRoutes[i]] && callbacks[newRoutes[i]]();

					rootNodeList[i] = nodes.rootNode;
				}

				while (oldRFiltered[i + 1] && rootNodeList[i + 1] && rootNodeList[i + 1].firstChild) {
					rootNodeList[i + 1].removeChild(rootNodeList[i + 1].firstChild);
				}
			}
		}

		function runMiddleware(hash, firstRender) {
			for (var i = 0; i < middleware.length; i++) {
				middleware[i](oldRoutes, newRoutes);
			}
		};

		function runCallbacks() {
			var p = hakGetPathname(noHash).reverse();
			for (var i = 0; i < p.length; i++) {
				callbacks[p[i]] && callbacks[p[i]]();
			}
		}

		var w = window.onpopstate;
		window.onpopstate = function () {
			updateRoutes();
			w && w();
		};

		return {

			getRoutes: function getRoutes() {
				return routes;
			},

			linkTo: function linkTo(link, callback) {
				link = link[0] === '#' ? link : link[1] === '/' ? '#' + link : '#/' + link;
				var param = '?' + window.location.href.split('?')[1];
				var newPa = null;console.log(link, window.location.hash);

				if (link.split('?')[1]) {
					newPa = link.split('?')[1];
					link = link.split('?')[0];
					if (param) {
						newPa = newPa.split('&');
						for (var i = 0; i < newPa.length; i++) {
							if (param.match(newPa[i].split('=')[0] + '=')) {
								param = param.replace(param.split(newPa[i].split('=')[0] + '=')[1].split('&')[0], newPa[i].split('=')[1]);
							} else {
								param += '&' + newPa[i];
							}
						}
					} else {
						param = newPa;
					}
				}
				param = param.replace('undefined&', '');

				link = param !== '?' && param !== '?undefined' ? link + param : link;

				if (link !== window.location.hash) {
					history.pushState(null, null, link);
					updateRoutes();
				}
				callback && callback();
			},

			render: function render() {
				runMiddleware(null, true);

				if (hakVariables.fetched > 0) {
					console.log('fetched');
					var t = setInterval(function () {
						//console.log('fetching')
						if (hakVariables.fetched === 0) {
							runCallbacks();
							runMiddleware();
							clearInterval(t);
						}
					}, 50);
				}

				rootNode = hakEl('div')({
					id: 'hakRouter'
				});
				updateRoutes(null, true);
				rendered = true;
				return rootNode;
			},

			addMiddleware: function addMiddleware(func) {
				middleware.push(func);
			},

			addRoute: function addRoute(route, component, callBack, rendering) {
				//console.log('adding Route')

				if (route === '/') noHash = true;
				routes[route] = {};
				routes[route].component = component;
				if (callBack) callbacks[route] = callBack;
				componentList.push(route);

				!rendering && rendered && updateRoutes();
			},

			addRoutes: function addRoutes() {
				var _ = this,
				    args = arguments;

				for (var i = 0; i < args.length; i++) {
					_.addRoute(args[i][0], args[i][1], args[i][2], true);
				}

				rendered && updateRoutes();
			},

			add: function add(a) {
				if (Array.isArray(a)) {
					this.addRoutes(arguments);
				} else {
					this.addRoute(arguments);
				}
			}

		};
	}

	self.hak = {
		Router: hakRouter,
		Store: hakStore,
		Component: hakComponent,
		tags: hakAddTag(),
		El: hakEl,
		K: hakQuick,
		addTags: hakAddTag,
		mount: attachToDom,
		$: getEl,
		addAudio: hakAddAudio,
		isUrl: hakIsUrl,
		merge: hakMerge,
		clone: hakClone,
		getUrlPath: hakGetPathname,
		replaceNodes: hakReplaceNodes,
		variables: hakVariables,
		getScreenSize: hakGetScreenSize,
		addStyle: hakAddStyle,
		updateStyles: updateStyles,
		getParams: hakGetParams,
		setParam: hakSetParam,
		screenSize: hakScreenSize
	};
})();
/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
*/

// function Swipe(container, options) {

//   "use strict";

//   // utilities
//   var noop = function() {}; // simple no operation function
//   var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // offload a functions execution

//   // check browser capabilities
//   var browser = {
//     addEventListener: !!window.addEventListener,
//     touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
//     transitions: (function(temp) {
//       var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
//       for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
//       return false;
//     })(document.createElement('swipe'))
//   };

//   // quit if no root elemet
//   if (!container) return;
//   var element = container.children[0];
//   var slides, slidePos, width, length;
//   options = options || {};
//   var index = parseInt(options.startSlide, 10) || 0;
//   var speed = options.speed || 300;
//   options.continuous = options.continuous !== undefined ? options.continuous : true;

//   function setup() {

//     // cache slides
//     slides = element.children;
//     length = slides.length;

//     // set continuous to false if only one slide
//     if (slides.length < 2) options.continuous = false;

//     //special case if two slides
//     if (browser.transitions && options.continuous && slides.length < 3) {
//       element.appendChild(slides[0].cloneNode(true));
//       element.appendChild(element.children[1].cloneNode(true));
//       slides = element.children;
//     }

//     // create an array to store current positions of each slide
//     slidePos = new Array(slides.length);

//     // determine width of each slide
//     width = container.getBoundingClientRect().width || container.offsetWidth;

//     element.style.width = (slides.length * width) + 'px';

//     // stack elements
//     var pos = slides.length;
//     while(pos--) {

//       var slide = slides[pos];

//       slide.style.width = width + 'px';
//       slide.setAttribute('data-index', pos);

//       if (browser.transitions) {
//         slide.style.left = (pos * -width) + 'px';
//         move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
//       }

//     }

//     // reposition elements before and after index
//     if (options.continuous && browser.transitions) {
//       move(circle(index-1), -width, 0);
//       move(circle(index+1), width, 0);
//     }

//     if (!browser.transitions) element.style.left = (index * -width) + 'px';

//     container.style.visibility = 'visible';

//   }

//   function prev() {

//     if (options.continuous) slide(index-1);
//     else if (index) slide(index-1);

//   }

//   function next() {

//     if (options.continuous) slide(index+1);
//     else if (index < slides.length - 1) slide(index+1);

//   }

//   function circle(index) {

//     // a simple positive modulo using slides.length
//     return (slides.length + (index % slides.length)) % slides.length;

//   }

//   function slide(to, slideSpeed) {

//     // do nothing if already on requested slide
//     if (index == to) return;

//     if (browser.transitions) {

//       var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward

//       // get the actual position of the slide
//       if (options.continuous) {
//         var natural_direction = direction;
//         direction = -slidePos[circle(to)] / width;

//         // if going forward but to < index, use to = slides.length + to
//         // if going backward but to > index, use to = -slides.length + to
//         if (direction !== natural_direction) to =  -direction * slides.length + to;

//       }

//       var diff = Math.abs(index-to) - 1;

//       // move all the slides between index and to in the right direction
//       while (diff--) move( circle((to > index ? to : index) - diff - 1), width * direction, 0);

//       to = circle(to);

//       move(index, width * direction, slideSpeed || speed);
//       move(to, 0, slideSpeed || speed);

//       if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place

//     } else {

//       to = circle(to);
//       animate(index * -width, to * -width, slideSpeed || speed);
//       //no fallback for a circular continuous if the browser does not accept transitions
//     }

//     index = to;
//     offloadFn(options.callback && options.callback(index, slides[index]));
//   }

//   function move(index, dist, speed) {

//     translate(index, dist, speed);
//     slidePos[index] = dist;

//   }

//   function translate(index, dist, speed) {

//     var slide = slides[index];
//     var style = slide && slide.style;

//     if (!style) return;

//     style.webkitTransitionDuration =
//     style.MozTransitionDuration =
//     style.msTransitionDuration =
//     style.OTransitionDuration =
//     style.transitionDuration = speed + 'ms';

//     style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
//     style.msTransform =
//     style.MozTransform =
//     style.OTransform = 'translateX(' + dist + 'px)';

//   }

//   function animate(from, to, speed) {

//     // if not an animation, just reposition
//     if (!speed) {

//       element.style.left = to + 'px';
//       return;

//     }

//     var start = +new Date;

//     var timer = setInterval(function() {

//       var timeElap = +new Date - start;

//       if (timeElap > speed) {

//         element.style.left = to + 'px';

//         if (delay) begin();

//         options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

//         clearInterval(timer);
//         return;

//       }

//       element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

//     }, 4);

//   }

//   // setup auto slideshow
//   var delay = options.auto || 0;
//   var interval;

//   function begin() {

//     interval = setTimeout(next, delay);

//   }

//   function stop() {

//     delay = 0;
//     clearTimeout(interval);

//   }


//   // setup initial vars
//   var start = {};
//   var delta = {};
//   var isScrolling;

//   // setup event capturing
//   var events = {

//     handleEvent: function(event) {

//       switch (event.type) {
//         case 'touchstart': this.start(event); break;
//         case 'touchmove': this.move(event); break;
//         case 'touchend': offloadFn(this.end(event)); break;
//         case 'webkitTransitionEnd':
//         case 'msTransitionEnd':
//         case 'oTransitionEnd':
//         case 'otransitionend':
//         case 'transitionend': offloadFn(this.transitionEnd(event)); break;
//         case 'resize': offloadFn(setup); break;
//       }

//       if (options.stopPropagation) event.stopPropagation();

//     },
//     start: function(event) {

//       var touches = event.touches[0];

//       // measure start values
//       start = {

//         // get initial touch coords
//         x: touches.pageX,
//         y: touches.pageY,

//         // store time to determine touch duration
//         time: +new Date

//       };

//       // used for testing first move event
//       isScrolling = undefined;

//       // reset delta and end measurements
//       delta = {};

//       // attach touchmove and touchend listeners
//       element.addEventListener('touchmove', this, false);
//       element.addEventListener('touchend', this, false);

//     },
//     move: function(event) {

//       // ensure swiping with one touch and not pinching
//       if ( event.touches.length > 1 || event.scale && event.scale !== 1) return

//       if (options.disableScroll) event.preventDefault();

//       var touches = event.touches[0];

//       // measure change in x and y
//       delta = {
//         x: touches.pageX - start.x,
//         y: touches.pageY - start.y
//       }

//       // determine if scrolling test has run - one time test
//       if ( typeof isScrolling == 'undefined') {
//         isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
//       }

//       // if user is not trying to scroll vertically
//       if (!isScrolling) {

//         // prevent native scrolling
//         event.preventDefault();

//         // stop slideshow
//         stop();

//         // increase resistance if first or last slide
//         if (options.continuous) { // we don't add resistance at the end

//           translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
//           translate(index, delta.x + slidePos[index], 0);
//           translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);

//         } else {

//           delta.x =
//             delta.x /
//               ( (!index && delta.x > 0               // if first slide and sliding left
//                 || index == slides.length - 1        // or if last slide and sliding right
//                 && delta.x < 0                       // and if sliding at all
//               ) ?
//               ( Math.abs(delta.x) / width + 1 )      // determine resistance level
//               : 1 );                                 // no resistance if false

//           // translate 1:1
//           translate(index-1, delta.x + slidePos[index-1], 0);
//           translate(index, delta.x + slidePos[index], 0);
//           translate(index+1, delta.x + slidePos[index+1], 0);
//         }

//       }

//     },
//     end: function(event) {

//       // measure duration
//       var duration = +new Date - start.time;

//       // determine if slide attempt triggers next/prev slide
//       var isValidSlide =
//             Number(duration) < 250               // if slide duration is less than 250ms
//             && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
//             || Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

//       // determine if slide attempt is past start and end
//       var isPastBounds =
//             !index && delta.x > 0                            // if first slide and slide amt is greater than 0
//             || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

//       if (options.continuous) isPastBounds = false;

//       // determine direction of swipe (true:right, false:left)
//       var direction = delta.x < 0;

//       // if not scrolling vertically
//       if (!isScrolling) {

//         if (isValidSlide && !isPastBounds) {

//           if (direction) {

//             if (options.continuous) { // we need to get the next in this direction in place

//               move(circle(index-1), -width, 0);
//               move(circle(index+2), width, 0);

//             } else {
//               move(index-1, -width, 0);
//             }

//             move(index, slidePos[index]-width, speed);
//             move(circle(index+1), slidePos[circle(index+1)]-width, speed);
//             index = circle(index+1);

//           } else {
//             if (options.continuous) { // we need to get the next in this direction in place

//               move(circle(index+1), width, 0);
//               move(circle(index-2), -width, 0);

//             } else {
//               move(index+1, width, 0);
//             }

//             move(index, slidePos[index]+width, speed);
//             move(circle(index-1), slidePos[circle(index-1)]+width, speed);
//             index = circle(index-1);

//           }

//           options.callback && options.callback(index, slides[index]);

//         } else {

//           if (options.continuous) {

//             move(circle(index-1), -width, speed);
//             move(index, 0, speed);
//             move(circle(index+1), width, speed);

//           } else {

//             move(index-1, -width, speed);
//             move(index, 0, speed);
//             move(index+1, width, speed);
//           }

//         }

//       }

//       // kill touchmove and touchend event listeners until touchstart called again
//       element.removeEventListener('touchmove', events, false)
//       element.removeEventListener('touchend', events, false)

//     },
//     transitionEnd: function(event) {

//       if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

//         if (delay) begin();

//         options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

//       }

//     }

//   }

//   // trigger setup
//   setup();

//   // start auto slideshow if applicable
//   if (delay) begin();


//   // add event listeners
//   if (browser.addEventListener) {

//     // set touchstart event on element
//     if (browser.touch) element.addEventListener('touchstart', events, false);

//     if (browser.transitions) {
//       element.addEventListener('webkitTransitionEnd', events, false);
//       element.addEventListener('msTransitionEnd', events, false);
//       element.addEventListener('oTransitionEnd', events, false);
//       element.addEventListener('otransitionend', events, false);
//       element.addEventListener('transitionend', events, false);
//     }

//     // set resize event on window
//     window.addEventListener('resize', events, false);

//   } else {

//     window.onresize = function () { setup() }; // to play nice with old IE

//   }

//   // expose the Swipe API
//   return {
//     setup: function() {

//       setup();

//     },
//     slide: function(to, speed) {

//       // cancel slideshow
//       stop();

//       slide(to, speed);

//     },
//     prev: function() {

//       // cancel slideshow
//       stop();

//       prev();

//     },
//     next: function() {

//       // cancel slideshow
//       stop();

//       next();

//     },
//     stop: function() {

//       // cancel slideshow
//       stop();

//     },
//     getPos: function() {

//       // return current index position
//       return index;

//     },
//     getNumSlides: function() {

//       // return total number of slides
//       return length;
//     },
//     kill: function() {

//       // cancel slideshow
//       stop();

//       // reset element
//       element.style.width = '';
//       element.style.left = '';

//       // reset slides
//       var pos = slides.length;
//       while(pos--) {

//         var slide = slides[pos];
//         slide.style.width = '';
//         slide.style.left = '';

//         if (browser.transitions) translate(pos, 0, 0);

//       }

//       // removed event listeners
//       if (browser.addEventListener) {

//         // remove current event listeners
//         element.removeEventListener('touchstart', events, false);
//         element.removeEventListener('webkitTransitionEnd', events, false);
//         element.removeEventListener('msTransitionEnd', events, false);
//         element.removeEventListener('oTransitionEnd', events, false);
//         element.removeEventListener('otransitionend', events, false);
//         element.removeEventListener('transitionend', events, false);
//         window.removeEventListener('resize', events, false);

//       }
//       else {

//         window.onresize = null;

//       }

//     }
//   }

// }


// if ( window.jQuery || window.Zepto ) {
//   (function($) {
//     $.fn.Swipe = function(params) {
//       return this.each(function() {
//         $(this).data('Swipe', new Swipe($(this)[0], params));
//       });
//     }
//   })( window.jQuery || window.Zepto )
// }
"use strict";
'use strict';

// Initialize hak-jsx global functions

for (var prop in hak.tags) {
	if (hak.tags.hasOwnProperty(prop)) {
		window[prop] = hak.tags[prop];
	}
}

// Initialize most global variables and essential app components, including-
// the hash-router, css string variable (that will be added to head later)-
// and essential data stores with default data.  


hak.variables.css = '';

hak.variables.scrollTop = 0;
hak.variables.scrolledDown = false;

var APP_VERSION = 7;

var STYLES = {
	menuBarColor: 'dodgerblue',
	mainColor: 'dodgerblue',
	secondaryColor: 'deepskyblue',
	thirdColor: 'skyblue',
	boldColor: 'dodgerblue',
	hoverColor: 'lightskyblue',
	backgroundColor: '#fbfbfb',
	cardColor: 'white',
	faveColor: '#edc500',
	underStatedColor: '#e9e9e9'
};

var APP = {
	routes: {},
	scrollEventFunctions: [],
	playScrollFunctions: true
};
'use strict';

// The actual entire dictionary, with both mien and english entries.
// This is just initialized with empty values, so as to get the app loaded- 
// quickly before all the main data is loaded.

var dictionaryStore = hak.Store({

	useIndexDB: true,

	mienEntries: [{}],

	englishEntries: [{}],

	// mien: {
	// 	definers: [[]],
	// 	words: [[]]
	// },

	// english: {
	// 	definers: [[]],
	// 	words: [[]]
	// },

	loaded: false,

	stocked: false,

	sortAlphabetically: function sortAlphabetically(a, b) {
		var a = a.word.toLowerCase(),
		    b = b.word.toLowerCase();
		if (a < b) {
			return -1;
		}
		if (a > b) {
			return 1;
		}
		return 0;
	},

	editEntry: function editEntry(word, isMien) {
		var lang = isMien ? 'mien' : 'english',
		    word = word,
		    oldWord,
		    addNew = true,
		    entryList = this[lang + 'Entries'].map(function (val) {
			if (val._id === word._id) {
				oldWord = hak.clone(val), addNew = false;
				return word;
			}
			return val;
		});

		if (addNew) {
			entryList.push(word);
		}

		entryList.sort(this.sortAlphabetically);

		var _t = this;
		setTimeout(function () {
			if (!oldWord) {
				oldWord = hak.clone(word);
				oldWord.isNewWord = true;
			}
			_t.editedEntries.add(word, oldWord);
		}, 30);

		var toStock = { stocked: true };
		toStock[lang + 'Entries'] = entryList;

		this.stockStore(toStock);
	},

	editedEntries: {
		oldEntries: [],
		list: [],

		add: function add(word, oldWord) {
			var oldW = oldWord,
			    pushOldEntries = true,
			    newList = this.list.filter(function (val, index) {
				return val._id !== word._id;
			});
			var newOldList = this.oldEntries.map(function (val) {
				if (oldWord._id === val._id) {
					pushOldEntries = false;
				}
				return val;
			});

			if (pushOldEntries) {
				newOldList.push(oldWord);
			}

			newList.push(word);
			this.stockShelf({ list: newList, oldEntries: newOldList });
		},

		cancel: function cancel(word) {
			function entriesMap(val) {
				if (oldWord._id === val._id) {
					return oldWord;
				}
				return val;
			}

			function entriesFilter(word) {
				return word._id !== oldWord._id;
			}

			var store = dictionaryStore.getEntireStore(),
			    word = word,
			    newList = this.list.filter(function (val) {
				return val._id !== word._id;
			}),
			    oldWord = this.oldEntries.filter(function (val) {

				return val._id === word._id;
			})[0] || { _id: Math.random() },
			    mienEntries,
			    englishEntries;

			if (oldWord.isNewWord) {
				mienEntries = store.mienEntries.filter(entriesFilter);
				englishEntries = store.englishEntries.filter(entriesFilter);
			} else {
				mienEntries = store.mienEntries.map(entriesMap);
				englishEntries = store.englishEntries.map(entriesMap);
			}

			englishEntries.sort(store.sortAlphabetically);
			mienEntries.sort(store.sortAlphabetically);

			var toStock = {
				mienEntries: mienEntries,
				englishEntries: englishEntries,
				editedEntries: {
					list: newList
				}
			};
			this.stockStore(toStock);
		}

	}

}, 'MienDictionaryStore_v' + APP_VERSION);
'use strict';

// Data store for most essential yet lightweight parts of our app. 
// Includes simple app and user settings. 
// Should never subscribe a component to the entire store, or call a global-
// stockStore, as many unnecesary renders may occur and affect performance

var miscInitData = {

	pageData: {
		selectedPage: '',

		changePage: function changePage(a) {
			this.stockShelf({ selectedPage: a });
		}
	},

	book: {
		selectedLetter: '',

		changeSelectedLetter: function changeSelectedLetter(x) {
			this.stockShelf({ selectedLetter: x });
			hak.setParam('letter', x, true);
		}
	},

	language: {
		isMien: true,

		changeLanguage: function changeLanguage() {
			this.stockShelf({ isMien: !this.isMien });
			hak.setParam('lang', !this.isMien ? '' : 'mien', true);
		}
	},

	featureCard: {
		id: '',

		changeFeatureCard: function changeFeatureCard(x) {
			this.stockShelf({ id: x });
		}
	},

	search: {
		query: '',

		setQuery: function setQuery(x) {
			this.stockShelf({ query: x });
		}
	},

	test: {
		test2: {
			test3: {
				x: 'hello'
			}
		}
	}

	// get previous user data if it exists
};var miscStore = hak.Store(miscInitData, 'MienMiscStore_v' + APP_VERSION);

// attach persistent data from the url parameters to the store, so that-
// components update when the url changes.

miscStore.setParams({
	language: {
		isMien: 'lang'
	},
	book: {
		selectedLetter: 'letter'
	}
});

var startingPage = window.location.hash.indexOf('search') > -1 ? 'search' : window.location.hash.indexOf('book') > -1 ? 'book' : window.location.hash.indexOf('star') > -1 ? 'star' : '';

miscStore.stockStore({ pageData: { selectedPage: startingPage } });
'use strict';

// data for the star page, including the word of the day, news, and user-
// saved words

var starInitData = {

	favorites: {

		list: [],

		idList: [],

		addToFavorites: function addToFavorites(item, deleteItem) {
			if (deleteItem) {
				this.idList = this.idList.filter(function (val) {
					return item._id !== val;
				});
			} else {
				this.idList.push(item._id);
			}
			this.stockShelf({
				idList: this.idList
			});
		},

		getFavorites: function getFavorites() {
			var list = [],
			    dic = dictionaryStore.getEntireStore(),
			    en = dic.englishEntries || [],
			    mien = dic.mienEntries || [];

			for (var i = 0; i < en.length; i++) {
				if (this.idList.indexOf(en[i]._id) > -1) {
					list[this.idList.indexOf(en[i]._id)] = en[i];
				}
			}
			for (var i = 0; i < mien.length; i++) {
				if (this.idList.indexOf(mien[i]._id) > -1) {
					list[this.idList.indexOf(mien[i]._id)] = mien[i];
				}
			}
			return list;
		}
	},

	settings: {
		showSettings: false,
		changePage: function changePage(entry, index) {
			this.stockShelf({ showSettings: index });
		}
	},

	editing: {
		editStatus: false,
		topEditor: false,

		wordsEdited: {},
		wordsAdded: {},

		changeEditStatus: function changeEditStatus() {
			this.stockShelf({ editStatus: !this.editStatus });
		}
	}

};

var starStore = hak.Store(starInitData, 'MienStarStore_v' + APP_VERSION);
'use strict';

var SmallButton = function SmallButton(props) {
	var defaultStyle = '';

	var onStyle = props.onStyle || '',
	    offStyle = props.offStyle || '',
	    toggle = props.toggle || false,
	    on = props.isOn || false,
	    style = props.style || '',
	    clas = 'SmallButton ' + props.class || '',
	    offClass = 'faintShadow ' + clas,
	    onClass = 'fainterShadow ' + clas;

	function click() {
		if (toggle) {
			on = !on;
			el.style = style + (on ? onStyle : offStyle);
			el.className = on ? onClass : offClass;
		}
		props.onclick && typeof props.onclick === 'function' && props.onclick();
	}

	var el = div({
		class: on ? onClass : offClass,
		style: style + (on ? onStyle : offStyle),
		onclick: click
	}, props.text || '');

	if (props.hakAnimate) {
		el.setAttribute('hakAnimate', props.hakAnimate);
	}

	return el;
};

hak.addStyle('\n.SmallButton {\n\tcolor: #555;\n  background: white;\n  user-select: none;\n  height: 40px;\n  width: 60px;\n  border-radius: 4px;\n  text-align: center;\n  align-items: center;\n  line-height: 40px;\n  transition: 0.25s;\n}\n\n.SmallButton:hover {\n\tcursor: pointer;\n}\n');

var OverlayContainer = hak.Component({

	render: function render() {
		var view = this.props.view;

		return div({ style: 'OverlayContainer' }, div({
			class: 'OverlayContainer_shadow',
			onclick: this.triggerOverlay
		}), div({ class: 'OverlayContainer_child' }, this.children));
	}
});

hak.addStyle('\n\n.OverlayContainer {\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\tright: 0;\n\tbottom: 0;\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\ttransition: 0.3s;\n}\n\n.OverlayContainer_shadow {\n\ttransition: 0.25s;\n\tposition: fixed;\n\tleft: 0;\n\tright: 0;\n\ttop: 0;\n\tbottom: 0;\n\tz-index: 101;\n\tbackground: black;\n\topacity: 0.5;\n}\n\n.OverlayContainer_child {\n\tz-index: 102;\n\tdisplay: flex;\n}\t\n\n.OC_inView {\n\t\n}\n\n');

var PageSelectorButtons = function PageSelectorButtons(props) {
	var selectedStyles = 'color: white; background: ' + STYLES.secondaryColor + ';';

	return div({ class: 'PageSelectorButtons fainterShadow flex-row' }, props.entries.map(function (entry, index) {
		var style = props.selected === entry || props.selected === index ? selectedStyles : '';
		return div({
			class: 'PageSelectorButtons_button flex-row',
			style: style,
			onclick: function onclick() {
				return props.onclick(entry, index);
			}
		}, entry);
	}));
};

hak.addStyle(function (s) {
	var w = s.width < 450 ? s.width - 78 : 308;
	return '\n\t.PageSelectorButtons {\n\t\tborder-radius: 70px; \n\t\twidth: ' + w + 'px;\n\t\theight: 48px;\n\t\toverflow: hidden;\n\t}\n\n\t.PageSelectorButtons_button {\n\t\tbackground: white;\n\t\tfont-size: 20px;\n\t\tcolor: #444;\n\t\twidth: ' + w / 2 + 'px;\n\t\talign-items: center;\n\t\theight: 48px;\t\n\t\tpadding-top: 2px;\n\t}\n';
});
'use strict';

var EditWordCard = hak.Component({
	Constructor: function Constructor() {
		this.word = this.props.word;
		this.resetState();
	},


	componentDidRender: function componentDidRender() {
		this.props.callBack && this.props.callBack(this.node.offsetHeight);
	},

	resetState: function resetState() {
		var word = this.word;
		this.fresh = true;
		this.state = {
			word: word || {
				_id: false,
				lastEdited: 'New Word'
			},
			wordPlace: word ? word.word : 'Type your word here',
			clarifyerPlace: word ? word.clarifyer : 'Type up a description and/or example sentences of your word',
			otherWordPlace: 'Definition',
			otherClarifyer: 'A short description and/or example of this definition',
			otherWords: word ? word.otherWords.slice(0) : [],
			savingEdit: false
		};
		this.data = {
			word: word ? word.word.substring(0) : '',
			clarifyer: word ? word.clarifyer.substring(0) : '',
			otherWords: word ? word.otherWords.map(function (val, i) {
				return {
					word: val.word ? val.word.substring(0) : '',
					clarifyer: val.clarifyer ? val.clarifyer.substring(0) : ''
				};
			}) : []
		};
	},

	getStyles: function getStyles() {
		return {
			deleteButton: 'color: white;\n\t\t\t\tbackground: tomato; \n\t\t\t\theight: 30px; \n\t\t\t\twidth: 70px; \n\t\t\t\tfloat: right;\n\t\t\t\tmarigin: 13px 3px 5px 0px; \n\t\t\t\tfont-size: 18px;\n\t\t\t\tline-height: 28px; \n\t\t\t\tfont-weight: normal;',
			addDefButton: 'background: ' + STYLES.mainColor + ';\n\t\t\t\tcolor: white; \n\t\t\t\twidth: auto; \n\t\t\t\tfont-size: 22px;\n\t\t\t\theight: 44px;\n\t\t\t\tline-height: 44px;\n\t\t\t\tmargin: 15px 24px 20px 24px;',
			buttonRow: 'display: flex;\n\t\t\t\twidth: auto;\n\t\t\t\tmargin: 20px 5px 5px 5px;\n\t\t\t\tjustify-content: space-around; ',
			divider: 'width: auto; \n\t\t\t\theight: 5px;\n\t\t\t\tbackground: ' + STYLES.backgroundColor + ';\n\t\t\t\tmargin: 30px -26px 20px -26px;',
			confirmButton: 'width: 160px;\n\t\t\t\tcolor: white;\n\t\t\t\tbackground: ' + STYLES.mainColor + ';',
			clarifyerTextarea: 'margin-bottom: 0px;',
			otherWordsContainer: 'margin-bottom: 60px;'
		};
	},

	render: function render() {
		this.style = this.getStyles();
		var _t = this,
		    data = this.data,
		    st = this.state,
		    setState = this.setState;

		var wordTextarea = textarea({
			data: data.word,
			rows: st.wordPlace.length > 18 ? 2 : 1,
			class: 'wordTitle WordCard_textarea',
			style: 'font-size: 26px; font-weight: normal;',
			placeholder: st.wordPlace,
			oninput: function oninput(e) {
				_t.editWord(e, 'word');
			}
		});

		var clarifyerTextarea = textarea({
			data: data.clarifyer,
			rows: 3, style: 'font-size: 16px;',
			class: 'wordClarifyer WordCard_textarea',
			placeholder: st.clarifyerPlace,
			oninput: function oninput(e) {
				_t.editWord(e, 'clarifyer');
			}
		});

		wordTextarea.value = this.data.word;
		clarifyerTextarea.value = this.data.clarifyer;

		return [wordTextarea, clarifyerTextarea, div({ style: this.style.divider }), this.data.otherWords.map(this.renderMapOtherWords), SmallButton({
			text: 'Add Definition',
			style: this.style.addDefButton,
			onclick: this.addDefinition
		}), div({ style: this.style.divider }), this.renderSavingEditButtons()]; //div
	},

	renderSavingEditButtons: function renderSavingEditButtons() {
		var st = this.state,
		    setState = this.setState;

		return div({ style: this.style.buttonRow }, st.savingEdit ? [SmallButton({
			hakAnimate: true,
			text: 'Back',
			onclick: function onclick() {
				setState({ savingEdit: false });
			},
			style: 'width: 80px;'
		}), SmallButton({
			hakAnimate: true,
			text: 'Confirm Save',
			onclick: this.saveEdit,
			style: this.style.confirmButton
		})] : [SmallButton({
			hakAnimate: true,
			text: 'Cancel',
			style: 'width: 110px;',
			onclick: this.cancelEdit
		}), SmallButton({
			hakAnimate: true,
			text: 'Save',
			style: 'width: 110px; background: ' + STYLES.mainColor + '; color: white;',
			onclick: function onclick() {
				setState({ savingEdit: true });
			}
		})]);
	},

	renderMapOtherWords: function renderMapOtherWords(val, index) {
		var _t = this,
		    st = this.state,
		    index = index,
		    stateEntry = st.otherWords[index];

		var wordTextarea = textarea({
			rows: val.word.length > 20 ? 2 : 1,
			class: 'otherWordTitle WordCard_textarea boldFont',
			style: 'font-size: 18px;',
			placeholder: stateEntry ? stateEntry.word : st.otherWordPlace,
			oninput: function oninput(e) {
				_t.editWord(e, index, 'word');
			}
		});

		var clarifyerTextarea = textarea({
			rows: 3,
			class: 'wordClarifyer WordCard_textarea',
			style: this.style.clarifyerTextarea,
			placeholder: stateEntry ? stateEntry.clarifyer : st.otherClarifyer,
			oninput: function oninput(e) {
				_t.editWord(e, index, 'clarifyer');
			}
		});

		wordTextarea.value = val.word || '';
		clarifyerTextarea.value = val.clarifyer || '';

		return div({
			k: Math.random(),
			class: 'WordCard_otherWord',
			style: this.style.otherWordsContainer
		}, wordTextarea, clarifyerTextarea, SmallButton({
			text: 'delete',
			style: _t.style.deleteButton,
			onclick: function onclick() {
				_t.deleteDefinition(index);
			}
		})); //div
	},

	addDefinition: function addDefinition() {
		this.data.otherWords.push({ word: '', clarifyer: '' });
		this.fresh = false;
		this.setState({ k: Math.random() });
	},

	deleteDefinition: function deleteDefinition(i) {
		console.log(this.data.otherWords.splice(i, 1));
		console.log(this.data.otherWords);
		this.fresh = false;
		this.setState({ k: Math.random() });
	},

	editWord: function editWord(e, index, key) {
		this.fresh = false;
		if (typeof index === 'string') {
			this.data[index] = e.target.value;
			return true;
		}
		this.data.otherWords[index][key] = e.target.value;
	},

	saveEdit: function saveEdit() {
		var isMien = !!miscStore.getShelf('language').isMien,
		    newWord = hak.clone(this.data);

		newWord._id = this.state.word._id || (isMien ? 'mien-' : 'english-') + new Date().getTime();

		dictionaryStore.getEntireStore().editEntry(newWord, isMien);

		this.cancelEdit();
	},

	cancelEdit: function cancelEdit() {
		var equal = this.state.word.word === this.data.word && this.state.word.clarifyer === this.data.clarifyer;

		for (var i = 0; i < this.data.otherWords.length; i++) {
			var d = this.data.otherWords[i],
			    s = this.state.otherWords[i];
			if (!s || !d || d.word !== s.word || d.clarifyer !== s.clarifyer) {
				equal = false;
			}
		}
		equal = equal || this.fresh;

		this.resetState();
		this.setState({ k: Math.random() });
		if (equal) {
			this.props.cancelFunction && this.props.cancelFunction();
		}
	}

});

hak.addStyle(function (s) {
	var w = s.width < 450 ? s.width - 110 : 282;
	return '\n.WordCard_textarea {\n\tpadding: 10px;\n\twidth: ' + w + 'px;\n\tborder: 1px solid #fbfbfb;\n\tmargin: -3px 0px -3px 0px;\n}\n\n.WordCard_otherWord {\n\tmargin-top: 30px;\n\tmargin-bottom: 30px;\n\tfont-weight: bold;\n\tborder-sizing: box-border;\n\ttransition: 0.3s;\n}\n\n\t';
});
'use strict';

var WordCard = hak.Component({

	Constructor: function Constructor() {

		this.state = {
			open: this.props.open,
			editing: false,
			favorite: this.props.favorite || false,
			x: true,
			cancel: false
		};
		this.cardHeight = '1000px';
	},

	render: function render() {

		var _t = this,
		    pr = this.props,
		    st = this.state,
		    open = st.open,
		    q = pr.query === '*',

		//isFave = (pr.favorites.words.indexOf(p.id||'') > -1),
		word = q ? '<strong style="color: #000;">' + pr.word + '</strong>' : pr.word.replace(pr.query, '<strong style="color: #000;">' + pr.query + '</strong>'),
		    clarifyerShortened = pr.clarifyer.split('\n')[0].substring(0, 30)
		//+ (pr.clarifyer.split('\n')[0].length >= 30) ? '...' : '' 
		,
		    flatCardStyle = 'cursor: pointer; \n\t\t\t  margin: 7px 5px 0px 5px; \n\t\t\t  min-width: 30px; \n\t\t\t  padding: 15px 23px 2px 23px;  \n\t\t\t  -webkit-box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);\n        -moz-box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);\n          box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);',
		    className = open ? 'WordCard noSelect fainterShadow' : 'WordCard noSelect fainterShadow WordCard_closed';

		clarifyerShortened += pr.clarifyer.split('\n')[0].length >= 30 ? '...' : '';

		if (this.state.editing) {
			return this.renderEditCard();
		}

		return div({
			k: Math.random(),
			hakAnimate: true,
			id: this.id + 'w',
			class: className,
			style: !open ? flatCardStyle : '',
			onclick: !open ? this.openCard : ''
		}, div({ class: 'WordCard_header--section' }, div(p({ class: 'wordTitle' }, tohtml(word)), pr.clarifyer ? p({ class: 'wordClarifyer', style: 'font-size: 15px;' }, open ? pr.clarifyer : clarifyerShortened) : div({ style: 'display: none;' })), //div
		this.renderOpenOrFave()), //div

		open && this.renderOtherWords());
	},

	renderEditCard: function renderEditCard() {
		var _t = this,
		    d = div({
			class: 'WordCard noSelect faintShadow',
			style: 'margin: 20px;',
			hakAnimate: true
		});

		function callBack(height) {
			d.style.height = height + 50 + 'px';
		}

		var edit = EditWordCard({
			word: this.props,
			callBack: callBack,
			cancelFunction: function cancelFunction() {
				_t.setState({ editing: false });
			}
		});
		d.appendChild(edit);
		return d;
	},

	renderOpenOrFave: function renderOpenOrFave() {
		if (this.state.open) {
			var addToFaves = function addToFaves(e) {
				fave.addToFavorites(_t.props, isFave);
				isFave = !isFave;
				_t.setState({ x: !_t.state.x });
			};

			var _t = this,
			    fave = starStore.getShelf('favorites'),
			    isFave = fave.idList.indexOf(_t.props._id) > -1;

			var style = 'font-size: 24px; padding-top: 15px;' + (isFave ? 'color: ' + STYLES.faveColor + ';' : 'color: #888;');

			return div({
				onclick: addToFaves,
				style: 'padding: 15px; margin: -15px;'
			}, div({
				class: 'WordCard_button',
				style: style
			}, tohtml('&#9733;')) //div
			); //div
		} else {
			return div({
				class: 'WordCard_button'
			}, '+');
		}
	},

	renderOtherWords: function renderOtherWords() {
		var _t = this,
		    cancel = _t.state.cancel,
		    deleteEditStyle = 'float: right; margin-right: 5px;' + ' color: white; background: tomato;' + (cancel ? 'width: 145px;' : 'width: 120px;');

		return div({ class: 'WordCard_body' }, _t.props.otherWords.map(function (val, i) {
			return [div({ class: 'WordCard_divider' }), div({ class: 'WordCard_header--section WordCard_other' }, div(p({ class: 'otherWordTitle' }, ' ' + val.word), val.clarifyer ? p({ class: 'wordClarifyer', style: 'font-size: 14px;' }, val.clarifyer) : null))];
		}), this.props.editing ? [div({ class: 'WordCard_divider', style: 'margin-bottom: 18px;' }), SmallButton({
			hakAnimate: Math.random(),
			text: cancel ? 'No' : 'Edit',
			onclick: cancel ? function () {
				_t.setState({ cancel: false });
			} : function () {
				_t.setState({ editing: true });
			},
			style: 'float: right; color: white; background:' + STYLES.mainColor + ';'
		}), this.props.cancelEdit ? SmallButton({
			hakAnimate: Math.random(),
			text: cancel ? 'Are you sure?' : 'Delete Edit',
			onclick: cancel ? this.props.cancelEdit : function () {
				_t.setState({ cancel: !_t.state.cancel });
			},
			style: deleteEditStyle
		}) : null] : null

		//, this.renderButtons()
		);
	},

	renderButtons: function renderButtons() {
		return div({ class: 'WordCard_Buttons' }, div(), tohtml('&#9733;'));
	},

	openCard: function openCard() {
		this.setState({ open: !this.state.open });
	},

	playSound: function playSound() {
		var s = '../sound/words/' + this.state.id + '.mp3';
		var aud = new Audio(s);
		aud && aud.play();
	}

});

hak.addStyle(function (s) {
	var w = s.width < 450 ? s.width - 40 : 350;
	return '\n\n.WordCard {\n\tbox-sizing: border-box;\n\toutline: none !important;\n\toverflow: hidden;\n  border-radius: 12px;\n  padding: 25px 25px 17px 25px;\n  margin: 11px 5px 5px 5px;\n\tbackground: white;\n\ttransition: 0.24s;\n  width: ' + w + 'px;\n  max-width: ' + w + 'px;\n  min-width: ' + w + 'px;\n}\n\n.WordCard_closed {\n\twidth: ' + (w - 30) + 'px;\n\tmax-width: ' + (w - 30) + 'px;\n}\n';
}, '\n\n.WordCard_Buttons {\n\tdisplay: flex;\n\tjustify-content: space-between;\n\tpadding-top: 4px;\n\tfont-size: 22px;\n\twidth: 100%;\n\tcolor: #888;\n}\n.WordCard_button {\n  font-size: 36px;\n  text-align: center;\n  padding-top: 10px;\n  margin: -17px 19px -10px 10px;\n  width: 0px;\n  height: 10px;\n  cursor: pointer;\n}\n\n.WordCard_divider {\n\twidth: auto; \n\theight: 1px;\n\tbackground: ' + STYLES.backgroundColor + ';\n\tmargin: 14px -26px 7px -26px;\n}\n\n.WordCard_header--section {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 10px;\n}\n\n.WordCard_other {\n\tpadding: 5px 5px 0px 5px;\n}\n\n\n.wordTitle {\n\tcolor: #111;\n  font-size: 24px;\n  font-weight: bold;\n  line-height: 32px;\n  padding-bottom: 2px;\n  font-family: "Arial Black", Gadget, sans-serif;\n}\n\t\n.wordClarifyer {\n\tcolor: #555;\n\tfont-size: 12px;\n  font-style: italic;\n  left: 0; right: 0;\n  margin-right: 0px;\n  padding: 4px 5px 5px 5px;\n\n}\n\t\n.otherWordTitle {\n\tcolor: #222;\n  padding: 5px 0px 0px 0px;\n  font-size: 23px;\n\tline-height: 30px;\n}');
'use strict';

var Book = hak.Component({

	subscribe: [miscStore.subscribe('book', 'language'), starStore.subscribe('editing'),
	//miscStore.subscribe(),
	dictionaryStore.subscribe()],

	Constructor: function Constructor() {
		this.state = {
			results: [],
			abc: ['A-Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
		};
	},

	render: function render() {
		var _ = this,
		    book = this.shelf.book;
		//console.log('rendering book', this.shelf.hakCustomers)

		return div(book.selectedLetter ? div({ class: 'BookList' }, div({ class: 'BookList_sidescroller lightShadow' }, this.renderBookItems(1)), div({ id: 'DicAnchor', class: 'DicAnchor' }, p({ style: 'font-size: 40px; float: left; padding: 24px;' }, book.selectedLetter.toUpperCase()), this.getResults(10))) : div({ class: 'Book' }, this.renderBookItems()));
	},

	renderBookItems: function renderBookItems(n) {
		var book = this.shelf.book,
		    letter = book.selectedLetter,
		    style = n ? 'margin: -0px 7px -0px 5px;' : '',
		    abc = !letter ? this.state.abc.slice(1) : this.state.abc,
		    aToZ = this.state.abc[0];

		return abc.map(function (x) {
			return div({
				class: 'BookItem' + (!book.selectedLetter ? ' fainterShadow' : ''),
				style: style,
				id: 'book' + x,
				ontouchmove: function ontouchmove(e) {
					book.selectedLetter && e.stopPropagation();
				},
				onclick: function onclick() {
					document.documentElement.scrollTop = 0;
					var el = hak.$('.BookList_sidescroller'),
					    scr = el && el.scrollLeft;
					book.changeSelectedLetter(x !== aToZ ? x : '');
					var el = hak.$('.BookList_sidescroller');
					el && (el.scrollLeft = scr);
				}
			}, p({
				style: x === letter ? 'font-weight: bold; color: dodgerblue' : 'color: #111;'
			}, x));
		});
	},

	getResults: function getResults(starter, timer) {

		var sh = this.shelf,
		    editing = sh.editing.editStatus,
		    a = sh.book.selectedLetter,
		    lang = !sh.language.isMien ? 'english' : 'mien',
		    entries = sh[lang + 'Entries'] || [],
		    results = [],
		    starter = starter || 20;

		for (var i = 0; i < entries.length; i++) {
			var en = entries[i];
			if ((en.clarifyer || en.word) && en.word && en.word[0].toLowerCase() === a) {
				results.push(en);
			}
		}

		var addOns = results.splice(starter);

		setTimeout(function () {
			var rot = hak.$('#DicAnchor');

			rot.scrollTop = 0;

			setTimeout(function () {
				var nodes = addOns && addOns.map(function (val) {
					return WordCard(val, { query: '*', editing: editing });
				});
				for (var i = 0; i < addOns.length; i++) {
					rot && rot.appendChild(nodes[i]);
				}
			}, 2);
		}, 1);

		if (!results[0]) {
			return div({
				style: 'font-size: 20px; text-align: center; padding-top: 20px;'
			}, 'No results ' + (a ? 'for ' + a.toUpperCase() : 'yet'));
		}
		if (!sh.stocked) return div({ class: 'loader' });

		return results.map(function (val) {
			return WordCard(val, { query: '*', editing: editing });
		});
	}

});

// Scroll event listener to hide the letter bar on scroll down


hak.variables.scrollTop = 0;

APP.scrollEventFunctions.push(function (el) {
	if (!APP.playScrollFunctions) return;
	var scroll = el.scrollTop,
	    bookBar = hak.$('.BookList_sidescroller');

	if (bookBar) {
		if (hak.variables.scrollTop < scroll && scroll > 35) {
			bookBar.style.top = '-50px';
			bookBar.style.opacity = '0';
			hak.variables.scrolledDown = true;
		} else {
			bookBar.style.top = '0px';
			bookBar.style.opacity = '1';
			hak.variables.scrolledDown = false;
		}
	}
});

hak.variables.css += '\n\n\n.lightVertShadow {\n  -webkit-box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.3);\n     -moz-box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.3);\n          box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.3);\n} \n\n.DicAnchor{\n  justify-content: center;\n  align-items: center;\n  display: flex;\n\tflex-direction: column;\n  right: 0px;\n\tleft: 0px;\n\ttop: 0px;\n\tbottom: 0px;\n\tpadding: 17px 10px 200px 10px;\n}\n\n.Book {\n\tpadding: 20px 5px 100px 5px;\n\tleft: 0;\n\tright: 0;\n\tz-index: -1;\n\tjustify-content: center;\n\tdisplay: flex;\n\tflex-direction: row;\n\tflex-wrap: wrap;\n  align-items: center;\n}\n\n.BookItem {\n\tpadding: 12px 14px 12px 12px;\n\tborder-radius: 10px;\n  line-height: 40px;\n\ttext-align: center;\n  margin: 6px;\n  height: 40px;\n  font-size: 32px;\n  width: 50px;\n\tbackground-color: white;\n}\n\n.BookItem:hover {\n  cursor: pointer;\n  color: skyblue;\n}\n\n.BookList_sidescroller {\n\ttransition: 0.25s;\n\tposition: -webkit-sticky;\n\tposition: sticky;\n  background-color: white;\n  top: 0px;\n  margin-top: -48px;\n  padding: 48px 20px 0px 10px;\n  overflow-x: scroll;\n  white-space: nowrap;\n  display: flex;\n  z-index: 9;\n}\n\n';
'use strict';

var WordOfTheDay = hak.Component({

	subscribe: [miscStore.subscribe('language'), dictionaryStore.subscribe()],

	Constructor: function Constructor() {},

	render: function render() {
		var sh = this.shelf,
		    date = new Date(),
		    month = date.getMonth() * 170,
		    year = date.getFullYear() - 1950,
		    day = date.getDate(),
		    wordNum = month + day + year,
		    lang = sh.language.isMien ? 'mien' : 'english',
		    word = sh[lang + 'Entries'][wordNum];

		return div({ class: 'StarPage' }, p({ class: 'WordOfTheDay_text' }, 'Word of the Day'), word ? WordCard(word, { query: '*', open: true, editing: this.props.editing }) : div({ class: 'WordCard' }));
	}

});

hak.addStyle(function (s) {
	var w = s.width < 450 ? s.width - 40 : 360;
	return '\n.WordOfTheDay_text {\n\tfont-size: 26px; \n\tfont-weight: bold;\n\tcolor: #555; \n\tpadding: 30px 0px 10px 30px;\n\twidth: ' + w + 'px;\n}';
});

hak.variables.css += '\n.WordOfTheDay_text_small {\n\tdisplay: flex;\n\tfont-size: 22px; \n\tfont-weight: bold;\n\tcolor: #555; \n\tpadding-left: 15px;\n\tpadding-top: 25px;\n}\n';
'use strict';

var SearchBar = function SearchBar() {

	var _ = this,
	    setQ = miscStore.getMethods().search.setQuery,
	    query = miscStore.getData();

	hak.variables.scrollTop = document.documentElement.scrollTop;

	var searchBar = div({
		class: 'searchBar faintShadow',
		id: 'searchBar'
	}, input({
		id: 'searchBarInput',
		class: 'searchBarInput',
		placeholder: 'Search',
		value: query.search.query,
		onsubmit: function onsubmit(e) {
			console.log(e);
			e.blur();
		},
		onfocus: function onfocus() {
			hak.setParam('slide', '1');
			miscStore.getEntireStore().pageData.changePage('search');
		},
		oninput: function oninput() {
			setQ(hak.$('#searchBarInput').value);
		}
	}), button({
		class: 'searchButton',
		onclick: function onclick() {
			var s = hak.$('#searchBarInput');
			if (s) {
				s.value = '';
				s.focus();
				s.value = miscStore.getData().search.query;
			}
		}
	}, div({
		class: 'searchIcon',
		onclick: function onclick() {}
	}, tohtml('&#9906;'))));

	var filler = div({ class: 'searchFiller', id: 'searchFiller' });

	return [filler, searchBar];
};

var RecentSearchs = function RecentSearchs() {
	return div({ class: 'RecentSearchs' }, 'Results will appear here');
};

var SearchResults = hak.Component({

	subscribe: [miscStore.subscribe('search'), miscStore.subscribe('language'), starStore.subscribe('editing'), dictionaryStore.subscribe()],

	render: function render() {

		return div({ id: 'DicAnchorSearch', class: 'DicAnchorSearch' }, this.getResults());
	},

	getResults: function getResults(timer, definers) {

		var sh = this.shelf,
		    editing = sh.editing.editStatus,
		    query = sh.search.query.toLowerCase().trim(),
		    lang = !sh.language.isMien ? 'english' : 'mien',
		    entries = sh[lang + 'Entries'],
		    length = entries && entries.length || 0,
		    results = [[], [], []];

		if (!sh.stocked && query) return div({ class: 'loader' });
		if (!query) return RecentSearchs();

		for (var i = 0; i < length; i++) {
			if (entries[i].word.toLowerCase().trim() === query) {
				results[0].push(WordCard(entries[i], { open: true, query: query, editing: editing }));
				continue;
			}

			var ws = entries[i].word.split(',');

			for (var i2 = 0; i2 < ws.length; i2++) {
				if (ws[i2].toLowerCase().trim() === query) {
					results[1].push(WordCard(entries[i], { open: true, query: query, editing: editing }));
					break;
				}

				var wsi = ws[i2].split(' ');
				for (var i3 = 0; i3 < wsi.length; i3++) {
					if (wsi[i3].toLowerCase().trim() === query) {
						results[2].push(WordCard(entries[i], { query: query, editing: editing }));
						break;
					}
				}
			}
		}

		return results;
	}

});

var Search = hak.Component({

	setQuery: function setQuery(q) {
		this.setState({ query: q });
	},

	render: function render() {

		return div({
			class: 'SearchContainer'
		}, SearchBar(), SearchResults());
	}

});

APP.scrollEventFunctions.push(function (el) {
	if (!APP.playScrollFunctions) return;
	var scroll = el.scrollTop,
	    f = hak.$('#searchFiller'),
	    s = hak.$('#searchBar');

	if (hak.variables.scrollTop < scroll && scroll > 40
	//&& !hak.variables.scrolledDown
	) {
			f && (f.style.transition = '0', f.style.opacity = '0');
			s && (s.style.top = '-20px', s.style.opacity = '0.5');
			hak.variables.scrolledDown = true;
		} else {
		//if (hak.variables.scrolledDown) {
		f && (f.style.transition = '0.2s', f.style.opacity = '1');
		s && (s.style.top = '70px', s.style.opacity = '1');
		hak.variables.scrolledDown = false;
		//}
	}
});

hak.addStyle(function (s) {

	var w = s.width < 450 ? s.width - 32 : 358;

	return '\n\n\n.RecentSearchs {\n\twidth: ' + w + 'px;\n\ttext-align: center;\n\tpadding-top: 30px;\n\tfont-style: italic;\n\tcolor: #999;\n\tfont-size: 20px;\n}\n\n.searchBar {\n\ttransition: 0.25s;\n\tposition: sticky;\n\ttop: 70px;  \n\tborder-radius: 120px;\n\tbackground-color: white;\n\tpadding: none;\n\toverflow: hidden; \n\tdisplay: flex;\n\tjustify-content: center;\n\twidth: ' + w + 'px;\n\talign-self: center;\n\tz-index: 30;\n}\n\t\n.searchBarInput {\n\twidth: ' + (w - 80) + 'px;\n  font-size: 26px;\n  border: none; \n  padding: 6px 4px 6px 6px;\n  outline: none;\n\tbackground-color: white;\n}\n\t\n';
}, '\n\n.searchFiller {\n\tposition: fixed; \n\twidth: 100%; \n\ttop: 0;\n\theight: \n\t95px; \n\tz-index: 2; \n\tbackground-color: ' + STYLES.backgroundColor + ';\n}\n\n.SearchContainer {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  position: relative;\n  background-color: ' + STYLES.backgroundColor + ';\n}\n\t\n.searchButton {\n\tbackground-color: white;\n  font-size: 32px;\n  border: none; \n  padding: 0px 8px 0px 8px;\n  outline: none;\n\ttransition: 0.3s;\n}\n.searchButton:hover {\n\tcursor: pointer;\n\tcolor: skyblue;\n}\n\n\n.DicAnchorSearch{\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  right: 0px;\n  left: 0px;\n  padding: 40px 10px 200px 10px;\n  overflow: hidden;\n}\n');
'use strict';

var Options = hak.Component({
	subscribe: [starStore.subscribe('editing')],

	render: function render() {
		return div({
			class: 'flex-column',
			style: 'padding-top: 40px;'
		}, p({ class: 'WordOfTheDay_text' }, 'Settings'), this.renderOptions());
	},

	renderOptions: function renderOptions() {
		var editStatus = this.shelf.editing.editStatus,
		    flatStyle = '-webkit-box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);\n        -moz-box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);\n          box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);';

		return [div({ class: 'Options_switch WordCard faintShadow' }, 'Editing Mode', SmallButton({
			text: editStatus ? 'on' : 'off',
			style: editStatus ? 'background: ' + STYLES.boldColor + '; color: white;' : 'background: #fff;' + flatStyle,
			onclick: this.shelf.editing.changeEditStatus
		}))];
	}
});

hak.variables.css += '\n\n.Options_switch {\n\tdisplay: flex;\n\tjustify-content: space-between;\n\tpadding: 15px 15px 15px 20px;\n\tfont-size: 24px;\n\tcolor: #222;\n\tline-height: 40px;\n}\n\n';
'use strict';

var Welcome = hak.Component({

	render: function render() {
		return div({ class: 'Welcome-container' }, div({ class: 'WordCard faintShadow Welcome' }, h4('Welcome to the'), h2('Iu Mien Dictionary!'), p({ style: 'font-style: italic; font-size: 14px; padding-top: 5px;' }, 'An app to help utilize Vicky\'s Mien dictionary spreadsheet more effectively'), br(), p(strong('Add this site to the home screen'), ' to use offline.'), br(), p('Navigate around with the tab buttons below, and change the search language by hitting the button in the top right corner.'), p('Have fun!')));
	}
});

hak.variables.css += '\n.Welcome-container {\n\tposition: fixed;\n\tdisplay: flex; \n\tjustify-content: center; \n\talign-items: center; \n\tright: 0px;\n\ttop: 60px;\n\tleft: 0px; \n\tbottom: 60px; \n}\n\n.Welcome {\n\tpadding: 40px;\n\twidth: auto;\n\theight: auto;\n}\n\n\n';
'use strict';

var EditPage = hak.Component({
	subscribe: [starStore.subscribe('editing'), miscStore.subscribe('language'), dictionaryStore.subscribe('editedEntries')],

	render: function render() {
		if (!this.shelf.editing.editStatus) {
			return div();
		}

		var d = div({ class: 'WordCard noSelect faintShadow ', hakAnimate: true });
		function callBack(h) {
			d.style.height = h + 50 + 'px';
		}
		d.appendChild(EditWordCard({ callBack: callBack }));

		var sh = this.shelf,
		    lang = this.shelf.language.isMien ? 'Mien' : 'English';

		return div({ class: 'flex-column', style: 'margin-top: 40px;' }, p('Editing', { class: 'WordOfTheDay_text' }), p('Add a new ' + lang + ' word', { class: 'WordOfTheDay_text_small' }), d, div({ style: 'height: 30px;' }), p('My edited words', { class: 'WordOfTheDay_text_small' }), this.renderMyEditedWords(), div({ style: 'height: 140px;' }));
	},


	renderMyEditedWords: function renderMyEditedWords() {
		var style = 'display: flex;' + ' flex-direction: column;' + ' justify-content: center;' + ' align-items: center;',
		    editedEntries = this.shelf.editedEntries;

		return div({ style: style }, editedEntries.list.map(function (val) {
			var props = {
				editing: true,
				cancelEdit: function cancelEdit() {
					editedEntries.cancel(val);
				}
			};
			return WordCard(val, props);
		}).reverse());
	}

});
'use strict';

var StarPage = hak.Component({

	subscribe: [starStore.subscribe()],

	render: function render() {

		var StarPage = div({ class: 'StarPage', style: 'padding-bottom: 150px;' }, this.renderSettingsButtons(), !this.shelf.settings.showSettings ? [WordOfTheDay({ editing: this.shelf.editing.editStatus }), this.renderFavorites(),
		//Options(),
		this.renderShare()] : [Options(), EditPage()]);

		return StarPage;
	},

	renderSettingsButtons: function renderSettingsButtons() {
		var set = this.shelf.settings,
		    style = '\n\t\t\t\tborder-radius: 10px;\n\t\t\t\tbox-sizing: border-box;\n\t\t\t\theight: 46px; \n\t\t\t\twidth: 48px;\n\t\t\t\tpadding: 8px;';

		return div({ class: 'renderSettingsButtons_container' }, PageSelectorButtons({
			entries: [['Favorites ', div({ style: 'margin-left: 10px; font-size: 22px;' }, tohtml('&#9733;'))], div({ style: 'display: flex; padding-top: 2px;' }, 'Settings ', img({
				src: 'images/gear.png',
				width: '28px',
				height: '28px',
				style: 'margin: -3px 0px 0px 10px ;'
			}))],
			selected: set.showSettings || 0,
			onclick: function onclick(e, i) {
				return set.changePage(e, i);
			}
		}));
	},

	renderFavorites: function renderFavorites() {
		var list = this.shelf.favorites.idList,
		    editing = this.shelf.editing.editStatus;

		var kids = [p({ class: 'WordOfTheDay_text' }, 'My Saved Words')];

		var newKids = kids.concat(list[0] ? this.shelf.favorites.getFavorites().map(function (val) {
			return WordCard(val, { open: 'true', editing: editing });
		}).reverse() : [div({ class: 'RecentSearchs' }, 'Your saved words will appear here, simply hit the star to save a word')]);
		return newKids;
	},

	renderShare: function renderShare() {
		return tohtml('');
	}

});

hak.addStyle(function (s) {
	var w = s.width < 450 ? s.width - 36 : 360;

	return '\n\n\n.StarPage {\n\tpadding: 40px 0px 10px 0px; \n\tdisplay: flex; \n\tflex-direction: column;\n\talign-items: center;\n\tjustify-content: center;\n}\n\n.shareContainer {\n\tdisplay: flex;\n\tjustify-content: space-around;\t\n}\n\n.shareChild span {\n\tpadding: 10px 30px 10px 30px;\n\twidth: 40px;\n\theight: 40px;\n}\n\n.FavoritesList {\n\tpadding: 60px 0px 200px 0px; \n\tjustify-content: center;\n\tdisplay: flex;\n\talign-items: center;\n}\n\n.renderSettingsButtons_container {\n\tdisplay: flex;\n\tjustify-content: space-between;\n\tmargin: -16px 0px -18px 0px;\n}\n';
});
'use strict';

function Header(props) {

	var langButton = hak.K({
		subscribe: miscStore.subscribe('language')
	}, function () {
		var _ = this,
		    lang = !this.shelf.language.isMien ? 'En' : 'Mien';

		window.HeaderChangeLang = function () {
			_.shelf.language.changeLanguage();
		};

		return SmallButton({
			text: strong(lang),
			onclick: _.shelf.language.changeLanguage,
			toggle: true,
			style: 'height: 36px; line-height: 36px; width: 60px; transition:0;',
			onStyle: 'width: 50px;',
			isOn: !_.shelf.language.isMien
		});
	});

	return [div({
		class: 'Header lightShadow',
		id: 'Header',
		style: 'background:' + STYLES.menuBarColor + ';'
	},
	//div({class: 'horizontal-filler-desktop'}),
	h1('Iu Mien Dictionary', { style: 'font-weight: bold;' }), div({ class: 'flex-row' }, TabBar(), langButton) //,
	//div({class: 'horizontal-filler-desktop'})
	), div({ style: 'left: 0; right: 0; height: 48px; ' })];
}

var TabBar = hak.Component({

	subscribe: [miscStore.subscribe('book'), miscStore.subscribe('search'), miscStore.subscribe('pageData')],

	render: function render(props) {
		var _t = this,
		    book = this.shelf.book,
		    pageData = this.shelf.pageData,
		    selectedPage = pageData.selectedPage,
		    changePage = pageData.changePage,
		    search = this.shelf.search,
		    isMobile = hak.screenSize.width < 500,
		    selectedStyle = 'color: ' + STYLES.mainColor + '; background: white;';

		return div({
			class: 'TabBar lightShadow',
			id: isMobile ? 'Tab_Bar_hiding' : ''
		}, div({
			class: 'tabButton',
			style: selectedPage === 'book' ? selectedStyle : '',
			onclick: function onclick() {
				if (window.location.hash.indexOf('book') > -1) {
					hak.setParam('letter', false, true);
					window.onpopstate();
				} else {
					router.linkTo('home/book');
					changePage('book');
				}
			}
		}, strong('A-Z')), div({
			class: 'tabButton',
			style: selectedPage === 'search' ? selectedStyle : '',
			onclick: function onclick() {
				if (window.location.hash.indexOf('search') > -1) {
					//search.setQuery('');
					var el = hak.$('#searchBarInput');
					el && (el.value = '');
					el && el.focus();
					el && (el.value = search.query);
				} else {
					router.linkTo('home/search');
					changePage('search');
					//if (!search.query) hak.$('#searchBarInput').focus();
				}
			}
		}, div({ class: 'searchIcon', style: 'padding-left: 2px;' }, tohtml('&#9906;'))), div({
			class: 'tabButton',
			style: selectedPage === 'star' ? selectedStyle : '',
			onclick: function onclick() {
				router.linkTo('home/star');
				changePage('star');
			}
		}, div({ style: 'font-size: 24px;' }, tohtml('&#9733;'))));
	}

});

var Home = hak.Component({

	render: function render() {
		var t = this,
		    onscroll = function onscroll(e) {
			APP.scrollEventFunctions.forEach(function (val) {
				val(e.target);
			});
			hak.variables.scrollTop = e.target.scrollTop;
		};

		var home = div({ class: 'HomePage', id: 'HomePage' }, Header(), this.renderRoutes()
		//,TabBar()
		);
		home.addEventListener('scroll', onscroll, { passive: true });
		return home;
	}

	// setSwipe: function() {
	// 	var callback = function(ind) {
	// 		hak.setParam('slide', ind);
	// 		miscStore.getMethods().pageData.stockShelf({ selectedPage: ind })
	// 	}

	// 	setTimeout(function() {
	// 		var p = miscStore.getEntireStore().pageData;

	// 		window.mySwipe = new Swipe(hak.$('#slider'), {
	// 			startSlide: p.selectedPage,
	// 			transitionEnd: callback,
	// 			continuous: false,
	// 			speed: 130,
	// 			draggable: true
	// 		});
	// 		p.stockShelf({ go: !p.go });
	// 	}, 1);

	// }


});

hak.addStyle(function (s) {
	var w = s.width < 600,
	    tabbar = hak.$('.TabBar');
	if (tabbar) {
		tabbar.id = w ? 'Tab_Bar_hiding' : '';
	}

	return w ? '' : '\n.TabBar {\n\tposition: relative;\n\twidth: auto;\n\tmargin-right: 10px;\n\t-webkit-box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.30);\n     -moz-box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.30);\n\t\t\t\t\tbox-shadow: 0px 0px 0px 0px rgba(0,0,0,0.29);\n}\n.tabButton {\n\twidth: 68px;\n\theight: 47px;\n\tcolor: white;\n\tbackground: ' + STYLES.mainColor + ';\n\tmargin: -3px 0px -3px 0px;\n\t\n}\n';
});

hak.variables.css += '\n\n.Swipe_ {\n\tmargin-top: -12px;\n}\n\n.HomePage {\n  left: 0;\n  bottom: 0;\n  right: 0;\n\ttop: 0;\n\tposition: absolute;\n\toverflow: scroll;\n}';
'use strict';

var router = hak.Router('home/book');

router.addRoutes(['home', Home], ['star', StarPage], ['book', Book], ['welcome', Welcome], ['search', Search]);

router.addMiddleware(function (oldRoutes, newRoutes) {
	var home = hak.$('#HomePage') || hak.El('div')(),
	    scroll = home.scrollTop || 0,
	    oldRoute = oldRoutes[oldRoutes.indexOf('home') + 1],
	    newRoute = newRoutes[newRoutes.indexOf('home') + 1];
	!APP.routes[oldRoute] && (APP.routes[oldRoute] = {});
	!APP.routes[newRoute] && (APP.routes[newRoute] = {});

	APP.playScrollFunctions = false;
	APP.routes[oldRoute].scroll = scroll;
	setTimeout(function () {
		home && (home.scrollTop = APP.routes[newRoute].scroll || 0);
	}, 1);
	setTimeout(function () {
		var newRoute = newRoutes[newRoutes.indexOf('home') + 1];
		home && (home.scrollTop = APP.routes[newRoute].scroll || 0);
	}, 80);
	setTimeout(function () {
		APP.playScrollFunctions = true;
	}, 300);
});
'use strict';

hak.addStyle(function (s) {
  var w = s.width < 500 ? 0 : (s.width - 500) / 2;

  return '\n.horizontal-filler-desktop {\n  width: ' + w + 'px;\n  flex: 0.01;\n  display: ' + (w ? 'block' : 'none') + ';\n  position: ' + (w ? 'relative' : 'fixed') + ';\n}\n';
});

hak.addStyle(hak.variables.css + ('\n\n* {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-tap-highlight-color: transparent;\n}\n\nbody {\n  background: ' + STYLES.backgroundColor + ';\n}\n\n.Header {\n  font-weight: bold;\n}\n\n.flex-column {\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  justify-content: center;\n  align-items: center; \n}\n\n.flex-row {\n  display: flex;\n  box-sizing: border-box;\n  justify-content: center;\n  align-items: center;\n}\n\n.swipe {\n  overflow: hidden;\n  visibility: hidden;\n  position: relative;\n}\n.swipe-wrap {\n  overflow: hidden;\n  position: relative;\n}\n.swipe-wrap > div {\n  float: left;\n  width: 100%;\n  height: 100vh;\n  overflow-x: scroll;\n  position: relative;\n}\n\n.noSelect {\n  -webkit-tap-highlight-color: transparent;\n}\n\n.mediumShadow {\n  -webkit-box-shadow: 0px 3px 9px 1px rgba(0,0,0,0.25);\n     -moz-box-shadow: 0px 3px 9px 1px rgba(0,0,0,0.25);\n          box-shadow: 0px 3px 9px 1px rgba(0,0,0,0.25);\n}\n\n.heavyShadow {\n  -webkit-box-shadow: 0px 0px 18px -1px rgba(0,0,0,0.8);\n  -moz-box-shadow: 0px 0px 18px -1 px rgba(0,0,0,0.8);\n  box-shadow: 0px 0px 18px -1px rgba(0,0,0,0.8);\n}\n\n.bottomBorder {\n  border-bottom: 2px solid black;\n}\n\n.flat {\n  -webkit-box-shadow: 0px 0px 0px 0px white;\n     -moz-box-shadow: 0px 0px 0px 0px white;\n          box-shadow: 0px 0px 0px 0px white;\n}\n\n.boldFont {font-weight: bold;}\n'));

hak.mount(router.render(), '#root', true);
