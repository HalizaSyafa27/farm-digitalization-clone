"use client";

import React, { ReactNode, use, useEffect, useState } from 'react';

import Sidebar from '@/components/ui/Sidebar/sidebar';
import GenderIcon from '@/components/ui/genderIcon';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import TopBar from '@/components/ui/TopBar/topBar';
import PrimaryTextField from '@/components/ui/PrimaryTextField/primaryTextField';
import { Input } from "@/components/ui/input"
import DropdownFase from '@/components/ui/DropdownPhase/DropdownPhase';
import { useRouter } from 'next/navigation'
import { getCookie } from '@/lib/cookies';
import useFetch from '@/hooks/useFetch';
import { FarmModel } from '@/models/FarmModel';
import { Livestock, MonthlyData, YearlyData } from '@/models/LivestockModel';
import { Lactation } from '@/models/LactationModel'

interface LivestockLactationPageProps {
    params: Promise<{
        id: string;
    }>;
}

interface LactationPayload {
    livestockId: number;
    spouseId: string;
    dob: Date;
    totalChild: number;
    totalFemaleChild: number;
    totalMaleChild: number;
    lactationNumber: number;
}

interface LactationDataPayload {
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

const LivestockLactationPage: React.FC<LivestockLactationPageProps> = ({ params: paramsPromise }) => {
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

    const Label: React.FC<{ title: ReactNode }> = ({ title }) => (
        <label className="label-addTernak">{title}</label>
    );

    const { data: livestock, loading: loadingLivestock, error: errorLivestock } = useFetch<Livestock>(
        `${process.env.NEXT_PUBLIC_API_HOST}/livestocks/${id}`,
    );
    useEffect(() => {
        if (livestock) {
            console.log(livestock)
        }
    }, [livestock]);

    // const { data: lactation, loading: loadingLactation, error: errorLactation } = useFetch<LactationRecord[]>(
    //     `${process.env.NEXT_PUBLIC_API_HOST}/lactationData/livestocks/${id}`,
    // );

    const router = useRouter()

    const [apiError, setApiError] = useState(null);
    const [apiData, setApiData] = useState(null);
    const [error, setError] = useState(false);

    const [dropdownData, setDropdownData] = useState<{ [key: number]: string }>({});

    const dateNow = new Date(Date.now())
    const day = dateNow.getDate()
    const month = dateNow.getMonth()
    const year = dateNow.getFullYear()
    const fullDate = String(day + "-" + month + "-" + year)

    const [idPasangan, setIdPasangan] = useState(livestock?.lactation[livestock?.lactation.length - 1].spouseId ?? "");
    //TODO laktasi masi belum
    const [date, setDate] = useState(fullDate);
    const [value, setValue] = useState(0);
    const [valueMale, setValueMale] = useState(0);
    const [valueFemale, setValueFemale] = useState(0);
    const [lactationNumber, setLactationNumber] = useState(livestock?.lactation.length ?? 1);

    const [isHamil, setIsHamil] = useState(Boolean);
    const handleDropdownSelect = (index: number, value: string) => {
        setDropdownData((prev) => ({
            ...prev,
            [index]: value
        }));
    };

    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 720);

