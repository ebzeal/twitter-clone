import express from 'express';
// import mongoose from 'mongoose';
// import env from 'dotenv';
// import routes from './api/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// env.config();
// require('./api/models/User');

// app.use('/api/v1', routes);

// const mongoURI = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_TEST;

const port = process.env.PORT || 5000;

// mongoose
//   .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
//   .then(() => {
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
// })
// .catch(err => {
//   console.log(`db connection error ${err}`);
// });
