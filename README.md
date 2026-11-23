<p align="center">
  <img src="icon.webp" alt="MakeMKV Logo" width="21%">
</p>

# MakeMKV on StartOS

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

Two volumes hold everything the service keeps.

| Volume   | Mount point | Contents                                                             |
| -------- | ----------- | -------------------------------------------------------------------- |
| `config` | `/config`   | MakeMKV settings, the web interface's state and logs                 |
| `output` | `/output`   | Ripped MKV files, which the web file manager can download and delete |

Volumes the user shares with the service in StartOS (the `sharedVolumes` capability) are mounted at `/shared/<grant id>` on every start, read-write or read-only as granted, and an unavailable one is skipped with a log line rather than failing the start. They are the user's data, not the package's, so they are not backed up and are not part of the volume list above.

## File Models

None. The package writes no configuration files. Settings reach the image as environment variables that the package sets on every start: `USER_ID` and `GROUP_ID` (`0`), `TZ`, `WEB_FILE_MANAGER` (`1`) and `WEB_FILE_MANAGER_ALLOWED_PATHS` (`/output`, plus each mounted shared volume). A hand edit of MakeMKV's own settings under `/config` survives restarts.

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

None.

## Tasks

None.

## Health Checks

One check, `primary`, is ready when port 5800 accepts connections. The image's init takes some seconds on a cold start, so a short "not ready" after start is normal; a check that stays failed means the container's init stopped, and its log says why.

## Backups and Restore

The `config` volume is copied wholesale. The `output` volume is deliberately excluded: rips are large, and a restored instance starts with an empty output folder. Nothing else is needed to make a restored instance usable.

## Limitations and Differences

1. The package grants every optical drive on the server, not a chosen one.
2. The process runs as root inside the container, because the drive nodes are owned by the container's root.
3. The web interface has no login. Anyone who can reach it can use the drives and download the output files.
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
  output: /output
file_models: []
startos_managed_env_vars:
  - USER_ID
  - GROUP_ID
  - TZ
  - WEB_FILE_MANAGER
  - WEB_FILE_MANAGER_ALLOWED_PATHS
dependencies: none
interfaces:
  ui: { type: ui, port: 5800 }
actions: []
tasks: []
health_checks:
  - primary
```
