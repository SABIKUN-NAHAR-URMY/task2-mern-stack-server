const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ho0d8c2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const postCollection = client.db('task2').collection('post');
        const usersCollection = client.db('task2').collection('users');
        const commentCollection = client.db('task2').collection('comment');
       

        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email};
            const user = await usersCollection.findOne(query);
            res.send(user);
        })

        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.send(result);
        })

        app.get('/postData', async (req, res) => {
            const query = {};
            const cursor = postCollection.find(query);
            const post = await cursor.toArray();
            res.send(post);
        })

        app.post('/postNews', async (req, res) => {
            const postNews = req.body;
            const result = await postCollection.insertOne(postNews);
            res.send(result);
        })

        app.get('/updatePost/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateData = await postCollection.findOne(query);
            res.send(updateData);
        })

        app.get('/comment', async (req, res) => {
            const query = {};
            const cursor = commentCollection.find(query);
            const comment = await cursor.toArray();
            res.send(comment);
        })

        app.post('/comment', async (req, res) => {
            const review = req.body;
            const result = await commentCollection.insertOne(review);
            res.send(result);
        })

        app.patch('/updatePost/:id', async (req, res) => {
            const id = req.params.id;
            const details = req.body.details;
            const title = req.body.title;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    details: details,
                    title: title
                }
            }
            const result = await postCollection.updateOne(query, updateDoc);
            res.send(result);

        })

        app.delete('/postData/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await postCollection.deleteOne(query);
            res.send(result);

        })

        

    }
    finally {

    }
}
run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('Task2 server running!')
})

app.listen(port, () => {
    console.log(`Task2 server listening on port ${port}`)
})