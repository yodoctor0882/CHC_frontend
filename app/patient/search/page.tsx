
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search as SearchIcon,
  DoorOpen,
  Stethoscope,
  Users,
} from "lucide-react";

import StatusBadge from "@/components/badges/StatusBadge";
import { ConfirmDialog } from "@/components/modals/Modal";
import { EmptyState } from "@/components/common/States";
import { useToast } from "@/components/common/Toast";

import {
  searchDiseaseSpecialization,
  getOpdOptions,
  bookToken,
} from "@/services/patientservice";

export default function PatientSearchPage() {
  const { show } = useToast();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [confirmRoom, setConfirmRoom] = useState<any>(null);
  const [booking, setBooking] = useState(false);

  // Prevent old search responses from replacing newer results
  const requestId = useRef(0);

  // ========================================
  // SEARCH + LOAD AVAILABLE ROOMS
  // ========================================

  useEffect(() => {
    const value = query.trim();

    if (value.length < 2) {
      requestId.current += 1;
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      searchData(value);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  async function searchData(value: string) {
    const currentRequest = ++requestId.current;

    try {
      setLoading(true);
      setSearched(false);
      setConfirmRoom(null);

      const response = await searchDiseaseSpecialization(value);

      if (currentRequest !== requestId.current) return;

      if (!response?.success) {
        setResults([]);
        setSearched(true);
        return;
      }

      const data = response.data || [];

      const items = Array.isArray(data)
        ? data
        : data.results ||
          data.specializations ||
          data.data ||
          [];

      // Show search results immediately
      const initialResults = items.map((item: any) => ({
        ...item,
        rooms: [],
        roomsLoading: true,
        roomsError: false,
      }));

      setResults(initialResults);
      setSearched(true);

      // Fetch rooms for every matching disease/specialization
      const updatedResults = await Promise.all(
        initialResults.map(async (item: any) => {
          const id =
            item.id ??
            item.specialization_id ??
            item.specializationId ??
            item.disease_id ??
            item.diseaseId;

          const type = String(item.type || "").toUpperCase();

          if (!id || !["SPECIALIZATION", "DISEASE"].includes(type)) {
            return {
              ...item,
              roomsLoading: false,
              roomsError: true,
            };
          }

          try {
            const specializationId =
              type === "SPECIALIZATION" ? String(id) : undefined;

            const diseaseId =
              type === "DISEASE" ? String(id) : undefined;

            const opdResponse = await getOpdOptions(
              specializationId,
              diseaseId,
            );

            if (!opdResponse?.success) {
              return {
                ...item,
                rooms: [],
                roomsLoading: false,
                roomsError: true,
              };
            }

            const opdData = opdResponse.data || [];

            const rooms = Array.isArray(opdData)
              ? opdData
              : opdData.rooms || [];

            return {
              ...item,
              rooms,
              roomsLoading: false,
              roomsError: false,
            };
          } catch (error) {
            console.error("Load OPD rooms error:", error);

            return {
              ...item,
              rooms: [],
              roomsLoading: false,
              roomsError: true,
            };
          }
        }),
      );

      if (currentRequest !== requestId.current) return;

      setResults(updatedResults);
    } catch (error: any) {
      if (currentRequest !== requestId.current) return;

      console.error(
        "Patient search API error:",
        error?.response?.data || error,
      );

      setResults([]);

      show(
        "error",
        error?.response?.data?.message || "Unable to search.",
      );
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }

  // ========================================
  // BOOK TOKEN
  // ========================================

  async function handleConfirmBook() {
    if (!confirmRoom) return;

    try {
      setBooking(true);

      const response = await bookToken(
        confirmRoom.opd_session_id,
      );

      if (response?.success) {
        show(
          "success",
          response.message || "Token booked successfully.",
        );

        setConfirmRoom(null);

        window.location.href = "/patient/token";
      }
    } catch (error: any) {
      console.error(
        "Book token API error:",
        error?.response?.data || error,
      );

      show(
        "error",
        error?.response?.data?.message ||
          "Unable to book token.",
      );
    } finally {
      setBooking(false);
    }
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="space-y-6 max-w-3xl">
      {/* HEADER */}

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Search disease or specialization
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Search to see available OPD rooms and doctors.
        </p>
      </div>

      {/* SEARCH INPUT */}

      <div className="relative">
        <SearchIcon
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search disease or specialization"
          className="w-full text-sm bg-panel border border-line rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-teal-700"
        />
      </div>

      {!query && (
        <p className="text-xs text-slate-400">
          Enter at least 2 characters to search.
        </p>
      )}

      {/* SEARCH LOADING */}

      {loading && (
        <div className="text-center py-5">
          <p className="text-sm text-slate-500">
            Searching...
          </p>
        </div>
      )}

      {/* NO SEARCH RESULTS */}

      {!loading && searched && results.length === 0 && (
        <EmptyState
          title="No matching result"
          description="Try a different disease name or specialization."
        />
      )}

      {/* SEARCH RESULTS + AVAILABLE ROOMS */}

      {!loading &&
        results.map((item, index) => {
          const id =
            item.id ??
            item.specialization_id ??
            item.specializationId ??
            item.disease_id ??
            item.diseaseId;

          const name =
            item.name ??
            item.specialization_name ??
            item.specializationName ??
            item.disease_name ??
            item.diseaseName ??
            "Unknown";

          const description =
            item.description ??
            item.specialization_description ??
            item.disease_description ??
            "";

          const type = String(item.type || "").toUpperCase();

          return (
            <div
              key={`${type}-${id ?? index}`}
              className="space-y-3"
            >
              {/* SEARCHED SPECIALIZATION / DISEASE */}

              <div className="bg-panel border border-line rounded-2xl p-5">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-semibold text-ink text-[15px]">
                    {name}
                  </h2>

                  {type && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      {type}
                    </span>
                  )}
                </div>

                {description && (
                  <p className="text-sm text-slate-500 mt-1">
                    {description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <DoorOpen size={13} />
                    {item.rooms.length} OPD
                    {item.rooms.length !== 1 ? "s" : ""}
                    {" "}available
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Stethoscope size={13} />
                    {new Set(
                      item.rooms
                        .map((room: any) => room.doctor_id)
                        .filter(Boolean),
                    ).size}{" "}
                    doctor
                    {new Set(
                      item.rooms
                        .map((room: any) => room.doctor_id)
                        .filter(Boolean),
                    ).size !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>
              </div>

              {/* ROOMS LOADING */}

              {item.roomsLoading && (
                <div className="text-center py-5">
                  <p className="text-sm text-slate-500">
                    Loading available rooms...
                  </p>
                </div>
              )}

              {/* ROOM API ERROR */}

              {!item.roomsLoading && item.roomsError && (
                <p className="text-sm text-red-600 px-2">
                  Unable to load rooms for this result.
                </p>
              )}

              {/* NO ROOMS */}

              {!item.roomsLoading &&
                !item.roomsError &&
                item.rooms.length === 0 && (
                  <EmptyState
                    title="No OPD open right now"
                    description="Please check back later or choose a different search."
                  />
                )}

              {/* ROOM CARDS */}

              {!item.roomsLoading &&
                !item.roomsError &&
                item.rooms.map((room: any) => (
                  <div
                    key={room.opd_session_id}
                    className="bg-panel border border-line rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5">
                        <p className="font-display font-bold text-ink text-[15px]">
                          Room {room.room_number}
                        </p>

                        <StatusBadge status={room.status} />
                      </div>

                      <p className="text-sm text-slate-500 mt-0.5">
                        {room.room_name || "OPD Room"}
                      </p>

                      <p className="text-sm text-ink mt-2 font-medium">
                        {room.doctor_name || "Doctor to be assigned"}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {room.specialization_name || name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <Users size={13} />
                        {room.waiting_count ?? 0} patient
                        {(room.waiting_count ?? 0) !== 1 ? "s" : ""}
                        {" "}waiting
                      </p>
                    </div>

                    <button
                      onClick={() => setConfirmRoom(room)}
                      disabled={
                        booking ||
                        !room.opd_session_id ||
                        !["NOT_STARTED", "RUNNING"].includes(
                          room.status,
                        )
                      }
                      className="inline-flex items-center justify-center gap-1.5 bg-teal-800 text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-teal-900 disabled:opacity-40 shrink-0"
                    >
                      Book OPD
                    </button>
                  </div>
                ))}
            </div>
          );
        })}

      {/* BOOKING CONFIRMATION */}

      <ConfirmDialog
        open={!!confirmRoom}
        onClose={() => !booking && setConfirmRoom(null)}
        onConfirm={handleConfirmBook}
        title="Confirm token booking"
        description="You can book only one OPD token per day. Please confirm you want to proceed with this room."
        confirmLabel={booking ? "Booking..." : "Book token"}
        danger={false}
      />
    </div>
  );
}
