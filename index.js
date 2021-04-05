const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

app.use(cors()); //cross origin resouce access permission
app.use(bodyParser.json());

// var admin = require("firebase-admin");

var serviceAccount = require("./burj-al-arab-67d57-firebase-adminsdk-hgy8f-ccda804998.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://arabian:7GtbZZktygOziliw@cluster0.fzhcz.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const bookings = client.db("burjAlArab").collection("bookings");
  console.log("DB error", err);
  //methods
  app.post("/addBooking", (req, res) => {
    const newData = req.body;
    bookings.insertOne(newData).then((result) => {
      res.send(result.insertedCount > 0);
    });
    console.log("line 23:", newData);
  });

  app.get("/bookings", (req, res) => {
    console.log(req.headers.authorization);
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith("Bearer ")) {
      const idToken = bearer.split(" ")[1];
      console.log({ idToken });
      // idToken comes from the client app
      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email
          console.log(tokenEmail,queryEmail);
          if (tokenEmail == req.query.email) {
            bookings
              .find({ email: req.query.email })
              .toArray((err, documents) => {
                res.send(documents);
              });
          }
        })
        .catch((error) => {
          // Handle error
        });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
