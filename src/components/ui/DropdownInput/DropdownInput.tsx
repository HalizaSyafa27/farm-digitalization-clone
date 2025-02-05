import React, { useState } from 'react';
import styles from './DropdownInput.module.css';

interface DropdownInputProps {
  label?: string;
  options: string[];
  placeholder?: string;
  onSelect: (value: string, dropdownId: number) => void;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  options,
  placeholder,
  onSelect,
}) => {
  const [dropdowns, setDropdowns] = useState<
  { id: number; options: string[]; selectedOption: string | null }[]
>([
  { id: 1, options, selectedOption: null },
]);

  const [customInput, setCustomInput] = useState('');
  const [isOpen, setIsOpen] = useState<Record<number, boolean>>({}); // Mengatur dropdown mana yang terbuka

  // Menambahkan dropdown baru
  const addDropdown = () => {
    const newId = dropdowns.length + 1;
    setDropdowns([...dropdowns, { id: newId, options, selectedOption: null }]);
  };

  // Menangani pilihan di dropdown
  const handleSelect = (option: string, dropdownId: number) => {
    setDropdowns((prevDropdowns) =>
      prevDropdowns.map((dropdown) =>
        dropdown.id === dropdownId
          ? { ...dropdown, selectedOption: option } // Update selectedOption untuk dropdown tertentu
          : dropdown
      )
    );

    if (option === 'Tambahkan') {
      setCustomInput('');
    } else {
      onSelect(option, dropdownId); // Kirim pilihan ke parent
      setCustomInput('');
      setIsOpen((prev) => ({ ...prev, [dropdownId]: false })); // Tutup dropdown tertentu
    }
  };

  // Menangani perubahan input kustom
  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>, dropdownId: number) => {
    setCustomInput(e.target.value);
    onSelect(e.target.value, dropdownId); // Kirim input ke parent
  };

  // Menangani pembukaan dropdown
  const toggleDropdown = (dropdownId: number) => {
    setIsOpen((prev) => ({ ...prev, [dropdownId]: !prev[dropdownId] }));
  };

  return (
    <div className={styles.dropdownContainer}>
      {dropdowns.map((dropdown) => (
        <div key={dropdown.id} className={styles.dropdownfase}>
          {/* Label untuk dropdown pertama */}
          {/* {label && dropdown.id === 1 && (
            <label className={styles.dropdownfieldLabel}>{label}</label>
          )} */}

          {/* Header Dropdown */}
          <div
            className={styles.dropdownfaseHeader}
            onClick={() => toggleDropdown(dropdown.id)}
            >
            <div className={styles.dropdownContent}>
                {dropdown.selectedOption === 'Tambahkan' ? (
                <input
                    type="text"
                    className={styles.customInput}
                    value={customInput}
                    onChange={(e) => handleCustomInputChange(e, dropdown.id)}
                    placeholder={placeholder || 'Masukkan teks'}
                />
                ) : (
                <span
                    className={`${styles.selected} ${
                    !dropdown.selectedOption ? styles.placeholder : ''
                    }`}
                >
                    {dropdown.selectedOption || placeholder}
                </span>
                )}

                {/* Ikon Dropdown */}
                <span
                className={`${styles.dropdownfaseIcon} ${
                    isOpen[dropdown.id] ? styles.rotate : ''
                }`}
                >
                    <div className="icon">
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
                    </div>

                </span>
            </div>
         </div>


          {/* Dropdown List */}
          {isOpen[dropdown.id] && (
            <ul className={styles.dropdownfaseList}>
              {dropdown.options.map((option, index) => (
                <li
                  key={index}
                  className={styles.dropdownfaseItem}
                  onClick={() => handleSelect(option, dropdown.id)}
                >
                  {option}
                </li>
              ))}
              <li className={styles.dropdowninputSeparator}></li>
              <li
                className={styles.dropdownfaseItem}
                onClick={() => handleSelect('Tambahkan', dropdown.id)}
              >
                Tambahkan
              </li>
            </ul>
          )}

            <div className={styles.addButton} onClick={addDropdown}>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="29"
                        height="29"
                        viewBox="0 0 29 29"
                        fill="none"
                        >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 14.5C0 6.49165 6.49165 0 14.5 0C22.5084 0 29 6.49165 29 14.5C29 22.5084 22.5084 29 14.5 29C6.49165 29 0 22.5084 0 14.5ZM14.5 2.9C11.4235 2.9 8.47298 4.12214 6.29756 6.29756C4.12214 8.47298 2.9 11.4235 2.9 14.5C2.9 17.5765 4.12214 20.527 6.29756 22.7024C8.47298 24.8779 11.4235 26.1 14.5 26.1C17.5765 26.1 20.527 24.8779 22.7024 22.7024C24.8779 20.527 26.1 17.5765 26.1 14.5C26.1 11.4235 24.8779 8.47298 22.7024 6.29756C20.527 4.12214 17.5765 2.9 14.5 2.9Z"
                            fill="#B3B3B3"
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.9508 7.2498C15.9508 6.86524 15.798 6.49643 15.5261 6.2245C15.2542 5.95257 14.8853 5.7998 14.5008 5.7998C14.1162 5.7998 13.7474 5.95257 13.4755 6.2245C13.2035 6.49643 13.0508 6.86524 13.0508 7.2498V13.0498H7.25078C6.86622 13.0498 6.4974 13.2026 6.22548 13.4745C5.95355 13.7464 5.80078 14.1152 5.80078 14.4998C5.80078 14.8844 5.95355 15.2532 6.22548 15.5251C6.4974 15.797 6.86622 15.9498 7.25078 15.9498H13.0508V21.7498C13.0508 22.1344 13.2035 22.5032 13.4755 22.7751C13.7474 23.047 14.1162 23.1998 14.5008 23.1998C14.8853 23.1998 15.2542 23.047 15.5261 22.7751C15.798 22.5032 15.9508 22.1344 15.9508 21.7498V15.9498H21.7508C22.1353 15.9498 22.5042 15.797 22.7761 15.5251C23.048 15.2532 23.2008 14.8844 23.2008 14.4998C23.2008 14.1152 23.048 13.7464 22.7761 13.4745C22.5042 13.2026 22.1353 13.0498 21.7508 13.0498H15.9508V7.2498Z"
                            fill="#B3B3B3"
                        />
                        </svg>
            </div>
        </div>


      ))}

      {/* Tombol Add Dropdown */}

    </div>
  );
};

export default DropdownInput;
