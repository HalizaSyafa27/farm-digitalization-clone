import React from 'react';
import styles from '@/components/ui/StatisticsLactationMobile/StatisticsLactation.module.css';
import { LactationData } from '@/models/LivestockModel';
import { Livestock } from '@/models/LivestockModel';
import { useRouter } from 'next/navigation'
import { Lactation } from '@/models/LactationModel';

type StatisticLactationMobileProps = {
  filterBy: 'year' | 'month';
  filterValue: number | string;
  lactations?: Lactation[];
  livestock?: Livestock;
};

const StatisticsLactationMobile: React.FC<StatisticLactationMobileProps> = ({
  filterBy,
  filterValue,
  lactations,
  livestock
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
          <h1>{isNaN(average) ? 0 : average} Pedet</h1>
          <p>Rata-rata/tahun</p>
        </div>

        <div className={styles.action}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          onClick={handleNavigate} 
          style={{ cursor: "pointer" }} 
        >
          <path d="M22.1808 2.60291C21.6784 2.10057 20.997 1.81836 20.2865 1.81836C19.576 1.81836 18.8946 2.10057 18.3922 2.60291L17.2113 3.78379L20.9999 7.57241L22.1808 6.39153C22.6831 5.8891 22.9653 5.20771 22.9653 4.49722C22.9653 3.78674 22.6831 3.10534 22.1808 2.60291ZM19.917 8.65531L16.1284 4.86669L7.55503 13.4401C6.92514 14.0696 6.46211 14.8463 6.20779 15.6998L5.39127 18.4402C5.35185 18.5724 5.34891 18.7129 5.38277 18.8466C5.41662 18.9804 5.486 19.1026 5.58358 19.2001C5.68115 19.2977 5.80329 19.3671 5.93707 19.4009C6.07085 19.4348 6.21129 19.4319 6.34353 19.3924L9.08395 18.5759C9.93743 18.3216 10.7141 17.8586 11.3436 17.2287L19.917 8.65531Z" fill="#248543"/>
          <path d="M5.3627 5.64453C4.55063 5.64453 3.77182 5.96713 3.1976 6.54135C2.62338 7.11557 2.30078 7.89438 2.30078 8.70645V19.4232C2.30078 20.2352 2.62338 21.014 3.1976 21.5883C3.77182 22.1625 4.55063 22.4851 5.3627 22.4851H16.0794C16.8915 22.4851 17.6703 22.1625 18.2445 21.5883C18.8187 21.014 19.1413 20.2352 19.1413 19.4232V14.0648C19.1413 13.8618 19.0607 13.6671 18.9171 13.5235C18.7736 13.38 18.5789 13.2993 18.3759 13.2993C18.1728 13.2993 17.9781 13.38 17.8346 13.5235C17.691 13.6671 17.6104 13.8618 17.6104 14.0648V19.4232C17.6104 19.8292 17.4491 20.2186 17.162 20.5057C16.8749 20.7928 16.4855 20.9541 16.0794 20.9541H5.3627C4.95666 20.9541 4.56726 20.7928 4.28015 20.5057C3.99304 20.2186 3.83174 19.8292 3.83174 19.4232V8.70645C3.83174 8.30041 3.99304 7.91101 4.28015 7.6239C4.56726 7.33679 4.95666 7.17549 5.3627 7.17549H10.7211C10.9241 7.17549 11.1188 7.09484 11.2623 6.95129C11.4059 6.80773 11.4865 6.61303 11.4865 6.41001C11.4865 6.20699 11.4059 6.01229 11.2623 5.86873C11.1188 5.72518 10.9241 5.64453 10.7211 5.64453H5.3627Z" fill="#248543"/>
        </svg>

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
                  style={{ height: `min(200px, ${(details.totalChild / 40) * 100}%)`, width: '41px', maxHeight: '25%'}}
                ></div>
                {/* Batang grafik */}
                <div
                  className={styles.bar}
                  style={{ height: `${(details.totalChild / 40) * 100}%` }}
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

export default StatisticsLactationMobile;
