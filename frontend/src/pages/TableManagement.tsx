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
  const [showEditServer, setShowEditServer] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);

  useEffect(() => {
    fetchTables();
    fetchServers();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.TABLES.BASE);
      const data = await response.json();
      console.log('Raw data from backend:', JSON.stringify(data, null, 2));
      
      data.forEach((table: any, index: number) => {
        console.log(`Table ${index + 1} details:`, {
          tableId: table.tableId,
          tableTotalCost: table.tableTotalCost,
          isTableAvailable: table.isTableAvailable,
          isTableAvailableType: typeof table.isTableAvailable,
          rawTable: table
        });
      });
      
      const processedTables: Table[] = data.map((table: any) => {
        const processedTable: Table = {
          tableId: table.tableId,
          tableTotalCost: table.tableTotalCost,
          isTableAvailable: table.tableAvailable,
          tableWaiter: table.tableWaiter || undefined
        };
        return processedTable;
      });
      
      console.log('Processed tables:', processedTables);
      setTables(processedTables);
      setError(null);
    } catch (err) {
      setError('Error loading tables');
      console.error('Error loading tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WAITERS.BASE);
      const data = await response.json();
      
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
      console.error('Error loading waiters:', err);
    }
  };

  const createTable = async () => {
    try {
      const newTable = {
        tableTotalCost: 0,
        isTableAvailable: true,
        tableWaiter: null
      };
      
      console.log('Creating new table:', newTable);
      const response = await fetch(API_ENDPOINTS.TABLES.BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTable)
      });
      const data = await response.json();
      console.log('Table created:', data);
      
      await fetchTables();
    } catch (err) {
      setError('Error creating table');
      console.error('Error creating table:', err);
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
          waiterTables: 0
        })
      });

      if (!response.ok) {
        throw new Error('Error adding waiter');
      }

      await fetchServers();
      setShowAddServer(false);
      setNewServer({
        employeeName: '',
        employeeSalary: 0
      });
    } catch (err) {
      setError('Error adding waiter');
      console.error('Error adding waiter:', err);
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
      return 'Available';
    } else {
      return 'Occupied';
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
      const selectedWaiter = servers.find(s => s.employeeId === waiterId);
      if (!selectedWaiter) {
        throw new Error('Waiter not found');
      }

      const currentTable = tables.find(t => t.tableId === tableId);
      if (!currentTable) {
        throw new Error('Table not found');
      }

      const updatedTable = {
        tableId,
        tableTotalCost: currentTable.tableTotalCost,
        tableAvailable: currentTable.isTableAvailable,
        tableWaiter: {
          employeeId: selectedWaiter.employeeId,
          employeeName: selectedWaiter.employeeName,
          employeeSalary: selectedWaiter.employeeSalary,
          waiterTables: selectedWaiter.waiterTables
        }
      };
      
      console.log('Updating table with:', updatedTable);
      
      const response = await fetch(API_ENDPOINTS.TABLES.BY_ID(tableId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTable)
      });

      if (!response.ok) {
        throw new Error('Error updating table');
      }

      const data = await response.json();
      console.log('Table updated:', data);
      
      await fetchTables();
      setShowServerAssignment(false);
    } catch (err) {
      setError('Error assigning waiter');
      console.error('Error assigning waiter:', err);
    }
  };

  const removeWaiter = async (tableId: number) => {
    try {
      const currentTable = tables.find(t => t.tableId === tableId);
      if (!currentTable) {
        throw new Error('Table not found');
      }

      const updatedTable = {
        tableId,
        tableTotalCost: currentTable.tableTotalCost,
        tableAvailable: currentTable.isTableAvailable,
        tableWaiter: null
      };
      
      console.log('Removing waiter from table:', updatedTable);
      
      const response = await fetch(API_ENDPOINTS.TABLES.BY_ID(tableId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTable)
      });

      if (!response.ok) {
        throw new Error('Error removing waiter');
      }

      const data = await response.json();
      console.log('Table updated:', data);
      
      await fetchTables();
      toast.success('Waiter removed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error removing waiter';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error removing waiter:', err);
    }
  };

  const handleDeleteServer = async (serverId: number) => {
    try {
      if (!window.confirm('Are you sure you want to delete this waiter?')) {
        return;
      }

      const response = await fetch(API_ENDPOINTS.WAITERS.BY_ID(serverId), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cannot delete waiter while assigned to a table!');
      }

      await fetchServers();
      toast.success('Waiter deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting waiter';
      toast.error(errorMessage);
      console.error('Error deleting waiter:', err);
      setError(null);
    }
  };

  const handleEditServer = async () => {
    if (!editingServer) return;

    try {
      const updatedServerData = {
        employeeId: editingServer.employeeId,
        employeeName: editingServer.employeeName,
        employeeSalary: editingServer.employeeSalary,
        waiterTables: editingServer.waiterTables || 0
      };

      console.log('Updating waiter with:', updatedServerData);
      console.log('API Endpoint:', API_ENDPOINTS.WAITERS.BY_ID(editingServer.employeeId));

      const response = await fetch(API_ENDPOINTS.WAITERS.BY_ID(editingServer.employeeId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedServerData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const updatedServer = await response.json();
      console.log('Updated waiter:', updatedServer);

      await fetchServers();
      
      setShowEditServer(false);
      setEditingServer(null);
      
      toast.success('Waiter information updated successfully');
    } catch (err) {
      console.error('Full error details:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error updating waiter';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Table Management</h2>
        <div className="space-x-4">
          <button
            onClick={() => setShowAddServer(true)}
            className="px-4 py-2 bg-indigo-600 text-black rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add New Waiter
          </button>
          <button
            onClick={createTable}
            className="px-4 py-2 bg-emerald-600 text-black rounded-md hover:bg-emerald-700 transition-colors"
          >
            Add New Table
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Table Layout</h2>
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
                <div className="text-lg font-semibold mb-2">Table {table.tableId}</div>
                <div className="text-sm text-gray-600 mb-1">
                  Total Amount: {table.tableTotalCost} TL
                </div>
                <div className={`text-sm font-medium ${
                  table.isTableAvailable ? 'text-green-700' : 'text-red-700'
                }`}>
                  {table.isTableAvailable ? 'Available' : 'Occupied'}
                </div>
                {table.tableWaiter && (
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-sm text-gray-600">
                      Waiter: {table.tableWaiter.employeeName}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to remove the waiter from this table?')) {
                          removeWaiter(table.tableId);
                        }
                      }}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Remove Waiter
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {selectedTable && showServerAssignment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <Card className="w-96 p-4 bg-white">
                <h3 className="text-lg font-semibold mb-4">Assign Waiter to Table {selectedTable.tableId}</h3>
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
                  Cancel
                </button>
              </Card>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Waiters</h2>
          <div className="space-y-4">
            {servers.map((server) => (
              <Card key={server.employeeId} className="p-4 bg-white border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg mb-2">{server.employeeName}</div>
                    <div className="text-sm text-gray-600">
                      Salary: {server.employeeSalary} TL
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingServer(server);
                        setShowEditServer(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteServer(server.employeeId)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {showAddServer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-96 p-4 bg-white">
            <h3 className="text-lg font-semibold mb-4">Add New Waiter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Waiter Name</label>
                <input
                  type="text"
                  value={newServer.employeeName}
                  onChange={(e) => setNewServer({ ...newServer, employeeName: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter waiter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <input
                  type="number"
                  value={newServer.employeeSalary}
                  onChange={(e) => setNewServer({ ...newServer, employeeSalary: Number(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter salary amount"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddServer}
                  className="flex-1 p-2 bg-blue-500 text-black rounded-md hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddServer(false)}
                  className="flex-1 p-2 bg-gray-500 text-black rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showEditServer && editingServer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-96 p-4 bg-white">
            <h3 className="text-lg font-semibold mb-4">Edit Waiter Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Waiter Name</label>
                <input
                  type="text"
                  value={editingServer.employeeName}
                  onChange={(e) => setEditingServer({ ...editingServer, employeeName: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter waiter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Updated Salary</label>
                <input
                  type="number"
                  value={editingServer.employeeSalary}
                  onChange={(e) => setEditingServer({ ...editingServer, employeeSalary: Number(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter new salary amount"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleEditServer}
                  className="flex-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setShowEditServer(false);
                    setEditingServer(null);
                  }}
                  className="flex-1 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
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
