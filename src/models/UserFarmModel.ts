export interface UserFarm {
    id: string;
    role: "OWNER" | "OPERATOR"; // Enum values
    user_id: string; // Foreign key to User
    farm_id: string; // Foreign key to Farm
}
  