import dbClient from "../db/client.js"
import express from 'express'
const router = express.Router()

// GET- Запрос на получение всех игр
/**
 * @swagger
 * /games:
 *   get:
 *     summary: Получение списка всех игр
 *     description: Возвращает список всех игр из базы данных.
 *     responses:
 *       200:
 *         description: Успешный ответ с массивом игр
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/game'
 *       500:
 *         description: Ошибка сервера
 */
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
/**
 * @swagger
 * /games/{genres}:
 *   get:
 *     summary: Получение игр по жанрам
 *     description: Возвращает список игр, соответствующих переданным жанрам.
 *     parameters:
 *       - in: path
 *         name: genres
 *         required: true
 *         schema:
 *           type: string
 *         description: Жанры через запятую (например, "Action,RPG").
 *     responses:
 *       200:
 *         description: Успешный ответ с массивом игр
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/game"
 *       500:
 *         description: Ошибка сервера
 */
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
/**
 * @swagger
 * /games:
 *   post:
 *     summary: Добавление новой игры
 *     description: Создает новую игру в базе данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/gameReq"
 *     responses:
 *       201:
 *         description: Игра успешно добавлена
 *       500:
 *         description: Ошибка сервера
 */
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
/**
 * @swagger
 * /games:
 *   delete:
 *     summary: Удаление игры
 *     description: Удаляет игру из базы данных по её ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               game_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Игра успешно удалена
 *       500:
 *         description: Ошибка сервера
 */
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
/**
 * @swagger
 * /games/gamePage/{game_id}:
 *   get:
 *     summary: Получение информации об игре
 *     description: Возвращает информацию об игре по её ID.
 *     parameters:
 *       - in: path
 *         name: game_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID игры
 *     responses:
 *       200:
 *         description: Успешный ответ с информацией об игре
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/game"
 *       404:
 *         description: Игра не найдена
 *       500:
 *         description: Ошибка сервера
 */
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