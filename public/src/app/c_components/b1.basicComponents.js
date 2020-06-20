
var SmallButton = function(props) {
	var defaultStyle = ``;

	var onStyle = props.onStyle || ''
		,offStyle = props.offStyle || ''
		,toggle = props.toggle || false
		,on = props.isOn || false
		,style = props.style || ''
		,clas = 'SmallButton ' + props.class || ''
		,offClass = 'faintShadow ' + clas
		,onClass = 'fainterShadow ' + clas;

	function click() {
		if (toggle) {
			on = !on;
			el.style = style + (on ? onStyle : offStyle);
			el.className = on ? onClass : offClass; 
		}
		props.onclick && typeof props.onclick === 'function' && props.onclick();
	}

	var el = div({
			class: on ? onClass : offClass,
			style: style + (on ? onStyle : offStyle),
			onclick: click
		},
		props.text || ''
	);

	if (props.hakAnimate) {
		el.setAttribute('hakAnimate', props.hakAnimate)
	}

	return el;
};


hak.addStyle(`
.SmallButton {
	color: #555;
  background: white;
  user-select: none;
  height: 40px;
  width: 60px;
  border-radius: 4px;
  text-align: center;
  align-items: center;
  line-height: 40px;
  transition: 0.25s;
}

.SmallButton:hover {
	cursor: pointer;
}
`);





var OverlayContainer = hak.Component({

	render: function() {
		var view = this.props.view;


		return div({style: 'OverlayContainer'},
			div({ 
				class: 'OverlayContainer_shadow' ,
				onclick: this.triggerOverlay
			}),
			div({class:'OverlayContainer_child'},
				this.children
			)
		)
	}
});





hak.addStyle(`

.OverlayContainer {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: 0.3s;
}

.OverlayContainer_shadow {
	transition: 0.25s;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 101;
	background: black;
	opacity: 0.5;
}

.OverlayContainer_child {
	z-index: 102;
	display: flex;
}	

.OC_inView {
	
}

`)










var PageSelectorButtons = function(props) {
	var selectedStyles = `color: white; background: ${STYLES.secondaryColor};`;

	return div({class: 'PageSelectorButtons fainterShadow flex-row'},
		props.entries.map((entry, index) => {
			var style = (props.selected === entry || props.selected === index) 
				? selectedStyles : '';
			return div({
					class: 'PageSelectorButtons_button flex-row',
					style: style
					,onclick: () => props.onclick(entry, index)
				},
				entry
			)
		})
	)
}


hak.addStyle(s => {
	var w = s.width < 450 ? s.width - 78 : 308;
	return `
	.PageSelectorButtons {
		border-radius: 70px; 
		width: ${w}px;
		height: 48px;
		overflow: hidden;
	}

	.PageSelectorButtons_button {
		background: white;
		font-size: 20px;
		color: #444;
		width: ${w/2}px;
		align-items: center;
		height: 48px;	
		padding-top: 2px;
	}
`});
