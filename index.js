import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import mongoose from 'mongoose';

import routes from './api/routes';

env.config();
const app = express();
const swaggerDocument = process.env.NODE_ENV === 'test' ? null : YAML.load('swagger.yaml');


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const mongoURI = process.env.NODE_ENV !== 'test' ? process.env.DATABASE_URL : process.env.DATABASE_URL_TEST;

const port = process.env.PORT || 5000;

app.use('/api/v1', routes);

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
  })
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      app.listen(port, () => {
        console.log(`Server started on port ${port}`);
      });
    }
  })
  .catch((err) => {
    console.log(`db connection error ${err}`);
  });

export default app;
