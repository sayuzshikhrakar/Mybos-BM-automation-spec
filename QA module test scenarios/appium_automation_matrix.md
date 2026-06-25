# Appium Automation Candidate Matrix

## PHASE 1 - CLASSIFY EVERY TEST (Sample of 100 tests across modules due to length constraints)
| Test ID | Module | Title | Test Type | Priority | Suitability | Recommendation |
|---|---|---|---|---|---|---|
| POS-01 | assets | Create Asset - Required Fields Only | Functional | P0 | Full Automation | Automate Now |
| POS-02 | assets | Create Asset - All Fields | Functional | P1 | Full Automation | Automate Now |
| POS-03 | assets | Create Asset - With Attachments | Functional | P0 | Partial Automation | Automate Later |
| POS-04 | assets | View Asset List | Functional | P0 | Full Automation | Automate Now |
| POS-05 | assets | Search Assets | Functional | P1 | Full Automation | Automate Now |
| POS-06 | assets | Filter Assets | Functional | P1 | Full Automation | Automate Now |
| POS-07 | assets | View Asset Details | Functional | P0 | Full Automation | Automate Now |
| POS-08 | assets | Lazy Load Documents Tab | Functional | P1 | Full Automation | Automate Now |
| POS-09 | assets | Edit Asset - Modify Text Fields | Functional | P0 | Full Automation | Automate Now |
| POS-10 | assets | Attach Document to Existing Asset | Functional | P1 | Partial Automation | Automate Later |
| POS-11 | assets | Delete Document from Existing Asset | Functional | P1 | Full Automation | Automate Now |
| POS-12 | assets | Upload Warranty to Existing Asset | Functional | P1 | Partial Automation | Automate Later |
| POS-13 | assets | Delete Warranty | Functional | P1 | Full Automation | Automate Now |
| POS-14 | assets | Asset Contractor Auto-populate Contacts | Functional | P2 | Full Automation | Automate Now |
| NEG-01 | assets | Create Asset - Missing Name | Validation | P0 | Full Automation | Automate Now |
| NEG-02 | assets | Create Asset - Missing Category | Validation | P0 | Full Automation | Automate Now |
| NEG-03 | assets | Edit Asset - Missing Required Fields | Validation | P1 | Full Automation | Automate Now |
| NEG-04 | assets | Invalid Asset Value Format | Validation | P2 | Full Automation | Automate Now |
| NEG-05 | assets | Invalid End of Life Format | Validation | P2 | Full Automation | Automate Now |
| NEG-06 | assets | Upload Warranty - Missing Title | Validation | P1 | Partial Automation | Automate Later |
| NEG-07 | assets | Create Asset - Contractor without Contact | Validation | P1 | Full Automation | Automate Now |
| NEG-08 | assets | Create Asset - Contact without Contractor | Validation | P1 | Full Automation | Automate Now |
| NEG-09 | assets | Attachment Upload Failure Post-Creation | Validation | P2 | Partial Automation | Automate Later |
| NEG-10 | assets | Parallel Delete Failure | Validation | P2 | Partial Automation | Automate Later |
| PERM-01 | assets | View Only - Hide 'New' Button | Permission | P0 | Full Automation | Automate Now |
| PERM-02 | assets | View Only - Hide 'Edit' Button | Permission | P0 | Full Automation | Automate Now |
| PERM-03 | assets | View Only - Hide Upload/Delete | Permission | P0 | Partial Automation | Automate Later |
| PERM-04 | assets | Authorized - Show Actions | Permission | P0 | Full Automation | Automate Now |
| MOB-01 | assets | Backgrounding during upload | Mobile Device | P1 | Partial Automation | Automate Later |
| MOB-02 | assets | Offline mode - List | Mobile Device | P1 | Partial Automation | Automate Later |
| MOB-03 | assets | Session Expiry | Mobile Device | P0 | Full Automation | Automate Now |
| MOB-04 | assets | Device Rotation | Mobile Device | P2 | Full Automation | Automate Now |
| POS-01 | breaches | Create Parking Breach | Functional | P0 | Full Automation | Automate Now |
| POS-02 | breaches | Create Common Area Breach | Functional | P0 | Full Automation | Automate Now |
| POS-03 | breaches | Search Breaches | Functional | P1 | Full Automation | Automate Now |
| POS-04 | breaches | Filter Sync Across Tabs | Functional | P1 | Partial Automation | Automate Later |
| POS-05 | breaches | Edit Breach (Compute Diff) | Functional | P0 | Full Automation | Automate Now |
| POS-06 | breaches | Change Breach Status | Functional | P1 | Full Automation | Automate Now |
| POS-07 | breaches | Delete Breach (Optimistic UI) | Functional | P0 | Full Automation | Automate Now |
| POS-08 | breaches | Add, Edit, and Delete Comment | Functional | P1 | Full Automation | Automate Now |
| POS-09 | breaches | Send Email with CC/BCC | Functional | P0 | Full Automation | Automate Now |
| POS-10 | breaches | Pre-fill Vehicle Data from Registration | Functional | P1 | Full Automation | Automate Now |
| POS-11 | breaches | Pre-fill Vehicle Data from Resident | Functional | P1 | Full Automation | Automate Now |
| POS-12 | breaches | Upload Photos and Document | Functional | P1 | Manual Only | Manual Regression |
| POS-13 | breaches | Create Breach from Visitor Parking | Functional | P0 | Full Automation | Automate Now |
| NEG-01 | breaches | Create Parking - Missing Required | Validation | P0 | Full Automation | Automate Now |
| NEG-02 | breaches | Create Common Area - Missing Resident | Validation | P0 | Full Automation | Automate Now |
| NEG-03 | breaches | Create Common Area - Missing Email | Validation | P1 | Full Automation | Automate Now |
| NEG-04 | breaches | Send Email FAB - Blocked | Validation | P1 | Full Automation | Automate Now |
| NEG-05 | breaches | Send Email - Invalid CC/BCC Format | Validation | P2 | Full Automation | Automate Now |
| NEG-06 | breaches | Delete Breach Failure (Rollback) | Validation | P1 | Partial Automation | Automate Later |
| NEG-07 | breaches | Delete Comment Failure (Rollback) | Validation | P2 | Partial Automation | Automate Later |
| NEG-08 | breaches | Edit Mode - Exceed Photo Limit | Validation | P2 | Manual Only | Manual Regression |
| NEG-09 | breaches | Parallel Photo Deletion Failure | Validation | P2 | Manual Only | Manual Regression |
| PERM-01 | breaches | Hide 'New Breach' Button | Permission | P0 | Full Automation | Automate Now |
| PERM-02 | breaches | Hide 'Edit' Menu Item | Permission | P0 | Full Automation | Automate Now |
| PERM-03 | breaches | Status Dropdown Read-Only | Permission | P0 | Full Automation | Automate Now |
| PERM-04 | breaches | Hide 'Delete' Menu Item | Permission | P0 | Full Automation | Automate Now |
| PERM-05 | breaches | Separate Edit and Delete Rights | Permission | P1 | Full Automation | Automate Now |
| MOB-01 | breaches | Offline mode - Action | Mobile Device | P1 | Partial Automation | Automate Later |
| MOB-02 | breaches | Backgrounding during Email | Mobile Device | P2 | Partial Automation | Automate Later |
| MOB-03 | breaches | Device Rotation | Mobile Device | P2 | Full Automation | Automate Now |
| POS-01 | calendars | View Calendar Month | Functional | P0 | Full Automation | Automate Now |
| POS-02 | calendars | Client-Side Date Filter | Functional | P0 | Full Automation | Automate Now |
| POS-03 | calendars | Swipe Month (Debounced Fetch) | Functional | P1 | Full Automation | Automate Now |
| POS-04 | calendars | Pull to Refresh | Functional | P1 | Full Automation | Automate Now |
| POS-05 | calendars | Maintenance Detail - Change Status | Functional | P0 | Full Automation | Automate Now |
| POS-06 | calendars | Maintenance Detail - Move Date | Functional | P1 | Full Automation | Automate Now |
| POS-07 | calendars | Maintenance Detail - Convert to Case | Functional | P1 | Full Automation | Automate Now |
| POS-08 | calendars | Maintenance Detail - Add/Delete Comment | Functional | P1 | Full Automation | Automate Now |
| POS-09 | calendars | Booking Detail - Change Status | Functional | P0 | Full Automation | Automate Now |
| POS-10 | calendars | Booking Detail - Add Comment | Functional | P1 | Full Automation | Automate Now |
| POS-11 | calendars | Reminder Detail - Move Date | Functional | P1 | Full Automation | Automate Now |
| NEG-01 | calendars | Add Empty Maintenance Comment | Validation | P1 | Full Automation | Automate Now |
| NEG-02 | calendars | Add Empty Booking/Reminder Comment | Validation | P1 | Full Automation | Automate Now |
| NEG-03 | calendars | Booking Change Status Failure | Validation | P1 | Partial Automation | Automate Later |
| NEG-04 | calendars | Move Maintenance Failure (No Rollback) | Validation | P2 | Partial Automation | Automate Later |
| NEG-05 | calendars | Change Booking Status to Same Value | Validation | P2 | Full Automation | Automate Now |
| PERM-01 | calendars | Maintenance Actions Hidden | Permission | P0 | Full Automation | Automate Now |
| PERM-02 | calendars | Booking Actions Hidden | Permission | P0 | Full Automation | Automate Now |
| PERM-03 | calendars | Reminder Actions Hidden | Permission | P0 | Full Automation | Automate Now |
| PERM-04 | calendars | Unrestricted Comments | Permission | P1 | Full Automation | Automate Now |
| MOB-01 | calendars | Network Switch during Month Load | Mobile Device | P1 | Full Automation | Automate Now |
| MOB-02 | calendars | Offline mode - Actions | Mobile Device | P1 | Partial Automation | Automate Later |
| MOB-03 | calendars | Backgrounding | Mobile Device | P2 | Partial Automation | Automate Later |
| POS-01 | cases | Create Case (Online) | Functional | P0 | Full Automation | Automate Now |
| POS-02 | cases | Create Case (Offline -> Sync) | Functional | P0 | Partial Automation | Automate Later |
| POS-03 | cases | Asset Auto-population | Functional | P1 | Full Automation | Automate Now |
| POS-04 | cases | Edit Case & Complete | Functional | P0 | Full Automation | Automate Now |
| POS-05 | cases | Add/Delete Invoice | Functional | P1 | Full Automation | Automate Now |
| POS-06 | cases | Add/Delete Quote | Functional | P1 | Full Automation | Automate Now |
| POS-07 | cases | Add Inventory | Functional | P2 | Full Automation | Automate Now |
| POS-08 | cases | Send Case Email Wizard - Full Flow | Functional | P0 | Full Automation | Automate Now |
| POS-09 | cases | Search Cases (Debounced API + Local) | Functional | P1 | Full Automation | Automate Now |
| POS-10 | cases | View Maintenance Messages | Functional | P2 | Full Automation | Automate Now |
| NEG-01 | cases | Create Case - Empty Subject | Validation | P0 | Full Automation | Automate Now |
| NEG-02 | cases | Send Email - No Type Selected | Validation | P1 | Full Automation | Automate Now |
| NEG-03 | cases | Send Email - No Recipients Selected | Validation | P1 | Full Automation | Automate Now |
| NEG-04 | cases | Send Email - Missing Subject/Message | Validation | P1 | Full Automation | Automate Now |
| NEG-05 | cases | Send Email - Invalid CC/BCC | Validation | P2 | Full Automation | Automate Now |
| NEG-06 | cases | Delete Comment - Not Author | Validation | P2 | Full Automation | Automate Now |
| NEG-07 | cases | Search - Sub-minimum Characters | Validation | P2 | Full Automation | Automate Now |
| PERM-01 | cases | Total Module Access Denied | Permission | P0 | Full Automation | Automate Now |
| PERM-02 | cases | View Only - New Case Hidden | Permission | P0 | Full Automation | Automate Now |
| PERM-03 | cases | View Only - Edit Mode Blocked | Permission | P0 | Full Automation | Automate Now |
| PERM-04 | cases | Unrestricted Send Email / Star | Permission | P1 | Full Automation | Automate Now |
| MOB-01 | cases | Offline-First Robustness | Mobile Device | P0 | Partial Automation | Automate Later |
| MOB-02 | cases | Backgrounding during Email Wizard | Mobile Device | P2 | Partial Automation | Automate Later |
| MOB-03 | cases | Low Memory - DB Write | Mobile Device | P1 | Full Automation | Automate Now |
| POS-01 | categories | Async Dropdown - Select Item | Functional | P0 | Partial Automation | Automate Later |
| POS-02 | categories | Async Dropdown - Auto-select First | Functional | P1 | Partial Automation | Automate Later |
| POS-03 | categories | Asset Bottom Sheet - Single Select | Functional | P0 | Full Automation | Automate Now |
| POS-04 | categories | Asset Bottom Sheet - Multi Select | Functional | P0 | Full Automation | Automate Now |
| POS-05 | categories | Asset Bottom Sheet - Subcategory Navigation | Functional | P0 | Full Automation | Automate Now |
| POS-06 | categories | Asset Bottom Sheet - Back Navigation | Functional | P1 | Full Automation | Automate Now |
| POS-07 | categories | Asset Bottom Sheet - Live Search | Functional | P1 | Full Automation | Automate Now |
| POS-08 | categories | Legacy Dropdown - Synthetic 'All' | Functional | P2 | Full Automation | Automate Now |
| POS-09 | categories | Cache Warming - Parallel Fetch | Functional | P1 | Partial Automation | Automate Later |
| POS-10 | categories | Deselect Single Asset Category | Functional | P1 | Full Automation | Automate Now |
| NEG-01 | categories | API Fetch Failure (Online, Cache Empty) | Validation | P1 | Full Automation | Automate Now |
| NEG-02 | categories | Pre-selected ID Not Found | Validation | P2 | Full Automation | Automate Now |
| NEG-03 | categories | Asset Bottom Sheet - Swipe Blocked | Validation | P2 | Full Automation | Automate Now |
| NEG-04 | categories | Bottom Sheet Dismiss Without Selection | Validation | P2 | Full Automation | Automate Now |
| NEG-05 | categories | Missing "Completed" Category Match | Validation | P1 | Partial Automation | Automate Later |
| PERM-01 | categories | Asset Picker Visibility | Permission | P1 | Full Automation | Automate Now |
| PERM-02 | categories | Case Type Visibility | Permission | P1 | Full Automation | Automate Now |
| MOB-01 | categories | Offline Cache Read | Mobile Device | P0 | Partial Automation | Automate Later |
| MOB-02 | categories | Cold Start Sync | Mobile Device | P1 | Partial Automation | Automate Later |
| MOB-03 | categories | Device Rotation - Bottom Sheet | Mobile Device | P2 | Full Automation | Automate Now |
| POS-01 | contractors | View Contacts List | Functional | P0 | Full Automation | Automate Now |
| POS-02 | contractors | View Companies List | Functional | P0 | Full Automation | Automate Now |
| POS-03 | contractors | View Expired Insurance List | Functional | P1 | Full Automation | Automate Now |
| POS-04 | contractors | Search Contacts/Companies | Functional | P0 | Full Automation | Automate Now |
| POS-05 | contractors | Contact Action - Call | Functional | P1 | Full Automation | Automate Now |
| POS-06 | contractors | Contact Action - Email | Functional | P1 | Full Automation | Automate Now |
| POS-07 | contractors | View Company Details - General | Functional | P0 | Full Automation | Automate Now |
| POS-08 | contractors | View Company Details - History | Functional | P1 | Full Automation | Automate Now |
| POS-09 | contractors | Dropdown Single Auto-Select | Functional | P0 | Full Automation | Automate Now |
| POS-10 | contractors | Dropdown Multi Auto-Select | Functional | P1 | Full Automation | Automate Now |
| NEG-01 | contractors | Call Missing Phone Number | Validation | P1 | Full Automation | Automate Now |
| NEG-02 | contractors | Email Missing Address | Validation | P1 | Full Automation | Automate Now |
| NEG-03 | contractors | API Failure - Companies Tab | Validation | P1 | Full Automation | Automate Now |
| NEG-04 | contractors | Dropdown Validation Error | Validation | P2 | Full Automation | Automate Now |
| PERM-01 | contractors | Global Read Access | Permission | P0 | Full Automation | Automate Now |
| PERM-02 | contractors | Read-Only Enforcement | Permission | P0 | Full Automation | Automate Now |
| MOB-01 | contractors | URL Launcher Integration | Mobile Device | P0 | Partial Automation | Automate Later |
| MOB-02 | contractors | Offline Cache Persistence | Mobile Device | P1 | Partial Automation | Automate Later |
| MOB-03 | contractors | Network Switch | Mobile Device | P2 | Full Automation | Automate Now |
| POS-01 | dashboard | View Dashboard & Weather | Functional | P0 | Full Automation | Automate Now |
| POS-02 | dashboard | Navigate to Module | Functional | P0 | Full Automation | Automate Now |
| ... | ... | *156 more tests processed...* | ... | ... | ... | ... |

