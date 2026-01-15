# Hytale Dedicated Server - Docker

Docker image for Hytale dedicated server with web panel.

## Quick Start

### Step 1: Download docker-compose

```bash
mkdir hytale && cd hytale
curl -O https://raw.githubusercontent.com/ketbom/hytale-server/main/docker-compose.yml
```

### Step 2: Create directories

**Linux/Mac:**

```bash
mkdir -p server data/universe data/mods data/logs data/config
```

**Windows (PowerShell):**

```powershell
mkdir server, data\universe, data\mods, data\logs, data\config
```

### Step 3: Download server files

Download from your Hytale account and place in `./server/`:

- `HytaleServer.jar`
- `Assets.zip`

### Step 4: Start

```bash
docker compose up -d
```

### Step 5: Open Panel

Open **http://localhost:3000**

Click **"🔐 Authenticate Server"** and follow the instructions.

Done! ✅

## Web Panel

Access at **http://localhost:3000**

- 📜 Real-time console logs
- ⌨️ Send commands
- 🔐 One-click authentication
- 📊 Server status

## Configuration

Edit `docker-compose.yml`:

### Memory

| Variable   | Default | Description |
| ---------- | ------- | ----------- |
| `JAVA_XMS` | `4G`    | Minimum RAM |
| `JAVA_XMX` | `8G`    | Maximum RAM |

| Players | JAVA_XMX |
| ------- | -------- |
| 1-10    | 4G       |
| 10-20   | 6G       |
| 20-50   | 8G       |
| 50+     | 12G+     |

### Server

| Variable        | Default | Description              |
| --------------- | ------- | ------------------------ |
| `BIND_PORT`     | `5520`  | UDP port                 |
| `VIEW_DISTANCE` | -       | Render distance (chunks) |
| `MAX_PLAYERS`   | -       | Maximum players          |
| `SERVER_NAME`   | -       | Server name              |

## Directory Structure

```
hytale/
├── docker-compose.yml
├── server/
│   ├── HytaleServer.jar
│   └── Assets.zip
└── data/
    ├── universe/    # World saves
    ├── mods/        # Server mods
    ├── logs/        # Server logs
    └── config/      # Configuration
```

## Commands

### View logs

```bash
docker compose logs -f
```

### Stop

```bash
docker compose down
```

### Update

```bash
docker compose pull
docker compose up -d
```

### Backup

```bash
docker compose stop
tar -czvf backup.tar.gz data/
docker compose start
```

## Firewall

Open UDP port 5520:

```bash
# Linux
ufw allow 5520/udp

# Windows (PowerShell)
New-NetFirewallRule -DisplayName "Hytale" -Direction Inbound -Protocol UDP -LocalPort 5520 -Action Allow
```

## Ports

| Service | Port     | Description      |
| ------- | -------- | ---------------- |
| Server  | 5520/UDP | Game connections |
| Panel   | 3000/TCP | Web interface    |

## License

MIT
