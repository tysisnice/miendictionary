



// Data store for most essential yet lightweight parts of our app. 
// Includes simple app and user settings. 
// Should never subscribe a component to the entire store, or call a global-
// stockStore, as many unnecesary renders may occur and affect performance

var miscInitData = {

	pageData: {
		selectedPage: '',

		changePage: function(a) {
			this.stockShelf({ selectedPage: a });
		}
	},

	book: {
		selectedLetter: '',

		changeSelectedLetter: function(x) {
			this.stockShelf({ selectedLetter: x });
			hak.setParam('letter', x, true);
		}
	},


	language: {
		isMien: true,

		changeLanguage: function() {
			this.stockShelf({ isMien: !this.isMien });
			hak.setParam('lang', !this.isMien ? '' : 'mien', true)
		},
	},

	
	featureCard: {
		id: '',
		
		changeFeatureCard: function(x) {
			this.stockShelf({ id: x });
		}
	},

	
	search: {
		query: '',

		setQuery: function(x) {
			this.stockShelf({ query: x });
		},
	},

	test: {
		test2: {
			test3: {
				x: 'hello'
			}
		}
	}

}


// get previous user data if it exists
var miscStore = hak.Store(miscInitData, 'MienMiscStore_v' + APP_VERSION);




// attach persistent data from the url parameters to the store, so that-
// components update when the url changes.

miscStore.setParams({
	language: {
		isMien: 'lang'
	},
	book: {
		selectedLetter: 'letter'
	}
})


var startingPage = window.location.hash.indexOf('search') > -1 
	? 'search'
	: window.location.hash.indexOf('book') > -1
	? 'book'
	: window.location.hash.indexOf('star') > -1
	? 'star'
	: ''

miscStore.stockStore( { pageData: { selectedPage: startingPage } } );



