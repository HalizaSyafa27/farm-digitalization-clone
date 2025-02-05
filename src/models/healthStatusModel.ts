import { JSX } from "react";

export type StatusType = "sehat" | "tidakSehat";

interface StatusModel {
  status: StatusType;
  icon: JSX.Element;
}
