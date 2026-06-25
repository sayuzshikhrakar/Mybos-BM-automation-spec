# Keys Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | View Building Keys | P0 | Keys exist | 1. Navigate to Keys -> Building Keys tab | List of building keys loads | Yes |
| POS-02 | View Private Keys | P0 | Private keys exist | 1. Navigate to Keys -> Private tab<br>2. Tap an apartment | Apartment keys load, separated into "With Management" and "Other Keys" | Yes |
| POS-03 | View Key History | P1 | Key has logs | 1. Tap a key from any list | `KeysHistoryPage` loads with paginated history logs | Yes |
| POS-04 | Sign Key Out (Manual) | P0 | Key is "In", `canAddOrEdit` is true | 1. Open Key History<br>2. Tap 'Sign Key Out'<br>3. Fill form manually<br>4. Draw signature<br>5. Submit | Form submits via API, user returned to Dashboard | Partially |
| POS-05 | Sign Key Out (Contractor) | P1 | Key is "In", `canAddOrEdit` is true | 1. Open Key History<br>2. Tap 'Sign Key Out'<br>3. Select Contractor from dropdown | 'Name' and 'Mobile' fields automatically populate from contractor profile | Yes |
| POS-06 | Sign Key In | P0 | Key is "Out", `canAddOrEdit` is true | 1. Open Key History<br>2. Tap 'Sign Key In'<br>3. Draw signature<br>4. Submit | Form submits via API, user returned to Dashboard | Partially |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Sign Out - Missing Fields | P1 | Sign Out form open | 1. Leave Company, Name, Mobile, or Reason empty<br>2. Attempt submit | Submit disabled or validation error blocks action | Yes |
| NEG-02 | Sign Out - Missing Signature | P0 | Sign Out form filled | 1. Do not draw on signature pad<br>2. Attempt submit | Action blocked, signature validation error | Yes |
| NEG-03 | Sign In - Missing Signature | P0 | Sign In form open | 1. Do not draw on signature pad<br>2. Attempt submit | Action blocked, signature validation error | Yes |
| NEG-04 | API Failure on Submit | P1 | Submitting Sign In/Out | 1. Mock API error during submit | Error snackbar/dialog shown, form data is retained, user stays on page | Partially |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Long Text in Fields | P2 | Enter extremely long strings in Company, Name, and Reason fields during Sign Out to ensure UI does not break and API accepts payload. |
| EDG-02 | Debounced Search | P2 | Type rapidly in the Keys list search bar. Verify API is only called once after the `debounceRestartable` period. |
| EDG-03 | Empty Key History | P2 | Open a newly added key with no sign in/out history. Ensure the UI renders an empty state gracefully without crashing. |
| EDG-04 | Contractor Missing Phone | P2 | In Sign Out form, select a Contractor known to have no mobile number. Verify the UI handles the null value gracefully (allows manual entry). |

---

## Permission Tests

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Read-Only Access (No Action Buttons) | P0 | User lacks `canAddOrEdit` | 1. Navigate to Keys<br>2. Open any Key's History page | The 'Sign Key Out' / 'Sign Key In' button is completely hidden. Logs are visible. | Yes |
| PERM-02 | Action Access Granted | P0 | User has `canAddOrEdit` | 1. Open Key History | The primary action button is visible and tappable. | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `POST /keys/building-keys` | Fetch valid list | 200 OK |
| `POST /keys/apartments` | Fetch valid list | 200 OK |
| `POST /keys/apartment/keys-list`| Valid `apartment_id` | 200 OK |
| `POST /keys/single/log` | Valid key ID | 200 OK, paginated logs |
| `POST /contractors/list` | Fetch active contractors | 200 OK |
| `POST /keys/key-out` | Valid multipart payload (image signature) | 200 OK |
| `POST /keys/key-in` | Valid multipart payload (image signature) | 200 OK |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `ApartmentKeysBloc` | Fetch Data | `initial` -> `loading` -> `success(list)` |
| ST-02 | `SignKeyOutFormCubit` | Valid Submission | `initial` -> field validation -> `isUpdating=true` -> API Success -> `success=true` |
| ST-03 | `SignKeyInBloc` | Error Submission | `initial` -> `submitting` -> API Error -> `error(message)` |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Signature Pad Gesture | P0 | 1. Swipe across the `HandSignature` widget | The widget captures the path smoothly without scrolling the parent view |
| MOB-02 | Backgrounding during Form | P1 | 1. Fill out Sign Out form<br>2. Draw signature<br>3. Background app<br>4. Foreground app | Form data and drawn signature are completely retained |
| MOB-03 | Device Rotation on Pad | P2 | 1. Open Sign Out form<br>2. Rotate device to landscape | Signature pad scales correctly, form remains usable |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | State Spoofing Bypass | Exploit API: Attempt to call `POST /keys/key-out` for a key whose backend state is already "Out". Backend must enforce strict state logic and reject. | P0 |
| SEC-02 | Unauthorized Action | Attempt to call `POST /keys/key-in` using a token for a user where `permission.keys.canAddOrEdit == false`. Backend should reject. | P0 |
| SEC-03 | Signature File Validation | Send `POST /keys/key-out` with a malicious file (e.g., `.exe` or executable script renamed to `.png`) in the multipart signature field. Backend should reject or sanitize. | P1 |

---

## Regression Suite (High Value)

1. **POS-01**: View Building Keys
2. **POS-02**: View Private Keys
3. **POS-04**: Sign Key Out (Manual) (Critical write path)
4. **POS-05**: Sign Key Out (Contractor) (Verifies cross-module data linkage)
5. **POS-06**: Sign Key In (Critical write path)
6. **NEG-02**: Sign Out - Missing Signature (Verifies primary legal/audit constraint)
7. **PERM-01**: Read-Only Access (Verifies security gate)
8. **MOB-01**: Signature Pad Gesture (Verifies core native interaction)

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (View Building)| Fully Automatable | Low | P0 |
| POS-02 (View Private) | Fully Automatable | Low | P0 |
| POS-04 (Sign Out) | Partially Automatable | High (Requires gesture automation for signature pad) | P0 |
| POS-05 (Contractor auto)| Partially Automatable| High (Signature pad required to complete) | P1 |
| POS-06 (Sign In) | Partially Automatable | High (Signature pad required to complete) | P0 |
| NEG-01 (Missing Fields) | Fully Automatable | Low | P1 |
| NEG-02 (Missing Sig) | Fully Automatable | Low (Just tap submit without swiping) | P0 |
| PERM-01 (Action Hidden)| Fully Automatable | Low | P0 |

---

## Coverage Summary

* **Positive Test Count:** 6
* **Negative Test Count:** 4
* **Edge Case Count:** 4
* **Permission Test Count:** 2
* **API Test Count:** 8
* **State Transition Count:** 3
* **Mobile Test Count:** 3
* **Security Test Count:** 3
* **Regression Test Count:** 8
* **Total Automation Candidates:** 19

**Gap Analysis & Additional Notes:**
- *Gap identified:* The heavy reliance on the `HandSignature` widget makes the core write-paths (Sign In / Sign Out) difficult to fully automate in standard Appium without specific coordinate-based swipe gestures. Automation scripts will need a reliable gesture helper to draw a valid line on the canvas.
- *Gap identified:* Strict state routing. The app dictates the action ("Sign In" vs "Sign Out") based entirely on the current status of the key. Automation scripts cannot blindly execute "Sign In"; they must be written conditionally based on the key's state, or test data must be strictly controlled.
- *Gap identified:* Contractor Module dependency. POS-05 relies on data from the Contractors module API. If Contractors is down or empty, this keys feature degrades.
