# Security Specification - The Living Name Tracker

## Data Invariants
1. A tracker document must belong to a single user (ownerId).
2. Users can only read and write their own tracker data.
3. Timestamps (updatedAt) must be server-generated.
4. Document IDs must be valid UIDs.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create a tracker with an `ownerId` that doesn't match the authenticated user.
2. **PII Leak**: Attempt to read another user's tracker document.
3. **Ghost Field**: Attempt to add an unauthorized field `isAdmin: true` to the tracker document.
4. **ID Poisoning**: Attempt to create a tracker with a junk-character string as the `userId`.
5. **State Shortcut**: (Not applicable here as it's a flexible tracker, but we'll ensure strict schema).
6. **Timestamp Spoofing**: Attempt to set `updatedAt` to a past or future date instead of `request.time`.
7. **Resource Poisoning**: Attempt to send a 1MB string into the `notes` field.
8. **Malicious Update**: Attempt to change the `ownerId` of an existing tracker.
9. **Unauthenticated Write**: Attempt to create a tracker without being signed in.
10. **Shadow Update**: Attempt to update a field not allowed by the action.
11. **Type Mismatch**: Attempt to send an object instead of a string for `notes`.
12. **Orphaned Document**: (Not applicable for this single-collection model).

## Test Runner (Conceptual)
All payloads above should return `PERMISSION_DENIED` by the rules.
