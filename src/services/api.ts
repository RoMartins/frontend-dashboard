import { Client, SalesByDay, TopClients, RawClientData, ClientResponse } from '../types';
import api from '@/lib/axiosClient';

// Função para normalizar dados de clientes da API
export const normalizeClientData = (rawClient: RawClientData): Client => {
  return {
    id: rawClient.info?.id || '',
    name: rawClient.info?.nomeCompleto || '',
    email: rawClient.info?.detalhes?.email || '',
    birthDate: rawClient.info?.detalhes?.nascimento || '',
    createdAt: new Date().toISOString().split('T')[0],
  };
};

// Função para encontrar a primeira letra ausente no nome
export const findMissingLetter = (name: string): string => {
  if (!name) return 'a';

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const nameLetters = new Set(name.toLowerCase().replace(/[^a-z]/g, ''));

  for (let letter of alphabet) {
    if (!nameLetters.has(letter)) {
      return letter;
    }
  }

  return '-';
};

// Função para processar e normalizar a resposta da API
const processClientApiResponse = (apiResponse: ClientResponse): Client[] => {
  const clientsData = apiResponse.data?.clients || [];
  const transformed = {
    data: {
      clientes: clientsData.map((client) => ({
        info: {
          id: client.id,
          nomeCompleto: client.name,
          detalhes: {
            email: client.email,
            nascimento: client.birthDate.split('T')[0], // só a data
          },
        },
        estatisticas: {
          vendas: [],
        },
      })),
    },
    meta: {
      registroTotal: clientsData.length,
      pagina: 1,
    },
    redundante: {
      status: 'ok',
    },
  };

  return transformed.data.clientes.map((rawClient) => normalizeClientData(rawClient));
};

// API functions
export const clientsApi = {
  // Listar todos os clientes
  getAll: async (): Promise<Client[]> => {
    try {
      const response = await api.get('/clients');
      return processClientApiResponse(response);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  },

  // Criar novo cliente
  create: async (
    clientData: Omit<Client, 'id' | 'createdAt' | 'lastUpdate'>,
  ): Promise<Client> => {
    try {
      const payload = {
        name: clientData.name,
        email: clientData.email,
        birthDate: clientData.birthDate,
      };
      const response = await api.post<Client>('/clients/create', payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  // Atualizar cliente
  update: async (
    id: string,
    clientData: Partial<Omit<Client, 'id' | 'createdAt'>>,
  ): Promise<void> => {
    try {
      const payload = {
        name: clientData.name,
        email: clientData.email,
        birthDate: clientData.birthDate,
      };
      await api.put<Client>(`/clients/${id}`, payload);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  },

  // Deletar cliente
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      await api.delete(`/clients/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  },
};

export const salesApi = {
  // Obter vendas por dia
  getSalesByDay: async (): Promise<SalesByDay[]> => {
    try {
      const response = await api.get<SalesByDay[]>('/sales/statistics/daily');
      const { salesByDay }: any = response.data;
      return salesByDay;
    } catch (error) {
      console.error('Erro ao buscar vendas por dia:', error);
      throw error;
    }
  },

  // Obter estatísticas de clientes
  getTopClients: async (): Promise<TopClients> => {
    try {
      const response = await api.get<TopClients>('/sales/clients/statistics');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar top clientes:', error);
      throw error;
    }
  },
};
