import React from "react";
import { ManagementActions, ENTITY_LEVELS } from "@/components/management/ManagementActions";

export { ENTITY_LEVELS };

export function Actions(props) {
  return <ManagementActions {...props} />;
}

export default Actions;
