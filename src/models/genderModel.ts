import { JSX } from "react";

export type LivestockGender = "betina" | "jantan";

interface iconModel{
    gender: LivestockGender;
    icon: JSX.Element;
}