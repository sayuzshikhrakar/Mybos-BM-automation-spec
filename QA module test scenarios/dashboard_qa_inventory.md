# Dashboard Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | View Dashboard & Weather | P0 | User logged in, building selected | 1. Open app | Dashboard loads, banner displays current weather for building location, grid items render | Yes |
| POS-02 | Navigate to Module | P0 | User has `canDisplay` permissions | 1. Tap a module icon (e.g., Cases) on the Home grid | Navigates to the selected module | Yes |
| POS-03 | More Page Navigation | P1 | User has multiple `canDisplay` permissions | 1. Tap 'More' on bottom navigation | Displays all available grid items not fitting on main screen | Yes |
| POS-04 | Open Quick Actions (FAB) | P0 | FAB is visible | 1. Tap the FAB | `BottomFabPage` overlay opens with quick actions | Yes |
| POS-05 | Quick Action - Create Case | P0 | FAB overlay open, `canAddOrEdit` for cases | 1. Tap "Create New Case" | Overlay pops, navigates to New Case screen | Yes |
| POS-06 | View Notifications | P1 | Unread notifications exist | 1. Tap Bell icon in App Bar | `NotificationsPage` loads paginated list, unread items have blue dot | Yes |
| POS-07 | Mark Single Notification Read | P1 | Unread notifications exist | 1. Open Notifications<br>2. Tap a specific notification | Modal opens, item marked read on server, removed from local list instantly | Yes |
| POS-08 | Mark All Notifications Read | P1 | Unread notifications exist | 1. Open Notifications<br>2. Tap "Mark all as read" | All items marked read on server, local list cleared | Yes |
| POS-09 | Submit Support Feedback | P2 | App Drawer open | 1. Tap 'MyBOS Support'<br>2. Fill feedback<br>3. Submit | Success message shown | Yes |
| POS-10 | Open Custom Drawer | P1 | Dashboard open | 1. Tap Drawer menu icon | Side menu opens, shows Building selector, Profile, Support, Logout | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Mark Notification Read Failure | P2 | Notifications list open | 1. Tap notification<br>2. Mock API failure | Item is not removed from list (if not optimistic), or error snackbar shown | Partially |
| NEG-02 | Mark All Read Failure | P2 | Notifications list open | 1. Tap "Mark all as read"<br>2. Mock API failure | List is not cleared, error snackbar shown | Partially |
| NEG-03 | Send Feedback Failure | P2 | Support Feedback open | 1. Submit feedback<br>2. Mock API failure | Error message shown, form remains open | Partially |
| NEG-04 | Background Sync Network Failure | P1 | App initialized | 1. Disable network<br>2. Wait for sync timer | Sync fails silently, does not crash app or block UI | Manual Only |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Pusher Maintenance Event | P1 | Have app open on notifications list. Trigger a Pusher `maintenance-request` event from backend. Verify list auto-refreshes (BR-02). |
| EDG-02 | Pusher Chat Event | P1 | Have app open. Send a new direct message to the user from another account. Verify the unread message badge automatically increments (BR-03). |
| EDG-03 | Dynamic Sync Rate Throttling | P2 | Navigate to Cases tab. Verify Inspection sync interval slows down. Navigate to Inspections tab. Verify Case sync slows down (BR-01). |
| EDG-04 | Message Subscription Pause | P1 | Verify `UnreadMessageCubit` subscription pauses when entering the Messaging module and resumes upon exit (BR-04). |
| EDG-05 | Pagination Bounds | P2 | Scroll to end of Notifications list. Verify `fetchMore` does not trigger redundant API calls if `_currentPage == _lastPage`. |

---

## Permission Tests

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Dynamic Grid Generation | P0 | User lacks `permission.inspections.canDisplay` | 1. View Home grid | "Inspections" tile is completely missing | Yes |
| PERM-02 | Dynamic FAB Actions | P0 | User lacks `permission.cases.canDisplay` | 1. Open FAB overlay | "Create New Case" button is completely missing | Yes |
| PERM-03 | Global FAB Hidden | P0 | User lacks all actionable `canDisplay` permissions | 1. View Dashboard | The main Floating Action Button is completely hidden | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `POST /maintenance/request/unread/comment/list` | Fetch notifications page 1 | 200 OK |
| `POST /maintenance/request/{id}/comment/comment/read`| Valid ID | 200 OK |
| `POST /maintenance/request/comment/clear/all` | Valid request | 200 OK |
| `POST /user/device/registration` | Valid FCM token payload | 200 OK |
| `POST /feedback/send` | Valid feedback payload | 200 OK |
| `POST /message/thread/unread-count` | Valid request | 200 OK |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `NotificationBloc` | Read Single Notification | `success(list[A,B])` -> `read(A)` API Success -> `success(list[B])` |
| ST-02 | `NotificationBloc` | Read All Notifications | `success(list[A,B])` -> `readAll()` API Success -> `success([])` |
| ST-03 | `UnreadMessageCubit` | Pusher Event | `state: 0` -> Pusher Event received -> `getCount()` -> `state: 1` |
| ST-04 | `SendFeedbackCubit` | Success Flow | `initial` -> `sendFeedback()` -> `isLoading=true` -> `successMessage="...", isLoading=false` |
| ST-05 | `SendFeedbackCubit` | Error Flow | `initial` -> `sendFeedback()` -> `isLoading=true` -> `errorMessage="...", isLoading=false` |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | FCM Token Registration | P0 | 1. Kill app<br>2. Launch App | App requests notification permissions, registers device token via API |
| MOB-02 | App Backgrounding (Sockets) | P1 | 1. Background app<br>2. Wait 5 mins<br>3. Foreground app | Pusher socket connections drop and successfully reconnect |
| MOB-03 | Device Rotation | P2 | 1. Open FAB overlay<br>2. Rotate device | Overlay scales correctly, no UI cutoff |
| MOB-04 | Weather API Offline | P2 | 1. Start app without network | Weather widget degrades gracefully without crashing dashboard |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | FCM Token Hijacking | Ensure the `/user/device/registration` endpoint associates the token securely with the authenticated session, preventing unauthenticated token registration. | P1 |
| SEC-02 | XSS via Notifications | Push a notification comment payload containing `<script>alert(1)</script>`. Verify it renders safely as text in `NotificationsPage`. | P1 |
| SEC-03 | Notification BOLA | Attempt to call `read(id)` on a notification ID belonging to a different user. Backend should reject. | P0 |

---

## Regression Suite (High Value)

1. **POS-01**: View Dashboard & Weather (covers initial wrapper logic)
2. **POS-02**: Navigate to Module (covers bottom nav and AutoTabsRouter)
3. **POS-04**: Open Quick Actions (FAB)
4. **POS-06**: View Notifications
5. **POS-07**: Mark Single Notification Read (verifies state clearing)
6. **PERM-01**: Dynamic Grid Generation (crucial for multi-role security)
7. **PERM-03**: Global FAB Hidden (verifies permission aggregate)
8. **EDG-02**: Pusher Chat Event (verifies real-time socket connections)

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (View Dashboard) | Fully Automatable | Low | P0 |
| POS-02 (Navigate Module) | Fully Automatable | Low | P0 |
| POS-04 (Open FAB) | Fully Automatable | Low | P0 |
| POS-06 (View Notifications)| Fully Automatable | Low | P1 |
| POS-07 (Mark Read) | Fully Automatable | Medium | P1 |
| POS-10 (Open Drawer) | Fully Automatable | Low | P1 |
| PERM-01 (Grid Hidden) | Fully Automatable | Medium (Requires specific user setup) | P0 |
| EDG-01/02 (Pusher Events)| Partially Automatable | High (Requires external API trigger) | P1 |
| MOB-01 (FCM Token) | Manual Only | High | P0 |

---

## Coverage Summary

* **Positive Test Count:** 10
* **Negative Test Count:** 4
* **Edge Case Count:** 5
* **Permission Test Count:** 3
* **API Test Count:** 7
* **State Transition Count:** 5
* **Mobile Test Count:** 4
* **Security Test Count:** 3
* **Regression Test Count:** 8
* **Total Automation Candidates:** 21

**Gap Analysis & Additional Notes:**
- *Gap identified:* The analysis details complex real-time behavior via Pusher (EDG-01, EDG-02). These are highly critical to the "live" feel of the dashboard but are notoriously difficult to automate in Appium without a dedicated backdoor API to trigger the events.
- *Gap identified:* Dynamic sync intervals (EDG-03). The logic that speeds up/slows down background synchronization based on the active tab is unique to the Dashboard Wrapper. Testing this requires deep profiling of network requests.
- *Gap identified:* FCM Registration (MOB-01). Device registration happens implicitly on wrapper load. It is vital to ensure this fires correctly across both iOS and Android to guarantee push delivery.
