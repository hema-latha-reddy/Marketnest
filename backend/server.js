const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());



mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

app.get("/test", (req, res) => {
    res.send("API Working");
  });

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/uploads", express.static("uploads"));

const PORT = 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});