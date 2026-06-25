# Wiki Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | View Wiki Directory | P0 | Wiki items exist | 1. Navigate to Wiki module | List of wikis loads successfully | Yes |
| POS-02 | Filter by Folder | P1 | Folders and items exist | 1. Tap Folder filter<br>2. Select folder from bottom sheet | List refreshes showing only items in that folder | Yes |
| POS-03 | Search Wiki | P1 | Items exist | 1. Type keyword in search bar<br>2. Wait for debounce | List filters to match keyword | Yes |
| POS-04 | Create Wiki | P0 | `canAddOrEdit` is true | 1. Tap New Wiki<br>2. Select Folder, fill Subject & Desc<br>3. Save | API successful, popped to list, new item appears | Yes |
| POS-05 | Create Wiki with File | P1 | `canAddOrEdit` is true | 1. Open New Wiki form<br>2. Fill fields<br>3. Attach 1 file<br>4. Save | Multipart API successful, file attached | Partially |
| POS-06 | Inline Folder Creation | P0 | Create Wiki form open | 1. Tap create folder icon<br>2. Enter name, Save | Folder created via API and immediately selected in the dropdown | Yes |
| POS-07 | View Wiki Details | P0 | `canAddOrEdit` is true | 1. Tap a Wiki card | Detailed text and attachment UI loads | Yes |
| POS-08 | Edit Wiki & Delete Attachment | P1 | Wiki has attachment | 1. Open Detail -> Edit<br>2. Tap delete on attachment<br>3. Save | Attachment removed via API, UI updates | Yes |
| POS-09 | Delete Wiki | P1 | `canDelete` is true | 1. Open Detail -> Menu -> Delete<br>2. Confirm | API successful, item removed from list | Yes |
| POS-10 | View Image Attachment | P1 | Wiki has image file | 1. Open Detail<br>2. Tap image | Native image preview dialog opens | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Missing Required Fields | P0 | Create form open | 1. Leave Folder, Subject, or Desc empty<br>2. Attempt Save | Save blocked, validation errors on text fields | Yes |
| NEG-02 | Second File Attachment | P2 | Create form, file attached | 1. Attempt to attach a second file | UI prevents multiple selections (replaces or blocks) | Yes |
| NEG-03 | Inline Folder Empty Name | P1 | Inline folder prompt open | 1. Leave name empty<br>2. Attempt create | Action blocked by validation | Yes |
| NEG-04 | Download Missing File | P1 | Wiki Detail open | 1. Tap attachment link where backend file is missing | Handled gracefully, snackbar error shown | Yes |
| NEG-05 | File Size Exceeded | P2 | Attaching file | 1. Select >10MB file | File rejected, payload too large error | Partially |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Very Long Text Blocks | P2 | Create a wiki with a 10,000+ character description. Verify the detail page renders it without lagging or cutting off text. |
| EDG-02 | Category Scope Isolation | P1 | When selecting a Folder, verify that ONLY categories with `type=knowledge` are visible, and not maintenance or case categories. |
| EDG-03 | Special Characters in Folder | P2 | Create an inline folder with characters like `&%@#!`. Verify API accepts it and it renders correctly in the dropdown. |

---

