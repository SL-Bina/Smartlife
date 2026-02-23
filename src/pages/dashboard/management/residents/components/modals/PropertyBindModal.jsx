import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Button, Typography, Card, CardBody, Chip
} from "@material-tailwind/react";
import { XMarkIcon, HomeIcon, LinkIcon } from "@heroicons/react/24/outline";
import { CustomSelect } from "@/components/ui/CustomSelect";
import DynamicToast from "@/components/DynamicToast";
import propertyLookupsAPI from "../../../properties/api/lookups";
import propertiesAPI from "../../../properties/api";
import residentAPI from "../../../residents/api";

const ACTIVE_COLOR = "#3b82f6";

export function PropertyBindModal({
  open,
  onClose,
  residentId,
  residentProperties = [],
  onSuccess
}) {

  const [mtkId, setMtkId] = useState(null);
  const [complexId, setComplexId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);

  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({ open: false });

  const showToast = (type, message, title = "") =>
    setToast({ open: true, type, message, title });

  const canBind = mtkId && complexId && propertyId;

  // load MTK
  useEffect(() => {
    if (!open) return;
    propertyLookupsAPI.getMtks().then(setMtks);
  }, [open]);

  // load complexes
  useEffect(() => {
    if (!mtkId) return;
    propertyLookupsAPI.getComplexes({ mtk_id: mtkId })
      .then(setComplexes);
  }, [mtkId]);

  // load properties
  useEffect(() => {
    if (!complexId) return;
    propertiesAPI.getAll({ complex_id: complexId, per_page: 1000 })
      .then(res => {
        setProperties(res?.data?.data?.data || []);
      });
  }, [complexId]);

  const bind = async () => {
    try {
      setSaving(true);
      await residentAPI.bindProperty(residentId, {
        mtk_id: mtkId,
        complex_id: complexId,
        property_id: propertyId
      });
      showToast("success", "Bağlandı", "Uğurlu");
      onSuccess?.();
    } catch (e) {
      showToast("error", "Xəta baş verdi", "Xəta");
    } finally {
      setSaving(false);
    }
  };

  const unbind = async (prop) => {
    try {
      setSaving(true);
      await residentAPI.unbindProperty(residentId, {
        mtk_id: prop.mtk_id,
        complex_id: prop.complex_id,
        property_id: prop.id
      });
      showToast("success", "Silindi", "Uğurlu");
      onSuccess?.();
    } catch (e) {
      showToast("error", "Xəta baş verdi", "Xəta");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <Dialog open={open} handler={onClose} size="xl">

        {/* HEADER */}
        <DialogHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Mənzil Bağlama
          </div>
          <Button variant="text" onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <DialogBody className="space-y-6">

          {/* ===================== */}
          {/* BIND PANEL */}
          {/* ===================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <CustomSelect
              label="MTK"
              value={mtkId ? String(mtkId) : ""}
              onChange={v => {
                setMtkId(Number(v));
                setComplexId(null);
                setPropertyId(null);
              }}
              options={mtks.map(x => ({ value: String(x.id), label: x.name }))}
            />

            <CustomSelect
              label="Kompleks"
              value={complexId ? String(complexId) : ""}
              onChange={v => {
                setComplexId(Number(v));
                setPropertyId(null);
              }}
              disabled={!mtkId}
              options={complexes.map(x => ({ value: String(x.id), label: x.name }))}
            />

            <CustomSelect
              label="Mənzil"
              value={propertyId ? String(propertyId) : ""}
              onChange={v => setPropertyId(Number(v))}
              disabled={!complexId}
              options={properties.map(x => ({
                value: String(x.id),
                label: x.name || `Mənzil #${x.id}`
              }))}
            />

          </div>

          <div className="flex justify-end">
            <Button
              disabled={!canBind || saving}
              onClick={bind}
              style={{ backgroundColor: canBind ? ACTIVE_COLOR : "#aaa" }}
              className="text-white"
            >
              Bağla
            </Button>
          </div>

          {/* ===================== */}
          {/* PROPERTY LIST */}
          {/* ===================== */}

          <div className="grid md:grid-cols-2 gap-4">

            {residentProperties.map(p => (
              <Card key={p.id}>
                <CardBody className="space-y-2">

                  <Typography variant="h6">
                    {p.name || `Mənzil #${p.id}`}
                  </Typography>

                  <Chip value={p.complex?.name || "-"} />

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      color="red"
                      onClick={() => unbind(p)}
                    >
                      Bağlantını sil
                    </Button>
                  </div>

                </CardBody>
              </Card>
            ))}

          </div>

        </DialogBody>

        <DialogFooter>
          <Button variant="outlined" onClick={onClose}>
            Bağla
          </Button>
        </DialogFooter>

      </Dialog>

      <DynamicToast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        title={toast.title}
        onClose={() => setToast({ ...toast, open: false })}
      />

    </>
  );
}

export default PropertyBindModal;