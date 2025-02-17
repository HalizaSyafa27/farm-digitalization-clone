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
import CategoryLivestockCard from '@/components/ui/CategoryLivestockCard/categoryLivestockCard';
import livestockCategories from '@/models/LivestockCategories';
import OperatorProfile from '@/components/ui/OperatorProfile/operatorProfile';
import Image from 'next/image';
import OwnerProfile from '@/components/ui/OwnerProfile/ownerProfile';
import Breadcrumbs from '@/components/ui/Breadcrumbs/breadcrumbs';
import { usePathname } from 'next/navigation';
import TopBar from '@/components/ui/TopBar/topBar';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import SetUmurTernakForm from '@/components/ui/SetUmurTernakForm/SetUmurTernakForm';
import SetFasePerkembanganForm from '@/components/ui/SetFasePerkembanganForm/SetFasePerkembanganForm';
import CustomIDForm from "@/components/ui/CostumIDForm/CostumIDForm"
import { useRouter } from 'next/navigation'
import { getCookie } from '@/lib/cookies';
import useFetch from '@/hooks/useFetch';
import { FarmModel } from '@/models/FarmModel';

interface Payload {
  farmId?: number;
  typeId: string;
  newPrefix?: string;
  customPrefix?: string;
}

const App: React.FC = () => {

  const [breadcrumb, setBreadcrumb] = useState('Statistik');
  const router = useRouter()
  const categories = livestockCategories('owner');

  const storedId = getCookie("id"); 

  const { data: farmData, loading: loadingFarms, error: errorFarms } = useFetch<FarmModel[]>(
      `${process.env.NEXT_PUBLIC_API_HOST}/farms?ownerId=${storedId}`,
  );
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null);
  const [selectedFarmModel, setSelectedFarmModel] = useState<FarmModel | null>(null);

  useEffect(() => {
      if (farmData && farmData.length > 0) {
          setSelectedFarm(farmData[0]?.name || null);
          setSelectedFarmModel(farmData[0] || null);
      }
  }, [farmData]);

  const handleFarmChange = (farmName: string) => {
      const farmModel = farmData?.find((farm) => farm.name === farmName) || null;
      setSelectedFarmModel(farmModel);
      setSelectedFarm(farmName);
  };

    function getMenuLabel(pathname: string): string {
      switch (pathname) {
        case '/OwnerViewPage':
          return 'Statistik';
        case '/livestockOwnerPage':
          return 'Ternak Anda';
        case '/activityOwnerPage':
          return 'Aktivitas';
        case '/settingsOwnerPage':
          return 'Pengaturan';
        default:
          return 'Halaman Tidak Ditemukan';
      }
    }

    const [sapiPrefix, setSapiPrefix] = useState("");
    const [kambingPrefix, setKambingPrefix] = useState("");
    const [dombaPrefix, setDombaPrefix] = useState("");

    const { data: customIdSapi, loading: loadingCustomIdSapi, error: errorCustomIdSapi } = useFetch<CustomId>(
      `${process.env.NEXT_PUBLIC_API_HOST}/livestock-custom-ids/${selectedFarmModel?.id}/Sapi`
    );
    
    const { data: customIdKambing, loading: loadingCustomIdKambing, error: errorCustomIdKambing } = useFetch<CustomId>(
      `${process.env.NEXT_PUBLIC_API_HOST}/livestock-custom-ids/${selectedFarmModel?.id}/Kambing`
    );
    
    const { data: customIdDomba, loading: loadingCustomIdDomba, error: errorCustomIdDomba } = useFetch<CustomId>(
      `${process.env.NEXT_PUBLIC_API_HOST}/livestock-custom-ids/${selectedFarmModel?.id}/Domba`
    );
    
    useEffect(() => {
      if (customIdSapi) {
        setSapiPrefix(customIdSapi.custom_prefix); 
      }
    }, [customIdSapi]);

    useEffect(() => {
    }, [sapiPrefix]);
    
    useEffect(() => {
      if (customIdKambing) {
        setKambingPrefix(customIdKambing.custom_prefix); 
      }
    }, [customIdKambing]);
    
    useEffect(() => {
      if (customIdDomba) {
        setDombaPrefix(customIdDomba.custom_prefix); 
      }
    }, [customIdDomba]);

    const handlePrefixChange = (newSapiPrefix: string, newKambingPrefix: string, newDombaPrefix: string) => {
      setSapiPrefix(newSapiPrefix);
      setKambingPrefix(newKambingPrefix);
      setDombaPrefix(newDombaPrefix);
    };

    const handleSubmit = async () => {
      for (let i = 0; i < 3; i++) {
        const payload: Payload = {
          farmId: selectedFarmModel?.id,
          typeId: i === 0 ? "Sapi" : i === 1 ? "Kambing" : "Domba",
        };
    
        if (
          (i === 0 && (sapiPrefix === "" || sapiPrefix === customIdSapi?.custom_prefix)) ||
          (i === 1 && (kambingPrefix === "" || kambingPrefix === customIdKambing?.custom_prefix)) ||
          (i === 2 && (dombaPrefix === "" || dombaPrefix === customIdDomba?.custom_prefix))
        ) {
          console.log(`Skipping iteration ${i + 1}`);
          continue;
        }
    
        try {
          let endpoint = "";
          let method = "";
    
          if (
            (i === 0 && customIdSapi === null) ||
            (i === 1 && customIdKambing === null) ||
            (i === 2 && customIdDomba === null)
          ) {
            payload.customPrefix = i === 0 ? sapiPrefix : i === 1 ? kambingPrefix : dombaPrefix
            endpoint = "create";
            method = "POST";
          } else {
            payload.newPrefix = i === 0 ? sapiPrefix : i === 1 ? kambingPrefix : dombaPrefix
            endpoint = "change-prefix";
            method = "PUT";
          }
    
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/livestock-custom-ids/${endpoint}`, {
            method: method,
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            console.error(`Error in request ${i + 1}:`, response.statusText);
          } else {
            const result = await response.json();
            console.log(`Response ${i + 1}:`, result);
            router.push("defaultView?view=settings");
          }
        } catch (error) {
          console.error(`Error in request ${i + 1}:`, error);
        }
      }
    };
    
  

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
          <div>
          <Breadcrumbs
            breadcrumbs={[
              { label: selectedFarm ?? "", href: '/defaultView' },
              { label: 'Settings', href: '/defaultView?view=settings' },
            ]}
          />
          </div>
          
          <div className="menuHeader">
            <h1 className="menuTittle">Pengaturan</h1>
            <div className="yearAndMonthPicker">
              <PrimaryButton
              label="Simpan Perubahan" 
              width={190}
              onClick={() => handleSubmit()}
              />
            </div>
          </div>

          <div className="rowContainerSettingsForm">
            <div className="umurTernakForm">
              <SetUmurTernakForm/>
            </div>
            <div className="fasePerkembanganForm">
              <SetFasePerkembanganForm/>
            </div>
          </div>

          <div className="costumIDForm">
          <CustomIDForm
            onPrefixChange={handlePrefixChange}
            sapiPrefix={sapiPrefix}
            kambingPrefix={kambingPrefix}
            dombaPrefix={dombaPrefix}
          />
          </div>
        </div>
      </div>

      </div>
    </div>
    );
};

export default App;
