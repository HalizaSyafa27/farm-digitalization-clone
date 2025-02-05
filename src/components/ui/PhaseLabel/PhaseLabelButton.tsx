import React from 'react';
import { PhaseLabel } from '@/models/phaseModel';
import styles from "@/components/ui/PhaseLabel/PhaseLabel.module.css";

interface PhaseLabelProps {
  phases: PhaseLabel[]; // Data fase yang diterima
  filterId?: string;
}

const PhaseLabelButton: React.FC<PhaseLabelProps> = ({ phases, filterId }) => {
    const filteredPhases = filterId ? phases.filter((phase) => phase.id === filterId) : phases;

    return (
        <div className={styles.container}>
        {filteredPhases.map((phase) => (
        <button
          key={phase.id}
          className={styles.button} 
          style={{ backgroundColor: phase.color }}
        >
          {phase.label}
        </button>
      ))}
        </div>
    );
};

export default PhaseLabelButton;
