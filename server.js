const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const mongoose = require("mongoose");
var bodyParser = require('body-parser');

require("dotenv").config();

let initial_path = path.join(__dirname, "public");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

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

const Posts = mongoose.model('Posts', post);

/*const pst = new Posts({
    name: "test",
    title: "test",
    description: "test"
});*/

//pst.save().then(() => console.log("One entry added"));
//Posts.deleteMany({name: "test"}).then(console.log("One entry deleted"));

app.use(bodyParser.json({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
});

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

app.post('/getpost', (req, res) => {
    const pst = Posts.findOne({name: req.body.name}).exec();
    pst.then(function (doc) {res.json(doc)});
})

app.get('/getallposts', (req, res) => {
    const psts = Posts.find().exec();
    psts.then(function (doc) {res.json(doc)});
})

app.post('/deletepost', (req, res) => {
    Posts.deleteOne({name: req.body.name}).then(console.log("One post deleted"));
    res.json(200);
})

app.post('/updatepost', (req, res) => {

    Posts.findOneAndUpdate({name: req.body.name}, {
            name: req.body.name,
            title: req.body.title,
            description: req.body.description,
            banner: req.body.banner
    }, {upsert: true}).then(console.log("One post updated"));
    res.json(200);
})

app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
})

app.get("/:blog/editor", (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})

app.use((req, res) => {
    res.json("404");
})

app.listen("3000", () => {
    console.log('listening.....');
})