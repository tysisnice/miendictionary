

var Options = hak.Component({
	subscribe: [
		starStore.subscribe('editing')
	],

	render: function() {
		return div({
				class: 'flex-column',
				style: 'padding-top: 40px;'
			},
			p({class: 'WordOfTheDay_text'}, 'Settings'),
			this.renderOptions()
		)
	},

	renderOptions: function() {
		var editStatus = this.shelf.editing.editStatus,
		flatStyle = `-webkit-box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);
        -moz-box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);
          box-shadow: 0px 4px 15px -1px rgba(0,0,0,0.07);`;

		return [
			div({class: 'Options_switch WordCard faintShadow' },
				'Editing Mode',
				SmallButton({ 
					text: editStatus ? 'on' : 'off',
					style: editStatus 
						? 'background: '+STYLES.boldColor +'; color: white;'
						: 'background: #fff;' + flatStyle,
					onclick: this.shelf.editing.changeEditStatus
				})
			)
		]
	}
});







hak.variables.css += `

.Options_switch {
	display: flex;
	justify-content: space-between;
	padding: 15px 15px 15px 20px;
	font-size: 24px;
	color: #222;
	line-height: 40px;
}

`;