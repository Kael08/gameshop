import http from 'http'
//import {handleGames} from './routes/games.js'
import express from 'express'
import gamesRouter from './routes/games.js'

const app = express()

app.use(express.json())

// Middleware для CORS
app.use((req,res,next) =>{
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if(req.method==='OPTIONS'){
    res.sendStatus(204)// Предварительный запрос на доступ
  } else {
    next()
  }
})
// Роутер для /games
app.use('/games',gamesRouter)

// Обработчик для всех остальных путей
app.use((req,res)=> {
  res.status(404).send('Не найден')
})

// Запуск сервера
const PORT = process.env.PORT||3000
http.createServer(app).listen(PORT,() => {
  console.log('Сервер запущен на http://localhost:${PORT}')
})

/*const server = http.createServer((req, res) => {
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
})*/