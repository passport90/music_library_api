import http from 'http'
import fs from 'fs'

// Run HTTP OK server that open file
const httpServer = http.createServer((req: http.IncomingMessage, res) => {
  const path = req.url
  
  try {
    const file = fs.readFileSync(`${process.env.PUBLIC_PATH}${path}`)
    res.writeHead(200)
    res.end(file.toString())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.writeHead(500)
    res.end(message)
  }
})
httpServer.listen(8080)