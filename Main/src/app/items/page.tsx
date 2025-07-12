'use client';

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaHeart, FaUser, FaMapMarkerAlt, FaTshirt, FaPlus, FaEye } from 'react-icons/fa';

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
  };
}

export default function ItemsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Outerwear', 'Dresses', 'Tops', 'Bottoms', 'Shoes', 'Accessories'];

  if (loading) {
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
              <nav className="flex items-center gap-6">
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
                {!user && (
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading amazing items...</p>
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
              {user && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      <FaHeart className="w-4 h-4" />
                      {user.points} points
                    </div>
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
                    <Link
                      href="/admin"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      Admin Panel
                    </Link>
                  </div>
                </>
              )}
              {!user && (
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Items
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our community's pre-loved fashion items. Find your next favorite piece while supporting sustainable fashion!
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search items, categories, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredItems.length} of {items.length} items
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <FaTshirt className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory 
                ? "Try adjusting your search or filter criteria"
                : "Be the first to list an item in our community!"
              }
            </p>
            {user && (
              <Link
                href="/add-item"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="w-4 h-4" />
                List Your First Item
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="group bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Link href={`/items/${item.id}`}>
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaTshirt className="text-6xl text-gray-400" />
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <Image
                          src={item.user.profilePic || "/DesignImages/UserDashBoardPage6.png"}
                          width="60"
                          height="60"
                          alt={item.user.name}
                          className="rounded-full border-4 border-white shadow-lg"
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm text-green-600 font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                        {item.points} pts
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm shadow-lg flex items-center gap-1">
                        <FaEye className="w-3 h-3" />
                        View Details
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <FaTshirt className="w-3 h-3" />
                        {item.category}
                      </span>
                      <span className="capitalize">{item.condition}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={item.user.profilePic || "/DesignImages/UserDashBoardPage6.png"}
                          width="24"
                          height="24"
                          alt={item.user.name}
                          className="rounded-full border-2 border-white shadow-sm"
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-900">{item.user.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaMapMarkerAlt className="w-3 h-3" />
                            {item.user.location}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{item.points}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {user && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Ready to Share Your Style?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                List your pre-loved items and help others discover amazing fashion while earning points for sustainable actions.
              </p>
              <Link
                href="/add-item"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaPlus className="w-4 h-4" />
                List an Item
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
