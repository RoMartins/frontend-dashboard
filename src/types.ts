export interface Client {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  createdAt: string;
}

export interface ClientResponse {
  data: {
    clients: Client[];
  };
}

export interface SalesByDay {
  date: string;
  total: number;
}

export interface TopClients {
  highestVolumeClient: Client;
  highestAverageClient: Client;
  highestFrequencyClient: Client;
}

export interface AuthContextType {
  user: { id: number; email: string; name: string } | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

export interface RawClientData {
  info: {
    nomeCompleto: string;
    id: string;
    detalhes: {
      email: string;
      nascimento: string;
    };
  };
  estatisticas: {
    vendas: Array<{ data: string; valor: number }>;
  };
  duplicado?: {
    nomeCompleto: string;
  };
}

export interface ClientApiResponse {
  data: {
    clients: RawClientData[];
  };
  meta: {
    registroTotal: number;
    pagina: number;
  };
  redundante: {
    status: string;
  };
}
