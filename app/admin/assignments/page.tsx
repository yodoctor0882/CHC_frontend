"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, X } from "lucide-react";

import { Panel } from "@/components/cards/Card";
import DataTable, { Column } from "@/components/tables/DataTable";
import StatusBadge from "@/components/badges/StatusBadge";
import { SelectField, TextField } from "@/components/forms/Field";
import { useToast } from "@/components/common/Toast";

import {
  getDoctors,
  getRooms,
  getDoctorRoomAssignments,
  assignDoctorToRoom,
  updateDoctorRoomAssignment,
  type AdminDoctor,
  type AdminRoom,
  type DoctorRoomAssignment,
} from "@/services/adminservice";

const DEFAULT_FORM = {
  doctorId: "",
  roomId: "",
  startTime: "09:00",
  endTime: "13:00",
};

const getTimeValue = (value?: string | null) =>
  value ? String(value).slice(0, 5) : "";

const isTrue = (value: unknown) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  String(value).toLowerCase() === "true";

export default function AdminAssignmentsPage() {
  const { show } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [assignments, setAssignments] = useState<DoctorRoomAssignment[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ ...DEFAULT_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedDoctor = doctors.find(
    (doctor) => String(doctor.id) === form.doctorId,
  );

  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        doctorsResponse,
        roomsResponse,
        assignmentsResponse,
      ] = await Promise.all([
        getDoctors(),
        getRooms(),
        getDoctorRoomAssignments(),
      ]);

      setDoctors(doctorsResponse ?? []);
      setRooms(roomsResponse ?? []);
      setAssignments(assignmentsResponse?.data ?? []);
    } catch (error: any) {
      console.error("Failed to load assignment data:", error);

      show(
        "error",
        error?.response?.data?.message ||
          "Failed to load assignment data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...DEFAULT_FORM });
    setErrors({});
  };

  // ==========================================
  // EDIT ASSIGNMENT
  // ==========================================

  const handleEdit = (assignment: DoctorRoomAssignment) => {
    const item = assignment as any;

    setEditingId(assignment.id);

    setForm({
      doctorId: String(assignment.doctor_id),
      roomId: String(assignment.room_id),
      startTime: getTimeValue(assignment.start_time) || "09:00",
      endTime: getTimeValue(assignment.end_time) || "13:00",
    });

    setErrors({});

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.doctorId) {
      next.doctorId = "Select a doctor";
    }

    if (!form.roomId) {
      next.roomId = "Select a room";
    }

    if (!form.startTime) {
      next.startTime = "Select OPD start time";
    }

   
    if (!form.endTime) {
      next.endTime = "Select OPD closing time";
    }

    if (
      form.startTime &&
      form.endTime
    ) {
      if (form.startTime >= form.endTime) {
        next.endTime = "End time must be after start time";
      }

    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  // ==========================================
  // SAVE ASSIGNMENT
  // ==========================================

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      const payload = {
        doctorId: Number(form.doctorId),
        roomId: Number(form.roomId),
        startTime: form.startTime,
        endTime: form.endTime,
        isRecurring: true,
      };

      if (editingId !== null) {
        await updateDoctorRoomAssignment(
          editingId,
          payload as any,
        );

        show("success", "Assignment updated successfully.");
      } else {
        await assignDoctorToRoom(payload as any);

        show(
          "success",
          "Recurring weekly assignment created successfully.",
        );
      }

      await loadData();
      resetForm();
    } catch (error: any) {
      console.error("Save assignment error:", error);

      show(
        "error",
        error?.response?.data?.message ||
          "Failed to save assignment.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // TABLE COLUMNS
  // ==========================================

  const columns: Column<DoctorRoomAssignment>[] = [
    {
      header: "Doctor",
      accessor: (assignment) => (
        <div>
          <p className="font-semibold text-ink">
            {assignment.doctor_name}
          </p>

          <p className="text-xs text-slate-500">
            Doctor ID: {assignment.doctor_id}
          </p>
        </div>
      ),
    },
    {
      header: "Room",
      accessor: (assignment) => (
        <div>
          <p className="font-semibold text-ink">
            Room {assignment.room_number}
          </p>

          {assignment.room_name && (
            <p className="text-xs text-slate-500">
              {assignment.room_name}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Assignment type",
      accessor: () => (
        <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
          Recurring
        </span>
      ),
    },
    {
      header: "Start date",
      accessor: (assignment) =>
        assignment.assignment_date
          ? String(assignment.assignment_date).split("T")[0]
          : "From today",
    },
    {
      header: "OPD start",
      accessor: (assignment) =>
        getTimeValue(assignment.start_time) || "-",
    },
    {
      header: "OPD end",
      accessor: (assignment) =>
        getTimeValue(assignment.end_time) || "-",
    },
    {
      header: "Status",
      accessor: (assignment) => (
        <StatusBadge
          status={isTrue(assignment.is_active) ? "ACTIVE" : "INACTIVE"}
        />
      ),
    },
    {
      header: "Action",
      accessor: (assignment) => (
        <button
          type="button"
          onClick={() => handleEdit(assignment)}
          className="text-sm font-semibold text-teal-700 hover:text-teal-900"
        >
          Edit
        </button>
      ),
    },
  ];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Doctor room assignments
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Assign a doctor once and generate OPD sessions
          according to the doctor's weekly schedule.
        </p>
      </div>

      <Panel
        title={
          editingId !== null
            ? "Edit assignment"
            : "New room assignment"
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* DOCTOR */}

          <SelectField
            id="doctorId"
            label="Doctor"
            value={form.doctorId}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                doctorId: e.target.value,
              }));

              setErrors((prev) => ({
                ...prev,
                doctorId: "",
              }));
            }}
            error={errors.doctorId}
            required
            options={doctors
              .filter((doctor) => {
                const item = doctor as any;

                return (
                  item.status === "ACTIVE" ||
                  item.is_active === true ||
                  item.is_active === 1
                );
              })
              .map((doctor) => ({
                value: String(doctor.id),
                label: `${doctor.name}${
                  doctor.specialization
                    ? ` · ${doctor.specialization}`
                    : ""
                }`,
              }))}
          />

          {/* ROOM */}

          <SelectField
            id="roomId"
            label="Room"
            value={form.roomId}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                roomId: e.target.value,
              }));

              setErrors((prev) => ({
                ...prev,
                roomId: "",
              }));
            }}
            error={errors.roomId}
            required
            options={rooms
              .filter((room) => isTrue(room.is_active))
              .map((room) => ({
                value: String(room.id),
                label: `Room ${room.room_number}${
                  room.room_name ? ` · ${room.room_name}` : ""
                }`,
              }))}
          />

          {/* OPD START TIME */}

          <TextField
            id="startTime"
            label="OPD start time"
            type="time"
            value={form.startTime}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                startTime: e.target.value,
              }));

              setErrors((prev) => ({
                ...prev,
                startTime: "",
                endTime: "",
              }));
            }}
            error={errors.startTime}
            required
          />


          {/* OPD CLOSING TIME */}

          <TextField
            id="endTime"
            label="OPD closing time"
            type="time"
            value={form.endTime}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                endTime: e.target.value,
              }));

              setErrors((prev) => ({
                ...prev,
                endTime: "",
              }));
            }}
            error={errors.endTime}
            required
          />
        </div>

        {/* DOCTOR WEEKLY SCHEDULE */}

        {selectedDoctor && (
          <div className="mt-4 rounded-lg border border-teal-100 bg-teal-50 p-4">
            <p className="text-sm font-semibold text-teal-800">
              Doctor's weekly working days
            </p>

            <p className="mt-1 text-sm text-teal-900">
              {selectedDoctor.workingDays?.length
                ? selectedDoctor.workingDays
                    .map(
                      (day) =>
                        day.charAt(0) +
                        day.slice(1).toLowerCase(),
                    )
                    .join(", ")
                : "No weekly schedule configured"}
            </p>

            <p className="mt-2 text-xs text-teal-800">
              OPD sessions will be generated automatically
              according to the doctor's active working days.
            </p>
          </div>
        )}

        {/* ACTION BUTTONS */}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CalendarPlus size={16} />

            {saving
              ? editingId !== null
                ? "Updating..."
                : "Assigning..."
              : editingId !== null
                ? "Update assignment"
                : "Assign doctor"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <X size={16} />
              Cancel edit
            </button>
          )}
        </div>
      </Panel>

      {/* ASSIGNMENTS TABLE */}

      <Panel className="!p-0" title="All assignments">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading assignments...
          </div>
        ) : (
          <DataTable
            rows={assignments}
            rowKey={(assignment) => String(assignment.id)}
            columns={columns}
            searchKeys={(assignment) => {
              return `${assignment.doctor_name} ${
                assignment.room_number
              } ${assignment.room_name ?? ""} ${
                assignment.assignment_date ?? ""
              } Recurring`;
            }}
            searchPlaceholder="Search assignments..."
            filters={[
              { label: "All", value: "ALL" },
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
            filterFn={(assignment, value) => {
              if (value === "ALL") return true;

              if (value === "ACTIVE") {
                return isTrue(assignment.is_active);
              }

              if (value === "INACTIVE") {
                return !isTrue(assignment.is_active);
              }

              return true;
            }}
            emptyTitle="No assignments yet"
          />
        )}
      </Panel>
    </div>
  );
}