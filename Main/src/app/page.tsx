import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaRecycle, FaHeart, FaUsers, FaTshirt, FaExchangeAlt, FaLeaf, FaHandshake } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="#" className="flex items-center justify-center">
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md">
                <FaRecycle className="text-xl" />
                <span className="text-xl font-bold">ReWear</span>
              </div>
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-purple-100/30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <FaRecycle className="w-4 h-4 mr-2" />
                    Sustainable Fashion Platform
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Give Your Clothes a{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Second Life
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                    ReWear is a community-driven platform for swapping and donating pre-loved clothes. 
                    Join thousands of users making fashion more sustainable, one swap at a time.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/items"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Browse Items
                    <FaArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <Link
                    href="/add-item"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  >
                    List an Item
                  </Link>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <FaUsers className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">10,000+ Members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaHeart className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-600">50,000+ Swaps</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-12 shadow-2xl">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <FaTshirt className="text-3xl text-white" />
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FaRecycle className="text-2xl text-white" />
                        </div>
                      </div>
                      <div className="space-y-6 pt-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FaExchangeAlt className="text-2xl text-white" />
                        </div>
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <FaHeart className="text-3xl text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Sustainable Fashion</h3>
                      <p className="text-gray-600">Join the community</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform makes sustainable fashion simple and accessible. 
                Follow these three easy steps to start your eco-friendly fashion journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <FaRecycle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-md">
                    <FaTshirt className="text-4xl text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">List Your Items</h3>
                <p className="text-gray-600 leading-relaxed">
                  Upload photos and detailed descriptions of clothes you want to swap or donate. 
                  Set your points value and let the community discover your items.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaHeart className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg shadow-md">
                    <FaExchangeAlt className="text-4xl text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Find New Favorites</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse through thousands of items from our community. 
                  Filter by category, size, and condition to find your perfect match.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <FaUsers className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 rounded-lg shadow-md">
                    <FaHandshake className="text-4xl text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Swap & Connect</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with other users to arrange swaps or donations. 
                  Build relationships while reducing fashion waste together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Discover Amazing Items
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Browse through our collection of pre-loved clothing items. 
                Each piece has a story and is waiting for its next chapter.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {/* Replaced clothing images with icons */}
              <div className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-2xl">
                    <FaTshirt className="text-6xl text-gray-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-semibold">Quality Pre-loved Item</p>
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-2xl">
                    <FaExchangeAlt className="text-6xl text-gray-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-semibold">Quality Pre-loved Item</p>
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-2xl">
                    <FaLeaf className="text-6xl text-gray-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-semibold">Quality Pre-loved Item</p>
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-2xl">
                    <FaHandshake className="text-6xl text-gray-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-semibold">Quality Pre-loved Item</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/items"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                View All Items
                <FaArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Start Your Sustainable Fashion Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our community today and be part of the fashion revolution. 
              Every swap makes a difference for our planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Join ReWear Today
                <FaArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/items"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md mb-4 w-fit">
                <FaRecycle className="text-xl" />
                <span className="text-xl font-bold">ReWear</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Making fashion sustainable through community-driven clothing swaps and donations. 
                Join us in creating a better future for fashion.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaRecycle className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <FaHeart className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <FaUsers className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/items" className="hover:text-white transition-colors">Browse Items</Link></li>
                <li><Link href="/add-item" className="hover:text-white transition-colors">Add Item</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 ReWear. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 sm:mt-0">
              Made with ❤️ for a sustainable future
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}