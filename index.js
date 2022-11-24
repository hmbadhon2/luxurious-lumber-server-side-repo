const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;


// middleWare
app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('my luxurious lumber is running')
})

app.listen(port, ()=>{
    console.log(`My Api is running on port ${port} `)
})