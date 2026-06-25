# Profile Module - QA Test Inventory

## Positive Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| POS-01 | View General Profile | P0 | User logged in | 1. Navigate to Profile tab | Profile details (Name, Email, Mobile, Avatar) render correctly | Yes |
| POS-02 | Profile Actions (Mail/Call) | P1 | Profile loaded | 1. Tap Email address<br>2. Tap Mobile number | Default OS Mail App and Phone Dialer launch | Yes |
| POS-03 | Update General Profile | P0 | Edit Profile open | 1. Edit Name/Phone fields<br>2. Tap Save | API successful, user returned to Profile page which updates | Yes |
| POS-04 | Update Avatar | P1 | Edit Profile open | 1. Tap camera icon<br>2. Select image<br>3. Tap Save | Multipart API successful, new avatar appears globally | Partially |
| POS-05 | Delete Avatar | P1 | User has custom avatar | 1. Open Edit Profile<br>2. Tap 'Delete Photo' | Avatar is removed immediately, Profile refreshes with default placeholder | Yes |
| POS-06 | Update Site-Specific Mail Profile | P0 | Edit Profile open | 1. Switch to 'Site Specific Info'<br>2. Select building<br>3. Edit fields and HTML signature<br>4. Tap Save | Mail profile saves specifically for that building context | Yes |
| POS-07 | Change Password | P0 | User knows current password | 1. Tap 'Change Password'<br>2. Enter old, new, and confirm new<br>3. Save | Dialog closes, password successfully updated on backend | Yes |

---

## Negative Test Scenarios

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| NEG-01 | Password Mismatch | P0 | Change Password dialog open | 1. Enter valid Old Password<br>2. Enter mismatched New and Confirm passwords | 'Save' button is disabled, inline validation error shown | Yes |
| NEG-02 | Empty Required Fields | P1 | Edit Profile open | 1. Clear 'First Name' or 'Email'<br>2. Attempt to save | 'Save' button is disabled | Yes |
| NEG-03 | Missing Site Selection | P1 | Site Specific tab open | 1. Do not select a building<br>2. Attempt to edit/save | Form disabled or error shown requesting building selection | Yes |
| NEG-04 | Avatar Upload Exceeds Size | P2 | Selecting Avatar | 1. Select a 15MB image file | OS/App blocks selection or API returns payload too large error | Partially |
| NEG-05 | API Failure on Form Submit | P1 | Any form save | 1. Mock API failure during save | Error snackbar shown, form data retained, save button re-enabled | Partially |

---

## Edge Cases

| Test ID | Title | Priority | Description |
|---------|-------|----------|-------------|
| EDG-01 | Complex HTML Signature | P1 | Enter a highly complex HTML signature (bold, italics, lists, nested spans) in the HTML Editor. Save and reload to ensure the exact markup is preserved. |
| EDG-02 | Multi-Building Mail Profile Isolation | P0 | Update Mail Profile for Building A. Switch to Building B in the dropdown. Verify Building B loads its own distinct profile and does not bleed Building A's data. |
| EDG-03 | Very Long Name Truncation | P2 | Update profile with a 100-character name. Verify `ProfilePage` UI handles text wrapping/truncation gracefully without breaking layout. |

---

## Permission Tests

*Note: The Profile module does not use `BuildingFeaturePermissionResponse` gates, as users inherently own their profile. Tests verify this open access.*

| Test ID | Title | Priority | Preconditions | Steps | Expected Result | Automation Candidate |
|---------|-------|----------|---------------|-------|-----------------|----------------------|
| PERM-01 | Unrestricted Profile Access | P0 | User authenticated | 1. Open Profile module | Module is fully accessible to all roles (Admin, Manager, Resident) | Yes |

---

## API Tests

| Endpoint | Test Scenario | Expected Status |
|----------|---------------|-----------------|
| `GET /profile/user` | Valid request (`has_building: false`) | 200 OK |
| `POST /profile/update` | Valid form data, no image | 200 OK |
| `POST /profile/update` | Valid form data + multipart image | 200 OK |
| `POST /profile/delete/avatar` | Valid request | 200 OK |
| `POST /profile/get/mail/profile`| Valid `building_id` | 200 OK |
| `POST /profile/update/mail/profile`| Valid `building_id` and payload | 200 OK |
| `POST /profile/change/password` | Valid old and new passwords | 200 OK |
| `POST /profile/change/password` | Incorrect old password | 400/403 Error |
| **ALL** | Missing Bearer Token | 401 Unauthorized |

