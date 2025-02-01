import dbClient from "../db/client.js"
import express from  'express'
const router = express.Router()

// POST - Запрос для авторизации пользователя
/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Аутентификация пользователя
 *     description: Авторизация с логином и паролем.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthReq"
 *     responses:
 *       200:
 *         description: Успешная авторизация, возвращает информацию о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthRes"
 *       400:
 *         description: Неправильный логин или пароль
 *       500:
 *         description: Ошибка сервера
 */
router.post('/',async(req,res)=>{
    const {login,password} = req.body
    try{
        const data = await dbClient.query(
            'SELECT * FROM users_credential WHERE login=$1',
            [login]
        )

        if(data.rows.length ===0){
            return res.status(400).json(`Неправильный логин`)
        }

        if(data.rows[0].password!=password){
            return res.status(400).json(`Неправильный пароль`)
        }

        const result = await dbClient.query(
            'SELECT * FROM users_info WHERE user_info_id = $1',
            [data.rows[0].user_info_id]
        )

        res.status(200).json(result.rows)
    } catch(error) {
        console.error('Ошибка при выполнении запроса:', error.stack);
        res.status(500).json({ error: 'Ошибка сервера', details: error.message });
    }
})

export default router