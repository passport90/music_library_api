import http from 'http'

// Run HTTP OK server
const httpServer = http.createServer((_req, res) => {
  res.writeHead(200)
  res.end('hello, world!')
})
httpServer.listen(8080)