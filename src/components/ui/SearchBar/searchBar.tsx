import React from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Telusuri', onSearch }) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSearch) {
      onSearch(event.currentTarget.value);
    }
  };

  return (
    <div className={styles.searchBar}>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
      <g clipPath="url(#clip0_1266_3490)">
        <path d="M0 8.65918C0 12.956 3.49609 16.4521 7.79297 16.4521C9.49219 16.4521 11.0449 15.9053 12.3242 14.9873L17.1289 19.8017C17.3535 20.0264 17.6465 20.1338 17.959 20.1338C18.623 20.1338 19.082 19.6357 19.082 18.9814C19.082 18.6689 18.9648 18.3857 18.7598 18.1807L13.9844 13.376C14.9902 12.0674 15.5859 10.4365 15.5859 8.65918C15.5859 4.3623 12.0898 0.866211 7.79297 0.866211C3.49609 0.866211 0 4.3623 0 8.65918ZM1.66992 8.65918C1.66992 5.28027 4.41406 2.53613 7.79297 2.53613C11.1719 2.53613 13.916 5.28027 13.916 8.65918C13.916 12.0381 11.1719 14.7822 7.79297 14.7822C4.41406 14.7822 1.66992 12.0381 1.66992 8.65918Z" fill="black"/>
      </g>
      <defs>
        <clipPath id="clip0_1266_3490">
          <rect width="19.4434" height="19.2676" fill="white" transform="translate(0 0.866211)"/>
        </clipPath>
      </defs>
    </svg>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;