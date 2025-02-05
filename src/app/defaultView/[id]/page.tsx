"use client";

import React, { use, useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { useRouter } from 'next/navigation'
import { Livestock } from '@/models/LivestockModel';
import QRCode from 'qrcode';

import Sidebar from '@/components/ui/Sidebar/sidebar';
import GenderIcon from '@/components/ui/genderIcon';
import StatisticsLactation from '@/components/ui/StatisticsLactation/statisticsLactation';
import DeleteButton from '@/components/ui/DeleteButtonIcon/deleteButton';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import TopBar from '@/components/ui/TopBar/topBar';
import DownloadQRButton from '@/components/ui/DownloadQRButton/DownloadQRButton';
import PerbaruiButton from '@/components/ui/PerbaruiButton/PerbaruiButton';
import PhaseLabelTag from '@/components/ui/PhaseLabel/PhaseLabelTag';
import { phaseLabels } from '@/data/phaseLabels';
import DetailLactationCard from '@/components/ui/DetailLactationCard/DetailLactationCard';
import StatisticsMilkUpdate from '@/components/ui/StatisticsMilkUpdate/StatisticsMilkUpdate';
import StatisticsWeightUpdate from '@/components/ui/StatisticsWeightUpdate/StatisticsWeightUpdate';
import { getCookie } from '@/lib/cookies';
import { FarmModel } from '@/models/FarmModel';

interface LivestockDetailPageProps {
    params: Promise<{
        id: number;
    }>;
  }

interface LactationDetail {
    title: string;
    description: string;
    livestock?: Livestock;
}

interface DetailLactationCardProps {
    lactationData: {
    livestockId: number;
    yearlyData: {
        year: number;
        data: { month: string; value: number }[];
    }[];
    };
    livestock?: Livestock;
}

const LivestockDetailPage: React.FC<LivestockDetailPageProps> = ({ params: paramsPromise }) => {
    const params = use(paramsPromise);
    const id = params.id;

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

    const { data: livestock, loading: loadingLivestock, error: errorLivestock } = useFetch<Livestock>(
        `${process.env.NEXT_PUBLIC_API_HOST}/animals/${id}`,
    );
    useEffect(() => {
        if (livestock?.lactationData) {
            const { currentLactation, history } = generateLactationData(livestock);
            setCurrentLactation(currentLactation);
            setHistory(history);
        }
    }, [livestock]);

    const [currentLactation, setCurrentLactation] = useState<LactationDetail>();
    const [history, setHistory] = useState<LactationDetail[]>([]);

    const generateLactationData = (livestock: Livestock) => {
        const yearlyData = livestock.lactationData.yearlyDatas;
        
        const currentYearData = yearlyData[yearlyData.length - 1];
        const currentLactationNumber = yearlyData.length; // Number of years = current lactation number
    
        // Generate current lactation title and description
        const currentLactation = {
        title: `Laktasi ke-${currentLactationNumber}`,
        description: `${currentYearData.monthlyDatas[0].value} Jantan - ${currentYearData.year} ${currentYearData.monthlyDatas[0].month} ${currentYearData.monthlyDatas[currentYearData.monthlyDatas.length - 1].month}`,
        livestock: livestock || undefined,
        };
    
        // Generate history by iterating through previous years
        const history = yearlyData.slice(0, -1).map((yearData: any, index: number) => {
            const lactationNumber = index + 1;
            return {
                title: `Laktasi ke-${lactationNumber}`,
                description: `${yearData.data[0].value} Betina - ${yearData.year} ${yearData.data[0].month} ${yearData.data[yearData.data.length - 1].month}`,
                livestock: livestock || undefined,
            };
        });
        return { currentLactation, history };
    };

    const handleDownloadQR = async () => {
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(process.env.NEXT_PUBLIC_NEXT_HOST + "/defaultView/" + id);
            if (typeof document !== 'undefined') {
                const link = document.createElement('a');
                link.href = qrCodeDataUrl;
                link.download = 'qrcode.png';
                link.click();
            }
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    };

    const [apiError, setApiError] = useState(null);
    const [apiData, setApiData] = useState(null);
    const handleDeleteData = async () => {
        const isConfirmed = await window.confirm(
            `Apakah Anda yakin untuk menghapus ternak ID ${livestock == null ? "" : livestock.name_id}?`
        );
        
        if (isConfirmed) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/animals/${id}`, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                
                const data = await response.json();
                if (response.ok) {
                    router.push("/defaultView?view=livestock");
                } else {
                    setApiError(data.error || "Something went wrong");
                }
            } catch {

            }
        } else {
            router.push(`/defaultView/${livestock == null ? "" : livestock.id}/`);
        }
    };
    
   const router = useRouter()
    return (
        <div>
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
                            <div className="menuHeader">
                                <h1 className="menuTittle">{livestock == null ? "" : livestock.name_id}</h1>
                                <div className='genderIcon'>
                                    <GenderIcon gender={livestock == null ? "jantan" : livestock.gender == "MALE" ? 'jantan' : 'betina'}></GenderIcon>
                                    {/* <PhaseLabelTag phases={phaseLabels} CEMPE={livestock == null ? "" : livestock.phase}></PhaseLabelTag> */}
                                    

                                </div>
                                <div className="phaseLabelTag-livestockOwnerPage">
                                    <PhaseLabelTag 
                                    phases={phaseLabels} 
                                    filterId={livestock == null ? "" : livestock.phase}
                                    width={60}
                                    textSize={10}                                    
                                    >
                                    </PhaseLabelTag>
                                    </div>
                                <div className="deleteIcon">
                                    <DownloadQRButton onClick={handleDownloadQR}/>
                                    <PrimaryButton 
                                    label='Ubah Data' 
                                    width={130}
                                    onClick={() => router.push(`/defaultView/${id}/editTernakPage?selectedFarm=${selectedFarm}&farmId=${selectedFarmId}`)}
                                    />
                                    {role == "owner" 
                                    ? 
                                    <DeleteButton
                                        onClick={() => {
                                            handleDeleteData();
                                        
                                        }}
                                    />
                                    : <div></div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='livestock'>
                            <div className='generalInformationLivestock'>
                                <img
                                src={livestock == null ? "" : livestock.photo_url}
                                alt={livestock == null ? "" : livestock.name_id}
                                style={{
                                    width: '232px',
                                    height: '214px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                }}
                                />
                                {/* <QRCodeSVG value={`${process.env.NEXT_PUBLIC_NEXT_HOST}/OwnerViewPage/livestockOwnerPage/${id}`} size={85} /> */}
                                <div className='generalInformationLivestockBox'>
                                    <div className='generalInformationLivestockBoxTop'>
                                        <GeneralInfoBox title={'Tanggal Lahir'}   value={livestock == null ? "" : new Date(livestock.dob).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}></GeneralInfoBox>
                                        <GeneralInfoBox title={'Ras'} value={livestock == null ? "" : livestock.breed} ></GeneralInfoBox>
                                        <GeneralInfoBox title={'Grade'} value={livestock == null ? "" : livestock.grade || "Undefined"} ></GeneralInfoBox>
                                        <GeneralInfoBox title={'Berat'} value={livestock == null ? "" : livestock.weight || "Undefined"} ></GeneralInfoBox>
                                    </div>
                                    <div className='generalInformationLivestockBoxTop'>
                                        <GeneralInfoBox title={'ID Ayah'} value={livestock == null ? "" : livestock.dad_name_id || "N/A"} ras={'Purebred'}  isLink={true} linkHref='' ></GeneralInfoBox>
                                        <GeneralInfoBox title={'ID Ibu'} value={livestock == null ? "" : livestock.mom_name_id || "N/A"} grade={'F1'} isLink={true} linkHref='' ></GeneralInfoBox>
                                        {/* <GeneralInfoBox title={'ID Kakek'} value={livestock == null ? "" : livestock.grandpa_name_id || "N/A"} ras={'Purebred'} isLink={true} linkHref='' ></GeneralInfoBox>
                                        <GeneralInfoBox title={'ID Nenek'} value={livestock == null ? "" : livestock.grandma_name_id || "N/A"} grade={'F3'} isLink={true} linkHref='' ></GeneralInfoBox> */}
                                    </div>
                                </div>
                            </div>
                            <div className='detailInformationLivestock'>
                                <DetailInformationCard
                                    // conditionTitle="Kondisi"
                                    // conditionValue={livestock == null ? "" : livestock.health.current_condition}
                                    historyTitle="Riwayat Sakit"
                                    historyItems={livestock?.health == null ? [] : livestock.health.historyItems.length > 2 ? livestock.health.historyItems.slice(0, 2) : livestock.health.historyItems}
                                    livestock={livestock}
                                />
                                <DetailInformationCard
                                    // conditionTitle="Obat"
                                    // conditionValue={livestock == null ? "" : livestock.medication.current_condition}
                                    historyTitle="Riwayat Obat"
                                    historyItems={livestock?.medication == null ? [] : livestock.medication.historyItems.length > 2 ? livestock.medication.historyItems.slice(0, 2) : livestock.medication.historyItems}
                                    livestock={livestock}
                                />
                                <DetailInformationCard
                                    // conditionTitle="Vitamin"
                                    // conditionValue={livestock == null ? "" : livestock.vitamin.current_condition}
                                    historyTitle="Riwayat Vitamin"
                                    historyItems={livestock?.vitamin == null ? [] : livestock.vitamin.historyItems.length > 2 ? livestock.vitamin.historyItems.slice(0, 2) : livestock.vitamin.historyItems}
                                    livestock={livestock}
                                />
                                <DetailInformationCard
                                    // conditionTitle="Vaksin"
                                    // conditionValue={livestock == null ? "" : livestock.vaccine.current_condition}
                                    historyTitle="Riwayat Vaksin"
                                    historyItems={livestock?.vaccine == null ? []: livestock.vaccine.historyItems.length > 2 ? livestock.vaccine.historyItems.slice(0, 2) : livestock.vaccine.historyItems}
                                    livestock={livestock}
                                />
                            </div>
                            <div className='statisticsInformationLivestock'>
                                {/* <StatisticMilk filterBy="year" filterValue={2019} milkData={livestock == null ? "" : livestock.milkData}/> */}
                                <StatisticsMilkUpdate filterBy="year" filterValue={livestock == null ? "" : livestock.milkData == null ? "" : livestock.milkData.yearlyDatas[0].year} milkData={livestock == null ? undefined : livestock.milkData} livestock={livestock == null ? undefined : livestock} />
                                <div className="lactationSection">
                                    <StatisticsLactation filterBy="year" filterValue={livestock == null ? "" : livestock.lactationData == null ? "" : livestock.lactationData.yearlyDatas[0].year} lactationData={livestock == null ? undefined : livestock.lactationData}/>
                                    <DetailLactationCard currentLactation={currentLactation} history={history} livestock={livestock == null ? undefined : livestock} />;
                                </div>
                                
                                {/* <StatisticWeight filterBy="year" filterValue={2019} weightData={livestock == null ? "" : livestock.weightData}/> */}
                                <StatisticsWeightUpdate filterBy="year" filterValue={livestock == null ? "" : livestock.weightData == null ? "" : livestock.weightData.yearlyDatas[0].year} weightData={livestock == null ? undefined : livestock.weightData} livestock={livestock == null ? undefined : livestock}/>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default LivestockDetailPage

interface GeneralInfoBoxProps {
    title: string;
    value: string | number | null;
    isLink?: boolean; // Optional parameter to determine if the value is a hyperlink
    linkHref?: string; // URL for the hyperlink
    ras?: string;
    grade?: string;
}

const GeneralInfoBox: React.FC<GeneralInfoBoxProps> = ({ title, value, isLink = false, linkHref = "#", ras, grade }) => {
    return (
        <div className="generalInformationLivestockBoxTopData">
            <h1 className="generalInformationLivestockBoxTopDataTitle">{title}</h1>
            {isLink ? (
                <div>
                    <a
                    href={linkHref}
                    className="generalInformationLivestockBoxTopDataValue hyperlinkStyle"
                    target="_blank"
                    rel="noopener noreferrer"
                    
                >
              
  
                    {value ?? "N/A"}
                </a>

               <p>{ras}</p>
               <p>{grade}</p>
                
             </div>
            ) : (
                <h1 className="generalInformationLivestockBoxTopDataValue">{value ?? "N/A"}</h1>
       
            )}

        </div>
    );
};

interface HistoryItem {
    title: string;
    value: string | number;
}

interface DetailInformationCardProps {
    // conditionTitle: string;
    // conditionValue: string;
    historyTitle: string;
    historyItems: HistoryItem[];
    livestock: null | Livestock;
}

const DetailInformationCard: React.FC<DetailInformationCardProps> = ({
    // conditionTitle,
    // conditionValue,
    historyTitle,
    historyItems,
    livestock,
    
}) => {
    const router = useRouter(); // Gunakan useRouter dari Next.js

    const getPageUrl = (title: string) => {
        switch (title) {
            case "Riwayat Sakit":
                return "/defaultView/[id]/sickness";
            case "Riwayat Obat":
                return "/defaultView/[id]/medication";
            case "Riwayat Vitamin":
                return "/defaultView/[id]/vitamin";
            case "Riwayat Vaksin":
                return "/defaultView/[id]/vaccine";
            default:
                return "/defaultView/[id]";
        }
    };

    const handleNavigate = () => {
        // const pageUrl = getPageUrl(historyTitle);
        // router.push(pageUrl); 
        const pageUrl = getPageUrl(historyTitle);
        const dynamicUrl = pageUrl.replace("[id]", livestock == null ? "" : `${livestock.id}`);
        router.push(dynamicUrl);
    };

    return (
        <div className="detailInformationLivestockCard">
            <div className="detailInformationLivestockCardData">
                {/* Condition Section */}

                {/* History Section */}
                <div className="detailInformationLivestockCardDataHistory">
                    <h1 className="detailInformationLivestockCardDataCategoryTitle">{historyTitle}</h1>
                    <div className="detailInformationLivestockCardDataHistoryData">
                        {historyItems.map((item, index) => (
                            <div
                                key={index}
                                className="detailInformationLivestockCardDataHistoryDataDetail"
                            >
                                <h1 className="detailInformationLivestockCardDataHistoryDataTitle">
                                    {item.title}
                                </h1>
                                <h1 className="detailInformationLivestockCardDataHistoryDataValue">
                                    {item.value}
                                </h1>
                                
                               
                            </div>
                        ))}
                    </div>
                    <div className="perbaruiButtonOwnerPage">
                          <PerbaruiButton 
                          label={'Perbarui'}
                          onClick={handleNavigate}
                          />
                    </div>
                  
                </div>
            </div>
        </div>
    );
};