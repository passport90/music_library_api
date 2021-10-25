import http from 'http'

// Run HTTP OK server
const httpServer = http.createServer((_req, res) => {
  res.writeHead(204)
  res.end()
})
httpServer.listen(80)