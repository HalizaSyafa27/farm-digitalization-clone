'use client'

import React, { useState } from 'react';
import styles from '@/components/ui/Filter/Filter.module.css';
import ReactDOM from 'react-dom';
import SecondaryButton from '../SecondaryButton/secondaryButton';
import { defaultFilterCategories, FilterCategory } from '@/models/FilterCategory';

interface FilterButtonProps {
    onFiltersChange: (selectedFilters: { [key: string]: string[] }) => void;
    filters: FilterCategory[];
}

const FilterButton: React.FC<FilterButtonProps> = ({ onFiltersChange, filters = defaultFilterCategories }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});

    const handleCheckboxChange = (category: string, item: string) => {
        setSelectedFilters((prev) => {
            const updatedCategory = prev[category] || [];
            const isChecked = updatedCategory.includes(item);

            const updatedFilters = {
                ...prev,
                [category]: isChecked
                    ? updatedCategory.filter((i) => i !== item)
                    : [...updatedCategory, item],
            };

            onFiltersChange(updatedFilters);
            return updatedFilters;
        });
    };

    return (
        <>
            <div onClick={() => setIsOpen(!isOpen)}>
                <button className={styles.button}>
                    Filter
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                            d="M2.05058 -0.00146484C0.291584 -0.00146484 -0.647416 2.02254 0.510584 3.31554L5.93258 9.37454V14.2485C5.93258 14.7205 6.15958 15.1655 6.54558 15.4485L9.61458 17.6985C10.6246 18.4405 12.0686 17.7345 12.0686 16.4985V9.37454L17.4906 3.31554C18.6476 2.02254 17.7086 -0.00146484 15.9506 -0.00146484H2.05058Z"
                            fill="black"
                        />
                    </svg>
                </button>
            </div>

            {isOpen &&
                ReactDOM.createPortal(
                    <div className={styles.filterBox} id="dropdown-container">
                        {filters.map((category) => (
                            <div className={styles.filterCategory} key={category.title}>
                                <div className={styles.filterOptionsBox}>
                                    <h1>{category.title}</h1>
                                    <hr />
                                    {category.items.map((item) => (
                                        <div className={styles.filterItem} key={item}>
                                            <input
                                                type="checkbox"
                                                id={item}
                                                onChange={() => handleCheckboxChange(category.title, item)}
                                            />
                                            <label htmlFor={item}>{item}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>,
                    document.body
                )}
        </>
    );
};

export default FilterButton;
