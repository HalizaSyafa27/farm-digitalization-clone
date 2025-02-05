import React, { useState } from 'react';
import styles from '@/components/ui/DropdownPhase/DropdownPhase.module.css';

interface DropdownPhaseProps {
  label?: string;
  options: string[];
  placeholder?: string;
  onSelect: (value: string) => void;
}

const DropdownPhase: React.FC<DropdownPhaseProps> = ({ label, options, placeholder, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownfase}>
      {label && <label className={styles.dropdownfieldLabel}>{label}</label>}
      <div className={styles.dropdownfaseHeader} onClick={toggleDropdown}>
        {selectedOption || placeholder}
        <span className={`${styles.dropdownfaseIcon} ${isOpen ? styles.rotate : ''}`}>
        <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clipPath="url(#clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.0609 16.0604C12.7796 16.3413 12.3984 16.4991 12.0009 16.4991C11.6034 16.4991 11.2221 16.3413 10.9409 16.0604L5.28288 10.4044C5.00161 10.123 4.84366 9.74138 4.84375 9.34352C4.84384 8.94567 5.00198 8.56414 5.28338 8.28288C5.56477 8.00162 5.94637 7.84366 6.34423 7.84375C6.74209 7.84384 7.12361 8.00198 7.40488 8.28338L12.0009 12.8794L16.5969 8.28338C16.8797 8.01 17.2585 7.85863 17.6518 7.86186C18.0451 7.86509 18.4214 8.02267 18.6996 8.30065C18.9779 8.57863 19.1358 8.95478 19.1394 9.34807C19.143 9.74137 18.992 10.1203 18.7189 10.4034L13.0619 16.0614L13.0609 16.0604Z"
          fill="#B1B1B4"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
        </span>
      </div>
      {isOpen && (
        <ul className={styles.dropdownfaseList}>
          {options.map((option, index) => (
            <li
              key={index}
              className={styles.dropdownfaseItem}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownPhase;