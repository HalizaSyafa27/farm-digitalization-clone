// components/MoreOptions.tsx
import { useState } from "react";
import Link from "next/link";
import router from "next/router";
import { getCookie } from '@/lib/cookies';


interface MoreOptionsProps {
  role: string;
  id: string;
  selectedFarm: string;
  selectedFarmId: string;
  handleDeleteData: () => void;
  handleUbahDataRoute: () => void;
}


const MoreOptions: React.FC<MoreOptionsProps> = ({ role = "", id, selectedFarm, selectedFarmId, handleDeleteData, handleUbahDataRoute }) => {
    const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="relative">
      <div className="moreIcon cursor-pointer" onClick={() => setShowOptions(!showOptions)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
          <path 
            d="M15 8.9375C14.7514 8.9375 14.5129 8.83873 14.3371 8.66291C14.1613 8.4871 14.0625 8.24864 14.0625 8C14.0625 7.75136 14.1613 7.5129 14.3371 7.33709C14.5129 7.16127 14.7514 7.0625 15 7.0625C15.2486 7.0625 15.4871 7.16127 15.6629 7.33709C15.8387 7.5129 15.9375 7.75136 15.9375 8C15.9375 8.24864 15.8387 8.4871 15.6629 8.66291C15.4871 8.83873 15.2486 8.9375 15 8.9375ZM15 16.4375C14.7514 16.4375 14.5129 16.3387 14.3371 16.1629C14.1613 15.9871 14.0625 15.7486 14.0625 15.5C14.0625 15.2514 14.1613 15.0129 14.3371 14.8371C14.5129 14.6613 14.7514 14.5625 15 14.5625C15.2486 14.5625 15.4871 14.6613 15.6629 14.8371C15.8387 15.0129 15.9375 15.2514 15.9375 15.5C15.9375 15.7486 15.8387 15.9871 15.6629 16.1629C15.4871 16.3387 15.2486 16.4375 15 16.4375ZM15 23.9375C14.7514 23.9375 14.5129 23.8387 14.3371 23.6629C14.1613 23.4871 14.0625 23.2486 14.0625 23C14.0625 22.7514 14.1613 22.5129 14.3371 22.3371C14.5129 22.1613 14.7514 22.0625 15 22.0625C15.2486 22.0625 15.4871 22.1613 15.6629 22.3371C15.8387 22.5129 15.9375 22.7514 15.9375 23C15.9375 23.2486 15.8387 23.4871 15.6629 23.6629C15.4871 23.8387 15.2486 23.9375 15 23.9375Z"
            stroke="black" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2">
          <button 
            className="w-full text-left p-2 hover:bg-gray-100" 
            onClick={handleUbahDataRoute}
          >
            Ubah Data
          </button>
          {role.toLowerCase() === "owner" && (
            <button 
              className="w-full text-left p-2 text-red-600 hover:bg-red-100" 
              onClick={handleDeleteData}
            >
              Hapus Data
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MoreOptions;
