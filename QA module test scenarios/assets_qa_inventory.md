# Assets Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | Create Asset - Required Fields Only | P0 | User has `canAddOrEdit` permission | 1. Navigate to Assets List<br>2. Tap 'New'<br>3. Enter 'Name'<br>4. Select 'Category'<br>5. Tap 'Save' | Asset created successfully, returns to list | Yes |
| POS-02 | Create Asset - All Fields | P1 | User has `canAddOrEdit` permission | 1. Navigate to Assets List<br>2. Tap 'New'<br>3. Fill all fields (Name, Category, Date, Location, Serial, Asset Value, Estimated Life, End of Life, Barcode, Make, Model, Description)<br>4. Tap 'Save' | Asset created successfully with all data | Yes |
| POS-03 | Create Asset - With Attachments | P0 | User has `canAddOrEdit` permission | 1. Navigate to Assets List<br>2. Tap 'New'<br>3. Fill required fields<br>4. Go to Documents Tab and add file<br>5. Go to Warranty Tab, fill title, date, and add file<br>6. Go to Photos Tab and add image<br>7. Tap 'Save' | Asset created, attachments uploaded successfully | Yes |
| POS-04 | View Asset List | P0 | User logged in | 1. Navigate to Dashboard -> More -> Assets List | List of assets displayed, ordered by ID descending | Yes |
| POS-05 | Search Assets | P1 | Assets exist | 1. Navigate to Assets List<br>2. Enter keyword in search bar | List filters correctly based on keyword | Yes |
| POS-06 | Filter Assets | P1 | Assets exist | 1. Navigate to Assets List<br>2. Select category filter | List filters correctly based on category | Yes |
| POS-07 | View Asset Details | P0 | Asset exists | 1. Navigate to Assets List<br>2. Tap an asset<br>3. View General Tab | Asset details displayed correctly | Yes |
| POS-08 | Lazy Load Documents Tab | P1 | Asset exists with documents | 1. Navigate to Asset Details<br>2. Tap 'Documents' Tab | API called, documents load and display | Yes |
| POS-09 | Edit Asset - Modify Text Fields | P0 | Asset exists, User has `canAddOrEdit` | 1. Navigate to Asset Details<br>2. Tap 'Edit'<br>3. Modify Name and Location<br>4. Tap 'Save' | Asset updated successfully | Yes |
| POS-10 | Attach Document to Existing Asset | P1 | Asset exists, User has `canAddOrEdit` | 1. Navigate to Asset Edit/Details<br>2. Go to Documents Tab<br>3. Tap 'Upload Document'<br>4. Pick file | Document uploaded and list refreshed | Yes |
| POS-11 | Delete Document from Existing Asset | P1 | Asset has documents, User has `canAddOrEdit` | 1. Navigate to Asset Edit/Details<br>2. Go to Documents Tab<br>3. Select document<br>4. Tap 'Delete' | Document deleted successfully | Yes |
| POS-12 | Upload Warranty to Existing Asset | P1 | Asset exists, User has `canAddOrEdit` | 1. Navigate to Asset Edit/Details<br>2. Go to Warranty Tab<br>3. Tap 'Upload Warranty'<br>4. Enter Title, Expiry Date, select file<br>5. Save | Warranty uploaded successfully, loading dialog blocks UI during upload | Yes |
| POS-13 | Delete Warranty | P1 | Asset has warranty, User has `canAddOrEdit` | 1. Navigate to Asset Edit/Details<br>2. Go to Warranty Tab<br>3. Long-press warranty to select<br>4. Tap 'Delete' | Warranty deleted successfully | Yes |
| POS-14 | Asset Contractor Auto-populate Contacts | P2 | Asset has contractors with contacts | 1. Navigate to Add Asset<br>2. Select a Contractor | Primary contacts are auto-populated if contact list was empty | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Create Asset - Missing Name | P0 | User has `canAddOrEdit` | 1. Navigate to Add Asset<br>2. Leave 'Name' empty<br>3. Tap 'Save' | Save button disabled. Validation error: "Name is required" | Yes |
| NEG-02 | Create Asset - Missing Category | P0 | User has `canAddOrEdit` | 1. Navigate to Add Asset<br>2. Enter Name, leave Category empty<br>3. Tap 'Save' | Save button disabled. Validation error: "Please choose one category" | Yes |
| NEG-03 | Edit Asset - Missing Required Fields | P1 | Asset exists, User has `canAddOrEdit` | 1. Navigate to Edit Asset<br>2. Clear 'Name' field<br>3. Tap 'Save' (Save is active in edit mode)<br>4. Validate | Error message: "Name is required" | Yes |
| NEG-04 | Invalid Asset Value Format | P2 | User has `canAddOrEdit` | 1. Navigate to Add Asset<br>2. Enter text in 'Asset Value' | Validation fails (regex `^\d+\.?\d{0,2}`) | Yes |
| NEG-05 | Invalid End of Life Format | P2 | User has `canAddOrEdit` | 1. Navigate to Add Asset<br>2. Enter decimal in 'End of Life' | Validation fails (regex `[0-9]`) | Yes |
| NEG-06 | Upload Warranty - Missing Title | P1 | User has `canAddOrEdit` | 1. Navigate to Upload Warranty<br>2. Leave Title empty<br>3. Submit | Error: "Title is required" | Yes |
| NEG-07 | Create Asset - Contractor without Contact | P1 | User has `canAddOrEdit` | 1. Navigate to Add Asset<br>2. Select Contractor<br>3. Clear/remove contacts<br>4. Save | Error: "Please select one contact" | Yes |
| NEG-08 | Create Asset - Contact without Contractor | P1 | User has `canAddOrEdit` | 1. Navigate to Add Asset<br>2. Select Contact not belonging to selected Contractor<br>3. Save | Error: "Please select from one contractor" | Yes |
| NEG-09 | Attachment Upload Failure Post-Creation | P2 | User has `canAddOrEdit`, Network drops | 1. Navigate to Add Asset<br>2. Fill required + attach file<br>3. Tap 'Save'<br>4. Simulate network drop during attachment upload | Asset created successfully, attachments fail, user returned to list | Partially |
| NEG-10 | Parallel Delete Failure | P2 | Asset has multiple photos | 1. Go to Photos Tab<br>2. Select multiple photos<br>3. Tap 'Delete'<br>4. Simulate one API failure | Whole operation reports error via snackbar/UI | Partially |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Max Length Text Fields | P2 | Test Name, Location, Description with 1000+ characters. |
| EDG-02 | Unicode/Special Characters | P2 | Test Name and Description with emojis and special characters. |
| EDG-03 | Decimal Boundary Values | P2 | Test Asset Value with exactly 2 decimal places (valid) and 3 decimal places (invalid). |
| EDG-04 | Empty Dataset - Asset List | P1 | Verify UI when `/assets/list` returns 0 items. |
| EDG-05 | Empty Asset Value | P2 | Leave 'Asset Value' empty; verify it sends `0` to API, not null. |
| EDG-06 | Pagination Boundaries | P1 | Scroll past page 1 to trigger `fetchMore`. Verify duplicates do not appear. |
| EDG-07 | Concurrent Tab Switches | P2 | Rapidly switch between Documents, Warranty, and Photos tabs to ensure lazy loading doesn't race or crash. |
| EDG-08 | Edit Asset Warranty Bug Check | P1 | Verify BR-15: Ensure warranty tab loads correctly on edit mode (testing the known bug where index 1 vs 2 fails). |
| EDG-09 | Max 1 Warranty Rule | P1 | Verify UI behavior when trying to upload a second warranty to an asset that already has one. |

