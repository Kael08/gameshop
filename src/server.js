import http from 'http'
import express from 'express'
import gamesRouter from './routes/games.js'
import authRouter from './routes/auth.js'
import signUpRouter from './routes/sign-up.js'
import usersRouter from './routes/users.js'

const app = express()

app.use(express.json())

// Middleware для CORS
app.use((req,res,next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*')// http://localhost:5173
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if(req.method==='OPTIONS'){
    res.sendStatus(204)// Предварительный запрос на доступ
  } else {
    next()
  }
})
// Роутер для /games(Игр)
app.use('/games',gamesRouter)

// Роутер для /auth(Аутентификация и Авторизация)
app.use('/auth',authRouter)

// Роутер для /sign-up(Регистрация)
app.use('/sign-up',signUpRouter)

// Роутер для /users(Пользователей)
app.use('/users',usersRouter)

// Обработчик для всех остальных путей
app.use((req,res)=> {
  res.status(404).send('Не найден')
})

// Запуск сервера
const PORT = process.env.PORT||3000
http.createServer(app).listen(PORT,() => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})