# Breaches Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | Create Parking Breach | P0 | User has `canAddOrEdit` | 1. Navigate to Breaches List<br>2. Select Parking Tab<br>3. Tap 'New Breach'<br>4. Enter Vehicle Registration (auto-fill triggers)<br>5. Fill Make, Model, Title, Description<br>6. Tap 'Save' | Breach created, returns to list, list auto-refreshes | Yes |
| POS-02 | Create Common Area Breach | P0 | User has `canAddOrEdit` | 1. Navigate to Breaches List<br>2. Select Common Area Tab<br>3. Tap 'New Breach'<br>4. Select Resident, ensure Email exists<br>5. Fill Title, Description<br>6. Tap 'Save' | Breach created, returns to list, list auto-refreshes | Yes |
| POS-03 | Search Breaches | P1 | Breaches exist | 1. Navigate to Breaches List<br>2. Enter keyword in search bar | Active tab list filters by keyword | Yes |
| POS-04 | Filter Sync Across Tabs | P1 | Breaches exist | 1. Navigate to Breaches List<br>2. Tap Filter, select status and apply<br>3. Verify Parking tab<br>4. Switch to Common Area tab | Both tabs reflect the applied filter | Yes |
| POS-05 | Edit Breach (Compute Diff) | P0 | Breach exists, `canAddOrEdit` | 1. Open Breach Details<br>2. Tap Menu -> Edit<br>3. Change Description only<br>4. Save | Only Description is sent in PUT request, Detail screen refreshes | Yes |
| POS-06 | Change Breach Status | P1 | Breach exists, `canAddOrEdit` | 1. Open Breach Details<br>2. Select new Status from dropdown | Detail screen refreshes silently, success snackbar shown | Yes |
| POS-07 | Delete Breach (Optimistic UI) | P0 | Breach exists, `canDelete` | 1. Open Breach Details<br>2. Tap Menu -> Delete<br>3. Confirm in dialog | UI immediately removes breach, returns to list, success snackbar | Yes |
| POS-08 | Add, Edit, and Delete Comment | P1 | Breach exists | 1. Open Breach Details<br>2. Add Comment<br>3. Edit own comment<br>4. Delete own comment | Comment appears, updates, and is removed optimistically | Yes |
| POS-09 | Send Email with CC/BCC | P0 | Breach has resident email | 1. Open Breach Details<br>2. Tap Send Email FAB<br>3. Fill Subject, Body, add valid CC/BCC<br>4. Tap Send | Email sheet closes, success snackbar, email logs update | Yes |
| POS-10 | Pre-fill Vehicle Data from Registration | P1 | Resident has registered vehicle | 1. Create Parking Breach<br>2. Type existing registration | Make, Model, Apartment, Resident, Email auto-fill | Yes |
| POS-11 | Pre-fill Vehicle Data from Resident | P1 | Resident has 1 vehicle | 1. Create Parking Breach<br>2. Select Resident directly | Vehicle Registration, Make, Model auto-fill | Yes |
| POS-12 | Upload Photos and Document | P1 | `canAddOrEdit` | 1. Create/Edit Breach<br>2. Attach 3 photos<br>3. Attach 1 document<br>4. Save | Breach saves successfully with attachments | Yes |
| POS-13 | Create Breach from Visitor Parking | P0 | Visitor parking booking exists | 1. Go to Visitor Parking -> Report Breach<br>2. Validate pre-filled data<br>3. Submit | Breach saves, UI routes back to Visitor Parking | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Create Parking - Missing Required | P0 | `canAddOrEdit` | 1. Create Parking Breach<br>2. Leave Registration, Make, Model, Title, or Description empty<br>3. Save | Validation error messages appear | Yes |
| NEG-02 | Create Common Area - Missing Resident | P0 | `canAddOrEdit` | 1. Create Common Area Breach<br>2. Leave Resident empty<br>3. Save | Validation error message appears | Yes |
| NEG-03 | Create Common Area - Missing Email | P1 | `canAddOrEdit` | 1. Create Common Area Breach<br>2. Select resident without email<br>3. Save | Email required validation message appears (checked outside form) | Yes |
| NEG-04 | Send Email FAB - Blocked | P1 | Breach has no email | 1. Open Details for breach without email<br>2. Tap Send Email FAB | Error snackbar shown (`noResidentEmailValidation`), sheet blocked | Yes |
| NEG-05 | Send Email - Invalid CC/BCC Format | P2 | Send Email Sheet open | 1. Type invalid email in CC/BCC<br>2. Add | Error: "Enter valid email" | Yes |
| NEG-06 | Delete Breach Failure (Rollback) | P1 | `canDelete` | 1. Open Details -> Delete<br>2. Confirm<br>3. Mock API failure | Breach disappears briefly, then is restored, error snackbar | Partially |
| NEG-07 | Delete Comment Failure (Rollback) | P2 | Own comment exists | 1. Delete Comment<br>2. Mock API failure | Comment disappears briefly, then is restored, error snackbar | Partially |
| NEG-08 | Edit Mode - Exceed Photo Limit | P2 | Breach has 3 photos | 1. Edit Breach<br>2. Attempt to add 4th photo | Picker prevents selection / validation prevents save | Yes |
| NEG-09 | Parallel Photo Deletion Failure | P2 | Edit Breach with multiple photos removed | 1. Remove 2 photos<br>2. Save<br>3. Mock 1 DELETE API failure | Entire save operation reports error, UI reflects failure | Partially |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Title Max Length | P2 | Verify Title cannot exceed 80 characters. |
| EDG-02 | Clear Apartment Cascade | P1 | Verify clearing the Apartment field correctly cascades and clears dependent Residents, Email, and Vehicle fields. |
| EDG-03 | Clear Resident Cascade | P1 | Verify clearing all Residents clears the Description field. |
| EDG-04 | Multiple Vehicles Disambiguation | P1 | Select a Resident who owns >1 vehicle. Verify the UI stops auto-fill and prompts: "The resident has {n} vehicles. Please select one to proceed." |
| EDG-05 | Vehicle Color Validation | P2 | Verify Vehicle Color is optional (validator allows null) for both Parking and Common Area breaches. |
| EDG-06 | Default Status | P2 | Verify new breaches default to "Resolved" status, not "Open" or "Pending". |
| EDG-07 | Locked Breach Type | P1 | Verify Breach Type dropdown is completely locked/disabled when in Edit Mode or coming from Visitor Parking. |
| EDG-08 | Send Email with CC but no BCC | P2 | Send email with valid CC list, empty BCC list, and ensure API accepts payload. |
| EDG-09 | Pagination Bounds | P2 | Scroll to the end of the breaches list, ensure `fetchMore` does not trigger when `hasReachedEnd` is true. |