---

## Permission Tests

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | View Only - Hide 'New' Button | P0 | `permission.assets.canAddOrEdit == false` | 1. Navigate to Assets List | 'New' button is not visible | Yes |
| PERM-02 | View Only - Hide 'Edit' Button | P0 | `permission.assets.canAddOrEdit == false` | 1. Navigate to Asset Details | 'Edit' button is not visible | Yes |
| PERM-03 | View Only - Hide Upload/Delete | P0 | `permission.assets.canAddOrEdit == false` | 1. Navigate to Asset Details -> Documents/Photos Tab | Upload and Delete buttons/actions are not visible | Yes |
| PERM-04 | Authorized - Show Actions | P0 | `permission.assets.canAddOrEdit == true` | 1. Navigate to Asset Details | 'Edit', 'Upload', and 'Delete' actions are visible | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `POST /assets/list` | Success case with limit 20, page 1 | 200 OK, paginated list |
| `POST /assets/list` | Filter by `keyword` and `category_ids` | 200 OK, filtered list |
| `POST /assets/search/list` | Fetch non-paginated search list | 200 OK |
| `POST /assets/single` | Fetch valid asset ID | 200 OK, asset object |
| `POST /assets/single` | Fetch invalid asset ID | 400/404 Error |
| `POST /assets/create` | Valid payload | 200/201 OK, returns new `_id` |
| `POST /assets/create` | Missing name | 400 Validation Error |
| `POST /assets/update/{id}` | Valid payload | 200 OK |
| `POST /assets/{id}/attachment/{type}/save` | Upload valid file | 200 OK |
| `POST /assets/{id}/attachment/{type}/save` | File size exceeds limit | 413 Payload Too Large |
| `POST /assets/{id}/attachment/{type}/delete`| Delete valid file ID | 200 OK |
| `POST /assets/{id}/warranty/list` | Fetch warranty | 200 OK, returns single warranty object |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `AssetsBloc` | Initial load success | `initial` -> `loading` -> `success` |
| ST-02 | `AssetsBloc` | Initial load failure | `initial` -> `loading` -> `error` |
| ST-03 | `AssetsBloc` | Fetch more success | `success` -> `fetching` -> `fetchSuccess` |
| ST-04 | `AssetFormCubit` | Validation failure | `initial` -> `initial` (with errors set) |
| ST-05 | `AssetFormCubit` | Create success | `initial` -> `submitting` -> `success` |
| ST-06 | `AssetAttachmentCubit` | Batch upload success | `initial` -> `loading` -> `success` |
| ST-07 | `GetDocumentsCubit` | Selection toggle | `success` -> `success` (item selected state toggled) |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Backgrounding during upload | P1 | 1. Start photo upload<br>2. Send app to background<br>3. Bring to foreground | Upload should continue or fail gracefully, no app crash |
| MOB-02 | Offline mode - List | P1 | 1. Turn off wifi/data<br>2. Open Assets List | Graceful network error message shown |
| MOB-03 | Session Expiry | P0 | 1. Open Asset List<br>2. Invalidate token on backend<br>3. Pull to refresh | App redirects to login screen (via AuthInterceptor) |
| MOB-04 | Device Rotation | P2 | 1. Open Add Asset Form<br>2. Rotate device | UI adapts without losing entered form state |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | Broken Object Level Authorization (BOLA) | Attempt to edit an asset ID belonging to a different building using a valid session token. | P0 |
| SEC-02 | File Upload Type Validation | Attempt to upload an `.exe` or `.sh` file to the photo/document upload endpoints. | P0 |
| SEC-03 | XSS via Asset Name | Enter `<script>alert(1)</script>` in Asset Name and view in list/details. | P1 |
| SEC-04 | Unauthorized API Access | Call `/assets/create` with a token that belongs to a user where `permission.assets.canAddOrEdit == false`. Backend should reject it. | P0 |

