require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan")
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// database connection
app.use("/uploads", express.static("uploads"));
app.use(
    express.json({
        limit: "50mb",
        type: ["application/json", "text/plain"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: false }));

// middlewares
app.use(express.json());
app.use(morgan('dev'))
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);


const port = process.env.PORT || 8080;
connection(()=>{
    app.listen(port, console.log(`Listening on port ${port}`));
});
