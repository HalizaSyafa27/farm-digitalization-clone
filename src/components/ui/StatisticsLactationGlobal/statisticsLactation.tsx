import React from 'react';
import styles from '@/components/ui/StatisticsLactation/StatisticsLactation.module.css';
import { LactationData } from '@/models/LivestockModel';
import { Lactation } from '@/models/LactationModel';

interface LactationStatistic {
  lactationData: Record<string, { totalChild:number}>,
  average: number
}
type StatisticLactationProps = {
  filterBy: 'year' | 'month';
  filterValue: number | string;
  lactationStatistic?: LactationStatistic;
};

const StatisticsLactation: React.FC<StatisticLactationProps> = ({
  filterBy,
  filterValue,
  lactationStatistic,
}) => {
  const average = lactationStatistic?.average ?? 0;
  
  let datas: Record<string, { totalChild : number}> = {}
  for (const key in lactationStatistic?.lactationData) {
    if (!datas[key]) {
      datas[key] = { totalChild : 0};
    }
    datas[key].totalChild += lactationStatistic?.lactationData[key].totalChild;
    console.log("totalChild: " + datas[key].totalChild)

  }

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
