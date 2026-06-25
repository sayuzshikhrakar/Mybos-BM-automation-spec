# Maintenance Request Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | View Pending List | P0 | Pending requests exist | 1. Navigate to Maintenance Requests | Default Pending tab loads paginated list of requests | Yes |
| POS-02 | View Approved/Rejected | P1 | Requests exist | 1. Tap Approved or Rejected tab | Independent list loads | Yes |
| POS-03 | Single Approve & Route to Case | P0 | Single Pending request, `canAddOrEdit` | 1. Open request<br>2. Change Status to Approved<br>3. Confirm | API succeeds, prompt offers routing to new Work Order (Case) | Yes |
| POS-04 | Single Reject with Reason | P0 | Single Pending request, `canAddOrEdit` | 1. Open request<br>2. Change Status to Rejected<br>3. Fill reason dialog, Save | API succeeds, request moves to Rejected tab | Yes |
| POS-05 | Bulk Approve | P0 | Multiple Pending requests | 1. Long press item / Select All<br>2. Tap Approve in bottom bar<br>3. Confirm | API updates all IDs, items move to Approved tab | Yes |
| POS-06 | Bulk Reject with Reason | P0 | Multiple Pending requests | 1. Long press item / Select All<br>2. Tap Reject in bottom bar<br>3. Fill reason dialog, Save | API updates all IDs, items move to Rejected tab | Yes |
| POS-07 | Redirect to Existing Case | P1 | Request is Approved and has `caseId` | 1. Tap Approved request in list | App bypasses Maintenance Request details and redirects directly to Case details | Yes |
| POS-08 | Send Message (Text + Image) | P1 | Request open, `canAddOrEdit` | 1. Go to Messages tab<br>2. Enter text, attach image<br>3. Send | Message uploads, list refreshes showing new message | Partially |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Reject Missing Reason (Single) | P0 | `TextFieldDialog` open for Reject | 1. Leave reason empty<br>2. Attempt save | Save blocked/validation error | Yes |
| NEG-02 | Reject Missing Reason (Bulk) | P0 | Bulk Reject triggered | 1. Leave reason empty<br>2. Attempt save | Save blocked/validation error | Yes |
| NEG-03 | Send Empty Message | P1 | Messages tab open | 1. Ensure no text and no attachment<br>2. Tap Send | Send button disabled or action blocked | Yes |
| NEG-04 | Bulk Action on Invalid Tab | P2 | On Approved or Rejected tab | 1. Attempt to long-press to enter bulk mode | Action ignored, bulk mode only allowed on Pending tab (BR-03) | Yes |
| NEG-05 | Status Change API Failure | P1 | Changing status | 1. Change status<br>2. Mock API error | Error snackbar, status dropdown reverts, no redirection | Partially |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Bulk Selection Limits | P2 | In Pending tab, select 100+ requests using "Select All" across multiple pages. Attempt bulk approve to ensure payload size limits and backend timeouts are handled gracefully. |
| EDG-02 | Independent Tab Pagination | P2 | Scroll to page 3 on Pending tab. Switch to Approved tab. Verify Approved tab starts at page 1. Switch back to Pending, verify page 3 state is retained (BR-04). |
| EDG-03 | Long Rejection Reason | P2 | Enter a 1000+ character string containing unicode/emojis in the Reject Reason dialog. Verify UI truncation and API acceptance. |

---

## Permission Tests

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Status Dropdown Disabled | P0 | User lacks `canAddOrEdit` | 1. Open request details | Status Dropdown is visible but explicitly `enabled: false` (Greyed out) | Yes |
| PERM-02 | Message Bar Hidden | P0 | User lacks `canAddOrEdit` | 1. Open request -> Messages tab | History visible, but `MessageTextBar` is completely hidden (`SizedBox.shrink()`) | Yes |
| PERM-03 | Bulk Actions Blocked | P1 | User lacks `canAddOrEdit` | 1. Go to Pending tab | "Select All" button and long-press selection mode are disabled/hidden | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `POST /maintenance/request/list` | Fetch valid tab (Pending) | 200 OK |
| `POST /maintenance/request/single` | Fetch valid ID | 200 OK |
| `POST /maintenance/request/change/status`| Single ID, Status=Approved | 200 OK |
| `POST /maintenance/request/change/status`| Array of IDs, Status=Rejected, Valid reason | 200 OK |
| `POST /maintenance/request/change/status`| Status=Rejected, Missing reason | 400 Bad Request |
| `POST /maintenance/request/{id}/comment/create` | Valid text + multipart image | 200 OK |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `MaintenanceRequestCubit` | Bulk Select Mode | `success(selectMode=false)` -> Long press -> `success(selectMode=true, selected=[id])` |
| ST-02 | `MaintenanceRequestBulkActionCubit` | Bulk API Call | `initial` -> `approveLoading` -> `success(message, approvedIds)` |
| ST-03 | `MaintenanceRequestDetailCubit` | Status Update Watcher | `success(isStatusUpdating=true)` -> API returns -> `success(isStatusUpdating=false)` -> UI triggers Work Order dialog |
| ST-04 | `MaintenanceRequestMessageSendCubit`| Message Upload | `initial` -> `loading` -> `success` -> Parent UI triggers comment list reload |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Keyboard in Messages | P1 | 1. Open Messages tab<br>2. Tap input bar | Keyboard opens, list scrolls up, input bar remains pinned above keyboard |
| MOB-02 | Bulk Action Bottom Bar Animation | P2 | 1. Toggle bulk mode on/off rapidly | Sliding bottom bar animates smoothly without rendering glitches |
| MOB-03 | Large Image Upload Memory | P1 | 1. Attach 10MB+ raw photo to message | App handles compression/upload without Out-Of-Memory crash |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | Authorization Bypass (Status) | Send `POST /maintenance/request/change/status` API call using an auth token where `permission.community.canAddOrEdit == false`. Backend should reject. | P0 |
| SEC-02 | BOLA - Message Thread | Attempt to fetch `POST /maintenance/request/{id}/comment/list` for a request ID belonging to a different building's community. Backend should reject. | P0 |
| SEC-03 | XSS in Message Text | Send `<script>alert(1)</script>` in the chat. Verify flutter UI renders it as plain text in the MessageListView. | P1 |

---

## Regression Suite (High Value)

1. **POS-01**: View Pending List
2. **POS-03**: Single Approve & Route to Case (Critical funnel test)
3. **POS-04**: Single Reject with Reason (Verifies mandatory constraint)
4. **POS-05**: Bulk Approve (Tests multi-ID payload and UI state reset)
5. **POS-07**: Redirect to Existing Case (Verifies BR-01 routing logic)
6. **NEG-01/02**: Reject Missing Reason (Verifies BR-02 UI constraint)
7. **PERM-01**: Status Dropdown Disabled (Verifies core security gate)
8. **PERM-02**: Message Bar Hidden

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (View Pending) | Fully Automatable | Low | P0 |
| POS-03 (Single Approve)| Fully Automatable | Medium | P0 |
| POS-04 (Single Reject) | Fully Automatable | Medium (Requires handling text dialog) | P0 |
| POS-05 (Bulk Approve) | Fully Automatable | Medium (Requires long-press gesture) | P0 |
| POS-07 (Case Redirect) | Fully Automatable | Low | P1 |
| NEG-01 (Missing Reason)| Fully Automatable | Low | P1 |
| NEG-04 (Bulk Blocked) | Fully Automatable | Low | P1 |
| PERM-01 (Dropdown Dis.)| Fully Automatable | Low | P0 |
| POS-08 (Send Message) | Partially Automatable| High (If using camera attachment) | P1 |

---

## Coverage Summary

* **Positive Test Count:** 8
* **Negative Test Count:** 5
* **Edge Case Count:** 3
* **Permission Test Count:** 3
* **API Test Count:** 7
* **State Transition Count:** 4
* **Mobile Test Count:** 3
* **Security Test Count:** 3
* **Regression Test Count:** 8
* **Total Automation Candidates:** 21

**Gap Analysis & Additional Notes:**
- *Gap identified:* Cross-Module Routing (`BR-01`). Maintenance Requests act as a funnel into the Cases (Work Orders) module. POS-03 and POS-07 specifically target this coupling, ensuring that once a request is approved, the UX smoothly transitions the user into the case context, which is critical for operations.
- *Gap identified:* State watching logic. The UI triggers the post-approval "Go to Work Order" prompt by listening to `isStatusUpdating` transitioning from `true` to `false` in `ST-03`. This is a delicate async UI pattern; testing API latency (NEG-05) ensures it handles failures without popping up the success prompt.
