// updated 25/04/2018



//TODO: fix this

(function () {



	////////////////////////////
	/*    helper functions   */
	///////////////////////////

	function snakeToCamel(str) { return str.replace(/([-_]\w)/g, g => g[1].toUpperCase()); }

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

		var width = window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth;

		var height = window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight;

		return {
			width: width,
			height: height
		};
	}

	var hakScreenSize = hakGetScreenSize();

	window.addEventListener('resize', function () {
		hakScreenSize = hakGetScreenSize();
	})



	// hak scope variables that contain css properties
	// to be added to the document head in the next function
	var hasHakStyleEl = false,
		hakStyleEl,
		hakStyleElDynamic,
		hakGlobalStyleList = [],
		newStylesFunction = [],
		updateStyles = function() { 
			newStylesFunctions.forEach(function() { 
				f() 
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
			if (hakStyleElDynamic.styleSheet) { // IE
				hakStyleElDynamic.styleSheet.cssText = newCss;
			} else { // the world
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
				if (hakStyleElDynamic.styleSheet) { // IE
					hakStyleElDynamic.styleSheet.cssText += args[i](hakScreenSize);
				} else { // the world
					hakStyleElDynamic.appendChild(
						document.createTextNode(args[i](hakScreenSize))
					);
				}
			}
			if (typeof args[i] === 'string') {
				if (hakStyleEl.styleSheet) { // IE
					hakStyleEl.styleSheet.cssText += args[i];
				} else { // the world
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
		return (obj && typeof obj === 'object' && !Array.isArray(obj));
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
					if (
						(hakIsObj(args[i][prop]) && hakIsObj(base[prop]))
					) {
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
		aud.setAttribute('id', ((id || '') + fileName));

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
					if (typeof prop === 'object') {
						for (var attr in prop) {
							if (attr === 'style') {
								prop.style.split(';').forEach(function(x) {
									console.log('making style')
									var s = x.split(':');
									if (x.trim() !== '' && s[0] && s[1]) {
										console.log(x);
										var p = snakeToCamel(s[0].trim());
										var a = s[1].trim();
										console.log(p, 'p',a, 'a')
										e.style[p] = a;
									}
								});
								continue;
							}
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
		}
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
			if (e.styleSheet) { // IE
				e.styleSheet.cssText = text;
			} else { // the world
				e.appendChild(document.createTextNode(text));
			}
			return e;
		}
	

		tags['tohtml'] = function(text) {
			var h = tags.div();
			h.innerHTML = text;
			return h;
		}
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
				return (
					hakEl('div')({
							style: 'margin: 0; padding: 0;'
						},
						this.children.map(function (item, i) {
							return item;
						})
					)
				);
			}
		}

		if (!constructData.hasOwnProperty('renderRoutes')) {
			constructData.renderRoutes = function () {
				return this.hakRouteNode || hakEl('div')();
			}
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
					this.children.push(args[i])
					continue;
				}
				if (typeof args[i] === 'string') {
					var sp = document.createElement('span');
					sp.innerText += args[i];
					this.children.push(sp);
					continue;
				}
				if (typeof args[i] === 'object') {
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
			this.update = function() {
				var a = Math.random();
				_this.updateKey = a;
				_this.lastUpdate = a;
			}


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
						},
						r
					)
				}

				setTimeout(function () {
					if (!firstRender && !document.body.contains(_this.node)) {
						if (_this.hakRouteNodeId ==='2') {
							_this.nodeActive = 'r';
						} else {
							_this.nodeActive = false;
						}
						
					}
					_this.componentDidRender && _this.componentDidRender();
				}, 10);

				return el;
			}


			var buyShelf = function (newStuff) {

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
			}

			var setState = function (newStuff) {
				this.state = hakMerge({}, this.state, newStuff);
				hakReplaceNodes(this.node, createNode());
				_this.update();
			}

			// var isNodeActive = function() {
			// 	return document.body.contains(_this.node)
			// }


			this.setState = setState.bind(this);


			this.connectCustomer = function (sub) {
				//console.log('calling sub')
				var subbed = sub(this.id, buyShelf);
				var actions = subbed.actions;
				this.shelf = hakMerge((this.shelf || {}), subbed.shelf);
				for (var prop in actions) {
					if (actions.hasOwnProperty(prop)) {
						this[prop] = actions[prop];
					}
				}
			}


			this.subscribeNew = function(store) {
				if (Array.isArray(store)) {
					for (var i = 0; i < store.length; i++) {
						this.connectCustomer(store[i]);
					}
				} else {
					this.connectCustomer(store);
				}
			}


			if (this.subscribe) {
				if (Array.isArray(this.subscribe)) {
					for (var i = 0; i < this.subscribe.length; i++) {
						this.connectCustomer(this.subscribe[i]);
					}
				} else {
					this.connectCustomer(this.subscribe)
				}
			}
			if (this.props.subscribe) {
				if (Array.isArray(this.props.subscribe)) {
					for (var i = 0; i < this.props.subscribe.length; i++) {
						this.connectCustomer(this.props.subscribe[i]);
					}
				} else {
					this.connectCustomer(this.props.subscribe)
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
				this.props.hakRouteInit(this.hakRouteNode/*, update*/);
			}

			this.Constructor && this.Constructor();

			this.render || (this.render = function () {
				return hakEl('div')()
			});

			this.nodeActive = true;
			this.node = createNode(true);
		}


		return function () {
			var c = new Component(arguments);
			c.componentDidMount && (setTimeout(c.componentDidMount, 10));
			return c.node;
		}
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
			if (p !== 'transition' &&
				p !== 'parentRule' &&
				p !== 'length') {
				next.style[p] = prev.style[p];
			}
		}
		next.className = prev.className;
		next.style.height = prev.offsetHeight + 'px';
		next.style.width = prev.offsetWidth + 'px';

		next.parentElement.replaceChild(next.cloneNode(true), next);
		prev.parentElement.replaceChild(next, prev);

		setTimeout(function () {
			next.style.transition = (next.style.transition ||
				prev.style.transition ||
				'0.3s');
			for (var p in newStyle) {
				if (p !== 'transition' &&
					p !== 'parentRule' &&
					p !== 'length') {
					next.style[p] = newStyle[p];
				}
			}
			next.style.height = newStyle.height;
			next.style.width = newStyle.width;
			next.className = className;
			document.body.removeChild(cloned);
		}, 1)

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
				newStyle[p] = clone.style[p]
			}

			clone.style.opacity = '0';
			clone.style.position = 'fixed';
			document.body.appendChild(clone);

			setTimeout(function () {
				newStyle.height = clone.offsetHeight;
				newStyle.width = clone.offsetWidth;
				for (var p in newStyle) {
					if (newStyle.hasOwnProperty(p) &&
						p !== 'parentRule' &&
						p !== 'length') {
						prev.style[p] = newStyle[p];
					}
				}

				prev.style.height = clone.offsetHeight;
				prev.style.width = clone.offsetWidth;
				document.body.removeChild(clone);
			}, 1)
		}, 1)
	}


	function hakAnimateChild(parent, child, remove) {
		var style,
			animate = child.getAttribute('hakAnimate'),
			childClone = child.cloneNode(true);

		if (remove) {
			parent.removeChild(child);
		} else {

			setTimeout(function () {
				style = hakClone(childClone)
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
					child.style = hakMerge(child.style, style)
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
					if (!(next.children[i])) {
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
						hakReplaceNodes(prev.children[i], next.children[i]) &&
							animated && (shouldAnimateParent = true);
					}
				}

				for (var j = prev.children.length; j < next.children.length; j++) {
					// adding children
					var kid = next.children[j];
					next.replaceChild(kid.cloneNode(true), kid);
					if (kid.hasAttribute('hakAnimate')) {
						hakAnimateChild(prev, kid)
					} else {
						prev.appendChild(kid);
					}
					if (j === next.children.length - 1) {
						animated && (shouldAnimateParent = true);
					}
				}

			} else {
				while (prev.firstChild) {
					// removing child
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
			if (typeof a[i] === 'object' && !Array.isArray(a[i])) {
				hakMerge(data, a[i]);
			}
			if (typeof a[i] === 'function') {
				data.render = a[i];
			}
		}
		return hakComponent(data)()
	}



































	/* Now for the Store 

		A redux like immutable data container that updates its subscribed components 
		whenever the data changes. 
	*/



	function hakStore(initialData, storageName, dataBase) {


		var store = initialData ||
			{
				Constructor: function () {
					console.log('No initial data given')
				}
			},
			fetched = false,
			paramData = {},
			paramKeys = {},
			firstParamSet = true,
			settingStorage = false,
			setStorage = function () {};


		function addMethods(shelf, customers, reset, isStore) {
			for (var prop in shelf) {
				if (shelf.hasOwnProperty(prop)) {
					if (typeof shelf[prop] === 'object' &&
						!Array.isArray(shelf[prop])) {
						addMethods(shelf[prop]);
					}
					if (typeof shelf[prop] === 'function')
						shelf[prop] = shelf[prop].bind(shelf);
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
			shelf.hakCustomers = reset ?
				customers || [] :
				shelf.hakCustomers || customers || [];
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
				if (typeof shelf === 'object') {
					if (shelf.shelf_id === id) {
						shelf.updateCustomers(true);
						return true;
					}
					for (var prop in shelf) {
						if (shelf.hasOwnProperty(prop) &&
							search(shelf[prop], id) &&
							shelf.hasOwnProperty('updateCustomers')) {
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
					if (this.hasOwnProperty(prop) &&
						hakIsObj(this[prop]) &&
						this[prop].hasOwnProperty('updateCustomers')) {
						this[prop].updateCustomers(true);
					}
				}
			}
		}


		function addCustomer(subbed) {
			this.hakCustomers.push(subbed)
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
							if (typeof shelf[prop] === 'function')
								obj[prop] = shelf[prop];
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
						if (typeof val === 'object') {
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

				if (old.hasOwnProperty('privateShelf') && old.privateShelf)
					return;
				for (var prop in old) {
					if (old.hasOwnProperty(prop)) {
						if (
							prop === 'hakCustomers' ||
							prop === 'shelf_id' ||
							prop === 'methodsAdded'
						) continue;

						if (typeof old[prop] === 'object') {
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


			if (idbKeyval &&
					store.useIndexDB && (
					window.indexedDB ||
					window.mozIndexedDB ||
					window.webkitIndexedDB ||
					window.msIndexedDB)) {

				hakVariables.fetched++;

				setStorage = function () {
					//console.log('setting storage', getData())
					idbKeyval.set(storageName, getData());
					settingStorage = false;
					// idbKeyval.get(storageName)
					// 	.then(console.log)
				}

				idbKeyval.get(storageName)
					.then(function (data) {
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

				setStorage = function () {
					//console.log('setting')
					localStorage.setItem(
						storageName,
						JSON.stringify(getData())
					)
					settingStorage = false;
				}
				var loc = JSON.parse(localStorage.getItem(storageName) || '{}');
				//addMethods(loc, null, true);
				//console.log('loc',loc)
				loc && hakMerge(
					store,
					loc
				);
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
				fetch(dataBase)
					.then(function (data) {
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
								mergeNew(newOb[i], oldOb[i])
							}
						}
					}
				}

				function gogo(o) {
					if (typeof o === 'object') {
						for (var p in o) {
							if (o.hasOwnProperty(p)) {
								if (typeof o[p] === 'object') {
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
				return gogo(x)
			}

			function stockViaParams() {
				forceStockStore(
					firstGo(paramKeys, hakGetParams())
				);
				console.log('works')
			}

			stockViaParams();

			var w = window.onpopstate;
			window.onpopstate = function () {
				w && w();
				stockViaParams();
			}

		}












		addMethods(store, [], true, true);

		return {

			setParams: setParams,

			updated: fetched,

			getMethods: getMethods,

			getData: getData,

			getEntireStore: function () {
				return store;
			},

			stockInShelf: function () {
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


			getShelf: function (shelf) {
				return hakMerge({}, getInPath(store, shelf));
			},


			subscribe: function () {
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
				}

			}

		}
	}

	/* Usage examples

	var store = hakStore({ things: {item1: '1', item2: '2'}});

	store.



	*/























	function hakGetPathname(noHash) {
		if (!noHash) {
			var l = window.location.hash.split('?')[0].split('/');
			return l.filter(function (w) {
				return (w !== '');
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
			key && (delete p[key]);
		}

		for (var i in p) {
			if (p.hasOwnProperty(i) && p[i]) {
				l.push(i + '=' + p[i]);
			}
		}
		var s = l[0] ? ('?' + l.join('&')) : '';
		s = window.location.href.split('?')[0] + s;

		window.history[
			(pushState ? 'pushState' : 'replaceState')
		](null, null, s);
	}





	function hakRouter(def, noHash) {

		var hasHash = !noHash;

		if (!window.location.hash && hasHash) {
			var uri = window.location.href.split('?');
			var search = uri[1];
			var params = search ? ('?' + search) : '';
			if (def) {
				window.history.replaceState(null, null, uri[0] + '#/' + def + params);
			} else {
				window.history.replaceState(null, null, uri[0] + '#/home' + params)
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

				if (!rendered ||
					gogo ||
					oldRFiltered[i] !== newRFiltered[i] ||
					newRoute === newRFiltered[i]
				) {
					gogo = true;
					var nodes = getNodes(routes[newRFiltered[i]]),
						rooT = (i === 0) ? rootNode : rootNodeList[i - 1];

					while (rooT.firstChild) {
						rooT.removeChild(
							rooT.firstChild
						)
					}
					rooT.appendChild(nodes.node)
					callbacks[newRoutes[i]] && callbacks[newRoutes[i]]();

					rootNodeList[i] = nodes.rootNode;

				}

				while (oldRFiltered[i + 1] &&
					rootNodeList[i + 1] &&
					rootNodeList[i + 1].firstChild
				) {
					rootNodeList[i + 1].removeChild(
						rootNodeList[i + 1].firstChild
					);
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

			getRoutes: function () {
				return routes;
			},

			linkTo: function (link, callback) {
				link = link[0] === '#' ? link : link[1] === '/' ? '#' + link : '#/' + link;
				var param = '?' + window.location.href.split('?')[1];
				var newPa = null;console.log(link, window.location.hash)

				if (link.split('?')[1]) {
					newPa = link.split('?')[1];
					link = link.split('?')[0];
					if (param) {
						newPa = newPa.split('&');
						for (var i = 0; i < newPa.length; i++) {
							if (param.match(newPa[i].split('=')[0] + '=')) {
								param = param.replace(
									param.split(newPa[i].split('=')[0] + '=')[1].split('&')[0],
									newPa[i].split('=')[1]
								);
							} else {
								param += '&' + newPa[i];
							}
						}
					} else {
						param = newPa;
					}
				}
				param = param.replace('undefined&', '');

				link = (param !== '?' && param !== '?undefined') ? link + param : link;
				
				if (link !== window.location.hash) {
					history.pushState(null, null, link);
					updateRoutes();
				}
				callback && callback();
			},


			render: function () {
				runMiddleware(null, true);

				if (hakVariables.fetched > 0) {
					console.log('fetched')
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


			addMiddleware: function (func) {
				middleware.push(func);
			},


			addRoute: function (route, component, callBack, rendering) {
				//console.log('adding Route')

				if (route === '/') noHash = true;
				routes[route] = {};
				routes[route].component = component;
				if (callBack) callbacks[route] = callBack;
				componentList.push(route);

				!rendering && rendered && updateRoutes();
			},


			addRoutes: function () {
				var _ = this,
					args = arguments;

				for (var i = 0; i < args.length; i++) {
					_.addRoute(args[i][0], args[i][1], args[i][2], true)
				}

				rendered && updateRoutes();
			},



			add: function (a) {
				if (Array.isArray(a)) {
					this.addRoutes(arguments);
				} else {
					this.addRoute(arguments);
				}
			}

		}

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
	}

})();