/**
 * Edge Case Handling Utilities
 * 
 * Bu fayl ID mismatch, inconsistency, empty states və digər edge case-ləri handle edir.
 */

import { extractRelationshipId, buildRelationshipChain } from "./normalization";

/**
 * Handle ID mismatch by finding the best matching entity
 * Uses sub_data as source of truth, falls back to closest match
 * 
 * @param {Object} entity - Entity with potential ID mismatch
 * @param {Object} entitiesStore - Normalized entities store
 * @param {string} relationshipType - 'mtk', 'complex', 'building', 'block'
 * @returns {Object|null} - Best matching entity or null
 */
export function resolveIdMismatch(entity, entitiesStore, relationshipType) {
  if (!entity) return null;

  // Priority 1: Use sub_data (source of truth)
  const subDataId = entity.sub_data?.[relationshipType]?.id;
  if (subDataId && entitiesStore[`${relationshipType}s`]?.entities[subDataId]) {
    return entitiesStore[`${relationshipType}s`].entities[subDataId];
  }

  // Priority 2: Try direct field
  const directField = `${relationshipType}_id`;
  const directId = entity[directField];
  if (directId && entitiesStore[`${relationshipType}s`]?.entities[directId]) {
    return entitiesStore[`${relationshipType}s`].entities[directId];
  }

  // Priority 3: Try embedded object
  const embedded = entity[relationshipType] || entity[`bind_${relationshipType}`];
  if (embedded?.id && entitiesStore[`${relationshipType}s`]?.entities[embedded.id]) {
    return entitiesStore[`${relationshipType}s`].entities[embedded.id];
  }

  // Priority 4: Find closest match by name (fallback)
  if (embedded?.name) {
    const entities = Object.values(entitiesStore[`${relationshipType}s`]?.entities || {});
    const match = entities.find((e) => e.name === embedded.name);
    if (match) return match;
  }

  return null;
}

/**
 * Validate and fix relationship chain inconsistencies
 * Returns corrected chain with warnings
 * 
 * @param {Object} entity - Entity to validate
 * @param {Object} entitiesStore - Normalized entities store
 * @returns {Object} - { chain: {...}, warnings: string[] }
 */
export function validateAndFixChain(entity, entitiesStore) {
  const warnings = [];
  const chain = buildRelationshipChain(entity);

  // Validate block → building relationship
  if (chain.blockId) {
    const block = entitiesStore.blocks?.entities[chain.blockId];
    if (block) {
      const blockBuildingId = extractRelationshipId(block, 'building');
      const blockComplexId = extractRelationshipId(block, 'complex');

      // If building ID doesn't match, try to fix
      if (chain.buildingId && blockBuildingId && chain.buildingId !== blockBuildingId) {
        warnings.push(
          `Building ID mismatch detected: ${chain.buildingId} vs ${blockBuildingId}. Using block's building.`
        );
        chain.buildingId = blockBuildingId;
      }

      // If complex ID doesn't match, try to fix
      if (chain.complexId && blockComplexId && chain.complexId !== blockComplexId) {
        warnings.push(
          `Complex ID mismatch detected: ${chain.complexId} vs ${blockComplexId}. Using block's complex.`
        );
        chain.complexId = blockComplexId;
      }

      // If building ID is missing, try to get from block
      if (!chain.buildingId && blockBuildingId) {
        chain.buildingId = blockBuildingId;
      }

      // If complex ID is missing, try to get from block
      if (!chain.complexId && blockComplexId) {
        chain.complexId = blockComplexId;
      }
    }
  }

  // Validate building → complex relationship
  if (chain.buildingId) {
    const building = entitiesStore.buildings?.entities[chain.buildingId];
    if (building) {
      const buildingComplexId = extractRelationshipId(building, 'complex');
      const buildingMtkId = extractRelationshipId(building, 'mtk');

      // If complex ID doesn't match, try to fix
      if (chain.complexId && buildingComplexId && chain.complexId !== buildingComplexId) {
        warnings.push(
          `Complex ID mismatch detected: ${chain.complexId} vs ${buildingComplexId}. Using building's complex.`
        );
        chain.complexId = buildingComplexId;
      }

      // If complex ID is missing, try to get from building
      if (!chain.complexId && buildingComplexId) {
        chain.complexId = buildingComplexId;
      }

      // If MTK ID is missing, try to get from building
      if (!chain.mtkId && buildingMtkId) {
        chain.mtkId = buildingMtkId;
      }
    }
  }

  // Validate complex → MTK relationship
  if (chain.complexId) {
    const complex = entitiesStore.complexes?.entities[chain.complexId];
    if (complex) {
      const complexMtkId = extractRelationshipId(complex, 'mtk');

      // If MTK ID doesn't match, try to fix
      if (chain.mtkId && complexMtkId && chain.mtkId !== complexMtkId) {
        warnings.push(
          `MTK ID mismatch detected: ${chain.mtkId} vs ${complexMtkId}. Using complex's MTK.`
        );
        chain.mtkId = complexMtkId;
      }

      // If MTK ID is missing, try to get from complex
      if (!chain.mtkId && complexMtkId) {
        chain.mtkId = complexMtkId;
      }
    }
  }

  return { chain, warnings };
}

