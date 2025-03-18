import { gql } from '@apollo/client';

// Query to get the currently authenticated user (me query)
export const GET_ME = gql`
  query {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
      }
      bookCount
    }
  }
`;

// Query to get a single user by id or username
export const GET_SINGLE_USER = gql`
  query GetSingleUser($id: ID, $username: String) {
    getSingleUser(id: $id, username: $username) {
      _id
      username
      email
      savedBooks {
        bookId
        title
      }
      bookCount
    }
  }
`;

// Mutation to log in a user
export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Mutation to create a new user
export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Mutation to save a book for the user
export const SAVE_BOOK = gql`
  mutation SaveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
      _id
      username
      savedBooks {
        bookId
        title
      }
      bookCount
    }
  }
`;

// Mutation to delete a book from the user's savedBooks
export const DELETE_BOOK = gql`
  mutation DeleteBook($bookId: ID!) {
    deleteBook(bookId: $bookId) {
      _id
      username
      savedBooks {
        bookId
        title
      }
      bookCount
    }
  }
`;
