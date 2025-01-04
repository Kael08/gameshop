import http from 'http'
import pkg from 'pg'

const {Client } = pkg

// Настройка соединения с БД
const dbClient = new Client({
  user:'postgres',
  host:'localhost',
  database: 'postgres',
  password: '5567',
  port: 5432,
})

dbClient.connect()
  .then(()=> console.log('Connected to ProstgreSQL'))
  .catch(err=>console.error('Connection error',err.stack))

const listener = async (req, res) => {
  if(req.method === 'GET' && req.url==='/games'){
    // Получение данных игр
    try{
      const result = await dbClient.query('SELECT * FROM games')
      res.writeHead(200, { 'Content-Type': 'application/json'})
      res.end(JSON.stringify(result.rows))
    } catch(err){
      console.error('Error executing query', err.stack)
      res.writeHead(500)
      res.end('Error fetching data')
    }
  } else if (req.method === 'POST' && req.url==='/games') {
    // Добавление новой игры
    let body =''
    req.on('data',chunk => {
      body += chunk.toString()
    })
    req.on('end',async()=> {
      try {
        const gamesData = JSON.parse(body)
        const {name,price} = gamesData
        await dbClient.query('INSERT INTO games (name,price) VALUES ($1,$2)', [name,price])
        res.writeHead(201)
        res.end('Game added successfuly')
      } catch(err){
        console.error('Error executing query',err.stack)
        res.writeHead(500)
        res.end('Error adding game')
      }
    })
  } else {
    res.writeHead(404)
    res.end('Not Found')
  }
};

const server = http.createServer(listener);

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});