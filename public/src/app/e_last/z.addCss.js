


hak.addStyle((s) => {
  var w = s.width < 500 ? 0 : (s.width - 500) / 2;

  return `
.horizontal-filler-desktop {
  width: ${w}px;
  flex: 0.01;
  display: ${w ? 'block' : 'none'};
  position: ${w ? 'relative' : 'fixed'};
}
`;
});





hak.addStyle(
	hak.variables.css + `

* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

body {
  background: ${STYLES.backgroundColor};
}

.Header {
  font-weight: bold;
}

.flex-column {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: center;
  align-items: center; 
}

.flex-row {
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}

.swipe {
  overflow: hidden;
  visibility: hidden;
  position: relative;
}
.swipe-wrap {
  overflow: hidden;
  position: relative;
}
.swipe-wrap > div {
  float: left;
  width: 100%;
  height: 100vh;
  overflow-x: scroll;
  position: relative;
}

.noSelect {
  -webkit-tap-highlight-color: transparent;
}

.mediumShadow {
  -webkit-box-shadow: 0px 3px 9px 1px rgba(0,0,0,0.25);
     -moz-box-shadow: 0px 3px 9px 1px rgba(0,0,0,0.25);
          box-shadow: 0px 3px 9px 1px rgba(0,0,0,0.25);
}

.heavyShadow {
  -webkit-box-shadow: 0px 0px 18px -1px rgba(0,0,0,0.8);
  -moz-box-shadow: 0px 0px 18px -1px rgba(0,0,0,0.8);
  box-shadow: 0px 0px 18px -1px rgba(0,0,0,0.8);
}

.bottomBorder {
  border-bottom: 2px solid black;
}

.flat {
  -webkit-box-shadow: 0px 0px 0px 0px white;
     -moz-box-shadow: 0px 0px 0px 0px white;
          box-shadow: 0px 0px 0px 0px white;
}

.boldFont {font-weight: bold;}
`
);


hak.mount(router.render(), '#root', true);




