const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
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
        const bookingsCollection = client.db("luxuriousLumber").collection("bookings");
        const paymentsCollection = client.db("luxuriousLumber").collection("payments");

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

        app.get('/user/buyer/:email',async(req,res)=>{
            const email = req.params.email;
            const query= {email:email};
            const buyer = await usersCollection.findOne(query)
            res.send({isBuyer:  buyer?.accType === 'Buyer'})     
        });
        app.get('/user/seller/:email', async(req,res)=>{
            const email = req.params.email;
            const query= {email:email};
            const seller = await usersCollection.findOne(query);
            res.send({isSeller:seller?.accType==='Seller'})
        })

        app.get('/user/admin/:email', async(req,res)=>{
            const email = req.params.email;
            const query= {email:email};
            const user = await usersCollection.findOne(query);
            res.send({isAdmin:user?.role === 'admin'})
        })

        app.get('/allSellers', async(req,res)=>{
            const accType = req.params.accType;
            const query = {accType:'Seller'};
            const allSellers = await usersCollection.find(query).toArray();
            res.send(allSellers)
          
        })
        app.get('/allBuyers', async(req,res)=>{
            const accType = req.params.accType;
            const query = {accType:'Buyer'};
            const allBuyers = await usersCollection.find(query).toArray();
            res.send(allBuyers)
          
        })

        app.get('/products', async(req,res)=>{
            const query ={};
            const products = await productsCollection.find(query).toArray();
            res.send(products)
        })

        app.get('/products/:category', async(req,res)=>{
            const category = req.params.category;
            const query = {category:category}
            const products = await productsCollection.find(query).toArray()
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

        app.get('/bookings', async(req,res)=>{
            const email = req.params.email;
            const query = {email:email};
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings)
        })

        app.get('/bookings/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await bookingsCollection.findOne(query);
            res.send(result)
        })

        app.post('/bookings', async(req,res)=>{
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);

        })

        app.post('/create-payment-intent', async (req, res) =>{
            const booking = req.body;
            const price = booking.price;
            const amount = price * 100;
            const paymentIntent = await stripe.paymentIntents.create({
               currency:'usd',
               amount:amount,
               "payment_method_types": [
                   "card"
               ]

            });

            res.send({
               clientSecret: paymentIntent.client_secret,
             });
       })

       app.post('/payments', async(req,res)=>{
        const payment = req.body;
        const result = await paymentsCollection.insertOne(payment)
        const id =payment.bookingId
        const filter = {_id:ObjectId(id)}
        const updatedDoc={
            $set:{
                    paid:true
            }
        }
       const updatedResult = await bookingsCollection.updateOne(filter,updatedDoc)
        res.send(result)
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