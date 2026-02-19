import { Typography } from '@material-tailwind/react';
import React, { useState } from 'react'

const MultiSelect = ({ label, options, value = [], onChange }) => {
  const [open, setOpen] = useState(false);

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
        onClick={() => setOpen(!open)}
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

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {options.map((item) => (
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
          ))}
        </div>
      )}
    </div>
  );
};


export default MultiSelect