import api from "@/lib/api";

export const requestAbhaOtp = (abhaNumber: string) =>
  api.post("/abha/request-otp", { abhaNumber }).then((r) => r.data);

export const verifyAbhaOtp = (p: {
  abhaNumber: string;
  txnId: string;
  otp: string;
}) => api.post("/abha/verify-otp", p).then((r) => r.data);
