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

//KENNELS////////////////////////////////////////////////////////////////

// Create a new kennel
app.post('/api/kennels', async (req, res) => {
    const kennel = new Kennel({
    title: req.body.title,
    slogan: req.body.slogan,
    city: req.body.city,
  });
  console.log(kennel);
  try {
    await kennel.save();
    res.send(kennel);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all the kennels
app.get('/api/kennels', async (req, res) => {
  try {
    let kennels = await Kennel.find();
    res.send(kennels);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Update a kennel
app.put("/api/kennels/id=:id&title=:title&slogan=:slogan&city=:city", async (req, res) => {
  try {
    const kennel = await Kennel.findOne({
      _id: req.params.id
    });
    kennel.title = req.params.title;
    kennel.slogan = req.params.slogan;
    kennel.city = req.params.city;
    await kennel.save();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
  }
})

//Delete a kennel
app.delete("/api/kennels/:id", async (req, res) => {
  try {
    await Kennel.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


//DOGS////////////////////////////////////////////////////////////////

// Get a list of all the dogs
app.get('/api/dogs', async (req, res) => {
  try {
    let dogs = await Dog.find();
    res.send(dogs);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get list of dogs by kennel
app.get('/api/:kennelID/dogs', async (req, res) => {
  try {
    let kennel = await Kennel.find({
      _id: req.params.id
    });
    if (!kennel) {
      res.send(404);
      return;
    }
    let dogs = await Dogs.find({
      kennel: kennel
    })
    res.send(dogs);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete("/api/dogs/:id", async (req, res) => {
  try {
    await Dog.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));