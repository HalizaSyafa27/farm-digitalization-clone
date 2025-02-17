import statisticsLactationData from "./statisticsLactationModel";
import statisticsMilkOutput from "./statisticsMilkModel";
import statisticsWeightData from "./statisticsWeightModel";
import statisticsLivestockSold from "./statisticsLivestockSold";

export interface HistoryItem {
    id: string;
    title: string;
    value: string;
    conditionType: string;
    conditionId: number;
    createdAt: string;
    updatedAt: string;
}

export interface Health {
    id: number;
    current_condition: string;
    livestockId: number;
    createdAt: string;
    updatedAt: string;
    historyItems: HistoryItem[];
}

export interface Medication {
    id: number;
    current_condition: string;
    livestockId: number;
    createdAt: string;
    updatedAt: string;
    historyItems: HistoryItem[];
}

export interface Vitamin {
    id: number;
    current_condition: string;
    livestockId: number;
    createdAt: string;
    updatedAt: string;
    historyItems: HistoryItem[];
}

export interface Vaccine {
    id: number;
    current_condition: string;
    livestockId: number;
    createdAt: string;
    updatedAt: string;
    historyItems: HistoryItem[];
}

export interface MonthlyData {
    id: number;
    month: string;
    value: number;
    date: number;
    yearlyDataId: number;
    createdAt: string;
    updatedAt: string;
}

export interface YearlyData {
    id: number;
    year: number;
    conditionId: number;
    conditionType: string;
    createdAt: string;
    updatedAt: string;
    monthlyDatas: MonthlyData[];
}

export interface LactationData {
    id: number;
    livestockId: number;
    createdAt: string;
    updatedAt: string;
    yearlyDatas: YearlyData[];
}

// export const defaultLactationData: LactationData = {
//     id: 0,
//     livestockId: 0,
//     createdAt: "",
//     updatedAt: "",
//     yearlyDatas: statisticsLactationData,
// };

export interface MilkOutput {
    id: number;
    livestockId: number;
    createdAt: string;
    updatedAt: string;
    yearlyDatas: YearlyData[];
}

// export const defaultMilkOutput: MilkOutput = {
//     id: 0,
//     livestockId: 0,
//     createdAt: "",
//     updatedAt: "",
//     yearlyDatas: statisticsMilkOutput,
// };

export interface WeightData {
    id: number;
    livestockId: number;
    createdAt: string;
    updatedAt: string;
    yearlyDatas: YearlyData[];
}

// export const defaultWeightData: WeightData = {
//     yearlyData: statisticsWeightData,
// };

export interface LivestockSold {
    yearlyData: YearlyData[];
}

// export const defaultLivestockSold: LivestockSold = {
//     yearlyData: statisticsLivestockSold,
// };

export interface Livestock {
    id: number;
    name_id: string;
    gender: 'Jantan' | 'Betina';
    dob: string;
    weight: string;
    phase: string;
    photo_url: string;
    breed: string;
    category: string;
    condition: string;
    status: string;
    grade: string;
    type_id: string;
    farm_name: string;
    dad_name_id: string;
    mom_name_id: string;
    grandpa_name_id: string;
    grandma_name_id: string;
    spouse_id: string;
    farmId: number;
    createdAt: string;
    updatedAt: string;
    health: Health;
    medication: Medication;
    vitamin: Vitamin;
    vaccine: Vaccine;
    milkOutput: MilkOutput;
    lactationData: LactationData;
    weightData: WeightData;
    livestockSold?: LivestockSold;
}
