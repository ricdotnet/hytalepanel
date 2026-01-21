import type { Server, ServerConfig } from '$lib/stores/servers';

export interface UploadResponse {
  success: boolean;
  error?: string;
}

export interface ServersResponse {
  success: boolean;
  servers?: Server[];
  error?: string;
}

export interface ServerResponse {
  success: boolean;
  server?: Server;
  error?: string;
}

export interface OperationResponse {
  success: boolean;
  error?: string;
}

export async function uploadFile(
  file: File,
  targetDir: string,
  _onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetDir', targetDir);

  const response = await fetch('/api/files/upload', {
    method: 'POST',
    body: formData
  });

  return await response.json();
}

// ==================== SERVERS API ====================

export async function fetchServers(): Promise<ServersResponse> {
  try {
    const response = await fetch('/api/servers');
    return await response.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function fetchServer(id: string): Promise<ServerResponse> {
  try {
    const response = await fetch(`/api/servers/${id}`);
    return await response.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export interface CreateServerParams {
  name: string;
  port?: number;
  config?: Partial<ServerConfig>;
}

export async function createServer(params: CreateServerParams): Promise<ServerResponse> {
  try {
    const response = await fetch('/api/servers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await response.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function updateServer(id: string, params: Partial<CreateServerParams>): Promise<ServerResponse> {
  try {
    const response = await fetch(`/api/servers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await response.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function deleteServer(id: string): Promise<OperationResponse> {
  try {
    const response = await fetch(`/api/servers/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function startServer(id: string): Promise<OperationResponse> {
  try {
    const response = await fetch(`/api/servers/${id}/start`, {
      method: 'POST'
    });
    return await response.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function stopServer(id: string): Promise<OperationResponse> {
  try {
    const response = await fetch(`/api/servers/${id}/stop`, {
      method: 'POST'
    });
    return await response.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function restartServer(id: string): Promise<OperationResponse> {
  try {
    const response = await fetch(`/api/servers/${id}/restart`, {
      method: 'POST'
    });
    return await response.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// ==================== COMPOSE API ====================

export interface ComposeResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export async function getServerCompose(id: string): Promise<ComposeResponse> {
  try {
    const response = await fetch(`/api/servers/${id}/compose`);
    return await response.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function saveServerCompose(id: string, content: string): Promise<OperationResponse> {
  try {
    const response = await fetch(`/api/servers/${id}/compose`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    return await response.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function regenerateServerCompose(id: string): Promise<ComposeResponse> {
  try {
    const response = await fetch(`/api/servers/${id}/compose/regenerate`, {
      method: 'POST'
    });
    return await response.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
