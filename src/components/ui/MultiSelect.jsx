import { Typography } from '@material-tailwind/react';
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom';

const MultiSelect = ({ label, options, value = [], onChange, onOpen }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, openAbove: false });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 240;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    setPosition({
      left: rect.left,
      width: rect.width,
      openAbove,
      top: openAbove ? rect.top - 4 : rect.bottom + 4,
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    calculatePosition();

    const handleClickOutside = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      calculatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [open, calculatePosition]);

  const toggleItem = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="relative">
      <Typography variant="small" className="mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </Typography>

      <div
        ref={triggerRef}
        onClick={() => {
          setOpen((prev) => {
            const next = !prev;
            if (next) {
              onOpen?.();
            }
            return next;
          });
        }}
        className="min-h-[42px] px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-pointer flex flex-wrap gap-1"
      >
        {value.length === 0 ? (
          <span className="text-gray-400 text-sm">Seçin...</span>
        ) : (
          value.map((id) => {
            const item = options.find(o => o.id === id);
            return (
              <span key={id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                {item?.name || item?.title}
              </span>
            );
          })
        )}
      </div>

      {open
        ? createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: 'fixed',
                top: position.openAbove ? 'auto' : position.top,
                bottom: position.openAbove ? window.innerHeight - position.top : 'auto',
                left: position.left,
                width: position.width,
                zIndex: 999999,
              }}
              className="max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl"
            >
              {options.length === 0 ? (
                <div className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">Seçim yoxdur</div>
              ) : (
                options.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.name || item.title}
                    </span>
                  </label>
                ))
              )}
            </div>,
            document.body
          )
        : null}
    </div>
  );
};


export default MultiSelect