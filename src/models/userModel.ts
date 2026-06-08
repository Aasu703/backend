import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document { // Extending Document gives us access to Mongoose document methods and properties

  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({ // Using the IUser interface to type the schema fields
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});




export const UserModel = model<IUser>('User', userSchema); 
// why 'User' and not 'Users'? Because Mongoose will automatically pluralize the collection name to 'users'
//  when it creates the collection in MongoDB. 
// This is a convention in Mongoose where the model name is singular and the collection name is plural.