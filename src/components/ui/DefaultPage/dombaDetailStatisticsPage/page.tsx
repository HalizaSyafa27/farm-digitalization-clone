'use client'

import React, { useEffect, useState } from 'react';

import YearAndMonthPicker from '@/components/ui/YearAndMonthPicker/yearAndMonthPicker';
import Sidebar from '@/components/ui/Sidebar/sidebar';
import Breadcrumbs from '@/components/ui/Breadcrumbs/breadcrumbs';
import DetailLivestockFemaleCard from '@/components/ui/DetailLivestockFemaleCard/DetailLivestockFemaleCard';
import livestockCategories from '@/models/DetaillivestockFemaleCategories';
import DetailLivestockMaleCard from '@/components/ui/DetailLivestockMaleCard/DetailLivestockMaleCard';
import detaillivestockMaleCategories from '@/models/DetaillivestockMaleCategories';
import DetailLivestockDiagnosedCard from '@/components/ui/DetailLivestockDiagnosedCard/DetailLivestockDiagnosedCard';
import livestockDiagnosedCategories from '@/models/DetaillivestockDiagnosedCategories';
import StatisticsMilkUpdate from '@/components/ui/StatisticsMilkUpdate/StatisticsMilkUpdate';
import StatisticsLactation from '@/components/ui/StatisticsLactation/statisticsLactation';
import TopBar from '@/components/ui/TopBar/topBar';
import { getCookie } from '@/lib/cookies';
import useFetch from '@/hooks/useFetch';
import { FarmModel } from '@/models/FarmModel';
import { StatisticsModel } from '@/models/FarmStatsModel';
import StatisticsMilk from '../../StatisticsMilk/statisticsMilk';
// import StatisticsLivestockSold from '@/components/ui/StatisticsLivestockSold/StatisticsLivestockSold';

