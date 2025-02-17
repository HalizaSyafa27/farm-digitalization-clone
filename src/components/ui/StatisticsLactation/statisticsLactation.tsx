import React from 'react';
import styles from '@/components/ui/StatisticsLactation/StatisticsLactation.module.css';
import { LactationData } from '@/models/LivestockModel';
import { Lactation } from '@/models/LactationModel';

type StatisticLactationProps = {
  filterBy: 'year' | 'month';
  filterValue: number | string;
  lactations?: Lactation[];
};

const StatisticsLactation: React.FC<StatisticLactationProps> = ({
  filterBy,
  filterValue,
  lactations,
}) => {
  // Get record dari month and totalChild
  const datas: Record<string, { totalChild: number }> = (lactations ?? []).reduce((acc, lactation) => {
    console.log(lactation.dob)
    console.log(lactation.totalFemaleChild)
    const dob = new Date(lactation.dob);
    // const key = String(dob.toLocaleString('default', { month: 'short' })) // Format : "MMM"
    const key = String(dob.getFullYear()) // Format : "YYYY"
    console.log(key)
    if (!acc[key]) {
      acc[key] = { totalChild: 0 };
    }
    acc[key].totalChild += (lactation.totalChild);
    console.log("total: " + acc[key].totalChild + "expected +" + lactation.totalChild)
    return acc;
  }, {} as Record<string, { totalChild: number }>);

  let totalYears = 0;
  let totalChildren = 0;
  for (const key in datas) {
    console.log(key + " " + datas[key].totalChild)
    totalYears++;
    totalChildren += datas[key]?.totalChild;
  }

  const average = Number(totalChildren / totalYears) ?? 0;

  return (
    <div className={styles.container}>
      <div className={styles.tittle}>
        <h3>Hasil Laktasi</h3>
      </div>

      <div className={styles.header}>
        <div>
          <h1>{isNaN(average) ? 0 : average} Pedet</h1>
          <p>Rata-rata/tahun</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.yAxis}>
          {[10, 8, 6, 4, 2, 0].map((value, index) => (
            <p key={index} className={styles.yAxisLabel}>
              {value}
            </p>
          ))}
        </div>

        <div className={styles.chart}>
          {
            Object.entries(datas).map(([year, details]) => (
              <div key={year} className={styles.barContainer}>
                {/* Batang Hijau */}
                <div
                  className={styles.greenBar}
                  style={{ height: `${(details.totalChild / 50) * 100}%`, width: '41px' }}
                ></div>
                {/* Batang grafik */}
                <div
                  className={styles.bar}
                  style={{ height: `${(details.totalChild / 50) * 100}%` }}
                ></div>
                <p className={styles.month}>{year}</p>
              </div>
            ))
          }
        </div>
      </div>

      <div className={styles.footer}></div>
    </div>
  );
};

export default StatisticsLactation;
