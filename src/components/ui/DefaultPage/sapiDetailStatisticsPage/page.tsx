'use client'

import React, { useEffect, useState } from 'react';
// import PhaseLabelButton from "@/components/ui/PhaseLabel/PhaseLabelButton";
// import { phaseLabels } from "@/data/phaseLabels";
// import HealthStatus from "@/components/ui/healthStatus"; 
// import GenderIcon from '@/components/ui/genderIcon';
import EditButton from '@/components/ui/EditButton/editButton';
import AddButton from '@/components/ui/AddButton/addButton';
import InviteOperatorButton from '@/components/ui/InviteOperatorButton/inviteOperatorButton';
import UpdateButton from '@/components/ui/UpdateButton/updateButton';
import PrintButton from '@/components/ui/DownloadQRButton/DownloadQRButton';
import FilterButton from '@/components/ui/Filter/filterButton';
import SortByButton from '@/components/ui/SortBy/sortBy';
import YearAndMonthPicker from '@/components/ui/YearAndMonthPicker/yearAndMonthPicker';
import Sidebar from '@/components/ui/Sidebar/sidebar';
import SearchBar from '@/components/ui/SearchBar/searchBar';
import CategoryLivestockCard from '@/components/ui/CategoryLivestockCard/CategoryLivestockCard';
import OperatorProfile from '@/components/ui/OperatorProfile/operatorProfile';
import Image from 'next/image';
import OwnerProfile from '@/components/ui/OwnerProfile/ownerProfile';
import Breadcrumbs from '@/components/ui/Breadcrumbs/breadcrumbs';
import { usePathname } from 'next/navigation';
import DetailLivestockFemaleCard from '@/components/ui/DetailLivestockFemaleCard/DetailLivestockFemaleCard';
import livestockCategories from '@/models/DetaillivestockFemaleCategories';
import DetailLivestockMaleCard from '@/components/ui/DetailLivestockMaleCard/DetailLivestockMaleCard';
import detaillivestockMaleCategories from '@/models/DetaillivestockMaleCategories';
import DetailLivestockDiagnosedCard from '@/components/ui/DetailLivestockDiagnosedCard/DetailLivestockDiagnosedCard';
import livestockDiagnosedCategories from '@/models/DetaillivestockDiagnosedCategories';
import StatisticsMilk from '@/components/ui/StatisticsMilk/statisticsMilk';
import StatisticsLactation from '@/components/ui/StatisticsLactation/statisticsLactation';
// import StatisticsLivestockSold from '@/components/ui/StatisticsLivestockSold/StatisticsLivestockSold';

import TopBar from '@/components/ui/TopBar/topBar';
import useFetch from '@/hooks/useFetch';
import { FarmModel } from '@/models/FarmModel';
import { getCookie } from '@/lib/cookies';
import { StatisticsModel } from '@/models/FarmStatsModel';
import StatisticsMilkUpdate from '@/components/ui/StatisticsMilkUpdate/StatisticsMilkUpdate';
import StatisticsLivestockSold from '@/models/statisticsLivestockSold';

