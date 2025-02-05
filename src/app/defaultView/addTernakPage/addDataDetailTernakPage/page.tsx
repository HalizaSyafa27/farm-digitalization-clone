'use client'

import React, { Suspense, useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import TabNavigation from "@/components/ui/TabNavigation/TabNavigation";
import { Input } from "@/components/ui/input"
import DropdownFase from '@/components/ui/DropdownPhase/DropdownPhase';
import { useRouter, useSearchParams } from 'next/navigation'
import { getCookie } from '@/lib/cookies';
import useFetch from '@/hooks/useFetch';
import { FarmModel } from '@/models/FarmModel';
// import { farmListData } from '@/data/farmData';

function AddTernak () {
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

    const handleValidationAndSubmit = async () => {
      try {
        const payload = {
          name_id: idTernak, 
          gender: jenisKelamin === "Jantan" ? "MALE" : "FEMALE",
          dob: dob,
          weight: berat,
          phase: fase,
          photo_url: imageUrl,
          breed: rasTernak,
          category: kategoriHewan,
          condition: kondisiTernak,
          status: status,
          grade: grade,
          type_id: kategoriHewan,
          farm_name: selectedFarm,
          farmId: farmId,
          dad_name_id: idAyah,
          mom_name_id: idIbu,
          grandpa_name_id: idKakek,
          grandma_name_id: idNenek,
          spouse_id: idPasangan
      };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/animals`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();
        if (response.ok) {
          router.push("/defaultView?view=livestock");

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/livestock-custom-ids/increment`, {
            method: "POST",
            body: JSON.stringify({
              farmId: farmId,
              typeId: kategoriHewan
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
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
                  <Input disabled={false} type="text" placeholder="ID Ayah" onChange={(e) => setIdAyah(e.target.value)}/>
                </div>
  
                <div>
                  <Label title="ID Ibu *" />
                  <div className="input-group-addTernak">
                    <Input disabled={false} type="text" placeholder="ID Ibu" onChange={(e) => setIdIbu(e.target.value)}/>
                  </div>
                </div>

                {/* <div>
                  <Label title="ID Kakek *" />
                  <Input disabled={false} type="text" placeholder="ID Kakek" onChange={(e) => setIdKakek(e.target.value)}/>
                </div> */}
  
                {/* <div>
                  <Label title="ID Nenek *" />
                  <div className="input-group-addTernak">
                    <Input disabled={false} type="text" placeholder="ID Nenek" onChange={(e) => setIdNenek(e.target.value)}/>
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
  
  export default function AddTernakPage() {
    return (
      <Suspense>
        <AddTernak />
      </Suspense>
    )
  }