## PHASE 2 - APPIUM FEASIBILITY REVIEW
| Test ID | Module | Blocker | Workaround | Final Recommendation |
|---|---|---|---|---|
| POS-03 | assets | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| POS-10 | assets | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| POS-12 | assets | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| NEG-06 | assets | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| NEG-09 | assets | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| PERM-03 | assets | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| MOB-01 | assets | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| MOB-01 | assets | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-02 | assets | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| POS-04 | breaches | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| POS-12 | breaches | Camera | Use Appium image injection or mock the camera API endpoint | Manual Regression |
| POS-12 | breaches | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Manual Regression |
| NEG-08 | breaches | Camera | Use Appium image injection or mock the camera API endpoint | Manual Regression |
| NEG-09 | breaches | Camera | Use Appium image injection or mock the camera API endpoint | Manual Regression |
| MOB-01 | breaches | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-02 | breaches | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-02 | calendars | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-03 | calendars | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| POS-02 | cases | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-01 | cases | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-02 | cases | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| POS-01 | categories | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| POS-02 | categories | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-01 | categories | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-02 | categories | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-01 | contractors | External Browser Launch | Assert the URL intent was fired, do not test the external app | Automate Later |
| MOB-02 | contractors | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| POS-06 | dashboard | Push Notifications | Use ADB commands to trigger push notifications | Automate Later |
| POS-07 | dashboard | Push Notifications | Use ADB commands to trigger push notifications | Automate Later |
| POS-08 | dashboard | Push Notifications | Use ADB commands to trigger push notifications | Automate Later |
| NEG-01 | dashboard | Push Notifications | Use ADB commands to trigger push notifications | Automate Later |
| NEG-04 | dashboard | Background Sync | Toggle device network via Appium network connection API | Manual Regression |
| MOB-01 | dashboard | Push Notifications | Use ADB commands to trigger push notifications | Automate Later |
| MOB-02 | dashboard | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-04 | dashboard | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| NEG-05 | inspection | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| NEG-06 | inspection | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-01 | inspection | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-02 | inspection | Camera | Use Appium image injection or mock the camera API endpoint | Manual Regression |
| MOB-03 | inspection | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| NEG-02 | keys | Signature Pad | Use W3C Actions to draw swipe coordinates, or mock the form submit | Automate Later |
| NEG-03 | keys | Signature Pad | Use W3C Actions to draw swipe coordinates, or mock the form submit | Automate Later |
| MOB-01 | keys | Signature Pad | Use W3C Actions to draw swipe coordinates, or mock the form submit | Automate Later |
| MOB-02 | keys | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| POS-05 | library | Native PDF Viewer | Validate intent launch, but do not assert inside the native PDF app | Automate Later |
| NEG-01 | library | Native PDF Viewer | Validate intent launch, but do not assert inside the native PDF app | Automate Later |
| MOB-02 | library | Native PDF Viewer | Validate intent launch, but do not assert inside the native PDF app | Automate Later |
| MOB-02 | library | Background Sync | Toggle device network via Appium network connection API | Automate Later |
| MOB-03 | maintenance_request | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| NEG-04 | profile | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| MOB-01 | profile | Camera | Use Appium image injection or mock the camera API endpoint | Manual Regression |
| MOB-02 | profile | External Browser Launch | Assert the URL intent was fired, do not test the external app | Automate Later |
| MOB-03 | profile | WebView | Switch Appium context to WEBVIEW_*, may require ChromeDriver | Automate Later |
| POS-07 | visitor_parking | OCR | Mock the OCR response API, or bypass camera step in automation | Manual Regression |
| NEG-02 | visitor_parking | OCR | Mock the OCR response API, or bypass camera step in automation | Manual Regression |
| MOB-01 | visitor_parking | Camera | Use Appium image injection or mock the camera API endpoint | Manual Regression |
| MOB-02 | visitor_parking | Camera | Use Appium image injection or mock the camera API endpoint | Manual Regression |
| MOB-03 | visitor_parking | OCR | Mock the OCR response API, or bypass camera step in automation | Manual Regression |
| POS-08 | wiki | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| POS-10 | wiki | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| NEG-02 | wiki | Native File Picker | Push file to device using Appium 'push_file' and interact with native OS file picker elements | Automate Later |
| NEG-04 | wiki | Native PDF Viewer | Validate intent launch, but do not assert inside the native PDF app | Automate Later |
| MOB-01 | wiki | Native PDF Viewer | Validate intent launch, but do not assert inside the native PDF app | Automate Later |

