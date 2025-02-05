import { FarmModel } from "./FarmModel";

export interface User {
    id: string;
    email: string;
    name: string;
    profile_url: string;
    last_time_online: string;
    owned_farms: string[];
    operated_farms: string[];
}
  