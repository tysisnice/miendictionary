

var Welcome = hak.Component({


	render: function() {
		return div({class: 'Welcome-container'},

			div({ class: 'WordCard faintShadow Welcome'},
				h4('Welcome to the'),
				h2('Iu Mien Dictionary!'),
				p({style: 'font-style: italic; font-size: 14px; padding-top: 5px;'},
					'An app to help utilize Vicky\'s Mien dictionary spreadsheet more effectively'
				),
				
				br(),
				p(strong('Add this site to the home screen'),
					' to use offline.'),
				br(),
				p('Navigate around with the tab buttons below, and change the search language by hitting the button in the top right corner.'
				),
				p('Have fun!')

			)

		)
	}
})






hak.variables.css += 
`
.Welcome-container {
	position: fixed;
	display: flex; 
	justify-content: center; 
	align-items: center; 
	right: 0px;
	top: 60px;
	left: 0px; 
	bottom: 60px; 
}

.Welcome {
	padding: 40px;
	width: auto;
	height: auto;
}


`;


