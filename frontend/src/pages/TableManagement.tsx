import React, { useState, useEffect } from 'react';
import type { Table, Server } from '../types/index';
import { Card } from '@/components/ui/card';
import { API_ENDPOINTS } from '../config/api';
import { toast } from 'react-hot-toast';

const TableManagement: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showServerAssignment, setShowServerAssignment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddServer, setShowAddServer] = useState(false);
  const [newServer, setNewServer] = useState({
    employeeName: '',
    employeeSalary: 0
  });

  useEffect(() => {
    fetchTables();
    fetchServers();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.TABLES.BASE);
      const data = await response.json();
      console.log('Backend\'den gelen ham veri:', JSON.stringify(data, null, 2));
      
      // Her bir masa için detaylı log
      data.forEach((table: any, index: number) => {
        console.log(`Masa ${index + 1} detayları:`, {
          tableId: table.tableId,
          tableTotalCost: table.tableTotalCost,
          isTableAvailable: table.isTableAvailable,
          isTableAvailableType: typeof table.isTableAvailable,
          rawTable: table
        });
      });
      
      // Backend'den gelen veriyi Table tipine dönüştür
      const processedTables: Table[] = data.map((table: any) => {
        const processedTable: Table = {
          tableId: table.tableId,
          tableTotalCost: table.tableTotalCost,
          isTableAvailable: table.tableAvailable,
          tableWaiter: table.tableWaiter || undefined
        };
        return processedTable;
      });
      
      console.log('İşlenmiş masalar:', processedTables);
      setTables(processedTables);
      setError(null);
    } catch (err) {
      setError('Masalar yüklenirken bir hata oluştu');
      console.error('Masalar yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WAITERS.BASE);
      const data = await response.json();
      
      // Her garsonun atanmış masa sayısını hesapla
      const serversWithTableCount = data.map((server: Server) => {
        const assignedTables = tables.filter(table => 
          table.tableWaiter?.employeeId === server.employeeId
        ).length;
        
        return {
          ...server,
          waiterTables: assignedTables
        };
      });
      
      setServers(serversWithTableCount);
    } catch (err) {
      console.error('Garsonlar yüklenirken hata:', err);
    }
  };

  const createTable = async () => {
    try {
      const newTable = {
        tableTotalCost: 0,
        isTableAvailable: true,
        tableWaiter: null
      };
      
      console.log('Yeni masa oluşturuluyor:', newTable);
      const response = await fetch(API_ENDPOINTS.TABLES.BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTable)
      });
      const data = await response.json();
      console.log('Masa oluşturuldu:', data);
      
      await fetchTables();
    } catch (err) {
      setError('Masa oluşturulurken bir hata oluştu');
      console.error('Masa oluşturma hatası:', err);
    }
  };

  const handleAddServer = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WAITERS.BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newServer,
          waiterTables: 0 // Başlangıçta 0 masa atanmış olarak başlar
        })
      });

      if (!response.ok) {
        throw new Error('Garson eklenirken bir hata oluştu');
      }

      await fetchServers();
      setShowAddServer(false);
      setNewServer({
        employeeName: '',
        employeeSalary: 0
      });
    } catch (err) {
      setError('Garson eklenirken bir hata oluştu');
      console.error('Garson ekleme hatası:', err);
    }
  };

  const getTableColor = (isAvailable: boolean) => {
    if (isAvailable) {
      return 'bg-green-50 hover:bg-green-100 border-green-500';
    } else {
      return 'bg-red-50 hover:bg-red-100 border-red-500';
    }
  };

  const getTableStatusText = (isAvailable: boolean) => {
    if (isAvailable) {
      return 'Müsait';
    } else {
      return 'Dolu';
    }
  };

  const getTableStatusColor = (isAvailable: boolean) => {
    if (isAvailable) {
      return 'text-green-700';
    } else {
      return 'text-red-700';
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setShowServerAssignment(true);
  };

  const assignServer = async (tableId: number, waiterId: number) => {
    try {
      // Garson bilgilerini bul
      const selectedWaiter = servers.find(s => s.employeeId === waiterId);
      if (!selectedWaiter) {
        throw new Error('Garson bulunamadı');
      }

      // Mevcut masa bilgilerini bul
      const currentTable = tables.find(t => t.tableId === tableId);
      if (!currentTable) {
        throw new Error('Masa bulunamadı');
      }

      // Güncellenecek masa bilgilerini hazırla
      const updatedTable = {
        tableId,
        tableTotalCost: currentTable.tableTotalCost,
        tableAvailable: currentTable.isTableAvailable, // Mevcut müsaitlik durumunu koru
        tableWaiter: {
          employeeId: selectedWaiter.employeeId,
          employeeName: selectedWaiter.employeeName,
          employeeSalary: selectedWaiter.employeeSalary,
          waiterTables: selectedWaiter.waiterTables
        }
      };
      
      console.log('Güncellenecek masa bilgileri:', updatedTable);
      
      const response = await fetch(API_ENDPOINTS.TABLES.BY_ID(tableId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTable)
      });

      if (!response.ok) {
        throw new Error('Masa güncellenirken bir hata oluştu');
      }

      const data = await response.json();
      console.log('Masa güncellendi:', data);
      
      await fetchTables(); // Masaları yeniden yükle
      setShowServerAssignment(false);
    } catch (err) {
      setError('Garson ataması yapılırken bir hata oluştu');
      console.error('Garson atama hatası:', err);
    }
  };

  const handleDeleteServer = async (serverId: number) => {
    try {
      // Kullanıcıdan onay al
      if (!window.confirm('Bu garsonu silmek istediğinizden emin misiniz?')) {
        return;
      }

      const response = await fetch(API_ENDPOINTS.WAITERS.BY_ID(serverId), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Garson silinirken bir hata oluştu');
      }

      await fetchServers();
      toast.success('Garson başarıyla silindi');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Garson silinirken bir hata oluştu';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Garson silme hatası:', err);
    }
  };

  if (loading) return <div className="container mx-auto p-4">Yükleniyor...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Masa Yönetimi</h2>
        <div className="space-x-4">
          <button
            onClick={() => setShowAddServer(true)}
            className="px-4 py-2 bg-indigo-600 text-black rounded-md hover:bg-indigo-700 transition-colors"
          >
            Yeni Garson Ekle
          </button>
          <button
            onClick={createTable}
            className="px-4 py-2 bg-emerald-600 text-black rounded-md hover:bg-emerald-700 transition-colors"
          >
            Yeni Masa Ekle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Table Layout */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Masa Düzeni</h2>
          <div className="grid grid-cols-2 gap-4">
            {tables.map((table) => (
              <Card
                key={table.tableId}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  table.isTableAvailable 
                    ? 'bg-green-50 hover:bg-green-100 border-green-500' 
                    : 'bg-red-50 hover:bg-red-100 border-red-500'
                }`}
                onClick={() => handleTableClick(table)}
              >
                <div className="text-lg font-semibold mb-2">Masa {table.tableId}</div>
                <div className="text-sm text-gray-600 mb-1">
                  Toplam Tutar: {table.tableTotalCost} TL
                </div>
                <div className={`text-sm font-medium ${
                  table.isTableAvailable ? 'text-green-700' : 'text-red-700'
                }`}>
                  {table.isTableAvailable ? 'Müsait' : 'Dolu'}
                </div>
                {table.tableWaiter && (
                  <div className="text-sm text-gray-600 mt-1">
                    Garson: {table.tableWaiter.employeeName}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Server Assignment Dialog */}
          {selectedTable && showServerAssignment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <Card className="w-96 p-4 bg-white">
                <h3 className="text-lg font-semibold mb-4">Masa {selectedTable.tableId} için Garson Ata</h3>
                <div className="space-y-2">
                  {servers.map(server => (
                    <button
                      key={server.employeeId}
                      onClick={() => assignServer(selectedTable.tableId, server.employeeId)}
                      className="w-full p-2 text-left hover:bg-accent rounded-md transition-colors bg-white border border-gray-300"
                    >
                      {server.employeeName}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowServerAssignment(false)}
                  className="mt-4 w-full p-2 bg-secondary text-secondary-foreground rounded-md border border-gray-300"
                >
                  İptal
                </button>
              </Card>
            </div>
          )}
        </div>

        {/* Server Assignment */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Garsonlar</h2>
          <div className="space-y-4">
            {servers.map((server) => (
              <Card key={server.employeeId} className="p-4 bg-white border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg mb-2">{server.employeeName}</div>
                    <div className="text-sm text-gray-600">
                      Maaş: {server.employeeSalary} TL
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteServer(server.employeeId)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Add Server Dialog */}
      {showAddServer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-96 p-4 bg-white">
            <h3 className="text-lg font-semibold mb-4">Yeni Garson Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Garson Adı</label>
                <input
                  type="text"
                  value={newServer.employeeName}
                  onChange={(e) => setNewServer({ ...newServer, employeeName: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Garson adını girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maaş</label>
                <input
                  type="number"
                  value={newServer.employeeSalary}
                  onChange={(e) => setNewServer({ ...newServer, employeeSalary: Number(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Maaş miktarını girin"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddServer}
                  className="flex-1 p-2 bg-blue-500 text-black rounded-md hover:bg-blue-600"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowAddServer(false)}
                  className="flex-1 p-2 bg-gray-500 text-black rounded-md hover:bg-gray-600"
                >
                  İptal
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TableManagement;
