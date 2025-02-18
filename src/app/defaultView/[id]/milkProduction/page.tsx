"use client";

import React, { ReactNode, use, useEffect, useState } from 'react';

import Sidebar from '@/components/ui/Sidebar/sidebar';
import GenderIcon from '@/components/ui/genderIcon';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import TopBar from '@/components/ui/TopBar/topBar';
import PrimaryTextField from '@/components/ui/PrimaryTextField/primaryTextField';
import { useRouter } from 'next/navigation'
import { getCookie } from '@/lib/cookies';
import useFetch from '@/hooks/useFetch';
import { FarmModel } from '@/models/FarmModel';
import { Livestock, MonthlyData, YearlyData } from '@/models/LivestockModel';
import { Input } from '@/components/ui/input';

interface LivestockMilkProductionPageProps {
    params: Promise<{
        id: string;
    }>;
}

interface MilkOutputPayload {
    livestockId: string;
    yearlyData: YearlyDataPayload[];
}

interface YearlyDataPayload {
    year: number;
    data: MonthlyDataPayload[];
}

interface MonthlyDataPayload {
    month: string;
    value: number;
}

const LivestockMilkProductionPage: React.FC<LivestockMilkProductionPageProps> = ({ params: paramsPromise }) => {
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
        if (livestock) {
            console.log(livestock)
        }
    }, [livestock]);

    // const { data: milkOutput, loading: loadingMilkOutput, error: errorMilkOutput } = useFetch<MilkProductionRecord[]>(
    //     `${process.env.NEXT_PUBLIC_API_HOST}/milkOutput/livestock/${id}`,
    // );

    const router = useRouter()

    const [apiError, setApiError] = useState(null);
    const [apiData, setApiData] = useState(null);

    const dateNow = new Date(Date.now())
    const day = dateNow.getDate()
    const month = dateNow.getMonth()
    const year = dateNow.getFullYear()
    const fullDate = String(day + "-" + month + "-" + year)
    const [date, setDate] = useState(fullDate);

    const [value, setValue] = useState(0);

    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 720);


    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 720);
        };

        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const handleSubmit = async () => {
        const year = new Date(date).getFullYear();
        const month = new Date(date).toLocaleString('default', { month: 'short' });

        try {
            if (livestock?.milkOutput == null) {
                const payload = {
                    livestockId: id,
                    quantity: value,
                    yearlyData: [
                        {
                            // year:  year,
                            // monthlyDatas: [
                            //     {
                            //         month: month,
                            //         value: value
                            //     }
                            // ]
                            year: new Date(date).getFullYear(),
                            data: [
                                { month: new Date(date).toLocaleString('default', { month: 'short' }), value: value }
                            ]
                        }
                    ]
                };

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/milkOutput`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    router.replace(`/defaultView/${id}`);
                } else {
                    setApiError(data.error || "Something went wrong");
                }
            } else {
                let payload: MilkOutputPayload = {
                    livestockId: id,
                    yearlyData: []
                };

                livestock.milkOutput.yearlyDatas.forEach((milkEntry: YearlyData) => {
                    let yearData = payload.yearlyData.find((item) => item.year === milkEntry.year);

                    if (!yearData) {
                        yearData = { year: milkEntry.year, data: [] };
                        payload.yearlyData.push(yearData);
                    }

                    milkEntry.monthlyDatas.forEach((milkMonthData: MonthlyData) => {
                        let monthData = yearData.data.find((item) => item.month === milkMonthData.month);
                        if (monthData) {
                            monthData.value += milkMonthData.value;
                        } else {
                            yearData.data.push({ month: milkMonthData.month, value: milkMonthData.value });
                        }
                    });
                });

                let yearData = payload.yearlyData.find((item) => item.year === year);
                if (!yearData) {
                    yearData = { year, data: [] };
                    payload.yearlyData.push(yearData);
                }

                let monthData = yearData.data.find((item) => item.month === month);
                if (monthData) {
                    monthData.value += value;
                } else {
                    yearData.data.push({ month, value });
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/milkOutput/${livestock?.milkOutput.id}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    router.replace(`/defaultView/${id}`);
                } else {
                    setApiError(data.error || "Something went wrong");
                }
            }

        } catch (error) {
        } finally {
            // setLoading(false);
        }
    };

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
                                            <h1 className="menuTittle">{livestock == null ? "" : livestock.name_id}</h1>
                                            <div className='genderIcon'>
                                                <GenderIcon gender={livestock == null ? "jantan" : livestock.gender == "Jantan" ? 'jantan' : 'betina'}></GenderIcon>
                                            </div>
                                            <div className="deleteIcon">
                                                <PrimaryButton
                                                    label='Perbarui'
                                                    width={130}
                                                    onClick={() => {
                                                        handleSubmit();
                                                    }}
                                                />
                                                {/* <DeleteButton /> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='livestock'>
                                        <div className='generalInformationLivestock'>
                                            <img
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
                                            <div className='verticalGeneralLivestockBoxBesideImg'>
                                                <GeneralInfoBox title={'Tanggal Lahir'} value={livestock == null ? "" : new Date(livestock.dob).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })} />

                                                <GeneralInfoBox title={'Ras'} value={livestock == null ? "" : livestock.breed} />

                                                {/* <div className="phaseLabelTag-livestockOwnerPage">
                                                    <PhaseLabelTag 
                                                    phases={phaseLabels} 
                                                    filterId={livestock == null ? "" : livestock.phase}
                                                    width={60}
                                                    textSize={10}                                    
                                                    >
                                                    </PhaseLabelTag>
                                                 </div> */}
                                            </div>
                                        </div>

                                        <div>
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
                                        </div>
                                        <div className="rowContent-milk">

                                            <div className='fieldFormVertical-milk'>

                                                <h1 className='livestockHistoryTitle'>
                                                    Hasil Susu
                                                </h1>

                                                <Label title={<span className="text-[18px]">Tanggal *</span>} />
                                                <Input
                                                    disabled={false}
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                />
                                                <div>
                                                    <Label title={<span className="text-[18px]">Produksi</span>} />
                                                    <div className="input-group-addTernak">
                                                        <Input disabled={false} type="number" placeholder="liter" value={value} onChange={(e) => setValue(Number(e.target.value))} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="separator-milk">

                                            </div>

                                            <div className="milk-list">

                                                <h1 className='livestockHistoryTitle'>
                                                    Riwayat Susu
                                                </h1>

                                                <DetailHistoryCard yearlyDatas={livestock == null ? [] : livestock.milkOutput == null ? [] : livestock.milkOutput.yearlyDatas} />
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
                                            <div className="deleteIcon">
                                                <PrimaryButton
                                                    label='Perbarui'
                                                    width={130}
                                                    onClick={() => {
                                                        handleSubmit();
                                                    }}
                                                />
                                                {/* <DeleteButton /> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='livestock'>
                                        <div className='generalInformationLivestock'>
                                            <img
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
                                            {/* <QRCodeSVG value={`${process.env.NEXT_PUBLIC_NEXT_HOST}/OwnerViewPage/livestockOwnerPage/${id}`} size={85} /> */}
                                            <div className='generalInformationLivestockBox'>
                                                <div className='generalInformationLivestockBoxTop'>
                                                    <GeneralInfoBox title={'Tanggal Lahir'} value={livestock == null ? "" : new Date(livestock.dob).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })} ></GeneralInfoBox>
                                                    <GeneralInfoBox title={'Ras'} value={livestock == null ? "" : livestock.breed} ></GeneralInfoBox>
                                                    <GeneralInfoBox title={'Grade'} value={livestock == null ? "" : livestock.grade || "Undefined"} ></GeneralInfoBox>
                                                    <GeneralInfoBox title={'Berat'} value={livestock == null ? "" : livestock.weight || "Undefined"} ></GeneralInfoBox>
                                                </div>
                                                <div className='generalInformationLivestockBoxTop'>
                                                    <GeneralInfoBox title={'ID Ayah'} value={livestock == null ? "" : livestock.dad_name_id || "N/A"} ras={'Purebred'} isLink={true} linkHref='' ></GeneralInfoBox>
                                                    <GeneralInfoBox title={'ID Ibu'} value={livestock == null ? "" : livestock.mom_name_id || "N/A"} grade={'F1'} isLink={true} linkHref='' ></GeneralInfoBox>
                                                    {/* <GeneralInfoBox title={'ID Kakak'} value={livestock == null ? "" : livestock.grandpa_name_id || "N/A"} ras={'Purebred'} isLink={true} linkHref='' ></GeneralInfoBox>
                                            <GeneralInfoBox title={'ID Nenek'} value={livestock == null ? "" : livestock.grandma_name_id || "N/A"} grade={'F3'} isLink={true} linkHref='' ></GeneralInfoBox> */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rowContent-milk">

                                            <div className='fieldFormVertical-milk'>

                                                <h1 className='livestockHistoryTitle'>
                                                    Hasil Susu
                                                </h1 >

                                                <Label title="Tanggal *" />
                                                <Input
                                                    disabled={false}
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                />
                                                <div>
                                                    <Label title="Produksi" />
                                                    <div className="input-group-addTernak">
                                                        <Input disabled={false} type="number" placeholder="liter" value={value} onChange={(e) => setValue(Number(e.target.value))} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="separator-milk">

                                            </div>

                                            <div className="milk-list">

                                                <h1 className='livestockHistoryTitle'>
                                                    Riwayat Susu
                                                </h1>
                                                <DetailHistoryCard yearlyDatas={livestock == null ? [] : livestock.milkOutput == null ? [] : livestock.milkOutput.yearlyDatas} />
                                                {/* {
                                    
                                    livestock?.milkOutput?.yearlyDatas.map((milk) => (
                                        milk.monthlyDatas.map((
                                            monthlyData
                                        ) => (
                                            <div className="milk-detailList">
                                        <h1>{new Date(monthlyData.updatedAt).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        })}</h1>
                                        <span>{monthlyData.value} Liter</span> 
                                        </div>
                                        )
                                        )
                                    ))
                                } */}
                                            </div>
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

export default LivestockMilkProductionPage

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

interface DetailHistoryCardProps {
    yearlyDatas: YearlyData[];
}

const DetailHistoryCard: React.FC<DetailHistoryCardProps> = ({
    yearlyDatas
}) => {
    return (
        <div>
            {yearlyDatas.map((yearlyData, yearIndex) => (
                <div key={`year-${yearIndex}`} className='livestockHistoryData'>
                    <div key={`year-item-${yearIndex}`} className='livestockHistoryItem'>
                        {yearlyData?.monthlyDatas?.map((monthlyData, index) => (
                            <div key={index} className="milk-detailList">
                                <h1>{String(monthlyData?.date != null ? monthlyData?.date : "" + " " + monthlyData?.month + " " + yearlyData.year)}</h1>
                                <span>{monthlyData?.value + " liter"}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const Label: React.FC<{ title: ReactNode }> = ({ title }) => (
    <label className="label-addTernak">{title}</label>
);
