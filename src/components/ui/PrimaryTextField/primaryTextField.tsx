import React from 'react';
import styles from '@/components/ui/PrimaryTextField/PrimaryTextField.module.css';

interface PrimaryTextFieldProps {
  label?: string;
  placeholder?: string;
  width?: number;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const PrimaryTextField: React.FC<PrimaryTextFieldProps> = ({ placeholder = "", label = "", width=400, style, className,  disabled = false}) => {
  return (
    <div className={`${styles.textField} ${className}`} style={style}>
        <h1>{label}</h1>
        <input 
        type="text" 
        placeholder={placeholder} 
        style={{
          width: `${width}px`,
          backgroundColor: disabled ? "#F2F2F7" : "white", // Ubah warna bg jika disabled
          cursor: disabled ? "not-allowed" : "text", // Ganti cursor menjadi 'not-allowed' jika disabled
          color: disabled ? "#A9A9A9" : "black" // Opsional: Ubah warna teks jika disabled
        }} 
        disabled={disabled}
        />
    </div>
  );
};

export default PrimaryTextField;