---

## Permission Tests

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Hide 'New Breach' Button | P0 | `canAddOrEdit == false` | 1. Open Breaches List | 'New Breach' button is completely hidden | Yes |
| PERM-02 | Hide 'Edit' Menu Item | P0 | `canAddOrEdit == false` | 1. Open Breach Details | 'Edit' option is not in the context menu | Yes |
| PERM-03 | Status Dropdown Read-Only | P0 | `canAddOrEdit == false` | 1. Open Breach Details | Status dropdown is disabled and unclickable | Yes |
| PERM-04 | Hide 'Delete' Menu Item | P0 | `canDelete == false` | 1. Open Breach Details | 'Delete' option is not in the context menu (even if user can Edit) | Yes |
| PERM-05 | Separate Edit and Delete Rights | P1 | `canDelete == true`, `canAddOrEdit == false` | 1. Open Breach Details | Delete is visible, but Edit and Status changes are disabled | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `POST /breaches/parking_area/list` | Fetch paginated list, verify tabs | 200 OK |
| `POST /breaches/common_area/list` | Fetch with filters (status, dates) | 200 OK |
| `GET /breaches/{id}` | Fetch valid ID | 200 OK |
| `POST /breaches/parking_area/create`| Valid payload with all fields | 200/201 OK |
| `PUT /breaches/{id}` | Diff payload (only updated fields) | 200 OK |
| `PUT /breaches/{id}/status` | Update status payload | 200 OK |
| `POST /breaches/delete-breaches` | Valid ID array | 200 OK |
| `POST /breaches/{id}/photo/multiple`| Valid images | 200 OK |
| `DELETE /breaches/{id}/photo/{imgId}`| Delete valid image ID | 200 OK |
| `POST /breaches/{id}/send-email` | Valid subject, body, CC array | 200 OK |
| `POST /breaches/{id}/comments` | Valid comment text | 200 OK |
| `POST /resident/vehicle/list` | Valid apartment ID | 200 OK, returns list of vehicles |
| **ALL** | Invalid token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `ParkingBreachesListCubit`| Search Query | `success` -> `loading` (clears list, page=1) -> `success` |
| ST-02 | `ParkingBreachesListCubit`| Fetch More (Data exists) | `success` -> `success(isFetching=true)` -> `success(appended)` |
| ST-03 | `ParkingBreachDetailsCubit`| Delete Breach (Optimistic) | `success` -> UI clears breach -> API Success (no emit) |
| ST-04 | `CreateBreachCubit` | Change Breach Type | `initialState` -> `clearRequiredData` -> `initial` with new type |
| ST-05 | `BreachCommentsCubit` | Delete Comment (Failure) | `list populated` -> optimistic remove -> API Error -> `deletionStatus=error`, comment restored |
| ST-06 | `BreachSendEmailCubit` | Invalid Email Body | `initial` -> `sendEmail` called -> `sendingStatus=error` (validation fails, no API call) |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Offline mode - Action | P1 | 1. Go offline<br>2. Change Breach Status | Graceful network error message shown, status reverts if optimistic |
| MOB-02 | Backgrounding during Email | P2 | 1. Open Send Email sheet<br>2. Enter data<br>3. App to background<br>4. App to foreground | Sheet remains open, data is retained |
| MOB-03 | Device Rotation | P2 | 1. Open Add Breach Form<br>2. Rotate device | UI adapts without losing entered form state (Make, Model, etc.) |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | Edit Authorization | Send a PUT request to edit a breach using a token of a user where `permission.breaches.canAddOrEdit == false`. Backend should reject. | P0 |
| SEC-02 | Delete Authorization | Send a POST to `/delete-breaches` using a token where `permission.breaches.canDelete == false`. Backend should reject. | P0 |
| SEC-03 | Comment Edit/Delete | Attempt to edit or delete a comment where `userId` does not match the token's user ID. Backend should reject. | P0 |
| SEC-04 | XSS in Comments | Enter `<script>alert(1)</script>` in comment body. Ensure it renders as plain text. | P1 |
| SEC-05 | Data Exposure | Verify CC and BCC email arrays do not expose other residents' emails unnecessarily in the UI or raw response payloads. | P1 |

