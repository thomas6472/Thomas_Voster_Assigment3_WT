// import all dependencies needed
const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const mongoose = require("mongoose");
var bodyParser = require('body-parser');

require("dotenv").config();

// Initialize th path
let initial_path = path.join(__dirname, "public");

// Initialize path
const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

// Connect Mongoose
mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

// Create a schema for post
const post = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    banner: String
});

// Define the schema as a model
const Posts = mongoose.model('Posts', post);

// For the header of fetch
app.use(bodyParser.json({
    extended: true
}));

// Redirect to home page
app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
});

// Redirect to editor page
app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})

// upload link
app.post('/upload', (req, res) => {
    let file = req.files.image;
    let date = new Date();

    // image name
    let imagename = date.getDate() + date.getTime() + file.name;

    // image upload path
    let path = 'public/uploads/' + imagename;

    // create upload
    file.mv(path, (err, result) => {
        if (err) {
            throw err;
        } else {
            // our image upload path
            res.json(`uploads/${imagename}`);
        }
    })
})

// Create a post on the DB
app.post('/createpost', (req, res) => {

    const pst = new Posts({
    name: req.body.name,
    title: req.body.title,
    description: req.body.description,
    banner: req.body.banner
    });
    
    pst.save().then(() => console.log("One entry added"));
    res.json(200);
})

// Get data of a post on DB
app.post('/getpost', (req, res) => {
    const pst = Posts.findOne({name: req.body.name}).exec();
    pst.then(function (doc) {res.json(doc)});
})

// Get data of all posts of the DB
app.get('/getallposts', (req, res) => {
    const psts = Posts.find().exec();
    psts.then(function (doc) {res.json(doc)});
})

// Delete a post on DB
app.post('/deletepost', (req, res) => {
    Posts.deleteOne({name: req.body.name}).then(console.log("One post deleted"));
    res.json(200);
})

// Update a post on DB
app.post('/updatepost', (req, res) => {

    Posts.findOneAndUpdate({name: req.body.name}, {
            name: req.body.name,
            title: req.body.title,
            description: req.body.description,
            banner: req.body.banner
    }, {upsert: true}).then(console.log("One post updated"));
    res.json(200);
})

// Redirect to a post page
app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
})

// Redirect to page of edition of a post
app.get("/:blog/editor", (req, res) => {
    console.log("test");
    res.sendFile(path.join(initial_path, "editor.html"));
})

// Return if request fail
app.use((req, res) => {
    res.json("404");
})

// Port to listen
app.listen("3000", () => {
    console.log('listening.....');
})