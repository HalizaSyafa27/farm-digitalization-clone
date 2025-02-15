import { LactationData, MilkOutput } from "./LivestockModel";

export interface StatisticsModel {
    summary: {
        total: number;
        totalMale: number;
        totalFemale: number;
        malePhaseStats: Record<string, any>;
        femalePhaseStats: Record<string, any>;
        livestockConditionStats: Record<string, number>;
    }
    lactationData: LactationData;
    milkOutput: MilkOutput;
}
