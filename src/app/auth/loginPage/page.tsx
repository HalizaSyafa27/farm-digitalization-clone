"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateEmail } from "@/controllers/validationLoginRegister";
import PrimaryButton from "@/components/ui/PrimaryButton/primaryButton";
import { useRouter } from 'next/navigation'
import { getCookie, setCookie } from "@/lib/cookies";

interface LoginData {
  email: string;
  password: string;
}

export default function InputDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter()

  const [loginData, setloginData] = useState<LoginData | null>(null); // Type the state

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiData, setApiData] = useState(null);


  const handleValidationAndSubmit = async () => {
    const validation = validateEmail(email);
  
    if (!validation.valid) {
      setErrorMessage("Masukkan email atau nomor HP yang valid.");
    } else if (!password) {
      setErrorMessage("Password tidak boleh kosong.");
    } else {
      const storedUsername = getCookie("username"); 
      const storedRole = getCookie("role"); 

      setLoading(true);
      try {
        const loginData = {
          email: email,
          password: password,
        };

        setloginData(loginData)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/auth/login`, {
          method: "POST",
          body: JSON.stringify(loginData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setApiData(data);

        setCookie("role", data.user.role, { path: "/", maxAge: 7 * 24 * 60 * 60 });
        setCookie("token", data.token, { path: "/", maxAge: 7 * 24 * 60 * 60 });
        setCookie("id", data.user.id, { path: "/", maxAge: 7 * 24 * 60 * 60 });

        if (response.ok) {
          console.log(`Login berhasil untuk ${storedUsername} dengan role ${storedRole}`);
          router.push("/defaultView"); 
        } else {
          setErrorMessage("Data login tidak ditemukan. Silakan register ulang.");
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="containerLoginRegister h-screen bg-cover bg-gray-100 flex justify-end items-center pr-[148px]"
    >
        {/* Bagian Teks */}
    <div className="text-container pl-[148px] text-white">
      <h1 className="text-5xl font-bold leading-tight">
        Selamat Datang 
        <br />
        di 
        <span className="text-ternakku"> Ternakku</span> !

      </h1>
      <p className="text-desc">
        Beralih ke cara pintar dalam mengelola  <br /> peternakan Anda!
      </p>
    </div>

    {/* Card */}
    <div className="bg-white w-[400px] p-8 rounded-[34px] shadow-md">
      {/* Placeholder for Title */}
      <div className="tittle-login mb-6">
        Masuk ke <br />
        akun anda
      </div>
  
      {/* Form Fields */}
      <form className="space-y-4">
        {/* Email / Nomor HP */}
        <div className="form-email">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-[5px] placeholder:text-[#B3B3B3]"
            placeholder="Email atau Nomor HP"
          />
        </div>
  
        {/* Password */}
        <div className="form-password">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kata Sandi
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-[5px] placeholder:text-[#B3B3B3]"
            placeholder="Minimal 8 karakter"
          />
        </div>
  
        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </form>

      {/* Submit Button */}
      <div className="button-login">

        <PrimaryButton
        label="Masuk"
        width={221}
        onClick={handleValidationAndSubmit}
        />
        
      </div>
  
      {/* Placeholder for Footer */}
      <div className="mt-6">
        Baru di Ternakku?{" "}
        <span
        className="text-green-600 font-bold cursor-pointer"
        onClick={() => router.push(`/auth/registerStep1Page`)}
      >
        Daftar
      </span>
      </div>
    </div>
  </div>  
  );
}