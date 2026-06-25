# Contractors Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | View Contacts List | P0 | Contacts exist | 1. Navigate to Contractors -> Contacts tab | List of contacts loads. Primary contacts marked with gold star | Yes |
| POS-02 | View Companies List | P0 | Companies exist | 1. Navigate to Contractors -> Companies tab | List of companies loads | Yes |
| POS-03 | View Expired Insurance List | P1 | Expired insurances exist | 1. Navigate to Contractors -> Expired Insurance tab | List of expired insurances loads | Yes |
| POS-04 | Search Contacts/Companies | P0 | Data exists | 1. Type keyword in search bar<br>2. Wait 600ms | List filters correctly based on debounced query | Yes |
| POS-05 | Contact Action - Call | P1 | Contact has valid phone | 1. Tap Phone icon on Contact card | Phone dialer launches | Yes |
| POS-06 | Contact Action - Email | P1 | Contact has valid email | 1. Tap Email icon on Contact card | Mail app launches | Yes |
| POS-07 | View Company Details - General | P0 | Company exists | 1. Tap Company card<br>2. View General tab | Company info and expandable contact list displayed | Yes |
| POS-08 | View Company Details - History | P1 | Company has completed cases | 1. Open Company Details<br>2. Go to History tab | List of strictly 'Completed' cases loads | Yes |
| POS-09 | Dropdown Single Auto-Select | P0 | Use ContractorDropdown (Single) | 1. Select a contractor | `primaryContacts.firstOrNull` automatically selected as Contact | Yes |
| POS-10 | Dropdown Multi Auto-Select | P1 | Use ContractorDropdown (Multi) | 1. Select multiple contractors | `primaryContacts` from all selected are merged and de-duplicated in Contact dropdown | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Call Missing Phone Number | P1 | Contact/Company has no phone | 1. Tap Phone icon | Warning snackbar `l10n.noContactNumberMessage` shown, dialer does NOT launch | Yes |
| NEG-02 | Email Missing Address | P1 | Contact/Company has no email | 1. Tap Email icon | Warning snackbar `l10n.noEmailAddress` shown, mail app does NOT launch | Yes |
| NEG-03 | API Failure - Companies Tab | P1 | Network error | 1. Go to Companies tab<br>2. Pull to refresh | Error state/message shown (No offline fallback) | Yes |
| NEG-04 | Dropdown Validation Error | P2 | Dropdown used in host form | 1. Host form triggers validation error | Inline red error text renders below Contractor/Contact dropdown | Yes |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Rapid Search Keystrokes | P1 | Type 10 characters rapidly in the search bar. Verify only 1 API call is made after the 600ms `debounceRestartable` period. |
| EDG-02 | Contacts Offline Fallback | P0 | Go offline. Open Contacts tab. Verify `ContactsBloc` reads from Hive and renders the cached list successfully (BR-01). |
| EDG-03 | Offline Tab Switching | P2 | Go offline. Switch from Contacts to Companies tab. Verify `ContractorsPage.onTabChange` blocks the refresh call, preventing a network error spinner (BR-03). |
| EDG-04 | Contact De-selection in Multi-Mode | P1 | Select Contractor A and B. Multi-dropdown auto-populates Contacts A1 and B1. Deselect Contractor A. Verify Contact A1 is automatically removed from the contact selection (BR-11). |
| EDG-05 | Pagination Bounds | P2 | Scroll to end of Companies list (past `lastPage`). Verify `fetchMore` does not trigger redundant API calls. |
| EDG-06 | Missing Assigned User (Insurance Tab) | P2 | Open Company Details -> Insurance tab for a record with an invalid `tagContactUid`. Verify UI falls back to displaying the `companyName` instead of crashing (BR-07). |

---

## Permission Tests

