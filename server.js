const express = require("express");
const { main } = require("./models/index");
const productRoute = require("./router/product");
const storeRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const salesRoute = require("./router/sales");
const cors = require("cors");
const User = require("./models/users");
const Product = require("./models/Product");
const { spawn } = require("child_process"); // To run Python script

const app = express();
const PORT = 4001;
main();
app.use(express.json());
app.use(cors());

// Store API
app.use("/api/store", storeRoute);

// Products API
app.use("/api/product", productRoute);

// Purchase API
app.use("/api/purchase", purchaseRoute);

// Sales API
app.use("/api/sales", salesRoute);

// ARIMA API
app.post("/api/arima", (req, res) => {
  // Assuming sales data is passed in the request body
  const salesData = req.body.salesData;

  // Spawn Python process to run the ARIMA model
  const pythonProcess = spawn("python", ["arima_model.py", JSON.stringify(salesData)]);

  // Capture the output from Python script
  pythonProcess.stdout.on("data", (data) => {
    try {
      const forecast = JSON.parse(data.toString());
      res.json(forecast); // Send forecasted data back to client
    } catch (err) {
      console.error("Error parsing Python output", err);
      res.status(500).send("Error processing forecast");
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`);
    res.status(500).send("Python script error");
  });

  pythonProcess.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}`);
      res.status(500).send("Python script failed");
    }
  });
});

// ------------- Signin --------------
let userAuthCheck;
app.post("/api/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (user) {
      res.send(user);
      userAuthCheck = user;
    } else {
      res.status(401).send("Invalid Credentials");
      userAuthCheck = null;
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Getting User Details of login user
app.get("/api/login", (req, res) => {
  res.send(userAuthCheck);
});

// Registration API
app.post("/api/register", (req, res) => {
  let registerUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    imageUrl: req.body.imageUrl,
  });

  registerUser
    .save()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => console.log("Signup: ", err));
});

app.get("/testget", async (req, res) => {
  const result = await Product.findOne({ _id: "6429979b2e5434138eda1564" });
  res.json(result);
});

// Here we are listening to the server
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
