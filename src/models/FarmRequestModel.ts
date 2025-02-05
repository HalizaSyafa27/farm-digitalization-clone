import { FarmModel } from "./FarmModel";
import { User } from "./UserModel";

export interface FarmRequestModel {
    id: number;
    status: string;
    farmId: number;
    operatorId: number;
    createdAt: string;
    updatedAt: string;
    farm: FarmModel;
    operator: User;
}