var conf = require('./conf.json'),
		http = require('http'),
		url = require('url'),
		fs = require('fs');

function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname,
			extension = pathname.split('.').pop(),
			today = new Date(),
			result = '['+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()+'] ';

	if(pathname == '/') { pathname = conf.http.index; extension = 'html'; }

	try {
		response.writeHead(200, {'Content-Type' : conf.http.mimes[extension]});
		response.end(fs.readFileSync(conf.http.www+pathname));
		result += 'code 200 to : '.toLocaleUpperCase()+pathname;
	}
	catch(e) {
		var error = '<div><h1>Erreur 404</h1><h2>Fichier non trouvé</h2><br /><p>Le chemin "'+pathname+'" n\'existe pas</p><br /><a href="/">Retour à l\'Index</a></div>';
		response.writeHead(404, {'Content-Type' : conf.http.mimes['html']});
		response.end(fs.readFileSync(conf.http.error['404'])+error);
		result += 'code 404 to : '.toLocaleUpperCase()+pathname+'\n'+e;
	} console.log(result);
}

switch(process.argv[2]) {
	case '-ls': var files = new Array(), i = new Array(0, 0);
		fs.readdirSync('.').forEach(file => { files[i[0]] = file; i[0]++; });
		fs.readdirSync(files[3]).forEach(file => { files[i[1]] = file; i[1]++; });
		console.log(files);
		break;
	case '-start': http.createServer(onRequest).listen(conf.http.port);
		console.log('Node JS Server is starting...\n');
		break;
	case '-h':
	case '--help':
	default: var helper = 'server.js  -start\t: Démarre un serveur local sur le port '+conf.http.port+'\n';
		helper += '\t   -ls\t\t: Liste les fichiers présents dans le répertoire "'+conf.http.www+'"\n';
		helper += '\t   -h\t\t: Affiche les arguments de commandes\n\n';
		helper += '\t   --help\t: Affiche les arguments de commandes\n\n';
		console.log(helper);
		break;
}
