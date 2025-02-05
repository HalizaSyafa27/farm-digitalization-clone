// models/PhaseLabelModel.ts
export interface PhaseLabel {
    id: string; // ID unik untuk identifikasi
    label: string; // Nama fase (Cempe, Dara, Siap Kawin, Hamil)
    color: string; // Warna background atau teks
    isActive: boolean; // Status apakah fase aktif
    enum: string;
  }
  