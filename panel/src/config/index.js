module.exports = {
  container: {
    name: process.env.CONTAINER_NAME || "hytale-server"
  },
  server: {
    port: parseInt(process.env.PANEL_PORT, 10) || 3000
  },
  docker: {
    socketPath: "/var/run/docker.sock"
  },
  files: {
    basePath: "/opt/hytale",
    maxUploadSize: 100 * 1024 * 1024, // 100MB
    editableExtensions: [
      ".json", ".yaml", ".yml", ".properties", 
      ".txt", ".cfg", ".conf", ".xml", ".toml", ".ini"
    ],
    uploadAllowedExtensions: [
      ".jar", ".zip", ".json", ".yaml", ".yml", ".properties",
      ".txt", ".cfg", ".conf", ".xml", ".toml", ".ini", ".png", ".jpg"
    ]
  }
};
