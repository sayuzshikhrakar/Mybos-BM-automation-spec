# Residents Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | View Residents Directory | P0 | Residents exist in system | 1. Navigate to Residents module | Initial fetch completes, list of residents loads | Yes |
| POS-02 | Search Residents (Keyword) | P0 | Directory loaded | 1. Type valid keyword in search bar<br>2. Wait for debounce | List clears, fetches, and displays filtered results matching keyword | Yes |
| POS-03 | Filter by Category | P1 | Categories exist (e.g., Owner/Tenant) | 1. Open Category dropdown<br>2. Select a category | List re-fetches and displays only residents matching the category | Yes |
| POS-04 | View Resident Details | P0 | Directory loaded | 1. Tap a resident card | Navigates to `ResidentDetailsPage`, populates read-only data | Yes |
| POS-05 | Pagination | P1 | >20 residents exist | 1. Scroll to bottom of directory list | `fetchMore()` triggers, loading indicator shows, next page appends seamlessly | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Search No Results | P1 | Directory loaded | 1. Enter non-existent keyword (e.g., "XYZ999") | List shows empty state / "No results found" | Yes |
| NEG-02 | Whitespace Search | P2 | Directory loaded | 1. Enter only space characters in search | `.trim()` removes spaces, API fetched with empty keyword (returns all) | Yes |
| NEG-03 | API Failure on Load | P1 | Network error | 1. Open Residents module | Error state/message shown, loading shimmer removed | Yes |
| NEG-04 | Pagination Failure | P2 | Scrolled to bottom | 1. Mock API failure during `fetchMore` | Existing list is retained, no crash | Partially |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Rapid Search & Filter | P2 | Type rapidly in search, then immediately change the category filter. Verify the debounce and race conditions handle the final requested state accurately. |
| EDG-02 | Pagination Bounds | P2 | Scroll to the very last resident in the building (e.g., page 5 of 5). Verify scrolling further does not trigger redundant API calls. |
| EDG-03 | Specific Field Search (Registration) | P1 | Trigger `getResidentsWithRegistration(keyword)` from an external module. Verify the API strictly filters by the `registration` search field. |
| EDG-04 | Null Safety on Details | P2 | Open details for a resident with missing optional fields (e.g., no emergency contact, no email). Verify UI renders gracefully without layout breaks. |

---

## Permission Tests

*Note: The Residents module is entirely read-only and lacks internal feature-level permission checks. Tests verify this strict read-only nature.*

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Read-Only Enforcement | P0 | User authenticated | 1. View Directory<br>2. View Details | Verify absolutely no "Edit", "Add", or "Delete" actions are exposed in the UI. | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `POST /resident/list` | Default fetch (page 1, empty keyword) | 200 OK |
| `POST /resident/list` | Valid `keyword` string | 200 OK |
| `POST /resident/list` | Valid `categoryId` | 200 OK |
| `POST /resident/list` | `searchFields` = `['registration']` | 200 OK |
| `POST /resident/list` | Invalid/out-of-bounds `page` number | 200 OK (Empty array) |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `ResidentsBloc` | Initial Load | `initial` -> `loading` -> `success(list)` |
| ST-02 | `ResidentsBloc` | Search Event | `success(list A)` -> `loading` -> `success(list B)` |
| ST-03 | `ResidentsBloc` | Fetch More Success | `success(page 1)` -> `fetching` -> `success(page 1 + 2)` |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Network Switch during Fetch | P2 | 1. Scroll to trigger pagination<br>2. Switch from Wi-Fi to Cellular | App handles transition, fetch completes or fails gracefully |
| MOB-02 | Avatar Caching | P2 | 1. Load directory<br>2. Turn off internet<br>3. Scroll up/down | Resident avatars remain visible via local image caching |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | BOLA - Building Directory | Ensure `POST /resident/list` only returns residents associated with the user's explicitly authorized `current_building_id`. | P0 |
| SEC-02 | PII Exposure | Verify the resident payload does not leak hyper-sensitive unneeded PII (e.g., Social Security Numbers, banking info) to the mobile client in the list response. | P1 |

---

## Regression Suite (High Value)

1. **POS-01**: View Residents Directory
2. **POS-02**: Search Residents (Keyword)
3. **POS-03**: Filter by Category
4. **POS-04**: View Resident Details
5. **POS-05**: Pagination (Crucial for large buildings)
6. **NEG-02**: Whitespace Search (Validates input sanitization)
7. **EDG-03**: Specific Field Search (Validates cross-module integration)

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (View List) | Fully Automatable | Low | P0 |
| POS-02 (Search) | Fully Automatable | Medium | P0 |
| POS-03 (Filter) | Fully Automatable | Low | P0 |
| POS-04 (View Details) | Fully Automatable | Low | P0 |
| POS-05 (Pagination) | Fully Automatable | Medium (Scroll actions) | P1 |
| NEG-01 (Empty Search) | Fully Automatable | Low | P1 |
| NEG-02 (Trim Search) | Fully Automatable | Low | P2 |
| PERM-01 (Read-only) | Fully Automatable | Low | P0 |

---

## Coverage Summary

* **Positive Test Count:** 5
* **Negative Test Count:** 4
* **Edge Case Count:** 4
* **Permission Test Count:** 1
* **API Test Count:** 6
* **State Transition Count:** 3
* **Mobile Test Count:** 2
* **Security Test Count:** 2
* **Regression Test Count:** 7
* **Total Automation Candidates:** 14

**Gap Analysis & Additional Notes:**
- *Gap identified:* Data Hydration (`BR-03`). The detail page relies entirely on the data model passed from the list screen. This implies the `POST /resident/list` payload is quite heavy. SEC-02 was added specifically to ensure this heavy list payload isn't indiscriminately leaking sensitive PII that isn't required for the app.
- *Gap identified:* Specific search context (`BR-02`). The ability to search specifically by vehicle registration is likely invoked from the Visitor Parking or Breaches module. EDG-03 ensures this specific search path is explicitly covered.
