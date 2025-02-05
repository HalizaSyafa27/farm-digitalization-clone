import { ActivityModel } from "@/models/ActivityModel";

export const activities: ActivityModel[] = [
    {
        id: "1",
        title: "Kambing baru ditambahkan: UAC050",
        user: "Hendra Wijaya",
        timestamp: new Date("2025-01-08T08:30:00Z"),
        changes: [
            {
                what: "Fase",
                from: "Pedet",
                to: "Dara"
            }
        ],
        farm: "Peternakan Ujang"
    },
    {
        id: "2",
        title: "Pemberian vaksin untuk kambing UAC051",
        user: "Siti Nurhaliza",
        timestamp: new Date("2025-01-08T09:00:00Z"),
        changes: [
            {
                what: "Status",
                from: "Belum divaksin",
                to: "Divaksin"
            }
        ],
        farm: "Peternakan Jatidiri"
    },
    {
        id: "3",
        title: "Kambing UAC052 dipindahkan ke peternakan lain",
        user: "Joko Santoso",
        timestamp: new Date("2025-01-08T09:30:00Z"),
        changes: [
            {
                what: "Lokasi",
                from: "Peternakan Ujang",
                to: "Peternakan Jatidiri"
            }
        ],
        farm: "Peternakan Ujang"
    },
    {
        id: "4",
        title: "Pencatatan hasil ternak kambing UAC053",
        user: "Rina Dwi",
        timestamp: new Date("2025-01-08T10:00:00Z"),
        changes: [
            {
                what: "Berat badan",
                from: "10 kg",
                to: "12 kg"
            }
        ],
        farm: "Peternakan Jatidiri"
    },
    {
        id: "5",
        title: "Kambing baru ditambahkan: UAC054",
        user: "Maya Yuliana",
        timestamp: new Date("2025-01-07T15:00:00Z"),
        changes: [
            {
                what: "Fase",
                from: "Pedet",
                to: "Dara"
            }
        ],
        farm: "Peternakan Ujang"
    }
];
