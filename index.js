const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Logger Function
  const logRequest = () => {
    const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}`;
    console.log(logMessage);
    fs.appendFile('server.log', logMessage + '\n', (err) => {
      if (err) throw err;
    });
  };

  // Static file serving
  const serveStaticFile = (filePath, contentType, response) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('File Not Found');
      } else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content);
      }
    });
  };

  // Home Route
  if (pathname === '/') {
    logRequest();
    serveStaticFile(path.join(__dirname, 'index.html'), 'text/html', res);
  }
  // About Route
  else if (pathname === '/about') {
    logRequest();
    serveStaticFile(path.join(__dirname, 'about.html'), 'text/html', res);
  }
  // JSON API Route
  else if (pathname === '/api') {
    logRequest();
    const responseObject = {
      message: 'Welcome to the API',
      timestamp: new Date().toISOString()
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(responseObject));
  }
  // 404 Page
  else {
    logRequest();
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>Page Not Found</h1>');
  }
});

// Listening on the specified port
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handling process termination
process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  process.exit();
});
