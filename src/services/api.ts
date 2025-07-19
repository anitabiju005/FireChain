const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface ApiIncident {
  id: number;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  reporter: string;
  severity: number;
  status: number;
  verifier: string;
  verificationTimestamp: number;
  rewardClaimed: boolean;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getHealth(): Promise<{ status: string; timestamp: string; contracts: any }> {
    return this.request('/health');
  }

  async getIncidents(): Promise<{ incidents: ApiIncident[]; total: number }> {
    return this.request('/incidents');
  }

  async getIncident(id: number): Promise<ApiIncident> {
    return this.request(`/incidents/${id}`);
  }

  async getTokenBalance(address: string): Promise<{ address: string; balance: string; balanceWei: string }> {
    return this.request(`/balance/${address}`);
  }

  async sendNotification(phoneNumber: string, message: string, incidentId?: number): Promise<{ success: boolean; messageSid: string }> {
    return this.request('/notify', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, message, incidentId }),
    });
  }

  async reportIncidentViaApi(
    location: string,
    description: string,
    latitude: number,
    longitude: number,
    severity: number,
    privateKey: string
  ): Promise<{ success: boolean; transactionHash: string; incidentId: number }> {
    return this.request('/incidents/report', {
      method: 'POST',
      body: JSON.stringify({
        location,
        description,
        latitude,
        longitude,
        severity,
        privateKey,
      }),
    });
  }

  async webhookIncident(incidentData: {
    incidentId: number;
    reporter: string;
    location: string;
    severity: number;
  }): Promise<{ success: boolean; processed: boolean }> {
    return this.request('/webhook/incident', {
      method: 'POST',
      body: JSON.stringify(incidentData),
    });
  }
}

export const apiService = new ApiService();