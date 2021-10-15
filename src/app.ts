import http2 from 'http2'
import fs from 'fs'

const server = http2.createSecureServer({
  key: fs.readFileSync('ssl/localhost-privkey.pem'),
  cert: fs.readFileSync('ssl/localhost-cert.pem')
})
server.on('error', (err) => console.error(err))
  
server.on('stream', (stream, _headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200
  })
  stream.end('Hello, World!')
})
  
server.listen(8443)