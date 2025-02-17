'use client'

import React, { useState } from 'react';
import livestockCategories from '@/models/LivestockCategories';
import TopBar from '@/components/ui/TopBar/topBar';
import SidebarDisabled from '@/components/ui/SidebarDisabled/SidebarDisabled';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import InviteFarmModal from '@/components/ui/InviteFarmModal/InviteFarmModal';
import { usersData } from '@/data/userData';
import styles from "./defaultOwnerViewPage.module.css"
import useFetch from '@/hooks/useFetch';
import { FarmModel } from '@/models/FarmModel';
import { getCookie } from '@/lib/cookies';
import TopBarOpt from '@/components/ui/TopBarOpt/TopBarOpt';

const DefaultOwnerViewPage: React.FC<{ setIsFarmInvited: (value: boolean) => void }> = ({
  setIsFarmInvited,
}) => {
  const storedId = getCookie("id"); 
  const role = getCookie("role"); 
  
  const { data, loading, error } = useFetch<FarmModel[]>(
      `${process.env.NEXT_PUBLIC_API_HOST}/farms?ownerId=${storedId}`,
      
  );

  const [breadcrumb, setBreadcrumb] = useState('Statistik');

  const categories = livestockCategories('owner');


    const [isModalOpen, setIsModalOpen] = useState(false);

    function getMenuLabel(pathname: string): string {
      switch (pathname) {
        // case '/OwnerViewPage/defaultOwnerViewPage':
        //   return 'Statistik';
        // case '/OwnerViewPage/defaultOwnerViewPage':
        //   return 'Ternak Anda';
        // case '/OwnerViewPage/defaultOwnerViewPage':
        //   return 'Aktivitas';
        // case '/OwnerViewPage/defaultOwnerViewPage':
        //   return 'Pengaturan';
        default:
          return 'Halaman Tidak Ditemukan';
      }
    }

    return (
    <div className="layout">
      <div className="sidebar">
      <SidebarDisabled setBreadcrumb={setBreadcrumb} setFarm={function (farmName: string): void {
            // throw new Error('Function not implemented.');
          } } />
      </div>

      <div className="main-content">
        {role == "owner" 
        ? 
        <TopBar ></TopBar>
        :
        <TopBarOpt></TopBarOpt>
        }
        
       
        <div className="content">
        <div className="menuSection">
          <div>
          </div>
          <div className="menuHeader">
            {/* <h1 className="menuTittle">Statistik</h1> */}
            <div className="yearAndMonthPicker">
              {/* <YearAndMonthPicker/> */}
              {role == "owner"  && (
                <PrimaryButton
                label= "+ Tambah Peternakan"
                width= {210}
                onClick={() => setIsModalOpen(true)}
                />
              )}

              {isModalOpen && (
              <InviteFarmModal
                    users={usersData} // Gunakan data dari usersData
                    onClose={() => setIsModalOpen(false)}
                    setIsFarmInvited={setIsFarmInvited} // Kirimkan prop ini  
                    farmList={data == null ? [] : data}
                    />
              )}
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.iconDefaultOwnerPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="202" height="202" viewBox="0 0 202 202" fill="none">
                        <rect width="202" height="202" fill="white"/>
                        <path d="M55.9997 90.0452L36.8164 148.339L167.976 150.867L151.47 93.6141L55.9997 90.0452Z" fill="#AAB1BA"/>
                        <path opacity="0.996" fillRule="evenodd" clipRule="evenodd" d="M116.377 77.6106H55.1094V100.274C55.6661 99.4663 56.4593 98.8888 57.4887 98.5409C61.9493 98.4392 104.733 98.3892 127.382 98.3909C127.382 98.3965 127.382 98.402 127.382 98.4076H131.545C132.254 98.4005 132.963 98.3957 133.671 98.3931C134.816 98.3939 135.854 98.3949 136.769 98.3961C139.489 98.4113 142.209 98.4596 144.929 98.5409C145.958 98.8888 146.752 99.4663 147.308 100.274V77.6106H121.879H116.377Z" fill="#C6CAD1"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M55.1095 77.6142C55.1095 85.1685 55.1095 92.7232 55.1095 100.278C51.2242 111.038 47.3082 121.792 43.3616 132.54C43.2148 132.975 43.1652 133.42 43.2129 133.873C39.2461 133.828 35.2806 133.873 31.3163 134.006C30.0715 134.456 29.1793 135.211 28.6395 136.272C28.5902 135.025 28.6398 133.781 28.7882 132.54C35.313 114.636 41.9552 96.7719 48.7151 78.9473C49.1739 78.4466 49.7192 78.0466 50.3508 77.7475C51.934 77.6144 53.5202 77.5699 55.1095 77.6142Z" fill="#E3E4E6"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M147.309 77.6142C148.898 77.5699 150.484 77.6144 152.067 77.7475C153.125 78.2519 153.869 79.0073 154.298 80.0138C160.742 97.5225 167.186 115.031 173.63 132.54C173.778 133.781 173.828 135.025 173.779 136.272C173.239 135.211 172.346 134.456 171.102 134.006C167.237 133.873 163.37 133.828 159.503 133.873C155.438 122.674 151.373 111.476 147.309 100.278C147.309 92.7232 147.309 85.1685 147.309 77.6142Z" fill="#E3E4E6"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M43.213 133.861C49.3604 133.817 55.507 133.861 61.6528 133.995C62.1721 134.12 62.6678 134.298 63.1398 134.528C65.7538 138.547 68.1825 142.679 70.4265 146.926C70.9717 147.237 71.5171 147.548 72.0623 147.859C81.6786 147.904 91.2952 147.948 100.912 147.993C110.938 148.033 120.951 147.9 130.951 147.593C131.271 147.338 131.618 147.116 131.991 146.926C134.177 143.007 136.358 139.097 138.535 135.194C139.049 134.63 139.694 134.23 140.468 133.995C142.25 133.862 144.034 133.817 145.821 133.861C149.291 133.861 152.761 133.861 156.231 133.861C157.513 134.434 158.455 135.322 159.056 136.528C159.255 147.015 159.255 157.502 159.056 167.99C158.655 169.371 157.713 170.26 156.231 170.656C114.494 170.656 72.7562 170.656 31.019 170.656C29.9344 170.261 29.1909 169.549 28.7884 168.523C28.6397 157.769 28.5901 147.015 28.6397 136.261C29.1794 135.2 30.0717 134.445 31.3164 133.995C35.2807 133.861 39.2463 133.817 43.213 133.861Z" fill="#EDEEF0"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M156.23 133.861C157.321 133.861 158.411 133.861 159.502 133.861C163.37 133.817 167.236 133.861 171.101 133.995C172.346 134.445 173.238 135.2 173.778 136.261C173.828 147.015 173.778 157.769 173.629 168.523C173.227 169.549 172.483 170.261 171.399 170.656C166.343 170.656 161.287 170.656 156.23 170.656C157.712 170.26 158.654 169.371 159.056 167.99C159.254 157.502 159.254 147.015 159.056 136.528C158.455 135.322 157.513 134.434 156.23 133.861Z" fill="#EEF0ED"/>
                        <rect x="37.7109" y="152.953" width="13.3837" height="4.16381" rx="2.08191" fill="#E6E6E6"/>
                        <rect x="37.7109" y="159.2" width="13.3837" height="4.16381" rx="2.08191" fill="#E6E6E6"/>
                        <path d="M99.2961 33.9513C95.3923 28.9314 83.3258 36.6528 83.5019 41.4106C83.678 46.1683 97.0653 54.0281 99.8538 48.4515C102.642 42.8749 97.0653 42.8868 97.0653 41.4106C97.0653 39.9343 103.2 38.9712 99.2961 33.9513Z" fill="#33CC66"/>
                        <path d="M84.5117 41.406H97.8889" stroke="#248543" strokeWidth="4.04" strokeLinecap="round"/>
                        <path d="M93.5406 127.859C93.5406 127.859 64.58 118.624 78.0995 97.7599C91.619 76.8956 136.559 97.7602 141.149 68.5097C145.738 39.2592 107.389 41.6504 107.389 41.6504" stroke="#248543" strokeWidth="4.04" strokeLinecap="round" strokeDasharray="12.12 12.12"/>
                        </svg>
            </div>


            <div>
                <h1>{role == "owner" ? "Anda belum menambah peternakan" : "Anda belum miliki peternakan saat ini"}
                <br>
                </br>{role == "owner" ? "Tambah peternakan Anda sekarang!" : "Minta pemilik peternakan untuk mengundang anda"}</h1>
            </div>

          </div>
        </div>
      </div>

      </div>
    </div>
    );
};

export default DefaultOwnerViewPage;