## PHASE 3 - AUTOMATION BACKLOG
### Wave 1 (Immediate Automation)
Focus: P0/P1, Full Automation, Functional/Permissions.
- **Assets**: POS-01, POS-02, POS-04, POS-05, POS-06, POS-07, POS-08, POS-09, POS-11, POS-13, NEG-01, NEG-02, NEG-03, NEG-07, NEG-08, PERM-01, PERM-02, PERM-04, MOB-03
- **Breaches**: POS-01, POS-02, POS-03, POS-05, POS-06, POS-07, POS-08, POS-09, POS-10, POS-11, POS-13, NEG-01, NEG-02, NEG-03, NEG-04, PERM-01, PERM-02, PERM-03, PERM-04, PERM-05
- **Calendars**: POS-01, POS-02, POS-03, POS-04, POS-05, POS-06, POS-07, POS-08, POS-09, POS-10, POS-11, NEG-01, NEG-02, PERM-01, PERM-02, PERM-03, PERM-04, MOB-01
- **Cases**: POS-01, POS-03, POS-04, POS-05, POS-06, POS-08, POS-09, NEG-01, NEG-02, NEG-03, NEG-04, PERM-01, PERM-02, PERM-03, PERM-04, MOB-03
- **Categories**: POS-03, POS-04, POS-05, POS-06, POS-07, POS-10, NEG-01, PERM-01, PERM-02
- **Contractors**: POS-01, POS-02, POS-03, POS-04, POS-05, POS-06, POS-07, POS-08, POS-09, POS-10, NEG-01, NEG-02, NEG-03, PERM-01, PERM-02
- **Dashboard**: POS-01, POS-02, POS-03, POS-04, POS-05, POS-10, PERM-01, PERM-02, PERM-03
- **Inspection**: POS-01, POS-02, POS-03, POS-04, POS-06, POS-07, POS-08, NEG-01, NEG-02, PERM-01, PERM-02, PERM-03, PERM-04
- **Keys**: POS-01, POS-02, POS-03, POS-05, NEG-01, PERM-01, PERM-02
- **Library**: POS-01, POS-02, POS-03, POS-04, NEG-04, PERM-01, MOB-01
- **Maintenance_Request**: POS-01, POS-02, POS-03, POS-04, POS-05, POS-06, POS-07, NEG-01, NEG-02, NEG-03, PERM-01, PERM-02, PERM-03, MOB-01
- **Profile**: POS-01, POS-02, POS-03, POS-05, POS-06, POS-07, NEG-01, NEG-02, NEG-03, PERM-01
- **Residents**: POS-01, POS-02, POS-03, POS-04, POS-05, NEG-01, NEG-03, PERM-01
- **Visitor_Parking**: POS-01, POS-02, POS-03, POS-04, POS-05, POS-06, POS-08, POS-09, NEG-01, NEG-03, PERM-01, PERM-02, PERM-03
- **Wiki**: POS-01, POS-02, POS-03, POS-04, POS-06, POS-07, POS-09, NEG-01, NEG-03, PERM-01, PERM-02, PERM-03, PERM-04, MOB-03
### Wave 2 (Secondary Automation)
Focus: Validations, State Transitions, Edge Cases without hard blockers.
- **Assets**: NEG-01, NEG-02, NEG-03, NEG-04, NEG-05, NEG-07, NEG-08
- **Breaches**: NEG-01, NEG-02, NEG-03, NEG-04, NEG-05
- **Calendars**: NEG-01, NEG-02, NEG-05
- **Cases**: NEG-01, NEG-02, NEG-03, NEG-04, NEG-05, NEG-06, NEG-07
- **Categories**: NEG-01, NEG-02, NEG-03, NEG-04
- **Contractors**: NEG-01, NEG-02, NEG-03, NEG-04
- **Inspection**: NEG-01, NEG-02
- **Keys**: NEG-01
- **Library**: NEG-02, NEG-03, NEG-04
- **Maintenance_Request**: NEG-01, NEG-02, NEG-03, NEG-04
- **Profile**: NEG-01, NEG-02, NEG-03
- **Residents**: NEG-01, NEG-02, NEG-03
- **Visitor_Parking**: NEG-01, NEG-03
- **Wiki**: NEG-01, NEG-03
### Wave 3 (Advanced Automation)
Focus: Partial Automation requiring Native OS interacton, file uploads, swipe gestures.
- **Assets**: POS-03, POS-10, POS-12, NEG-06, NEG-09, NEG-10, PERM-03, MOB-01, MOB-02
- **Breaches**: POS-04, NEG-06, NEG-07, MOB-01, MOB-02
- **Calendars**: NEG-03, NEG-04, MOB-02, MOB-03
- **Cases**: POS-02, MOB-01, MOB-02
- **Categories**: POS-01, POS-02, POS-09, NEG-05, MOB-01, MOB-02
- **Contractors**: MOB-01, MOB-02
- **Dashboard**: POS-06, POS-07, POS-08, NEG-01, NEG-02, NEG-03, MOB-01, MOB-02, MOB-04
- **Inspection**: POS-05, NEG-03, NEG-04, NEG-05, NEG-06, MOB-01, MOB-03
- **Keys**: POS-04, POS-06, NEG-02, NEG-03, NEG-04, MOB-01, MOB-02
- **Library**: POS-05, NEG-01, MOB-02
- **Maintenance_Request**: POS-08, NEG-05, MOB-03
- **Profile**: POS-04, NEG-04, NEG-05, MOB-02, MOB-03
- **Residents**: NEG-04
- **Visitor_Parking**: NEG-04
- **Wiki**: POS-05, POS-08, POS-10, NEG-02, NEG-04, NEG-05, MOB-01
### Manual Regression Suite
Focus: Camera, OCR, complex native handoffs, offline mode battery states.
- **Breaches**: POS-12, NEG-08, NEG-09
- **Dashboard**: NEG-04
- **Inspection**: MOB-02
- **Profile**: MOB-01
- **Visitor_Parking**: POS-07, NEG-02, MOB-01, MOB-02, MOB-03

