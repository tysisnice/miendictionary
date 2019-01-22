



var Book = hak.Component({

	subscribe: [
		miscStore.subscribe('book','language'),
		starStore.subscribe('editing'),
		//miscStore.subscribe(),
		dictionaryStore.subscribe()
	],

	Constructor: function() {
		this.state = {
			results: [],
			abc: ['A-Z', 'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
		}
	},

	
	render: function() {
		var _ = this,
			book = this.shelf.book;
		//console.log('rendering book', this.shelf.hakCustomers)

		return div(
			book.selectedLetter 
			? 

				div({ class: 'BookList'},
					div({ class: 'BookList_sidescroller lightShadow' },
						this.renderBookItems(1)
					),
					
					div( { id: 'DicAnchor', class: 'DicAnchor' },
						p({style: 'font-size: 40px; float: left; padding: 24px;'},
						book.selectedLetter.toUpperCase()
					),
						this.getResults(10)
					)
				)
		

			:

				div( { class: 'Book' },
					this.renderBookItems()
				)	

		)
	},

	

	renderBookItems: function(n) {
		var book = this.shelf.book,
			letter = book.selectedLetter,
			style  = n ? 'margin: -0px 7px -0px 5px;' : '',
			abc = !letter ? this.state.abc.slice(1) : this.state.abc,
			aToZ = this.state.abc[0];

		return abc.map(function(x) {
			return div({
					class: 'BookItem' +(!book.selectedLetter?' fainterShadow':''), 
					style: style,
					id: 'book'+x,
					ontouchmove: function(e) {
						book.selectedLetter && e.stopPropagation()
					},
					onclick: function() {
						document.documentElement.scrollTop = 0;
						var el = hak.$('.BookList_sidescroller'),
							scr = el && el.scrollLeft
						book.changeSelectedLetter(x !== aToZ ? x : '');
						var el = hak.$('.BookList_sidescroller');
						el && (el.scrollLeft = scr);
					}
				},
				p({ 
						style: (x === letter ? 
							'font-weight: bold; color: dodgerblue' : 'color: #111;') 
					}, x
				)
			);
		});
	},


	getResults: function(starter, timer) {

		var sh = this.shelf,
			editing = sh.editing.editStatus,
			a = sh.book.selectedLetter,
			lang = !sh.language.isMien ? 'english' : 'mien',
			entries = sh[lang+'Entries'] || [],
			results = [],
			starter = starter || 20;


		for (var i = 0; i < entries.length; i++ ) {
			var en = entries[i];
			if ((en.clarifyer || en.word) 
				&& (en.word && en.word[0].toLowerCase() === a)
			) {
				results.push(en);
			}
		}

		var addOns = results.splice(starter);


		setTimeout(function() {
			var	rot = hak.$('#DicAnchor');

			rot.scrollTop = 0;

			setTimeout(function() {
				var	nodes = addOns && addOns.map(function(val) {
					return WordCard(val, { query: '*', editing: editing });
				});
				for (var i = 0; i < addOns.length; i++) {
					rot && rot.appendChild(
						nodes[i]
					);
				}
			}, 2)
			
		}, 1)


		if (!results[0]) {
			return div({
					style: 'font-size: 20px; text-align: center; padding-top: 20px;'
				},
				'No results '+(a ? 'for '+a.toUpperCase() : 'yet')
			)
		}
		if (!sh.stocked) return div({class:'loader'});

		return results.map(function(val){
			return WordCard(val, { query: '*', editing: editing });
		});

	}

});




// Scroll event listener to hide the letter bar on scroll down


hak.variables.scrollTop = 0;

APP.scrollEventFunctions.push(
	function(el) {	
		if (!APP.playScrollFunctions) return;
		var scroll = el.scrollTop,
			bookBar = hak.$('.BookList_sidescroller');

		if (bookBar) {
			if (hak.variables.scrollTop < scroll && scroll > 35 ) {
				bookBar.style.top = '-50px';
				bookBar.style.opacity = '0';
				hak.variables.scrolledDown = true;	

			}
			else {
				bookBar.style.top = '0px';
				bookBar.style.opacity = '1';
				hak.variables.scrolledDown = false;
			}
		}

	}
);






hak.variables.css+= `


.lightVertShadow {
  -webkit-box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.3);
     -moz-box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.3);
          box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.3);
} 

.DicAnchor{
  justify-content: center;
  align-items: center;
  display: flex;
	flex-direction: column;
  right: 0px;
	left: 0px;
	top: 0px;
	bottom: 0px;
	padding: 17px 10px 200px 10px;
}

.Book {
	padding: 20px 5px 100px 5px;
	left: 0;
	right: 0;
	z-index: -1;
	justify-content: center;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
  align-items: center;
}

.BookItem {
	padding: 12px 14px 12px 12px;
	border-radius: 10px;
  line-height: 40px;
	text-align: center;
  margin: 6px;
  height: 40px;
  font-size: 32px;
  width: 50px;
	background-color: white;
}

.BookItem:hover {
  cursor: pointer;
  color: skyblue;
}

.BookList_sidescroller {
	transition: 0.25s;
	position: -webkit-sticky;
	position: sticky;
  background-color: white;
  top: 0px;
  margin-top: -48px;
  padding: 48px 20px 0px 10px;
  overflow-x: scroll;
  white-space: nowrap;
  display: flex;
  z-index: 9;
}

`;