/**
 * Get empty state message based on filters
 * 
 * @param {Object} filters - Current filters
 * @param {number} count - Current item count
 * @returns {Object} - { title: string, message: string }
 */
export function getEmptyStateMessage(filters, count) {
  if (count > 0) return null;

  const hasFilters = 
    filters.mtkId ||
    filters.complexId ||
    filters.buildingId ||
    filters.blockId ||
    filters.search ||
    filters.status;

  if (hasFilters) {
    return {
      title: "Nəticə tapılmadı",
      message: "Seçilmiş filterlərə uyğun məlumat tapılmadı. Filterləri dəyişdirin və ya təmizləyin.",
    };
  }

  return {
    title: "Məlumat yoxdur",
    message: "Hələlik heç bir məlumat əlavə edilməyib.",
  };
}

/**
 * Check if entity has required relationships
 * 
 * @param {Object} entity - Entity to check
 * @param {string} entityType - 'property', 'block', 'building', 'complex'
 * @returns {Object} - { isValid: boolean, missing: string[] }
 */
export function validateRequiredRelationships(entity, entityType) {
  const missing = [];

  switch (entityType) {
    case "property":
      if (!extractRelationshipId(entity, 'block')) {
        missing.push("block");
      }
      break;
    case "block":
      if (!extractRelationshipId(entity, 'building')) {
        missing.push("building");
      }
      break;
    case "building":
      if (!extractRelationshipId(entity, 'complex')) {
        missing.push("complex");
      }
      break;
    case "complex":
      // Complex can exist without MTK (optional)
      break;
    default:
      break;
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
}

/**
 * Safe get relationship name with fallback
 * 
 * @param {Object} entity - Entity
 * @param {string} relationshipType - 'mtk', 'complex', 'building', 'block'
 * @param {string} fallback - Fallback text
 * @returns {string} - Relationship name or fallback
 */
export function getRelationshipName(entity, relationshipType, fallback = "—") {
  if (!entity) return fallback;

  // Try sub_data first
  const subData = entity.sub_data?.[relationshipType];
  if (subData?.name) return subData.name;

  // Try embedded object
  const embedded = entity[relationshipType] || entity[`bind_${relationshipType}`];
  if (embedded?.name) return embedded.name;

  // Try ID as fallback
  const id = extractRelationshipId(entity, relationshipType);
  if (id) return `#${id}`;

  return fallback;
}

/**
 * Check if list data has embedded objects but missing direct IDs
 * 
 * @param {Array} list - List of entities
 * @returns {Object} - { hasIssues: boolean, issues: string[] }
 */
export function checkListDataConsistency(list) {
  const issues = [];

  list.forEach((item, index) => {
    // Check if has embedded complex but no complex_id
    if (item.complex?.id && !item.complex_id) {
      issues.push(`Item ${index} (ID: ${item.id}): Has complex.id but missing complex_id`);
    }

    // Check if has embedded building but no building_id
    if (item.building?.id && !item.building_id) {
      issues.push(`Item ${index} (ID: ${item.id}): Has building.id but missing building_id`);
    }

    // Check if has embedded block but no block_id
    if (item.block?.id && !item.block_id) {
      issues.push(`Item ${index} (ID: ${item.id}): Has block.id but missing block_id`);
    }
  });

  return {
    hasIssues: issues.length > 0,
    issues,
  };
}

/**
 * Normalize entity relationships - fill missing IDs from embedded objects
 * 
 * @param {Object} entity - Entity to normalize
 * @returns {Object} - Normalized entity
 */
export function normalizeEntityRelationships(entity) {
  if (!entity) return entity;

  const normalized = { ...entity };

  // Fill complex_id from embedded complex
  if (!normalized.complex_id && normalized.complex?.id) {
    normalized.complex_id = normalized.complex.id;
  }

  // Fill building_id from embedded building
  if (!normalized.building_id && normalized.building?.id) {
    normalized.building_id = normalized.building.id;
  }

  // Fill block_id from embedded block
  if (!normalized.block_id && normalized.block?.id) {
    normalized.block_id = normalized.block.id;
  }

  // Fill mtk_id from embedded mtk
  if (!normalized.mtk_id && normalized.mtk?.id) {
    normalized.mtk_id = normalized.mtk.id;
  }

  return normalized;
}


