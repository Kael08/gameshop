import dbClient from "../db/client.js"
import express from 'express'
const router =express.Router()

// POST - Запрос для регистрации пользователя
router.post('/',async(req,res)=>{
    const {login,password,username} = req.body

    // Проверка на пустоту
    if (!login || !password || !username) {
        return res.status(400).json({ error: "Логин, пароль и имя пользователя обязательны" });
    }

    try{
        // Проверка, что логин и никнейм не существуют
        const loginCheck = await  dbClient.query(
            'SELECT * FROM users_credential WHERE login=$1',
            [login]
        )

        if(loginCheck.rows.length>0){
            return res.status(400).json({error: "Данный логин уже занят!"})
        }

        const usernameCheck = await dbClient.query(
            "SELECT * FROM users_info WHERE username=$1",
            [username]
        )

        if(usernameCheck.rows.length>0){
            return res.status(400).json({error:"Данный никнейм уже занят!"})
        }

        // Запрос на добавление никнейма и возвращение id этого объекта
        const userInfoResult = await dbClient.query(
            'INSERT INTO users_info (username) VALUES ($1) RETURNING user_info_id',
            [username]
        )

        const userInfoId = userInfoResult.rows[0].user_info_id

        // Запрос на добавление FK, LOGIN & PASSWORD
        await  dbClient.query(
            'INSERT INTO users_credential (user_info_id,login,password) VALUES ($1,$2,$3)',
            [userInfoId,login,password]
        )

        res.status(201).json({message: "Пользователь успешно зарегестрирован ", userInfoId})
    } catch(error){
        console.error('Ошибка при выполнении запроса:',error.stack)
        res.status(500).json({error:'Ошибка сервера',deatails:error.message})
    }
})

export default router