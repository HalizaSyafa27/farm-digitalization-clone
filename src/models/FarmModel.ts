import { User } from "./UserModel";

export interface FarmModel {
    id: number;
    name: string;
    category: string;
    ownerId: number;
    createdAt: string;
    updatedAt: string;
    operators: User[];
    owner: User;
}
  