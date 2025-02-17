import type { NextPage } from "next";
import Image from "next/image";
import styles from './LivestockCard.module.css';
import { Livestock } from "@/models/LivestockModel";
import HealthStatus from "../healthStatus";
import GenderIcon from "../genderIcon";
import PhaseLabelButton from "../PhaseLabel/PhaseLabelButton";
import { phaseLabels } from "@/data/phaseLabels";
import PhaseLabelTag from "../PhaseLabel/PhaseLabelTag";
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation";; 

export type LivestockCardTypes = {
  className?: string;
  livestock: Livestock;
};

const LivestockCard: NextPage<LivestockCardTypes> = ({ className = "", livestock }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/defaultView?view=livestock&category=${livestock.name_id.toLowerCase()}`);
  };

  return (
    <div 
    className={[styles.LivestockCard, className].join(" ")}
    onClick={handleCardClick} 
    style={{ cursor: "pointer" }} 
    >
      <section className={styles.livestockDetails}>
        <img
          src={livestock == null ? "" : livestock.photo_url}
          alt={livestock == null ? "" : livestock.name_id}
          style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '10px',
          }}
        />
        <div className={styles.livestockPhase}>
          <PhaseLabelTag phases={phaseLabels} filterId={livestock.phase}></PhaseLabelTag>
        </div>
      </section>
      <section className={styles.details}>
        <div className={styles.characteristics}>
          <div className={styles.breedInfo}>
            <div className={styles.breedName}>
              <div className={styles.shj015}>{livestock.name_id}</div>
              <div className={styles.brownSwiss}>{livestock.breed}</div>
            </div>
            <div className={styles.weight}>
              <div className={styles.weightIcons}>
              <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1594_296)">
                  <path d="M4.07432 17.6495C4.41826 17.9179 4.85446 17.8257 5.37455 17.4482L9.8121 14.185L14.258 17.4482C14.7781 17.8257 15.2059 17.9179 15.5582 17.6495C15.9021 17.3894 15.9776 16.9616 15.768 16.3493L14.0148 11.1316L18.4942 7.91039C19.0143 7.5413 19.224 7.15542 19.0898 6.736C18.9556 6.33335 18.5613 6.13202 17.9154 6.14041L12.4209 6.17396L10.7516 0.931124C10.5503 0.310376 10.2483 0 9.8121 0C9.38424 0 9.08228 0.310376 8.88096 0.931124L7.21164 6.17396L1.71714 6.14041C1.07123 6.13202 0.676966 6.33335 0.542749 6.736C0.400144 7.15542 0.618245 7.5413 1.13833 7.91039L5.61781 11.1316L3.86461 16.3493C3.65489 16.9616 3.73039 17.3894 4.07432 17.6495Z" fill="#F3C935"/>
                </g>
                <defs>
                  <clipPath id="clip0_1594_296">
                    <rect width="18.943" height="19" fill="white" transform="translate(0.5)"/>
                  </clipPath>
                </defs>
              </svg>
              
              <div className={styles.aa}>{livestock.grade || "N/A"}</div>
              
              </div>
              
              <div className={styles.verticalLine}></div>
              
              <div className={styles.weightIcons1}>
              
              <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.19173 1.58325C5.19173 1.98938 5.57965 2.37492 5.9834 2.37492H13.9001C14.3062 2.37492 14.6917 1.987 14.6917 1.58325H16.2751C16.2751 2.21314 16.0248 2.81723 15.5794 3.26263C15.134 3.70803 14.53 3.95825 13.9001 3.95825H10.7334L10.7342 5.59067C12.2646 5.78368 13.672 6.52863 14.6922 7.68568C15.7124 8.84273 16.2752 10.3323 16.2751 11.8749V16.6249C16.2751 16.8349 16.1917 17.0362 16.0432 17.1847C15.8947 17.3332 15.6934 17.4166 15.4834 17.4166H4.40007C4.1901 17.4166 3.98874 17.3332 3.84027 17.1847C3.69181 17.0362 3.6084 16.8349 3.6084 16.6249V11.8749C3.60825 10.3322 4.17119 8.84251 5.19154 7.68544C6.21188 6.52837 7.61947 5.78351 9.15007 5.59067V3.95825H5.9834C4.66923 3.95825 3.6084 2.89742 3.6084 1.58325H5.19173ZM9.94173 8.70825C9.2434 8.70835 8.56469 8.93928 8.01122 9.36511C7.45774 9.79093 7.06055 10.3878 6.88144 11.0627C6.70234 11.7377 6.75137 12.4529 7.0209 13.0972C7.29044 13.7414 7.76536 14.2784 8.37177 14.6247C8.97817 14.9711 9.68204 15.1072 10.3739 15.012C11.0657 14.9168 11.7066 14.5956 12.1969 14.0984C12.6873 13.6012 12.9995 12.9558 13.085 12.2627C13.1705 11.5697 13.0246 10.8678 12.6698 10.2663L10.5014 12.4354L10.427 12.5003C10.2679 12.6234 10.0679 12.6812 9.86769 12.6622C9.66746 12.6431 9.482 12.5485 9.34897 12.3976C9.21594 12.2468 9.14533 12.0509 9.15147 11.8499C9.15761 11.6488 9.24004 11.4577 9.38202 11.3152L11.5504 9.14604C11.0629 8.85904 10.5074 8.70787 9.94173 8.70825Z" fill="#F3C935"/>
              </svg>
              
              <div className={styles.kg}>{livestock.weight || "Unknown Weight"}</div>
              
              </div>
            </div>
          </div>
          <div className={styles.healthCondition}>
            <GenderIcon gender={ livestock.gender == "Betina" ? "betina" : "jantan"}></GenderIcon>
            <HealthStatus status="sehat"></HealthStatus>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LivestockCard;