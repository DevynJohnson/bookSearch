import express from 'express';
import path from 'path';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import { fileURLToPath } from 'url';
// import routes from './routes/index.js';
import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer ({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  
  app.use(cors({
  origin: ['http://localhost:3000', 'https://your-deployed-frontend.com'],
  credentials: true, // Allows sending cookies or authentication headers
  }));
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => {
    const { user } = authenticateToken({ req });
    return { user }; // Pass user to resolvers
  }
}));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
}
);

// app.use(routes);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
  console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});
};

startApolloServer();
