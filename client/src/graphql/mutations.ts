import { gql } from '@apollo/client';

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
export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
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
export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
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
