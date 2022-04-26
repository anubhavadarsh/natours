const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION ! 🔥 Shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successfull!'));

const app = require('./app');

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log('listening to port', port);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🔥 Shutting down');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
