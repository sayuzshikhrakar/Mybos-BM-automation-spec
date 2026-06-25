# Library Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | View Root Library | P0 | Documents/folders exist in root | 1. Navigate to Library module | List loads with documents listed first, followed by folders | Yes |
| POS-02 | Navigate into Sub-Folder | P0 | Folders exist | 1. Tap a folder | Pushes new page onto stack, App bar title changes to folder name, contents load | Yes |
| POS-03 | Navigate Back to Parent | P0 | Inside a sub-folder | 1. Tap back button in App bar | Pops stack, returns to parent folder preserving scroll state | Yes |
| POS-04 | Search Current Folder | P1 | Data exists in current folder | 1. Type keyword in search bar<br>2. Wait 600ms | List filters. API request contains current `parent_id` and keyword | Yes |
| POS-05 | Download/View Document | P0 | Document has valid S3 key | 1. Tap a document | Download service triggered, file fetched from S3, native viewer opens | Partially |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Download Missing File | P1 | Document record lacks S3 key/file | 1. Tap the document | Download blocked, snackbar "File not available for download" shown | Yes |
| NEG-02 | Search with Restricted Characters | P2 | Search bar focused | 1. Attempt to type `(` or `)` | Input formatter explicitly blocks character rendering | Yes |
| NEG-03 | Search No Results | P2 | In any folder | 1. Type non-existent keyword | "No Data Found" message displayed | Yes |
| NEG-04 | API Failure | P1 | Network error | 1. Open Library or folder | Error state/message shown, loading shimmer removed | Yes |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Deep Hierarchy Traversal | P1 | Navigate Folder A -> Folder B -> Folder C -> Folder D. Verify back button successfully unwinds the stack 4 times without memory leaks. |
| EDG-02 | Debounced Search Cancellation | P1 | Type rapidly in the search bar. Verify `debounceRestartable(600ms)` cancels older pending requests and only fires 1 API call. |
| EDG-03 | Empty Folder | P2 | Navigate into a sub-folder with 0 documents and 0 folders. Verify "No Data Found" renders correctly without crashing. |
| EDG-04 | Base64 S3 Key Decoding | P1 | Add a file with a complex S3 key containing special characters. Ensure the app decodes it correctly before passing to the `DownloadService`. |

---

## Permission Tests

*Note: The Library module lacks internal permission gates. Testing verifies the module is accessible as a whole if the user has dashboard access.*

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Read-Only UI Enforcement | P0 | User authenticated | 1. Explore Library module | Verify there are no "Upload", "Edit", or "Delete" actions visible in the UI | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `POST /library/list` | Root fetch (null `parent_id`, empty `keyword`) | 200 OK, returns documents/folders |
| `POST /library/list` | Sub-folder fetch (valid `parent_id`) | 200 OK |
| `POST /library/list` | Search fetch (valid `parent_id`, valid `keyword`) | 200 OK |
| `POST /library/list` | Invalid `parent_id` | 400/404 Error |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `LibraryBloc` | Fetch Data (Root) | `initial` -> `loading` (LibraryLoadingPage) -> `success` (LibraryListPage) |
| ST-02 | `LibraryBloc` | Search Event | `success` -> `loading` -> `success` |
| ST-03 | `LibraryBloc` | Fetch Error | `initial` -> `loading` -> `error` |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Native File Viewer Integration | P0 | 1. Tap a valid document (PDF/Image) | iOS/Android OS successfully intercepts the file path and opens the default OS viewer |
| MOB-02 | Backgrounding during Download | P1 | 1. Tap large file to download<br>2. Background app | Background download service continues or fails gracefully; OS viewer behaves predictably |
| MOB-03 | Device Rotation | P2 | 1. Open deep sub-folder<br>2. Rotate device | Navigation stack is preserved, list re-renders correctly |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | BOLA - Folder Access | Attempt to fetch `POST /library/list` using a `parent_id` that belongs to a different building. Backend must reject. | P0 |
| SEC-02 | S3 Key Exposure | Ensure the S3 keys returned in the API payload are properly signed/restricted and cannot be used to download arbitrary files via direct curl outside the app's auth context. | P0 |

---

## Regression Suite (High Value)

1. **POS-01**: View Root Library (ensures core API and merging logic work)
2. **POS-02/03**: Navigate into Sub-Folder & Back (verifies recursive routing stack)
3. **POS-04**: Search Current Folder
4. **POS-05**: Download/View Document (critical integration path)
5. **NEG-01**: Download Missing File (verifies error snackbar guard)
6. **EDG-02**: Debounced Search Cancellation
7. **MOB-01**: Native File Viewer Integration

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (View Root) | Fully Automatable | Low | P0 |
| POS-02 (Sub-folder) | Fully Automatable | Low | P0 |
| POS-03 (Navigate Back) | Fully Automatable | Low | P0 |
| POS-04 (Search) | Fully Automatable | Medium (Wait for debounce) | P1 |
| POS-05 (Download) | Partially Automatable | High (Leaves app context, requires OS-level assertions) | P0 |
| NEG-01 (Missing File) | Fully Automatable | Low | P1 |
| NEG-02 (Restricted Chars)| Fully Automatable | Low | P2 |
| EDG-01 (Deep Hierarchy)| Fully Automatable | Medium | P1 |

---

## Coverage Summary

* **Positive Test Count:** 5
* **Negative Test Count:** 4
* **Edge Case Count:** 4
* **Permission Test Count:** 1
* **API Test Count:** 5
* **State Transition Count:** 3
* **Mobile Test Count:** 3
* **Security Test Count:** 2
* **Regression Test Count:** 7
* **Total Automation Candidates:** 16

**Gap Analysis & Additional Notes:**
- *Gap identified:* S3 Integration (POS-05, MOB-01). This module relies entirely on a global `DownloadService` to actually render the files. Standard Appium tests will lose control/context when the native OS file viewer opens. Manual testing is required to verify the seamless handoff between the app and the OS across different file types (PDF, PNG, DOCX).
- *Gap identified:* The recursive routing architecture (`LibraryPage` pushing new `LibraryPage`s) could lead to memory bloat if a user navigates hundreds of folders deep (EDG-01).
- *Gap identified:* The API combines documents and folders, but the UI explicitly sorts them (Documents first). POS-01 inherently tests this sorting rule (BR-01).