---

## State Transition Tests

| Test ID | Component | Scenario | Expected State Path |
|---------|-----------|----------|---------------------|
| ST-01 | `ProfileCubit` | Refresh Profile | `success` -> `loading` -> `success(updated model)` |
| ST-02 | `ChangePasswordCubit` | Password Validation | Form loaded -> User types mismatch -> `isValid: false` -> User fixes -> `isValid: true` -> Submit -> `loading` -> `success` |
| ST-03 | `DeleteAvatarCubit` | Delete Flow | `initial` -> User taps delete -> `loading` -> API Success -> `success` -> Triggers `ProfileCubit` reload |

---

## Mobile Specific Tests

| Test ID | Title | Priority | Steps | Expected Result |
|---------|-------|----------|-------|-----------------|
| MOB-01 | Camera Integration | P1 | 1. Tap Avatar Camera Icon<br>2. Take photo with camera | OS Camera handles capture and returns image to App successfully |
| MOB-02 | URL Launcher App Switching | P1 | 1. Tap Mobile number<br>2. OS switches to Dialer<br>3. Return to App | App handles background/foreground transition without losing state |
| MOB-03 | HTML Editor WebView Performance | P2 | 1. Open Site Specific Tab<br>2. Interact with HTML Editor | WebView-based editor remains performant and doesn't crash on older devices |

---

## Security Tests

| Test ID | Title | Description | Priority |
|---------|-------|-------------|----------|
| SEC-01 | Password Brute Force Prevention | Attempt multiple incorrect `Old Password` submissions rapidly to ensure backend rate-limits or locks the change endpoint. | P1 |
| SEC-02 | BOLA - Mail Profile | Send `POST /profile/update/mail/profile` with a `building_id` for a site the user is not authorized to access. Backend should reject. | P0 |
| SEC-03 | Avatar File Spoofing | Intercept `POST /profile/update` and change the avatar multipart file to an `.exe` or malicious payload. Backend must validate MIME type. | P1 |

---

## Regression Suite (High Value)

1. **POS-01**: View General Profile
2. **POS-03**: Update General Profile (Critical write path)
3. **POS-06**: Update Site-Specific Mail Profile (Critical configuration for other modules)
4. **POS-07**: Change Password (Core account lifecycle)
5. **NEG-01**: Password Mismatch (Verifies form logic)
6. **EDG-02**: Multi-Building Mail Profile Isolation (Verifies contextual data integrity)
7. **SEC-02**: BOLA - Mail Profile

---

## Appium Automation Mapping

| Scenario | Feasibility | Complexity | Priority |
|----------|-------------|------------|----------|
| POS-01 (View Profile) | Fully Automatable | Low | P0 |
| POS-03 (Update Profile)| Fully Automatable | Low | P0 |
| POS-05 (Delete Avatar) | Fully Automatable | Low | P1 |
| POS-06 (Update Mail) | Partially Automatable | High (HTML Editor may be difficult to automate via standard selectors) | P0 |
| POS-07 (Change Pass) | Fully Automatable | Low | P0 |
| NEG-01 (Pass Mismatch) | Fully Automatable | Low | P0 |
| EDG-02 (Building Isol.)| Fully Automatable | Medium | P0 |
| MOB-01 (Camera Integration)| Manual Only | High | P1 |
| MOB-02 (URL Launcher) | Partially Automatable | High (Requires OS-level assertions) | P1 |

---

## Coverage Summary

* **Positive Test Count:** 7
* **Negative Test Count:** 5
* **Edge Case Count:** 3
* **Permission Test Count:** 1
* **API Test Count:** 9
* **State Transition Count:** 3
* **Mobile Test Count:** 3
* **Security Test Count:** 3
* **Regression Test Count:** 7
* **Total Automation Candidates:** 19

**Gap Analysis & Additional Notes:**
- *Gap identified:* HTML Editor Automation (`POS-06`). The `html_editor_enhanced` package utilizes a WebView under the hood. Appium tests usually struggle with nested WebViews inside Flutter applications; entering text into this signature block will likely require specific WebView context switching or manual intervention.
- *Gap identified:* API header exclusion. The analysis explicitly notes that general profile APIs use `has_building: false` to skip injecting the building ID header. Automation should verify that general profile updates sync globally across all building contexts the user might switch to.
