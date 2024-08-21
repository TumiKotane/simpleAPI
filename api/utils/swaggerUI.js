const swaggerjsdoc = require('swagger-jsdoc');
// Swagger Documentation settings
const options = {
  definition:{
    openapi: "3.0.0",
    info: {
      title: "Social Media API",
      version: "1.0.0",
      description: "This is an API for a social media platform",
      contact: { name: "Malachi", email: "ntuthuko93dlamini@gmail.com" },
    },
    servers: [{ url: 'http://localhost:3001/api/v1' }],    
  },
  apis: ["./routes/*.js"],
};
const swag = swaggerjsdoc(options);

module.exports = swag;