# Management Modules Architecture

## Məzmun

Bu sənəd management modulları (MTK, Complex, Building, Block, Property, Resident) üçün vahid arxitektura və pattern-ləri izah edir.

## A) Əlaqə Xəritəsi və Normalizasiya

### Entity Hierarchy

```
MTK → Complex → Building → Block → Property → Resident
```

### Data Normalizasiya

Bütün list endpoint-lərdən gələn datalar normalize edilir:

```javascript
import { normalizeList, normalizeAllLists } from "@/utils/management/normalization";

// Single list
const { entities, ids } = normalizeList(list);

// Multiple lists
const normalized = normalizeAllLists({
  mtks: mtkList,
  complexes: complexList,
  buildings: buildingList,
  blocks: blockList,
  properties: propertyList,
});
```

### Relationship Extraction

`sub_data` prioritet olaraq "source of truth" kimi istifadə olunur:

```javascript
import { extractRelationshipId, buildRelationshipChain } from "@/utils/management/normalization";

// Extract single relationship ID
const mtkId = extractRelationshipId(property, 'mtk');
// Priority: sub_data.mtk.id > mtk_id > mtk.id > bind_mtk.id

// Build full chain
const chain = buildRelationshipChain(property);
// Returns: { mtkId, complexId, buildingId, blockId }
```

### Indexed Maps

Sürətli filtering üçün indexed maps yaradılır:

```javascript
import { buildIndexedMaps } from "@/utils/management/normalization";

const maps = buildIndexedMaps(normalizedStore);
// Returns:
// {
//   complexIdsByMtkId: { [mtkId]: [complexId1, complexId2, ...] },
//   buildingIdsByComplexId: { [complexId]: [buildingId1, ...] },
//   ...
// }
```

## B) ManagementContext Arxitekturası

### Enhanced Context

`ManagementContextEnhanced` aşağıdakı funksionallıqları təmin edir:

- **Filters**: `mtkId`, `complexId`, `buildingId`, `blockId`, `search`, `status`
- **Lists**: Normalized entities store
- **Indexed Maps**: Fast filtering maps
- **Cascading Reset**: Filter dəyişəndə aşağı səviyyəli filterlər reset olunur
- **URL Sync**: Optional URL query parameter sync

### İstifadə

```javascript
import { ManagementProviderEnhanced, useManagementEnhanced } from "@/context/ManagementContextEnhanced";

// Provider
<ManagementProviderEnhanced>
  <App />
</ManagementProviderEnhanced>

// Hook
const { state, actions } = useManagementEnhanced();

// Filters
actions.setFilter('mtkId', 1);
actions.setFilter('search', 'test');
actions.clearFilters();

// Lists
const allProperties = state.lists.properties.ids.map(
  id => state.lists.properties.entities[id]
);

// Refresh
await actions.refreshList('properties');
```

### Cascading Reset Qaydaları

- `mtkId` dəyişəndə → `complexId`, `buildingId`, `blockId` reset olunur
- `complexId` dəyişəndə → `buildingId`, `blockId` reset olunur
- `buildingId` dəyişəndə → `blockId` reset olunur

## C) Frontend Filter Məntiqi

### Filter Hooks

```javascript
import {
  useFilteredComplexes,
  useFilteredBuildings,
  useFilteredBlocks,
  useFilteredProperties,
} from "@/hooks/management/useFilteredLists";

const filtered = useFilteredProperties(allProperties, filters);
```

### Selector Hooks (Indexed Maps)

```javascript
import {
  useComplexesByMtk,
  useBuildingsByComplex,
  useBlocksByBuilding,
  usePropertiesByBlock,
} from "@/hooks/management/useSelectors";

// Fast filtering using indexed maps
const complexes = useComplexesByMtk(mtkId);
const buildings = useBuildingsByComplex(complexId);
```

### Sorting və Pagination

```javascript
import { useSortedList, usePaginatedList, useProcessedList } from "@/hooks/management/useFilteredLists";

// Combined
const processed = useProcessedList({
  list: allItems,
  filters,
  sortConfig: { key: 'name', direction: 'asc' },
  page: 1,
  itemsPerPage: 10,
  filterFn: useFilteredProperties,
});
```

## D) Folder Structure Pattern

Hər modul üçün vahid struktur:

```
management/<module>/
├── api/
│   └── index.js          # API calls (getAll, getById, create, update, delete)
├── hooks/
│   ├── use<Module>List.js    # List hook (filtering, sorting, pagination)
│   ├── use<Module>Detail.js  # Detail hook
│   └── use<Module>Form.js    # Form hook (optional)
├── components/
│   ├── <Module>FilterBar.jsx    # Filter UI
│   ├── <Module>Table.jsx         # List table
│   ├── <Module>CardList.jsx      # List cards (optional)
│   ├── <Module>Header.jsx        # Page header
│   ├── <Module>Actions.jsx       # Action buttons
│   └── modals/
│       ├── <Module>FormModal.jsx
│       ├── <Module>ViewModal.jsx
│       ├── <Module>DeleteModal.jsx
│       └── <Module>FilterModal.jsx
└── index.jsx              # Route entry point
```

