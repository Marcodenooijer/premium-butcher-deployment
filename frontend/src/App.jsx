import { useState, useEffect } from 'react';
import api from './services/api';
import { useAuth } from './contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "./components/ui/switch";
import { 
  User, 
  Heart, 
  ShoppingBag, 
  Settings, 
  Award,
  Edit2,
  Save,
  Download,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Package,
  Leaf,
  Star,
  Gift,
  Bell,
  CreditCard,
  Truck,
  Users,
  ChefHat,
  Flame,
  LogOut,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import './App.css';

import PremiumHeaderBlocks from './components/PremiumHeaderBlocks';
import MeatPreferences from './components/MeatPreferences';
import CulinaryProfile from './components/CulinaryProfile';
function App() {
  const { logout } = useAuth();
  // Get customer ID from URL parameter or default to 1
  
  // State management
  const [customerData, setCustomerData] = useState(null);
  const [sustainabilityData, setSustainabilityData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({ name: '', relationship: '', age: '', gender: '', dietary_requirements: '' });
  
  // Load data from API on component mount
  useEffect(() => {
    loadAllData();
  }, []);
  
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [customer, family, customerOrders, customerSubscriptions, sustainability] = await Promise.all([
        api.getProfile(),
        api.getFamilyMembers(),
        api.getOrders({ limit: 10 }),
        api.getSubscriptions(),
        api.getSustainability(),
      ]);
      
      setCustomerData(customer);
      setFamilyMembers(family);
      setOrders(customerOrders);
      setSubscriptions(customerSubscriptions);
      setSustainabilityData(sustainability);
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update customer profile via API
      const updatedCustomer = await api.updateProfile(customerData);
      setCustomerData(updatedCustomer);
      
      setIsEditing(false);
      alert('✅ Profile updated successfully!');
      
    } catch (err) {
      console.error('Error saving:', err);
      alert(`❌ Failed to save changes: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(customerData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer-profile-${customerData.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
  };


  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Add family member handler
  const handleAddFamilyMember = async () => {
    try {
      const memberData = {
        ...newMember,
        age: parseInt(newMember.age),
        dietary_requirements: newMember.dietary_requirements ? newMember.dietary_requirements.split(",").map(r => r.trim()) : []
      };
      
      await api.addFamilyMember(memberData);
      await loadAllData();
      setShowAddFamilyModal(false);
      setNewMember({ name: "", relationship: "", age: "", gender: "", dietary_requirements: "" });
    } catch (error) {
      console.error("Error adding family member:", error);
      alert("Failed to add family member");
    }
  };

  // Delete family member handler
  const handleDeleteFamilyMember = async (memberId) => {
    if (!confirm("Are you sure you want to remove this family member?")) return;
    
    try {
      await api.deleteFamilyMember(memberId);
      await loadAllData();
    } catch (error) {
      console.error("Error deleting family member:", error);
      alert("Failed to delete family member");
    }
  };
  const getLoyaltyColor = (tier) => {
    const colors = {
      'Bronze': 'bg-orange-100 text-orange-800',
      'Silver': 'bg-gray-100 text-gray-800',
      'Gold': 'bg-yellow-100 text-yellow-800',
      'Platinum': 'bg-purple-100 text-purple-800'
    };
    return colors[tier] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Delivered': 'bg-green-100 text-green-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[oklch(0.35_0.12_15)] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAllData}
            className="px-6 py-3 bg-[oklch(0.35_0.12_15)] text-white rounded-lg hover:bg-[oklch(0.30_0.12_15)] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Show "no data" state
  if (!customerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-gray-400 text-5xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Not Found</h2>
          <p className="text-gray-600 mb-4">No customer data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[oklch(0.35_0.12_15)] via-[oklch(0.38_0.14_20)] to-[oklch(0.42_0.10_10)] relative overflow-hidden text-white">
        {/* Premium decorative overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)'}}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{customerData.name}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {customerData.email}
                </span>
                {customerData.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {customerData.phone}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    onClick={() => setIsEditing(false)} 
                    variant="outline"
                    disabled={saving}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white text-[oklch(0.35_0.12_15)] hover:bg-white/90"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[oklch(0.35_0.12_15)] mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => window.open('https://www.biologischvleeschatelier.nl/', '_blank' )}
                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                  <Button 
                    onClick={handleDownload}
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-[oklch(0.35_0.12_15)] hover:bg-white/90"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}

            </div>
          </div>

          {/* Premium Header Blocks */}
          <PremiumHeaderBlocks />
          
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Loyalty</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={customerData.name || ''}
                          onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-700">{customerData.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={customerData.email || ''}
                          onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-700">{customerData.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={customerData.phone || ''}
                          onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-700">{customerData.phone || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={customerData.date_of_birth || ''}
                          onChange={(e) => setCustomerData({...customerData, date_of_birth: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-700">{formatDate(customerData.date_of_birth)}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={customerData.address || ''}
                        onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-700">{customerData.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={customerData.city || ''}
                          onChange={(e) => setCustomerData({...customerData, city: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-700">{customerData.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postal_code">Postal Code</Label>
                      {isEditing ? (
                        <Input
                          id="postal_code"
                          value={customerData.postal_code || ''}
                          onChange={(e) => setCustomerData({...customerData, postal_code: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-700">{customerData.postal_code}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      {isEditing ? (
                        <Input
                          id="country"
                          value={customerData.country || ''}
                          onChange={(e) => setCustomerData({...customerData, country: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-700">{customerData.country}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Family Members */}
            
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Family Members
                    </CardTitle>
                    <Button
                      onClick={() => setShowAddFamilyModal(true)}
                      size="sm"
                      className="bg-[oklch(0.35_0.12_15)] hover:bg-[oklch(0.30_0.12_15)] text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {familyMembers && familyMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {familyMembers.map((member) => (
                      <div key={member.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{member.name}</h4>
                            <p className="text-sm text-gray-600">{member.relationship} • Age {member.age}</p>
                          </div>
                          <Button
                            onClick={() => handleDeleteFamilyMember(member.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {member.dietary_requirements && member.dietary_requirements.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Dietary Requirements:</p>
                            <div className="flex flex-wrap gap-1">
                              {member.dietary_requirements.map((req, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">{req}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No family members added yet.</p>
                      <p className="text-sm">Click "Add Member" to get started.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="preferences" className="space-y-6">
            <MeatPreferences 
              preferences={customerData} 
              onChange={setCustomerData}
              isEditing={isEditing}
            />
            <CulinaryProfile 
              preferences={customerData} 
              onChange={setCustomerData}
              isEditing={isEditing}
            />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Your order history and tracking</CardDescription>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{order.order_number}</h4>
                            <p className="text-sm text-gray-600">{formatDate(order.order_date)}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            <p className="text-lg font-bold mt-1">{formatCurrency(order.total_amount)}</p>
                          </div>
                        </div>
                        {order.items && (
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-700">{item.name} × {item.quantity}</span>
                                <span className="text-gray-900 font-medium">{formatCurrency(item.price)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {order.tracking_number && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-gray-500">Tracking: {order.tracking_number}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No orders yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Subscriptions */}
            {subscriptions && subscriptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Active Subscriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscriptions.filter(sub => sub.status === 'active').map((subscription) => (
                      <div key={subscription.id} className="border rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{subscription.subscription_name}</h4>
                            <p className="text-sm text-gray-600 capitalize">{subscription.frequency}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Next delivery: {formatDate(subscription.next_delivery_date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{formatCurrency(subscription.price_per_delivery)}</p>
                            <Badge className="bg-green-600 mt-1">Active</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Loyalty Program
                </CardTitle>
                <CardDescription>Your rewards and benefits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                    <p className="text-sm text-purple-700 mb-1">Points Balance</p>
                    <p className="text-3xl font-bold text-purple-900">{customerData.loyalty_points?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                    <p className="text-sm text-blue-700 mb-1">Member Since</p>
                    <p className="text-3xl font-bold text-blue-900">{new Date(customerData.member_since).getFullYear()}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Lifetime Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{customerData.total_orders}</p>
                    </div>
                  </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Sustainability Impact
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Your contribution to a better planet</p>
                  {sustainabilityData && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-700 mb-1">CO₂ Saved</p>
                        <p className="text-2xl font-bold text-green-900">{sustainabilityData.co2_saved_kg} kg</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-700 mb-1">Local Sourcing</p>
                        <p className="text-2xl font-bold text-blue-900">{sustainabilityData.local_sourcing_percentage}%</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <p className="text-sm text-amber-700 mb-1">Partner Farms</p>
                        <p className="text-2xl font-bold text-amber-900">{sustainabilityData.partner_farms_count}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-700 mb-1">Sustainability Score</p>
                        <p className="text-2xl font-bold text-purple-900">{sustainabilityData.sustainability_score}/100</p>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            
            {/* Delivery Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Instructions
                </CardTitle>
                <CardDescription>Special instructions for delivery</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    value={customerData.delivery_instructions || ''}
                    onChange={(e) => setCustomerData({...customerData, delivery_instructions: e.target.value})}
                    className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent"
                    placeholder="Enter any special delivery instructions..."
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {customerData.delivery_instructions || 'No delivery instructions provided'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Communication Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Communication Preferences
                </CardTitle>
                <CardDescription>Manage how we communicate with you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-amber-600 mt-1" />
                    <div>
                      <p className="font-medium">Marketing Communications</p>
                      <p className="text-sm text-gray-600">Receive promotional emails and special event invitations</p>
                    </div>
                  </div>
                  <Switch
                    checked={customerData.marketing_communications}
                    onCheckedChange={(checked) => setCustomerData({...customerData, marketing_communications: checked})}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium">Marketing Personalization</p>
                      <p className="text-sm text-gray-600">Allow us to suggest products based on your preferences</p>
                    </div>
                  </div>
                  <Switch
                    checked={customerData.marketing_personalization}
                    onCheckedChange={(checked) => setCustomerData({...customerData, marketing_personalization: checked})}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Privacy & Data
                </CardTitle>
                <CardDescription>Manage your personal data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All My Data
                </Button>
                
                <Button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your profile and all data? This action cannot be undone.')) {
                      alert('Delete functionality will be implemented by the backend team.');
                    }
                  }}
                  variant="outline"
                  className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Profile & All Data
                </Button>
              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>
      </div>
      {/* Add Family Member Modal */}
      {showAddFamilyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Family Member</h3>
              <Button
                onClick={() => setShowAddFamilyModal(false)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="member-name">Name *</Label>
                <Input
                  id="member-name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label htmlFor="member-relationship">Relationship *</Label>
                <select
                  id="member-relationship"
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent"
                >
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Partner">Partner</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="member-age">Age *</Label>
                  <Input
                    id="member-age"
                    type="number"
                    value={newMember.age}
                    onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                    placeholder="Age"
                  />
                </div>
                <div>
                  <Label htmlFor="member-gender">Gender</Label>
                  <select
                    id="member-gender"
                    value={newMember.gender}
                    onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="member-dietary">Dietary Requirements</Label>
                <Input
                  id="member-dietary"
                  value={newMember.dietary_requirements}
                  onChange={(e) => setNewMember({ ...newMember, dietary_requirements: e.target.value })}
                  placeholder="e.g., Vegetarian, No nuts (comma separated)"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setShowAddFamilyModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddFamilyMember}
                  className="flex-1 bg-[oklch(0.35_0.12_15)] hover:bg-[oklch(0.30_0.12_15)] text-white"
                  disabled={!newMember.name || !newMember.relationship || !newMember.age}
                >
                  Add Member
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
