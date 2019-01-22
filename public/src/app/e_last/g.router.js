

var router = hak.Router('home/book');


router.addRoutes(
	['home', Home],
	['star', StarPage],
	['book', Book],
	['welcome', Welcome],
	['search', Search]
);



router.addMiddleware(function(oldRoutes, newRoutes) {
	var home = hak.$('#HomePage') || hak.El('div')(),
		scroll = home.scrollTop || 0,
		oldRoute = oldRoutes[oldRoutes.indexOf('home') + 1],
		newRoute = newRoutes[newRoutes.indexOf('home') + 1];
	!APP.routes[oldRoute] && (APP.routes[oldRoute] = {});
	!APP.routes[newRoute] && (APP.routes[newRoute] = {});

	APP.playScrollFunctions = false;
	APP.routes[oldRoute].scroll = scroll;
	setTimeout(() => {
		home && (home.scrollTop = APP.routes[newRoute].scroll || 0);
	},1);
	setTimeout(() => {
		var newRoute  = newRoutes[newRoutes.indexOf('home')+1];
		home && (home.scrollTop = APP.routes[newRoute].scroll || 0);
	},80);
	setTimeout(() => {APP.playScrollFunctions = true;}, 300)
});



