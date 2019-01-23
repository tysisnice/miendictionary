




function Header(props) {

	var langButton = hak.K({ 
			subscribe: miscStore.subscribe('language') 
		}, 
		function() { 
			var _ = this,
				lang = (!this.shelf.language.isMien ? 'En' : 'Mien');

			window.HeaderChangeLang = function() {
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
		}
	);

	return [
		div({ 
				class: 'Header lightShadow', 
				id: 'Header', 
				style: 'background:' + STYLES.menuBarColor  + ';'
			},
			//div({class: 'horizontal-filler-desktop'}),
			h1('Iu Mien Dictionary', {style: 'font-weight: bold;'}),
			div({ class: 'flex-row'},
				TabBar(),
				langButton
			)//,
			//div({class: 'horizontal-filler-desktop'})
		),
		div({ style: 'left: 0; right: 0; height: 48px; ' })
	];
}







var TabBar = hak.Component({

	subscribe: [
		miscStore.subscribe('book'),
		miscStore.subscribe('search'),
		miscStore.subscribe('pageData')
	],


	render: function(props) {
		var _t = this,
			book = this.shelf.book,
			pageData = this.shelf.pageData,
			selectedPage = pageData.selectedPage, 
			changePage = pageData.changePage, 
			search = this.shelf.search,
			isMobile = hak.screenSize.width < 500,
			selectedStyle = `color: ${STYLES.mainColor}; background: white;`;

		return div({ 
				class: 'TabBar lightShadow',
				id: (isMobile ? 'Tab_Bar_hiding' : '')
			},

			div({
					class: 'tabButton', 
					style: selectedPage === 'book' ? 
						selectedStyle : '',
					onclick: function() { 
						if (window.location.hash.indexOf('book') > -1) {
							hak.setParam('letter', false, true);
							window.onpopstate();
						} else {
						router.linkTo('home/book');
						changePage('book');
						}
					}
				}, 
				strong('A-Z')
			),

			div({
					class: 'tabButton', 
					style: selectedPage === 'search' ? 
						selectedStyle : '',
					onclick: function() { 
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
				}, 
				div({ class: 'searchIcon', style: 'padding-left: 2px;' },
					tohtml('&#9906;')
				)
			),

			div({
					class: 'tabButton', 
					style: selectedPage === 'star' ? 
						selectedStyle : '',
					onclick: function() {
						router.linkTo('home/star');
						changePage('star');
					}
				}, 
				div({ style: 'font-size: 24px;'},
					tohtml('&#9733;')
				)
			)

		)

	}

})








var Home = hak.Component({

	render: function() {
		var t = this,
			onscroll = (e) => {
				APP.scrollEventFunctions.forEach(val => {
					val(e.target);
				});
				hak.variables.scrollTop = e.target.scrollTop;
			};

		var home = div({ class: 'HomePage', id: 'HomePage' },
			Header(),
			this.renderRoutes()
			//,TabBar()
		);
		home.addEventListener('scroll', onscroll, {passive: true});
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





hak.addStyle((s) => {
	var w = s.width < 600,
		tabbar = hak.$('.TabBar');
	if (tabbar) { tabbar.id = w ? 'Tab_Bar_hiding' : ''; }

	return w  ?
	''
	: `
.TabBar {
	position: relative;
	width: auto;
	margin-right: 10px;
	-webkit-box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.30);
     -moz-box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.30);
					box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.29);
}
.tabButton {
	width: 68px;
	height: 47px;
	color: white;
	background: ${STYLES.mainColor};
	margin: -3px 0px -3px 0px;
	
}
`

})



hak.variables.css += `

.Swipe_ {
	margin-top: -12px;
}

.HomePage {
  left: 0;
  bottom: 0;
  right: 0;
	top: 0;
	position: absolute;
	overflow: scroll;
}`
;










