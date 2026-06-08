import { z } from 'zod';

export const AuthSchema = z.object({
  email: z.string().email({ message: "Invalid email address format" }),
  passwordPlain: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export type AuthInputDto = z.infer<typeof AuthSchema>;

export interface AuthPayloadDto {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface GraphQLContext {
  currentUser: { id: string } | null;
}