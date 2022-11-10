import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/role/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ required: true })
  user_salt: string;
  @Prop({ required: true })
  name: string;
  @Prop()
  finger_register: boolean;
  @Prop()
  can_use_finger: boolean;
  @Prop()
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
