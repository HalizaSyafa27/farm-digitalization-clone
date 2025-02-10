'use client'

import React, { Suspense, useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";
import { useRouter, useSearchParams } from 'next/navigation'
import OwnerViewPage from "../../components/ui/DefaultPage/ownerViewPage/page";
import DefaultOwnerViewPage from "@/components/ui/DefaultPage/defaultOwnerViewPage/page"
import LivestockOwnerPage from "@/components/ui/DefaultPage/livestockOwnerPage/page";
import ActivityOwnerPage from "@/components/ui/DefaultPage/activityOwnerPage/page"
import SettingOwnerPage from "@/components/ui/DefaultPage/settingsOwnerPage/page"
import SapiDetailStatisticsPage from "@/components/ui/DefaultPage/sapiDetailStatisticsPage/page"
import KambingDetailStaticsPage from "@/components/ui/DefaultPage/kambingDetailStatisticsPage/page"
import DombaDetailStaticsPage from "@/components/ui/DefaultPage/dombaDetailStatisticsPage/page"
import useFetch from "@/hooks/useFetch";
import { FarmModel } from "@/models/FarmModel";


const DefaultViewPage: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const [breadcrumb, setBreadcrumb] = useState("Statistik");
  const [isFarmInvited, setIsFarmInvited] = useState(false);
  const searchParams = useSearchParams();

  const storedId = getCookie("id"); 

  const { data, loading, error } = useFetch<FarmModel[]>(
      role == "owner" ? `${process.env.NEXT_PUBLIC_API_HOST}/farms?ownerId=${storedId}` : `${process.env.NEXT_PUBLIC_API_HOST}/farms/operator/${storedId}`,
  );

  useEffect(() => {
    const fetchedRole = getCookie("role");
    console.log("Role fetched from cookie:", fetchedRole);
    setRole(fetchedRole);
  }, []);

const view = searchParams.get("view");

const renderViewBasedOnRole = () => {
  if (role != null) {
    if (data?.length == 0) {
      // return <DefaultOwnerViewPage key="defaultOwnerView" setIsFarmInvited={setIsFarmInvited} />;
      return <DefaultOwnerViewPage setIsFarmInvited={setIsFarmInvited} />;

    }
    switch (view) {
      // case "livestock":
      //   return <LivestockOwnerPage key="livestockOwner" />;
      // case "activity":
      //   return <ActivityOwnerPage key="activityOwner" />;
      // case "settings":
      //   return <SettingOwnerPage key="settingsOwner" />;
      // case "sapi":
      //   return <SapiDetailStatisticsPage key="sapiStatistics" />;
      // case "kambing":
      //   return <KambingDetailStaticsPage key="kambingStatistics" />;
      // case "domba":
      //   return <DombaDetailStaticsPage key="dombaStatistics" />;
      // default:
      //   return <OwnerViewPage key="ownerView" breadcrumb={breadcrumb} setBreadcrumb={setBreadcrumb} />;
      case "livestock":
        return <LivestockOwnerPage />;
      case "activity":
        return <ActivityOwnerPage />;
      case "settings":
          return <SettingOwnerPage />;
      case "sapi":
          return <SapiDetailStatisticsPage />;
      case "kambing":
            return <KambingDetailStaticsPage />;
      case "domba":
            return <DombaDetailStaticsPage />;
     
      default:
        return <OwnerViewPage breadcrumb={breadcrumb} setBreadcrumb={setBreadcrumb} />;
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Role tidak valid</h1>
      <p>Silakan login kembali untuk mendapatkan akses yang sesuai.</p>
    </div>
  );
};

return (
  <div>
    {renderViewBasedOnRole()}
  </div>
);
};

export default function DefaultViewPageExport() {
  return (
    <Suspense>
      <DefaultViewPage />
    </Suspense>
  )
}