'use strict';

require('dotenv').config();

const Express = require('express');
const SwaggerJSDoc = require('swagger-jsdoc');
const SwaggerTools = require('swagger-tools').initializeMiddleware;
const helmet = require('helmet');
const cors = require('cors');

const pkg = require('../package.json');
const config = require('./config');
const auth = require('./routes/auth');
const error = require('./routes/error');

const swaggerJsDoc = SwaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: pkg.name,
      version: pkg.version,
      description: pkg.description,
    },
    host: config.hostUri,
    basePath: '/',
  },
  apis: [
    'src/routes/**/*.js',
    'src/models/**/*.js', 
  ]
});

const app = Express();
app.use(helmet());
app.use(cors());

SwaggerTools(swaggerJsDoc, middleware => {
  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerSecurity(auth));
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter({
    controllers: 'src/routes',
  }));
  app.use(middleware.swaggerUi({}));
  app.use(error);
});

module.exports = app;