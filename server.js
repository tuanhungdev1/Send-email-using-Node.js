const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./models/index");
const errorHandler = require("./utils/errorHandler");

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database connect success!");
  })
  .catch((err) => {
    console.log("Err: ==> " + err);
  });

app.get("/", (req, res) => {
  res.send("Home Page");
});

require("./routes/user.routes")(app);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server runing on http://localhost:${PORT}`);
});
