'use client';

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Item, Swap } from "@/lib/auth";
import PointsInfo from "@/components/PointsInfo";
import { FaTshirt, FaExchangeAlt, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaClock, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaHeart } from 'react-icons/fa';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [userSwaps, setUserSwaps] = useState<Swap[]>([]);
  const [pointsTransactions, setPointsTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [swapsLoading, setSwapsLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserItems();
      fetchUserSwaps();
      fetchPointsTransactions();
    }
  }, [user]);

  const fetchUserItems = async () => {
    if (!user) return;
    
    try {
      setItemsLoading(true);
      const response = await fetch(`/api/items?userId=${user.id}`);
      if (response.ok) {
        const items = await response.json();
        setUserItems(items);
      } else {
        console.error('Failed to fetch user items');
      }
    } catch (error) {
      console.error('Error fetching user items:', error);
    } finally {
      setItemsLoading(false);
    }
  };

  const fetchUserSwaps = async () => {
    if (!user) return;
    
    try {
      setSwapsLoading(true);
      const response = await fetch(`/api/swaps?userId=${user.id}`);
      if (response.ok) {
        const swaps = await response.json();
        setUserSwaps(swaps);
      } else {
        console.error('Failed to fetch user swaps');
      }
    } catch (error) {
      console.error('Error fetching user swaps:', error);
    } finally {
      setSwapsLoading(false);
    }
  };

  const fetchPointsTransactions = async () => {
    if (!user) return;
    
    try {
      setTransactionsLoading(true);
      const response = await fetch(`/api/points?userId=${user.id}`);
      if (response.ok) {
        const transactions = await response.json();
        setPointsTransactions(transactions);
      } else {
        console.error('Failed to fetch points transactions');
      }
    } catch (error) {
      console.error('Error fetching points transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleSwapAction = async (swapId: string, action: 'accept' | 'reject') => {
    setLoading(swapId);
    try {
      const status = action === 'accept' ? 'accepted' : 'rejected';
      const response = await fetch(`/api/swaps/${swapId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        // Refresh swaps data
        fetchUserSwaps();
      } else {
        console.error('Failed to update swap status');
      }
    } catch (error) {
      console.error('Failed to update swap status:', error);
    } finally {
      setLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your dashboard</h2>
          <Link 
            href="/login" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
        <Link href="/" className="flex items-center justify-center">
              <Image 
                src="/DesignImages/HeaderPluesPage4.png" 
                width="150" 
                height="40" 
                alt="ReWear Logo" 
                className="drop-shadow-sm"
              />
        </Link>
            <nav className="flex items-center gap-6">
          <Link
            href="/items"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            Browse
          </Link>
          <Link
            href="/add-item"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
                <FaPlus className="w-4 h-4" />
            Add Item
          </Link>
              <Link
                href="/admin"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Admin Panel
              </Link>
              <button
                onClick={logout}
                className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors duration-200"
              >
                Logout
              </button>
        </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your sustainable fashion journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                <Image
                    src={user.profilePic || "/DesignImages/UserDashBoardPage6.png"}
                    width="120"
                    height="120"
                  alt={user.name}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center justify-center gap-2 text-gray-600 mt-1">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                {user.bio && (
                  <p className="mt-3 text-sm text-gray-600 text-center max-w-xs">
                    {user.bio}
                  </p>
                )}
              </div>
              
              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Points Balance</span>
                    <span className="text-2xl font-bold text-blue-600">{user.points}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Items Listed</span>
                    <span className="text-2xl font-bold text-green-600">{userItems.length}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Total Swaps</span>
                    <span className="text-2xl font-bold text-purple-600">{userSwaps.length}</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                <FaCalendarAlt className="w-4 h-4 inline mr-1" />
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </div>
              
              <div className="mt-6">
                <PointsInfo currentPoints={user.points} />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Items Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaTshirt className="w-6 h-6 text-blue-600" />
                  My Items
                </h2>
                <Link
                  href="/add-item"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FaPlus className="w-4 h-4" />
                  Add New
                </Link>
              </div>
              
              {itemsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : userItems.length === 0 ? (
                <div className="text-center py-12">
                  <FaTshirt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h3>
                  <p className="text-gray-600 mb-4">Start your sustainable fashion journey by listing your first item</p>
                  <Link
                    href="/add-item"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FaPlus className="w-4 h-4" />
                    List Your First Item
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {userItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center shadow-sm">
                        <FaTshirt className="text-2xl text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'available' ? 'bg-green-100 text-green-800' :
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-green-600 font-semibold">{item.points}</span>
                            <span>points</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Activity Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaExchangeAlt className="w-6 h-6 text-purple-600" />
                  Swap Activity
                </h2>
              </div>
              
              {swapsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : userSwaps.length === 0 ? (
                <div className="text-center py-12">
                  <FaExchangeAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No swap activity yet</h3>
                  <p className="text-gray-600">Start browsing items to make your first swap!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSwaps.map((swap) => {
                    const isIncoming = swap.userId2 === user.id;
                    
                    return (
                      <div key={swap.id} className="p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FaExchangeAlt className="w-5 h-5 text-purple-600" />
                            <span className="font-semibold text-gray-900">Swap #{swap.id.slice(0, 8)}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {swap.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <FaTshirt className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">Item {swap.itemId1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaTshirt className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-700">Item {swap.itemId2}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="w-4 h-4" />
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </span>
                          {isIncoming && swap.status === 'pending' && (
                            <span className="text-blue-600 font-medium">Incoming request</span>
                          )}
                        </div>
                        
                        {swap.status === 'pending' && isIncoming && (
                          <div className="flex gap-2 mt-3">
                            <button 
                              onClick={() => handleSwapAction(swap.id, 'accept')}
                              disabled={loading === swap.id}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              <FaCheck className="w-4 h-4" />
                              {loading === swap.id ? 'Processing...' : 'Accept'}
                            </button>
                            <button 
                              onClick={() => handleSwapAction(swap.id, 'reject')}
                              disabled={loading === swap.id}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              <FaTimes className="w-4 h-4" />
                              {loading === swap.id ? 'Processing...' : 'Decline'}
                            </button>
                          </div>
                        )}
                        
                        {swap.status === 'pending' && !isIncoming && (
                          <div className="flex items-center gap-2 mt-3 text-yellow-600">
                            <FaClock className="w-4 h-4" />
                            <span className="text-sm font-medium">Waiting for response</span>
                          </div>
                        )}
                        
                        {swap.status === 'accepted' && (
                          <div className="flex items-center gap-2 mt-3 text-green-600">
                            <FaCheck className="w-4 h-4" />
                            <span className="text-sm font-medium">Swap completed successfully!</span>
                          </div>
                        )}
                        
                        {swap.status === 'rejected' && (
                          <div className="flex items-center gap-2 mt-3 text-red-600">
                            <FaTimes className="w-4 h-4" />
                            <span className="text-sm font-medium">Swap was declined</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Points Transaction History */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FaHeart className="text-red-500" />
                Points History
              </h2>
              <div className="text-sm text-gray-600">
                Recent transactions
              </div>
            </div>

            {transactionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : pointsTransactions.length === 0 ? (
              <div className="text-center py-12">
                <FaHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No points transactions yet</h3>
                <p className="text-gray-600">Complete swaps to earn points!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pointsTransactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-red-50 rounded-xl border border-gray-200/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'EARN' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'EARN' ? (
                          <FaHeart className="w-5 h-5 text-green-600" />
                        ) : (
                          <FaTshirt className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {transaction.type === 'EARN' ? '+' : '-'}{transaction.amount} points
                        </p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {transaction.reason}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                      <p className={`text-sm font-medium ${
                        transaction.type === 'EARN' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
