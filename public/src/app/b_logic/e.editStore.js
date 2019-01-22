


// data for the star page, including the word of the day, news, and user-
// saved words

var starInitData = {

	favorites: {

		list: [],

		idList: [],

		addToFavorites: function(item, deleteItem) {
			if (deleteItem) {
				this.idList = this.idList.filter(function(val) {
					return item._id !== val;
				})
			} else {
				this.idList.push(item._id);
			}
			this.stockShelf({
				idList: this.idList
			})
		},

		getFavorites: function() {
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
		changePage: function(entry, index) {
			this.stockShelf({ showSettings: index });
		}
	},

	editing: {
		editStatus: false,
		topEditor: false,

		wordsEdited: {},
		wordsAdded: {},

		changeEditStatus: function() {
			this.stockShelf({ editStatus: !this.editStatus });
		}
	}
	

};

var starStore = hak.Store(starInitData, 'MienStarStore_v' + APP_VERSION);








