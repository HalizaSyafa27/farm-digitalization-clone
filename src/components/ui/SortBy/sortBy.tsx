'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/components/ui/SortBy/SortBy.module.css';
import ReactDOM from 'react-dom';
import SecondaryButton from '../SecondaryButton/secondaryButton';

interface SortByButtonProps {
    sortBys: string[];
    onSortChange: (selectedSort: string | null) => void;
}

const SortByButton: React.FC<SortByButtonProps> = ({ sortBys, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSortBy, setSelectedSortBy] = useState<string | null>(null);

    const closeDropdown = () => setIsOpen(false);

    const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest('#dropdown-container')) {
            closeDropdown();
        }
    };

    useEffect(() => {
        if (typeof document !== 'undefined') {
            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
            } else {
                document.removeEventListener('mousedown', handleClickOutside);
            }
        }

        return () => {
            if (typeof document !== 'undefined') {
                document.removeEventListener('mousedown', handleClickOutside);
            }
        };
    }, [isOpen]);

    const handleSortSelection = (item: string) => {
        setSelectedSortBy(item);
        onSortChange(item);
        closeDropdown();
    };

    return (
        <>
            <div>
                <button className={styles.button} onClick={() => setIsOpen(!isOpen)}>
                    Urutkan
                    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="20" viewBox="0 0 46 20" fill="none">
                        <g clipPath="url(#clip0_1168_14090)">
                            <path d="M36.4692 3.66663H9.53364C9.19475 3.66663 8.86974 3.53318 8.63011 3.29564C8.39048 3.05809 8.25586 2.73591 8.25586 2.39997C8.25586 2.06403 8.39048 1.74185 8.63011 1.5043C8.86974 1.26675 9.19475 1.1333 9.53364 1.1333H36.4692C36.8081 1.1333 37.1331 1.26675 37.3727 1.5043C37.6123 1.74185 37.747 2.06403 37.747 2.39997C37.747 2.73591 37.6123 3.05809 37.3727 3.29564C37.1331 3.53318 36.8081 3.66663 36.4692 3.66663Z" fill="black" />
                            <path d="M27.052 11.2667H9.53364C9.19475 11.2667 8.86974 11.1333 8.63011 10.8957C8.39048 10.6582 8.25586 10.336 8.25586 10.0001C8.25586 9.66412 8.39048 9.34194 8.63011 9.1044C8.86974 8.86685 9.19475 8.7334 9.53364 8.7334H27.052C27.3909 8.7334 27.7159 8.86685 27.9555 9.1044C28.1951 9.34194 28.3297 9.66412 28.3297 10.0001C28.3297 10.336 28.1951 10.6582 27.9555 10.8957C27.7159 11.1333 27.3909 11.2667 27.052 11.2667Z" fill="black" />
                            <path d="M17.5581 18.8668H9.53364C9.19475 18.8668 8.86974 18.7334 8.63011 18.4958C8.39048 18.2583 8.25586 17.9361 8.25586 17.6002C8.25586 17.2642 8.39048 16.942 8.63011 16.7045C8.86974 16.4669 9.19475 16.3335 9.53364 16.3335H17.5581C17.897 16.3335 18.222 16.4669 18.4616 16.7045C18.7012 16.942 18.8359 17.2642 18.8359 17.6002C18.8359 17.9361 18.7012 18.2583 18.4616 18.4958C18.222 18.7334 17.897 18.8668 17.5581 18.8668Z" fill="black" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1168_14090">
                                <rect width="46" height="19" fill="white" transform="translate(0 0.5)" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>
            {isOpen &&
                ReactDOM.createPortal(
                    <div className={styles.filterBox} id="dropdown-container">
                        <div className={styles.searchButton}>
                            <SecondaryButton label="Cari" />
                        </div>
                        <div className={styles.filterCategory}>
                            <div className={styles.filterOptionsBox}>
                                <hr />
                                {sortBys.map((item) => (
                                    <div className={styles.filterItem} key={item}>
                                        <input
                                            type="radio"
                                            id={item}
                                            name="sortBy"
                                            checked={selectedSortBy === item}
                                            onChange={() => handleSortSelection(item)}
                                        />
                                        <label htmlFor={item}>{item}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default SortByButton;
