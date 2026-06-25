# Calendars Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | View Calendar Month | P0 | User logged in | 1. Navigate to Calendar<br>2. View current month | Calendar renders, summary cards display aggregate counts correctly | Yes |
| POS-02 | Client-Side Date Filter | P0 | Events exist | 1. Navigate to Calendar<br>2. Tap a specific date | Summary cards update instantly without API call (client-side filter) | Yes |
| POS-03 | Swipe Month (Debounced Fetch) | P1 | Events exist | 1. Navigate to Calendar<br>2. Swipe left/right to next/prev month | API fetched once after 600ms debounce, calendar updates | Yes |
| POS-04 | Pull to Refresh | P1 | Events exist | 1. Navigate to Calendar<br>2. Pull down to refresh | Current month data is re-fetched | Yes |
| POS-05 | Maintenance Detail - Change Status | P0 | `canAddOrEdit == true` | 1. Open Maintenance Event<br>2. Change status to Completed | UI updates optimistically, Success snackbar, dot markers sync | Yes |
| POS-06 | Maintenance Detail - Move Date | P1 | `canAddOrEdit == true` | 1. Open Maintenance Event<br>2. Pick new date | UI updates optimistically, Success snackbar, dot markers sync | Yes |
| POS-07 | Maintenance Detail - Convert to Case | P1 | `canAddOrEdit == true` | 1. Open Maintenance Event<br>2. Tap 'Convert to Case' | Success message, event converted | Yes |
| POS-08 | Maintenance Detail - Add/Delete Comment | P1 | Event exists | 1. Open Maintenance Event -> Comments tab<br>2. Add comment<br>3. Delete comment | Comments appear/disappear, API syncs | Yes |
| POS-09 | Booking Detail - Change Status | P0 | `canAddOrEdit == true` | 1. Open Booking Event<br>2. Change status to Approve | UI updates optimistically, Success snackbar, dot markers sync | Yes |
| POS-10 | Booking Detail - Add Comment | P1 | `canAddOrEdit == true` | 1. Open Booking Event<br>2. Enter comment, tap Save | Comment saves successfully | Yes |
| POS-11 | Reminder Detail - Move Date | P1 | `canAddOrEdit == true` | 1. Open Reminder Event<br>2. Pick new date | UI updates optimistically, success message | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Add Empty Maintenance Comment | P1 | Event exists | 1. Open Maintenance Details<br>2. Leave comment box empty or just spaces<br>3. Tap Save | Action blocked, no API call made, UI remains same | Yes |
| NEG-02 | Add Empty Booking/Reminder Comment | P1 | `canAddOrEdit == true` | 1. Open Booking/Reminder<br>2. Leave comment empty<br>3. Tap Save | Action blocked, no API call made | Yes |
| NEG-03 | Booking Change Status Failure | P1 | `canAddOrEdit == true` | 1. Open Booking Event<br>2. Change status<br>3. Mock API failure (`errorCount > 0`) | Rollback occurs (`error` state), specific API error message shown in snackbar | Partially |
| NEG-04 | Move Maintenance Failure (No Rollback) | P2 | `canAddOrEdit == true` | 1. Move Maintenance Event<br>2. Mock API failure | No rollback (per BR-05), UI stays in optimistic state, error logged/shown | Partially |
| NEG-05 | Change Booking Status to Same Value | P2 | `canAddOrEdit == true` | 1. Open Booking<br>2. Try to select the currently active status | UI guards against re-selection (dropdown doesn't trigger change) | Yes |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Rapid Month Swipes | P1 | Swipe through 5 months within 500ms. Verify only 1 API call is made for the final month due to 600ms debounce. |
| EDG-02 | End of Month Boundaries | P2 | Fetch data for a month, ensure events on the 1st and the 30th/31st are correctly binned and displayed. |
| EDG-03 | No Events in Month | P1 | Navigate to a month with zero events. Ensure empty states render correctly on cards and lists. |
| EDG-04 | Max Length Comment | P2 | Submit a comment with 1000+ characters to Maintenance, Booking, and Reminder. |
| EDG-05 | Status Mapping Accuracy | P1 | Ensure Maintenance "Completed" sends `"Complete"`, and Booking "Approve" sends `"Approve"` in their respective payloads. |
| EDG-06 | Unicode in Comments | P2 | Submit a comment containing emojis and unicode characters. |

---

## Permission Tests

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Maintenance Actions Hidden | P0 | `canAddOrEdit == false` | 1. Open Maintenance Details | Status dropdown disabled, Date picker disabled, "Convert to Case" hidden | Yes |
| PERM-02 | Booking Actions Hidden | P0 | `canAddOrEdit == false` | 1. Open Booking Details | Status dropdown disabled, Comment input bar completely hidden | Yes |
| PERM-03 | Reminder Actions Hidden | P0 | `canAddOrEdit == false` | 1. Open Reminder Details | Date picker disabled, Comment input bar completely hidden | Yes |
| PERM-04 | Unrestricted Comments | P1 | `canAddOrEdit == false` | 1. Open Maintenance Details | Comment tab and Delete comment buttons remain accessible (no `canDelete` gate) | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `POST /event/history/list` | Valid month payload | 200 OK, full month events |
| `POST /event/history/list` | Missing start/end dates | 400 Bad Request |
| `POST /event/history/{id}/change/status` | Valid status change | 200 OK |
| `POST /event/history/{id}/move` | Valid date change | 200 OK |
| `POST /amenity/booking/change/status`| Valid status update | 200 OK, `errorCount: 0` |
| `POST /amenity/booking/change/status`| API rejects status change | 200 OK, `errorCount: 1`, throws ApiException via repo |
| `POST /reminder/update` | Date update only | 200 OK |
| `POST /reminder/update` | Comment update only | 200 OK |
| `POST /event/history/{id}/comment/save`| Valid comment | 200 OK |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `CalendersBloc` | Initial load / Refresh | `initial` -> `loading` -> `success(events)` |
| ST-02 | `CalendersBloc` | Debounced Search | Wait 600ms -> `loading` -> `success` |
| ST-03 | `MaintenanceBloc` | Change Status (Optimistic) | `success` -> `changing(tempStatus)` -> `success(updated)` |
| ST-04 | `MaintenanceBloc` | Add Comment (Optimistic) | `success` -> `changing(tempList)` -> `success(API)` -> `loading` (re-fetch) -> `success` |
| ST-05 | `BookingBloc` | Update Failure (Rollback) | `success` -> `changing` -> `error(originalData)` |
| ST-06 | `ReminderBloc` | Update | `success` -> `changing` -> `success` |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Network Switch during Month Load | P1 | 1. Swipe month<br>2. Switch Wifi to Cellular | Debounced request should recover or fail gracefully, no crash |
| MOB-02 | Offline mode - Actions | P1 | 1. Go offline<br>2. Try to change status | Graceful network error message shown |
| MOB-03 | Backgrounding | P2 | 1. Open Maintenance Details<br>2. Background app<br>3. Foreground app | App resumes properly, state is retained |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | Action Authorization | Call `POST /event/history/{id}/change/status` or `POST /event/history/{id}/move` with a user token where `permission.calendar.canAddOrEdit == false`. Backend should reject. | P0 |
| SEC-02 | Comment Validation (XSS) | Submit a comment containing `<script>alert(1)</script>` and verify it is rendered as plain text in the app. | P1 |
| SEC-03 | Cross-Building Data Leakage | Modify request payload in `POST /event/history/list` to request events for a building the user does not manage. Backend should reject. | P0 |

---

## Regression Suite (High Value)

1. **POS-01**: View Calendar Month (ensures core API and UI work)
2. **POS-02**: Client-Side Date Filter (verifies sorting/filtering logic)
3. **POS-03**: Swipe Month Debounced (verifies performance/API optimization)
4. **POS-05**: Maintenance Detail - Change Status (verifies optimistic UI)
5. **POS-09**: Booking Detail - Change Status (verifies rollback on error count)
6. **NEG-01**: Add Empty Maintenance Comment (verifies input guarding)
7. **PERM-01/02**: Maintenance and Booking Actions Hidden (verifies core permissions)
8. **EDG-05**: Status Mapping Accuracy (verifies payload enum mapping)

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (View Month) | Fully Automatable | Low | P0 |
| POS-02 (Tap Date) | Fully Automatable | Low | P0 |
| POS-03 (Swipe Month) | Fully Automatable | Medium (Swipe Gestures) | P0 |
| POS-05 (Maint. Status) | Fully Automatable | Low | P0 |
| POS-09 (Booking Status) | Fully Automatable | Low | P0 |
| POS-10 (Booking Comment) | Fully Automatable | Low | P1 |
| NEG-01 (Empty Comment) | Fully Automatable | Low | P1 |
| PERM-01 (Maint. Actions) | Fully Automatable | Low | P1 |
| EDG-01 (Rapid Swipes) | Partially Automatable | High (Timing dependent) | P2 |
| MOB-02 (Offline Actions) | Partially Automatable | High (Network control) | P2 |

---

## Coverage Summary

* **Positive Test Count:** 11
* **Negative Test Count:** 5
* **Edge Case Count:** 6
* **Permission Test Count:** 4
* **API Test Count:** 10
* **State Transition Count:** 6
* **Mobile Test Count:** 3
* **Security Test Count:** 3
* **Regression Test Count:** 8
* **Total Automation Candidates:** 22

**Gap Analysis & Additional Notes:**
- *Gap identified:* The analysis explicitly notes that Maintenance Status and Move date operations do *not* have UI rollback implementations on API failure. NEG-04 was explicitly created to ensure this known technical debt/behavior is tracked.
- *Gap identified:* Bulk comment deletion. API endpoint is `delete` (bulk by array), but UI seems to be single item removal. Added to POS-08 to ensure UI handles it cleanly.
- *Gap identified:* Maintenance comment deletion is not permission-gated (no `canDelete` rule in calendars module). PERM-04 verifies this explicitly so it isn't flagged as a bug later if intended.
