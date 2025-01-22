import dbClient from "../db/client.js"
import express from "express"
const router = express.Router()

// GET - Запрос на получение учетный данных пользователей
router.get('/info',async(req,res)=>{
    try{
        const result = await dbClient.query(
             'SELECT * FROM users_info'
        )     
        const users = result.rows.map(user => ({
            ...user,
            image_data:user.image_data ? user.image_data.toString('base64'):null
        }))     
        res.status(200).json(users)  
    } catch(error){
        console.error('Ошибка при выполнении запроса',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})
// GET - Запрос на получение личной информации пользователей
router.get('/credential',async(req,res)=>{
    try{
        const result = await dbClient.query
        (
            'SELECT * FROM users_credential'
        )

        res.status(200).json(result.rows)
    } catch(error){
        console.error('Ошибка при выполнении запроса',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})


export default router