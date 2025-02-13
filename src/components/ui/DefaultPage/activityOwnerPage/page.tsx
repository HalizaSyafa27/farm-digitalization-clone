"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './ActivityPage.module.css';

import Sidebar from '@/components/ui/Sidebar/sidebar';
import { User } from '@/models/UserModel';
import { ActivityModel } from '@/models/ActivityModel';
import TopBar from '@/components/ui/TopBar/topBar';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import InviteModal from '@/components/ui/InviteModal/InviteModal';
import { getCookie } from '@/lib/cookies';
import useFetch from '@/hooks/useFetch';
import { FarmModel } from '@/models/FarmModel';

const ActivityPage: React.FC = () => {
    const router = useRouter();

    const storedId = getCookie("id") || ""; // Ensure `storedId` is never undefined
    const role = getCookie("role") || ""; // Ensure `role` is never undefined

    const { data: farmData = [], loading: loadingFarms, error: errorFarms } = useFetch<FarmModel[]>(
        role === "owner"
            ? `${process.env.NEXT_PUBLIC_API_HOST}/farms?ownerId=${storedId}`
            : `${process.env.NEXT_PUBLIC_API_HOST}/farms/operator/${storedId}`
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

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div className="layout">
                <div className="sidebar">
                  <Sidebar 
                      setBreadcrumb={function (label: string): void {
                        //   throw new Error('Function not implemented.');
                      }} 
                      farmList={farmData == null ? [] : farmData}
                      setFarm={handleFarmChange}
                      selectedFarm={selectedFarm}
                  />
                </div>

                <div className="main-content">
                    <TopBar />

                    <div className="content">
                        <div className="menuSection">
                            <div className="menuHeader">
                                <div>
                                    <h1 className="menuTittle">Aktivitas Tim</h1>
                                </div>
                                <div className="primaryButton">
                                  {role == "owner" 
                                  ? 
                                    <PrimaryButton
                                        label="+ Undang Anggota"
                                        width={194}
                                        onClick={() => setIsModalOpen(true)}
                                    />
                                  :
                                    <div></div>
                                  }
                                    {isModalOpen && (
                                        <InviteModal
                                            users={selectedFarmModel?.operators || []}
                                            onClose={() => setIsModalOpen(false)}
                                            farmId={selectedFarmModel?.id == null ? "" : `${selectedFarmModel?.id}`}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="activityInformation">
                                <div className="activityInformationTeams">
                                    <h1 className="activityInformationTeamsHeading">Anggota</h1>
                                    <div className="activityInformationTeamsTable">
                                        <div className="activityInformationTeamsTableHeader">
                                            <h1>Nama</h1>
                                            <div className="activityInformationTeamsTableCont">
                                                <h1>Posisi</h1>
                                                <h1>Aktif Terakhir</h1>
                                            </div>
                                        </div>
                                        <div className="activityInformationTeamsTableRows">
                                            <MemberRow
                                                user={selectedFarmModel?.owner}
                                                role="Pemilik"
                                            />
                                            {selectedFarmModel?.operators?.map((user) => (
                                                <MemberRow key={user.id} user={user} role="Operator" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className='activities'>
                                  <div className='activitiesHeader'>
                                    <h1>Aktivitas</h1>
                                  </div>
                                  <div className='activitiesTimeline'>
                                  {/* {activities
                                    .filter(activity => activity.farm.includes(selectedFarm))
                                    .map((activity, index, array) => (
                                      <ActivityRow 
                                        key={activity.id}
                                        activity={activity} 
                                        isFirst={index === 0}
                                      />
                                    ))} */}
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityPage;

interface MemberRowProps {
    user?: User | null;
    role: string;
}

const MemberRow: React.FC<MemberRowProps> = ({ user, role }) => {
    return (
        <div>
            <hr className="activityTeamHr" />
            <div className="activityInformationTeamsTableRowsData">
                <div className="activityInformationTeamsTableRowsDataMember">
                    <div className="activityInformationTeamsTableRowsDataMemberInfo">
                        <h1>{user?.name || "N/A"}</h1>
                        <p>{user?.email || "N/A"}</p>
                    </div>
                </div>
                <div className="activityInformationTeamsTableRowsDataInfo">
                    <div className="activityInformationTeamsTableRowsDataInfoPosition">
                        <div className="activityInformationTeamsTableRowsDataInfoPositionBox">
                            <h1>{role}</h1>
                        </div>
                        <p>{user?.last_time_online ? new Date(user.last_time_online).toLocaleString() : "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
