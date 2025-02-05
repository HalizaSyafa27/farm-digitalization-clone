// import React from 'react';
// import styles from '@/components/ui/StatisticsWeight/StatisticsWeight.module.css';
// import { statisticsWeightData } from '@/models/statisticsWeightModel';
// import { defaultWeightData, WeightData } from '@/models/LivestockModel';

// type StatisticMilkProps = {
//     filterBy: 'year' | 'month';
//     filterValue: number | string;
//     weightData?: WeightData;
// }

// const StatisticsWeight: React.FC<StatisticMilkProps> = ({ filterBy, filterValue, weightData = defaultWeightData }) => {

//     const filteredData = weightData.yearlyData.flatMap((item) => {
//         if (filterBy === 'year' && item.year === filterValue) {
//           return item.data;
//         }
//         if (filterBy === 'month') {
//           return item.data.filter((data) => data.month === filterValue);
//         }
//         return [];
//       });

//     // Hitung rata-rata
//     const average =
//     filteredData.reduce((acc, cur) => acc + cur.value, 0) / filteredData.length || 0;

//   return (
//     <div className={styles.container}>
//         <div className={styles.tittle}>
//             <h3>Berat Ternak</h3>
//         </div>

//       <div className={styles.header}>
       
//         <div>
//         <h1>{average} Kg</h1>
//         <p>Rata-rata/bulan</p>
//         </div>

//       </div>

//       <div className={styles.chartContainer}>
//         <div className={styles.yAxis}>
//             {[20000, 10000, 5000, 2500, 0].map((value, index) => (
//             <p key={index} className={styles.yAxisLabel}>
//                 {value}
//             </p>
//             ))}
//         </div>

//         <div className={styles.chart}>
//             {filteredData.map((data, index) => (
//             <div key={index} className={styles.barContainer}>
//                 {/* Bar hijau */}
//                 <div
//                 className={styles.greenBar}
//                 style={{ height: '70px', width: '41px' }} 
//                 ></div>
//                 {/* Batang grafik */}
//                 <div
//                 className={styles.bar}
//                 style={{ height: `${(data.value / 20000) * 100}%` }}
//                 ></div>
//                 <p className={styles.month}>{data.month}</p>
//             </div>
//             ))}
//         </div>
//         </div>


//       <div className={styles.footer}>
        
//       </div>
//     </div>
//   );
// };

// export default StatisticsWeight;
