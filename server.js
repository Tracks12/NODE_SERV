var conf = require('./conf.json'),
		http = require('http'),
		url = require('url'),
		fs = require('fs');

var color = {
	reset: "\x1b[0m",
	underscore: "\x1b[4m",
	reverse: "\x1b[7m",
	
	fgBlack: "\x1b[30m",
	fgRed: "\x1b[31m",
	fgGreen: "\x1b[32m",
	fgYellow: "\x1b[33m",
	fgBlue: "\x1b[34m",
	fgMagenta: "\x1b[35m",
	fgCyan: "\x1b[36m",
	fgWhite: "\x1b[37m",
	
	bgBlack: "\x1b[40m",
	bgRed: "\x1b[41m",
	bgGreen: "\x1b[42m",
	bgYellow: "\x1b[43m",
	bgBlue: "\x1b[44m",
	bgMagenta: "\x1b[45m",
	bgCyan: "\x1b[46m",
	bgWhite: "\x1b[47m"
}

function isItem(item) {
	switch(item.split('.')[1]) {
		case 'html':
		case 'svg': return color.fgRed+item+color.reset;
		case 'css': return color.fgMagenta+item+color.reset;
		case 'js': return color.fgYellow+item+color.reset;
		default: return item;
	}
}

function errorIndex(code, obj) {
	var msg = new Array();
	
	switch(code) {
		case 403: msg[1] = 'Accès aux fichier refusé';
			msg[2] = 'Le fichier "'+obj+'" n\'est pas accessible';
			break;
		case 404: msg[1] = 'Fichier non trouvé';
			msg[2] = 'Le chemin "'+obj+'" n\'existe pas';
			break;
	}
	
	msg[0] = '<div><h1>Erreur '+code+'</h1><h2>'+msg[1]+'</h2><br /><p>'+msg[2]+'</p><br /><a href="/">Retour à l\'Index</a></div>';
	return Array(code, msg[0]);
}

function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname,
			info = { 'extension' : pathname.split('.').pop(), 'path' : pathname.split('/').pop() },
			error, code, today = new Date(), t = new Array(today.getHours(), today.getMinutes(), today.getSeconds());
	
	for(var i = 0; i <= 2; i++) { if(t[i] < 10) { t[i] = "0"+t[i]; }}
	var result = '['+t[0]+':'+t[1]+':'+t[2]+'] ';
	
	if(info['path'] == '') { pathname = pathname+conf.http.index; info['extension'] = 'html'; }
	
	try {
		response.writeHead(200, { 'Content-Type' : conf.http.mimes[info['extension']], "Charset" : conf.http.charset });
		response.end(fs.readFileSync(conf.http.www+pathname));
		result += 'code 200 to : '.toLocaleUpperCase()+pathname;
	}
	catch(e) {
		switch(info['path']) {
			case '.htaccess': error = errorIndex(403, info['path']); break;
			default: error = errorIndex(404, pathname); break;
		}
		
		response.writeHead(error[0], { 'Content-Type' : conf.http.mimes['html'], "Charset" : conf.http.charset });
		response.end(fs.readFileSync(conf.http.error)+error[1]);
		result += 'code '+error[0]+' to : '.toLocaleUpperCase()+pathname+'\n'+e;
	}	console.log(result);
}

switch(process.argv[2]) {
	case '-ls': console.log('Listing du répertoire "'+conf.http.www+'"\n');
		fs.readdirSync(conf.http.www).forEach(file => {
			if(!file.split('.')[1]) { file += "/"; }
			console.log('\t'+isItem(file));
		});
		break;
	case '-p':
	case '--port': if(!process.argv[3]) { console.log('No Port Specified !'); break; }
		http.createServer(onRequest).listen(process.argv[3]);
		console.log('Node JS server is running on 127.0.0.1:'+process.argv[3]+'\n');
		break;
	case '-start': http.createServer(onRequest).listen(conf.http.port);
		console.log('Node JS Server is starting...\n');
		break;
	case '-h':
	case '--help':
	default: var helper = 'server.js  -start\t: Démarre un serveur local sur le port '+conf.http.port+'\n';
		helper += '\t   -p\t\t: Spécifie le port de connexion du serveur\n';
		helper += '\t   -ls\t\t: Liste les fichiers présents dans le répertoire "'+conf.http.www+'"\n';
		helper += '\t   -h\t\t: Affiche les arguments de commandes\n\n';
		helper += '\t   --port\t: Spécifie le port de connexion du serveur\n';
		helper += '\t   --help\t: Affiche les arguments de commandes\n';
		console.log(helper);
		break;
}
