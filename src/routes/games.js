import dbClient from "../db/client.js"

export const handleGames = async(req,res) => {
    if(req.method==='GET') {
        try {
            const result = await dbClient.query('SELECT * FROM games')
            res.writeHead(200,{'ContentType': 'application/json'})
            res.end(JSON.stringify(result.rows))
        } catch(err) {
            console.error('Error executing query', err.stack)
            res.writeHead(500)
            res.end('Error fetching data')
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
    } else {
        res.writeHead(404)
        res.end('Not Found')
    }
}