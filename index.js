import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import routes from './api/routes';

const app = express();

env.config();
const swaggerDocument = YAML.load('swagger.yaml');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 5000;

app.use('/api/v1', routes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

export default app;
