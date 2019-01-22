




var EditPage = hak.Component({
	subscribe: [
		starStore.subscribe('editing')
		,miscStore.subscribe('language')
		,dictionaryStore.subscribe('editedEntries')
	],

	render() {
		if (!this.shelf.editing.editStatus) {
			return div();
		}

		var d = div({class: 'WordCard noSelect faintShadow ', hakAnimate: true});
		function callBack(h) {
			d.style.height = (h+50)+'px';
		}
		d.appendChild(EditWordCard({callBack: callBack}));

		var sh = this.shelf,
			lang = this.shelf.language.isMien ? 'Mien' : 'English';

		return div({ class: 'flex-column', style: 'margin-top: 40px;' },
			p('Editing', {class: 'WordOfTheDay_text'}),
			p(
				'Add a new '+lang+' word', 
				{ class: 'WordOfTheDay_text_small' }
			),
			d,
			div({style: 'height: 30px;'}),
			p(
				'My edited words', 
				{ class: 'WordOfTheDay_text_small' }
			),
			this.renderMyEditedWords(),
			div({ style: 'height: 140px;' })
		)
	},



	renderMyEditedWords: function() {
		var style = 'display: flex;'
		+' flex-direction: column;'
		+' justify-content: center;'
		+' align-items: center;',
		editedEntries = this.shelf.editedEntries;

		return div({ style: style },
			editedEntries.list.map(function(val) {
				var props = {
					editing: true,
					cancelEdit: function() {
						editedEntries.cancel(val);
					}
				};
				return WordCard( val,	props )
			}).reverse()
		)
	}

});




