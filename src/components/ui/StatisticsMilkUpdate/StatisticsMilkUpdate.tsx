import React from 'react';
import styles from '@/components/ui/StatisticsMilkUpdate/StatisticsMilkUpdate.module.css';
import { MilkOutput } from '@/models/LivestockModel';
import PerbaruiButton from '@/components/ui/PerbaruiButton/PerbaruiButton';
import { useRouter } from 'next/navigation';
import { Livestock } from '@/models/LivestockModel';

interface StatisticsMilkUpdateProps {
  filterBy: 'year' | 'month';
  filterValue: number | string;
  milkOutput?: MilkOutput;
  livestock?: Livestock;
}

const StatisticsMilkUpdate: React.FC<StatisticsMilkUpdateProps> = ({
  filterBy,
  filterValue,
  milkOutput,
  livestock,
}) => {
  // Ensure that milkOutput and livestock exist before accessing their properties
  const filteredData =
    milkOutput?.yearlyDatas?.flatMap((item) => {
      if (filterBy === 'year' && item.year === filterValue) {
        return item.monthlyDatas;
      }
      if (filterBy === 'month') {
        return item.monthlyDatas.filter((data) => data.month === filterValue);
      }
      return [];
    }) || [];

  // Calculate the average, ensuring there is data to calculate from
  const average =
    filteredData.reduce((acc, cur) => acc + cur.value, 0) / filteredData.length || 0;

  const router = useRouter();

  const getPageUrl = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    return '/defaultView/[id]/milkProduction';
  };

  const handleNavigate = () => {
    // Check if livestock and its name_id are defined
    if (livestock?.name_id) {
      const pageUrl = getPageUrl(); // Call getPageUrl
      const dynamicUrl = pageUrl.replace('[id]', `${livestock.id}`);
      router.push(dynamicUrl);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tittle}>
        <h3>Hasil Susu</h3>
      </div>

      <div className={styles.header}>
        <div>
          <h1>{average} liter</h1>
          <p>Rata-rata/bulan</p>
        </div>

        <div className={styles.action}>
          <PerbaruiButton label="Perbarui" onClick={handleNavigate} />
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.yAxis}>
          {[1000, 750, 500, 250, 0].map((value, index) => (
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
                style={{ height: `${(data.value / 1000) * 100}%`, width: '41px' }}
              ></div>
              {/* Batang grafik */}
              <div
                className={styles.bar}
                style={{ height: `${(data.value / 1000) * 100}%` }}
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

export default StatisticsMilkUpdate;
