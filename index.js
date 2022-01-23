const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5050;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rb0vh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
    const toursCollection = client.db("travelX").collection("tours");

    const ordersCollection = client.db("travelX").collection("orders");

    // const usersCollection = client.db("travelX").collection("users");

    //add toursCollection
    app.post("/addTours", async (req, res) => {
        console.log(req.body);
        const result = await toursCollection.insertOne(req.body);
        res.send(result);
    });

    // get all tours
    app.get("/allTours", async (req, res) => {
        const result = await toursCollection.find({}).toArray();
        res.send(result);
    });

    // get single tour
    app.get("/singleTours/:id", async (req, res) => {
        console.log(req.params.id);
        const result = await toursCollection
            .find({ _id: ObjectId(req.params.id) })
            .toArray();
        res.send(result[0]);
        console.log(result);
    });

    // insert order in database

    app.post("/addOrders", async (req, res) => {
        const result = await ordersCollection.insertOne(req.body);
        res.send(result);
    });

    //  my orders

    app.get("/myOrders/:email", async (req, res) => {
        console.log(req.params.email);
        const result = await ordersCollection
            .find({ email: req.params.email })
            .toArray();
        res.send(result);
    });

    // delete order
    app.delete("/deleteOrder/:id", async (req, res) => {
        console.log(req.params.id)
        const result = await ordersCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        res.send(result);
        console.log(result)
    });

    // // add a user
    // app.post("/addUserInfo", async (req, res) => {
    //     console.log("req.body");
    //     const result = await usersCollection.insertOne(req.body);
    //     res.send(result);
    //     console.log(result);
    // });


    // all order
    app.get("/allOrders", async (req, res) => {
        const result = await ordersCollection.find({}).toArray();
        res.send(result);
    });

    // status update

    app.put("/statusUpdate/:id", async (req, res) => {
        const filter = { _id: ObjectId(req.params.id) };
        console.log(req.params.id);
        const result = await ordersCollection.updateOne(filter, {
            $set: {
                status: req.body.status,
            },
        });
        res.send(result);
        console.log(result);
    });
})



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})