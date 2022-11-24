const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.port || 5000;


// middleWare
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.DB_PASSWORD}@cluster0.hvwcwlz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)

async function run(){
    try{
        const usersCollection = client.db("luxuriousLumber").collection("users");

        app.get('/users', async(req,res)=>{
            const query = {}
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        })
        app.post('/users', async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(user)
        })

        

    }
    finally{

    }

}
run()
.catch(err => console.error(err))



app.get('/', (req, res)=>{
    res.send('my luxurious lumber is running')
})

app.listen(port, ()=>{
    console.log(`My Api is running on port ${port} `)
})