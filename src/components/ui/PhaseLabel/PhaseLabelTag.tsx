import React from 'react';
import { PhaseLabel } from '@/models/phaseModel';
import styles from "@/components/ui/PhaseLabel/PhaseLabel.module.css";

interface PhaseLabelProps {
  phases: PhaseLabel[]; // Data fase yang diterima
  filterId?: string;
  width?: number;
  textSize?: number;
  height?: number;
}
const PhaseLabelTag: React.FC<PhaseLabelProps> = ({ phases, filterId, width, textSize, height }) => {
    const filteredPhases = filterId ? phases.filter((phase) => phase.label === filterId) : phases;
    
    return (
      <div className={styles.container}>
        {filteredPhases.map((phase) => (
          <div
            key={phase.id}
            className={styles.tag}
            style={{
              backgroundColor: phase.color,
             
            }}
          >
                <span
        className={styles.label}
        style={{
          fontSize: textSize ? `${textSize}px` : "16px",
          width: width ? `${width}px` : "auto",
          height: height ? `${height}px` : "auto", 
          display: "inline-block",
          textAlign: "center",
        }}
      >
        {phase.label}
      </span>
    </div>
        ))}
      </div>
    );
};

export default PhaseLabelTag;