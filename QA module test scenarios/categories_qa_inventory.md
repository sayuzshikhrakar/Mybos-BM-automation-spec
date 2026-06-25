# Categories Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | Async Dropdown - Select Item | P0 | Dropdown is rendered | 1. Open dropdown<br>2. Select an item | Selection is applied to host state, dropdown updates | Yes |
| POS-02 | Async Dropdown - Auto-select First | P1 | Widget initialized with `selectFirst: true` | 1. Navigate to screen with dropdown | Dropdown auto-selects first item, `onChanged` fired immediately | Yes |
| POS-03 | Asset Bottom Sheet - Single Select | P0 | Open `SingleAsyncAssetsCategoryDropdown` | 1. Open sheet<br>2. Tap a root category | Category selected, `onChanged` fired immediately | Yes |
| POS-04 | Asset Bottom Sheet - Multi Select | P0 | Open `MultiAsyncAssetsCategoryDropdown` | 1. Open sheet<br>2. Tap multiple categories | Multiple categories selected, `onChanged` fired per tap | Yes |
| POS-05 | Asset Bottom Sheet - Subcategory Navigation | P0 | Sheet open, parent has children | 1. Tap `>` arrow next to parent | Sheet navigates to Page N (SubCategoriesList), shows children | Yes |
| POS-06 | Asset Bottom Sheet - Back Navigation | P1 | On SubCategoriesList page | 1. Tap `<- back` button in header | Navigates back to parent list (Page 0) | Yes |
| POS-07 | Asset Bottom Sheet - Live Search | P1 | Sheet open (Page 0) | 1. Type keyword in search bar | Root categories filter correctly client-side (case-insensitive) | Yes |
| POS-08 | Legacy Dropdown - Synthetic 'All' | P2 | Legacy Cubit initialized with `removeAll=false` | 1. Open dropdown | First item is 'All', selecting it passes 'All' to host | Yes |
| POS-09 | Cache Warming - Parallel Fetch | P1 | App cold start | 1. Launch app<br>2. Monitor network | 6 nested-tree and 2 flat-list API calls fire in parallel | Partially |
| POS-10 | Deselect Single Asset Category | P1 | `SingleAsyncAssetsCategoryDropdown` with active selection | 1. Open sheet<br>2. Tap the currently selected category | Selection is cleared (`_selected = null`) | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | API Fetch Failure (Online, Cache Empty) | P1 | App installed fresh, network failing | 1. Open dropdown screen | Dropdown shows `errorText` or error state, list is empty | Yes |
| NEG-02 | Pre-selected ID Not Found | P2 | `AsyncCategoryDropdown` initialized with invalid `selectedId` | 1. Open host screen | If `selectFirst` is true, falls back to first item. Otherwise, shows empty selection. | Yes |
| NEG-03 | Asset Bottom Sheet - Swipe Blocked | P2 | Open Asset Bottom Sheet (Page 0) | 1. Attempt to horizontally swipe to next page | Swipe is blocked (`NeverScrollableScrollPhysics`) | Yes |
| NEG-04 | Bottom Sheet Dismiss Without Selection | P2 | Open Asset Bottom Sheet | 1. Tap Cancel or tap outside sheet | Sheet closes, host state remains completely unchanged | Yes |
| NEG-05 | Missing "Completed" Category Match | P1 | Local cache lacks category with "completed" | 1. Host module attempts to auto-complete case | Function fails gracefully, case status not updated | Partially |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Deep Hierarchy | P1 | Navigate to a category > subcategory > sub-subcategory (if data permits). Ensure stack manages `_categoriesStack` correctly. |
| EDG-02 | Building Scope Key Switching | P1 | Log in as building manager for Building A. Fetch categories. Switch to Building B. Verify categories trigger a fresh API fetch, bypassing Building A's Hive cache. |
| EDG-03 | Large Category Tree | P2 | Render an asset category tree with 1000+ items. Test bottom sheet search performance. |
| EDG-04 | Multi-Select Identical Names | P2 | Multi-select two sub-categories with the same name but different parent IDs. Verify `removeWhere((e) => e.id == category.id)` removes the correct one. |

---

## Permission Tests

