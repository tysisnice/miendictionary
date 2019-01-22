



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


	sortAlphabetically: function(a, b) {
		var a = a.word.toLowerCase(), b = b.word.toLowerCase();
		if (a < b) { return -1; }
		if (a > b) { return 1; }
		return 0;
	},

	editEntry: function(word, isMien) {
		var lang = isMien ? 'mien' : 'english',
			word = word,
			oldWord,
			addNew = true,
			entryList = this[lang+'Entries'].map(function(val) {
				if (val._id === word._id) {
					oldWord = hak.clone(val),
					addNew = false;
					return word;
				}
				return val;
			});

		if (addNew) {
			entryList.push(word);
		}
		
		entryList.sort(this.sortAlphabetically);

		var _t = this;
		setTimeout(function() {
			if (!oldWord) {
				oldWord = hak.clone(word);
				oldWord.isNewWord = true;
			} 
			_t.editedEntries.add(word, oldWord);
		},30);

		var toStock = {	stocked: true };
		toStock[lang+'Entries'] = entryList;

		this.stockStore(toStock);
	},


	editedEntries: { 
		oldEntries: [],
		list: [],

		add: function(word, oldWord) {
			var oldW = oldWord,
				pushOldEntries = true,
				newList = this.list.filter(function(val, index) {
					return val._id !== word._id;
				});
			var newOldList = this.oldEntries.map(function(val) {
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


		cancel: function(word) {console.log(word)
			function entriesMap(val) {
				if (oldWord._id === val._id) {
					return oldWord;
				}
				return val;
			}

			function entriesFilter(word) {
				return word._id !== oldWord._id;
			}

			var store = dictionaryStore.getEntireStore()
				,word = word
				,newList = this.list.filter(function(val) {
					return val._id !== word._id;
				})
				,oldWord = this.oldEntries.filter(function(val) {
					
					return val._id === word._id;
				})[0] || { _id : Math.random() }
				,mienEntries
				,englishEntries;

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
				mienEntries: mienEntries
				,englishEntries: englishEntries
				,editedEntries: {
					list: newList
				}
			};
			this.stockStore(toStock);
		}

	}

}, 'MienDictionaryStore_v' + APP_VERSION)