    useEffect(() => {
        setIsHamil(livestock?.phase === "Hamil");
        if (livestock?.lactation && isHamil) {
            const index = livestock?.lactation.length - 1
            setIdPasangan(livestock?.lactation[index].spouseId)
            setLactationNumber(livestock?.lactation.length)
        }
    }, [livestock])

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
            setValue(valueFemale + valueMale)
            if (value > 0) {
                let payload: LactationPayload = {
                    livestockId: Number(id),
                    spouseId: idPasangan,
                    dob: new Date(date),
                    totalChild: valueFemale + valueMale,
                    totalFemaleChild: valueFemale,
                    totalMaleChild: valueMale,
                    lactationNumber: lactationNumber
                }
                console.log("payload :" + payload.livestockId)
                const length = livestock?.lactation != null ? livestock?.lactation.length : 0;
                let response;
                if (isHamil && length > 1) {
                    response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/lactationData/${livestock?.lactation[length - 1]?.id}`, {
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
                } else {
                    alert("Data tidak valid untuk menambahkan riwayat laktasi!");
                    // response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/lactationData`, {
                    //     method: "POST",
                    //     body: JSON.stringify(payload),
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //     },
                    // });
                }
            } else {
                setError(true)
            }
        } catch (error) {
        } finally {
            // setLoading(false);
        }
    };

    return (
        <div>
            <div className="layout">
                {
                    isMobile ?
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

                                            <div className="rowContent-lactation">

                                                <div className='fieldFormVertical-lactation'>
                                                    <h1 className='livestockHistoryTitle'>
                                                        Laktasi
                                                    </h1>
                                                    <div>
                                                        <Label title="ID Pasangan *" />
                                                        <Input
                                                            disabled={false}
                                                            type="text"
                                                            placeholder="ID Pasangan"
                                                            value={idPasangan ?? ""}
                                                            onChange={(e) => setIdPasangan(e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label title={<span className="text-[18px]">Tanggal *</span>} />
                                                        <Input
                                                            disabled={false}
                                                            type="date"
                                                            value={date}
                                                            onChange={(e) => setDate(e.target.value)}
                                                        />
                                                    </div>
                                                    {/* 
                                    <PrimaryTextField width={350} placeholder='DD/MM/YYYY'label='Tanggal Lahir *'/> */}
                                                    {/* <h1>Date of Birth *</h1>
                                    <Input disabled={false} type="text" placeholder="DD/MM/YYY" className="styledInput" /> */}

                                                    {/* <Label title="Laktasi *" />
                                    <Input disabled={false} type="number" placeholder="Laktasi" className="styledInput" /> */}

                                                    <div className="row-lactation">
                                                        <div>
                                                            <Label title="Laktasi Ke*" />
                                                            <Input
                                                                disabled={false}
                                                                type="number"
                                                                value={lactationNumber}
                                                                onChange={(e) => setLactationNumber(Number(e.target.value))}
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label title={<span className="text-[18px]">Jumlah anak</span>} />
                                                            <div className="input-group-addTernak">
                                                                <Input disabled={true} type="number" placeholder="liter" value={valueFemale + valueMale} onChange={(e) => setValue(Number(e.target.value))} />
                                                            </div>
                                                        </div>

                                                    </div>


                                                    <div className='row-lactation'>
                                                        <div className="textField">
                                                            <h1 className="jenisKelaminLactationForm">Jumlah Anak Jantan *</h1>
                                                            <div className="input-group-addTernak">
                                                                <Input disabled={false} type="number" placeholder="liter" value={valueMale} onChange={(e) => setValueMale(Number(e.target.value))} />
                                                            </div>
                                                        </div>
                                                        <div className="textField">
                                                            <h1 className="jenisKelaminLactationForm">Jumlah Anak Betina *</h1>
                                                            <div className="input-group-addTernak">
                                                                <Input disabled={false} type="number" placeholder="liter" value={valueFemale} onChange={(e) => setValueFemale(Number(e.target.value))} />
                                                            </div>
                                                        </div>
                                                        {/* {value != 0 &&
                                                            (() => {
                                                                const elements = [];
                                                                for (let i = 0; i < value; i++) {
                                                                    elements.push(
                                                                        <div className="textField">
                                                                            <h1 className="jenisKelaminLactationForm">Jenis Kelamin Anak {i + 1} *</h1>
                                                                            <DropdownFase
                                                                                options={['Jantan', 'Betina']}
                                                                                placeholder="Jenis Kelamin"
                                                                                onSelect={handleDropdownSelect}
                                                                            />
                                                                        </div>
                                                                    );
                                                                }
                                                                return elements;
                                                            })()
                                                        } */}
                                                    </div>
                                                </div>

                                                <div className="separator-lactation">

                                                </div>
                                                <div className="lactation-list">
                                                    <h1 className='livestockHistoryTitle'>
                                                        Riwayat Laktasi
                                                    </h1>
                                                    <DetailHistoryCard lactations={livestock?.lactation ?? []} />

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

                                            <div className="rowContent-lactation">

                                                <div className='fieldFormVertical-lactation'>
                                                    <h1 className='livestockHistoryTitle'>
                                                        Laktasi
                                                    </h1>
                                                    <div>
                                                        <Label title="ID Pasangan *" />
                                                        <Input
                                                            disabled={false}
                                                            type="text"
                                                            placeholder="ID Pasangan"
                                                            value={idPasangan ?? ""}
                                                            onChange={(e) => setIdPasangan(e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label title="Tanggal *" />
                                                        <Input
                                                            disabled={false}
                                                            type="date"
                                                            value={date}
                                                            onChange={(e) => setDate(e.target.value)}
                                                        />
                                                    </div>
                                                    {/* 
                                    <PrimaryTextField width={350} placeholder='DD/MM/YYYY'label='Tanggal Lahir *'/> */}
                                                    {/* <h1>Date of Birth *</h1>
                                    <Input disabled={false} type="text" placeholder="DD/MM/YYY" className="styledInput" /> */}

                                                    {/* <Label title="Laktasi *" />
                                    <Input disabled={false} type="number" placeholder="Laktasi" className="styledInput" /> */}

                                                    <div className="row-lactation">
                                                        <div>
                                                            <Label title="Laktasi Ke*" />
                                                            <Input
                                                                disabled={false}
                                                                type="number"
                                                                value={lactationNumber}
                                                                onChange={(e) => setLactationNumber(Number(e.target.value))}
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label title="Jumlah anak" />
                                                            <div className="input-group-addTernak">
                                                                <Input disabled={false} type="number" placeholder="liter" value={valueMale + valueFemale} onChange={(e) => setValue(Number(e.target.value))} />
                                                            </div>
                                                        </div>

                                                    </div>


                                                    <div className='row-lactation'>
                                                        <div className="textField">
                                                            <h1 className="jenisKelaminLactationForm">Jumlah Anak Jantan *</h1>
                                                            <div className="input-group-addTernak">
                                                                <Input disabled={false} type="number" placeholder="liter" value={valueMale} onChange={(e) => setValueMale(Number(e.target.value))} />
                                                            </div>
                                                        </div>
                                                        <div className="textField">
                                                            <h1 className="jenisKelaminLactationForm">Jumlah Anak Betina *</h1>
                                                            <div className="input-group-addTernak">
                                                                <Input disabled={false} type="number" placeholder="liter" value={valueFemale} onChange={(e) => setValueFemale(Number(e.target.value))} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="separator-lactation">

                                                </div>
                                                <div className="lactation-list">
                                                    <h1 className='livestockHistoryTitle'>
                                                        Riwayat Laktasi
                                                    </h1>
                                                    <DetailHistoryCard lactations={livestock?.lactation ?? []} />
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

export default LivestockLactationPage

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
                        rel="noopener noreferrer">
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

interface DetailLactationCardProps {
    lactations: Lactation[]
}
const DetailHistoryCard: React.FC<DetailLactationCardProps> = ({
    lactations
}) => {
    return (
        <div>
            {lactations.map((lactation, index) => {
                const dob = new Date(lactation.dob); // dob ubah menjadi Date
                return (
                    <div key={index} className="lactation-detailList">
                        <h2>Laktasi ke-{lactation.lactationNumber}</h2>
                        <span>ID Pasangan: {lactation.spouseId}</span>
                        <span>Tanggal Lahir: {dob.getDate()} {dob.toLocaleString('default', { month: 'long' })} {dob.getFullYear()}</span>
                        <span>{lactation?.totalFemaleChild} Betina, {lactation?.totalMaleChild} Jantan</span>
                    </div>
                );
            })}
        </div>
    )
}

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