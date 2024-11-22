const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
let passport = require("passport");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const methodOverride = require('method-override');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/message.js'); // Add this line

// dot env config
dotenv.config();
const app = express();
const host = "localhost";
const port = 3000;
const url = process.env.DATABASE_URL;

//Socket.io config
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

mongoose
  .connect(url)
  .then(() => {
    server.listen(port, host, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => console.log(err.message));

// Set up session middleware before socket.io
const sessionMiddleware = session({
  secret: "tvfeirf90aeu9eroejfoefj",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: url }),
  cookie: { maxAge: 60 * 60 * 1000 },
});

app.use(sessionMiddleware);

// Share session middleware with socket.io
io.engine.use(sessionMiddleware);

app.use(flash());

app.use((req, res, next) => {
  res.locals.errorMessages = req.flash("error");
  res.locals.successMessages = req.flash("success");
  next();
});

app.use(passport.authenticate("session"));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(methodOverride('_method'));


app.get("/", (req, res) => {
  let authenticated = false;
  if (req.session.passport && req.session.passport.user) {
    authenticated = true;
  }
  res.render("index", { authenticated: authenticated });
});

app.get("/login", (req, res) => {
  // Gets back the login page
  res.render("index");
});

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use('/messaging', messageRoutes);

io.on('connection', (socket) => {
  // Log session data to debug
  console.log('Session data:', socket.request.session);
  
  if (socket.request.session?.passport?.user) {
    socket.userId = socket.request.session.passport.user.id;
    console.log('User ID set:', socket.userId);
  } else {
    console.log('No user found in session');
  }

  socket.on('chat message', async (data) => {
    try {
      console.log('Received message data:', data);
      console.log('Current socket.userId:', socket.userId);

      const message = new Message({
        sender: socket.request.session.passport.user.id, // Get ID directly from session
        recipient: data.recipient,
        content: data.content
      });

      const savedMessage = await message.save();
      console.log('Saved message:', savedMessage);
      
      io.emit('chat message', savedMessage);
    } catch (error) {
      console.warn('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle joining a room
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  // Handle private messages
  socket.on('private message', async (data) => {
    try {
      // Save message to database
      const message = new Message({
        sender: socket.userId,
        recipient: data.recipient,
        content: data.content
      });
      await message.save();

      // Emit to both sender and recipient
      io.to(data.recipient).emit('private message', {
        content: data.content,
        sender: socket.userId
      });
      socket.emit('private message', {
        content: data.content,
        sender: socket.userId
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
});