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
                const {name,price} = JSON.parse(body)
                await dbClient.query('INSERT INTO games (name,price) VALUES ($1,$2)',[name,price])
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