'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaTshirt, FaExchangeAlt } from 'react-icons/fa';
import { MdDelete, MdCheckCircle, MdCancel, MdEdit } from 'react-icons/md';

interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  points: number;
  profilePic?: string;
  createdAt: Date;
  status: 'active' | 'suspended' | 'pending';
}

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  status: string;
  points: number;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
}

interface Swap {
  id: string;
  status: string;
  createdAt: Date;
  item1: {
    title: string;
  };
  item2: {
    title: string;
  };
  user1: {
    name: string;
  };
  user2: {
    name: string;
  };
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'listings'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showItemDeleteConfirm, setShowItemDeleteConfirm] = useState<string | null>(null);
  const [showSwapDeleteConfirm, setShowSwapDeleteConfirm] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }

      // Fetch items
      const itemsResponse = await fetch('/api/admin/items');
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        setItems(itemsData.items || itemsData);
      }

      // Fetch swaps
      const swapsResponse = await fetch('/api/admin/swaps');
      if (swapsResponse.ok) {
        const swapsData = await swapsResponse.json();
        setSwaps(swapsData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'approve' | 'suspend' | 'delete') => {
    if (action === 'delete' && !showDeleteConfirm) {
      setShowDeleteConfirm(userId);
      return;
    }

    try {
      setActionLoading(userId);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Action completed successfully');
        fetchData(); // Refresh data
        setShowDeleteConfirm(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Action failed');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred while performing the action');
    } finally {
      setActionLoading(null);
    }
  };

  const handleItemAction = async (itemId: string, action: 'approve' | 'reject' | 'delete') => {
    if (action === 'delete' && !showItemDeleteConfirm) {
      setShowItemDeleteConfirm(itemId);
      return;
    }

    try {
      setActionLoading(itemId);
      const response = await fetch(`/api/admin/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Action completed successfully');
        fetchData(); // Refresh data
        setShowItemDeleteConfirm(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Action failed');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('An error occurred while performing the action');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSwapAction = async (swapId: string, action: 'approve' | 'reject' | 'complete' | 'delete') => {
    if (action === 'delete' && !showSwapDeleteConfirm) {
      setShowSwapDeleteConfirm(swapId);
      return;
    }

    try {
      setActionLoading(swapId);
      const response = await fetch(`/api/admin/swaps/${swapId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Action completed successfully');
        fetchData(); // Refresh data
        setShowSwapDeleteConfirm(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Action failed');
      }
    } catch (error) {
      console.error('Error updating swap:', error);
      alert('An error occurred while performing the action');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
      setSelectAll(false);
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
      setSelectAll(true);
    }
  };

  const handleItemSelect = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === items.length);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      alert('Please select items to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedItems.size} selected items?`)) {
      return;
    }

    try {
      setActionLoading('bulk');
      const promises = Array.from(selectedItems).map(itemId =>
        fetch(`/api/admin/items/${itemId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'delete' }),
        })
      );

      const results = await Promise.allSettled(promises);
      const successful = results.filter(result => result.status === 'fulfilled' && result.value.ok).length;
      const failed = results.length - successful;

      if (failed > 0) {
        alert(`Successfully deleted ${successful} items. Failed to delete ${failed} items.`);
      } else {
        alert(`Successfully deleted ${successful} items.`);
      }

      setSelectedItems(new Set());
      setSelectAll(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error bulk deleting items:', error);
      alert('An error occurred while deleting items');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg mb-4">Please log in to access the admin panel</p>
        <Link href="/login" className="text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/DesignImages/HeaderPluesPage4.png" 
                  width="120" 
                  height="32" 
                  alt="ReWear Logo" 
                  className="drop-shadow-lg"
                />
              </Link>
              <span className="ml-4 text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">Admin Panel</span>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-white/80 hover:text-white font-semibold transition underline-offset-8 hover:underline">
                Back to Site
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-20 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-4 font-semibold text-lg transition-all duration-200 ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-700 bg-gradient-to-r from-blue-100 to-blue-50 shadow-md'
                  : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300 bg-transparent'
              }`}
            >
              Manage Users
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-4 font-semibold text-lg transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'border-purple-500 text-purple-700 bg-gradient-to-r from-purple-100 to-purple-50 shadow-md'
                  : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300 bg-transparent'
              }`}
            >
              Manage Orders
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-4 px-1 border-b-4 font-semibold text-lg transition-all duration-200 ${
                activeTab === 'listings'
                  ? 'border-pink-500 text-pink-700 bg-gradient-to-r from-pink-100 to-pink-50 shadow-md'
                  : 'border-transparent text-gray-500 hover:text-pink-600 hover:border-pink-300 bg-transparent'
              }`}
            >
              Manage Listings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 border-t-4 border-purple-400"></div>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 transition-transform hover:scale-105 border border-blue-100 flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-lg flex items-center justify-center">
                  <FaUser className="w-8 h-8 text-white animate-bounce" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-700">Total Users</p>
                  <p className="text-3xl font-extrabold text-blue-700">{users.length}</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 transition-transform hover:scale-105 border border-green-100 flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-lg flex items-center justify-center">
                  <FaTshirt className="w-8 h-8 text-white animate-bounce" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-700">Total Items</p>
                  <p className="text-3xl font-extrabold text-green-700">{items.length}</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 transition-transform hover:scale-105 border border-purple-100 flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-lg flex items-center justify-center">
                  <FaExchangeAlt className="w-8 h-8 text-white animate-bounce" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-700">Total Swaps</p>
                  <p className="text-3xl font-extrabold text-purple-700">{swaps.length}</p>
                </div>
              </div>
            </div>

            {/* Manage Users Section */}
            {activeTab === 'users' && (
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-extrabold text-blue-700 drop-shadow">Manage Users</h1>
                  <p className="text-gray-600">Manage user accounts and permissions</p>
                </div>
                <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-blue-100">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-blue-100 text-base">
                      <thead className="bg-gradient-to-r from-blue-50 to-purple-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Points</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/80 divide-y divide-blue-50">
                        {users.map((user, idx) => (
                          <tr key={user.id} className={idx % 2 === 0 ? 'bg-blue-50/40' : 'bg-white/60'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center shadow">
                                    {user.profilePic ? (
                                      <Image
                                        src={user.profilePic}
                                        width="40"
                                        height="40"
                                        alt={user.name}
                                        className="rounded-full"
                                      />
                                    ) : (
                                      <span className="text-blue-700 text-lg font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-base font-bold text-blue-900">{user.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-blue-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-blue-900">{user.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-blue-900">{user.points}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-blue-900">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full shadow ${
                                user.status === 'active' ? 'bg-gradient-to-r from-green-300 to-green-500 text-green-900' :
                                user.status === 'suspended' ? 'bg-gradient-to-r from-red-300 to-red-500 text-red-900' :
                                'bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium space-x-2 flex items-center">
                              <button
                                onClick={() => handleUserAction(user.id, 'approve')}
                                disabled={actionLoading === user.id}
                                className="flex items-center gap-1 text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 px-3 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                              >
                                <MdCheckCircle className="w-4 h-4" />
                                {actionLoading === user.id ? 'Processing...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                disabled={actionLoading === user.id}
                                className="flex items-center gap-1 text-yellow-900 bg-gradient-to-r from-yellow-200 to-yellow-400 hover:from-yellow-300 hover:to-yellow-500 px-3 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                              >
                                <MdCancel className="w-4 h-4" />
                                {actionLoading === user.id ? 'Processing...' : 'Suspend'}
                              </button>
                              {showDeleteConfirm === user.id ? (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => handleUserAction(user.id, 'delete')}
                                    disabled={actionLoading === user.id}
                                    className="flex items-center gap-1 text-white bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 px-2 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                                  >
                                    <MdDelete className="w-4 h-4" />
                                    {actionLoading === user.id ? 'Deleting...' : 'Confirm'}
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-md text-xs font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleUserAction(user.id, 'delete')}
                                  disabled={actionLoading === user.id}
                                  className="flex items-center gap-1 text-white bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 px-3 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                                >
                                  <MdDelete className="w-4 h-4" />
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Manage Orders Section */}
            {activeTab === 'orders' && (
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-extrabold text-purple-700 drop-shadow">Manage Orders</h1>
                  <p className="text-gray-600">Manage swap transactions and orders</p>
                </div>
                <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-purple-100">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-purple-100 text-base">
                      <thead className="bg-gradient-to-r from-purple-50 to-pink-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Swap ID</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Items</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Users</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/80 divide-y divide-purple-50">
                        {swaps.map((swap, idx) => (
                          <tr key={swap.id} className={idx % 2 === 0 ? 'bg-purple-50/40' : 'bg-white/60'}>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-purple-900">{swap.id.slice(0, 8)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-purple-900">
                              <div>
                                <div>{swap.item1.title}</div>
                                <div className="text-gray-500">↔</div>
                                <div>{swap.item2.title}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-purple-900">
                              <div>
                                <div>{swap.user1.name}</div>
                                <div className="text-gray-500">↔</div>
                                <div>{swap.user2.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full shadow ${
                                swap.status === 'COMPLETED' ? 'bg-gradient-to-r from-green-300 to-green-500 text-green-900' :
                                swap.status === 'PENDING' ? 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900' :
                                swap.status === 'REJECTED' ? 'bg-gradient-to-r from-red-300 to-red-500 text-red-900' :
                                'bg-gradient-to-r from-blue-300 to-blue-500 text-blue-900'
                              }`}>
                                {swap.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-purple-900">{new Date(swap.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium space-x-2 flex items-center">
                              <button
                                onClick={() => handleSwapAction(swap.id, 'approve')}
                                disabled={actionLoading === swap.id}
                                className="flex items-center gap-1 text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 px-3 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                              >
                                <MdCheckCircle className="w-4 h-4" />
                                {actionLoading === swap.id ? 'Processing...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleSwapAction(swap.id, 'reject')}
                                disabled={actionLoading === swap.id}
                                className="flex items-center gap-1 text-red-900 bg-gradient-to-r from-red-200 to-red-400 hover:from-red-300 hover:to-red-500 px-3 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                              >
                                <MdCancel className="w-4 h-4" />
                                {actionLoading === swap.id ? 'Processing...' : 'Reject'}
                              </button>
                              <button
                                onClick={() => handleSwapAction(swap.id, 'complete')}
                                disabled={actionLoading === swap.id}
                                className="flex items-center gap-1 text-white bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 px-3 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                              >
                                <MdEdit className="w-4 h-4" />
                                {actionLoading === swap.id ? 'Processing...' : 'Complete'}
                              </button>
                              {showSwapDeleteConfirm === swap.id ? (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => handleSwapAction(swap.id, 'delete')}
                                    disabled={actionLoading === swap.id}
                                    className="flex items-center gap-1 text-white bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 px-2 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                                  >
                                    <MdDelete className="w-4 h-4" />
                                    {actionLoading === swap.id ? 'Deleting...' : 'Confirm'}
                                  </button>
                                  <button
                                    onClick={() => setShowSwapDeleteConfirm(null)}
                                    className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-md text-xs font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleSwapAction(swap.id, 'delete')}
                                  disabled={actionLoading === swap.id}
                                  className="flex items-center gap-1 text-white bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 px-3 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                                >
                                  <MdDelete className="w-4 h-4" />
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Manage Listings Section */}
            {activeTab === 'listings' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-extrabold text-pink-700 drop-shadow">Manage Listings</h1>
                    <p className="text-gray-600">Manage item listings and approvals</p>
                  </div>
                  {selectedItems.size > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      disabled={actionLoading === 'bulk'}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading === 'bulk' ? 'Deleting...' : `Delete Selected (${selectedItems.size})`}
                    </button>
                  )}
                </div>
                <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-pink-100">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-pink-100 text-base">
                      <thead className="bg-gradient-to-r from-pink-50 to-purple-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-pink-700 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-pink-700 uppercase tracking-wider">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-pink-700 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-pink-700 uppercase tracking-wider">Condition</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-pink-700 uppercase tracking-wider">Points</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-pink-700 uppercase tracking-wider">Owner</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-pink-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-pink-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/80 divide-y divide-pink-50">
                        {items.map((item, idx) => (
                          <tr key={item.id} className={idx % 2 === 0 ? 'bg-pink-50/40' : 'bg-white/60'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedItems.has(item.id)}
                                onChange={() => handleItemSelect(item.id)}
                                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-200 to-purple-200 flex items-center justify-center shadow">
                                    <FaTshirt className="text-gray-500 text-sm" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-base font-medium text-pink-900">{item.title}</div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-pink-900">{item.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-pink-900">{item.condition}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-pink-900">{item.points}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-pink-900">{item.user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full shadow ${
                                item.status === 'AVAILABLE' ? 'bg-gradient-to-r from-green-300 to-green-500 text-green-900' :
                                item.status === 'PENDING' ? 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900' :
                                item.status === 'SWAPPED' ? 'bg-gradient-to-r from-blue-300 to-blue-500 text-blue-900' :
                                'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium space-x-2 flex items-center">
                              <button
                                onClick={() => handleItemAction(item.id, 'approve')}
                                disabled={actionLoading === item.id}
                                className="flex items-center gap-1 text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 px-3 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                              >
                                <MdCheckCircle className="w-4 h-4" />
                                {actionLoading === item.id ? 'Processing...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleItemAction(item.id, 'reject')}
                                disabled={actionLoading === item.id}
                                className="flex items-center gap-1 text-yellow-900 bg-gradient-to-r from-yellow-200 to-yellow-400 hover:from-yellow-300 hover:to-yellow-500 px-3 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                              >
                                <MdCancel className="w-4 h-4" />
                                {actionLoading === item.id ? 'Processing...' : 'Reject'}
                              </button>
                              {showItemDeleteConfirm === item.id ? (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => handleItemAction(item.id, 'delete')}
                                    disabled={actionLoading === item.id}
                                    className="flex items-center gap-1 text-white bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 px-2 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                                  >
                                    <MdDelete className="w-4 h-4" />
                                    {actionLoading === item.id ? 'Deleting...' : 'Confirm'}
                                  </button>
                                  <button
                                    onClick={() => setShowItemDeleteConfirm(null)}
                                    className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-md text-xs font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleItemAction(item.id, 'delete')}
                                  disabled={actionLoading === item.id}
                                  className="flex items-center gap-1 text-white bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 px-3 py-1 rounded-md text-xs font-bold shadow transition disabled:opacity-50"
                                >
                                  <MdDelete className="w-4 h-4" />
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2024 ReWear. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 