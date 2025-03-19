import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import Navbar from './components/Navbar';
import { setContext } from '@apollo/client/link/context';

// Set up the GraphQL API endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:10000/graphql',
});

// Attach JWT token to each request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token'); 
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Initialize Apollo Client with authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
    <>
      <Navbar />
      <Outlet />
    </>
  </ApolloProvider>
  );
}

export default App;
