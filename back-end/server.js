const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// setup express
const app = express();

// setup body parser middleware to conver to JSON and handle URL encoded forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// connect to the mongodb database
mongoose.connect('mongodb://localhost:27017/doggos', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

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

// Create a Comment model
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  dog: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dog'
  },
  msg: String,
  created: {
    type: Date,
    default: Date.now
  },
});
const Comment = mongoose.model('Comment', commentSchema);


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

/* Middleware */

// middleware function to check for logged-in users
const validUser = async (req, res, next) => {
  if (!req.session.userID)
    return res.status(403).send({
      message: "not logged in"
    });
  try {
    const user = await User.findOne({
      _id: req.session.userID
    });
    if (!user) {
      return res.status(403).send({
        message: "not logged in"
      });
    }
    // set the user field in the request
    req.user = user;
  } catch (error) {
    // Return an error if user does not exist.
    return res.status(403).send({
      message: "not logged in"
    });
  }

  // if everything succeeds, move to the next middleware
  next();
};

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
    // console.log(kennels)
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
// Create a new dog
app.post('/api/dogs', async (req, res) => {
  const kennel = await Kennel.findOne({
    _id: req.body.kennelID
  });
  if (!kennel) {
    res.send(404);
    return;
  }

  const dog = new Dog({
    name: req.body.name,
    kennel: kennel,
    age: req.body.age,
    breed: req.body.breed,
    path: req.body.path,
  });
  console.log(dog);
  try {
    await dog.save();
    res.send(kennel);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Update a dog
app.put("/api/dogs/id=:id&name=:name&breed=:breed&age=:age", async (req, res) => {
  try {
    const dog = await Dog.findOne({
      _id: req.params.id
    });
    dog.name = req.params.name;
    dog.breed = req.params.breed;
    dog.age = req.params.age;
    await dog.save();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
  }
})

// Get a list of all the dogs
app.get('/api/dogs', async (req, res) => {
  try {
    let dogs = await Dog.find();
    // console.log(dogs)
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

// Find one dog by ID
app.get('/api/dogs/:id', async (req, res) => {
  try {
    let dog = await Dog.findOne({
      _id: req.params.id
    });
    res.send(dog);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete one dog
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

//COMMENTS/////////////////////////////////////////////////////////////////
// Create a new comment
app.post('/api/comments', async (req, res) => {
  console.log(req.body.dog)
  const dog = await Dog.findOne({
    _id: req.body.dog
  });
  if (!dog) {
    console.log("Can't find dog")
    res.sendStatus(404);
    return;
  }
  // const user = await User.findOne({
  //   _id: req.body.user
  // });
  // if (!user) {
  //   console.log("Can't find user!")
  //   res.sendStatus(404);
  //   return;
  // }

  const comment = new Comment({
    user: req.body.user,
    dog: dog,
    msg: req.body.msg,
  });

  console.log(comment);
  try {
    await comment.save();
    res.send(comment);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Get comments by dog
app.get('/api/comments/:id', async (req, res) => {
  try {
    let dog = await Dog.find({
      _id: req.params.id
    });
    if (!dog) {
      res.send(404);
      return;
    }
    let comments = await Comment.find({
      dog: dog
    })
    console.log(comments)
    res.send(comments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// import the users module and setup its API path
const users = require("./users.js");
app.use("/api/users", users.routes);
app.listen(3000, () => console.log('Server listening on port 3000!'));