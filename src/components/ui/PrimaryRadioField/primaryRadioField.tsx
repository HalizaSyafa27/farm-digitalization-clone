import React, { useState } from 'react';
import styles from '@/components/ui/PrimaryRadioField/PrimaryRadioField.module.css';

interface PrimaryRadioFieldProps {
  label?: string;
  placeholder?: string;
  width?: number;
  options: string[];
  onChange: (option: string) => void;
}

const PrimaryRadioField: React.FC<PrimaryRadioFieldProps> = ({ placeholder = "", label = "", width=400, options, onChange}) => {
    const [selectedOption, setSelectedOption] = useState<string>(options[0]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
        onChange(event.target.value);
    };
    return (
        <div className={styles.textField}>
            <h1>{label}</h1>
            <div className={styles.options}>
                {options.map((option) => (
                    <label>
                    <input
                        type="radio"
                        value={option}
                        checked={selectedOption === option}
                        onChange={handleChange}
                    /> {option}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default PrimaryRadioField;
