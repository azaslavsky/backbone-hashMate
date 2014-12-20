var staticAlias = require('node-static-alias');
var log4js = require('log4js');
var logger = log4js.getLogger('node-static-alias');
logger.setLevel(log4js.levels.DEBUG);

// Document-Root: './public' directory
var fileServer = new staticAlias.Server('./', {
  alias: {
    match: '/',
    serve: 'test/jasmine.html',
    allowOutside: true,
    logger: logger
  }
});

require('http').createServer(function(request, response) {
  request.addListener('end', function() {
    fileServer.serve(request, response);
  }).resume();
}).listen(4040);
console.log('Server running at http://localhost:4040/');