'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RestaurantDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openingHours: '',
    tables: 0,
    waitingTime: 10, // default waiting time in minutes
  });
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '' });
  const [editingItemId, setEditingItemId] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is a restaurant owner
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    // Fetch restaurant data
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/restaurant/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant data');
      }

      const data = await response.json();
      setRestaurantInfo(data.restaurantInfo);
      setMenuItems(data.menuItems || []);
      setReservations(data.reservations || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleRestaurantInfoUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/restaurant/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(restaurantInfo)
      });

      if (!response.ok) {
        throw new Error('Failed to update restaurant information');
      }

      alert('Restaurant information updated successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReservationAction = async (reservationId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reservations/${reservationId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} reservation`);
      }

      // Refresh reservations list
      fetchRestaurantData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMenuInputChange = (e) => {
    setMenuForm({ ...menuForm, [e.target.name]: e.target.value });
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setMenuLoading(true);
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/restaurant/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(menuForm),
    });
    setMenuForm({ name: '', description: '', price: '' });
    setEditingItemId(null);
    setMenuLoading(false);
    fetchRestaurantData();
  };

  const handleEditMenuItem = (item) => {
    setMenuForm({ name: item.name, description: item.description, price: item.price });
    setEditingItemId(item._id);
  };

  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    setMenuLoading(true);
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/restaurant/menu/${editingItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(menuForm),
    });
    setMenuForm({ name: '', description: '', price: '' });
    setEditingItemId(null);
    setMenuLoading(false);
    fetchRestaurantData();
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Delete this menu item?')) return;
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/restaurant/menu/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRestaurantData();
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{restaurantInfo.name}</h1>
            <p className="text-blue-100">{restaurantInfo.address}</p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'reservations'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reservations
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'menu'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Menu Management
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Today's Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800">Total Reservations</h3>
                    <p className="text-3xl font-bold text-blue-600">{reservations.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-green-800">Available Tables</h3>
                    <p className="text-3xl font-bold text-green-600">{restaurantInfo.tables}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-yellow-800">Average Waiting Time</h3>
                    <p className="text-3xl font-bold text-yellow-600">{restaurantInfo.waitingTime} min</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Manage Reservations</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations.map((reservation) => (
                        <tr key={reservation._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{reservation.customerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(reservation.dateTime).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{reservation.partySize}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {reservation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reservation.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleReservationAction(reservation._id, 'approve')}
                                  className="text-green-600 hover:text-green-900 mr-2"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReservationAction(reservation._id, 'reject')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Menu Management Tab */}
            {activeTab === 'menu' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Menu Management</h2>
                <form
                  onSubmit={editingItemId ? handleUpdateMenuItem : handleAddMenuItem}
                  className="flex flex-col md:flex-row gap-2 mb-6"
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={menuForm.name}
                    onChange={handleMenuInputChange}
                    className="border rounded px-2 py-1"
                    required
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={menuForm.description}
                    onChange={handleMenuInputChange}
                    className="border rounded px-2 py-1"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={menuForm.price}
                    onChange={handleMenuInputChange}
                    className="border rounded px-2 py-1"
                    required
                    min="0"
                    step="0.01"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={menuLoading}
                  >
                    {editingItemId ? 'Update' : 'Add'}
                  </button>
                  {editingItemId && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuForm({ name: '', description: '', price: '' });
                        setEditingItemId(null);
                      }}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  )}
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <div key={item._id} className="border rounded-lg p-4 flex flex-col">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                      <p className="font-bold mt-2">${item.price}</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEditMenuItem(item)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Restaurant Settings</h2>
                <form onSubmit={handleRestaurantInfoUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                    <input
                      type="text"
                      value={restaurantInfo.name}
                      onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      value={restaurantInfo.address}
                      onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Tables</label>
                    <input
                      type="number"
                      value={restaurantInfo.tables}
                      onChange={(e) => setRestaurantInfo({...restaurantInfo, tables: parseInt(e.target.value)})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Average Waiting Time (minutes)</label>
                    <input
                      type="number"
                      value={restaurantInfo.waitingTime}
                      onChange={(e) => setRestaurantInfo({...restaurantInfo, waitingTime: parseInt(e.target.value)})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 