'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function MerchPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Merch Launcher
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Launch and manage your merchandise collection
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-accent text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Create Merch
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'bg-accent text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Manage Collection
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'create' ? (
            <CreateMerchTab />
          ) : (
            <ManageMerchTab />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CreateMerchTab() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Merch Item</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              rows={4}
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                <option value="apparel">Apparel</option>
                <option value="accessories">Accessories</option>
                <option value="collectibles">Collectibles</option>
                <option value="digital">Digital</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent hover:opacity-90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Launch Merch Item
          </button>
        </form>
      </div>
    </div>
  );
}

function ManageMerchTab() {
  // Placeholder for managing existing merch items
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Merch Collection</h2>
        
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No merchandise items yet</p>
          <p className="text-gray-400 text-sm">
            Create your first merch item to get started
          </p>
        </div>
      </div>
    </div>
  );
}
