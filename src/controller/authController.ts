import { AuthService } from '../services/authServices';
import { AuthInputDto, GraphQLContext } from '../dto/authDto';
import { UnauthorizedError } from '../error/errorHandlers';

const authService = new AuthService();

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: GraphQLContext) => {
      if (!context.currentUser) {
        throw new UnauthorizedError();
      }
      return context.currentUser;
    }
  },

  Mutation: {
    register: async (_parent: any, args: AuthInputDto) => {
      return await authService.register(args);
    },
    
    login: async (_parent: any, args: AuthInputDto) => {
      return await authService.login(args);
    }
  }
};