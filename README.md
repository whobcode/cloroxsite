# Userscript: CloroxSite the CSP Vulnerability Mitigation

A userscript that dynamically mitigates vulnerabilities in a website’s Content-Security-Policy (CSP), such as removing `unsafe-inline` or blocking certain sources. It also logs all actions to the console for transparency.

## Features

### 1. Intercept and Modify the Content-Security-Policy (CSP)
- Remove or replace insecure directives (e.g., `unsafe-inline` or overly permissive sources like `*`).
  
### 2. Log All Changes
- Logs all modifications to the console for debugging and transparency.

## Explanation

### 1. Sanitizing CSP
- Removes `unsafe-inline` for both scripts and styles.
- Replaces `*` with `'self'` to avoid overly permissive policies.
- Logs all changes to the console for clarity.

### 2. Intercepting CSP
- Detects `<meta>` tags with `http-equiv="Content-Security-Policy"` and modifies their content to improve security.

### 3. Logging
- All changes made to the CSP are logged in the browser console for debugging and transparency.

### 4. Ensures Compatibility
- Avoids blocking necessary sources or functionality required for the userscript to operate correctly.

## How It Works
This script improves the security of websites by modifying CSP directives dynamically while ensuring that the userscript's functionality remains intact. All actions are logged to help developers understand what has been changed and why.
