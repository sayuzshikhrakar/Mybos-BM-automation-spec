# Inspection Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | Start New Inspection | P0 | Templates exist | 1. Navigate to Inspections -> Templates tab<br>2. Tap a template | Inspection initializes, saves to local DB, navigates to `InspectionDetailsPage` | Yes |
| POS-02 | Resume In-Progress | P0 | In-progress items exist | 1. Go to In-Progress tab<br>2. Tap an inspection | Navigates to `InspectionDetailsPage`, previous state retained | Yes |
| POS-03 | Evaluate Item (Pass/Fail/NA) | P0 | Inspection active | 1. Expand area<br>2. Tap Pass/Fail/NA on an item | UI updates immediately (local DB write), syncs to server | Yes |
| POS-04 | Add Item Comment | P1 | Inspection active | 1. Tap Chat icon on item<br>2. Enter comment, save | Comment saved locally, chat icon shows badge/dot indicator | Yes |
| POS-05 | Add Item Image | P1 | Inspection active | 1. Tap Camera icon<br>2. Select/Capture image | Image preview shown, saves locally, initiates multipart sync | Partially |
| POS-06 | Convert to Case | P1 | Inspection active, `canAddOrEdit` | 1. Tap tool icon on item<br>2. Confirm conversion | Item marked `hasToBeCompleted = true`, Draft case spawns | Yes |
| POS-07 | Complete Inspection | P0 | Online, 100% synced | 1. Tap 'Mark Complete'<br>2. Wait for API | Success, prompts for email, inspection moves to Completed tab | Yes |
| POS-08 | Email Completed Report | P1 | Inspection completed, `canAddOrEdit` | 1. Open Completed inspection<br>2. Tap Email<br>3. Enter valid email, send | Report emailed successfully via backend | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Start Private Inspection w/o Apartment | P0 | Private template | 1. Select Private inspection<br>2. Dismiss `ApartmentDialog` | Cannot proceed to inspection without assigning apartment | Yes |
| NEG-02 | Empty Comment Validation | P1 | Comment dialog open | 1. Leave text empty<br>2. Tap Save | Dialog prevents save, prompts for text | Yes |
| NEG-03 | Exceed Image Count | P1 | Item already has 3 images | 1. Attempt to add 4th image | Action blocked, warning snackbar shown | Partially |
| NEG-04 | Exceed Image File Size | P1 | Picking image | 1. Select 10MB image file | Action blocked, 5MB validation error shown | Partially |
| NEG-05 | Complete Offline | P0 | Offline | 1. Tap 'Mark Complete' | Blocked by connectivity check, completion prevents | Yes |
| NEG-06 | Complete with Pending Syncs | P0 | Online, `isInspectionSynced` is false | 1. Make rapid changes<br>2. Immediately tap 'Mark Complete' | Completion blocked until local Drift DB fully syncs to server | Yes |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Rapid Toggling Status | P2 | Tap Pass -> Fail -> Pass rapidly. Ensure local DB stream (`watchItemsByAreaId`) handles debounce/race conditions and final state syncs correctly. |
| EDG-02 | Concurrent Background Syncs | P1 | Add comment, add image, change status simultaneously. Monitor network to ensure sync queue resolves all items without dropping data. |
| EDG-03 | Pagination Refresh Loss | P2 | Scroll to page 3 of Completed Tab. Pull-to-refresh. Ensure list resets gracefully without index out-of-bounds errors. |
| EDG-04 | Edit Completed Inspection | P1 | Open completed inspection -> Edit -> Change item status -> Re-complete. Verify backend `set-completion-date` updates correctly. |

---

