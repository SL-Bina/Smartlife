import React from "react";
import { ApartmentGroupCard } from "./ApartmentGroupCard";

export function ApartmentGroupsList({ groups, onEdit }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {groups.map((group) => (
        <ApartmentGroupCard key={group.id} group={group} onEdit={onEdit} />
      ))}
    </div>
  );
}

