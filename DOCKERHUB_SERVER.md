# Hytale Dedicated Server

Docker image for running a Hytale dedicated server with optimized JVM settings.

## Quick Start (Standalone Server)

```bash
docker run -d \
  --name hytale-server \
  -p 5520:5520/udp \
  -v ./server:/opt/hytale \
  -e JAVA_XMX=8G \
  ketbom/hytale-server:latest
```

> **Note:** You need to provide `HytaleServer.jar` and `Assets.zip` in the `./server/` directory.

## With Web Panel (Recommended)

For a complete management solution with web UI, use the full project:

```bash
mkdir hytale && cd hytale
curl -O https://raw.githubusercontent.com/Ketbome/hytalepanel/main/docker-compose.yml
docker compose up -d
```

Then open http://localhost:3000 to access the panel.

**Features:**

- Web dashboard for multiple servers
- File browser and editor
- Mod management (Modtale & CurseForge)
- Real-time console with command autocomplete
- Automatic backups
- Server configuration UI

## Environment Variables

| Variable            | Default | Description                |
| ------------------- | ------- | -------------------------- |
| `JAVA_XMS`          | `4G`    | Minimum RAM                |
| `JAVA_XMX`          | `8G`    | Maximum RAM                |
| `BIND_PORT`         | `5520`  | Game port (UDP)            |
| `AUTO_DOWNLOAD`     | `true`  | Auto-download server files |
| `SERVER_EXTRA_ARGS` | -       | Extra server arguments     |
| `TZ`                | `UTC`   | Timezone                   |

## RAM Guidelines

| Players | Recommended |
| ------- | ----------- |
| 1-10    | 4G          |
| 10-20   | 6G          |
| 20-50   | 8G          |
| 50+     | 12G+        |

## Volumes

| Path                   | Description           |
| ---------------------- | --------------------- |
| `/opt/hytale`          | Server data directory |
| `/opt/hytale/universe` | World data            |
| `/opt/hytale/mods`     | Server mods           |
| `/opt/hytale/logs`     | Server logs           |

## Links

- [GitHub Repository](https://github.com/Ketbome/hytalepanel)
- [Documentation](https://hytalepanel.ketbome.com/)
- [Web Panel Image](https://hub.docker.com/r/ketbom/hytale-panel)
