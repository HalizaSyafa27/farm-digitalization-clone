import React from 'react';
import styles from '@/components/ui/EditButton/EditButton.module.css';

interface EditButtonProps {
  onClick?: () => void;
  label?: string;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, label = "Ubah Data" }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
};

export default EditButton;
