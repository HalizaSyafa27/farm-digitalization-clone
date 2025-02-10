'use client'

import React, { Suspense, useEffect, useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import TabNavigation from "@/components/ui/TabNavigation/TabNavigation";
import { Input } from "@/components/ui/input"
import DropdownFase from '@/components/ui/DropdownPhase/DropdownPhase';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebaseApp from '@/lib/firebase'
import useFetch from '@/hooks/useFetch';
import { Livestock } from '@/models/LivestockModel';


function AddTernak () {
  const router = useRouter();

  // State hooks for all inputs
  const [idPasangan, setIdPasangan] = useState("");
  const [idTernak, setIdTernak] = useState("");
  const [rasTernak, setRasTernak] = useState("");
  const [grade, setGrade] = useState("");
  const [berat, setBerat] = useState("");
  const [selectedFase, setSelectedFase] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [kondisiTernak, setKondisiTernak] = useState("");
  const [status, setStatus] = useState("");
  const [kategoriHewan, setKategoriHewan] = useState("");
  const [error, setError] = useState(false);

  const searchParams = useSearchParams();
  const selectedFarm = searchParams.get('selectedFarm');
  const farmId = searchParams.get('farmId');

  const handleUpdateData = () => {
    if (idPasangan === "AJW-015") {
      setError(true);
      alert(
        "ID pasangan satu garis keturunan dengan ternak SPW-015. Masukkan ID lain untuk menghindari perkawinan sedarah."
      );
    } else {
      setError(false);
      alert("Data valid! Melanjutkan ke halaman berikutnya.");
  
      // Prepare query parameters
      const queryParams = new URLSearchParams({
        idPasangan,
        idTernak,
        rasTernak,
        grade,
        berat,
        fase: selectedFase,
        jenisKelamin,
        kondisiTernak,
        status,
        kategoriHewan,
        imageUrl: imageUrl || "",
      }).toString();
  
      // Pass data to the next page via query parameters
      router.push(`/defaultView/addTernakPage/addDataDetailTernakPage?selectedFarm=${selectedFarm}&farmId=${farmId}&${queryParams}`);
    }
  };
  

  const handleFaseSelect = (option: string) => {
    setSelectedFase(option);
  };

  const handleJenisKelaminSelect = (option: string) => {
    setJenisKelamin(option);
  };

  const handleStatusSelect = (option: string) => {
    setStatus(option);
  };

  const handleKategoriHewanSelect = (option: string) => {
    setKategoriHewan(option);
  };

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedImage = event.target.files[0];
      setImage(selectedImage);
      uploadImageToFirebase(selectedImage); // Automatically upload after selecting
    }
  };


  const handleDivClick = () => {
    if (typeof document !== 'undefined') {
      document.getElementById('file-input')?.click();
    }
  };

  const uploadImageToFirebase = (imageFile: File) => {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `livestock/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
        alert("Image upload failed.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL); // Set the image URL after successful upload
          alert("Image uploaded successfully!");
        });
      }
    );
  };

  const { data: customIdSapi, loading: loadingCustomIdSapi, error: errorCustomIdSapi } = useFetch<CustomId>(
    `${process.env.NEXT_PUBLIC_API_HOST}/livestock-custom-ids/${farmId}/Sapi`
  );
  
  const { data: customIdKambing, loading: loadingCustomIdKambing, error: errorCustomIdKambing } = useFetch<CustomId>(
    `${process.env.NEXT_PUBLIC_API_HOST}/livestock-custom-ids/${farmId}/Kambing`
  );
  
  const { data: customIdDomba, loading: loadingCustomIdDomba, error: errorCustomIdDomba } = useFetch<CustomId>(
    `${process.env.NEXT_PUBLIC_API_HOST}/livestock-custom-ids/${farmId}/Domba`
  );

  const { data: livestockData, loading: loadingLivestock, error: errorLivestock } = useFetch<Livestock[]>(
      `${process.env.NEXT_PUBLIC_API_HOST}/livestocks`,
  );

  const generateIdTernak = () => {
    if (kategoriHewan === "Kambing") {
      return customIdKambing
        ? `${customIdKambing.custom_prefix}${(customIdKambing.last_number + 1).toString().padStart(4, "0")}`
        : `${((livestockData?.filter((livestock) => livestock.farm_name === selectedFarm).length ?? 0) + 1).toString().padStart(4, "0")}`;
    }
    if (kategoriHewan === "Sapi") {
      return customIdSapi
        ? `${customIdSapi.custom_prefix}${(customIdSapi.last_number + 1).toString().padStart(4, "0")}`
        : `${((livestockData?.filter((livestock) => livestock.farm_name === selectedFarm).length ?? 0) + 1).toString().padStart(4, "0")}`;
    }
    if (kategoriHewan === "Domba") {
      return customIdDomba
        ? `${customIdDomba.custom_prefix}${(customIdDomba.last_number + 1).toString().padStart(4, "0")}`
        : `${((livestockData?.filter((livestock) => livestock.farm_name === selectedFarm).length ?? 0) + 1).toString().padStart(4, "0")}`;
    }
    return "Pilih kategori hewan terlebih dahulu";
  };

  useEffect(() => {
    setIdTernak(generateIdTernak());

    console.log("URL Search Params:", searchParams.toString());
    console.log("Selected Farm:", selectedFarm);
    console.log("Farm ID:", farmId);
  }, [kategoriHewan, customIdKambing, customIdSapi, customIdDomba, selectedFarm, livestockData]);


  return (
    <div className="container-addTernak">
      <div className="sidebar-addTernak">
        <TabNavigation />
      </div>
      <div className="main-content-addTernak">
        <div className="content-wrapper-addTernak">
          <div className="section-addTernak" onClick={handleDivClick}>
            <h3 className="tittle-addTernak">Masukkan Gambar</h3>
            {imageUrl ? (
              <img src={imageUrl} alt="ternak" className="image-addTernak" />
            ) : (
              <div className="image-placeholder-addTernak">
                Klik di sini untuk memilih gambar
              </div>
            )}
            <input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          <div>
            <div className="sectionInput-addTernak">
              <Label title="ID Ternak *" />
              <Input
                disabled={true}
                type="text"
                placeholder="Pilih hewan ternak dahulu"
                value={idTernak}
                onChange={(e) => setIdTernak(e.target.value)}
              />


              <Label title="Ras Ternak *" />
              <Input
                disabled={false}
                type="text"
                placeholder="Ras Ternak"
                value={rasTernak}
                onChange={(e) => setRasTernak(e.target.value)}
              />

              <div className="grid-row-addTernak">
                <div>
                  <Label title="Grade" />
                  <Input
                    disabled={false}
                    type="text"
                    placeholder="Grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  />
                </div>

                <div>
                  <Label title="Berat*" />
                  <div className="input-group-addTernak">
                    <Input
                      disabled={false}
                      type="number"
                      placeholder="Berat"
                      value={berat}
                      onChange={(e) => setBerat(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid-row-addTernak">
                <div>
                  <Label title="Fase (pilihan) *" />
                  <DropdownFase
                    options={['Cempe', 'Dara', 'Hamil', 'Siap Kawin', 'Lepas Sapih', 'Afkir']}
                    placeholder="Fase"
                    onSelect={handleFaseSelect}
                  />
                </div>

                <div>
                  <Label title="Jenis Kelamin (pilihan) *" />
                  <DropdownFase
                    options={['Jantan', 'Betina']}
                    placeholder="Jenis Kelamin"
                    onSelect={handleJenisKelaminSelect}
                  />
                </div>

                {selectedFase === "Hamil" && (
                  <div className="extra-input-addTernak">
                  <Label title="ID Pasangan *" />
                  <Input
                    disabled={false}
                    type="text"
                    placeholder="AJW-015"
                    value={idPasangan}
                    onChange={(e) => {
                      const inputIdPasangan = e.target.value;
                      setIdPasangan(inputIdPasangan);

                      if (livestockData && Array.isArray(livestockData)) {
                        const isRasTernakValid = !livestockData.some(
                          (livestock) => livestock.name_id === inputIdPasangan && livestock.breed === rasTernak
                        );

                        if (!isRasTernakValid) {
                          setError(true);
                        } else {
                          setError(false);
                        }
                      }
                    }}
                    style={{
                      borderColor: error ? "red" : "black",
                    }}
                  />

                  </div>
                )}
              </div>

              <div className="kondisiTernakSection">
                <Label title="Kondisi ternak *" />
                <div className="radio-group-addTernak">
                  <div>
                    <input
                      type="radio"
                      id="sehat"
                      name="kondisi"
                      value="sehat"
                      checked={kondisiTernak === "sehat"}
                      onChange={() => setKondisiTernak("sehat")}
                    />
                    <label htmlFor="sehat">Sehat</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="sakit"
                      name="kondisi"
                      value="sakit"
                      checked={kondisiTernak === "sakit"}
                      onChange={() => setKondisiTernak("sakit")}
                    />
                    <label htmlFor="sakit">Sakit</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="statusPilihan-addTernak">
              <div className="choice-StatusCategory">
                <Label title="Status (Pilihan) *" />
                <DropdownFase
                  options={['Tersedia', 'Hilang', 'Mati', 'Terjual']}
                  placeholder="Status"
                  onSelect={handleStatusSelect}
                />
              </div>

              <div className="choice-StatusCategory">
                <Label title="Kategori Hewan (Pilihan) *" />
                <DropdownFase
                  options={['Kambing', 'Sapi', 'Domba']}
                  placeholder="Kategori Hewan"
                  onSelect={handleKategoriHewanSelect}
                />
              </div>
            </div>

            <div className="lanjutButton-addTernak">
            <PrimaryButton
              label="Lanjut"
              width={221}
              onClick={handleUpdateData}
              disabled={
                idTernak === "" || idTernak === null ||
                rasTernak === "" || rasTernak === null ||
                grade === "" || grade === null ||
                berat === "" || berat === null ||
                selectedFase === "" || selectedFase === null ||
                jenisKelamin === "" || jenisKelamin === null ||
                kondisiTernak === "" || kondisiTernak === null ||
                status === "" || status === null ||
                kategoriHewan === "" || kategoriHewan === null ||
                imageUrl === "" || imageUrl === null || 
                error
              }
            />
            </div>
          </div>
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
