require('./config/db.js');
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { exec } = require('child_process');
const errorHandlingMiddleware = require('./middlewares/globalErrorHandling');

// Import routes Endpoints
const carRouter = require('./routes/car');
const userRouter = require('./routes/user');
// const reviewRouter = require('./routes/review');
const productRouter = require('./routes/product');
const feedbackRouter = require('./routes/feedback');

const app = express();

app.use(cors());
app.use(express.json());

// Routes Endpoints
app.use(carRouter);
app.use(userRouter);
// app.use(reviewRouter);
app.use(productRouter);
app.use(feedbackRouter);

// Error handling middleware
app.use(errorHandlingMiddleware);

// Execute the shell command to start the MongoDB server
command = process.env.Command_to_Run_Database
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Error: ${stderr}`);
        return;
    }
    console.log(`Server started: ${stdout}`);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});