## Permission Tests

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Add Button Hidden | P0 | User lacks `canAddOrEdit` | 1. View Wiki List | "New Wiki" FAB/AppBar action is completely hidden | Yes |
| PERM-02 | **Detail Page Blocked** | P0 | User lacks `canAddOrEdit` | 1. View Wiki List<br>2. Tap a Wiki card | User cannot view the content. A `NoPermissionWidget` is shown instead of the detail page. | Yes |
| PERM-03 | Edit Action Hidden | P1 | User lacks `canAddOrEdit` (if they somehow bypass list) | 1. View Detail Page | Edit menu item is hidden | Yes |
| PERM-04 | Delete Action Hidden | P1 | User lacks `canDelete` | 1. View Detail Page | Delete menu item is completely hidden | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `GET /categories/list/nested-tree` | `type=knowledge` param | 200 OK |
| `POST /wiki/list` | Default fetch | 200 OK |
| `GET /wiki/{id}` | Valid ID | 200 OK |
| `POST /wiki/create` | Valid form data, no file | 200 OK |
| `POST /wiki/create` | Valid form data + multipart file | 200 OK |
| `POST /categories/manage` | Valid new folder name | 200 OK |
| `POST /wiki/delete` | Valid Wiki ID | 200 OK |
| `POST /wiki/document/delete` | Valid Doc ID | 200 OK |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `WikiListItemCubit` | Initial Fetch | `initial` -> `loading` (Skeletonizer) -> `success` |
| ST-02 | `AddWikiItemCubit` | Form Submit | `initial` -> `loading` (spinner in AppBar) -> `success` -> pops screen |
| ST-03 | `WikiDetailCubit` | Fetch Details | `initial` -> `loading` -> `success(WikiDetail)` |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Document Download Service | P0 | 1. Open wiki with PDF<br>2. Tap file | Resolves secure URL, downloads to background, opens native OS viewer |
| MOB-02 | Image Preview Scaling | P2 | 1. Open wiki with Image<br>2. Tap image | Dialog opens, image scales to screen size, pinch-to-zoom functions |
| MOB-03 | Network Drop on Create | P1 | 1. Fill create form<br>2. Turn off WiFi<br>3. Save | UI blocks, shows network error, form data is preserved |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | BOLA - View Detail | Send `GET /wiki/{id}` using an ID belonging to a different building's wiki. Backend must reject. | P0 |
| SEC-02 | BOLA - Delete | Send `POST /wiki/delete` using an ID from another building. Backend must reject. | P0 |
| SEC-03 | File Parameter Tampering | Intercept the request to download a file and alter the `secureFileParameters` (e.g., expiry or signature). The S3/Backend should deny access. | P1 |

---

## Regression Suite (High Value)

1. **POS-01**: View Wiki Directory
2. **POS-04**: Create Wiki (Core write path)
3. **POS-06**: Inline Folder Creation (Critical cross-functional UI feature)
4. **POS-07**: View Wiki Details
5. **POS-09**: Delete Wiki
6. **NEG-01**: Missing Required Fields
7. **PERM-02**: Detail Page Blocked (Crucial security implementation specific to Wiki)
8. **MOB-01**: Document Download Service

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (View List) | Fully Automatable | Low | P0 |
| POS-04 (Create Wiki) | Fully Automatable | Medium | P0 |
| POS-06 (Inline Folder) | Fully Automatable | Medium | P0 |
| POS-07 (View Details) | Fully Automatable | Low | P0 |
| POS-09 (Delete) | Fully Automatable | Low | P0 |
| NEG-01 (Missing Fields)| Fully Automatable | Low | P1 |
| PERM-02 (Detail Blocked)| Fully Automatable | Low | P0 |
| MOB-01 (OS Download) | Partially Automatable| High (Leaves App Context) | P1 |

---

## Coverage Summary

* **Positive Test Count:** 10
* **Negative Test Count:** 5
* **Edge Case Count:** 3
* **Permission Test Count:** 4
* **API Test Count:** 9
* **State Transition Count:** 3
* **Mobile Test Count:** 3
* **Security Test Count:** 3
* **Regression Test Count:** 8
* **Total Automation Candidates:** 21

**Gap Analysis & Additional Notes:**
- *Gap identified:* Strict Detail Page Security (`PERM-02`). Unlike other modules where `canAddOrEdit` merely hides buttons (like "Edit" or "Convert to Case"), the Wiki module analysis explicitly states that lacking `canAddOrEdit` **blocks viewing the detail page entirely** (showing a `NoPermissionWidget`). This is a highly restrictive and unique permission implementation that must be rigidly tested.
- *Gap identified:* Inline Category Creation (`POS-06`). Testing this involves hitting the global `/categories/manage` endpoint from within a specific feature form. Automation must ensure that the newly created category immediately populates into the local dropdown state without requiring a hard refresh of the entire page.
