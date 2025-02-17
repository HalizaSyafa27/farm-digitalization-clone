'use client'

import React, { useEffect, useState } from 'react';
import YearAndMonthPicker from '@/components/ui/YearAndMonthPicker/yearAndMonthPicker';
import Sidebar from '@/components/ui/Sidebar/sidebar';
import CategoryLivestockCard from '@/components/ui/CategoryLivestockCard/categoryLivestockCard';
import livestockCategories from '@/models/LivestockCategories';
import Breadcrumbs from '@/components/ui/Breadcrumbs/breadcrumbs';
import TopBar from '@/components/ui/TopBar/topBar';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import InviteFarmModal from '@/components/ui/InviteFarmModal/InviteFarmModal';
import { usersData } from '@/data/userData';
// // import { farmListData } from '@/data/farmData';
import useFetch from '@/hooks/useFetch';
import { FarmModel } from '@/models/FarmModel';
import { getCookie } from '@/lib/cookies';
import { StatisticsModel } from '@/models/FarmStatsModel';


interface OwnerViewPageProps {
  breadcrumb: string;
  setBreadcrumb: (value: string) => void;
}

const OwnerViewPage: React.FC<OwnerViewPageProps> = ({
  breadcrumb,
  setBreadcrumb,
}) => {
    const storedId = getCookie("id"); 
    const role = getCookie("role"); 

    const { data: farmData, loading: loadingFarms, error: errorFarms } = useFetch<FarmModel[]>(
        role == "owner" ? `${process.env.NEXT_PUBLIC_API_HOST}/farms?ownerId=${storedId}` : `${process.env.NEXT_PUBLIC_API_HOST}/farms/operator/${storedId}`,
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const categories = livestockCategories('owner');

    const { data: cowStatistics, loading: loadingCowStatistics, error: errorCowStatistics } = useFetch<StatisticsModel>(
        `${process.env.NEXT_PUBLIC_API_HOST}/statistics/cow-statistics?farmId=${selectedFarmId}`
    );

    const { data: sheepStatistics, loading: loadingSheepStatistics, error: errorSheepStatistics } = useFetch<StatisticsModel>(
        `${process.env.NEXT_PUBLIC_API_HOST}/statistics/sheep-statistics?farmId=${selectedFarmId}`
    );

    const { data: goatStatistics, loading: loadingGoatStatistics, error: errorGoatStatistics } = useFetch<StatisticsModel>(
        `${process.env.NEXT_PUBLIC_API_HOST}/statistics/goat-statistics?farmId=${selectedFarmId}`
    );

    return (
    <div className="layout">
      <div className="sidebar">
      <Sidebar 
            setBreadcrumb={function (label: string): void {
                // throw new Error('Function not implemented.');
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

          <div className="menuHeader1">
          <div>
          <Breadcrumbs
            breadcrumbs={[
              { label: selectedFarm ?? "", href: '/defaultView' },
              { label: 'Statistik', href: '/defaultView?view=statistik' },
            ]}
          />
          </div>
          <div>
            {role == "owner" 
            ? 
            <PrimaryButton
            label="+ Tambah Peternakan"
            width= {210}
            onClick={() => setIsModalOpen(true)}
            />
            : <div></div>
            }
            
          {isModalOpen && (
            <InviteFarmModal
              users={usersData} // Gunakan data dari usersData
              onClose={() => setIsModalOpen(false)}
              farmList={farmData == null ? [] : farmData } setIsFarmInvited={function (value: boolean): void {return;} }                      
            />
      )}
          </div>
          </div>


          <div className="menuHeader">
            <h1 className="menuTittle">Statistik</h1>
            <div className="yearAndMonthPicker">
              {/* <YearAndMonthPicker/> */}
            </div>
          </div>
          <div className="livestockCategoriesCard">
          {categories.map((category) => {
                let statistics;

                if (category.title === "Kambing") {
                    statistics = goatStatistics; 
                } else if (category.title === "Sapi") {
                    statistics = cowStatistics; 
                } else {
                    statistics = sheepStatistics;
                }

                return (
                    <CategoryLivestockCard
                    key={category.type}
                    icon={category.icon}
                    title={category.title}
                    total={statistics == null ? 0 : statistics.summary.total}
                    maleCount={statistics == null ? 0 : statistics.summary.totalMale}
                    femaleCount={statistics == null ? 0 : statistics.summary.totalFemale}
                    href={category.href}
                    />
                );
            })}

          </div>
        </div>
      </div>

      </div>
    </div>
    );
};

export default OwnerViewPage;