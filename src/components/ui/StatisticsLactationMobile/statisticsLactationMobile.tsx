import React from 'react';
import styles from '@/components/ui/StatisticsLactationMobile/StatisticsLactation.module.css';
import { LactationData } from '@/models/LivestockModel';
import { Livestock } from '@/models/LivestockModel';
import { useRouter } from 'next/navigation'

type StatisticLactationMobileProps = {
  filterBy: 'year' | 'month';
  filterValue: number | string;
  lactationData?: LactationData;
  livestock?: Livestock;
};

const StatisticsLactationMobile: React.FC<StatisticLactationMobileProps> = ({
  filterBy,
  filterValue,
  lactationData,
  livestock
}) => {
  // Ensure lactationData exists before accessing its properties
  const filteredData =
    lactationData?.yearlyDatas?.flatMap((item) => {
      if (filterBy === 'year' && item.year === filterValue) {
        return item.monthlyDatas;
      }

      return [];
    }) || [];


  const average =
    filteredData.reduce((acc, cur) => acc + cur.value, 0) / filteredData.length || 0;

      const router = useRouter();
    
      const getPageUrl = () => {
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
        return "/defaultView/[id]/lactation";
      };
    
      const handleNavigate = () => {
        console.log('testnavigate')
        if (livestock?.name_id) {
          const pageUrl = getPageUrl(); // Call getPageUrl
          const dynamicUrl = pageUrl.replace('[id]', `${livestock.id}`);
          console.log(dynamicUrl)
          router.push(dynamicUrl);
          
        }
      };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h3>Hasil Laktasi</h3>
      </div>

      <div className={styles.header}>
        <div>
          <h1>{average} Pedet</h1>
          <p>Rata-rata/bulan</p>
        </div>

        <div className={styles.action}>
        <img className='editIcon' src="/edit.svg" alt="Edit" width={29} height={29} onClick={handleNavigate} />
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.yAxis}>
          {[1000,750, 500, 250, 0].map((value, index) => (
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

export default StatisticsLactationMobile;
