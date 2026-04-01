# API Routes Deprecation Notice

`app/api/*` remains in this repository as a temporary compatibility layer.

- Runtime frontend traffic should now target the external Node backend (`mind_mirror_api`) via `NEXT_PUBLIC_API_BASE_URL`.
- New API capabilities should be implemented in `mind_mirror_api`, not in this folder.
- Remove these routes only after at least one stable release confirms there is no runtime dependency.
