import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import OrdersList from './OrdersList';
import OrderModal from './OrderModal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    inTransit: 0,
    delivered: 0,
    totalSpent: 0,
  });

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/profile/orders?limit=50&offset=0', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);

      // Calculate statistics
      calculateStats(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (orderData) => {
    // Get unique orders
    const uniqueOrders = Array.from(
      new Map(
        orderData.map(order => [order.order_number, order])
      ).values()
    );

    const totalOrders = uniqueOrders.length;
    const inTransit = uniqueOrders.filter(o => o.status === 'shipped' || o.status === 'processing').length;
    const delivered = uniqueOrders.filter(o => o.status === 'delivered').length;

    // Calculate total spent
    const totalSpent = orderData.reduce((sum, item) => sum + (item.total_price || 0), 0);

    setStats({
      totalOrders,
      inTransit,
      delivered,
      totalSpent,
    });
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleReorder = (order) => {
    // Add items back to cart
    const itemsToAdd = order.items || [];
    console.log('Reordering items:', itemsToAdd);

    // You can dispatch an action to add items to cart
    // Example: dispatch(addToCart(itemsToAdd));

    // Show success message
    alert(`Added ${itemsToAdd.length} items to cart`);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-amber-700" />
          Recent Orders
        </h1>
        <p className="text-gray-600 mt-2">Your order history and tracking</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Total Orders */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
              </svg>
            </div>
          </div>
        </div>

        {/* In Transit */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Transit</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inTransit}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Delivered */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Delivered</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.delivered}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">€{stats.totalSpent.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Orders List */}
      <OrdersList
        orders={orders}
        onOrderClick={handleOrderClick}
        isLoading={isLoading}
      />

      {/* Order Modal */}
      <OrderModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReorder={handleReorder}
      />
    </div>
  );
};

export default Orders;

