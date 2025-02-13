'use client'

import React, { use, useEffect, useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import TabNavigation from "@/components/ui/TabNavigation/TabNavigation";
import { Input } from "@/components/ui/input"
import DropdownFase from '@/components/ui/DropdownPhase/DropdownPhase';
import { useRouter, useSearchParams } from 'next/navigation'
import { getCookie } from '@/lib/cookies';
import useFetch from '@/hooks/useFetch';
import { FarmModel } from '@/models/FarmModel';
import { Livestock } from '@/models/LivestockModel';
// import { farmListData } from '@/data/farmData';

interface EditLivestockPageProps {
  params: Promise<{
      id: number;
  }>;
}

const app: React.FC<EditLivestockPageProps> = ({ params: paramsPromise }) => {
    const router = useRouter()

    const searchParams = useSearchParams();

    const idPasangan = searchParams.get('idPasangan');
    const idTernak = searchParams.get('idTernak');
    const rasTernak = searchParams.get('rasTernak');
    const grade = searchParams.get('grade');
    const berat = searchParams.get('berat');
    const fase = searchParams.get('fase');
    const jenisKelamin = searchParams.get('jenisKelamin');
    const kondisiTernak = searchParams.get('kondisiTernak');
    const status = searchParams.get('status');
    const kategoriHewan = searchParams.get('kategoriHewan');
    const imageUrl = searchParams.get('imageUrl');
    const selectedFarm = searchParams.get('selectedFarm');
    const farmId = searchParams.get('farmId');

    const [apiError, setApiError] = useState(null);
    const [apiData, setApiData] = useState(null);
    const [dob, setDob] = useState("2025-01-16");
    const [idAyah, setIdAyah] = useState("");
    const [idIbu, setIdIbu] = useState("");
    const [idKakek, setIdKakek] = useState("");
    const [idNenek, setIdNenek] = useState("");

    const handleUpdateData = () => {
        console.log("Data ternak berhasil ditambahkan");
        alert("Data ternak berhasil ditambahkan");
    };

    const handleFaseSelect = (option: string) => {
      setSelectedFase(option);
    };
  
    const handleJenisKelaminSelect = (value: string) => {
      console.log('Selected Jenis Kelamin:', value);
    };

    const params = use(paramsPromise);
    const id = params.id;

    const { data: livestock, loading: loadingLivestock, error: errorLivestock } = useFetch<Livestock>(
      `${process.env.NEXT_PUBLIC_API_HOST}/livestocks/${id}`,
    );
    useEffect(() => {
        if (livestock) {
            console.log(livestock)
        }
    }, [livestock]);

    useEffect(() => {
      if (livestock) {
        const formattedDob = new Date(livestock.dob).toISOString().split('T')[0];

        setDob(formattedDob);
        setIdAyah(livestock.dad_name_id);
        setIdIbu(livestock.mom_name_id);
        setIdKakek(livestock.grandpa_name_id);
        setIdNenek(livestock.grandma_name_id);
      }
    }, [livestock]);

    const handleValidationAndSubmit = async () => {
      try {
        const payload = {
          name_id: idTernak, 
          gender: jenisKelamin,
          dob: dob,
          weight: berat,
          phase: fase,
          photo_url: imageUrl,
          breed: rasTernak,
          type_id: kategoriHewan,
          farm_name: selectedFarm,
          farmId: farmId,
          dad_name_id: idAyah,
          mom_name_id: idIbu,
          grandpa_name_id: idKakek,
          grandma_name_id: idNenek,
      };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/livestocks/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();
        if (response.ok) {
          router.push("/defaultView?view=livestock");
        } else {
          setApiError(data.error || "Something went wrong");
        }
      } catch (error) {
      } finally {
        // setLoading(false);
      }
    };

    const [selectedFase, setSelectedFase] = useState("");

    return (
      <div className="container-addTernak">
        <div className="sidebar-addTernak">
          <TabNavigation />
        </div>
        <div className="main-content-addTernak">
          <div className="content-wrapper-addTernak"> {/* Wrapper untuk align */}
            {/* <div className="section-addTernak">
              <h3 className="tittle-addTernak">Masukkan Gambar</h3>
              <img
                src="/SapiImage.jpeg"
                alt="ternak"
                className="image-addTernak"
              />
              <p className="image-description-addTernak">
                Lorem ipsum dolor sit amet <br />
                Lorem ipsum dolor sit amet
              </p>
            </div> */}
  
            <div className="sectionInput-addTernak">
              <Label title="Date of Birth *" />
              <Input
                disabled={false}
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />

  
              <div className="grid-row-addTernak">
                <div>
                  <Label title="ID Ayah *" />
                  <Input disabled={false} type="text" placeholder="ID Ayah" value={idAyah} onChange={(e) => setIdAyah(e.target.value)}/>
                </div>
  
                <div>
                  <Label title="ID Ibu *" />
                  <div className="input-group-addTernak">
                    <Input disabled={false} type="text" placeholder="ID Ibu" value={idIbu} onChange={(e) => setIdIbu(e.target.value)}/>
                  </div>
                </div>

                {/* <div>
                  <Label title="ID Kakek *" />
                  <Input disabled={false} type="text" placeholder="ID Kakek" value={idKakek} onChange={(e) => setIdKakek(e.target.value)}/>
                </div> */}
  
                {/* <div>
                  <Label title="ID Nenek *" />
                  <div className="input-group-addTernak">
                    <Input disabled={false} type="text" placeholder="ID Nenek" value={idNenek} onChange={(e) => setIdNenek(e.target.value)}/>
                  </div>
                </div> */}
              </div>
  
              <div className="grid-row-addTernak">
                <div>
                  {/* <Label title="Fase (pilihan) *" /> */}
                  {/* <Input 
                  disabled={false} 
                  type="text" 
                  placeholder="Fase" 
                  isDropdownField
                  dropdownIcon={<DropdownIcon />}
                  dropupIcon={<DropupIcon />}
                  readOnly
                  /> */}
                                
                </div>
  
                <div>
                  {/* <Label title="Jenis Kelamin (pilihan) *" /> */}
                  {/* <Input
                    disabled={false}
                    type="text"
                    placeholder="Jenis Kelamin"
                    isDropdownField
                    dropdownIcon={<DropdownIcon />}
                    dropupIcon={<DropupIcon />}
                    readOnly
                  /> */}
                </div>

               
                
              </div>


              
            </div>
          </div>
          
          <div className="simpanButton-addDetailTernak">
            <PrimaryButton
            label="Simpan"
            width={221}
            onClick={() => {
              handleValidationAndSubmit();
            }}
            />
            </div>

        </div>
      </div>
    );
  };
  
  const Label: React.FC<{ title: string }> = ({ title }) => (
    <label className="label-addTernak">{title}</label>
  );
  
  export default app;
  