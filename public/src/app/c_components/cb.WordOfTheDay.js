



var WordOfTheDay = hak.Component({

	subscribe: [
		miscStore.subscribe('language'),
		dictionaryStore.subscribe()
	],


	Constructor: function() {

	},



	render: function() {
		var sh 			= this.shelf,
			date 			= new Date(),
			month 		= date.getMonth() * 170,
			year 			= date.getFullYear() - 1950,
			day 			= date.getDate(),
			wordNum 	= month + day + year,
			lang 			= sh.language.isMien ? 'mien' : 'english',
			word 			= sh[lang+'Entries'][wordNum];

		return div({ class: 'StarPage'},
			p({ class: 'WordOfTheDay_text' }, 'Word of the Day'),
			
			word 
			? WordCard( word, { query: '*', open: true, editing: this.props.editing})
			: div({class: 'WordCard'})
		)
	}

});



hak.addStyle(function(s) {
	var w = s.width < 450 ? s.width - 40 : 360;
	return `
.WordOfTheDay_text {
	font-size: 26px; 
	font-weight: bold;
	color: #555; 
	padding: 30px 0px 10px 30px;
	width: ${w}px;
}`
}) 

hak.variables.css += `
.WordOfTheDay_text_small {
	display: flex;
	font-size: 22px; 
	font-weight: bold;
	color: #555; 
	padding-left: 15px;
	padding-top: 25px;
}
`;

