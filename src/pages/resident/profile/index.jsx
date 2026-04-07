import React, { useState } from "react";
import {
  UserCircleIcon,
  PencilSquareIcon,
  LockClosedIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  CalendarIcon,
  UserIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/store/exports";
import { useComplexColor } from "@/hooks/useComplexColor";
import { ProfileEditModal } from "./components/ProfileEditModal";

/* ─── read-only info row ─────────────────────────────────────── */
function InfoRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="p-1.5 rounded-lg shrink-0" style={{ background: `${color}18` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-semibold">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

/* ─── section card ──────────────────────────────────────────── */
function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  );
}

const GENDER_MAP = { male: "Kişi", female: "Qadın" };
const fmtDate = (d) => {
  if (!d) return null;
  try { return new Date(d).toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return d; }
};

const ResidentProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { color, getRgba, headerStyle } = useComplexColor();

  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState("personal");

  const fullName = [user?.name, user?.surname].filter(Boolean).join(" ") || "Resident";
  const initials = ((user?.name?.[0] || "") + (user?.surname?.[0] || "")).toUpperCase() || "R";

  return (
    <div className="space-y-5" style={{ position: "relative", zIndex: 0 }}>

      {/* ── Banner header ── */}
      <div className="rounded-xl shadow-lg border overflow-hidden" style={headerStyle}>
        <div className="p-5 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-5">
          {/* Avatar */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white/30 shrink-0 relative"
            style={{ background: getRgba(0.35) }}
          >
            {user?.profile_photo
              ? <img src={user.profile_photo} alt={fullName} className="w-full h-full object-cover rounded-xl" />
              : initials}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
          </div>

          {/* Name + role */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white font-bold text-xl leading-tight">{fullName}</p>
            <p className="text-white/70 text-sm mt-0.5">{user?.email || ""}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white text-[11px] font-semibold">
              <UserCircleIcon className="h-3 w-3" /> RESIDENT
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => {
                setEditMode("personal");
                setEditOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-sm font-semibold rounded-xl shadow hover:shadow-md transition-all"
              style={{ color }}
            >
              <PencilSquareIcon className="h-4 w-4" />
              Düzəliş et
            </button>
            {/* <button
              onClick={() => {
                setEditMode("password");
                setEditOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold rounded-xl transition-all"
            >
              <LockClosedIcon className="h-4 w-4" />
              Şifrə
            </button> */}
          </div>
        </div>
      </div>

      {/* ── Info sections ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal */}
        <Section title="Şəxsi məlumatlar">
          <InfoRow icon={UserIcon}           label="Ad"         value={user?.name}                      color={color} />
          <InfoRow icon={UserIcon}           label="Soyad"      value={user?.surname}                   color={color} />
          <InfoRow icon={IdentificationIcon} label="Şəxsi kod"  value={user?.personal_code}              color={color} />
          <InfoRow icon={CalendarIcon}       label="Doğum tarixi" value={fmtDate(user?.birth_date)}     color={color} />
          <InfoRow icon={UserIcon}           label="Cins"       value={GENDER_MAP[user?.gender] || user?.gender} color={color} />
        </Section>

        {/* Contact + Security */}
        <div className="space-y-4">
          <Section title="Əlaqə məlumatları">
            <InfoRow icon={EnvelopeIcon} label="E-poçt"  value={user?.email} color={color} />
            <InfoRow icon={PhoneIcon}    label="Telefon" value={user?.phone} color={color} />
            {user?.properties?.length > 0 && (
              <InfoRow icon={HomeIcon} label="Mənzillər" value={`${user.properties.length} mənzil`} color={color} />
            )}
          </Section>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Hesab təhlükəsizliyi</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Şifrənizi mütəmadi dəyişdirin</p>
            </div>
            <button
              onClick={() => {
                setEditMode("password");
                setEditOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: color }}
            >
              <LockClosedIcon className="h-4 w-4" />
              Şifrəni dəyiş
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <ProfileEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        onSaved={refreshUser}
        mode={editMode}
      />
    </div>
  );
};

export default ResidentProfilePage;
