import User from '../models/User.js';
import { GraphQLError } from 'graphql';
import { signToken } from '../services/auth.js';

const resolvers = {
    Query: {
    // Find a user by either their unique _id or username
    getSingleUser: async (
        _: any, // Using _ as first parameter in order to ignore it as it is not used in this resolver
        { id, username }: { id?: string; username?: string }
      ) => {
        const foundUser = await User.findOne({
          $or: [{ _id: id }, { username }], // $or allows for an array of options to be passed as arguments, returning a user if either the _id or username matches
        });
  
        if (!foundUser) {
          throw new GraphQLError('Cannot find a user with this ID or username!'); // If no user is found, return an error message
        }
  
        return foundUser; // If a user is found, return the user
      },

      // Get the currently authenticated user (me query)
    me: async (_: any, __: any, context: { user: { _id: string } | null }) => {
        if (!context.user) {
          throw new GraphQLError('You must be logged in');
        }
  
        // Return the user data for the currently authenticated user
        const foundUser = await User.findById(context.user._id);
  
        if (!foundUser) {
          throw new GraphQLError("Couldn't find the authenticated user");
        }
  
        return foundUser;
      },
    },

    Mutation: {
    // Create a new user
    addUser: async (
        _: any,
        { username, email, password }: { username: string; email: string; password: string }
      ) => {

        // Check if user already exists
        const existingUser = await User
          .findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          throw new GraphQLError('User already exists!'); // If the user already exists, return an error message
        }

        const user = await User.create({ username, email, password }); // Create a new user with the passed in arguments
  
        if (!user) {
          throw new GraphQLError('Something went wrong!'); // If the user is not created, return an error message
        }
  
        const token = signToken(user.username, user.password, (user._id as string).toString()); // Sign a token with the user data
  
        return { token, user }; // Return the token and user
      },

    // Login a user
    login: async (
        _: any,
        { email, password }: { email: string; password: string }
      ) => {
        const user = await User.findOne({ $or: [{ email }, { username: email }] }); // Find a user by email or username

        if (!user) {
          throw new GraphQLError("Can't find this user!"); // If no user is found, return an error message
        }

        const correctPw = await user.isCorrectPassword(password); // Check if the password is correct

        if (!correctPw) {
          throw new GraphQLError('Wrong password!'); // If the password is incorrect, return an error message
        }

        const token = signToken(user.username, user.password, (user._id as string).toString()); // Sign a token with the user data

        return { token, user }; // Return the token and user
      },

    // Save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
  saveBook: async (_: any, { bookData }: { bookData: any }, context: any) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new GraphQLError('You need to be logged in!');
    },

    // Remove a book from `savedBooks`
    removeBook: async (_: any, { bookId }: { bookId: string }, context: any) => {
        if (context.user) {
            const updatedUser = await
            User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            return updatedUser;
        }
        throw new GraphQLError('You need to be logged in!');   
    }
    },

    User: {
        // Resolver for bookCount (calculated based on savedBooks array)
        bookCount: (parent: any) => parent.savedBooks.length,
      },
    };

export default resolvers;