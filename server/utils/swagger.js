const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TodoOps API',
    version: '1.0.0',
    description: 'A comprehensive MERN Todo application API with Docker and Kubernetes support',
    contact: {
      name: 'TodoOps Team',
      email: 'contact@todoops.dev'
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
    {
      url: 'https://todoops-api.herokuapp.com',
      description: 'Production server',
    },
  ],
  components: {
    schemas: {
      Todo: {
        type: 'object',
        required: ['task'],
        properties: {
          _id: {
            type: 'string',
            description: 'Auto-generated MongoDB ObjectId',
            example: '507f1f77bcf86cd799439011'
          },
          task: {
            type: 'string',
            description: 'The todo task description',
            minLength: 1,
            maxLength: 500,
            example: 'Complete project documentation'
          },
          isCompleted: {
            type: 'boolean',
            description: 'Completion status of the todo',
            default: false,
            example: false
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the todo was created',
            example: '2023-12-01T10:00:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the todo was last updated',
            example: '2023-12-01T10:30:00.000Z'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          errorMessage: {
            type: 'string',
            description: 'Error message',
            example: 'Task not found'
          }
        }
      },
      ValidationError: {
        type: 'object',
        properties: {
          errorMessage: {
            type: 'string',
            example: 'Validation failed'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                msg: { type: 'string' },
                param: { type: 'string' },
                location: { type: 'string' }
              }
            }
          }
        }
      }
    },
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API key for authentication (future implementation)'
      }
    }
  },
  security: [
    {
      ApiKeyAuth: []
    }
  ]
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './controllers/*.js'], // Paths to files containing OpenAPI definitions
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };