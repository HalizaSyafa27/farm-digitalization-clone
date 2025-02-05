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
import TopBar from '@/components/ui/TopBar/topBar';
import { getCookie } from '@/lib/cookies';
import useFetch from '@/hooks/useFetch';
import { FarmModel } from '@/models/FarmModel';
import { StatisticsModel } from '@/models/FarmStatsModel';
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
    console.log(farmName)
  };

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data: goatStatistics, loading: loadingGoatStatistics, error: errorGoatStatistics } = useFetch<StatisticsModel>(
      `${process.env.NEXT_PUBLIC_API_HOST}/statistics/goat-statistics?farmId=${selectedFarmId}`
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
              { label: 'Kambing', href: '/OwnerViewPage/detailStatisticsPage/kambingDetailStatisticsPage' },
            ]}
          />
          </div>

          <div className="menuHeader">
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="94" height="86" viewBox="0 0 94 86" fill="none">
  <path d="M78.9323 2.66499C61.9391 -0.0857937 59.9846 22.2165 61.1315 33.7115L61.8431 37.0157L52.3905 24.8554C54.6295 -3.57983 71.018 -1.78622 78.9323 2.66499Z" fill="#642C07"/>
  <path d="M15.3255 2.66499C32.3187 -0.0857937 34.2732 22.2165 33.1263 33.7115L32.4147 37.0157L41.8673 24.8554C39.6283 -3.57983 23.2398 -1.78622 15.3255 2.66499Z" fill="#642C07"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M43.0064 15.4096C34.1374 14.0336 26.4945 21.6867 27.8825 30.5538L31.7328 55.1522C32.2326 58.3455 33.8471 61.123 36.1422 63.1136C37.2964 60.569 39.859 58.7992 42.8351 58.7992H51.3711C54.3646 58.7992 56.9398 60.5898 58.0842 63.1584C60.4425 61.1342 62.0911 58.2842 62.5671 55.009L66.1505 30.355C67.4317 21.5403 59.8255 13.9971 51.0218 15.3515L48.8325 15.6883C47.4914 15.8946 46.1266 15.8938 44.7858 15.6857L43.0064 15.4096Z" fill="#E0B87D"/>
  <path d="M39.4614 24.2659C38.0324 20.5868 42.3775 17.377 45.474 19.8243L45.674 19.9823C47.023 21.0485 48.9408 21.0005 50.2349 19.8682C52.9896 17.4578 57.1542 20.2645 55.9539 23.7226L52.1644 34.6399C51.5235 36.4862 49.7836 37.7239 47.8293 37.7239C45.9362 37.7239 44.2374 36.5613 43.5519 34.7966L39.4614 24.2659Z" fill="white"/>
  <rect x="36.3086" y="57.6279" width="22" height="12" rx="6" fill="#E0B87D"/>
  <path d="M77.294 29.5547C83.4616 27.1521 84.9219 23.0288 85.77 18.604C86.1464 16.6404 83.6855 15.1202 82.0925 16.3283C81.895 16.478 81.6728 16.5919 81.4359 16.6648L70.0493 20.1685C69.2277 20.4213 68.488 20.8875 67.9054 21.5196L66.3943 23.1592C65.5674 24.0564 65.1083 25.2319 65.1083 26.4521L65.1083 31.3852C65.1083 31.9857 64.9861 32.5893 64.7907 33.1571C62.8247 38.8694 68.6016 31.5002 72.2939 31.0547C74.1651 30.8289 74.3919 30.6851 77.294 29.5547Z" fill="#A36627"/>
  <path d="M16.8232 29.5547C10.6555 27.1521 9.19531 23.0288 8.34715 18.604C7.97076 16.6404 10.4316 15.1202 12.0247 16.3283C12.2222 16.478 12.4444 16.5919 12.6813 16.6648L24.0679 20.1685C24.8894 20.4213 25.6292 20.8875 26.2118 21.5196L27.7229 23.1592C28.5498 24.0564 29.0089 25.2319 29.0089 26.4521L29.0089 31.3852C29.0089 31.9857 29.1311 32.5893 29.3265 33.1571C31.2925 38.8694 25.5156 31.5002 21.8233 31.0547C19.9521 30.8289 19.7253 30.6851 16.8232 29.5547Z" fill="#A36627"/>
  <path d="M43.4063 84C39.4063 79.6 39.073 72.8333 39.4063 70C42.073 71.5 49.0063 73.6 55.4063 70C57.0063 76.4 53.7396 82 51.9063 84C53.1063 81.6 52.4063 77.3333 51.9063 75.5C51.5063 79.9 48.7396 84.3333 47.4063 86C44.6063 83.2 43.573 77.8333 43.4063 75.5C41.8064 76.7 42.7397 81.6667 43.4063 84Z" fill="#A36627"/>
  <path d="M49.2309 62.2892C48.6774 64.2214 45.9393 64.2216 45.3856 62.2894L44.7087 59.9276C44.628 59.646 44.4865 59.3855 44.294 59.1647L42.8643 57.5239C41.4288 55.8763 43.2978 53.4494 45.2574 54.4165L46.4229 54.9917C46.9809 55.2671 47.6352 55.2671 48.1931 54.9918L49.359 54.4165C51.3186 53.4494 53.1875 55.8764 51.7518 57.5239L50.3221 59.1645C50.1296 59.3855 49.988 59.646 49.9073 59.9278L49.2309 62.2892Z" fill="white"/>
  <path d="M39.3086 63C42.2624 64.5208 44.6419 64.901 45.4624 64.901C50.8778 65.4079 54.283 63.8449 55.3086 63H39.3086Z" fill="white"/>
  <path d="M64.3454 38.3539C65.7802 36.1591 64.6375 34.2791 63.2095 33.0736C62.0395 32.0859 60.4798 32.9001 60.1193 34.4804C58.9849 39.4535 59.2882 44.8704 64.3454 38.3539Z" fill="#642C07"/>
  <path d="M29.2757 38.3539C27.8409 36.1591 28.9836 34.2791 30.4116 33.0736C31.5816 32.0859 33.1413 32.9001 33.5018 34.4804C34.6362 39.4535 34.3329 44.8704 29.2757 38.3539Z" fill="#642C07"/>
</svg>
            </div>
            <h1 className="menuTittle">Kambing</h1>
            <div className="yearAndMonthPicker">
              <YearAndMonthPicker selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
            </div>
          </div>

          <div className="kambingDetailStatisticsCard">
            <div className="kambingFemaleCardStatisticsCard">
                  <DetailLivestockFemaleCard
                  title="Kambing Betina"
                  total={goatStatistics?.summary.totalFemale ?? 0}
                  cempe={goatStatistics?.summary.femalePhaseStats?.["Cempe"] ?? 0}
                  dara={goatStatistics?.summary.femalePhaseStats?.["Dara"] ?? 0}
                  siapKawin={goatStatistics?.summary.femalePhaseStats?.["Siap Kawin"] ?? 0}
                  hamil={goatStatistics?.summary.femalePhaseStats?.["Hamil"] ?? 0}
                  menyusui={goatStatistics?.summary.femalePhaseStats?.["Menyusui"] ?? 0}
                  />
            </div>

            <div className="kambingMaleCardStatisticsCard">
                  <DetailLivestockMaleCard 
                  title="Kambing Jantan" 
                  total={goatStatistics?.summary.totalMale ?? 0}
                  cempe={goatStatistics?.summary.malePhaseStats?.["Cempe"] ?? 0}
                  siapKawin={goatStatistics?.summary.femalePhaseStats?.["Siap Kawin"] ?? 0}           
                  />
            </div>

            <div className="kambingMaleCardStatisticsCard">
                <DetailLivestockDiagnosedCard
                title="Status dan Kondisi Ternak"
                sehat={goatStatistics?.summary.livestockConditionStats?.["Sehat"] ?? 0}
                tersedia={goatStatistics?.summary.livestockConditionStats?.["Tersedia"] ?? 0}
                sakit={goatStatistics?.summary.livestockConditionStats?.["Sakit"] ?? 0}
                hilang={goatStatistics?.summary.livestockConditionStats?.["Hilang"] ?? 0}
                mati={goatStatistics?.summary.livestockConditionStats?.["Mati"] ?? 0}
                />
            </div>

          </div>

          <div className="statisticsCard">
          <StatisticsLactation lactationData={goatStatistics?.lactationData} filterBy="year" filterValue={selectedYear ?? 0} />
          {/* <StatisticsMilk milkData={goatStatistics?.milkData} filterBy="year" filterValue={selectedYear ?? 0} /> */}

          <StatisticsMilk milkData={goatStatistics?.milkData} filterBy="year" filterValue={2019}/>

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