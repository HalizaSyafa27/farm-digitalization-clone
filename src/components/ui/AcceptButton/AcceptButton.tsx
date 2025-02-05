import React from 'react';
import styles from './AcceptButton.module.css';

interface AcceptButtonProps {
  label: string;
  onClick?: () => void;
}

const AcceptButton: React.FC<AcceptButtonProps> = ({ label, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
};

export default AcceptButton;
