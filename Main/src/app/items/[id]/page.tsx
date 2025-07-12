'use client';

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaHeart, FaExchangeAlt, FaUser, FaMapMarkerAlt, FaTshirt, FaTag, FaCalendarAlt, FaPlus, FaTimes, FaCheck } from 'react-icons/fa';

interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  size: string;
  condition: string;
  status: string;
  points: number;
  tags: string[];
  createdAt: string;
  user: {
    id: string;
    name: string;
    location: string;
    profilePic?: string;
    bio?: string;
  };
}

interface UserItem {
  id: string;
  title: string;
  images: string[];
  points: number;
}

export default function Page({ params }: { params?: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      if (params) {
        const resolvedParams = await params;
        try {
          const response = await fetch(`/api/items/${resolvedParams.id}`);
          if (response.ok) {
            const itemData = await response.json();
            setItem(itemData);
          }
        } catch (error) {
          console.error('Error loading item:', error);
        }
      }
    };
    loadItem();
  }, [params]);

  useEffect(() => {
    const loadUserItems = async () => {
      if (user) {
        try {
          const response = await fetch('/api/items');
          if (response.ok) {
            const allItems = await response.json();
            const userOwnedItems = allItems
              .filter((item: Item) => item.userId === user.id && item.status === 'available')
              .map((item: Item, index: number) => ({
                id: item.id,
                title: item.title,
                images: [item.images[index % item.images.length]], // Cycle through images
                points: item.points
              }));
            setUserItems(userOwnedItems);
          }
        } catch (error) {
          console.error('Error loading user items:', error);
        }
      }
    };
    loadUserItems();
  }, [user]);

  const handleSwapRequest = async () => {
    if (!user || !item || !selectedItemId) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId1: selectedItemId,
          itemId2: item.id,
          userId1: user.id,
          userId2: item.userId
        }),
      });

      if (response.ok) {
        setShowSwapModal(false);
        router.push('/dashboard');
      } else {
        throw new Error('Swap request failed');
      }
    } catch (error) {
      console.error('Swap request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading item details...</p>
          </div>
        </main>
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
                Browse Items
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/add-item"
                    className="inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add Item
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/items" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="w-full aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaTshirt className="text-8xl text-gray-400" />
                </div>
                <div className="absolute bottom-8 right-8">
                  <Image
                    src={item.user.profilePic || "/DesignImages/UserDashBoardPage6.png"}
                    width="120"
                    height="120"
                    alt={item.user.name}
                    className="rounded-full border-6 border-white shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{item.title}</h1>
                <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                  {item.points} pts
                </div>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Item Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <FaTshirt className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="font-semibold text-gray-900">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTag className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Size:</span>
                  <span className="font-semibold text-gray-900">{item.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHeart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">Condition:</span>
                  <span className="font-semibold text-gray-900 capitalize">{item.condition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Listed:</span>
                  <span className="font-semibold text-gray-900">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Owner Information */}
            {item.user && (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUser className="w-5 h-5 text-blue-600" />
                  Item Owner
                </h3>
                <div className="flex items-center gap-4">
                  <Image
                    src={item.user.profilePic || "/DesignImages/UserDashBoardPage6.png"}
                    width="60"
                    height="60"
                    alt={item.user.name}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{item.user.name}</p>
                    <p className="text-gray-600 flex items-center gap-1">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      {item.user.location}
                    </p>
                    {item.user.bio && (
                      <p className="text-sm text-gray-500 mt-1">{item.user.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              {user && user.id !== item.userId ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <FaExchangeAlt className="w-5 h-5" />
                    Request Swap
                  </button>
                  <button className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 bg-white/80 backdrop-blur-sm flex items-center justify-center gap-2">
                    <FaHeart className="w-5 h-5" />
                    Add to Wishlist
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-lg">This is your item</p>
                  <p className="text-sm text-gray-400">You can't swap with yourself</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Select Item to Swap</h3>
              <button
                onClick={() => setShowSwapModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            {userItems.length === 0 ? (
              <div className="text-center py-8">
                <FaTshirt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You don't have any items available for swap.</p>
                <Link
                  href="/add-item"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaPlus className="w-4 h-4" />
                  List an Item
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Choose one of your items to swap with "{item.title}":</p>
                {userItems.map((userItem) => (
                  <div
                    key={userItem.id}
                    onClick={() => setSelectedItemId(userItem.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedItemId === userItem.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={userItem.images[0] || "/DesignImages/UserDashBoardPage6.png"}
                        width="60"
                        height="60"
                        alt={userItem.title}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{userItem.title}</h4>
                        <p className="text-sm text-gray-600">{userItem.points} points</p>
                      </div>
                      {selectedItemId === userItem.id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <FaCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowSwapModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSwapRequest}
                    disabled={!selectedItemId || loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Request...
                      </div>
                    ) : (
                      'Send Swap Request'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
