
export const apiService = {
  async startNegotiation(negotiationId: string): Promise<void> {
    const response = await fetch(
      `https://creator-server-173826602269.us-central1.run.app/api/negotiations/${negotiationId}/start`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to start negotiation: ${response.statusText}`);
    }
  },
};
