/**
 * Management Module Data Normalization Utilities
 * 
 * Bu fayl bütün management modulları üçün data normalizasiyası və
 * əlaqə xəritəsi funksiyalarını təmin edir.
 */

/**
 * Entity relationship hierarchy:
 * MTK → Complex → Building → Block → Property → Resident
 */

/**
 * Normalize list response to entities map
 * @param {Array} list - Backend-dən gələn list
 * @returns {Object} - { entities: { [id]: entity }, ids: [id1, id2, ...] }
 */
export function normalizeList(list = []) {
  const entities = {};
  const ids = [];

  list.forEach((item) => {
    if (item?.id) {
      entities[item.id] = item;
      ids.push(item.id);
    }
  });

  return { entities, ids };
}

/**
 * Normalize multiple lists to a single entities store
 * @param {Object} lists - { mtks: [...], complexes: [...], ... }
 * @returns {Object} - { mtks: { entities, ids }, complexes: { entities, ids }, ... }
 */
export function normalizeAllLists(lists) {
  const normalized = {};

  Object.keys(lists).forEach((key) => {
    normalized[key] = normalizeList(lists[key]);
  });

  return normalized;
}

/**
 * Extract relationship IDs from entity using sub_data (source of truth)
 * Priority: sub_data > direct field > embedded object
 * 
 * @param {Object} entity - Entity object
 * @param {string} relationshipType - 'mtk', 'complex', 'building', 'block'
 * @returns {number|null} - Relationship ID or null
 */
export function extractRelationshipId(entity, relationshipType) {
  if (!entity) return null;

  // Priority 1: sub_data (source of truth)
  if (entity.sub_data?.[relationshipType]?.id) {
    return entity.sub_data[relationshipType].id;
  }

  // Priority 2: Direct field (e.g., mtk_id, complex_id)
  const directField = `${relationshipType}_id`;
  if (entity[directField] !== null && entity[directField] !== undefined) {
    return entity[directField];
  }

  // Priority 3: Embedded object (e.g., complex.id, building.complex.id)
  const embeddedPaths = {
    mtk: ['bind_mtk.id', 'mtk.id'],
    complex: ['complex.id', 'bind_complex.id'],
    building: ['building.id', 'bind_building.id'],
    block: ['block.id', 'bind_block.id'],
  };

  const paths = embeddedPaths[relationshipType] || [];
  for (const path of paths) {
    const value = getNestedValue(entity, path);
    if (value !== null && value !== undefined) {
      return value;
    }
  }

  return null;
}

/**
 * Get nested value from object using dot notation
 * @param {Object} obj - Object
 * @param {string} path - Dot notation path (e.g., 'complex.id')
 * @returns {any} - Value or undefined
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Build relationship chain from entity
 * Returns all parent IDs in hierarchy order
 * 
 * @param {Object} entity - Entity object
 * @returns {Object} - { mtkId, complexId, buildingId, blockId }
 */
export function buildRelationshipChain(entity) {
  return {
    mtkId: extractRelationshipId(entity, 'mtk'),
    complexId: extractRelationshipId(entity, 'complex'),
    buildingId: extractRelationshipId(entity, 'building'),
    blockId: extractRelationshipId(entity, 'block'),
  };
}

/**
 * Safe relationship resolver with fallback
 * Handles ID mismatches and inconsistencies
 * 
 * @param {Object} entity - Entity object
 * @param {string} relationshipType - 'mtk', 'complex', 'building', 'block'
 * @param {Object} entitiesStore - Normalized entities store
 * @returns {Object|null} - Related entity or null
 */
export function resolveRelationship(entity, relationshipType, entitiesStore) {
  const relationshipId = extractRelationshipId(entity, relationshipType);
  if (!relationshipId) return null;

  const storeKey = {
    mtk: 'mtks',
    complex: 'complexes',
    building: 'buildings',
    block: 'blocks',
  }[relationshipType];

  if (!storeKey || !entitiesStore[storeKey]) return null;

  return entitiesStore[storeKey].entities[relationshipId] || null;
}

/**
 * Build indexed maps for fast filtering
 * Creates maps like: { mtkId: [complexId1, complexId2, ...] }
 * 
 * @param {Object} normalizedStore - Normalized entities store
 * @returns {Object} - Indexed maps
 */
