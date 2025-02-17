"use client";

import React, { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { Livestock } from '@/models/LivestockModel';
import { useRouter } from 'next/navigation'

import YearAndMonthPicker from '@/components/ui/YearAndMonthPicker/yearAndMonthPicker';
import Sidebar from '@/components/ui/Sidebar/sidebar';
import SearchBar from '@/components/ui/SearchBar/searchBar';
// import CategoryLivestockCard from '@/components/ui/CategoryLivestockCard/categoryLivestockCard';
import livestockCategories from '@/models/LivestockCategories';
import OperatorProfile from '@/components/ui/OperatorProfile/operatorProfile';
import Image from 'next/image';
import OwnerProfile from '@/components/ui/OwnerProfile/ownerProfile';
import LivestockCard from '@/components/ui/LivestockCard/LivestockCard';
import Loading from '@/components/ui/loading';
import SortByButton from '@/components/ui/SortBy/sortBy';
import FilterButton from '@/components/ui/Filter/filterButton';
// import { livestockData } from '@/data/livestockData';
// import { farmListData } from '@/data/farmData';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import TopBar from '@/components/ui/TopBar/topBar';
import { defaultFilterCategories } from '@/models/FilterCategory';
import InviteFarmModal from '@/components/ui/InviteFarmModal/InviteFarmModal';
import { getCookie } from '@/lib/cookies';
import { FarmModel } from '@/models/FarmModel';

const LivestockPage: React.FC = () => {
    const router = useRouter()

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
            setSelectedFarmId(farmData[0].id)
        }
    }, [farmData]);

    const handleFarmChange = (farmName: string) => {
        setSelectedFarm(farmName);
    };

    const { data: livestockData, loading: loadingLivestock, error: errorLivestock } = useFetch<Livestock[]>(
        `${process.env.NEXT_PUBLIC_API_HOST}/livestocks`,
    );
    
    const [appliedFilters, setAppliedFilters] = useState<{ [key: string]: string[] }>({});
    const [selectedSortBy, setSelectedSortBy] = useState<string>();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLivestocks, setFilteredLivestocks] = useState<Livestock[]>([]); 
    
    useEffect(() => {
        if (livestockData && livestockData.length > 0) {
         setFilteredLivestocks(livestockData)
        }
    }, [livestockData]);

    // Fungsi untuk menangkap input dari SearchBar
    const handleSearch = (value:string) => {
        // const { livestockId, breed, grade } = searchQuery;
        console.log('Search Query:', value);
    
        if (livestockData != null){
            const filtered = livestockData.filter((livestock) => {

                return (
                  (value ? livestock.name_id.toString().includes(value) : true) ||
                  (value ? livestock.breed.toLowerCase().includes(value.toLowerCase()) : true) ||
                  (value ? livestock.grade.toLowerCase().includes(value.toLowerCase()) : true)
                );
              });
            setFilteredLivestocks(filtered);
        }
        
    
        
      };
    
    return (
        <div>
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
                    <TopBar onSearch={handleSearch} ></TopBar>
                
                    <div className="content">
                    <div className="menuSection">
                    <div className="menuHeader">
                        <h1 className="menuTittle">Peternakan Anda</h1>
                        <div className="sortByAndFilter">
                            <PrimaryButton label='+ Tambah Ternak' width={200} onClick={() => router.push(`/defaultView/addTernakPage?selectedFarm=${selectedFarm}&farmId=${selectedFarmId}`)}/>
                        </div>
                    </div>
                    <div className="menuHeader">
                        <div className="sortByAndFilter">
                            <SortByButton
                                sortBys={[
                                    "Paling terakhir ditambahkan",
                                    "Paling awal ditambahkan",
                                    "Paling terakhir diubah"
                                ]}
                                onSortChange={(newSelectedSort) => setSelectedSortBy(newSelectedSort ?? "")}
                            />
                            <FilterButton 
                                filters={defaultFilterCategories}
                                onFiltersChange={(newFilters) => setAppliedFilters(newFilters)}
                            />

                                                    
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {
                        filteredLivestocks != null 
                            ? filteredLivestocks
                                .filter((livestock) => {
                                    const matchesFarm = livestock.farm_name === selectedFarm;

                                    const matchesFilters = Object.entries(appliedFilters).every(([category, selectedItems]) => {
                                        if (selectedItems.length === 0) return true;

                                        switch (category) {
                                            case "Ternak":
                                                return selectedItems.includes(livestock.category);
                                            case "Fase":
                                                return selectedItems.includes(livestock.phase);
                                            case "Jenis Kelamin":
                                                return selectedItems.includes(livestock.gender === "Jantan" ? "Jantan" : "Betina");
                                            case "Status":
                                                return selectedItems.includes(livestock.status);
                                            case "Kondisi":
                                                return selectedItems.includes(livestock.condition === "sakit" ? "Sakit" : "Sehat");
                                            default:
                                                return true;
                                        }
                                    });

                                    return matchesFarm && matchesFilters;
                                })
                                .sort((a, b) => {
                                    switch (selectedSortBy) {
                                        case "Paling terakhir ditambahkan":
                                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                                        case "Paling awal ditambahkan":
                                            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                                        case "Paling terakhir diubah":
                                            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                                        default:
                                            return 0;
                                    }
                                })
                                .map((livestock) => (
                                    <div 
                                        key={livestock.id} 
                                        onClick={() => router.push(`defaultView/${livestock.id}/`)}
                                    >
                                        <LivestockCard livestock={livestock} />
                                    </div>
                                ))
                            : <div>No livestock data available.</div>
                    }


                    </div>
                    </div>
                </div>

            </div>
            </div>
        </div>
    );
};

export default LivestockPage