import React from 'react';
import styles from '@/components/ui/StatisticsLactation/StatisticsLactation.module.css';
import { LactationData } from '@/models/LivestockModel';

type StatisticMilkProps = {
  filterBy: 'year' | 'month';
  filterValue: number | string;
  lactationData?: LactationData;
};

const StatisticsLactation: React.FC<StatisticMilkProps> = ({
  filterBy,
  filterValue,
  lactationData,
}) => {
  // Ensure lactationData exists before accessing its properties
  const filteredData =
  lactationData?.yearlyDatas?.length
    ? lactationData.yearlyDatas.flatMap((item) =>
        item.year === filterValue ? item.monthlyDatas || [] : []
      )
    : [];



  // Calculate the average, ensuring there is data to calculate from
  const average =
    filteredData.reduce((acc, cur) => acc + cur.value, 0) / filteredData.length || 0;

  return (
    <div className={styles.container}>
      <div className={styles.tittle}>
        <h3>Hasil Laktasi</h3>
      </div>

      <div className={styles.header}>
        <div>
          <h1>{average} Pedet</h1>
          <p>Rata-rata/bulan</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.yAxis}>
          {[1000, 750, 500, 250, 100, 0].map((value, index) => (
            <p key={index} className={styles.yAxisLabel}>
              {value}
            </p>
          ))}
        </div>

        <div className={styles.chart}>
          {filteredData.map((data, index) => (
            <div key={index} className={styles.barContainer}>
              {/* Bar hijau */}
              <div
                className={styles.greenBar}
                style={{ height: `${(data.value / 20000) * 100}%`, width: '41px' }}
              ></div>
              {/* Batang grafik */}
              <div
                className={styles.bar}
                style={{ height: `${(data.value / 20000) * 100}%` }}
              ></div>
              <p className={styles.month}>{data.month}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}></div>
    </div>
  );
};

export default StatisticsLactation;
