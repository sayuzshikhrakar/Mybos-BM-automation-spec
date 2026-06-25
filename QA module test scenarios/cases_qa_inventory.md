# Cases Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | Create Case (Online) | P0 | Internet connected, `canAddOrEdit` | 1. Tap 'New Case'<br>2. Fill Subject<br>3. Tap Save | Case created, syncs immediately, appears in Open tab | Yes |
| POS-02 | Create Case (Offline -> Sync) | P0 | Offline mode, `canAddOrEdit` | 1. Turn off internet<br>2. Tap 'New Case'<br>3. Fill Subject and Save<br>4. Turn on internet | Case saves to Drafts initially. On reconnect, syncs and moves to Open tab | Partially |
| POS-03 | Asset Auto-population | P1 | Case Edit/Create | 1. Select 'Asset' Job Area<br>2. Select an Asset | Associated contractors and contacts auto-populate | Yes |
| POS-04 | Edit Case & Complete | P0 | `canAddOrEdit` | 1. Open Case<br>2. Tap Popup Menu -> 'Complete Case' | `isComplete` set to true, syncs to server, moves to Complete tab | Yes |
| POS-05 | Add/Delete Invoice | P1 | Case Details open | 1. Go to Attachments -> Add Invoice<br>2. Fill details and save<br>3. Delete invoice | Invoice created (contractor auto-added to case), then deleted | Yes |
| POS-06 | Add/Delete Quote | P1 | Case Details open | 1. Go to Attachments -> Add Quote<br>2. Fill details and save<br>3. Delete quote | Quote created (contractor auto-added to case), then deleted | Yes |
| POS-07 | Add Inventory | P2 | Case Details open | 1. Go to Attachments -> Add Inventory<br>2. Search and select item<br>3. Set quantity and save | Inventory linked to case | Yes |
| POS-08 | Send Case Email Wizard - Full Flow | P0 | Case has contacts | 1. Tap Send Email<br>2. Select 'Work Order' type (Next)<br>3. Select contact (Next)<br>4. Verify template loaded<br>5. Add CC/BCC<br>6. Tap Send | Email queued in local DB, immediate sync triggered, user returns to Dashboard | Yes |
| POS-09 | Search Cases (Debounced API + Local) | P1 | Cases exist | 1. Enter keyword in Open tab search bar | Local DB searched immediately, API called after 1s debounce if >= 2 chars | Yes |
| POS-10 | View Maintenance Messages | P2 | Case linked to maintenance request | 1. Open Case<br>2. Navigate to Messages tab | Chat interface loads maintenance request thread | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Create Case - Empty Subject | P0 | `canAddOrEdit` | 1. Tap 'New Case'<br>2. Leave Subject empty<br>3. Tap Save | Inline error "Subject is required", save blocked | Yes |
| NEG-02 | Send Email - No Type Selected | P1 | Email Wizard Step 1 | 1. Do not select email type<br>2. Tap Next | Error "Please select email type", navigation blocked | Yes |
| NEG-03 | Send Email - No Recipients Selected | P1 | Email Wizard Step 2 | 1. Deselect all contacts<br>2. Tap Next | Snackbar "Please select one user" | Yes |
| NEG-04 | Send Email - Missing Subject/Message | P1 | Email Wizard Step 3 | 1. Clear subject or message for a recipient<br>2. Tap Send | Error shown, send blocked | Yes |
| NEG-05 | Send Email - Invalid CC/BCC | P2 | Email Wizard Step 3 | 1. Tap CC/BCC toggle<br>2. Enter invalid email string | Error "Enter valid email", prevents adding to list | Yes |
| NEG-06 | Delete Comment - Not Author | P2 | Case has comments by other users | 1. Open Case -> Comments | Edit/Delete popup menu is completely hidden for comments not owned by `userId` | Yes |
| NEG-07 | Search - Sub-minimum Characters | P2 | Open tab | 1. Type 1 character in search | Local DB filters, but no server API call is triggered | Yes |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Quote Deletion clears Poll ID | P1 | Case has `pollId` and 1 active quote. Delete the quote. Verify the `pollId` on the case is set to null. |
| EDG-02 | Email Wizard Recipient Fallback | P2 | Go to Step 3 of Email Wizard. Force contact count to 0 (mock state). Verify wizard auto-navigates back to Step 2. |
| EDG-03 | Email Template Reloading | P2 | Change Email Type from Work Order to Summary in Step 1. Navigate to Step 3. Verify the subject/body template replaced the previous text. |
| EDG-04 | Empty Drafts Tab | P2 | Delete or sync all drafts. Verify Drafts tab correctly shows empty state (does not attempt server load). |
| EDG-05 | Status "Completed" String Match | P1 | Change case status via dropdown to a custom category named "Job Completed". Verify `isComplete=true` and `completionDateTime` are set. |
| EDG-06 | Offline Attachment Sync | P1 | Go offline. Add case, 3 photos, 1 document, 1 quote. Go online. Verify `CaseSyncHelper` pushes all files sequentially/successfully. |
| EDG-07 | List Tab Background Sync Update | P2 | Sit on Open tab. Mock a background sync update to local DB. Verify the 3-second periodic timer triggers a UI rebuild to show changes. |

---

## Permission Tests

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Total Module Access Denied | P0 | `canRead == false` | 1. Navigate to Cases from Dashboard | Module blocked, `NoPermissionWidget` displayed | Yes |
| PERM-02 | View Only - New Case Hidden | P0 | `canRead == true`, `canAddOrEdit == false` | 1. View Cases List | 'New Case' button is completely hidden | Yes |
| PERM-03 | View Only - Edit Mode Blocked | P0 | `canAddOrEdit == false` | 1. Open Case Details | Edit action hidden in popup menu. Details are read-only. | Yes |
| PERM-04 | Unrestricted Send Email / Star | P1 | `canAddOrEdit == false` | 1. Open Case Details | 'Send Email' and 'Star' actions remain available (no explicit permission gate) | Yes |

