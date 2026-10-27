const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  googleAuth: async (mockEmail?: string, mockName?: string) => {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mock_email: mockEmail, mock_name: mockName })
    });
    if (!res.ok) throw new Error('OAuth authentication failed');
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
    return res.json();
  },

  // Dashboard
  getDashboardSummary: async () => {
    const res = await fetch(`${API_BASE}/dashboard/summary`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load dashboard');
    return res.json();
  },

  getTimeline: async () => {
    const res = await fetch(`${API_BASE}/dashboard/timeline`, { headers: getHeaders() });
    return res.json();
  },

  getPeerBenchmark: async (cohort = 'early_career_tech') => {
    const res = await fetch(`${API_BASE}/dashboard/peer-benchmark?cohort=${cohort}`, { headers: getHeaders() });
    return res.json();
  },

  // Data Mining
  getAnomalies: async (contamination = 0.03) => {
    const res = await fetch(`${API_BASE}/mining/anomaly?contamination=${contamination}`, { headers: getHeaders() });
    return res.json();
  },

  getClustering: async (nClusters = 4) => {
    const res = await fetch(`${API_BASE}/mining/clustering?n_clusters=${nClusters}`, { headers: getHeaders() });
    return res.json();
  },

  getAssociationRules: async (minSupport = 0.04, minConfidence = 0.35) => {
    const res = await fetch(`${API_BASE}/mining/association-rules?min_support=${minSupport}&min_confidence=${minConfidence}`, { headers: getHeaders() });
    return res.json();
  },

  getForecast: async (months = 6) => {
    const res = await fetch(`${API_BASE}/mining/forecast?months_ahead=${months}`, { headers: getHeaders() });
    return res.json();
  },

  getGoalClassifier: async () => {
    const res = await fetch(`${API_BASE}/mining/goal-classifier`, { headers: getHeaders() });
    return res.json();
  },

  runMiningJobs: async () => {
    const res = await fetch(`${API_BASE}/mining/run-all-jobs`, { method: 'POST', headers: getHeaders() });
    return res.json();
  },

  // GenAI Copilot
  sendChat: async (message: string) => {
    const res = await fetch(`${API_BASE}/copilot/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('Copilot query failed');
    return res.json();
  },

  scanOcr: async (formData: FormData) => {
    const token = localStorage.getItem('access_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/copilot/ocr-scan`, {
      method: 'POST',
      headers,
      body: formData
    });
    return res.json();
  },

  simulate: async (params: any) => {
    const res = await fetch(`${API_BASE}/copilot/simulate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    return res.json();
  },

  // Goals
  getGoals: async () => {
    const res = await fetch(`${API_BASE}/goals/`, { headers: getHeaders() });
    return res.json();
  },

  createGoal: async (goal: any) => {
    const res = await fetch(`${API_BASE}/goals/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(goal)
    });
    return res.json();
  },

  // Decisions
  getDecisions: async () => {
    const res = await fetch(`${API_BASE}/decisions/`, { headers: getHeaders() });
    return res.json();
  },

  createDecision: async (decision: any) => {
    const res = await fetch(`${API_BASE}/decisions/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(decision)
    });
    return res.json();
  },

  reviewDecision: async (decisionId: string, review: any) => {
    const res = await fetch(`${API_BASE}/decisions/${decisionId}/review`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(review)
    });
    return res.json();
  },

  // Privacy & Consents
  getConsents: async () => {
    const res = await fetch(`${API_BASE}/privacy/consents`, { headers: getHeaders() });
    return res.json();
  },

  updateConsents: async (consents: any[]) => {
    const res = await fetch(`${API_BASE}/privacy/consents`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ consents })
    });
    return res.json();
  },

  getAuditLog: async () => {
    const res = await fetch(`${API_BASE}/privacy/audit-log`, { headers: getHeaders() });
    return res.json();
  },

  getExportData: async () => {
    const res = await fetch(`${API_BASE}/privacy/export`, { headers: getHeaders() });
    return res.json();
  },

  deleteAccount: async () => {
    const res = await fetch(`${API_BASE}/privacy/delete-account`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  }
};
