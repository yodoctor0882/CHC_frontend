
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  SkipForward,
  ArrowRight,
  DoorOpen,
} from "lucide-react";

import { StatCard, Panel } from "@/components/cards/Card";
import StatusBadge from "@/components/badges/StatusBadge";
import { MiniTokenChip } from "@/components/token/TokenBoard";

import {
  doctorService,
  type DoctorOPD,
  type DoctorPatient,
  type CurrentPatient,
} from "@/services/doctorservice";

export default function DoctorDashboard() {
  const [opd, setOpd] = useState<DoctorOPD | null>(null);
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [currentPatient, setCurrentPatient] =
    useState<CurrentPatient | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [todayResponse, patientsResponse, currentResponse] =
        await Promise.all([
          doctorService.getToday(),
          doctorService.getPatients(),
          doctorService.getCurrentPatient().catch((err) => {
            if (err?.response?.status === 404) {
              return { success: true, data: null };
            }
            throw err;
          }),
        ]);

      setOpd(todayResponse?.data ?? null);
      setPatients(patientsResponse?.data ?? []);
      setCurrentPatient(currentResponse?.data ?? null);
    } catch (err: any) {
      console.error("Doctor dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load doctor dashboard",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const waiting = useMemo(
    () => patients.filter((p) => p.status === "WAITING").length,
    [patients],
  );

  const completed = useMemo(
    () =>
      patients.filter((p) =>
        [
          "COMPLETED",
          "MEDICINE_PENDING",
          "MEDICINE_COMPLETED",
        ].includes(p.status),
      ).length,
    [patients],
  );

  const skipped = useMemo(
    () => patients.filter((p) => p.status === "SKIPPED").length,
    [patients],
  );

  if (loading) {
    return (
      <Panel>
        <div className="py-10 text-center text-sm text-slate-500">
          Loading doctor dashboard...
        </div>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel>
        <div className="py-10 text-center">
          <p className="text-sm text-red-500">{error}</p>

          <button
            onClick={loadDashboard}
            className="mt-4 rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
          >
            Retry
          </button>
        </div>
      </Panel>
    );
  }

  if (!opd) {
    return (
      <Panel>
        <div className="py-10 text-center">
          <p className="text-sm text-slate-500">
            No OPD session found for today.
          </p>
        </div>
      </Panel>
    );
  }

  const doctorName = opd.doctor_name || "Doctor";
  const doctorInitial = doctorName
    .split(" ")
    .slice(-1)[0]
    .charAt(0)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Doctor / OPD Header */}
      <Panel className="!p-0 overflow-hidden">
        <div className="flex flex-col justify-between gap-4 bg-teal-50/60 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-teal-800 text-xl font-bold text-white">
              {doctorInitial}
            </span>

            <div>
              <p className="font-display text-lg font-bold text-ink">
                {doctorName}
              </p>

              <p className="text-sm text-slate-500">
                {opd.specializations || "Doctor"}
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <DoorOpen size={13} />
                Room {opd.room_number} · {opd.room_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:self-start">
            <StatusBadge status={opd.status} />
          </div>
        </div>
      </Panel>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total patients"
          value={patients.length}
          icon={Users}
        />

        <StatCard
          label="Waiting"
          value={waiting}
          icon={Clock}
          tone="amber"
        />

        <StatCard
          label="Completed"
          value={completed}
          icon={CheckCircle2}
          tone="green"
        />

        <StatCard
          label="Skipped"
          value={skipped}
          icon={SkipForward}
          tone="red"
        />
      </div>

      {/* Current consultation */}
      <Panel title="Current consultation">
        {currentPatient ? (
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <MiniTokenChip
                code={`T-${currentPatient.token_number}`}
              />

              <div>
                <p className="font-display font-semibold text-ink">
                  {currentPatient.name}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {currentPatient.patient_id} · {currentPatient.age} yrs ·{" "}
                  {currentPatient.gender}
                </p>
              </div>
            </div>

            <Link
              href={`/doctor/prescription?tokenId=${currentPatient.token_id}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
            >
              Continue consultation
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-500">
              No patient currently in consultation.
            </p>

            <Link
              href="/doctor/patients"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
            >
              Go to queue
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </Panel>
    </div>
  );
}