---

## API Tests

Due to the offline-first architecture, many APIs are called by `CaseSyncHelper` rather than direct UI triggers.

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `POST /cases/list` | Fetch summary cases | 200 OK |
| `GET /case/{id}` | Fetch full detail | 200 OK |
| `POST /case/new` | Create blank case | 200 OK, returns new `caseNumber` |
| `POST /case/{id}/update` | Update fields | 200 OK |
| `POST /cases/complete` | Complete array of IDs | 200 OK |
| `POST /case/{id}/add/photo` | Multipart photo upload | 200 OK |
| `POST /case/{id}/add/quote` | Multipart quote upload | 200 OK |
| `POST /case/{id}/contractor/add` | Sync contractor addition | 200 OK |
| `POST /cases/{id}/email` | Send email payload | 200 OK |
| `GET /settings/mail/template/case` | Fetch templates | 200 OK |
| `POST /inventory/search-all` | Fetch inventory list | 200 OK |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `CaseDatabaseCubit` | Initialize Case (Online) | `initial` -> `initializedCase(id, msg)` -> UI Routes to detail |
| ST-02 | `CaseDetailCubit` | Local DB Change | Stream triggers -> `success(enriched_data)` re-emitted |
| ST-03 | `CaseCurrentListCubit`| Search Query (Online) | `success` -> `loading(currentCases)` -> debounce 1s -> `success` |
| ST-04 | `CaseCurrentListCubit`| Background DB Update | Timer/Stream triggers -> `loadLocalCases()` -> `success` |
| ST-05 | `SendEmailCubit` | Send Email Process | `initial` -> `submitting` -> `CaseSyncHelper` triggered -> `success` -> Navigates to Dashboard |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Offline-First Robustness | P0 | 1. Turn on Airplane mode<br>2. Create case, add comments, add photos<br>3. Close App<br>4. Open App, turn off Airplane mode | App caches locally without errors. Background sync completes successfully upon restart/reconnect. |
| MOB-02 | Backgrounding during Email Wizard | P2 | 1. Go to Wizard Step 3<br>2. Background app<br>3. Foreground app | State (custom messages, selected attachments) is retained |
| MOB-03 | Low Memory - DB Write | P1 | 1. Simulate low memory/storage<br>2. Save case with large attachments | SQLite (Drift) handles exception gracefully, shows error, prevents data corruption |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | API Authorization | Attempt to call `POST /case/{id}/update` using a token for a user with `canAddOrEdit == false`. Backend should reject it. | P0 |
| SEC-02 | Data Exposure - Drafts | Ensure local Drafts are isolated to the specific logged-in user and cleared or inaccessible if a different user logs into the same device. | P1 |
| SEC-03 | Email CC/BCC Leakage | Verify that BCC recipients do not appear in the headers/UI of the emails received by other contacts. | P1 |
| SEC-04 | Comment Deletion Auth | Send a `DELETE /case/{id}/comments/{commentId}` API request where the comment belongs to a different `authorId`. Backend must reject. | P0 |

---

## Regression Suite (High Value)

1. **POS-01**: Create Case (Online)
2. **POS-02**: Create Case (Offline -> Sync) (verifies core architecture)
3. **POS-03**: Asset Auto-population
4. **POS-04**: Edit Case & Complete
5. **POS-08**: Send Case Email Wizard - Full Flow
6. **NEG-01**: Create Case - Empty Subject
7. **EDG-06**: Offline Attachment Sync
8. **PERM-01**: Total Module Access Denied
9. **PERM-02**: View Only - New Case Hidden

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (Create Online) | Fully Automatable | Medium | P0 |
| POS-02 (Offline Create) | Partially Automatable | High (Requires network toggling) | P0 |
| POS-04 (Edit & Complete) | Fully Automatable | Low | P0 |
| POS-08 (Email Wizard) | Fully Automatable | High (Multi-step, complex inputs) | P0 |
| POS-09 (Search Cases) | Fully Automatable | Medium (Wait for debounce) | P1 |
| NEG-01 (Empty Subject) | Fully Automatable | Low | P1 |
| NEG-02 (Email No Type) | Fully Automatable | Low | P1 |
| EDG-05 (Status Match) | Fully Automatable | Medium | P2 |
| PERM-01 (Access Denied) | Fully Automatable | Low | P0 |
| MOB-01 (Offline robustness)| Manual Only | High | P1 |

---

## Coverage Summary

* **Positive Test Count:** 10
* **Negative Test Count:** 7
* **Edge Case Count:** 7
* **Permission Test Count:** 4
* **API Test Count:** 12
* **State Transition Count:** 5
* **Mobile Test Count:** 3
* **Security Test Count:** 4
* **Regression Test Count:** 9
* **Total Automation Candidates:** 28

**Gap Analysis & Additional Notes:**
- *Gap identified:* The local-first SQLite architecture (Drift) introduces massive complexity regarding state synchronization. Tests POS-02, EDG-06, and MOB-01 were specifically designed to target the transitions between offline DB states and the background `CaseSyncHelper`.
- *Gap identified:* Auto-add contractor via invoice/quote. The analysis notes `POST /case/{id}/contractor/add` fires automatically when adding a quote/invoice. Added to POS-05/06 to verify this linkage works correctly in the UI post-sync.
- *Gap identified:* The email wizard relies heavily on templates fetched from the server. EDG-03 ensures that jumping back and forth in the wizard correctly re-applies these templates without corrupting user input.
