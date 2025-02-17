"use client";

import React, { use, useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { useRouter } from 'next/navigation'
import { Livestock, YearlyData } from '@/models/LivestockModel';
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
import StatisticsMilkUpdateMobile from '@/components/ui/StatisticsMilkUpdateMobile/StatisticsMilkUpdate';
import StatisticsLactationMobile from '@/components/ui/StatisticsLactationMobile/statisticsLactationMobile';
import StatisticsWeightUpdateMobile from '@/components/ui/StatisticsWeightUpdateMobile/StatisticsWeightUpdate';
import MoreOptions from '@/components/ui/MoreOptions/MoreOptions';
import { Lactation } from '@/models/LactationModel';

interface LivestockDetailPageProps {
    params: Promise<{
        id: number;
    }>;
}

interface LactationDetail {
    title: string;
    descriptions: string[];
    livestock?: Livestock;
}

interface DetailLactationCardProps {
    lactationData: {
        animalId: number;
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
        `${process.env.NEXT_PUBLIC_API_HOST}/livestocks/${id}`,
    );
    useEffect(() => {
        if (livestock?.lactation) {
            console.log("generateLactation")
            const { currentLactation, lactationHistory } = generateLactationData(livestock);
            setCurrentLactation(currentLactation);
            setHistory(lactationHistory);
        }
    }, [livestock]);

    const [currentLactation, setCurrentLactation] = useState<LactationDetail | null>();
    const [history, setHistory] = useState<LactationDetail[] | null>([]);

    const generateLactationData = (livestock: Livestock) => {
        if (!livestock?.lactation || livestock.lactation.length === 0) {
            return { currentLactation: null, lactationHistory: null }; // Handle empty data
        }
        // Current Lactation
        const laktasiTerakhir = livestock?.lactation[livestock?.lactation.length - 1]
        const currentLactation = {
            title: `Laktasi ke-${laktasiTerakhir.lactationNumber}`,
            descriptions: [
                laktasiTerakhir.totalMaleChild > 0 ? `${laktasiTerakhir.totalMaleChild} Jantan - ${new Date(laktasiTerakhir.dob).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                })}` : "",
                laktasiTerakhir.totalFemaleChild > 0 ? `${laktasiTerakhir.totalFemaleChild} Betina - ${new Date(laktasiTerakhir.dob).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                })}` : ""
            ],
            livestock: livestock || undefined,
        }

        const lactationHistory = livestock?.lactation.slice(-3, -1).map((lactation: Lactation, index: number) => ({
            title: `Laktasi ke-${lactation.lactationNumber}`,
            descriptions: [
                lactation.totalMaleChild > 0 ? `${lactation.totalMaleChild} Jantan - ${new Date(lactation.dob).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                })}` : "",
                lactation.totalFemaleChild > 0 ? `${lactation.totalFemaleChild} Betina - ${new Date(lactation.dob).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                })}` : ""
            ],
            livestock: livestock || undefined,

        }));
        return { currentLactation, lactationHistory }
    }
    // Generate history by iterating through previous years
    // const history = yearlyData.slice(0, -1).map((yearData: any, index: number) => {
    //     const lactationNumber = index + 1;
    //     return {
    //         title: `Laktasi ke-${lactationNumber}`,
    //         description: `${yearData.data[0].value} Betina - ${yearData.year} ${yearData.data[0].month} ${yearData.data[yearData.data.length - 1].month}`,
    //         livestock: livestock || undefined,
    //     };
    // });
    // return { currentLactation, history };

    // const yearlyData = livestock.lactationData.yearlyDatas;

    // // const currentYearData = yearlyData[yearlyData.length - 1];
    // // const currentYearData = yearlyData.length ? yearlyData[yearlyData.length - 1] : { monthlyDatas: [] };
    // const currentYearData: YearlyData = yearlyData.length
    //     ? yearlyData[yearlyData.length - 1]
    //     : { id: 0, year: 0, conditionId: 0, conditionType: "", createdAt: "", updatedAt: "", monthlyDatas: [] };

    // const currentLactationNumber = yearlyData.length; // Number of years = current lactation number

    // // Generate current lactation title and description
    // const currentLactation = {
    //     title: `Laktasi ke-${currentLactationNumber}`,
    //     // description: `${currentYearData.monthlyDatas[0].value} Jantan - ${currentYearData.year} ${currentYearData.monthlyDatas[0].month} ${currentYearData.monthlyDatas[currentYearData.monthlyDatas.length - 1].month}`,
    //     description:
    //         currentYearData?.monthlyDatas?.length
    //             ? `${currentYearData.monthlyDatas[0]?.value ?? 0} Jantan - ${currentYearData.year} ${currentYearData.monthlyDatas[0]?.month ?? "Unknown"} ${currentYearData.monthlyDatas[currentYearData.monthlyDatas.length - 1]?.month ?? "Unknown"}`
    //             : "Data tidak tersedia",


    //     livestock: livestock || undefined,
    // }

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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/livestocks/${id}`, {
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
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 720);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 720);
        };

        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);


    return (
        <div>
            <div className="layout">
                {isMobile ?
                    (
                        <>
                            <div className="main-content">
                                <div className="content">
                                    <div className="menuSection">
                                        <div className="menuHeader">

                                            <div className='menuIcon'>
                                                <h1 className="menuTittle">{livestock == null ? "" : livestock.name_id}</h1>
                                                <div className='genderIcon'>
                                                    <GenderIcon gender={livestock == null ? "jantan" : livestock.gender == "Jantan" ? 'jantan' : 'betina'}></GenderIcon>
                                                </div>
                                            </div>


                                            {/* <div className='moreIcon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
                                        <path d="M15 8.9375C14.7514 8.9375 14.5129 8.83873 14.3371 8.66291C14.1613 8.4871 14.0625 8.24864 14.0625 8C14.0625 7.75136 14.1613 7.5129 14.3371 7.33709C14.5129 7.16127 14.7514 7.0625 15 7.0625C15.2486 7.0625 15.4871 7.16127 15.6629 7.33709C15.8387 7.5129 15.9375 7.75136 15.9375 8C15.9375 8.24864 15.8387 8.4871 15.6629 8.66291C15.4871 8.83873 15.2486 8.9375 15 8.9375ZM15 16.4375C14.7514 16.4375 14.5129 16.3387 14.3371 16.1629C14.1613 15.9871 14.0625 15.7486 14.0625 15.5C14.0625 15.2514 14.1613 15.0129 14.3371 14.8371C14.5129 14.6613 14.7514 14.5625 15 14.5625C15.2486 14.5625 15.4871 14.6613 15.6629 14.8371C15.8387 15.0129 15.9375 15.2514 15.9375 15.5C15.9375 15.7486 15.8387 15.9871 15.6629 16.1629C15.4871 16.3387 15.2486 16.4375 15 16.4375ZM15 23.9375C14.7514 23.9375 14.5129 23.8387 14.3371 23.6629C14.1613 23.4871 14.0625 23.2486 14.0625 23C14.0625 22.7514 14.1613 22.5129 14.3371 22.3371C14.5129 22.1613 14.7514 22.0625 15 22.0625C15.2486 22.0625 15.4871 22.1613 15.6629 22.3371C15.8387 22.5129 15.9375 22.7514 15.9375 23C15.9375 23.2486 15.8387 23.4871 15.6629 23.6629C15.4871 23.8387 15.2486 23.9375 15 23.9375Z" stroke="black" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        </div> */}
                                            <MoreOptions
                                                role="owner"
                                                id="123"
                                                selectedFarm="farmA"
                                                selectedFarmId="456"
                                                handleDeleteData={handleDeleteData}
                                                handleDownloadQR={handleDownloadQR}
                                                handleUbahDataRoute={() => router.push(`/defaultView/${id}/editTernakPage?selectedFarm=${selectedFarm}&farmId=${selectedFarmId}`)}
                                            />
                                        </div>
                                    </div>
                                    <div className="livestock">
                                        <div className='generalInformationLivestock'>
                                            <img className="topSection"
                                                // src={livestock == null ? "" : livestock.photo_url}
                                                src={livestock?.photo_url || "/default-image.jpg"}
                                                alt={livestock == null ? "" : livestock.name_id}
                                                style={{
                                                    width: '158px',
                                                    height: '158px',
                                                    objectFit: 'cover',
                                                    borderRadius: '10px',
                                                }}
                                            />

                                            <div className='verticalGeneralLivestockBoxBesideImg'>
                                                <GeneralInfoBox title={'Tanggal Lahir'} value={livestock == null ? "" : new Date(livestock.dob).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })} />

                                                <GeneralInfoBox title={'Ras'} value={livestock == null ? "" : livestock.breed} />

                                                <div className="phaseLabelTag-livestockOwnerPage">
                                                    <PhaseLabelTag
                                                        phases={phaseLabels}
                                                        filterId={livestock == null ? "" : livestock.phase}
                                                        width={60}
                                                        textSize={10}
                                                    >
                                                    </PhaseLabelTag>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='generalInformationLivestock2'>
                                            <div className='gradeDanBerat'>
                                                <GeneralInfoBox title={'Grade'} value={livestock == null ? "" : livestock.grade || "Undefined"} />
                                                <GeneralInfoBox title={'Berat'} value={livestock == null ? "" : livestock.weight || "Undefined"} />
                                                <GeneralInfoBox title={'Kondisi'} value={livestock == null ? "" : livestock.status || "Undefined"} />
                                            </div>

                                            <div className='familyInformation'>
                                                <h1 className='keluarga'>Keluarga</h1>
                                                <div className='idParents'>
                                                    <GeneralInfoBoxMobile title={'ID Ayah'} value={livestock == null ? "" : livestock.dad_name_id || "N/A"} isLink={true} />
                                                    <GeneralInfoBoxMobile title={'ID Ibu'} value={livestock == null ? "" : livestock.mom_name_id || "N/A"} isLink={true} />
                                                </div>
                                            </div>

                                            <div className='riwayatInformation'>
                                                <h1 className='riwayat'>Riwayat</h1>


                                            </div>

                                            <div className='cardRiwayat'>
                                                <DetailInformationCardMobile

                                                    historyTitle="Riwayat Sakit"
                                                    historyItems={livestock?.health == null ? [] : livestock.health.historyItems.length > 2 ? livestock.health.historyItems.slice(0, 2) : livestock.health.historyItems}
                                                    livestock={livestock}
                                                />
                                                <DetailInformationCardMobile

                                                    historyTitle="Riwayat Obat"
                                                    historyItems={livestock?.medication == null ? [] : livestock.medication.historyItems.length > 2 ? livestock.medication.historyItems.slice(0, 2) : livestock.medication.historyItems}
                                                    livestock={livestock}
                                                />
                                                <DetailInformationCardMobile

                                                    historyTitle="Riwayat Vitamin"
                                                    historyItems={livestock?.vitamin == null ? [] : livestock.vitamin.historyItems.length > 2 ? livestock.vitamin.historyItems.slice(0, 2) : livestock.vitamin.historyItems}
                                                    livestock={livestock}
                                                />
                                                <DetailInformationCardMobile

                                                    historyTitle="Riwayat Vaksin"
                                                    historyItems={livestock?.vaccine == null ? [] : livestock.vaccine.historyItems.length > 2 ? livestock.vaccine.historyItems.slice(0, 2) : livestock.vaccine.historyItems}
                                                    livestock={livestock}
                                                />
                                            </div>

                                            <h1 className='perkembangan'>Perkembangan</h1>
                                            <div className='statisticInformationLivestockVertical'>

                                                <div className="statisticsMilkMobile">
                                                    <StatisticsMilkUpdateMobile filterBy="year" filterValue={livestock == null ? "" : livestock.milkOutput == null ? "" : livestock.milkOutput.yearlyDatas[0].year} milkOutput={livestock == null ? undefined : livestock.milkOutput} livestock={livestock == null ? undefined : livestock} />
                                                </div>
                                                <div className='statisticsLactationMobile'>
                                                    <StatisticsLactationMobile filterBy="year" filterValue={livestock == null ? "" : livestock.lactationData == null ? "" : livestock.lactationData.yearlyDatas[0].year} lactations={livestock == null ? undefined : livestock.lactation} livestock={livestock == null ? undefined : livestock} />
                                                </div>

                                                <div className='stati'>
                                                    <StatisticsWeightUpdateMobile filterBy="year" filterValue={livestock == null ? "" : livestock.weightData == null ? "" : livestock.weightData.yearlyDatas[0].year} weightData={livestock == null ? undefined : livestock.weightData} livestock={livestock == null ? undefined : livestock} />
                                                </div>


                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>

                    ) : (
                        <>
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
                                        <div className="menuHeader">
                                            <h1 className="menuTittle">{livestock == null ? "" : livestock.name_id}</h1>
                                            <div className='genderIcon'>
                                                <GenderIcon gender={livestock == null ? "jantan" : livestock.gender == "Jantan" ? 'jantan' : 'betina'}></GenderIcon>


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
                                                <DownloadQRButton onClick={handleDownloadQR} />
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
                                            <img className="topSection"
                                                // src={livestock == null ? "" : livestock.photo_url}
                                                src={livestock?.photo_url || "/default-image.jpg"}
                                                alt={livestock == null ? "" : livestock.name_id}
                                                style={{
                                                    width: '232px',
                                                    height: '214px',
                                                    objectFit: 'cover',
                                                    borderRadius: '10px',
                                                }}
                                            />

                                            <div className='generalInformationLivestockBox'>

                                                <div className='generalInformationLivestockBoxTop'>
                                                    <GeneralInfoBox title={'Tanggal Lahir'} value={livestock == null ? "" : new Date(livestock.dob).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })} />

                                                    <GeneralInfoBox title={'Ras'} value={livestock == null ? "" : livestock.breed} />

                                                    <GeneralInfoBox title={'Grade'} value={livestock == null ? "" : livestock.grade || "Undefined"} />
                                                    <GeneralInfoBox title={'Berat'} value={livestock == null ? "" : livestock.weight || "Undefined"} />
                                                </div>
                                                <div className='generalInformationLivestockBoxBottom'>
                                                    <GeneralInfoBox title={'ID Ayah'} value={livestock == null ? "" : livestock.dad_name_id || "N/A"} ras={'Purebred'} isLink={true} />
                                                    <GeneralInfoBox title={'ID Ibu'} value={livestock == null ? "" : livestock.mom_name_id || "N/A"} grade={'F1'} isLink={true} />
                                                </div>

                                            </div>
                                        </div>
                                        <div className='detailInformationLivestock'>
                                            <DetailInformationCard

                                                historyTitle="Riwayat Sakit"
                                                historyItems={livestock?.health == null ? [] : livestock.health.historyItems.length > 2 ? livestock.health.historyItems.slice(0, 2) : livestock.health.historyItems}
                                                livestock={livestock}
                                            />
                                            <DetailInformationCard

                                                historyTitle="Riwayat Obat"
                                                historyItems={livestock?.medication == null ? [] : livestock.medication.historyItems.length > 2 ? livestock.medication.historyItems.slice(0, 2) : livestock.medication.historyItems}
                                                livestock={livestock}
                                            />
                                            <DetailInformationCard

                                                historyTitle="Riwayat Vitamin"
                                                historyItems={livestock?.vitamin == null ? [] : livestock.vitamin.historyItems.length > 2 ? livestock.vitamin.historyItems.slice(0, 2) : livestock.vitamin.historyItems}
                                                livestock={livestock}
                                            />
                                            <DetailInformationCard

                                                historyTitle="Riwayat Vaksin"
                                                historyItems={livestock?.vaccine == null ? [] : livestock.vaccine.historyItems.length > 2 ? livestock.vaccine.historyItems.slice(0, 2) : livestock.vaccine.historyItems}
                                                livestock={livestock}
                                            />
                                        </div>
                                        <div className='statisticsInformationLivestock'>

                                            <StatisticsMilkUpdate filterBy="year" filterValue={livestock == null ? "" : livestock.milkOutput == null ? "" : livestock.milkOutput.yearlyDatas[0].year} milkOutput={livestock == null ? undefined : livestock.milkOutput} livestock={livestock == null ? undefined : livestock} />
                                            <div className="lactationSection">
                                                <StatisticsLactation
                                                    filterBy="year"
                                                    filterValue={livestock == null ? "" : livestock.lactation == null ? "" : livestock.lactation.length}
                                                    lactations={livestock == null ? [] : livestock.lactation} />
                                                <DetailLactationCard currentLactation={currentLactation} history={history} livestock={livestock == null ? undefined : livestock} />
                                            </div>


                                            <StatisticsWeightUpdate filterBy="year" filterValue={livestock == null ? "" : livestock.weightData == null ? "" : livestock.weightData.yearlyDatas[0].year} weightData={livestock == null ? undefined : livestock.weightData} livestock={livestock == null ? undefined : livestock} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </>
                    )}
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
    className?: string;
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

interface GeneralInfoBoxMobileProps {
    title: string;
    value: string | number | null;
    isLink?: boolean; // Optional parameter to determine if the value is a hyperlink
    linkHref?: string; // URL for the hyperlink
    ras?: string;
    grade?: string;
    className?: string;
}

const GeneralInfoBoxMobile: React.FC<GeneralInfoBoxMobileProps> = ({ title, value, isLink = false, linkHref = "#", ras, grade }) => {
    return (
        <div className="generalInformationLivestockBoxMobileTopData">
            <h1 className="generalInformationLivestockBoxMobileTopDataTitle">{title}</h1>
            {isLink ? (
                <div>
                    <a
                        href={linkHref}
                        className="generalInformationLivestockBoxMobileTopDataValue hyperlinkStyle"
                        target="_blank"
                        rel="noopener noreferrer"

                    >


                        {value ?? "N/A"}
                    </a>

                    <p>{ras}</p>
                    <p>{grade}</p>

                </div>
            ) : (
                <h1 className="generalInformationLivestockBoxMobileTopDataValue">{value ?? "N/A"}</h1>

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

interface DetailInformationCardMobileProps {
    // conditionTitle: string;
    // conditionValue: string;
    historyTitle: string;
    historyItems: HistoryItem[];
    livestock: null | Livestock;
}

const DetailInformationCardMobile: React.FC<DetailInformationCardMobileProps> = ({
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

                    <div className="perbaruiButtonMobilePage">
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