const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/doggos', {
  useNewUrlParser: true
});

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Create a Kennel model
const kennelSchema = new mongoose.Schema({
  title: String,
  path: String,
  slogan: String,
  city: String,
});
const Kennel = mongoose.model('Kennel', kennelSchema);

// Create a Dog model
const dogSchema = new mongoose.Schema({
  kennel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Kennel'
  },
  name: String,
  path: String, 
  age: Number,
  breed: String,
});
const Dog = mongoose.model('Dog', dogSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/kennels', async (req, res) => {
  const kennel = new Kennel({
    title: req.body.title,
    path: req.body.path,
    slogan: req.body.slogan,
    city: req.body.city,
  });
  try {
    await kennel.save();
    res.send(kennel);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


// Get a list of all of the items in the museum.
app.get('/api/kennels', async (req, res) => {
  try {
    let kennels = await Kennel.find();
    res.send(kennels);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    await Item.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

app.put("/api/items/id=:id&title=:title&desc=:desc", async (req, res) => {
  try {
    const item = await Item.findOne({_id: req.params.id});
    item.title = req.params.title;
    item.desc = req.params.desc;
    await item.save();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
  }
})

app.listen(3000, () => console.log('Server listening on port 3000!'));