### Nümunə: Properties Modul

```javascript
// management/properties/index.jsx
import { PropertiesFilterBar } from "./components/PropertiesFilterBar";
import { PropertiesTable } from "./components/PropertiesTable";
import { usePropertiesList } from "./hooks/usePropertiesList";

function PropertiesPage() {
  const {
    items,
    currentPage,
    totalPages,
    setPage,
    loading,
    refresh,
  } = usePropertiesList();

  return (
    <div>
      <PropertiesFilterBar />
      <PropertiesTable items={items} loading={loading} />
      {/* Pagination */}
    </div>
  );
}
```

## E) Edge Case Handling

### ID Mismatch Resolution

```javascript
import { resolveIdMismatch, validateAndFixChain } from "@/utils/management/edgeCases";

// Resolve single relationship
const mtk = resolveIdMismatch(property, entitiesStore, 'mtk');

// Validate and fix full chain
const { chain, warnings } = validateAndFixChain(property, entitiesStore);
```

### Empty States

```javascript
import { getEmptyStateMessage } from "@/utils/management/edgeCases";

const emptyState = getEmptyStateMessage(filters, count);
if (emptyState) {
  return <EmptyState title={emptyState.title} message={emptyState.message} />;
}
```

### Data Consistency

```javascript
import { checkListDataConsistency, normalizeEntityRelationships } from "@/utils/management/edgeCases";

// Check consistency
const { hasIssues, issues } = checkListDataConsistency(list);

// Normalize relationships
const normalized = normalizeEntityRelationships(entity);
```

## Filter Priority və Fallback Qaydaları

### Relationship Extraction Priority

1. **sub_data** (source of truth)
   - `entity.sub_data.mtk.id`
   - `entity.sub_data.complex.id`
   - etc.

2. **Direct field**
   - `entity.mtk_id`
   - `entity.complex_id`
   - etc.

3. **Embedded object**
   - `entity.mtk.id` or `entity.bind_mtk.id`
   - `entity.complex.id` or `entity.bind_complex.id`
   - etc.

### ID Mismatch Handling

Əgər ID-lər uyğun gəlmirsə (məs: `building.complex.id = 5`, `block.complex.id = 2`):

1. `sub_data` prioritet olaraq istifadə olunur
2. Əgər `sub_data` yoxdursa, embedded object-dən götürülür
3. Əgər hər ikisi də uyğun gəlmirsə, warning log edilir və ən yaxın match istifadə olunur

## Performance Optimizasiyası

### useMemo və Selectors

Bütün filter və sort əməliyyatları `useMemo` ilə cache edilir:

```javascript
const filtered = useMemo(() => {
  return list.filter(/* ... */);
}, [list, filters]);
```

### Indexed Maps

Böyük data üçün indexed maps istifadə olunur:

```javascript
// O(1) lookup instead of O(n) filter
const complexIds = indexedMaps.complexIdsByMtkId[mtkId];
const complexes = complexIds.map(id => entities[id]);
```

## URL Query Sync (Optional)

URL query parametrləri ilə filter sync:

```javascript
// URL: ?mtkId=1&complexId=2&search=test
// Automatically syncs with filters
```

Bu funksionallıq `ManagementContextEnhanced`-də optional olaraq aktivləşdirilə bilər.

## Nümunə İstifadə: Properties Modul

### 1. Filter Bar

```javascript
import { PropertiesFilterBar } from "./components/PropertiesFilterBar";

<PropertiesFilterBar />
// Automatically handles cascade filtering
```

### 2. List Hook

```javascript
import { usePropertiesList } from "./hooks/usePropertiesList";

const {
  items,           // Paginated items
  allItems,        // All filtered items (for export)
  currentPage,
  totalPages,
  setPage,
  loading,
  refresh,
} = usePropertiesList();
```

### 3. Detail Hook

```javascript
import { usePropertiesDetail } from "./hooks/usePropertiesDetail";

const { property, loading, error } = usePropertiesDetail(propertyId);
```

## Best Practices

1. **Həmişə `sub_data`-dan istifadə et** - Bu "source of truth"-dur
2. **Indexed maps istifadə et** - Böyük data üçün performans
3. **useMemo istifadə et** - Filter və sort əməliyyatlarını cache et
4. **Edge case-ləri handle et** - ID mismatch, empty states, etc.
5. **Cascading reset-ə diqqət et** - Filter dəyişəndə aşağı səviyyəli filterlər reset olunur

## Migration Guide

Mövcud modulları yeni arxitekturaya keçirmək:

1. `ManagementContextEnhanced`-i import et
2. `useFilteredLists` hook-larını istifadə et
3. `PropertiesFilterBar` kimi filter komponentləri əlavə et
4. Edge case handling əlavə et
5. Test et və optimize et


