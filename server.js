var conf = require('./conf.json'),
    http = require('http'),
    url = require('url'),
    fs = require('fs');

function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname,
            info = { 'extension' : pathname.split('.').pop(), 'path' : pathname.split('/').pop() },
            error, code, today = new Date(),
            result = '['+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()+'] ';
	
	if(info['path'] == '') { pathname = pathname+conf.http.index; info['extension'] = 'html'; }
	
	try {
		response.writeHead(200, { 'Content-Type' : conf.http.mimes[info['extension']], "Charset" : conf.http.charset });
		response.end(fs.readFileSync(conf.http.www+pathname));
		result += 'code 200 to : '.toLocaleUpperCase()+pathname;
	}
	catch(e) {
		switch(info['path']) {
			case '.htaccess': code = 403;
				error = '<div><h1>Erreur '+code+'</h1><h2>Accès aux fichier refusé</h2><br /><p>Le fichier "'+info['path']+'" n\'est pas accessible</p><br /><a href="/">Retour à l\'Index</a></div>';
				break;
			default: code = 404;
				error = '<div><h1>Erreur '+code+'</h1><h2>Fichier non trouvé</h2><br /><p>Le chemin "'+pathname+'" n\'existe pas</p><br /><a href="/">Retour à l\'Index</a></div>';
				break;
		}
		
		response.writeHead(code, { 'Content-Type' : conf.http.mimes['html'], "Charset" : conf.http.charset });
		response.end(fs.readFileSync(conf.http.error)+error);
		result += 'code '+code+' to : '.toLocaleUpperCase()+pathname+'\n'+e;
	}	console.log(result);
}

switch(process.argv[2]) {
	case '-ls': var files = new Array(), i = new Array(0, 0);
		fs.readdirSync(conf.http.www).forEach(file => { files[i[1]] = file; i[1]++; });
		console.log(files);
		break;
	case '-p':
	case '--port': if(!process.argv[3]) { console.log('No Port Specified !'); break; }
		http.createServer(onRequest).listen(process.argv[3]);
		console.log('Node JS server is running on 127.0.0.1:'+process.argv[3]);
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
		helper += '\t   --help\t: Affiche les arguments de commandes\n\n';
		console.log(helper);
		break;
}