## PHASE 4 - MODULE AUTOMATION SCORE
| Module | Total Tests | Full | Partial | Manual | Automation % (Full+Partial) |
|---|---|---|---|---|---|
| Assets | 32 | 23 | 9 | 0 | 100% |
| Calendars | 23 | 19 | 4 | 0 | 100% |
| Cases | 24 | 21 | 3 | 0 | 100% |
| Categories | 20 | 14 | 6 | 0 | 100% |
| Contractors | 19 | 17 | 2 | 0 | 100% |
| Keys | 15 | 8 | 7 | 0 | 100% |
| Library | 13 | 10 | 3 | 0 | 100% |
| Maintenance_Request | 19 | 16 | 3 | 0 | 100% |
| Residents | 12 | 11 | 1 | 0 | 100% |
| Wiki | 22 | 15 | 7 | 0 | 100% |
| Dashboard | 21 | 11 | 9 | 1 | 95% |
| Inspection | 21 | 13 | 7 | 1 | 95% |
| Profile | 16 | 10 | 5 | 1 | 93% |
| Breaches | 30 | 22 | 5 | 3 | 90% |
| Visitor_Parking | 19 | 13 | 1 | 5 | 73% |

## PHASE 5 - APPIUM IMPLEMENTATION ROADMAP

**Sprint 1: Core Foundation & Read-Only**
- Dashboard, Categories, Residents, Contractors
- *Rationale*: These modules have high 'Full Automation' scores, stable UIs, and are read-heavy. They build the authentication and navigation foundation.

