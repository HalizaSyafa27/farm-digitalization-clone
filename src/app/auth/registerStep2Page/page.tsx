"use client";

import { Suspense, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateEmail, validatePassword } from "@/controllers/validationLoginRegister";
import { useRouter } from 'next/navigation'
import PrimaryButton from "@/components/ui/PrimaryButton/primaryButton";
import { setCookie } from "@/lib/cookies"; // Import setCookie
import { useSearchParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";

interface RegistrationData {
  email: string;
  password: string;
}

function InputDemo() {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter()
  const searchParams = useSearchParams(); 
  const roleFromQuery = searchParams.get("role");
  const [role, setRole] = useState(roleFromQuery || "owner"); 

  const usernameFromQuery = searchParams.get("username");
  const emailFromQuery = searchParams.get("email");
  const [username, setUsername] = useState(usernameFromQuery || "");
  const [email, setEmail] = useState(emailFromQuery || "");

  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null); // Type the state
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiData, setApiData] = useState(null);

  const handleValidationAndSubmit = async () => {
    const passwordValidation = validatePassword(password, rePassword);
    if (!passwordValidation.valid) {
      setErrorMessage(passwordValidation.message);
      return;
    }

    setCookie("role", role, { path: "/", maxAge: 7 * 24 * 60 * 60 });

    const newRegistrationData = {
      name: username,
      email: email,
      password: password,
      role: role,
    };

    setRegistrationData(newRegistrationData);

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/auth/register/`, {
        method: "POST",
        body: JSON.stringify(newRegistrationData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setApiData(data);
      if (response.ok) {
        router.push("/auth/loginPage");
      } else {
        setApiError(data.error || "Something went wrong");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="containerLoginRegister h-screen bg-cover bg-gray-100 flex justify-end items-center pr-[148px]"
    style={{ backgroundImage: "url('/Onboarding.jpg')" }}
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
        {/* Title */}
        <div className="tittle-step2">Langkah 2/2</div>
        <div className="tittle-register2 mb-6">Buat Akun Anda</div>

        {/* Form Fields */}
        <form className="space-y-4">
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Kata Sandi
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-green-500 rounded-[5px] focus:border-green-500 placeholder:text-[#B3B3B3]"
              placeholder="Kata Sandi"
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label
              htmlFor="reinput-password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Masukkan ulang kata sandi
            </label>
            <Input
              id="reinput-password"
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-[5px] placeholder:text-[#B3B3B3]"
              placeholder="Konfirmasi Kata Sandi"
            />
          </div>
    </form>
          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}

  

        {/* Submit Button */}
        <div className="button-register2">

            <PrimaryButton
            label="Register"
            width= {221}
            onClick={handleValidationAndSubmit}
            />
          </div>
    
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <InputDemo />
    </Suspense>
  )
}