*Note: The Categories module has no internal permission gates. Testing verifies host module gates applied to these widgets.*

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Asset Picker Visibility | P1 | User lacks `permission.assets.canRead` | 1. Navigate to Asset filtering context | Widget/Screen is hidden per host module rules | Yes |
| PERM-02 | Case Type Visibility | P1 | User lacks `permission.cases.canAddOrEdit` | 1. Navigate to New Case | Screen blocked/read-only, preventing dropdown interaction | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `GET /categories/list/nested-tree` | Valid type (e.g., `asset`), specific building ID | 200 OK, full tree returned |
| `GET /categories/list/nested-tree` | Missing `current_building_id` | 400 Bad Request |
| `GET /case/status/list` | Fetch flat list of case statuses | 200 OK |
| `GET /case/type/list` | Fetch flat list of case types | 200 OK |
| `GET /categories/list/nested-tree` | Invalid `type` string | 400 or Empty Array |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `CategoriesCubit` | Fetch Success (removeAll=false) | `initial` -> `loading` -> `success(selectedCategory: 'All', categories includes 'All')` |
| ST-02 | `CategoriesCubit` | Fetch Empty List | `initial` -> `loading` -> `success(selectedCategory: null, categories: [])` |
| ST-03 | `CategoriesCubit` | Fetch Error | `initial` -> `loading` -> `error(message)` |
| ST-04 | `CategoriesSheetContent` | Page Navigation | Page 0 -> `_handleTrailingTap` -> pushes to `_categoriesStack` -> Page 1 |
| ST-05 | `AsyncCategoryDropdown` | `selectFirst` Fallback | `initState` -> API resolves -> id not found -> selects `items.firstOrNull` -> emits `onChanged` |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Offline Cache Read | P0 | 1. Turn off internet<br>2. Open dropdown or bottom sheet | Renders instantly using Hive cache. |
| MOB-02 | Cold Start Sync | P1 | 1. Kill app<br>2. Open app | Background `CaseSyncHelper` repopulates Hive cache transparently. |
| MOB-03 | Device Rotation - Bottom Sheet | P2 | 1. Open Asset bottom sheet<br>2. Rotate device | Bottom sheet adapts size (60% height) without losing navigation stack. |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | Building Data Isolation (BOLA) | Verify that tampering with `current_building_id` in the nested-tree API request does not return categories for buildings the user does not manage. | P0 |
| SEC-02 | Local Cache Leakage | Switch user accounts on the same device. Verify that the Hive cache keys (which include building keys) do not expose previous user's category trees. | P1 |
| SEC-03 | XSS via Category Names | Inject `<script>alert(1)</script>` into a category name directly in the database. Ensure the flutter app renders it as plain text in the dropdown and bottom sheet. | P2 |

---

## Regression Suite (High Value)

1. **POS-01**: Async Dropdown - Select Item
2. **POS-03**: Asset Bottom Sheet - Single Select
3. **POS-05**: Asset Bottom Sheet - Subcategory Navigation
4. **POS-07**: Asset Bottom Sheet - Live Search
5. **EDG-02**: Building Scope Key Switching
6. **MOB-01**: Offline Cache Read
7. **SEC-01**: Building Data Isolation (BOLA)

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (Select Item) | Fully Automatable | Low | P0 |
| POS-03 (Asset Single) | Fully Automatable | Low | P0 |
| POS-04 (Asset Multi) | Fully Automatable | Low | P0 |
| POS-05 (Subcategory Nav) | Fully Automatable | Medium | P0 |
| POS-07 (Live Search) | Fully Automatable | Low | P1 |
| NEG-03 (Swipe Blocked) | Fully Automatable | Medium (Swipe Gestures) | P2 |
| EDG-02 (Building Switch) | Fully Automatable | High | P1 |
| MOB-01 (Offline Cache) | Partially Automatable | High (Network Toggle) | P0 |
| SEC-01 (BOLA) | Manual Only (API) | Medium | P0 |

---

## Coverage Summary

* **Positive Test Count:** 10
* **Negative Test Count:** 5
* **Edge Case Count:** 4
* **Permission Test Count:** 2
* **API Test Count:** 6
* **State Transition Count:** 5
* **Mobile Test Count:** 3
* **Security Test Count:** 3
* **Regression Test Count:** 7
* **Total Automation Candidates:** 23

**Gap Analysis & Additional Notes:**
- *Gap identified:* The reliance on a case-insensitive string match for "Completed" (`BR-14`) is a fragile contract. NEG-05 ensures the graceful degradation of this logic is explicitly tested if the category name on the backend changes.
- *Gap identified:* Single selection deselection logic (`BR-09`). In `SingleAsyncAssetsCategoryDropdown`, tapping an already selected category clears it (`_selected = null`), but doesn't fire `onChanged`. POS-10 ensures this UI interaction is verified.
- *Gap identified:* Since this is an infrastructure module, Permissions are strictly delegated to hosts. PERM-01/02 are included to ensure host integrations are tested, but the module itself has no access logic.
