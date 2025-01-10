import dbClient from "../db/client.js"
import express from 'express'
const router = express.Router()

// GET- Запрос на получение всех игр
router.get('/',async(req,res)=>{
    try {
        // Запрос в SQL
        const result = await dbClient.query('SELECT * FROM games')
        // Переменная для хранения игр
        const games = result.rows.map(game => ({
            ...game, 
            game_img:game.game_img ? game.game_img.toString('base64'):null,
        }))

        /*res.writeHead(200, {
            'Content-Type': 'application/json', // Тип данных - JSON
            'Access-Control-Allow-Origin': 'http://localhost:5173', // Разрешить доступ только источнику с этого порта, иначе писать *
        })    
        // Отправка данных в JSON
        res.end(JSON.stringify(games))*/
        // Отправка данных в JSON
        res.status(200).json(games)
    } catch (error){
        /*console.error('Ошибка при выполнении запроса', err.stack)
        res.writeHead(500, { 'Access-Control-Allow-Origin': 'http://localhost:5173' })
        res.end(JSON.stringify({error:'Ошибка при выборке данных',details: err.message}))*/
        console.error('Ошибка при выполнении запроса', error.stack)
        res.status(500).json({error:'Ошибка при выборке данных',details: err.message})
    }
})

// GET-запрос с фильтрацией по жанру
router.get('/:genres',async(req,res)=> {
    const {genres} = req.params
    try {
        if(!genres){
            return res.status(400).json({error: 'Необходимо указать жанры для фильтрации'})
        }
        // Преобразуем жанры из строки в массив
        const genresArray = genres.split(',')

        const query = 'SELECT * FROM games WHERE genres && $1'
        const values = [genresArray]

        const result = await dbClient.query(query,values)
        
    // Форматируем данные (например, преобразуем изображение)
    const games = result.rows.map(game => ({
        ...game,
        game_img: game.game_img ? game.game_img.toString('base64') : null,
    }));

    res.status(200).json(games);
} catch (error) {
    console.error('Ошибка при выполнении запроса:', error.stack);
    res.status(500).json({ error: 'Ошибка сервера', details: error.message });
}
})

// POST - запрос на добавление игры
router.post('/',async(req,res)=> {
    const {name,price,genres,game_img} = req.body
    try{
        // Преобразование в данные типа base64 для отображения
        const gameImgBuffer = Buffer.from(game_img,'base64')
        const result = await dbClient.query('INSERT INTO games (name,price,genres,game_img) VALUES ($1,$2,$3,$4)',[name,price,genres,gameImgBuffer])
        res.status(201).json(result.rows[0])
    }catch(error) {
        console.error('Ошибка добавления игры:',error)
        res.status(500).json({error:'Ошибка сервера'})
    }
})

// DELETE - запрос на удаление игры
router.delete('/',async(req,res)=> {
    const {id} = req.body
    try{
        await dbClient.query('DELETE FROM games WHERE id = $1',[id])
        res.status(200).send('Игра успешно удалена')
    } catch(error){
        console.error('Ошибка при выполнении запроса', error.stack)
        res.status(500).send('Ошибка удаления игры')
    }
})

export default router

/*export const handleGames = async(req,res) => {
    if(req.method==='GET') {
        try {
            const result = await dbClient.query('SELECT * FROM games');
            const games = result.rows.map(game => ({
                ...game,
                game_img: game.game_img.toString('base64'),
            }));
    
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:5173', // Разрешить доступ с любого источника
            });
            res.end(JSON.stringify(games));
        } catch (err) {
            console.error('Error executing query', err.stack);
            res.writeHead(500, { 'Access-Control-Allow-Origin': 'http://localhost:5173' });
            res.end('Error fetching data');
        }
    } else if (req.method==='POST') {
        let body =''
        req.on('data', (chunk) => {body +=chunk.toString()})
        req.on('end',async()=> {
            try {
                const {name,price,genres,game_img} = JSON.parse(body)
                const gameImgBuffer = Buffer.from(game_img,'base64')
                await dbClient.query('INSERT INTO games (name,price,genres,game_img) VALUES ($1,$2,$3,$4)',[name,price,genres,gameImgBuffer])
                res.writeHead(201)
                res.end('Game added successfuly')
            } catch(err){
                console.error('Error executing query',err.stack)
                res.writeHead(500)
                res.end('Error adding game')
            }
        })
    } else if(req.method==='DELETE') {
        let body =''
        req.on('data',(chunk)=>{body+=chunk.toString()})
        req.on('end',async()=>{
            try {
                const {id}=JSON.parse(body)
                await dbClient.query('DELETE FROM games WHERE id = $1',[id])
                res.writeHead(200)
                res.end('Game delete successfuly')
            } catch(err){
                console.error('Error executing query',err.stack)
                    res.writeHead(500)
                    res.end('Error deleting game')
            }
        })

    }
    else {
        res.writeHead(404)
        res.end('Not Found')
    }
}*/