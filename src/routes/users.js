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

// post - запрос на добавление email
router.post('/info/addEmail',async(req,res)=>{
    const{id,email} = req.body
    try{
        const emailCheck = await dbClient.query(
            'SELECT * FROM users_info WHERE email=$1',
            [email]
        )

        if(emailCheck.rows.length===0)
            return res.status(400).json("Данная почта уже занята")

        const userCheck = await dbClient.query(
            'SELECT * FROM users_info WHERE user_info_id = $1',
            [id]
        );
        
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        await dbClient.query(
            'UPDATE users_info SET email = $1 WHERE user_info_id=$2',
            [email,id]
        )

        res.status(200).json('email успешно дабавлен')
    } catch(error){
        console.error('Ошибка при выполнении запроса ',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

// post - запрос на добавление bio
router.post('/info/addBio',async(req,res)=>{
    const{id,bio} = req.body
    try{
        const userCheck = await dbClient.query(
            'SELECT * FROM users_info WHERE user_info_id = $1',
            [id]
        );
        
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        await dbClient.query(
            'UPDATE users_info SET bio = $1 WHERE user_info_id=$2',
            [bio,id]
        )

        res.status(200).json('bio успешно дабавлен')
    } catch(error){
        console.error('Ошибка при выполнении запроса ',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

// post - запрос на добавление аватара
router.post('/info/addImage',async(req,res)=>{
    const {id,image_data} = req.body
    try{
        const idCheck = await dbClient.query(
            'SELECT * FROM users_info WHERE user_info_id=$1',
            [id]
        )

        if(idCheck.rows===0)
            return res.status(400).json({error:'Пользователь не найден'})

        const imageBuffer = Buffer.from(image_data,'base64')

        await dbClient.query(
            'UPDATE users_info SET image_data = $1 WHERE user_info_id = $2',
            [imageBuffer,id]
        )

        res.status(201).json('Аватар пользователя успешно добавлен')

    } catch(error){
        console.error('Ошибка при выполнении запроса ',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})


export default router