



var WordCard = hak.Component({

	
	Constructor: function() {

		this.state = {
			open: this.props.open,
			editing: false,
			favorite: this.props.favorite || false,
			x: true,
			cancel: false
		}
		this.cardHeight = '1000px';
	},


	render: function() {

		var _t		=	this,
			pr 			= this.props,
			st 			= this.state,
			open 		= st.open,
			q 			= pr.query === '*',
			//isFave = (pr.favorites.words.indexOf(p.id||'') > -1),
			word = q ? ('<strong style="color: #000;">'+pr.word+'</strong>') :
				pr.word.replace(
					pr.query, 
					'<strong style="color: #000;">'+pr.query+'</strong>'
				),
			clarifyerShortened = pr.clarifyer.split('\n')[0].substring(0, 30) 
				//+ (pr.clarifyer.split('\n')[0].length >= 30) ? '...' : '' 
			,flatCardStyle = `cursor: pointer; 
			  margin: 7px 5px 0px 5px; 
			  min-width: 30px; 
			  padding: 15px 23px 2px 23px;  
			  -webkit-box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);
        -moz-box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);
          box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);`,
      className = open 
       	? 'WordCard noSelect fainterShadow' 
       	: 'WordCard noSelect fainterShadow WordCard_closed';

    clarifyerShortened += (pr.clarifyer.split('\n')[0].length >= 30) ? '...' : ''; 

    if (this.state.editing) { 
    	return this.renderEditCard();
    }

		return div({ 
				k: Math.random(),
				hakAnimate: true,
				id: this.id+'w',
				class: className, 
				style: 		(!open ? flatCardStyle : ''),
				onclick: 	!open ? this.openCard : '' 
			},
			div({ class: 'WordCard_header--section'},
				div(
					p({class: 'wordTitle'}, tohtml(word)),
					(
						pr.clarifyer 
						? 
						p({class: 'wordClarifyer', style: 'font-size: 15px;'}, 
							open ? pr.clarifyer : clarifyerShortened
						)
						: 
						div({style: 'display: none;'})
					)
				),//div
				this.renderOpenOrFave()
			),//div

			open && this.renderOtherWords()
		)
	},



	renderEditCard: function() {
  	var _t = this,
  		d = div({
  			class: 'WordCard noSelect faintShadow', 
  			style: 'margin: 20px;',
  			hakAnimate: true
  		});

  	function callBack(height) {
  		d.style.height = (height + 50)+'px';
  	}

  	var edit =  EditWordCard({ 
  		word: this.props, 
  		callBack: callBack,
  		cancelFunction: function() {
  			_t.setState({ editing: false })
  		}
  	});
  	d.appendChild(edit);
  	return d;
	},



	renderOpenOrFave: function() {
		if (this.state.open) {
			var _t = this,
				fave = starStore.getShelf('favorites'),
				isFave = fave.idList.indexOf(_t.props._id) > -1;
			
			var style = 'font-size: 24px; padding-top: 15px;'
				+(isFave ? 'color: '+STYLES.faveColor+';' : 'color: #888;');

			function addToFaves(e) {
				fave.addToFavorites(_t.props, isFave);
				isFave = !isFave;
				_t.setState({ x: !_t.state.x });
			}

			return div({ 
					onclick: addToFaves, 
					style: 'padding: 15px; margin: -15px;' 
				},
				div({
						class: 'WordCard_button'
						,style: style
					},
					tohtml('&#9733;')
				) //div
			);//div

		} else {
			return div({ 
					class: 'WordCard_button'
				}, 
				'+'
			)
		}
	},



	renderOtherWords: function() {
		var _t = this,
			cancel = _t.state.cancel,
			deleteEditStyle = 'float: right; margin-right: 5px;'
				+' color: white; background: tomato;'
				+ (cancel ? 'width: 145px;' : 'width: 120px;' )

		return div({ class: 'WordCard_body'},

			_t.props.otherWords.map(function(val, i) {
				return [
					div({class: 'WordCard_divider'}),

					div({ class: 'WordCard_header--section WordCard_other' },
						div(
							p({class: 'otherWordTitle'}, 
								' '+val.word
							),
							val.clarifyer 
							? 
							p({class: 'wordClarifyer', style: 'font-size: 14px;'}, 
								val.clarifyer
							)
							: null
						)
					)
				]
			}),

			this.props.editing 
			? [
				div({ class: 'WordCard_divider', style: 'margin-bottom: 18px;' }),	
				SmallButton({
					hakAnimate: Math.random(),
					text: cancel ? 'No' : 'Edit',
					onclick:  cancel 
					? function() { _t.setState({cancel: false});}
					: function() {
						_t.setState({ editing: true })
					},
					style: 'float: right; color: white; background:'+STYLES.mainColor+';'
				}),
				(this.props.cancelEdit 
				? SmallButton({
					hakAnimate: Math.random(),
					text: cancel ? 'Are you sure?' : 'Delete Edit',
					onclick: cancel
					? this.props.cancelEdit
					: function(){_t.setState({ cancel: !_t.state.cancel})},
					style: deleteEditStyle
				}) 
				: null)
			]
			: null

			//, this.renderButtons()
		);
	},


	renderButtons: function() {
		return div({ class: 'WordCard_Buttons' },
			div(),
			tohtml('&#9733;')
		)
	},


	openCard: function() {
		this.setState({ open: !this.state.open });
	},

	playSound: function() {
		var s = '../sound/words/'+this.state.id+'.mp3';
		var aud = new Audio(s);
		aud && aud.play();
	}


});



hak.addStyle(
function(s) {
	var w = s.width < 450 ? s.width - 40 : 350;
	return `

.WordCard {
	box-sizing: border-box;
	outline: none !important;
	overflow: hidden;
  border-radius: 12px;
  padding: 25px 25px 17px 25px;
  margin: 11px 5px 5px 5px;
	background: white;
	transition: 0.24s;
  width: ${w}px;
  max-width: ${w}px;
  min-width: ${w}px;
}

.WordCard_closed {
	width: ${(w - 30)}px;
	max-width: ${(w - 30)}px;
}
`;
},

`

.WordCard_Buttons {
	display: flex;
	justify-content: space-between;
	padding-top: 4px;
	font-size: 22px;
	width: 100%;
	color: #888;
}
.WordCard_button {
  font-size: 36px;
  text-align: center;
  padding-top: 10px;
  margin: -17px 19px -10px 10px;
  width: 0px;
  height: 10px;
  cursor: pointer;
}

.WordCard_divider {
	width: auto; 
	height: 1px;
	background: ${STYLES.backgroundColor};
	margin: 14px -26px 7px -26px;
}

.WordCard_header--section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.WordCard_other {
	padding: 5px 5px 0px 5px;
}


.wordTitle {
	color: #111;
  font-size: 24px;
  font-weight: bold;
  line-height: 32px;
  padding-bottom: 2px;
  font-family: "Arial Black", Gadget, sans-serif;
}
	
.wordClarifyer {
	color: #555;
	font-size: 12px;
  font-style: italic;
  left: 0; right: 0;
  margin-right: 0px;
  padding: 4px 5px 5px 5px;

}
	
.otherWordTitle {
	color: #222;
  padding: 5px 0px 0px 0px;
  font-size: 23px;
	line-height: 30px;
}`);
