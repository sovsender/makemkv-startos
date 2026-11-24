# MakeMKV

## Documentation

- [MakeMKV container documentation](https://github.com/jlesage/docker-makemkv/blob/master/README.md) — using the web interface and how optical drives appear in it

## What you get on StartOS

MakeMKV runs in your browser through the Web UI interface. StartOS gives it your server's optical drives, a USB or SATA drive alike, including a drive you plug in while it is running. Finished rips are written to a volume you share with MakeMKV, so other services such as Radarr, Sonarr or Jellyfin can read them from the same place.

## Getting set up

1. In StartOS, share a volume with MakeMKV (a volume you added under System → Shared Volumes), with write access. MakeMKV does not start until you have, and shows a task that links to the next step.
2. Run the **Rip Settings** action. Choose the volume rips are saved to (if only one writable volume is shared, it is chosen for you), the shortest title worth ripping, and your preferred language.
3. Connect a Blu-ray or DVD drive to your server and insert a disc.
4. Open the Web UI. Your drive is listed in MakeMKV once it is detected, usually within a few seconds.
5. Choose the drive, then the titles to rip, and start the rip. Progress shows in the same window.

## Using MakeMKV

### Getting your files

Rips are saved in a `MakeMKV` folder on the volume you chose, in one folder per disc. Open the file manager from the control panel at the top of the Web UI to download or delete them, or read them from the same volume in another service.

### Choosing what is ripped

The **Rip Settings** action sets two things MakeMKV applies each time it starts:

- **Minimum title length.** Titles shorter than this are left out of the list, which removes most extras. The default is 15 minutes. Lower it for discs with short episodes.
- **Preferred language.** Audio and subtitle tracks in this language are selected, along with tracks that have no language. Tracks in other languages are not selected, and you can tick them in the Web UI.

Set these in the action, not in MakeMKV's own preferences: the action's values replace the preferences each time the service restarts.

### Keys

MakeMKV needs a registration key. The service starts with MakeMKV's current free beta key, which MakeMKV rotates every few weeks; if ripping stops with an expired-key message, restart the service to pick up the new one.

## Limitations

Anyone who can open the Web UI can use your drives and see the ripped files. Keep it on addresses only you can reach.