const App: React.FC = () => {

  const [breadcrumb, setBreadcrumb] = useState('Statistik');

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
      console.log(farmName)
  };

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data: cowStatistics, loading: loadingCowStatistics, error: errorCowStatistics } = useFetch<StatisticsModel>(
      `${process.env.NEXT_PUBLIC_API_HOST}/statistics/cow-statistics?farmId=${selectedFarmId}`
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
              { label: 'Sapi', href: '/OwnerViewPage/detailStatisticsPage/sapiDetailStatisticsPage' },
            ]}
          />
          </div>

          <div className="menuHeader">
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="97" height="87" viewBox="0 0 97 87" fill="none">
  <path d="M84.3025 0.773438C86.2053 13.0357 70.1199 14.3394 61.8394 13.4585L59.4609 12.93L68.1819 19.801C88.6894 18.3211 87.4738 6.49933 84.3025 0.773438Z" fill="#642C07"/>
  <path d="M13.6897 0.773438C11.7869 13.0357 27.8723 14.3394 36.1528 13.4585L38.5312 12.93L29.8103 19.801C9.30275 18.3211 10.5184 6.49933 13.6897 0.773438Z" fill="#642C07"/>
  <path d="M70.564 23.6068L64.0143 31.6779C63.1737 32.7138 62.6795 34.0922 63.4865 35.1545C64.9316 37.0566 68.6681 39.4566 76.8262 40.6788C84.7708 41.8691 90.5189 36.847 93.9301 31.8019C95.9077 28.877 93.8996 25.2391 90.4426 24.5215L76.2601 21.5778C74.1314 21.1359 71.934 21.9187 70.564 23.6068Z" fill="#C28737"/>
  <path d="M26.4203 23.6068L32.9701 31.6779C33.8107 32.7138 34.3049 34.0922 33.4978 35.1545C32.0528 37.0566 28.3163 39.4566 20.1581 40.6788C12.2136 41.8691 6.46549 36.847 3.05427 31.8019C1.07663 28.877 3.08477 25.2391 6.54181 24.5215L20.7243 21.5778C22.853 21.1359 25.0504 21.9187 26.4203 23.6068Z" fill="#C28737"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M40.7895 12.4014C31.0546 12.4014 23.6185 21.092 25.1239 30.7098L30.2228 63.2847C30.8209 67.1053 32.7523 70.4286 35.4982 72.8104C36.8794 69.766 39.9457 67.6485 43.5065 67.6485H53.7204C57.3025 67.6485 60.3841 69.7914 61.7533 72.8653C64.5755 70.443 66.5484 67.0327 67.1181 63.1133L71.8528 30.5384C73.2429 20.974 65.8263 12.4014 56.1613 12.4014H40.7895Z" fill="#E0B87D"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M41.2253 71.5986C37.7225 71.5986 34.8828 74.4383 34.8828 77.9412V78.9983C34.8828 81.4717 36.2987 83.6145 38.3642 84.6603C38.1634 84.0424 38.0549 83.3829 38.0549 82.6981V81.1124C38.0549 77.6096 40.8945 74.7699 44.3974 74.7699H52.8541C56.357 74.7699 59.1966 77.6096 59.1966 81.1124V82.6981C59.1966 83.3826 59.0882 84.0418 58.8876 84.6594C60.9521 83.6133 62.3671 81.471 62.3671 78.9983V77.9412C62.3671 74.4383 59.5275 71.5986 56.0246 71.5986H41.2253Z" fill="#E0B87D"/>
  <rect x="39.6406" y="77.9404" width="17.9705" height="8.98525" rx="4.49263" fill="#C28737"/>
  <path d="M22.7672 35.4283C22.9574 33.9072 24.0658 32.661 25.5542 32.2946L26.764 31.9968C29.0547 31.433 31.2809 33.1281 31.3467 35.4863L31.4379 38.757C31.4441 38.9804 31.4706 39.2027 31.5169 39.4213L32.0612 41.9882C32.5944 44.5026 30.4644 46.7812 27.9198 46.4185L27.5563 46.3666C26.5138 46.218 25.5841 45.6323 25 44.7561L22.9015 41.6083C22.4089 40.8695 22.1985 39.9782 22.3087 39.0972L22.7672 35.4283Z" fill="#864A14"/>
  <path d="M74.8734 35.4283C74.6833 33.9072 73.5749 32.661 72.0864 32.2946L70.8766 31.9968C68.5859 31.433 66.3597 33.1281 66.294 35.4863L66.2027 38.757C66.1965 38.9804 66.1701 39.2027 66.1237 39.4213L65.5794 41.9882C65.0462 44.5026 67.1763 46.7812 69.7209 46.4185L70.0843 46.3666C71.1268 46.218 72.0565 45.6323 72.6406 44.7561L74.7392 41.6083C75.2317 40.8695 75.4421 39.9782 75.332 39.0972L74.8734 35.4283Z" fill="#864A14"/>
  <ellipse cx="48.6238" cy="12.6656" rx="13.2136" ry="7.13535" fill="#E0B87D"/>
  <path d="M38.9353 24.5747C37.2253 20.1724 42.4245 16.3317 46.1297 19.26L46.3689 19.4491C47.9832 20.7249 50.2779 20.6675 51.8263 19.3126C55.1226 16.4283 60.1058 19.7867 58.6695 23.9245L54.1351 36.9878C53.3683 39.197 51.2864 40.6781 48.948 40.6781C46.6827 40.6781 44.65 39.287 43.8298 37.1754L38.9353 24.5747Z" fill="white"/>
</svg>
            </div>
            <h1 className="menuTittle">Sapi</h1>
            <div className="yearAndMonthPicker">
              <YearAndMonthPicker selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
            </div>
          </div>

          <div className="sapiDetailStatisticsCard">
            <div className="sapiFemaleCardStatisticsCard">
                  <DetailLivestockFemaleCard
                  title="Sapi Betina"
                  total={cowStatistics?.summary.totalFemale ?? 0}
                  pedet={cowStatistics?.summary.femalePhaseStats?.["Pedet"] ?? 0}
                  dara={cowStatistics?.summary.femalePhaseStats?.["Dara"] ?? 0}
                  siapKawin={cowStatistics?.summary.femalePhaseStats?.["Siap Kawin"] ?? 0}
                  hamil={cowStatistics?.summary.femalePhaseStats?.["Hamil"] ?? 0}
                  menyusui={cowStatistics?.summary.femalePhaseStats?.["Menyusui"] ?? 0}
                  />
            </div>

            <div className="sapiMaleCardStatisticsCard">
                  <DetailLivestockMaleCard 
                  title="Sapi Jantan" 
                  total={cowStatistics?.summary.totalMale ?? 0}
                  pedet={cowStatistics?.summary.malePhaseStats?.["Pedet"] ?? 0}
                  siapKawin={cowStatistics?.summary.femalePhaseStats?.["Siap Kawin"] ?? 0}           
                  />
            </div>

            <div className="sapiMaleCardStatisticsCard">
                <DetailLivestockDiagnosedCard
                title="Status dan Kondisi Ternak"
                sehat={cowStatistics?.summary.livestockConditionStats?.["Sehat"] ?? 0}
                tersedia={cowStatistics?.summary.livestockConditionStats?.["Tersedia"] ?? 0}
                sakit={cowStatistics?.summary.livestockConditionStats?.["Sakit"] ?? 0}
                hilang={cowStatistics?.summary.livestockConditionStats?.["Hilang"] ?? 0}
                mati={cowStatistics?.summary.livestockConditionStats?.["Mati"] ?? 0}
                />
            </div>

          </div>

          <div className="statisticsCard">
          
          <StatisticsLactation lactationData={cowStatistics?.lactationData} filterBy="year" filterValue={2019} />
          {/* <StatisticsMilkUpdate milkData={cowStatistics?.milkData} filterBy="year" filterValue={2019} /> */}
          <StatisticsMilk milkData={cowStatistics?.milkData} filterBy="year" filterValue={2019}/>
         

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
