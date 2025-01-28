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
        // Отправка данных в JSON
        res.status(200).json(games)
    } catch (error){
        console.error('Ошибка при выполнении запроса', error.stack)
        res.status(500).json({error:'Ошибка при выборке данных',details: err.message})
    }
})

// GET-запрос с фильтрацией по жанру
router.get('/:genres',async(req,res)=> {
    const {genres} = req.params
    try {
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
    const {name,price,genres,game_img,description,rating,developer} = req.body
    try{
        // Преобразование в данные типа base64 для отображения
        const gameImgBuffer = Buffer.from(game_img,'base64')
        const result = await dbClient.
        query('INSERT INTO games (name,price,genres,game_img,description,rating,developer) VALUES ($1,$2,$3,$4,$5,$6,$7)'
            ,[name,price,genres,gameImgBuffer,description,rating,developer])
        res.status(201).json(result.rows[0])
    }catch(error) {
        console.error('Ошибка добавления игры:',error)
        res.status(500).json({error:'Ошибка сервера'})
    }
})

// DELETE - запрос на удаление игры
router.delete('/',async(req,res)=> {
    const {game_id} = req.body
    try{
        await dbClient.query('DELETE FROM games WHERE game_id = $1',[game_id])
        res.status(200).send('Игра успешно удалена')
    } catch(error){
        console.error('Ошибка при выполнении запроса', error.stack)
        res.status(500).send('Ошибка удаления игры')
    }
})

// GET - запрос на получение игры по её id
router.get('/gamePage/:game_id', async(req,res)=> {
    const {game_id} = req.params
    try {
        const result = await dbClient.query('SELECT * FROM games WHERE game_id= $1',[game_id])
        
        // Проверка наличия игры
        if(result.rows.length===0){
            return res.status(404).json({error:`Игра с id=${game_id} не найдена`})
        }

        // Форматируем данные (например, преобразуем изображение)
        const game = {
            ...result.rows[0],
            game_img: result.rows[0].game_img ? result.rows[0].game_img.toString('base64') : null,
        };
        
        res.status(200).json(game)
    } catch(error){
        console.error('Ошибка поиска игры с id:',game_id)
        res.status(500).json({error:'Ошибка сервера'})
    }
})

export default router