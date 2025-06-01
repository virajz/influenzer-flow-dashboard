export const apiService = {
  async startNegotiation(negotiationId: string, token: string): Promise<void> {
    const response = await fetch(
      `https://creator-server-173826602269.us-central1.run.app/api/negotiations/${negotiationId}/start`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to start negotiation: ${response.statusText}`);
    }
  },

  async initiateAgentCall(negotiationId: string, phone: string): Promise<any> {
    const response = await fetch(
      'http://creator-server-173826602269.us-central1.run.app/api/initiateCall/start',
      {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ negotiationId, phone }),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to initiate call');
    }
    return response.json();
  },
};