**Sprint 2: Standard Workflows**
- Maintenance Request, Cases, Assets
- *Rationale*: Core operational funnel. Heavy CRUD operations but mostly standard form fields, dropdowns, and buttons. 

**Sprint 3: Advanced Media & State**
- Wiki, Breaches, Calendars, Profile
- *Rationale*: Introduces WebViews (HTML editor), native date pickers, and basic file uploads. Requires mature Appium helper utilities.

**Sprint 4: Complex Native Interactions**
- Keys, Visitor Parking, Inspection, Library
- *Rationale*: These are the hardest modules. Keys requires W3C signature gestures. Visitor Parking requires OCR mocking. Inspection requires offline DB toggle testing. Library requires native OS viewer intents.


## PHASE 6 - FINAL SUMMARY
1. **Total Test Cases Processed**: 306
2. **Fully Automatable Tests**: 223
3. **Partially Automatable Tests**: 72
4. **Manual Only Tests**: 11
5. **Estimated Automation Coverage %**: 96%

**Top Tests To Automate First (Sample):**
- [CASES] POS-01: Create Case (Online)
- [CASES] POS-04: Edit Case & Complete
- [CASES] POS-08: Send Case Email Wizard - Full Flow
- [CASES] NEG-01: Create Case - Empty Subject
- [CASES] PERM-01: Total Module Access Denied
- [CASES] PERM-02: View Only - New Case Hidden
- [CASES] PERM-03: View Only - Edit Mode Blocked
- [DASHBOARD] POS-01: View Dashboard & Weather
- [DASHBOARD] POS-02: Navigate to Module
- [DASHBOARD] POS-04: Open Quick Actions (FAB)
- [DASHBOARD] POS-05: Quick Action - Create Case
- [DASHBOARD] PERM-01: Dynamic Grid Generation
- [DASHBOARD] PERM-02: Dynamic FAB Actions
- [DASHBOARD] PERM-03: Global FAB Hidden

**Top Tests To Keep Manual (Sample):**
- [BREACHES] POS-12: Upload Photos and Document
- [DASHBOARD] NEG-04: Background Sync Network Failure
- [INSPECTION] MOB-02: Image Capture Memory
- [PROFILE] MOB-01: Camera Integration
- [VISITOR_PARKING] POS-07: Scan License Plate (OCR)
- [VISITOR_PARKING] MOB-01: Camera Hardware Integration