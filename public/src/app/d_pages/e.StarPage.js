













var StarPage = hak.Component({

	subscribe: [
		starStore.subscribe()
	],


	render: function() {

		var StarPage = div({ class: 'StarPage', style: 'padding-bottom: 150px;' },
			this.renderSettingsButtons(),
			!this.shelf.settings.showSettings ? 
			[
				WordOfTheDay({editing: this.shelf.editing.editStatus}),
				this.renderFavorites(),
				//Options(),
				this.renderShare()
			]
			:
			[
				Options(),
				EditPage()
			]
		);

		return StarPage;
	},


	renderSettingsButtons: function() {
		var set = this.shelf.settings,
			style = `
				border-radius: 10px;
				box-sizing: border-box;
				height: 46px; 
				width: 48px;
				padding: 8px;`;



		return div({ class: 'renderSettingsButtons_container' },
			PageSelectorButtons({
				entries: [
					['Favorites ',
						div({style: `margin-left: 10px; font-size: 22px;`}, 
							tohtml('&#9733;')
						)], 
					div({style: 'display: flex; padding-top: 2px;'},
						'Settings ', 
						img({
							src: 'images/gear.png', 
							width: '28px', 
							height: '28px', 
							style: 'margin: -3px 0px 0px 10px ;'
						}))
				],
				selected: set.showSettings || 0,
				onclick: (e, i) => set.changePage(e, i) 
			})
		);
	},


	renderFavorites: function() {
		var list = this.shelf.favorites.idList,
			editing = this.shelf.editing.editStatus;

		var kids = [
			p({ class: 'WordOfTheDay_text' }, 
				'My Saved Words'
			),
		]
			
		var newKids = kids.concat(list[0]
			?
			this.shelf.favorites.getFavorites().map(function(val) {
				return WordCard(val, { open: 'true', editing: editing })
			}).reverse() 
			: 
			[div({class: 'RecentSearchs'},
				'Your saved words will appear here, simply hit the star to save a word' 
			)]
		);
		return newKids;
	},


	renderShare: function() {
		return tohtml('')
	}

});











hak.addStyle(function(s) {
var w = s.width < 450 ? s.width - 36 : 360;

return `


.StarPage {
	padding: 40px 0px 10px 0px; 
	display: flex; 
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.shareContainer {
	display: flex;
	justify-content: space-around;	
}

.shareChild span {
	padding: 10px 30px 10px 30px;
	width: 40px;
	height: 40px;
}

.FavoritesList {
	padding: 60px 0px 200px 0px; 
	justify-content: center;
	display: flex;
	align-items: center;
}

.renderSettingsButtons_container {
	display: flex;
	justify-content: space-between;
	margin: -16px 0px -18px 0px;
}
`

})






