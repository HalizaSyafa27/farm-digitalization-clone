interface LactationChild {
  id: number;
  lactationId: number;
  gender: 'Jantan' | 'Betina';
  createdAt: string;
  updatedAt: string;
}

interface LactationRecord {
  id: number;
  livestockId: number;
  spouseId: number;
  lactation_number: number;
  dob: string;
  total_child: number;
  total_male_child: number;
  total_female_child: number;
  createdAt: string;
  updatedAt: string;
  lactationChilds: LactationChild[];
}

export interface Lactation {
  livestockId: number;
  spouseId: number;
  dob: Date;
  totalChild: number;
  totalFemaleChild: number;
  totalMaleChild: number;
  lactationNumber: number;
}