---

## Regression Suite (High Value)

1. **POS-01**: Create Asset - Required Fields Only
2. **POS-03**: Create Asset - With Attachments
3. **POS-04**: View Asset List & Search
4. **POS-09**: Edit Asset - Modify Text Fields
5. **NEG-01**: Create Asset - Missing Name Validation
6. **NEG-07**: Contractor/Contact Cross-Validation
7. **PERM-01**: Verify 'New'/'Edit' buttons hidden for unauthorized users.
8. **SEC-04**: Verify backend enforces permissions on create/edit.

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (Create Basic) | Fully Automatable | Low | P0 |
| POS-03 (Create w/ Files) | Fully Automatable | High (Requires file push to device) | P0 |
| POS-04 (View List) | Fully Automatable | Low | P0 |
| POS-09 (Edit Asset) | Fully Automatable | Medium | P0 |
| NEG-01 (Validation) | Fully Automatable | Low | P1 |
| POS-10 (Upload Doc) | Fully Automatable | Medium | P1 |
| POS-13 (Long Press Delete) | Fully Automatable | Medium (TouchActions) | P1 |
| EDG-06 (Pagination) | Fully Automatable | Medium (Swipe gestures) | P1 |
| MOB-01 (Backgrounding) | Partially Automatable | High | P2 |
| MOB-02 (Offline) | Partially Automatable | High | P2 |

---

## Coverage Summary

* **Positive Test Count:** 14
* **Negative Test Count:** 10
* **Edge Case Count:** 9
* **Permission Test Count:** 4
* **API Test Count:** 13
* **State Transition Count:** 7
* **Mobile Test Count:** 4
* **Security Test Count:** 4
* **Regression Test Count:** 8
* **Total Automation Candidates:** 28

**Gap Analysis & Additional Notes:**
- *Gap identified:* The module analysis notes a specific bug (BR-15) regarding warranty tab lazy loading in edit mode. An explicit edge-case test (EDG-08) was generated to ensure this is tracked and verified when fixed.
- *Gap identified:* Bulk deletion handling. The analysis states `DeleteFileCubit` uses `Future.wait`. NEG-10 ensures the UI properly handles partial failures during this parallel operation.
- *Gap identified:* API Authorization mapping. While UI hides buttons (PERM-01/02), Security test (SEC-04) ensures the backend also enforces the `canAddOrEdit` permission to prevent direct API abuse.
