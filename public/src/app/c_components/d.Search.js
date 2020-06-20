


var SearchBar = function() {

	var _ = this,
		setQ = miscStore.getMethods().search.setQuery,
		query = miscStore.getData();

	hak.variables.scrollTop = document.documentElement.scrollTop;


	var searchBar = div({ 
				class: 'searchBar faintShadow'
				,id: 'searchBar'
			},

		input({
				id: 'searchBarInput',
				class: 'searchBarInput', 
				placeholder: 'Search',
				value: query.search.query,
				onsubmit: function(e) {
					console.log(e)
					e.blur()
				},
				onfocus: function() {
					hak.setParam('slide', '1');
					miscStore.getEntireStore().pageData.changePage('search')
				},
				oninput: function() {
					setQ(hak.$('#searchBarInput').value)
				}
		}),
		button({
				class: 'searchButton',
				onclick: function() { 
					var s = hak.$('#searchBarInput');
					if (s) {
						s.value = '';
						s.focus();
						s.value = miscStore.getData().search.query;
					}
				}
			},
			div({
					class: 'searchIcon',
					onclick: function() {

					}
				},
				tohtml( '&#9906;' )
			)
		)
	);

	var filler = div({class: 'searchFiller', id: 'searchFiller'});
		
	return [
		filler,
		searchBar
	];
}






var RecentSearchs = function() {
	return div({class: 'RecentSearchs'},
		'Results will appear here'
	)
	
}





var SearchResults = hak.Component({
	
	subscribe: [
		miscStore.subscribe('search'),
		miscStore.subscribe('language'),
		starStore.subscribe('editing'),
		dictionaryStore.subscribe()
	],


	render: function() {

		return div({ id: 'DicAnchorSearch', class: 'DicAnchorSearch' },
			this.getResults()
		)
	},


	getResults: function() {
		
		var sh = this.shelf,
			editing = sh.editing.editStatus,
			query = sh.search.query.toLowerCase().trim(),
			lang = !sh.language.isMien ? 'english' : 'mien',
			entries = sh[lang+'Entries'],
			length = (entries && entries.length) || 0,
			results = [[],[],[]];

		if (!sh.stocked && query) return div({ class: 'loader' });
		if (!query) return RecentSearchs();


		for (var i = 0; i < length; i++ ) {
			if (entries[i].word.toLowerCase().trim() === query) {
				results[0].push(
					WordCard(entries[i], { open: true, query: query, editing: editing })
				);
				continue;
			}

			var ws = entries[i].word.split(',');

			for (var i2 = 0; i2 < ws.length; i2++ ) {
				if (ws[i2].toLowerCase().trim() === query) {
					results[1].push(
						WordCard(entries[i], { open: true, query: query, editing: editing})
					);
					break;
				}

				var wsi = ws[i2].split(' ');
				for (var i3 = 0; i3 < wsi.length; i3++ ) {
					if (wsi[i3].toLowerCase().trim() === query) {
						results[2].push(
							WordCard(entries[i], { query: query, editing: editing })
						);
						break;
					}
				}
			}
		}

		return results;

	}

});









var Search = hak.Component({

	setQuery: function(q) {
		this.setState({ query: q });
	},
	
	render: function() {

		return div({ 
				class: 'SearchContainer'
			},
			SearchBar(),
			SearchResults()
		)
	}

	
});



APP.scrollEventFunctions.push(el => {
	if (!APP.playScrollFunctions) return;
	var scroll = el.scrollTop,
		f = hak.$('#searchFiller'),
		s = hak.$('#searchBar');

	if (hak.variables.scrollTop < scroll 
		&& scroll > 40 
		//&& !hak.variables.scrolledDown
	) {
		f && (f.style.transition = '0', f.style.opacity = '0');
		s && (s.style.top = '-20px', s.style.opacity = '0.5');
		hak.variables.scrolledDown = true;	
	}
	else {
		//if (hak.variables.scrolledDown) {
			f && (f.style.transition = '0.2s', f.style.opacity = '1');
			s && (s.style.top = '70px', s.style.opacity = '1');
			hak.variables.scrolledDown = false;
		//}
	}
})






hak.addStyle(function(s) {

	var w = s.width < 450 ? s.width - 32 : 358;

	return `


.RecentSearchs {
	width: ${w}px;
	text-align: center;
	padding-top: 30px;
	font-style: italic;
	color: #999;
	font-size: 20px;
}

.searchBar {
	transition: 0.25s;
	position: sticky;
	top: 70px;  
	border-radius: 120px;
	background-color: white;
	padding: none;
	overflow: hidden; 
	display: flex;
	justify-content: center;
	width: ${ w }px;
	align-self: center;
	z-index: 30;
}
	
.searchBarInput {
	width: ${ w - 80 }px;
  font-size: 26px;
  border: none; 
  padding: 6px 4px 6px 6px;
  outline: none;
	background-color: white;
}
	
`
},
`

.searchFiller {
	position: fixed; 
	width: 100%; 
	top: 0;
	height: 
	95px; 
	z-index: 2; 
	background-color: ${STYLES.backgroundColor};
}

.SearchContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  background-color: ${STYLES.backgroundColor};
}
	
.searchButton {
	background-color: white;
  font-size: 32px;
  border: none; 
  padding: 0px 8px 0px 8px;
  outline: none;
	transition: 0.3s;
}
.searchButton:hover {
	cursor: pointer;
	color: skyblue;
}


.DicAnchorSearch{
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  right: 0px;
  left: 0px;
  padding: 40px 10px 200px 10px;
  overflow: hidden;
}
`
);
