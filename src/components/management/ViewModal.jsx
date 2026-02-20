import React, { useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Card, CardBody, Spinner } from "@material-tailwind/react";
import { 
  XMarkIcon, 
  EyeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  IdentificationIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  HomeIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

const FieldIcon = ({ icon: Icon, className = "" }) => {
  if (!Icon) return null;
  return <Icon className={`h-4 w-4 ${className}`} />;
};

export function ViewModal({ 
  open, 
  onClose, 
  title = "Məlumatları Göstər",
  item = null,
  fields = [],
  entityName = "element",
  loading = false
}) {
  // Set z-index for portal container when modal is open
  useEffect(() => {
    if (open) {
      // Find all dialog elements and their portal containers
      const setDialogZIndex = () => {
        // Find dialog by role
        const dialogs = document.querySelectorAll('div[role="dialog"]');
        dialogs.forEach((dialog) => {
          // Set z-index on dialog itself
          if (dialog instanceof HTMLElement) {
            dialog.style.zIndex = '999999';
          }
          // Find parent portal container
          let parent = dialog.parentElement;
          while (parent && parent !== document.body) {
            if (parent instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(parent);
              if (computedStyle.position === 'fixed' || computedStyle.position === 'absolute') {
                parent.style.zIndex = '999999';
              }
            }
            parent = parent.parentElement;
          }
        });
        
        // Find backdrop elements
        const backdrops = document.querySelectorAll('[class*="backdrop"]');
        backdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.style.zIndex = '999998';
          }
        });
      };
      
      // Set immediately and also after a short delay (for portal rendering)
      setDialogZIndex();
      const timeout = setTimeout(setDialogZIndex, 10);
      
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!open) return null;

  const getFieldValue = (field, item) => {
    if (field.getValue) {
      return field.getValue(item);
    }
    const keys = field.key.split('.');
    let value = item;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  };

  const formatValue = (field, value, item) => {
    if (field.format) {
      return field.format(value, item);
    }
    if (value === null || value === undefined || value === '') {
      return "-";
    }
    return String(value);
  };

  const getStatusBadge = (value) => {
    if (value === "active" || value === true) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircleIcon className="h-3.5 w-3.5" />
          Aktiv
        </span>
      );
    }
    if (value === "inactive" || value === false) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <XCircleIcon className="h-3.5 w-3.5" />
          Qeyri-aktiv
        </span>
      );
    }
    return null;
  };

  return (
    <Dialog 
      open={open} 
      handler={onClose} 
      size="xl" 
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      dismiss={{ enabled: false }}
      style={{ zIndex: 999999 }}
    >
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <EyeIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
              {title}
            </Typography>
            {(item?.id || item?.user_data?.id) && (
              <Typography variant="small" className="text-gray-600 dark:text-gray-400 mt-0.5">
                ID: #{item?.user_data?.id || item?.id}
              </Typography>
            )}
          </div>
          <div 
            className="cursor-pointer p-2 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95" 
            onClick={onClose}
          >
            <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
          </div>
        </div>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 max-h-[75vh] overflow-y-auto scrollbar-thin p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner className="h-12 w-12 text-blue-500 mb-4" />
            <Typography variant="h6" className="text-gray-500 dark:text-gray-400 mb-2">
              Məlumatlar yüklənir...
            </Typography>
          </div>
        ) : !item ? (
          <div className="flex flex-col items-center justify-center py-12">
            <InformationCircleIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <Typography variant="h6" className="text-gray-500 dark:text-gray-400 mb-2">
              Məlumat tapılmadı
            </Typography>
            <Typography variant="small" className="text-gray-400 dark:text-gray-500">
              Seçilmiş element üçün məlumat mövcud deyil
            </Typography>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Info Card */}
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardBody className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fields.map((field, index) => {
                    // Custom render function for complex structures
                    if (field.customRender) {
                      return (
                        <div 
                          key={index} 
                          className={`space-y-2 p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all ${
                            field.fullWidth ? "md:col-span-2 lg:col-span-3" : ""
                          }`}
                        >
                          {field.customRender(item, field)}
                        </div>
                      );
                    }

                    const value = getFieldValue(field, item);
                    const displayValue = formatValue(field, value, item);
                    const isStatus = field.key === "status" || field.key.includes("status");
                    const Icon = field.icon;
                    
                    return (
                      <div 
                        key={index} 
                        className={`space-y-2 p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all ${
                          field.fullWidth ? "md:col-span-2 lg:col-span-3" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {Icon && (
                            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                              <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                          <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                            {field.label}
                          </Typography>
                        </div>
                        {isStatus && getStatusBadge(value) ? (
                          <div>{getStatusBadge(value)}</div>
                        ) : (
                          <Typography 
                            variant="paragraph" 
                            className={`text-gray-900 dark:text-gray-100 text-sm font-medium ${
                              displayValue === "-" ? "text-gray-400 dark:text-gray-500 italic" : ""
                            }`}
                          >
                            {displayValue}
                          </Typography>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            {/* Additional Info Section */}
            {item.meta && Object.keys(item.meta).length > 0 && (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
                <CardBody className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <InformationCircleIcon className="h-5 w-5 text-blue-500" />
                    <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                      Əlavə Məlumatlar
                    </Typography>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(item.meta).map(([key, value]) => {
                      if (value === null || value === undefined || value === '') return null;
                      return (
                        <div key={key} className="space-y-1">
                          <Typography variant="small" className="font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Typography>
                          <Typography variant="paragraph" className="text-gray-900 dark:text-gray-100 text-sm">
                            {String(value)}
                          </Typography>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </DialogBody>
      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800 bg-gray-50 dark:bg-gray-900">
        <Button
          variant="filled"
          color="blue"
          onClick={onClose}
          className="px-6 py-2.5 font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Bağla
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
