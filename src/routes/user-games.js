import dbClient from "../db/client.js";
import express from "express"
const router = express.Router()

// Post - запрос на добавление игры к пользователю
router.post('/add',async(req,res)=>{
    const {user_info_id,game_id} = req.body
    try{
        const userCheck = await dbClient.query(
            'SELECT * FROM users_info WHERE user_info_id=$1',
            [user_info_id]
        )

        const gameCheck = await dbClient.query(
            'SELECT * FROM games WHERE game_id=$1',
            [game_id]
        )

        if(userCheck.rows.length===0)
            return res.status(404).json(`Пользователь с id ${user_info_id} не найден`)
        if(gameCheck.rows.length===0)
            return res.status(404).json(`Игра с id ${game_id} не найдена`)

        // Добавление id игры и пользователя в общую таблицу
        await dbClient.query(
            'INSERT INTO user_games (user_info_id,game_id) VALUES($1,$2)',
            [user_info_id,game_id]
        )

        res.status(201).json("Игра успешно добавлена в библиотеку пользователя")

    } catch(error) {
        console.error('Ошибка при выполнении запроса',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

// Get-запрос для получения всех игр пользователя
router.get('/user/:user_info_id', async (req, res) => {
    const { user_info_id } = req.params
    try {
        // Проверка на наличие игр у пользователя
        const userGamesResult = await dbClient.query(
            'SELECT * FROM user_games WHERE user_info_id=$1',
            [user_info_id]
        )

        // Извлечение массива game_id из результата
        const gameIds = userGamesResult.rows.map(row => row.game_id)

        if (gameIds.length === 0) {
            return res.status(404).json(`Игры пользователя не найдены`)
        }

        // Получение названий игр по game_id
        const gamesResult = await dbClient.query(
            'SELECT name FROM games WHERE game_id = ANY($1)',
            [gameIds]
        );

        // Возвращение результата
        res.status(200).json(gamesResult.rows)
    } catch (error) {
        console.error('Ошибка при выполнении запроса', error.stack)
        res.status(500).json({ error: "Ошибка сервера", details: error.message })
    }
});

//GET - запрос на получение имени пользователя и его игр
router.get('/',async(req,res) =>{
    try{
        const userGames = await dbClient.query(
            `SELECT users_info.username, games.name AS game_name 
            FROM user_games 
            INNER JOIN users_info ON user_games.user_info_id = users_info.user_info_id 
            INNER JOIN games ON user_games.game_id = games.game_id`
        )

        res.status(200).json(userGames.rows)
    }catch(error){
        console.error('Ошибка при выполнении запроса',error.stack)
        res.status(500).json({error:"Ошибка сервера", details:error.message})
    }
})

// DELETE - Запрос на удаление игры у пользователя
router.delete('/delete-game',async(req,res)=>{
    try{
        const {user_info_id,game_id}=req.body
        
        const check = await dbClient.query(
            'SELECT * FROM user_games WHERE user_info_id=$1 AND game_id=$2',
            [user_info_id,game_id]
        )

        if(check.rows.length===0)
            return res.status(404).json('Пользователь с данной игрой не найден')

        // Удаляем игру у пользователя
        await dbClient.query(
            'DELETE FROM user_games WHERE user_info_id = $1 AND game_id = $2',
            [user_info_id, game_id]
        )

        res.status(200).json('Данные пользователя успешно удалены')
    } catch(error){
        console.error('Ошибка при выполнении запроса',error.stack)
        res.status(500).json({error:"Ошибка сервера",details:error.message})
    }
})


export default router