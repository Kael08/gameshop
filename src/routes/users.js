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
router.get('/info/:user_info_id',async(req,res)=>{
    const {user_info_id} = req.params
    try{
        const result = await dbClient.query(
            'SELECT * FROM users_info WHERE user_info_id=$1',[user_info_id]
        )

        if(result.rows.length===0){
                return res.status(404).json(`Пользователь с id ${user_info_id} не найден`)
            }

        const user = {
            ...result.rows[0],
            image_data:result.rows[0].image_data ? result.rows[0].image_data.toString('base64'):null,
        }

        res.status(200).json(user)
    } catch(error){
        console.error('Ошибка при выполнении запросы ',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

// post - запрос на добавление email
router.post('/info/addEmail',async(req,res)=>{
    const{user_info_id,email} = req.body
    try{
        const emailCheck = await dbClient.query(
            'SELECT * FROM users_info WHERE email=$1',
            [email]
        )

        if(emailCheck.rows.length>0)
            return res.status(400).json("Данная почта уже занята")

        const userCheck = await dbClient.query(
            'SELECT * FROM users_info WHERE user_info_id = $1',
            [user_info_id]
        );
        
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        await dbClient.query(
            'UPDATE users_info SET email = $1 WHERE user_info_id=$2',
            [email,user_info_id]
        )

        res.status(200).json('email успешно дабавлен')
    } catch(error){
        console.error('Ошибка при выполнении запроса ',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

// post - запрос на добавление bio
router.post('/info/addBio',async(req,res)=>{
    const{user_info_id,bio} = req.body
    try{
        const userCheck = await dbClient.query(
            'SELECT * FROM users_info WHERE user_info_id = $1',
            [user_info_id]
        );
        
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        await dbClient.query(
            'UPDATE users_info SET bio = $1 WHERE user_info_id=$2',
            [bio,user_info_id]
        )

        res.status(200).json('bio успешно дабавлен')
    } catch(error){
        console.error('Ошибка при выполнении запроса ',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

// post - запрос на добавление аватара
router.post('/info/addImage',async(req,res)=>{
    const {user_info_id,image_data} = req.body
    try{
        const idCheck = await dbClient.query(
            'SELECT * FROM users_info WHERE user_info_id=$1',
            [user_info_id]
        )

        if(idCheck.rows===0)
            return res.status(400).json({error:'Пользователь не найден'})

        const imageBuffer = Buffer.from(image_data,'base64')

        await dbClient.query(
            'UPDATE users_info SET image_data = $1 WHERE user_info_id = $2',
            [imageBuffer,user_info_id]
        )

        res.status(201).json('Аватар пользователя успешно добавлен')

    } catch(error){
        console.error('Ошибка при выполнении запроса ',error.stack)
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
router.get('/credential/:user_credential_id',async(req,res)=>{
    const {user_credential_id} = req.params
    try{
        const result = await dbClient.query(
            'SELECT * FROM users_credential WHERE user_credential_id = $1',
            [user_credential_id]
        )

        if(result.rows.length===0){
            return res.status(404).json(`Пользователь с id ${user_credential_id} не найден`)
        }

        res.status(200).json(result.rows)
    }catch(error){
        console.error('Ошибка при выполнении запроса ', error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

// delete - запрос на удаление пользователя
router.delete('/delete/:user_id',async(req,res) => {
    const {user_id} = req.params
    try {
        const deleteCredentialResult = await dbClient.query(
            'DELETE FROM users_credential WHERE user_credential_id=$1 RETURNING user_info_id',
            [user_id]
        )

        if(deleteCredentialResult.rows.length===0){
            return res.status(404).json({error:'Пользователь не найден'})
        }
        
        const userInfoId = deleteCredentialResult.rows[0].user_info_id

        await dbClient.query(
            'DELETE FROM users_info WHERE user_info_id=$1',
            [userInfoId]
        )
        res.status(200).json('Данные пользователя успешно удалены')
    } catch(error) {
        console.error('Ошибка при выполнении запроса', error.stack)
        res.status(500).send('Ошибка удаления игры')
    }
})

// GET - запрос на получение списка из логина, пароля и никнейма юзера
router.get('/',async(req,res)=>{
    try{
        const result = await dbClient.query(
            `SELECT users_credential.login, users_credential.password, users_info.username
            FROM users_credential
            INNER JOIN users_info ON users_credential.user_info_id=users_info.user_info_id`
        )

        res.status(200).json(result.rows)
    }catch(error){
        console.error('Ошибка при выполнении запроса', error.stack)
        res.status(500).send('Ошибка удаления игры')  
    }
})

export default router