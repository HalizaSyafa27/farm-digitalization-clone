import React from 'react';
import styles from '@/components/ui/StatisticsLivestockSold/StatisticsLivestockSold.module.css';
import { LivestockSold } from '@/models/LivestockModel';
import useFetch from "@/hooks/useFetch";

type StatisticLivestockSoldProps = {
    filterBy: 'year' | 'month';
    filterValue: number | string;
    livestockSold?: LivestockSold;
};

const StatisticsLivestockSold: React.FC<StatisticLivestockSoldProps> = ({ 
  filterBy, 
  filterValue, 
  livestockSold
}) => {
    // Fetch data ternak berdasarkan ID
    // const { data: livestock, loading, error } = useFetch<Livestock>(
    //     `${process.env.NEXT_PUBLIC_API_HOST}/livestocks/${livestockId}`
    // );

    // if (loading) return <p>Loading...</p>;
    // if (error || !livestock) return <p>Error: Data tidak ditemukan.</p>;

    // // Pastikan ternak memiliki status "terjual"
    // if (livestock.status !== "terjual" || !livestock.livestockSold) {
    //     return <p>Tidak ada data penjualan untuk ternak ini.</p>;
    // }
    if(!livestockSold){
        return (
            <div className={styles.container}>
              <div className={styles.title}>
                <h3>Ternak Terjual</h3>
              </div>
              <p className={styles.errorMessage}>Data ternak terjual tidak tersedia.</p>
            </div>
          );
    }

    // Filter data statistik berdasarkan tahun atau bulan
    const filteredData = 
    livestockSold.yearlyDatas.flatMap((item) => {
        if (filterBy === 'year' && item.year === filterValue) {
            return item.monthlyDatas;
        }
        if (filterBy === 'month') {
            return item.monthlyDatas.filter((data) => data.month === filterValue);
        }
        return [];
    });

    // Hitung rata-rata
    const average =
        filteredData.reduce((acc, cur) => acc + cur.value, 0) / filteredData.length || 0;

    // Bulan dengan nilai minimum dan maksimum
    const minMonth =
        filteredData.reduce(
            (prev, cur) => (cur.value < prev.value ? cur : prev),
            filteredData[0] || { month: '-', value: Infinity }
        ).month || '-';

    const maxMonth =
        filteredData.reduce(
            (prev, cur) => (cur.value > prev.value ? cur : prev),
            filteredData[0] || { month: '-', value: -Infinity }
        ).month || '-';

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h3>Hasil Jual Ternak</h3>
            </div>

            <div className={styles.header}>
                <div>
                    <h1>{average} Ekor</h1>
                    <p>Rata-rata/bulan</p>
                </div>
                <div>
                    <p>Hasil jual ternak paling sedikit</p>
                    <h4 className={styles.minMonth}>{minMonth}</h4>
                </div>
                <div>
                    <p>Hasil jual ternak paling banyak</p>
                    <h4 className={styles.maxMonth}>{maxMonth}</h4>
                </div>
            </div>

            <div className={styles.chartContainer}>
                <div className={styles.yAxis}>
                    {[1000, 750, 500, 250, 0].map((value, index) => (
                        <p key={index} className={styles.yAxisLabel}>{value}</p>
                    ))}
                </div>

                <div className={styles.chart}>
                    {filteredData.map((data, index) => (
                        <div key={index} className={styles.barContainer}>
                        {/* Green Bar */}
                        <div
                        className={styles.greenBar}
                        style={{ height: `min(25%, ${(data.value / 4000) * 100}%)`, width: '41px', maxHeight: '30%' }}
                        ></div>
                        {/* Bar */}
                        <div
                        className={styles.bar}
                        style={{ height: `${(data.value / 4000) * 100}%` }}
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

export default StatisticsLivestockSold;
