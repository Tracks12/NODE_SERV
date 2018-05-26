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
	case '-start':
	default: http.createServer(onRequest).listen(conf.http.port);
		console.log('Node JS Server is starting...\n');
		break;
}
