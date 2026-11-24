<p align="center">
  <img src="icon.webp" alt="MakeMKV Logo" width="21%">
</p>

# MakeMKV on StartOS

> [!WARNING]
> **This package does not work on stock StartOS.** It needs optical drive access, a StartOS feature that is not in any Start9 release: the `opticalDrives` manifest flag, which exists only in a development build of StartOS (the `feat/optical-drives` branch of `sovsender/start-technologies`, [PR 1](https://github.com/sovsender/start-technologies/pull/1), not yet submitted to Start9). On a stock server MakeMKV starts but cannot see any drive. It also needs shared volumes, which arrived in StartOS 0.4.3. The package is built with a `start-cli` and SDK from that branch, so it cannot be built with the published tooling either. Do not install it on a server you do not use for testing this feature.

> Everything not listed in this document should behave the same as upstream MakeMKV.
> If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation section of
> `instructions.md` for links.

[MakeMKV](https://www.makemkv.com) converts the video on Blu-ray and DVD discs into MKV files. This package runs the [jlesage/makemkv](https://github.com/jlesage/docker-makemkv) container, which serves MakeMKV's window through a web browser.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The package runs the upstream `jlesage/makemkv` image unmodified, on x86_64 only. The image bundles s6-overlay, so its own init (`/init`) runs as PID 1 and the package does not replace the command. One subcontainer, `makemkv-sub`, runs everything.

The manifest sets `opticalDrives`, which makes StartOS expose every optical drive on the server inside the container as `/dev/srN` and `/dev/sgN`, and add or remove those nodes as drives are connected or removed. Other disks are never exposed. The container's user and group are set to `0` so the process can open the nodes, which belong to the container's root.

## Volume and Data Layout

Two package volumes hold everything the service keeps, and rips go to a volume the user shares with it.

| Volume    | Mount point | Contents                                                         |
| --------- | ----------- | ---------------------------------------------------------------- |
| `config`  | `/config`   | MakeMKV settings, the web interface's state and logs             |
| `startos` | none        | `store.json`, the choices made in the Rip Settings action        |

Ripped files are written to a volume the user shares with the service in StartOS (the `sharedVolumes` capability). The chosen volume is mounted read-write at `/rips` on every start by its stable grant id, and MakeMKV writes into the `MakeMKV` folder in it. The service has no private output volume. That volume belongs to the user, so it is not backed up and is not in the list above.

## File Models

`store.json` on the `startos` volume holds `destination` (a shared volume's id, or null), `minTitleMinutes` (default 15) and `language` (an ISO 639-2 code, default `eng`).

On every start the package sets four keys in MakeMKV's own `settings.conf` under `/config`: `app_DestinationDir`, `app_DestinationType`, `app_PreferredLanguage` and `dvd_MinimumTitleLength` (in seconds). It leaves every other line alone, the registration key included. The settings therefore always follow the Rip Settings action: changing the same options in MakeMKV's own preferences lasts only until the next restart. Other settings under `/config` survive restarts. The environment variables the package sets are `USER_ID` and `GROUP_ID` (`0`), `TZ`, `WEB_FILE_MANAGER` (`1`) and `WEB_FILE_MANAGER_ALLOWED_PATHS` (`/rips`).

## Dependencies

None.

## Network Access and Interfaces

One interface serves the web UI.

| Interface | Type | Port | Protocol | Purpose                                   |
| --------- | ---- | ---- | -------- | ----------------------------------------- |
| `ui`      | ui   | 5800 | HTTP     | MakeMKV's window and the web file manager |

The upstream VNC port is not exposed.

## Installation and First-Run Flow

There is no setup step. The image fetches MakeMKV's current free beta key on every start, so the container needs outbound internet access to register. An expired key is replaced by restarting the service.

## Actions

**Rip Settings** (`rip-settings`, any status). Chooses the writable shared volume rips are saved to, the minimum title length in minutes, and the preferred audio and subtitle language. Changing the volume restarts the service.

## Tasks

**Rip Settings**, critical, while no writable shared volume resolves: none is shared, the chosen one was revoked or made read-only, or several are shared and none was chosen. The service does not start until it is cleared, because rips would have nowhere to go. With exactly one writable shared volume and no choice made, that volume is used and no task is raised.

## Health Checks

One check, `primary`, is ready when port 5800 accepts connections. The image's init takes some seconds on a cold start, so a short "not ready" after start is normal; a check that stays failed means the container's init stopped, and its log says why.

## Backups and Restore

The `config` and `startos` volumes are copied wholesale. Shared volumes are never backed up: they are the user's data. After a restore on a server where the chosen volume is gone, the Rip Settings task asks for a new one.

## Limitations and Differences

1. The package grants every optical drive on the server, not a chosen one.
2. The process runs as root inside the container, because the drive nodes are owned by the container's root.
3. The web interface has no login. Anyone who can reach it can use the drives and read or download the ripped files.
4. Only x86_64 is built.
5. The automatic disc ripper, the web terminal and VNC are not enabled.

---

## Quick Reference for AI Consumers

```yaml
package_id: makemkv
image: jlesage/makemkv
architectures: [x86_64]
subcontainers: [makemkv-sub]
volumes:
  config: /config
  startos: null
file_models:
  - startos/store.json
startos_managed_env_vars:
  - USER_ID
  - GROUP_ID
  - TZ
  - WEB_FILE_MANAGER
  - WEB_FILE_MANAGER_ALLOWED_PATHS
shared_volumes: mounted at /rips (one, chosen in rip-settings)
dependencies: none
interfaces:
  ui: { type: ui, port: 5800 }
actions:
  - rip-settings
tasks:
  - rip-settings (critical, while no writable shared volume resolves)
health_checks:
  - primary
```