const App: React.FC = () => {

  const storedId = getCookie("id"); 

  const { data: farmData, loading: loadingFarms, error: errorFarms } = useFetch<FarmModel[]>(
      `${process.env.NEXT_PUBLIC_API_HOST}/farms?ownerId=${storedId}`,
  );
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  useEffect(() => {
      if (farmData && farmData.length > 0) {
          setSelectedFarm(farmData[0].name);
          setSelectedFarmId(farmData[0].id);
      }
  }, [farmData]);

  const handleFarmChange = (farmName: string, farmId: number) => {
    setSelectedFarm(farmName);
    setSelectedFarmId(farmId);
  };

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data: sheepStatistics, loading: loadingSheepStatistics, error: errorSheepStatistics } = useFetch<StatisticsModel>(
      `${process.env.NEXT_PUBLIC_API_HOST}/statistics/sheep-statistics?farmId=${selectedFarmId}`
  );

    return (
    <div className="layout">
      <div className="sidebar">
        <Sidebar 
          setBreadcrumb={function (label: string): void {
              throw new Error('Function not implemented.');
          }} 
          farmList={farmData == null ? [] : farmData}
          setFarm={handleFarmChange}
          selectedFarm={selectedFarm}
      />
      </div>

      <div className="main-content">
        <TopBar ></TopBar>
       
        <div className="content">
        <div className="menuSection">
          <div>
          <Breadcrumbs
            breadcrumbs={[
              { label: 'Peternakan Widjaya', href: '/OwnerViewPage' },
              { label: 'Statistik', href: '/OwnerViewPage' },
              { label: 'Domba', href: '/OwnerViewPage/detailStatisticsPage/dombaDetailStatisticsPage' },
            ]}
          />
          </div>

          <div className="menuHeader">
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="130" height="86" viewBox="0 0 130 86" fill="none">
              <path d="M112.413 27.7802C122.696 25.8788 126.183 19.9124 128.81 13.297C129.976 10.3613 126.607 7.27323 123.777 8.67606C123.427 8.84996 123.048 8.96091 122.659 9.00386L103.95 11.0682C102.601 11.2172 101.314 11.7215 100.223 12.5298L97.3924 14.6266C95.8433 15.774 94.7827 17.4623 94.4212 19.3559L92.96 27.0113C92.7821 27.9433 92.4138 28.8438 91.9423 29.6671C87.1992 37.9494 98.3471 28.2247 104.209 28.6269C107.18 28.8308 107.574 28.6749 112.413 27.7802Z" fill="#A36627"/>
              <path d="M17.2556 27.7802C6.97243 25.8788 3.48495 19.9124 0.858007 13.297C-0.307735 10.3613 3.06092 7.27323 5.89098 8.67606C6.24181 8.84996 6.62044 8.96091 7.00964 9.00386L25.7179 11.0682C27.0678 11.2172 28.3539 11.7215 29.4452 12.5298L32.2759 14.6266C33.825 15.774 34.8857 17.4623 35.2471 19.3559L36.7084 27.0113C36.8862 27.9433 37.2546 28.8438 37.7261 29.6671C42.4691 37.9494 31.3212 28.2247 25.4592 28.6269C22.4886 28.8308 22.094 28.6749 17.2556 27.7802Z" fill="#A36627"/>
              <path d="M58.4261 0.341692C44.4142 -1.83236 32.3393 10.2587 34.5321 24.2677L40.6152 63.1304C41.4049 68.1753 43.9554 72.5635 47.5814 75.7084C49.405 71.6883 53.4537 68.8921 58.1554 68.8921H71.6413C76.3707 68.8921 80.4393 71.7212 82.2472 75.7793C85.9732 72.5812 88.5777 68.0786 89.3298 62.9041L94.9912 23.9537C97.0153 10.0275 84.9985 -1.8899 71.0896 0.249877L67.6308 0.781996C65.512 1.10795 63.3558 1.10657 61.2374 0.777891L58.4261 0.341692Z" fill="#E0B87D"/>
              <rect x="47.8516" y="67.041" width="34.7575" height="18.9586" rx="9.47931" fill="#E0B87D"/>
              <path d="M92.1386 38.1701C94.4053 34.7026 92.6001 31.7324 90.3439 29.8278C88.4955 28.2674 86.0313 29.5537 85.4618 32.0504C83.6696 39.9073 84.1487 48.4653 92.1386 38.1701Z" fill="#642C07"/>
              <path d="M36.7364 38.1701C34.4697 34.7026 36.2749 31.7324 38.5311 29.8278C40.3795 28.2674 42.8437 29.5537 43.4132 32.0504C45.2054 39.9073 44.7263 48.4653 36.7364 38.1701Z" fill="#642C07"/>
              <path d="M68.2662 74.4058C67.3918 77.4585 63.0658 77.4587 62.1911 74.4061L61.1218 70.6747C60.9943 70.2298 60.7706 69.8183 60.4665 69.4694L58.2078 66.8771C55.9398 64.2741 58.8926 60.4399 61.9885 61.9678L63.83 62.8766C64.7114 63.3117 65.7452 63.3117 66.6267 62.8767L68.4686 61.9678C71.5646 60.4399 74.5173 64.2744 72.2491 66.8772L69.9903 69.4692C69.6861 69.8182 69.4623 70.2299 69.3348 70.675L68.2662 74.4058Z" fill="white"/>
              <path d="M52.5898 75.5287C57.2566 77.9314 61.0159 78.5321 62.3122 78.5321C70.8679 79.333 76.2476 76.8635 77.868 75.5287H52.5898Z" fill="white"/>
              <path d="M52.8335 23.8119C50.5758 17.9993 57.4405 12.9283 62.3327 16.7947L62.6486 17.0443C64.78 18.7288 67.8098 18.653 69.8543 16.8641C74.2065 13.0559 80.786 17.4902 78.8897 22.9535L72.9027 40.2017C71.8902 43.1185 69.1414 45.0741 66.0538 45.0741C63.0629 45.0741 60.379 43.2373 59.296 40.4493L52.8335 23.8119Z" fill="white"/>
            </svg>
            </div>
            <h1 className="menuTittle">Domba</h1>
            <div className="yearAndMonthPicker">
              <YearAndMonthPicker selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
            </div>
          </div>

          <div className="dombaDetailStatisticsCard">
            <div className="dombaFemaleCardStatisticsCard">
                  <DetailLivestockFemaleCard
                  title="Domba Betina"
                  total={sheepStatistics?.summary.totalFemale ?? 0}
                  cempe={sheepStatistics?.summary.femalePhaseStats?.["Cempe"] ?? 0}
                  dara={sheepStatistics?.summary.femalePhaseStats?.["Dara"] ?? 0}
                  siapKawin={sheepStatistics?.summary.femalePhaseStats?.["Siap Kawin"] ?? 0}
                  hamil={sheepStatistics?.summary.femalePhaseStats?.["Hamil"] ?? 0}
                  menyusui={sheepStatistics?.summary.femalePhaseStats?.["Menyusui"] ?? 0}
                  />
            </div>

            <div className="dombaMaleCardStatisticsCard">
                  <DetailLivestockMaleCard 
                  title="Domba Jantan" 
                  total={sheepStatistics?.summary.totalMale ?? 0}
                  cempe={sheepStatistics?.summary.malePhaseStats?.["Cempe"] ?? 0}
                  siapKawin={sheepStatistics?.summary.femalePhaseStats?.["Siap Kawin"] ?? 0}           
                  />
            </div>

            <div className="dombaMaleCardStatisticsCard">
                <DetailLivestockDiagnosedCard
                title="Status dan Kondisi Ternak"
                sehat={sheepStatistics?.summary.livestockConditionStats?.["Sehat"] ?? 0}
                tersedia={sheepStatistics?.summary.livestockConditionStats?.["Tersedia"] ?? 0}
                sakit={sheepStatistics?.summary.livestockConditionStats?.["Sakit"] ?? 0}
                hilang={sheepStatistics?.summary.livestockConditionStats?.["Hilang"] ?? 0}
                mati={sheepStatistics?.summary.livestockConditionStats?.["Mati"] ?? 0}
                />
            </div>

          </div>

          <div className="statisticsCard">
          <StatisticsLactation lactationData={sheepStatistics?.lactationData} filterBy="year" filterValue={2019} />
          
          {/* <StatisticsMilkUpdate milkData={sheepStatistics?.milkData} filterBy="year" filterValue={2019} /> */}
          
          <StatisticsMilk milkData={sheepStatistics?.milkData} filterBy="year" filterValue={2019}/>
          
          {/* <StatisticsLivestockSold filterBy="year" filterValue={2019}/> */}
          </div>

          <div className="statisticsLactation">
           
          </div>

        </div>
      </div>

      </div>
    </div>
    );
};

export default App;