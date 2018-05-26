// script.js

function check() {
	switch(window.location.pathname.split('.')[0]) {
		case '/about': document.getElementsByClassName('nav')[2].style.backgroundColor = '#444444'; break;
		case '/code': document.getElementsByClassName('nav')[1].style.backgroundColor = '#444444'; break;
		case '/index':
		default: document.getElementsByClassName('nav')[0].style.backgroundColor = '#444444'; break;
	}
}

function startTime(sep) {
	var today = new Date(), delay = 500;
	var h = today.getHours(), m = today.getMinutes();
	if(h < 10) { h = '0'+h; }
	if(m < 10) { m = '0'+m; }
	if(!(document.body.clientWidth <= 690)) {
		var sep = ":", s = today.getSeconds();
		if(s < 10) { s = '0'+s; }
		s = ":"+s;
	} else { var s = ''; delay = 1000; if(sep === ":") { sep = " "; } else { sep = ":"; }}
	document.getElementById('time').innerHTML = h+sep+m+s;
	t = setTimeout(function() { startTime(sep); }, delay);
}

// END