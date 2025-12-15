import React from 'react';
import { ChevronRight } from 'lucide-react';

const OrdersList = ({ orders, onOrderClick, isLoading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate item count and total for each order
  const getOrderStats = (orderNumber) => {
    const orderItems = orders.filter(item => item.order_number === orderNumber);
    const itemCount = orderItems.length;
    const orderTotal = orderItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
    return { itemCount, orderTotal };
  };

  // Get unique orders
  const uniqueOrders = Array.from(
    new Map(
      orders.map(order => [
        order.order_number,
        {
          order_number: order.order_number,
          order_date: order.order_date,
          status: order.status || 'pending',
          delivery_date: order.delivery_date,
          items: orders.filter(item => item.order_number === order.order_number),
        },
      ])
    ).values()
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm p-8">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
        </div>
      </div>
    );
  }

  if (uniqueOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm p-8">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No orders found</p>
          <p className="text-gray-500 text-sm mt-2">Your orders will appear here once you make a purchase</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-6 gap-4 bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700 text-sm">
        <div>Order Number</div>
        <div>Order Date</div>
        <div>Status</div>
        <div>Delivery Date</div>
        <div>Items</div>
        <div className="text-right">Total</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {uniqueOrders.map((order) => {
          const { itemCount, orderTotal } = getOrderStats(order.order_number);
          return (
            <div
              key={order.order_number}
              onClick={() => onOrderClick(order)}
              className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors items-center"
            >
              {/* Order Number */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">#{order.order_number}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              {/* Order Date */}
              <div className="text-gray-600 text-sm">{formatDate(order.order_date)}</div>

              {/* Status */}
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              {/* Delivery Date */}
              <div className="text-gray-600 text-sm">
                {order.delivery_date ? formatDate(order.delivery_date) : 'N/A'}
              </div>

              {/* Item Count */}
              <div className="text-gray-600 text-sm">{itemCount} items</div>

              {/* Order Total */}
              <div className="text-right font-semibold text-gray-900">€{orderTotal.toFixed(2)}</div>
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3 p-4">
        {uniqueOrders.map((order) => {
          const { itemCount, orderTotal } = getOrderStats(order.order_number);
          return (
            <div
              key={order.order_number}
              onClick={() => onOrderClick(order)}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-gray-900">#{order.order_number}</div>
                  <div className="text-sm text-gray-600">{formatDate(order.order_date)}</div>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{itemCount} items</span>
                <span className="font-semibold text-gray-900">€{orderTotal.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersList;

