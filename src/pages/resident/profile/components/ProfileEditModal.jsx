import React, { useState, useEffect } from "react";
import { Dialog, DialogBody, Spinner } from "@material-tailwind/react";
import {
  XMarkIcon,
  UserCircleIcon,
  PencilSquareIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useComplexColor } from "@/hooks/useComplexColor";
import { residentProfileAPI } from "../api";

/* ─── tiny field wrapper ─────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, type = "text", placeholder, rightIcon, disabled = false }) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 ${rightIcon ? "pr-10" : ""}`}
        style={{ "--tw-ring-color": "var(--profile-color)" }}
        onFocus={(e) => (e.target.style.borderColor = "var(--profile-color)")}
        onBlur={(e) => (e.target.style.borderColor = "")}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</span>
      )}
    </div>
  );
}

/* ─── Main modal component ──────────────────────────────────────── */
export function ProfileEditModal({ open, onClose, user, onSaved, mode = "personal" }) {
  const { color, getRgba } = useComplexColor();
  const [activeTab, setActiveTab] = useState(mode === "password" ? "password" : "personal");

  /* personal form */
  const [form, setForm] = useState({
    name: "", surname: "", email: "", phone: "",
    birth_date: "", gender: "", personal_code: "",
  });

  /* password form */
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState({ cur: false, nw: false, conf: false });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && user) {
      setForm({
        name:          user.name          || "",
        surname:       user.surname       || "",
        email:         user.email         || "",
        phone:         user.phone         || "",
        birth_date:    user.birth_date    || "",
        gender:        user.gender        || "",
        personal_code: user.personal_code || "",
      });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSuccess(false);
      setError(null);
    }
  }, [open, user]);

  useEffect(() => {
    if (open) {
      setActiveTab(mode === "password" ? "password" : "personal");
      setSuccess(false);
      setError(null);
    }
  }, [open, mode]);

  const handleClose = () => { setSuccess(false); setError(null); onClose(); };

  const savePersonal = async () => {
    setLoading(true); setError(null);
    try {
      const res = await residentProfileAPI.updateMe({
        name:          form.name,
        surname:       form.surname,
        email:         form.email,
        phone:         form.phone,
        birth_date:    form.birth_date || null,
        gender:        form.gender     || null,
        personal_code: form.personal_code || null,
      });
      if (res?.success) { setSuccess(true); onSaved?.(); }
      else setError(res?.message || "Xəta baş verdi");
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Xəta baş verdi");
    } finally { setLoading(false); }
  };

  const savePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) { setError("Yeni şifrələr uyğun gəlmir"); return; }
    if (!pwForm.currentPassword || !pwForm.newPassword) { setError("Bütün sahələr doldurulmalıdır"); return; }
    setLoading(true); setError(null);
    try {
      const res = await residentProfileAPI.updatePassword(pwForm);
      if (res?.success) { setSuccess(true); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
      else setError(res?.message || "Xəta baş verdi");
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Xəta baş verdi");
    } finally { setLoading(false); }
  };

  const isPassword = activeTab === "password";

  return (
    <Dialog
      open={open}
      handler={handleClose}
      size="md"
      className="dark:bg-gray-800 !max-w-xl"
      style={{ "--profile-color": color }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 py-4 rounded-t-xl"
        style={{ background: `linear-gradient(135deg, ${color}, ${getRgba(0.75)})` }}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-lg">
            {isPassword ? <LockClosedIcon className="h-5 w-5 text-white" /> : <PencilSquareIcon className="h-5 w-5 text-white" />}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{isPassword ? "Şifrəni dəyiş" : "Profili redaktə et"}</p>
            <p className="text-white/70 text-xs">{user?.name} {user?.surname}</p>
          </div>
        </div>
        <button onClick={handleClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      <DialogBody className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">

        {/* ── Tabs ── */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-700/50">
          <button
            type="button"
            onClick={() => {
              setActiveTab("personal");
              setSuccess(false);
              setError(null);
            }}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "personal"
                ? "text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600/40"
            }`}
            style={activeTab === "personal" ? { background: color } : undefined}
          >
            Şəxsi məlumat
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("password");
              setSuccess(false);
              setError(null);
            }}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "password"
                ? "text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600/40"
            }`}
            style={activeTab === "password" ? { background: color } : undefined}
          >
            Şifrə dəyiş
          </button>
        </div>

        {/* Success state */}
        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <CheckCircleIcon className="h-6 w-6 text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                {isPassword ? "Şifrə uğurla yeniləndi!" : "Məlumatlar uğurla yeniləndi!"}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Dəyişikliklər yadda saxlandı.</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* ── Personal form ── */}
        {!isPassword && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ad">
                <TextInput
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Adınız"
                  rightIcon={<LockClosedIcon className="h-4 w-4 text-gray-400" />}
                  disabled
                />
              </Field>
              <Field label="Soyad">
                <TextInput
                  value={form.surname}
                  onChange={(e) => setForm(f => ({ ...f, surname: e.target.value }))}
                  placeholder="Soyadınız"
                  rightIcon={<LockClosedIcon className="h-4 w-4 text-gray-400" />}
                  disabled
                />
              </Field>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              Ad və soyad resident tərəfindən dəyişdirilə bilməz.
            </p>
            <Field label="E-poçt">
              <TextInput type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
            </Field>
            <Field label="Telefon">
              <TextInput value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+994 XX XXX XX XX" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Doğum tarixi">
                <TextInput type="date" value={form.birth_date} onChange={(e) => setForm(f => ({ ...f, birth_date: e.target.value }))} />
              </Field>
              <Field label="Cins">
                <select
                  value={form.gender || ""}
                  onChange={(e) => setForm(f => ({ ...f, gender: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:outline-none"
                >
                  <option value="">Seçin</option>
                  <option value="male">Kişi</option>
                  <option value="female">Qadın</option>
                </select>
              </Field>
            </div>
            <Field label="Şəxsi kod">
              <TextInput value={form.personal_code} onChange={(e) => setForm(f => ({ ...f, personal_code: e.target.value }))} placeholder="FIN kod" />
            </Field>
          </>
        )}

        {/* ── Password form ── */}
        {isPassword && (
          <>
            <Field label="Cari şifrə">
              <TextInput
                type={showPw.cur ? "text" : "password"}
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder="••••••••"
                rightIcon={
                  <button type="button" onClick={() => setShowPw(s => ({ ...s, cur: !s.cur }))}>
                    {showPw.cur ? <EyeSlashIcon className="h-4 w-4 text-gray-400" /> : <EyeIcon className="h-4 w-4 text-gray-400" />}
                  </button>
                }
              />
            </Field>
            <Field label="Yeni şifrə">
              <TextInput
                type={showPw.nw ? "text" : "password"}
                value={pwForm.newPassword}
                onChange={(e) => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                placeholder="••••••••"
                rightIcon={
                  <button type="button" onClick={() => setShowPw(s => ({ ...s, nw: !s.nw }))}>
                    {showPw.nw ? <EyeSlashIcon className="h-4 w-4 text-gray-400" /> : <EyeIcon className="h-4 w-4 text-gray-400" />}
                  </button>
                }
              />
            </Field>
            <Field label="Şifrəni təsdiqlə">
              <TextInput
                type={showPw.conf ? "text" : "password"}
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="••••••••"
                rightIcon={
                  <button type="button" onClick={() => setShowPw(s => ({ ...s, conf: !s.conf }))}>
                    {showPw.conf ? <EyeSlashIcon className="h-4 w-4 text-gray-400" /> : <EyeIcon className="h-4 w-4 text-gray-400" />}
                  </button>
                }
              />
            </Field>
          </>
        )}

        {/* ── Footer buttons ── */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={isPassword ? savePassword : savePersonal}
            disabled={loading || success}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: color }}
          >
            {loading ? <Spinner className="h-4 w-4" /> : success ? <CheckCircleIcon className="h-4 w-4" /> : null}
            {loading ? "Yadda saxlanır..." : success ? "Saxlandı!" : "Yadda saxla"}
          </button>
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Bağla
          </button>
        </div>
      </DialogBody>
    </Dialog>
  );
}

export default ProfileEditModal;