---

## Regression Suite (High Value)

1. **POS-01**: Create Parking Breach (tests auto-fill and required fields)
2. **POS-02**: Create Common Area Breach (tests resident/email requirements)
3. **POS-04**: Filter Sync Across Tabs
4. **POS-05**: Edit Breach (verifies diff computation logic)
5. **POS-07**: Delete Breach (tests optimistic UI)
6. **POS-09**: Send Email with CC/BCC
7. **NEG-04**: Send Email FAB - Blocked if no resident email
8. **EDG-04**: Multiple Vehicles Disambiguation
9. **PERM-01/04**: Verify 'New Breach' and 'Delete' hidden for unauthorized.

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (Create Parking) | Fully Automatable | Medium (Typeahead) | P0 |
| POS-02 (Create Common Area) | Fully Automatable | Medium | P0 |
| POS-04 (Filter Sync) | Fully Automatable | Low | P0 |
| POS-05 (Edit Diff) | Fully Automatable | Medium | P0 |
| POS-07 (Optimistic Delete) | Fully Automatable | Low | P1 |
| POS-09 (Send Email) | Fully Automatable | Medium | P0 |
| POS-10 (Auto-fill) | Fully Automatable | High | P1 |
| NEG-04 (Email blocked) | Fully Automatable | Low | P1 |
| EDG-02 (Clear Cascade) | Fully Automatable | Medium | P1 |
| MOB-01 (Offline) | Partially Automatable | High | P2 |

---

## Coverage Summary

* **Positive Test Count:** 13
* **Negative Test Count:** 9
* **Edge Case Count:** 9
* **Permission Test Count:** 5
* **API Test Count:** 13
* **State Transition Count:** 6
* **Mobile Test Count:** 3
* **Security Test Count:** 5
* **Regression Test Count:** 9
* **Total Automation Candidates:** 28

**Gap Analysis & Additional Notes:**
- *Gap identified:* The analysis notes that Vehicle Color is optionally required (bug noted in BR-10). Added EDG-05 to verify it functions as optional and the UI handles it cleanly.
- *Gap identified:* Bulk deletes vs. Single deletes. The API is `/delete-breaches` (array) but the UI flow specifies deleting from the Detail screen (single). Assumed single ID array is passed.
- *Gap identified:* Separate permissions. The distinction between `canAddOrEdit` and `canDelete` is significant. PERM-05 added specifically to test a user who can delete but cannot edit.
