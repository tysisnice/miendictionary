


var EditWordCard = hak.Component({

	Constructor() {
		this.word = this.props.word;
		this.resetState();
	},


	componentDidRender: function() {
		this.props.callBack && this.props.callBack(this.node.offsetHeight)
	},


	resetState: function() {
		var word = this.word;
		this.fresh = true;
		this.state = {
			word: word || {
				_id: false,
				lastEdited: 'New Word'
			}
			,wordPlace: word ? word.word : 'Type your word here'
			,clarifyerPlace: word 
				? word.clarifyer 
				: 'Type up a description and/or example sentences of your word'
			,otherWordPlace: 'Definition'
			,otherClarifyer: 'A short description and/or example of this definition'
			,otherWords: word ? word.otherWords.slice(0) : []
			,savingEdit: false
		}
		this.data = {
			word: word ? word.word.substring(0) : '',
			clarifyer: word ? word.clarifyer.substring(0) : '',
			otherWords: word ? word.otherWords.map(function(val, i) {
				return { 
					word: val.word ? val.word.substring(0) : '', 
					clarifyer: val.clarifyer ? val.clarifyer.substring(0) : ''
				};
			}) : []
		}
	},	



	getStyles: function() {
		return {
			deleteButton:`color: white;
				background: tomato; 
				height: 30px; 
				width: 70px; 
				float: right;
				marigin: 13px 3px 5px 0px; 
				font-size: 18px;
				line-height: 28px; 
				font-weight: normal;`,
			addDefButton: `background: ${STYLES.mainColor};
				color: white; 
				width: auto; 
				font-size: 22px;
				height: 44px;
				line-height: 44px;
				margin: 15px 24px 20px 24px;`,
			buttonRow: `display: flex;
				width: auto;
				margin: 20px 5px 5px 5px;
				justify-content: space-around; `,
			divider: `width: auto; 
				height: 5px;
				background: ${STYLES.backgroundColor};
				margin: 30px -26px 20px -26px;`,
			confirmButton: `width: 160px;
				color: white;
				background: ${STYLES.mainColor};`,
			clarifyerTextarea: `margin-bottom: 0px;`,
			otherWordsContainer: `margin-bottom: 60px;`
		}
	},


	render: function() {
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
			oninput: function(e) { 
				_t.editWord(e, 'word') 
			}
		});

		var clarifyerTextarea = textarea({
			data: data.clarifyer, 
			rows: 3, style: 'font-size: 16px;',
			class: 'wordClarifyer WordCard_textarea',
			placeholder: st.clarifyerPlace,
			oninput: function(e) { 
				_t.editWord(e, 'clarifyer') 
			}
		});

		wordTextarea.value = this.data.word;
		clarifyerTextarea.value = this.data.clarifyer;

		return [
			wordTextarea, 
			clarifyerTextarea, 

			div({style: this.style.divider}),

			this.data.otherWords.map(
				this.renderMapOtherWords	
			),

			SmallButton({
				text: 'Add Definition',
				style: this.style.addDefButton,
				onclick: this.addDefinition
			}),

			div({ style: this.style.divider }),

			this.renderSavingEditButtons()

		]//div
	},



	renderSavingEditButtons: function() {
		var st = this.state,
			setState = this.setState;


		return div({ style: this.style.buttonRow },
			st.savingEdit 
			? [
				SmallButton({
					hakAnimate: true,
					text: 'Back',
					onclick: function() {
						setState({savingEdit: false});
					},
					style: 'width: 80px;'
				}),
				SmallButton({
					hakAnimate: true,
					text: 'Confirm Save',
					onclick: this.saveEdit,
					style: this.style.confirmButton
				})
			]
			: [
				SmallButton({
					hakAnimate: true,
					text: 'Cancel',
					style: 'width: 110px;',
					onclick: this.cancelEdit 
				}),
				SmallButton({
					hakAnimate: true,
					text: 'Save',
					style: `width: 110px; background: ${STYLES.mainColor}; color: white;`,
					onclick: function() {
						setState({savingEdit: true});
					}
				})
			]
		)
	},



	renderMapOtherWords: function(val, index) {
		var _t = this,
			st = this.state,
			index = index,
			stateEntry = st.otherWords[index];

		var wordTextarea = textarea({
			rows: val.word.length > 20 ? 2 : 1,
			class: 'otherWordTitle WordCard_textarea boldFont',
			style: 'font-size: 18px;',
			placeholder: stateEntry ?  stateEntry.word : st.otherWordPlace,
			oninput: function(e) { 
				_t.editWord(e, index, 'word') 
			}
		});

		var clarifyerTextarea = textarea({
			rows: 3,
			class: 'wordClarifyer WordCard_textarea',
			style: this.style.clarifyerTextarea,
			placeholder: stateEntry ?  stateEntry.clarifyer : st.otherClarifyer,
			oninput: function(e) { 
				_t.editWord(e, index, 'clarifyer') 
			}
		});

		wordTextarea.value = val.word || '';
		clarifyerTextarea.value = val.clarifyer || ''; 

		return div({
				k: Math.random(),
				class: 'WordCard_otherWord', 
				style: this.style.otherWordsContainer
			},
			wordTextarea,
			clarifyerTextarea,
			SmallButton({
				text: 'delete',
				style: _t.style.deleteButton,
				onclick: function() {
					_t.deleteDefinition(index)
				}
			})
		); //div
	},


	addDefinition: function() {
		this.data.otherWords.push({ word: '', clarifyer: '' });
		this.fresh = false;
		this.setState({ k: Math.random() });	
	},


	deleteDefinition: function(i) {
		console.log(this.data.otherWords.splice(i, 1));
		console.log(this.data.otherWords)
		this.fresh = false;
		this.setState({ k : Math.random() });
	},


	editWord: function(e, index, key) {
		this.fresh = false;
		if (typeof index === 'string') {
			this.data[index] = e.target.value;
			return true;
		}
		this.data.otherWords[index][key] = e.target.value;
	},



	saveEdit: function() {
		var isMien = !!miscStore.getShelf('language').isMien,
			newWord = hak.clone(this.data);

		newWord._id = this.state.word._id 
			|| (isMien ? 'mien-' : 'english-') + new Date().getTime();

		dictionaryStore.getEntireStore().editEntry(
			newWord, 
			isMien
		);

		this.cancelEdit()
	},


	cancelEdit: function() {
		var equal = 
			((this.state.word.word === this.data.word)
			&& (this.state.word.clarifyer === this.data.clarifyer));

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










hak.addStyle(function(s) {
	var w = s.width < 450 ? s.width - 110 : 282;
	return `
.WordCard_textarea {
	padding: 10px;
	width: ${w}px;
	border: 1px solid #fbfbfb;
	margin: -3px 0px -3px 0px;
}

.WordCard_otherWord {
	margin-top: 30px;
	margin-bottom: 30px;
	font-weight: bold;
	border-sizing: box-border;
	transition: 0.3s;
}

	`;
})


