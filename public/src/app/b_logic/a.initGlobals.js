

// Initialize hak-jsx global functions

for (var prop in hak.tags) {
	if (hak.tags.hasOwnProperty(prop)) {
		window[prop] = hak.tags[prop];
	}
}

// Initialize most global variables and essential app components, including-
// the hash-router, css string variable (that will be added to head later)-
// and essential data stores with default data.  


hak.variables.css = '';

hak.variables.scrollTop = 0;
hak.variables.scrolledDown = false;

const APP_VERSION = 7;

const STYLES = {
	menuBarColor: 		'dodgerblue'
	,mainColor: 			'dodgerblue'
	,secondaryColor: 	'deepskyblue'
	,thirdColor:  		'skyblue'
	,boldColor: 			'dodgerblue'
	,hoverColor: 			'lightskyblue'
	,backgroundColor: '#fbfbfb'
	,cardColor: 			'white'
	,faveColor: 			'#edc500'	
	,underStatedColor:'#e9e9e9'
};




const APP = {
	routes: {},
	scrollEventFunctions: [],
	playScrollFunctions: true
};




