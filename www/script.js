// script.js

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

function editor() {
	var pre = new Array(
		document.getElementsByTagName('pre')[0],
		document.getElementsByTagName('pre')[1]
	), syntax = new Array( 'var', 'if', 'else', 'switch', 'case', 'default', 'break', 'while', 'forEach', 'for', 'function', 'try', 'catch', '\'' ), s;
	
	for(var i = 0; i < 2; i++) {
		for(var j = 0; j < pre[i].getElementsByTagName('li').length; j++) {
			s = j;
			if(j < 10) { s = ' '+j; }
			pre[i].getElementsByTagName('li')[j].innerHTML = s+' | '+pre[i].getElementsByTagName('li')[j].innerHTML
			if(j%2) { pre[i].getElementsByTagName('li')[j].style.backgroundColor = '#EEEEEE'; }
			if(!i) {
				for(var k = 0; k < syntax.length; k++) {
					var sep = pre[i].getElementsByTagName('li')[j].innerHTML.split(syntax[k]);
					if(pre[i].getElementsByTagName('li')[j].innerHTML.split(syntax[k])[1]) {
						switch(k) {
							case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
							case 12: pre[i].getElementsByTagName('li')[j].innerHTML = sep[0]+'<font color="#3333FF">'+syntax[k]+'</font>'+sep[1]; break;
							case 13: pre[i].getElementsByTagName('li')[j].innerHTML = '';
								for(var l = 0; l < sep.length; l = l+2) {
									if(sep[l+2]) { pre[i].getElementsByTagName('li')[j].innerHTML += sep[l]+'<font color="#F4661B">\''+sep[l+1]+'\'</font>'; }
									else { pre[i].getElementsByTagName('li')[j].innerHTML += sep[l]; }
								} break;
						}
					}
				}
			}
		}
	}
}

// END