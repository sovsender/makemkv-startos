# MakeMKV

## Documentation

- [MakeMKV container documentation](https://github.com/jlesage/docker-makemkv/blob/master/README.md) — using the web interface and how optical drives appear in it

## What you get on StartOS

MakeMKV runs in your browser through the Web UI interface. StartOS gives it your server's optical drives, a USB or SATA drive alike, including a drive you plug in while it is running. Finished rips are written to the service's output folder.

## Getting set up

1. Connect a Blu-ray or DVD drive to your server and insert a disc.
2. Open the Web UI. Your drive is listed in MakeMKV once it is detected, usually within a few seconds.
3. Choose the drive, then the titles to rip, and start the rip. Progress shows in the same window.

## Using MakeMKV

### Getting your files

Ripped files are saved in the `output` folder. Open the file manager from the control panel at the top of the Web UI to download or delete them.

### Keys

MakeMKV needs a registration key. The service starts with MakeMKV's current free beta key, which MakeMKV rotates every few weeks; if ripping stops with an expired-key message, restart the service to pick up the new one.

## Limitations

Anyone who can open the Web UI can use your drives and see the ripped files. Keep it on addresses only you can reach.
