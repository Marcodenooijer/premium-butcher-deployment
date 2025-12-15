import React, { useState } from 'react';
import { ShoppingCart, ChevronRight, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const OrdersSection = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const orderTotal = orderItems.reduce((sum, item) => {
      const price = item.total_price || (item.price * item.quantity) || 0;
      return sum + (typeof price === 'string' ? parseFloat(price) : price);
    }, 0);
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

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleReorder = (order) => {
    // Add items back to cart
    const itemsToAdd = order.items || [];
    console.log('Reordering items:', itemsToAdd);

    // You can integrate with your cart system here
    // Example: dispatch(addToCart(itemsToAdd));

    alert(`Added ${itemsToAdd.length} items to cart`);
    setIsModalOpen(false);
  };

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Recent Orders
          </CardTitle>
          <CardDescription>Your order history and tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No orders yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Recent Orders
          </CardTitle>
          <CardDescription>Your order history and tracking</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Order Number</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Order Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Delivery Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {uniqueOrders.map((order) => {
                  const { itemCount, orderTotal } = getOrderStats(order.order_number);
                  return (
                    <tr
                      key={order.order_number}
                      onClick={() => handleOrderClick(order)}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">#{order.order_number}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(order.order_date)}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {order.delivery_date ? formatDate(order.delivery_date) : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{itemCount} items</td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">
                        €{(typeof orderTotal === 'string' ? parseFloat(orderTotal) : orderTotal).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {uniqueOrders.map((order) => {
              const { itemCount, orderTotal } = getOrderStats(order.order_number);
              return (
                <div
                  key={order.order_number}
                  onClick={() => handleOrderClick(order)}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-gray-900">#{order.order_number}</div>
                      <div className="text-sm text-gray-600">{formatDate(order.order_date)}</div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{itemCount} items</span>
                    <span className="font-semibold text-gray-900">€{(typeof orderTotal === 'string' ? parseFloat(orderTotal) : orderTotal).toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.order_number}</h2>
                <p className="text-gray-600 text-sm mt-1">{formatDate(selectedOrder.order_date)}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Status Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Status</p>
                  <p className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Items</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">{selectedOrder.items.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Delivery Date</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {selectedOrder.delivery_date ? formatDate(selectedOrder.delivery_date) : 'N/A'}
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700 uppercase tracking-wide font-semibold">Order Total</p>
                  <p className="mt-2 text-2xl font-bold text-amber-900">
                    €{selectedOrder.items.reduce((sum, item) => {
                      const price = item.total_price || (item.price * item.quantity) || 0;
                      return sum + (typeof price === 'string' ? parseFloat(price) : price);
                    }, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3 border border-gray-200 rounded-lg overflow-hidden">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className={`px-4 py-3 flex justify-between items-center ${
                        index !== selectedOrder.items.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-xs text-gray-500 mt-1">SKU: {item.product_sku}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-600">
                          {item.quantity} × €{(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toFixed(2)}
                        </p>
                        <p className="font-semibold text-gray-900">€{(typeof (item.total_price || item.quantity * item.price) === 'string' ? parseFloat(item.total_price || item.quantity * item.price) : (item.total_price || item.quantity * item.price)).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Subtotal</span>
                  <span className="text-gray-900">
                    €{selectedOrder.items.reduce((sum, item) => {
                      const price = item.total_price || (item.price * item.quantity) || 0;
                      return sum + (typeof price === 'string' ? parseFloat(price) : price);
                    }, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-700 font-medium">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-amber-900">
                    €{selectedOrder.items.reduce((sum, item) => {
                      const price = item.total_price || (item.price * item.quantity) || 0;
                      return sum + (typeof price === 'string' ? parseFloat(price) : price);
                    }, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleReorder(selectedOrder)}
                className="flex-1 px-4 py-3 bg-amber-700 text-white font-medium rounded-lg hover:bg-amber-800 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Reorder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersSection;

