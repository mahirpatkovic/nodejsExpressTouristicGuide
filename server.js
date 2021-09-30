const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION, Shutting down');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const dB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(
        dB,
        // process.env.DATABASE_LOCAL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
        // (err) => {
        //     if (err) throw err;
        // }
    )
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION, Shutting down');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