*Note: The Contractors module is explicitly documented as READ-ONLY and completely open to all authenticated users. No internal UI permission gates exist.*

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Global Read Access | P0 | User authenticated | 1. Navigate to Contractors module | Module is fully accessible regardless of specific feature permissions | Yes |
| PERM-02 | Read-Only Enforcement | P0 | User authenticated | 1. Explore module | Verify there are absolutely no "Add", "Edit", or "Delete" buttons visible | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `POST /contractors/contacts/list` | Default fetch | 200 OK, limit 250 |
| `POST /contractors/contacts/list` | Keyword search | 200 OK |
| `POST /contractors/list` | Default fetch | 200 OK, limit 20 |
| `POST /contractors/expire/list` | Category filter applied | 200 OK |
| `GET /contractor/{id}` | Fetch valid ID (`current_building_id` param) | 200 OK |
| `POST /cases/list` | Fetch history (status='Completed', contractors=[id]) | 200 OK |
| **ALL** | Missing Bearer Token | 401 Unauthorized |
| **ALL** | Invalid `current_building_id` | 400/404/500 Error (Server dependent) |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `ContactsBloc` | Fetch (Online) | `initial` -> `loading` -> `success(API data)` |
| ST-02 | `ContactsBloc` | Fetch (Offline) | `initial` -> `loading` -> `success(Hive cache)` |
| ST-03 | `ContractorsBloc` | Fetch More | `success` -> `fetching` -> `fetchSuccess(appended list)` |
| ST-04 | `ContractorDetailCubit` | Init Detail | `loading` -> `success` |
| ST-05 | `ContractorWrapperPage` | Parallel Init | On module entry, ContactsBloc, ContractorsBloc, ExpiredInsuranceBloc simultaneously move from `initial` -> `loading` |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | URL Launcher Integration | P0 | 1. Tap Email/Phone action on real device | OS delegates to default dialer/mailer app |
| MOB-02 | Offline Cache Persistence | P1 | 1. Load contacts online<br>2. Kill app<br>3. Turn on Airplane mode<br>4. Relaunch app to Contacts tab | Contacts render from Hive without network request |
| MOB-03 | Network Switch | P2 | 1. Start debounced search<br>2. Toggle Wi-Fi to Cellular during debounce | Search request executes successfully or fails gracefully |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | BOLA - Company Details | Tamper with `current_building_id` parameter when requesting `GET /contractor/{id}` for a company that does not serve the user's building. Backend should reject. | P0 |
| SEC-02 | BOLA - Cases History | Ensure `HistoryCubit` requesting `POST /cases/list` with a specific `contractorId` does not return cases belonging to other buildings. | P0 |
| SEC-03 | Data Exposure (Notes) | Ensure the plain text notes returned in the General tab of Company details do not expose unauthorized API keys or sensitive backend data. | P2 |

---

## Regression Suite (High Value)

1. **POS-01**: View Contacts List
2. **POS-02**: View Companies List
3. **POS-05/06**: Contact Action - Call & Email
4. **POS-07**: View Company Details - General
5. **POS-09**: Dropdown Single Auto-Select (critical for Cases module integration)
6. **NEG-01/02**: Call/Email Missing Info (verify snackbar guards)
7. **EDG-02**: Contacts Offline Fallback
8. **EDG-04**: Contact De-selection in Multi-Mode

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (View Contacts) | Fully Automatable | Low | P0 |
| POS-02 (View Companies)| Fully Automatable | Low | P0 |
| POS-05 (Call Action) | Partially Automatable | High (Requires OS intent verification) | P1 |
| POS-07 (View Details) | Fully Automatable | Low | P0 |
| POS-09 (Single Dropdown)| Fully Automatable | Medium | P0 |
| NEG-01 (Missing Phone) | Fully Automatable | Low | P1 |
| EDG-01 (Debounce Search)| Partially Automatable | High (Timing dependent) | P2 |
| EDG-02 (Offline Fallback)| Partially Automatable | High (Network control) | P0 |
| EDG-04 (Multi Deselect) | Fully Automatable | Medium | P1 |
| PERM-02 (Read-Only) | Fully Automatable | Low | P0 |

---

## Coverage Summary

* **Positive Test Count:** 10
* **Negative Test Count:** 4
* **Edge Case Count:** 6
* **Permission Test Count:** 2
* **API Test Count:** 8
* **State Transition Count:** 5
* **Mobile Test Count:** 3
* **Security Test Count:** 3
* **Regression Test Count:** 8
* **Total Automation Candidates:** 20

**Gap Analysis & Additional Notes:**
- *Gap identified:* Inconsistent offline handling. The `ContactsBloc` has explicit Hive offline fallback, but `ContractorsBloc` (companies) and `ExpiredInsuranceBloc` do not. EDG-02 and NEG-03 explicitly test this divergent behavior to ensure it works as coded.
- *Gap identified:* The ContractorDropdown widget is heavily relied upon by other modules (Cases). POS-09, POS-10, and EDG-04 explicitly test its complex internal state management (merging and de-duplicating primary contacts dynamically based on the contractor selection).
- *Gap identified:* Phone/Email intents. Tests POS-05/06 and NEG-01/02 verify that the app intercepts null/empty values and shows a snackbar instead of passing malformed URIs to the OS `url_launcher`.
