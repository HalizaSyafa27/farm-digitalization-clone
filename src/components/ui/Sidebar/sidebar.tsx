'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link"
import styles from "@/components/ui/Sidebar/Sidebar.module.css"
// import { farmListData } from '@/data/farmData';
import { FarmModel } from '@/models/FarmModel';
import { usePathname } from 'next/navigation';
import Logo from "@/components/ui/Logo/Logo"
import { getCookie } from '@/lib/cookies';

interface SidebarProps {
  onMenuClick: (menu: string) => void;
  farmList?: FarmModel[];
  setFarm: (farmName: string, farmId: number) => void;
  selectedFarm: string | null;
}
interface MenuItem {
  href: string;
  label: string;
  icon: React.JSX.Element;
}
const roleFromCookie = getCookie("role"); // Ambil role dari cookie
const viewType: 'owner' | 'operator' = roleFromCookie === "operator" ? 'operator' : 'owner'; // Default ke 'owner' jika tidak ada role

const menuItems : MenuItem[] = [
  {
    // href: viewType === 'owner'
    // ? "/OwnerViewPage"
    // : "/OperatorViewPage",
    href: "/defaultView?view=statistik",
    label: "Statistik",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          id="icon"
          d="M3 3V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H21"
          stroke="#808080"
          strokeWidth="2"
          strokeMiterlimit="5.759"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M7 14L11 10L15 14L21 8" stroke="#808080" strokeWidth="2" strokeMiterlimit="5.759" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 8H21V11" stroke="#808080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    // href: viewType === 'owner'
    // ? "/OwnerViewPage/livestockOwnerPage"
    // : "/OperatorViewPage/livestockOperatorPage",
    href: "/defaultView?view=livestock",
    label: "Ternak Anda",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#clip0_1080_2609)">
          <path fillRule="evenodd" clipRule="evenodd" d="M10.9409 15.9181H13.9551C13.9555 16.1556 13.987 16.3853 14.0497 16.6071C13.917 16.6619 13.8115 16.767 13.7561 16.8994C13.7007 17.0318 13.7001 17.1807 13.7543 17.3136L13.7772 17.3703C13.8378 17.5183 13.9546 17.6361 14.102 17.698C14.2494 17.7598 14.4154 17.7605 14.5633 17.7L14.6302 17.6723C14.8388 17.9147 15.0896 18.1305 15.3735 18.3113C15.2162 18.6049 15.3235 18.9744 15.6171 19.1324C15.7579 19.208 15.923 19.2245 16.0761 19.1784C16.2292 19.1323 16.3577 19.0273 16.4333 18.8864L16.4833 18.7936C16.8813 18.8976 17.2923 18.9437 17.7034 18.9304L17.7191 19.0118C17.7325 19.091 17.7616 19.1668 17.8047 19.2346C17.8479 19.3024 17.9041 19.3609 17.9701 19.4067C18.0362 19.4525 18.1107 19.4846 18.1894 19.5011C18.268 19.5177 18.3492 19.5183 18.4281 19.5031C18.507 19.4878 18.582 19.4569 18.6488 19.4122C18.7156 19.3675 18.7728 19.3099 18.817 19.2428C18.8612 19.1757 18.8915 19.1004 18.9062 19.0214C18.9209 18.9424 18.9196 18.8612 18.9025 18.7827L18.8916 18.7255C19.4166 18.5586 19.8975 18.276 20.2986 17.8984L20.4861 20.1463C20.3371 20.1715 20.203 20.2517 20.1104 20.3711C20.0177 20.4905 19.9733 20.6403 19.9859 20.7909C19.9985 20.9415 20.0672 21.0819 20.1783 21.1842C20.2895 21.2866 20.4351 21.3434 20.5862 21.3435H22.3946V10.4926C22.3975 9.67428 22.1282 8.87818 21.6291 8.22964C22.0058 8.33091 22.2687 8.4786 22.4549 8.65764C22.7907 8.98016 22.9975 9.5233 22.9975 10.4926L23.2308 13.76C23.0885 13.98 22.9975 14.3248 22.9975 14.7124C22.9975 15.3786 23.2669 15.9181 23.6003 15.9181C23.9337 15.9181 24.2031 15.3786 24.2031 14.7124C24.2031 14.3248 24.1115 13.98 23.9698 13.76L24.2031 10.4926C24.2031 9.38706 23.9722 8.44304 23.2904 7.78777C22.6171 7.14093 21.6291 6.89739 20.4132 6.87689C20.3673 6.87569 19.1129 6.87569 19.0791 6.87569V6.87991C19.0233 6.87721 18.9674 6.8758 18.9115 6.87569H10.0367C8.87023 6.87569 7.9901 6.70207 7.25104 6.473L7.15941 6.34882C7.5633 6.24634 7.97021 6.08237 8.26258 5.86656C9.02757 5.30352 9.47245 4.17081 8.49226 4.29499C8.20772 4.33116 8.00156 4.33839 7.83397 4.34442C7.42465 4.35828 7.2432 4.36492 6.70065 4.76459C6.47942 4.92735 6.28531 5.10217 6.12737 5.27518C5.28401 4.64824 4.16095 4.36793 2.19995 4.46438C2.12001 4.46438 2.04335 4.49614 1.98682 4.55266C1.93029 4.60919 1.89854 4.68586 1.89854 4.7658C1.89854 4.84574 1.93029 4.9224 1.98682 4.97893C2.04335 5.03545 2.12001 5.06721 2.19995 5.06721H3.24706C3.41887 5.17813 3.56656 5.28182 3.69737 5.38068L1.53684 8.08134H1.40904C1.22105 8.0813 1.03566 8.12522 0.867664 8.20959C0.69967 8.29397 0.553735 8.41645 0.441513 8.56727C0.329291 8.71809 0.253892 8.89307 0.221339 9.07822C0.188786 9.26337 0.19998 9.45357 0.254027 9.63362L0.434875 10.2364C0.509424 10.4848 0.662054 10.7025 0.870118 10.8572C1.07818 11.012 1.33059 11.0955 1.58989 11.0955H3.61599C3.87096 11.0955 4.11937 11.1763 4.32552 11.3264L5.64571 12.2861C5.6859 12.315 5.72669 12.3411 5.76808 12.3644C6.71271 14.7998 7.70918 16.6963 8.82441 17.6506L9.03239 20.1463C8.88339 20.1715 8.7493 20.2517 8.65666 20.3711C8.56401 20.4905 8.51959 20.6403 8.53218 20.7909C8.54476 20.9415 8.61344 21.0819 8.72462 21.1842C8.83579 21.2866 8.98135 21.3434 9.13246 21.3435H10.9409V15.9181ZM16.8547 15.9181H15.1607C15.1607 16.7198 16.0252 17.7266 17.572 17.7266C18.1453 17.7266 18.6252 17.5879 19.0019 17.3733C18.1399 17.0297 17.4714 16.5185 16.8553 15.9181" fill="#808080"/>
      </g>
      <defs>
          <clipPath id="clip0_1080_2609">
          <rect width="24" height="24" fill="white"/>
          </clipPath>
      </defs>
  </svg>
    ),
  },
  {
    // href: viewType === 'owner'
    // ? "/OwnerViewPage/activityOwnerPage"
    // : "/OperatorViewPage/activityOperatorPage",
    href: "/defaultView?view=activity",
    label: "Aktivitas",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_1081_3313)">
            <path d="M3.5 7C3.5 5.67392 4.02678 4.40215 4.96447 3.46447C5.90215 2.52678 7.17392 2 8.5 2C9.82608 2 11.0979 2.52678 12.0355 3.46447C12.9732 4.40215 13.5 5.67392 13.5 7C13.5 8.32608 12.9732 9.59785 12.0355 10.5355C11.0979 11.4732 9.82608 12 8.5 12C7.17392 12 5.90215 11.4732 4.96447 10.5355C4.02678 9.59785 3.5 8.32608 3.5 7ZM5 14C3.67392 14 2.40215 14.5268 1.46447 15.4645C0.526784 16.4021 0 17.6739 0 19L0 21H17V19C17 17.6739 16.4732 16.4021 15.5355 15.4645C14.5979 14.5268 13.3261 14 12 14H5ZM24 21H19V19C19 17.041 18.196 15.27 16.9 14H19C19.6566 14 20.3068 14.1293 20.9134 14.3806C21.52 14.6319 22.0712 15.0002 22.5355 15.4645C22.9998 15.9288 23.3681 16.48 23.6194 17.0866C23.8707 17.6932 24 18.3434 24 19V21ZM15.5 12C14.8896 12.0003 14.2843 11.8888 13.714 11.671C14.8666 10.3885 15.5029 8.72432 15.5 7C15.5027 5.27555 14.866 3.61133 13.713 2.329C14.398 2.0674 15.1322 1.95968 15.8636 2.01347C16.5949 2.06727 17.3054 2.28127 17.9448 2.6403C18.5842 2.99933 19.1368 3.49461 19.5634 4.09102C19.99 4.68744 20.2803 5.3704 20.4135 6.09148C20.5468 6.81257 20.5198 7.55414 20.3344 8.26364C20.1491 8.97313 19.81 9.63317 19.3411 10.197C18.8723 10.7608 18.2851 11.2146 17.6213 11.5262C16.9575 11.8378 16.2333 11.9995 15.5 12Z" fill="#808080"/>
        </g>
        <defs>
            <clipPath id="clip0_1081_3313">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    // href: viewType === 'owner'
    // ? "/OwnerViewPage/settingsOwnerPage"
    // : "/OperatorViewPage/settingsOperatorPage",
    href: "/defaultView?view=settings",
    label: "Pengaturan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M14.2793 2.152C13.9093 2 13.4393 2 12.5003 2C11.5613 2 11.0923 2 10.7213 2.152C10.4772 2.25175 10.2552 2.39878 10.0682 2.58465C9.88109 2.77051 9.73263 2.99154 9.63132 3.235C9.53732 3.458 9.50132 3.719 9.48632 4.098C9.47918 4.3725 9.40238 4.64068 9.26314 4.87736C9.1239 5.11403 8.92679 5.31142 8.69032 5.451C8.44906 5.5851 8.17786 5.65615 7.90184 5.65754C7.62582 5.65894 7.35392 5.59065 7.11132 5.459C6.77332 5.281 6.52832 5.183 6.28632 5.151C5.7569 5.08192 5.22158 5.2242 4.79632 5.547C4.47832 5.789 4.24332 6.193 3.77432 7C3.30432 7.807 3.07032 8.21 3.01732 8.605C2.94732 9.131 3.09132 9.663 3.41732 10.084C3.56532 10.276 3.77432 10.437 4.09732 10.639C4.57432 10.936 4.88032 11.442 4.88032 12C4.88032 12.558 4.57432 13.064 4.09832 13.36C3.77432 13.563 3.56532 13.724 3.41632 13.916C3.25588 14.1242 3.13806 14.362 3.0696 14.6158C3.00114 14.8696 2.98337 15.1343 3.01732 15.395C3.07032 15.789 3.30432 16.193 3.77432 17C4.24432 17.807 4.47832 18.21 4.79632 18.453C5.22032 18.776 5.75632 18.918 6.28632 18.849C6.52832 18.817 6.77332 18.719 7.11132 18.541C7.35404 18.4092 7.62613 18.3408 7.90234 18.3422C8.17855 18.3436 8.44994 18.4147 8.69132 18.549C9.17732 18.829 9.46532 19.344 9.48632 19.902C9.50132 20.282 9.53732 20.542 9.63132 20.765C9.83532 21.255 10.2273 21.645 10.7213 21.848C11.0913 22 11.5613 22 12.5003 22C13.4393 22 13.9093 22 14.2793 21.848C14.5234 21.7483 14.7454 21.6012 14.9325 21.4154C15.1195 21.2295 15.268 21.0085 15.3693 20.765C15.4633 20.542 15.4993 20.282 15.5143 19.902C15.5343 19.344 15.8233 18.828 16.3103 18.549C16.5516 18.4149 16.8228 18.3439 17.0988 18.3425C17.3748 18.3411 17.6467 18.4093 17.8893 18.541C18.2273 18.719 18.4723 18.817 18.7143 18.849C19.2443 18.919 19.7803 18.776 20.2043 18.453C20.5223 18.211 20.7573 17.807 21.2263 17C21.6963 16.193 21.9303 15.79 21.9833 15.395C22.0171 15.1343 21.9992 14.8695 21.9306 14.6157C21.8619 14.3619 21.7439 14.1241 21.5833 13.916C21.4353 13.724 21.2263 13.563 20.9033 13.361C20.4263 13.064 20.1203 12.558 20.1203 12C20.1203 11.442 20.4263 10.936 20.9023 10.64C21.2263 10.437 21.4353 10.276 21.5843 10.084C21.7447 9.87579 21.8626 9.63799 21.931 9.38422C21.9995 9.13044 22.0173 8.86565 21.9833 8.605C21.9303 8.211 21.6963 7.807 21.2263 7C20.7563 6.193 20.5223 5.79 20.2043 5.547C19.779 5.2242 19.2437 5.08192 18.7143 5.151C18.4723 5.183 18.2273 5.281 17.8893 5.459C17.6466 5.59083 17.3745 5.65922 17.0983 5.65782C16.8221 5.65642 16.5507 5.58528 16.3093 5.451C16.073 5.3113 15.8761 5.11385 15.7371 4.87719C15.598 4.64052 15.5213 4.37241 15.5143 4.098C15.4993 3.718 15.4633 3.458 15.3693 3.235C15.268 2.99154 15.1195 2.77051 14.9325 2.58465C14.7454 2.39878 14.5234 2.25175 14.2793 2.152ZM12.5003 15C14.1703 15 15.5233 13.657 15.5233 12C15.5233 10.343 14.1693 9 12.5003 9C10.8313 9 9.47732 10.343 9.47732 12C9.47732 13.657 10.8313 15 12.5003 15Z" fill="#808080"/>
     </svg>
    ),
  },
]


