const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w5am0gy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const postsCollection = client.db('web-media').collection('posts');
        const commentCollection = client.db('web-media').collection('comments');

        app.get("/allPosts", async (req, res) => {
            const query = {};
             const allPosts = await postsCollection.find(query).sort({_id:-1}).toArray();
             res.send(allPosts)
        });
       
        app.get("/allPostsByLikes", async (req, res) => {
            const query = {};
             const cursor = postsCollection.find(query);
             const allPostsByLikes = await cursor.toArray()
             console.log('start',allPostsByLikes.map(like=>like.likes.length).sort((a, b) => b - a));
             res.send(allPostsByLikes)
        });
       
        app.get("/postDetails/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const details = await postsCollection.findOne(query);

            res.send(details);
        });


        app.post("/addPost", async (req, res) => {
            const post = req.body;
            const result = await postsCollection.insertOne(post);
            res.send(result);
        });
        app.post("/addComment", async (req, res) => {
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        });
        app.get("/comments", async (req, res) => {
            const id = req.query.id;
            const query = { postId: id };
             const allCommnets = await commentCollection.find(query).sort({_id:-1}).toArray();
             res.send(allCommnets)
        });

        
        app.put(
            "/allPostsAddLike",

            async (req, res) => {
                const id = req.query.id;
                const like = req.body;
                console.log(like)
                const filter = { _id: ObjectId(id) };
                const post = postsCollection.find(filter)
                const option = { upsert: true };
                const updatedDoc = {
                   
                        $addToSet:{

                            likes:like,
                        }
                    
                };
                const result = await postsCollection.updateOne(
                    filter,
                    updatedDoc,
                    option
                );
                res.send(result);
            }
        );
        app.put(
            "/allPostsAddDisLike",

            async (req, res) => {
                const id = req.query.id;
                const like = req.body;
                console.log(like)
                const filter = { _id: ObjectId(id) };
                const post = postsCollection.find(filter)
                const option = { upsert: true };
                const updatedDoc = {
                   
                        $addToSet:{

                            dislikes:like,
                        }
                    
                };
                const result = await postsCollection.updateOne(
                    filter,
                    updatedDoc,
                    option
                );
                res.send(result);
            }
        );

        app.put(
            "/allPostsRemoveLike",

            async (req, res) => {
                const id = req.query.id;
                // const {email} = req.body;
                const like = req.body;
                console.log(like)
                const filter = { _id: ObjectId(id) };
                const post = await postsCollection.findOne(filter)
                // const [a] = post.likes.filter(like=>like.user===email);
                // console.log(a);
                const option = { multi: true };
                const updatedDoc = {
                   
                    $pull:{

                        likes:like,
                    }
                    
                };
                const result = await postsCollection.updateOne(
                    filter,
                    updatedDoc,
                    option
                );
                res.send(result);
            }
        );
        app.put(
            "/allPostsRemoveDisLike",

            async (req, res) => {
                const id = req.query.id;
                // const {email} = req.body;
                const like = req.body;
                console.log(like)
                const filter = { _id: ObjectId(id) };
                const post = await postsCollection.findOne(filter)
                // const [a] = post.likes.filter(like=>like.user===email);
                // console.log(a);
                const option = { multi: true };
                const updatedDoc = {
                   
                    $pull:{

                        dislikes:like,
                    }
                    
                };
                const result = await postsCollection.updateOne(
                    filter,
                    updatedDoc,
                    option
                );
                res.send(result);
            }
        );
    } finally {
    }
}

run().catch((err) => console.log(err));

app.get("/", async (req, res) => {
    res.send("web media server is running");
});

app.listen(port, () =>
    console.log(`web media server is running on port ${port}`)
);