## Permission Tests

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Module Access Blocked | P0 | User lacks `canRead` | 1. Attempt to open module | Blocked from viewing InspectionsPage | Yes |
| PERM-02 | Tool Icon Hidden | P1 | User lacks `canAddOrEdit` | 1. Open active inspection | 'Convert to Case' tool icon completely hidden on items | Yes |
| PERM-03 | Edit Action Hidden | P1 | User lacks `canAddOrEdit` | 1. Open Completed inspection | Edit action hidden in popup menu, cannot email report | Yes |
| PERM-04 | Delete Action Hidden | P1 | User lacks `canDelete` | 1. Open Completed inspection | Delete action completely hidden | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `POST /inspection/list/details` | Fetch Templates | 200 OK |
| `PUT /inspection/.../set-apartment` | Valid `apartmentId` | 200 OK |
| `POST /inspection/.../item/status` | Pass/Fail/NA string | 200 OK |
| `POST /inspection/.../item/file` | Valid <5MB image, MD5 hash | 200 OK |
| `POST /inspection/.../complete-inspection` | Finalize | 200 OK |
| `POST /inspection/.../convert/draft/item` | Item to case | 200 OK |
| `DELETE /inspection/.../item/{id}/image/{id}` | Delete valid image | 200 OK |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `InspectionTemplateCubit`| Fetch Initial | `initial` -> `loading` -> `loaded(templates)` |
| ST-02 | `InspectionDetailCubit` | Local DB Stream | `init()` -> Stream triggers `success(InspectionData, areas)` continuously as DB updates |
| ST-03 | `InspectionAreaCubit` | DB Stream Write | `upsertStatus()` -> Write to DAO -> Stream triggers `emit(items)` |
| ST-04 | `CompleteCubit` | Finalize | `initial` -> `completing(barrier modal)` -> `success(shows email dialog)` |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | True Offline Mode | P0 | 1. Airplane mode<br>2. Start inspection, add comments/images<br>3. Close App<br>4. Foreground & Go Online | UI remains responsive, local DB persists. Sync queue drains successfully to API when online. |
| MOB-02 | Image Capture Memory | P1 | 1. Use camera to capture 3 high-res images in sequence | App does not crash due to OOM (Out of Memory) during image compression/storage. |
| MOB-03 | Sync Indicator Accuracy | P2 | 1. Modify item offline<br>2. Go online | Observe Chat/Image icons transition from Yellow (Pending) to Green (Synced). |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | BOLA - Image Deletion | Attempt `DELETE /inspection/.../image/{imageId}` using an `imageId` belonging to a different building's inspection. Backend must reject. | P0 |
| SEC-02 | Edit Authorization | Send `PUT /inspection/.../set-completion-date` using a token for a user where `permission.inspections.canAddOrEdit == false`. Backend should reject. | P0 |
| SEC-03 | XSS in Comments | Inject `<script>alert(1)</script>` into an inspection comment. Verify the app renders it safely as text in `CompletedInspectionDetailsPage`. | P2 |

---

## Regression Suite (High Value)

1. **POS-01**: Start New Inspection
2. **POS-03**: Evaluate Item (Pass/Fail/NA)
3. **POS-05**: Add Item Image (critical multi-part sync test)
4. **POS-06**: Convert to Case (tests cross-module data linkage)
5. **POS-07**: Complete Inspection (verifies the entire sync barrier)
6. **NEG-01**: Start Private Inspection w/o Apartment (validates business logic)
7. **NEG-05/06**: Complete Offline / Pending Syncs (crucial for data integrity)
8. **MOB-01**: True Offline Mode (validates Drift DB architecture)

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (Start) | Fully Automatable | Low | P0 |
| POS-03 (Evaluate) | Fully Automatable | Medium (Scrollable areas) | P0 |
| POS-06 (Convert) | Fully Automatable | Low | P1 |
| POS-07 (Complete) | Fully Automatable | Medium | P0 |
| NEG-01 (Apartment Rule)| Fully Automatable | Low | P1 |
| NEG-05 (Complete Offline)| Partially Automatable | High (Network toggle required) | P0 |
| MOB-01 (Offline DB) | Partially Automatable | High | P0 |
| PERM-02/03 (Icons Hidden)| Fully Automatable | Low | P1 |
| POS-05 (Add Image) | Partially Automatable | High (Requires OS camera/gallery mock) | P1 |

---

## Coverage Summary

* **Positive Test Count:** 8
* **Negative Test Count:** 6
* **Edge Case Count:** 4
* **Permission Test Count:** 4
* **API Test Count:** 8
* **State Transition Count:** 4
* **Mobile Test Count:** 3
* **Security Test Count:** 3
* **Regression Test Count:** 8
* **Total Automation Candidates:** 23

**Gap Analysis & Additional Notes:**
- *Gap identified:* The dependency on `isInspectionSynced` before completion is a major architectural chokepoint. If a single background image upload fails silently, the inspection becomes permanently un-completable. Tests NEG-06 and MOB-01 are designed to aggressively test this state.
- *Gap identified:* `Convert to Case` cross-module interaction. Marking an item `hasToBeCompleted = true` spawns a draft case. The test suite (POS-06) needs to verify not just the UI interaction, but that the Draft Case successfully appears in the Cases module local DB.
- *Gap identified:* High risk of OOM on low-end devices during the 3-image capture sequence (MOB-02). Strict memory profiling is recommended during manual testing.
