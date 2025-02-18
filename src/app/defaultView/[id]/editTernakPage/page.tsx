'use client'

import React, { use, useEffect, useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton/primaryButton';
import TabNavigation from "@/components/ui/TabNavigation/TabNavigation";
import { Input } from "@/components/ui/input"
import DropdownFase from '@/components/ui/DropdownPhase/DropdownPhase';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebaseApp from '@/lib/firebase'
import useFetch from '@/hooks/useFetch';
import { Livestock } from '@/models/LivestockModel';

interface EditLivestockPageProps {
  params: Promise<{
      id: number;
  }>;
}

const app: React.FC<EditLivestockPageProps> = ({ params: paramsPromise }) => {
  const router = useRouter();
  const params = use(paramsPromise);
  const id = params.id;

  const { data: livestock, loading: loadingLivestock, error: errorLivestock } = useFetch<Livestock>(
    `${process.env.NEXT_PUBLIC_API_HOST}/livestocks/${id}`,
  );

  const { data: livestockData, loading: loadingLivestockData, error: errorLivestockData } = useFetch<Livestock[]>(
      `${process.env.NEXT_PUBLIC_API_HOST}/livestocks`,
  );


  useEffect(() => {
      if (livestock) {
          console.log(livestock)
      }
  }, [livestock]);

  useEffect(() => {
    if (livestock) {
      setIdTernak(livestock.name_id);
      setRasTernak(livestock.breed);
      setGrade(livestock.grade);
      setBerat(livestock.weight);
      setSelectedFase(livestock.phase);
      setJenisKelamin(livestock.gender);
      setKondisiTernak(livestock.condition);
      setStatus(livestock.status);
      setKategoriHewan(livestock.category);
      setImageUrl(livestock.photo_url);
      // setIdPasangan(livestock.idPasangan || ""); // ID Pasangan can be empty for some records
    }
  }, [livestock]);

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
    if (error) {
      setError(true);
      alert(
        "Data tidak valid, coba cek data yang diisi kembali!"
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
      router.push(`/defaultView/${id}/editTernakPage/editDataDetailTernakPage?selectedFarm=${selectedFarm}&farmId=${farmId}&${queryParams}`);
    }
  };
  
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 720);
  useEffect(() => {
  const checkScreenSize = () => {
  setIsMobile(window.innerWidth <= 720);
  };
             
  window.addEventListener("resize", checkScreenSize);
  return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  return (
    <div className="container-addTernak">
      {isMobile?
      (
      <>
      <div className="main-content-addTernak">
        <div className="content-wrapper-addTernak">
          <div className="section-addTernak-mobile" onClick={handleDivClick}>
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
                placeholder="ID Ternak"
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
                    options={jenisKelamin == "Jantan" ? ['Cempe', 'Dara', 'Siap Kawin', 'Lepas Sapih', 'Afkir'] : ['Cempe', 'Dara', 'Hamil', 'Siap Kawin', 'Lepas Sapih', 'Afkir']}
                    placeholder={livestock?.phase ?? "Fase"}
                    onSelect={handleFaseSelect}
                  />
                </div>

                <div>
                  <Label title="Jenis Kelamin (pilihan) *" />
                  <DropdownFase
                    options={['Jantan', 'Betina']}
                    placeholder={livestock?.gender ?? "Jenis Kelamin"}
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
                            (livestock) => livestock.name_id === inputIdPasangan && livestock.gender === "Betina" && inputIdPasangan == idPasangan
                          );
  
                          if (!isRasTernakValid) {
                            setError(true);
                          } else {
                            console.log(inputIdPasangan)
                            console.log(livestock?.dad_name_id)
                            if (inputIdPasangan.toString() == livestock?.dad_name_id) {
                              setError(true);
                            } else {
                              setError(false);
                            }
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
                  placeholder={livestock?.status ?? "Status"}
                  onSelect={handleStatusSelect}
                />
              </div>

              <div className="choice-StatusCategory">
                <Label title="Kategori Hewan (Pilihan) *" />
                <DropdownFase
                  options={['Kambing', 'Sapi', 'Domba']}
                  placeholder={livestock?.category ?? "Kategori Hewan"}
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
        </>
      ) : (
        <>
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
                placeholder="ID Ternak"
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
                    options={jenisKelamin == "Jantan" ? ['Cempe', 'Dara', 'Siap Kawin', 'Lepas Sapih', 'Afkir'] : ['Cempe', 'Dara', 'Hamil', 'Siap Kawin', 'Lepas Sapih', 'Afkir']}
                    placeholder={livestock?.phase ?? "Fase"}
                    onSelect={handleFaseSelect}
                  />
                </div>

                <div>
                  <Label title="Jenis Kelamin (pilihan) *" />
                  <DropdownFase
                    options={['Jantan', 'Betina']}
                    placeholder={livestock?.gender ?? "Jenis Kelamin"}
                    onSelect={handleJenisKelaminSelect}
                  />
                </div>

                {selectedFase === "Hamil" && (
                  <div className="extra-input-addTernak">
                    <Label title="ID Pasangan *" />
                    <Input
                      disabled={false}
                      type="text"
                      placeholder="ID Pasangan"
                      value={idPasangan}
                      onChange={(e) => {
                        const inputIdPasangan = e.target.value;
                        setIdPasangan(inputIdPasangan);
  
                        if (livestockData && Array.isArray(livestockData)) {
                          const isRasTernakValid = !livestockData.some(
                            (livestock) => livestock.name_id === inputIdPasangan && livestock.gender === "Betina" && inputIdPasangan == idPasangan
                          );
  
                          if (!isRasTernakValid) {
                            setError(true);
                          } else {
                            console.log("idPasangan: " + inputIdPasangan)
                            console.log(livestock?.dad_name_id)
                            if (inputIdPasangan.toString() == livestock?.dad_name_id) {
                              setError(true);
                            } else {
                              setError(false);
                            }
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
                  placeholder={livestock?.status ?? "Status"}
                  onSelect={handleStatusSelect}
                />
              </div>

              <div className="choice-StatusCategory">
                <Label title="Kategori Hewan (Pilihan) *" />
                <DropdownFase
                  options={['Kambing', 'Sapi', 'Domba']}
                  placeholder={livestock?.category ?? "Kategori Hewan"}
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
        </>
      )}
    </div>
  );
};

const Label: React.FC<{ title: string }> = ({ title }) => (
  <label className="label-addTernak">{title}</label>
);

export default app;
