# Hytale Panel

Web management panel for Hytale dedicated servers. Create and manage multiple servers from a single dashboard.

## Quick Start (Full Project)

```bash
mkdir hytale && cd hytale
curl -O https://raw.githubusercontent.com/Ketbome/hytalepanel/main/docker-compose.yml
docker compose up -d
```

Open http://localhost:3000 (default login: `admin` / `admin`)

## Features

- **Multi-Server Management** - Create and manage multiple Hytale servers
- **Real-Time Console** - Live logs with command autocomplete (100+ commands)
- **File Browser** - Edit configs, upload mods, manage files (works offline)
- **Mod Integration** - Browse and install mods from Modtale & CurseForge
- **Automatic Backups** - Scheduled backups with retention policies
- **Server Updates** - One-click server file updates
- **Multi-Language** - English, Spanish, Ukrainian

## Environment Variables

| Variable             | Default       | Description                 |
| -------------------- | ------------- | --------------------------- |
| `PANEL_PORT`         | `3000`        | Panel HTTP port             |
| `PANEL_USER`         | `admin`       | Login username              |
| `PANEL_PASS`         | `admin`       | Login password              |
| `JWT_SECRET`         | (random)      | JWT signing key             |
| `HOST_DATA_PATH`     | `${PWD}/data` | Data storage path\*         |
| `MODTALE_API_KEY`    | -             | Modtale API key             |
| `CURSEFORGE_API_KEY` | -             | CurseForge API key          |
| `DISABLE_AUTH`       | `false`       | Disable auth (for SSO)      |
| `BASE_PATH`          | -             | URL prefix (e.g., `/panel`) |

> **Windows Users:** `${PWD}` doesn't work on Windows. Set `HOST_DATA_PATH` manually:
> `HOST_DATA_PATH=C:/Users/YourName/hytale/data`

## Volumes

| Path                     | Description                 |
| ------------------------ | --------------------------- |
| `/var/run/docker.sock`   | Docker socket (required)    |
| `/opt/hytale-panel/data` | Panel data and server files |

## docker-compose.yml

```yaml
services:
  panel:
    image: ketbom/hytale-panel:latest
    container_name: hytale-panel
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      PANEL_USER: admin
      PANEL_PASS: changeme
      HOST_DATA_PATH: ${HOST_DATA_PATH:-${PWD}/data}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ${HOST_DATA_PATH:-${PWD}/data}:/opt/hytale-panel/data
```

## Links

- [GitHub Repository](https://github.com/Ketbome/hytalepanel)
- [Documentation](https://hytalepanel.ketbome.com/)
- [Server Image](https://hub.docker.com/r/ketbom/hytale-server)
