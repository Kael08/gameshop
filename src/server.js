import http from 'http'
import {handleGames} from './routes/games.js'

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/games')) {
      handleGames(req, res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });