# Visitor Parking Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | View Bookings List | P0 | Bookings exist | 1. Navigate to Visitor Parking | Default list loads paginated bookings | Yes |
| POS-02 | Filter by Date Range | P1 | Bookings exist | 1. Open Filter Bottom Sheet<br>2. Select Date Range<br>3. Apply | List refreshes with filtered results | Yes |
| POS-03 | View Booking Details | P0 | Booking list loaded | 1. Tap a booking card | Navigates to `VisitorParkingDetailPage` | Yes |
| POS-04 | Approve Booking | P0 | Booking is Pending, `canAddOrEdit` | 1. Open booking<br>2. Change Status to Approved | API updates status, UI refreshes | Yes |
| POS-05 | Decline/Cancel Booking | P0 | Booking active, `canAddOrEdit` | 1. Open booking<br>2. Change Status to Declined<br>3. Enter valid reason<br>4. Save | API updates status, UI refreshes | Yes |
| POS-06 | Delete Booking | P1 | Booking exists, `canAddOrEdit` | 1. Open booking<br>2. Tap Menu -> Delete<br>3. Confirm | API deletes booking, user popped back to list | Yes |
| POS-07 | Scan License Plate (OCR) | P1 | Camera access granted | 1. Tap Scan FAB<br>2. Point at plate & Scan | `ResultModal` appears with extracted text | Partially |
| POS-08 | Scan Manual Entry | P0 | Camera page open | 1. Tap Manual Entry<br>2. Type plate number | Navigates to filtered list searching for that plate | Yes |
| POS-09 | Create Breach from Booking | P0 | Booking open, `canAddOrEdit` | 1. Tap "Create Breach" FAB | Routes to Add Breach page, vehicle/host details pre-filled | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Missing Decline Reason | P0 | Decline dialog open | 1. Leave reason empty<br>2. Attempt to save | Save blocked by validation | Yes |
| NEG-02 | OCR Failure/Blurry Image | P2 | Scanner open | 1. Scan blank wall or blurry image | Handles error gracefully, prompts manual entry or retry | Manual Only |
| NEG-03 | Search Invalid Plate | P1 | Scanning/Manual Entry | 1. Enter plate not in system | Resulting list displays empty state "No results" | Yes |
| NEG-04 | API Failure on Update | P1 | Changing status | 1. Select Approved<br>2. Mock API failure | Error snackbar, dropdown reverts to original state | Partially |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Correcting OCR Result | P1 | Scan a plate. In the `ResultModal`, tap Edit and completely change the string before hitting Confirm. Verify the final search query uses the modified string. |
| EDG-02 | Cross-Module Navigation Depth | P1 | Open Booking -> Create Breach -> Complete Breach. Verify the back stack correctly returns the user to the Parking details without memory leaks. |
| EDG-03 | Rapid Status Toggling | P2 | Rapidly change status from Approved -> Pending -> Declined before APIs complete. Verify UI locks or handles race conditions without crashing. |

---

## Permission Tests

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Scan Button Hidden | P0 | User lacks `canAddOrEdit` | 1. View Parking List | The FAB to launch the scanner is completely hidden | Yes |
| PERM-02 | Status Dropdown Disabled | P0 | User lacks `canAddOrEdit` | 1. View Booking Details | Status Dropdown is disabled/hidden, module is read-only | Yes |
| PERM-03 | Actions Hidden | P1 | User lacks `canAddOrEdit` | 1. View Booking Details | "Delete" menu item and "Create Breach" FAB are hidden | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `GET /community/parking/booking/paginated-list` | Valid params | 200 OK |
| `GET /community/parking/booking/{id}` | Valid ID | 200 OK |
| `PUT /community/parking/booking/approve` | Valid request | 200 OK |
| `PUT /community/parking/booking/decline` | Valid reason in payload | 200 OK |
| `PUT /community/parking/booking/decline` | Missing reason | 400 Bad Request |
| `PUT /community/parking/booking/delete` | Valid array of IDs | 200 OK |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `VisitorParkingListCubit` | Apply Filter | `success` -> `loading` -> `success(filtered list)` |
| ST-02 | `ParkingRegistrationCubit`| Camera Scan | `initial` -> `processing(overlay active)` -> `success(shows modal)` |
| ST-03 | `UpdateParkingBookingCubit`| Status Update | `initial` -> `updating` -> `success` -> Triggers `ListCubit.refresh()` and `DetailCubit.getBookingDetail()` |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Camera Hardware Integration | P0 | 1. Open Scan page | Native camera feed initializes correctly |
| MOB-02 | Camera Torch & Zoom | P2 | 1. Open Scan page<br>2. Toggle Torch<br>3. Pinch to zoom | Flashlight toggles, zoom levels adjust smoothly |
| MOB-03 | App Kill during OCR | P2 | 1. Tap Scan<br>2. Immediately kill app | Ensure no background OCR processing zombies remain |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | BOLA - Delete Booking | Send `PUT /community/parking/booking/delete` using a booking ID from a different building. Backend must reject. | P0 |
| SEC-02 | Unauthorized Modification | Attempt `PUT /community/parking/booking/approve` using a token for a role with `permission.parking.canAddOrEdit == false`. Backend should reject. | P0 |

---

## Regression Suite (High Value)

1. **POS-01**: View Bookings List
2. **POS-04**: Approve Booking
3. **POS-05**: Decline/Cancel Booking (Verifies mandatory reason BR)
4. **POS-08**: Scan Manual Entry (Critical fallback for OCR)
5. **POS-09**: Create Breach from Booking (Crucial cross-module enforcement link)
6. **NEG-01**: Missing Decline Reason
7. **PERM-01/02**: Actions/Scan Hidden (Verifies security gates)

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (View List) | Fully Automatable | Low | P0 |
| POS-04 (Approve) | Fully Automatable | Low | P0 |
| POS-05 (Decline) | Fully Automatable | Medium | P0 |
| POS-07 (Camera OCR) | Manual Only | High (Appium cannot test physical camera feeds) | P1 |
| POS-08 (Manual Scan) | Fully Automatable | Low | P0 |
| POS-09 (Create Breach)| Fully Automatable | Medium (Validates cross-module form population) | P0 |
| NEG-01 (Missing Reason)| Fully Automatable | Low | P0 |
| PERM-01 (Scan Hidden) | Fully Automatable | Low | P1 |

---

## Coverage Summary

* **Positive Test Count:** 9
* **Negative Test Count:** 4
* **Edge Case Count:** 3
* **Permission Test Count:** 3
* **API Test Count:** 7
* **State Transition Count:** 3
* **Mobile Test Count:** 3
* **Security Test Count:** 2
* **Regression Test Count:** 7
* **Total Automation Candidates:** 20

**Gap Analysis & Additional Notes:**
- *Gap identified:* Physical Camera Integration (`POS-07`, `MOB-01`, `MOB-02`). The enforcement workflow relies heavily on the `camera` plugin and OCR capabilities. This is physically impossible to test thoroughly in Appium without highly specialized mock camera driver setups. Manual testing in varied lighting conditions is strictly required.
- *Gap identified:* Cross-Module Coupling (`POS-09`). Transitioning from Parking -> Breaches requires the data payload to safely cross boundaries. Automation must assert that the resulting Breach form correctly pre-populates the exact Make/Model/Registration and Host details from the originating Parking Booking.
