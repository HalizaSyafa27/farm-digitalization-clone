'use client'

import React from 'react';
import styles from './InviteOperatorButton.module.css';

interface InviteOperatorButtonProps {
  onClick?: () => void;
  label?: string;
}

const InviteOperatorButton: React.FC<InviteOperatorButtonProps> = ({ onClick, label = "Undang Anggota" }) => {
    return (
        <button className={styles.button} onClick={onClick}>
        <span className={styles.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80"
            className={styles.svgIcon}
          >
            <polygon points="61,37 43,37 43,19 37,19 37,37 19,37 19,43 37,43 37,61 43,61 43,43 61,43" />
          </svg>
        </span>
        <span className={styles.label}>{label}</span>
      </button>
      );
};

export default InviteOperatorButton;
