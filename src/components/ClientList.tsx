import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { clientsApi, findMissingLetter } from '../services/api';
import ClientForm from './ClientForm';
import { Edit, Trash2, Mail, Calendar, User } from 'lucide-react';
import { Client } from '../types';

interface ClientFormData {
  name: string;
  email: string;
  birthDate: string;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await clientsApi.getAll();
      setClients(data);
    } catch (err) {
      setError('Erro ao carregar clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (clientData: ClientFormData): Promise<void> => {
    try {
      await clientsApi.create(clientData);
      await loadClients();
    } catch (err) {
      setError('Erro ao adicionar cliente');
      console.error(err);
    }
  };

  const handleEditClient = async (clientData: ClientFormData): Promise<void> => {
    if (!editingClient) return;
    
    try {
      await clientsApi.update(editingClient.id, clientData);
      await loadClients();
      setEditingClient(null);
    } catch (err) {
      setError('Erro ao atualizar cliente');
      console.error(err);
    }
  };

  const handleDeleteClient = async (clientId: string): Promise<void> => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientsApi.delete(clientId);
        await loadClients();
      } catch (err) {
        setError('Erro ao excluir cliente');
        console.error(err);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando clientes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <ClientForm
          onSubmit={editingClient ? handleEditClient : handleAddClient}
          initialData={editingClient}
          isOpen={isFormOpen || !!editingClient}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingClient(null);
          }}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => {
          const missingLetter = findMissingLetter(client.name);
          
          return (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingClient(client)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{client.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(client.birthDate)}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Cadastrado em: {formatDate(client.createdAt)}</span>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Primeira letra ausente:
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {missingLetter.toUpperCase()}
                  </div>
                  {missingLetter === '-' && (
                    <div className="text-xs text-green-600 mt-1">
                      Todas as letras presentes!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {clients.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece adicionando um novo cliente.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientList;