const Sidebar: React.FC<{ setBreadcrumb: (label: string) => void, farmList?: FarmModel[], setFarm: (farmName: string, farmId: number) => void, selectedFarm: string | null}> = ({ setBreadcrumb, farmList = [], setFarm, selectedFarm }) => {  
  const handleMenuClick = (label: string) => {
    setSelectedIndex(label);
    setBreadcrumb(label);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleFarmSelect = (farmName: string, farmId: number) => {
    setIsOpen(false);
    setFarm(farmName, farmId);
  };

  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const path = usePathname();

  const viewType: 'owner' | 'operator' = path?.includes('OperatorViewPage') ? 'operator' : 'owner';
  const items = menuItems;

  console.log(path)
  useEffect(() => {
    switch (true) {
      case path?.includes('/livestockOwnerPage'):
        setSelectedIndex("Ternak Anda");
        break;
      case path?.includes('/activity'):
        setSelectedIndex("Aktivitas");
        break;
      case path?.includes('/settings'):
        setSelectedIndex("Pengaturan");
        break;
      default:
        setSelectedIndex("Statistik");
        break;
    }
  }, [path]);

  
    return (
      <div className={styles.sidebarContainer}>
        {/* Profile Section */}
        <div className={styles.sidebarProfile}>
          <div className={styles.profilePicture}>
              <Logo/>
          </div>
          <div className={styles.profileDropdown}>
            <button className={styles.dropdownButton} onClick={toggleDropdown}>
              {selectedFarm}
              {/* <span className="dropdown-icon">▼</span> */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="11" viewBox="0 0 18 11" fill="none">
              <path d="M9.32422 10.2002C9.56836 10.2002 9.8125 10.1025 9.97851 9.917L17.5371 2.17286C17.7031 2.00683 17.8008 1.792 17.8008 1.54786C17.8008 1.04004 17.4199 0.649414 16.9121 0.649414C16.668 0.649414 16.4434 0.747071 16.2774 0.903325L8.79687 8.54981H9.8418L2.36133 0.903325C2.20508 0.747071 1.98047 0.649414 1.72656 0.649414C1.21875 0.649414 0.837891 1.04004 0.837891 1.54786C0.837891 1.792 0.935547 2.00684 1.10156 2.18262L8.66016 9.917C8.8457 10.1025 9.07031 10.2002 9.32422 10.2002Z" fill="white"/>
              </svg>
            </button>
            {isOpen && (
              <div className={styles.dropdownList}>
                {farmList.map((farm, index) => (
                  index == 0 
                  ? 
                  <div>
                    <button key={index} className={styles.dropdownItem} onClick={() => handleFarmSelect(farm.name, farm.id)}>
                      {farm.name}
                    </button>
                  </div>
                  : 
                  <div>
                    <hr />
                    <button key={index} className={styles.dropdownItem} onClick={() => handleFarmSelect(farm.name, farm.id)}>
                      {farm.name}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
  
        {/* Menu Items */}
        <div className={styles.menuItems}>
        <ul>

        {items.map((menuItem: { href: string; label: string; icon: React.JSX.Element }) => (
  
                    <li 
                    key={menuItem.href} 
                    className={`${styles.menuItem} ${selectedIndex === menuItem.label ? styles.selectedMenuItems : ''}`}
                    onClick={() => handleMenuClick(menuItem.label)}
                    >
                      <Link
                        href={menuItem.href}
                        className="flex items-center space-x-2 px-4 py-3 rounded-[10px] hover:text-green-600 transition-colors"
                      >
                        {menuItem.icon}
                        <span>{menuItem.label}</span>
                      </Link>
                    </li>
                  ))}

          </ul>
        </div>
    </div>
  );
};

export default Sidebar;