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

// GET -Запрос на получение ЛИ юзера по id
router.get('/info/:id',async(req,res)=>{
    const {id} = req.params
    try{
        const result = await dbClient.query(
            'SELECT * FROM users_info WHERE user_info_id=$1',[id]
        )

        if(result.rows.length===0){
                return res.status(404).json(`Пользователь с id ${id} не найден`)
            }

        res.status(200).json(result.rows)
    } catch(error){
        console.error('Ошибка при выполнении запросы ',error.stack)
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


// GET - Запрос на получение УД юзера по id
router.get('/credential/:id',async(req,res)=>{
    const {id} = req.params
    try{
        const result = await dbClient.query(
            'SELECT * FROM users_credential WHERE user_credential_id = $1',
            [id]
        )

        if(result.rows.length===0){
            return res.status(404).json(`Пользователь с id ${id} не найден`)
        }

        res.status(200).json(result.rows)
    }catch(error){
        console.error('Ошибка при выполнении запроса ', error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})


export default router