export function buildIndexedMaps(normalizedStore) {
  const maps = {
    complexIdsByMtkId: {},
    buildingIdsByComplexId: {},
    buildingIdsByMtkId: {},
    blockIdsByBuildingId: {},
    blockIdsByComplexId: {},
    blockIdsByMtkId: {},
    propertyIdsByBlockId: {},
    propertyIdsByBuildingId: {},
    propertyIdsByComplexId: {},
    propertyIdsByMtkId: {},
  };

  // Index complexes by MTK
  if (normalizedStore.complexes?.ids) {
    normalizedStore.complexes.ids.forEach((complexId) => {
      const complex = normalizedStore.complexes.entities[complexId];
      const mtkId = extractRelationshipId(complex, 'mtk');
      if (mtkId) {
        if (!maps.complexIdsByMtkId[mtkId]) {
          maps.complexIdsByMtkId[mtkId] = [];
        }
        maps.complexIdsByMtkId[mtkId].push(complexId);
      }
    });
  }

  // Index buildings by Complex and MTK
  if (normalizedStore.buildings?.ids) {
    normalizedStore.buildings.ids.forEach((buildingId) => {
      const building = normalizedStore.buildings.entities[buildingId];
      const complexId = extractRelationshipId(building, 'complex');
      const mtkId = extractRelationshipId(building, 'mtk');

      if (complexId) {
        if (!maps.buildingIdsByComplexId[complexId]) {
          maps.buildingIdsByComplexId[complexId] = [];
        }
        maps.buildingIdsByComplexId[complexId].push(buildingId);
      }

      if (mtkId) {
        if (!maps.buildingIdsByMtkId[mtkId]) {
          maps.buildingIdsByMtkId[mtkId] = [];
        }
        maps.buildingIdsByMtkId[mtkId].push(buildingId);
      }
    });
  }

  // Index blocks by Building, Complex, and MTK
  if (normalizedStore.blocks?.ids) {
    normalizedStore.blocks.ids.forEach((blockId) => {
      const block = normalizedStore.blocks.entities[blockId];
      const buildingId = extractRelationshipId(block, 'building');
      const complexId = extractRelationshipId(block, 'complex');
      const mtkId = extractRelationshipId(block, 'mtk');

      if (buildingId) {
        if (!maps.blockIdsByBuildingId[buildingId]) {
          maps.blockIdsByBuildingId[buildingId] = [];
        }
        maps.blockIdsByBuildingId[buildingId].push(blockId);
      }

      if (complexId) {
        if (!maps.blockIdsByComplexId[complexId]) {
          maps.blockIdsByComplexId[complexId] = [];
        }
        maps.blockIdsByComplexId[complexId].push(blockId);
      }

      if (mtkId) {
        if (!maps.blockIdsByMtkId[mtkId]) {
          maps.blockIdsByMtkId[mtkId] = [];
        }
        maps.blockIdsByMtkId[mtkId].push(blockId);
      }
    });
  }

  // Index properties by Block, Building, Complex, and MTK
  if (normalizedStore.properties?.ids) {
    normalizedStore.properties.ids.forEach((propertyId) => {
      const property = normalizedStore.properties.entities[propertyId];
      const blockId = extractRelationshipId(property, 'block');
      const buildingId = extractRelationshipId(property, 'building');
      const complexId = extractRelationshipId(property, 'complex');
      const mtkId = extractRelationshipId(property, 'mtk');

      if (blockId) {
        if (!maps.propertyIdsByBlockId[blockId]) {
          maps.propertyIdsByBlockId[blockId] = [];
        }
        maps.propertyIdsByBlockId[blockId].push(propertyId);
      }

      if (buildingId) {
        if (!maps.propertyIdsByBuildingId[buildingId]) {
          maps.propertyIdsByBuildingId[buildingId] = [];
        }
        maps.propertyIdsByBuildingId[buildingId].push(propertyId);
      }

      if (complexId) {
        if (!maps.propertyIdsByComplexId[complexId]) {
          maps.propertyIdsByComplexId[complexId] = [];
        }
        maps.propertyIdsByComplexId[complexId].push(propertyId);
      }

      if (mtkId) {
        if (!maps.propertyIdsByMtkId[mtkId]) {
          maps.propertyIdsByMtkId[mtkId] = [];
        }
        maps.propertyIdsByMtkId[mtkId].push(propertyId);
      }
    });
  }

  return maps;
}

/**
 * Validate relationship consistency
 * Checks if entity relationships are consistent
 * 
 * @param {Object} entity - Entity object
 * @param {Object} entitiesStore - Normalized entities store
 * @returns {Object} - { isValid: boolean, issues: string[] }
 */
export function validateRelationshipConsistency(entity, entitiesStore) {
  const issues = [];
  const chain = buildRelationshipChain(entity);

  // Validate block → building → complex → mtk chain
  if (chain.blockId) {
    const block = entitiesStore.blocks?.entities[chain.blockId];
    if (block) {
      const blockBuildingId = extractRelationshipId(block, 'building');
      const blockComplexId = extractRelationshipId(block, 'complex');

      if (chain.buildingId && blockBuildingId && chain.buildingId !== blockBuildingId) {
        issues.push(`Block ${chain.blockId} building mismatch: ${chain.buildingId} vs ${blockBuildingId}`);
      }

      if (chain.complexId && blockComplexId && chain.complexId !== blockComplexId) {
        issues.push(`Block ${chain.blockId} complex mismatch: ${chain.complexId} vs ${blockComplexId}`);
      }
    }
  }

  // Similar validations for other relationships...

  return {
    isValid: issues.length === 0,
    issues,
  };
}


