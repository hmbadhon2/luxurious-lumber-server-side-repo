const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.port || 5000;


// middleWare
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.DB_PASSWORD}@cluster0.hvwcwlz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)

async function run(){

    try{
        const CategoriesCollection = client.db("luxuriousLumber").collection("Categories");
        const productsCollection = client.db("luxuriousLumber").collection("products");

        const usersCollection = client.db("luxuriousLumber").collection("users");

        app.get('/categories',async(req,res)=>{
            const query ={};
            const categories = await CategoriesCollection.find(query).toArray();
            res.send(categories)
        })
        app.get('/categories/:id', async(req, res)=>{
            const id = req.params.id;
            const filter= {_id:ObjectId(id)}
            const result = await CategoriesCollection.findOne(filter);
            res.send(result)
        })
        app.get('/users', async(req,res)=>{
            const query = {}
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        })

        app.get('/products', async(req,res)=>{
            const query ={};
            const products = await productsCollection.find(query).toArray();
            res.send(products)
        })

        app.post('/products', async(req,res)=>{
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result)
        } )
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