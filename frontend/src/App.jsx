import {useEffect, useState} from 'react';
import api from './services/api';
import {useAuth} from './contexts/AuthContext';
import PWAInstallPrompt from './components/PWAInstallPrompt'; // Add this import
import LoyaltyRedemption from './components/LoyaltyRedemption';
import OrdersSection from './components/OrdersSection';
import {useTracking} from './posthogTracking';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Switch} from "./components/ui/switch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
  Award,
  CreditCard,
  Download,
  Edit2,
  ExternalLink,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Plus,
  QrCode,
  Save,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  TrendingUp,
  User,
  Users,
  X
} from 'lucide-react';
import './App.css';

import Header from './components/Header';
import MeatPreferences from './components/MeatPreferences';
import CulinaryProfile from './components/CulinaryProfile';
import loyaltyApi from "@/services/loyaltyApi.js";

// ISO 639-1 Language Codes (common European languages)
const LANGUAGES = [
  {code: 'nl', name: 'Dutch (Nederlands)'},
  {code: 'en', name: 'English'},
  {code: 'de', name: 'German (Deutsch)'},
  {code: 'fr', name: 'French (Français)'},
  {code: 'es', name: 'Spanish (Español)'},
  {code: 'it', name: 'Italian (Italiano)'},
  {code: 'pt', name: 'Portuguese (Português)'},
  {code: 'pl', name: 'Polish (Polski)'},
  {code: 'ro', name: 'Romanian (Română)'},
  {code: 'el', name: 'Greek (Ελληνικά)'},
  {code: 'sv', name: 'Swedish (Svenska)'},
  {code: 'da', name: 'Danish (Dansk)'},
  {code: 'fi', name: 'Finnish (Suomi)'},
  {code: 'no', name: 'Norwegian (Norsk)'},
  {code: 'cs', name: 'Czech (Čeština)'},
  {code: 'hu', name: 'Hungarian (Magyar)'},
  {code: 'bg', name: 'Bulgarian (Български)'},
  {code: 'sk', name: 'Slovak (Slovenčina)'},
  {code: 'hr', name: 'Croatian (Hrvatski)'},
  {code: 'tr', name: 'Turkish (Türkçe)'},
  {code: 'ar', name: 'Arabic (العربية)'},
  {code: 'zh', name: 'Chinese (中文)'},
];

// ISO 3166-1 Country Codes (European countries)
const NATIONALITIES = [
  {code: 'NL', name: 'Netherlands'},
  {code: 'BE', name: 'Belgium'},
  {code: 'DE', name: 'Germany'},
  {code: 'FR', name: 'France'},
  {code: 'GB', name: 'United Kingdom'},
  {code: 'ES', name: 'Spain'},
  {code: 'IT', name: 'Italy'},
  {code: 'PT', name: 'Portugal'},
  {code: 'PL', name: 'Poland'},
  {code: 'RO', name: 'Romania'},
  {code: 'GR', name: 'Greece'},
  {code: 'SE', name: 'Sweden'},
  {code: 'DK', name: 'Denmark'},
  {code: 'FI', name: 'Finland'},
  {code: 'NO', name: 'Norway'},
  {code: 'CZ', name: 'Czech Republic'},
  {code: 'HU', name: 'Hungary'},
  {code: 'BG', name: 'Bulgaria'},
  {code: 'SK', name: 'Slovakia'},
  {code: 'HR', name: 'Croatia'},
  {code: 'AT', name: 'Austria'},
  {code: 'CH', name: 'Switzerland'},
  {code: 'IE', name: 'Ireland'},
  {code: 'LU', name: 'Luxembourg'},
  {code: 'TR', name: 'Turkey'},
  {code: 'MA', name: 'Morocco'},
  {code: 'DZ', name: 'Algeria'},
  {code: 'SY', name: 'Syria'},
  {code: 'IQ', name: 'Iraq'},
];

// Common European Ethnicities
const ETHNICITIES = [
  'Western European',
  'Southern European',
  'Eastern European',
  'East Asian',
  'Middle Eastern & North African',
  'South Asian',
  'West African',
  'Latin America',
  'Mixed/Multiple',
  'Other',
  'Prefer not to say',
];

function App() {
  const {logout, currentUser} = useAuth();
  // Get customer ID from URL parameter or default to 1
  const {identifyUser, trackProfileView, trackProfileEdit} = useTracking();

  // State management
  const [customerData, setCustomerData] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [languagesData, setLanguagesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [countriesData, setCountriesData] = useState([]);
  const [ethnicitiesData, setEthnicitiesData] = useState([]);
  const [sustainabilityData, setSustainabilityData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [recommendedOrder, setRecommendedOrder] = useState([]);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    date_of_birth: '',
    gender: '',
    requirements: ''
  });
  const [barcodeUrl, setBarcodeUrl] = useState(null);
  const [showBarcode, setShowBarcode] = useState(false);


  const preferences = customerData?.preferences?.['retail'];


  // Load data from API on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (customerData?.country_id) {
      api.getCities(customerData.country_id).then(response => setCitiesData(response.map(city => ({
        id: city.city_id,
        name: city.name
      }))));
    }
  }, [customerData?.country_id]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [customer, enrollments, family, languages, countries, ethnicities, customerOrders, customerSubscriptions, sustainability, recommended] = await Promise.all([
        api.getProfile(),
        loyaltyApi.getEnrollments(),
        api.getFamilyMembers(),
        api.getLanguages(),
        api.getCountries(),
        api.getEthnicities()
        // api.getOrders({ limit: 10 }),
        // api.getSubscriptions(),
        // api.getSustainability(),
        // getRecommendedOrder(),
      ]);

      setCustomerData(customer);
      setEnrollmentData(enrollments[0]);
      setOrders(await api.getOrders(customer.id))
      setFamilyMembers(family);
      setLanguagesData(languages.results);
      setCountriesData(countries.map(country => ({id: country.country_id, name: country.name})));
      setEthnicitiesData(ethnicities.map(ethnicity => ({id: ethnicity.country_id, name: ethnicity.name})));
      // setOrders(customerOrders);
      // setSubscriptions(customerSubscriptions);
      // setSustainabilityData(sustainability);
      // setRecommendedOrder(recommended);

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

      setIsEditingPersonal(false);
      alert('✅ Profile updated successfully!');

    } catch (err) {
      console.error('Error saving:', err);
      alert(`❌ Failed to save changes: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleProfileUpdate = async (updates) => {
    try {
      setSaving(true);

      // Merge updates with existing customer data
      const updatedData = {
        ...customerData,
        preferences: {retail: {...preferences, ...updates}}
      };

      // Update local state immediately for UI responsiveness
      setCustomerData(updatedData);

      // Save to API
      const response = await api.updateProfile(updatedData);
      setCustomerData(response);

      // Show success message
      console.log('✅ Preferences updated successfully!');

    } catch (err) {
      console.error('Error updating preferences:', err);
      // Revert to previous state on error
      await loadAllData();
      alert(`❌ Failed to update preferences: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };


  const handleDownload = () => {
    const dataStr = JSON.stringify(customerData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
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
        relationship: newMember.relationship.toUpperCase(),
        date_of_birth: newMember.date_of_birth,
        requirements: newMember.requirements ? {retail: {dietary_requirements: newMember.requirements.split(",").map(r => r.trim())}} : {}
      };

      await api.addFamilyMember(memberData);
      await loadAllData();
      setShowAddFamilyModal(false);
      setNewMember({name: "", relationship: "", date_of_birth: "", gender: "", requirements: ""});
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

  // Barcode handler
  const handleShowBarcode = async () => {
    try {
      if (!barcodeUrl) {
        const url = await api.getBarcode(enrollmentData.id);
        setBarcodeUrl(url);
      }
      setShowBarcode(true);
    } catch (error) {
      console.error("Error loading barcode:", error);
      alert("Failed to load barcode");
    }
  };

  // Google Wallet handler
  const handleAddToGoogleWallet = async () => {
    try {
      const response = await api.getGoogleWalletPass();
      if (response.saveUrl) {
        window.open(response.saveUrl, '_blank');
      }
    } catch (error) {
      console.error("Error adding to Google Wallet:", error);
      alert("Failed to add to Google Wallet");
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
            <div
                className="animate-spin rounded-full h-16 w-16 border-b-4 border-[oklch(0.35_0.12_15)] mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading your profile...</p>
          </div>
        </div>
    );
  }
  ;

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
        {/* PWA Install Prompt - Shows on all pages */}
        <PWAInstallPrompt/>

        {/* New Header Component */}
        <Header customerData={customerData} enrollment={enrollmentData} onLogout={handleLogout}/>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="w-4 h-4"/>
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Heart className="w-4 h-4"/>
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4"/>
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center gap-2">
                <Award className="w-4 h-4"/>
                <span className="hidden sm:inline">Loyalty</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4"/>
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between w-full">
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5"/>
                        Personal Information
                      </CardTitle>
                      <div className="flex gap-2">
                        {isEditingPersonal ? (
                            <>
                              <Button
                                  onClick={() => setIsEditingPersonal(false)}
                                  variant="outline"
                                  size="sm"
                              >
                                Cancel
                              </Button>
                              <Button
                                  onClick={handleSave}
                                  disabled={saving}
                                  size="sm"
                                  className="bg-[oklch(0.35_0.12_15)] hover:bg-[oklch(0.30_0.12_15)]"
                              >
                                <Save className="w-4 h-4 mr-1"/>
                                {saving ? 'Saving...' : 'Save'}
                              </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => setIsEditingPersonal(true)}
                                variant="outline"
                                size="sm"
                            >
                              <Edit2 className="w-4 h-4 mr-1"/>
                              Edit
                            </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        {isEditingPersonal ? (
                            <Input
                                id="firstName"
                                value={customerData.first_name || ''}
                                onChange={(e) => setCustomerData({
                                  ...customerData,
                                  first_name: e.target.value
                                })}
                                className="mt-1"
                            />
                        ) : (
                            <p className="mt-1 text-gray-700">{customerData.first_name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        {isEditingPersonal ? (
                            <Input
                                id="lastName"
                                value={customerData.last_name || ''}
                                onChange={(e) => setCustomerData({
                                  ...customerData,
                                  last_name: e.target.value
                                })}
                                className="mt-1"
                            />
                        ) : (
                            <p className="mt-1 text-gray-700">{customerData.last_name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        {isEditingPersonal ? (
                            <Input
                                id="email"
                                type="email"
                                value={customerData.email || ''}
                                onChange={(e) => setCustomerData({
                                  ...customerData,
                                  email: e.target.value
                                })}
                                className="mt-1"
                            />
                        ) : (
                            <p className="mt-1 text-gray-700 break-all">{customerData.email}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="secondary_email">Secondary Email</Label>
                        {isEditingPersonal ? (
                            <Input
                                id="secondary_email"
                                type="email"
                                value={customerData.secondary_email || ''}
                                onChange={(e) => setCustomerData({
                                  ...customerData,
                                  secondary_email: e.target.value
                                })}
                                className="mt-1"
                                placeholder="Optional secondary email"
                            />
                        ) : (
                            <p className="mt-1 text-gray-700 break-all">{customerData.secondary_email || 'Not provided'}</p>
                        )}

                        {/* Primary Email Switch - only show if secondary email exists */}
                        {customerData.secondary_email && (
                            <div
                                className="mt-3 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <Label htmlFor="primary_email_switch"
                                       className="text-sm font-medium">
                                  Use secondary email for communications
                                </Label>
                                <p className="text-xs text-gray-500 mt-1">
                                  {customerData.secondary_email_communications
                                      ? `Using: ${customerData.secondary_email}`
                                      : `Using: ${customerData.email}`}
                                </p>
                              </div>
                              <Switch
                                  id="primary_email_switch"
                                  disabled={!isEditingPersonal}
                                  checked={customerData.secondary_email_communications}
                                  onCheckedChange={(checked) => {
                                    setCustomerData({
                                      ...customerData,
                                      secondary_email_communications: checked
                                    });
                                  }}
                              />
                            </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        {isEditingPersonal ? (
                            <Input
                                id="phone"
                                value={customerData.phone || ''}
                                onChange={(e) => setCustomerData({
                                  ...customerData,
                                  phone: e.target.value
                                })}
                                className="mt-1"
                            />
                        ) : (
                            <p className="mt-1 text-gray-700">{customerData.phone || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        {isEditingPersonal ? (
                            <Input
                                id="date_of_birth"
                                type="date"
                                value={customerData.date_of_birth || ''}
                                onChange={(e) => setCustomerData({
                                  ...customerData,
                                  date_of_birth: e.target.value
                                })}
                                className="mt-1"
                            />
                        ) : (
                            <p className="mt-1 text-gray-700">{formatDate(customerData.date_of_birth)}</p>
                        )}
                      </div>
                    </div>

                    {/* NEW FIELDS: Language, Nationality, Ethnicity */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <div>
                        <Label htmlFor="language">Languages</Label>
                        {isEditingPersonal ? (
                            <div className="space-y-3 mt-1">
                              {/* 1. The Select acts as the "Picker" */}
                              <Select
                                  value="" // Keep empty so it resets after each selection
                                  onValueChange={(value) => {
                                    const selectedIds = Array.isArray(customerData.language_ids) ? customerData.language_ids : [];
                                    // Only add if it's not already in the list
                                    if (!selectedIds.includes(value)) {
                                      setCustomerData({
                                        ...customerData,
                                        language_ids: [...selectedIds, value]
                                      });
                                    }
                                  }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Add a language..."/>
                                </SelectTrigger>
                                <SelectContent>
                                  {languagesData.map((lang) => (
                                      <SelectItem key={lang.id} value={lang.id}>
                                        {lang.name}
                                      </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {/* 2. The Pill Container (Edit Mode) */}
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(customerData.language_ids) && customerData.language_ids.map((id) => {
                                  const lang = languagesData.find((l) => l.id === id);
                                  if (!lang) return null;

                                  return (
                                      <button
                                          key={id}
                                          type="button"
                                          onClick={() => {
                                            const filtered = customerData.language_ids.filter((itemId) => itemId !== id);
                                            setCustomerData({
                                              ...customerData,
                                              language_ids: filtered
                                            });
                                          }}
                                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive rounded-full text-xs font-medium transition-colors group"
                                      >
                                        {lang.name}
                                        <span
                                            className="text-muted-foreground group-hover:text-white ml-1">×</span>
                                      </button>
                                  );
                                })}
                              </div>
                            </div>
                        ) : (
                            /* 3. Read-Only Mode */
                            <div className="mt-1 flex flex-wrap gap-1">
                              {Array.isArray(customerData.language_ids) && customerData.language_ids.length > 0 ? (
                                  customerData.language_ids.map((id) => {
                                    const langName = languagesData.find((l) => l.id === id)?.name || id;
                                    return (
                                        <span key={id}
                                              className="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-sm border">
                                        {langName}
                                      </span>
                                    );
                                  })
                              ) : (
                                  <p className="text-gray-500 italic text-sm">Not provided</p>
                              )}
                            </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>
                        {isEditingPersonal ? (
                            <div className="space-y-3 mt-1">
                              {/* 1. The Select acts as the "Adder" */}
                              <Select
                                  value="" // Reset to placeholder after selection
                                  onValueChange={(value) => {
                                    const currentNationalities = Array.isArray(customerData.nationality_ids)
                                        ? customerData.nationality_ids
                                        : (customerData.nationality_ids ? [customerData.nationality_ids] : []);

                                    // Only add if not already selected
                                    if (!currentNationalities.includes(value)) {
                                      setCustomerData({
                                        ...customerData,
                                        nationality_ids: [...currentNationalities, value]
                                      });
                                    }
                                  }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Add nationality..."/>
                                </SelectTrigger>
                                <SelectContent>
                                  {countriesData.map((nat) => (
                                      <SelectItem key={nat.id} value={nat.id}>
                                        {nat.name}
                                      </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {/* 2. The Pill Container (Edit Mode) */}
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(customerData.nationality_ids) && customerData.nationality_ids.map((id) => {
                                  const country = countriesData.find((n) => n.id === id);
                                  if (!country) return null;

                                  return (
                                      <button
                                          key={id}
                                          type="button"
                                          onClick={() => {
                                            const filtered = customerData.nationality_ids.filter((c) => c !== id);
                                            setCustomerData({
                                              ...customerData,
                                              nationality_ids: filtered
                                            });
                                          }}
                                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-full text-xs font-medium transition-all group"
                                      >
                                        {country.name}
                                        <span
                                            className="text-blue-400 group-hover:text-red-500 font-bold ml-0.5">
                                        ×
                                      </span>
                                      </button>
                                  );
                                })}
                              </div>
                            </div>
                        ) : (
                            /* 3. Read-Only Mode */
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {Array.isArray(customerData.nationality_ids) && customerData.nationality_ids.length > 0 ? (
                                  customerData.nationality_ids.map((id) => {
                                    const countryName = countriesData.find((n) => n.id === id)?.name || id;
                                    return (
                                        <span
                                            key={id}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 text-sm border border-gray-200 shadow-sm"
                                        >
                                        {countryName}
                                      </span>
                                    );
                                  })
                              ) : (
                                  <p className="text-gray-500 italic text-sm">Not provided</p>
                              )}
                            </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="ethnicity">Ethnicity</Label>
                        {isEditingPersonal ? (
                            <div className="space-y-3 mt-1">
                              {/* 1. The Select acts as the "Adder" */}
                              <Select
                                  value="" // Reset to placeholder after selection
                                  onValueChange={(value) => {
                                    const currentEthnicities = Array.isArray(customerData.ethnicity_ids)
                                        ? customerData.ethnicity_ids
                                        : (customerData.ethnicity_ids ? [customerData.ethnicity_ids] : []);

                                    // Only add if not already selected
                                    if (!currentEthnicities.includes(value)) {
                                      setCustomerData({
                                        ...customerData,
                                        ethnicity_ids: [...currentEthnicities, value]
                                      });
                                    }
                                  }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Add nationality..."/>
                                </SelectTrigger>
                                <SelectContent>
                                  {ethnicitiesData.map((eth) => (
                                      <SelectItem key={eth.id} value={eth.id}>
                                        {eth.name}
                                      </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {/* 2. The Pill Container (Edit Mode) */}
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(customerData.ethnicity_ids) && customerData.ethnicity_ids.map((id) => {
                                  const ethnicity = countriesData.find((eth) => eth.id === id);
                                  if (!ethnicity) return null;

                                  return (
                                      <button
                                          key={id}
                                          type="button"
                                          onClick={() => {
                                            const filtered = customerData.ethnicity_ids.filter((c) => c !== id);
                                            setCustomerData({
                                              ...customerData,
                                              ethnicity_ids: filtered
                                            });
                                          }}
                                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-full text-xs font-medium transition-all group"
                                      >
                                        {ethnicity.name}
                                        <span
                                            className="text-blue-400 group-hover:text-red-500 font-bold ml-0.5">
                                        ×
                                      </span>
                                      </button>
                                  );
                                })}
                              </div>
                            </div>
                        ) : (
                            /* 3. Read-Only Mode */
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {Array.isArray(customerData.ethnicity_ids) && customerData.ethnicity_ids.length > 0 ? (
                                  customerData.ethnicity_ids.map((id) => {
                                    const ethnicityName = ethnicitiesData.find((n) => n.id === id)?.name || id;
                                    return (
                                        <span
                                            key={id}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 text-sm border border-gray-200 shadow-sm"
                                        >
                                        {ethnicityName}
                                      </span>
                                    );
                                  })
                              ) : (
                                  <p className="text-gray-500 italic text-sm">Not provided</p>
                              )}
                            </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      {isEditingPersonal ? (
                          <Input
                              id="address"
                              value={customerData.address || ''}
                              onChange={(e) => setCustomerData({
                                ...customerData,
                                address: e.target.value
                              })}
                              className="mt-1"
                          />
                      ) : (
                          <p className="mt-1 text-gray-700">{customerData.address}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="country">Country</Label>
                        {isEditingPersonal ? (
                            <Select
                                id="country"
                                value={customerData.country_id || ''}
                                onValueChange={(value) => setCustomerData({
                                  ...customerData,
                                  country_id: value
                                })}
                                className="mt-1"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select country..."/>
                              </SelectTrigger>
                              <SelectContent>
                                {countriesData.map((country) => (
                                    <SelectItem key={country.id} value={country.id}>
                                      {country.name}
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                        ) : (
                            <p className="mt-1 text-gray-700">
                              {customerData.country_id
                                  ? countriesData.find(c => c.id === customerData.country_id)?.name || customerData.country_id
                                  : 'Not provided'}
                            </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        {isEditingPersonal ? (
                            <Select
                                id="city"
                                value={customerData.city_id || ''}
                                onValueChange={(value) => setCustomerData({
                                  ...customerData,
                                  city_id: value
                                })}
                                className="mt-1"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select city..."/>
                              </SelectTrigger>
                              <SelectContent>
                                {citiesData.map((city) => (
                                    <SelectItem key={city.id} value={city.id}>
                                      {city.name}
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                        ) : (
                            <p className="mt-1 text-gray-700">
                              {customerData.city_id
                                  ? citiesData.find(c => c.id === customerData.city_id)?.name || customerData.city_id
                                  : 'Not provided'}
                            </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="postal_code">Postal Code</Label>
                        {isEditingPersonal ? (
                            <Input
                                id="postal_code"
                                value={customerData.postal_code || ''}
                                onChange={(e) => setCustomerData({
                                  ...customerData,
                                  postal_code: e.target.value
                                })}
                                className="mt-1"
                            />
                        ) : (
                            <p className="mt-1 text-gray-700">{customerData.postal_code}</p>
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
                      <Users className="w-5 h-5"/>
                      Family Members
                    </CardTitle>
                    <Button
                        onClick={() => setShowAddFamilyModal(true)}
                        size="sm"
                        className="bg-[oklch(0.35_0.12_15)] hover:bg-[oklch(0.30_0.12_15)] text-white"
                    >
                      <Plus className="w-4 h-4 mr-1"/>
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
                                  <p className="text-sm text-gray-600">{member.relationship} •
                                    Date of birth {member.date_of_birth}</p>
                                </div>
                                <Button
                                    onClick={() => handleDeleteFamilyMember(member.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4"/>
                                </Button>
                              </div>
                              {member.requirements?.retail.dietary_requirements && member.requirements.retail.dietary_requirements.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">Dietary
                                      Requirements:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {member.requirements.retail.dietary_requirements.map((req, idx) => (
                                          <Badge key={idx} variant="secondary"
                                                 className="text-xs">{req}</Badge>
                                      ))}
                                    </div>
                                  </div>
                              )}
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-400"/>
                        <p>No family members added yet.</p>
                        <p className="text-sm">Click "Add Member" to get started.</p>
                      </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Barcode Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5"/>
                    Customer Barcode
                  </CardTitle>
                  <CardDescription>
                    Your unique customer identification barcode
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showBarcode && barcodeUrl ? (
                      <div className="space-y-4">
                        <div
                            className="flex justify-center p-6 bg-white border-2 border-gray-200 rounded-lg">
                          <img
                              src={barcodeUrl}
                              alt="Customer Barcode"
                              className="max-w-full h-auto"
                          />
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button
                              onClick={() => setShowBarcode(false)}
                              variant="outline"
                              size="sm"
                          >
                            Hide Barcode
                          </Button>
                          <Button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = barcodeUrl;
                                link.download = 'customer-barcode.png';
                                link.click();
                              }}
                              size="sm"
                              className="bg-[oklch(0.35_0.12_15)] hover:bg-[oklch(0.30_0.12_15)]"
                          >
                            <Download className="w-4 h-4 mr-1"/>
                            Download
                          </Button>
                          {/*TODO: Implement Google wallet on backend*/}
                          {/*<Button*/}
                          {/*  onClick={handleAddToGoogleWallet}*/}
                          {/*  size="sm"*/}
                          {/*  className="bg-blue-600 hover:bg-blue-700 text-white"*/}
                          {/*>*/}
                          {/*  <Wallet className="w-4 h-4 mr-1" />*/}
                          {/*  Add to Wallet*/}
                          {/*</Button>*/}
                        </div>
                      </div>
                  ) : (
                      <div className="text-center py-8">
                        <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-400"/>
                        <p className="text-gray-600 mb-4">
                          Show your barcode for quick identification at checkout
                        </p>
                        <Button
                            onClick={handleShowBarcode}
                            className="bg-[oklch(0.35_0.12_15)] hover:bg-[oklch(0.30_0.12_15)]"
                        >
                          <QrCode className="w-4 h-4 mr-2"/>
                          Show My Barcode
                        </Button>
                      </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preferences" className="space-y-6">
              <MeatPreferences
                  profile={preferences}
                  onChange={setCustomerData}
                  isEditing={isEditingPreferences}
                  onEditToggle={() => setIsEditingPreferences(!isEditingPreferences)}
                  onSave={handleSave}
                  onUpdate={handleProfileUpdate}
                  saving={saving}
              />
              <CulinaryProfile
                  profile={preferences}
                  onChange={setCustomerData}
                  onUpdate={handleProfileUpdate}
                  isEditing={isEditingPreferences}
              />
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              {/* Recommended Order Section */}
              {recommendedOrder && recommendedOrder.length > 0 && (
                  <Card
                      className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-lg">
                    <CardHeader
                        className="bg-gradient-to-r from-amber-100 to-orange-50 border-b border-amber-200">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <Sparkles className="w-7 h-7 text-amber-600"/>
                        Your Recommended Order
                      </CardTitle>
                      <CardDescription className="text-base">
                        Based on your preferences, we've prepared your next order with some special
                        recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Products List - Shopify Style */}
                      <div className="space-y-4 mb-6">
                        {recommendedOrder.map((item) => (
                            <div
                                key={item.id}
                                className={`flex flex-col md:flex-row gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                                    item.is_recommended
                                        ? 'border-purple-300 bg-purple-50/50'
                                        : 'border-gray-200 bg-white'
                                }`}
                            >
                              {/* Product Image - Fixed aspect ratio */}
                              <div className="flex-shrink-0 w-full md:w-auto">
                                <img
                                    src={item.image_url}
                                    alt={item.product_name}
                                    className="w-full md:w-24 h-48 md:h-24 object-cover rounded-lg"
                                />
                              </div>

                              {/* Product Details */}
                              <div className="flex-grow">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">{item.product_name}</h3>
                                    {item.is_recommended && (
                                        <Badge className="mt-1 bg-purple-600">
                                          <Sparkles className="w-3 h-3 mr-1"/>
                                          Recommended
                                        </Badge>
                                    )}
                                    <p className="text-sm text-gray-600 mt-1 italic">{item.recommendation_reason}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div
                                  className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3">
                                <div
                                    className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
                                  <button
                                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                      onClick={() => {
                                        const newOrder = recommendedOrder.map(i =>
                                            i.id === item.id && i.quantity > 1
                                                ? {...i, quantity: i.quantity - 1}
                                                : i
                                        );
                                        setRecommendedOrder(newOrder);
                                      }}
                                  >
                                    −
                                  </button>
                                  <span
                                      className="px-3 font-medium min-w-[2rem] text-center">{item.quantity}</span>
                                  <button
                                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                      onClick={() => {
                                        const newOrder = recommendedOrder.map(i =>
                                            i.id === item.id
                                                ? {...i, quantity: i.quantity + 1}
                                                : i
                                        );
                                        setRecommendedOrder(newOrder);
                                      }}
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Price and Delete */}
                                <div className="flex items-center gap-3">
                          <span className="font-bold text-lg whitespace-nowrap">
                            €{(item.price * item.quantity).toFixed(2)}
                          </span>
                                  <button
                                      className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                      onClick={() => {
                                        const newOrder = recommendedOrder.filter(i => i.id !== item.id);
                                        setRecommendedOrder(newOrder);
                                      }}
                                      title="Remove item"
                                  >
                                    <Trash2 className="w-5 h-5"/>
                                  </button>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>

                      {/* Total and Order Button */}
                      <div className="border-t-2 border-amber-200 pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xl font-semibold">Total</span>
                          <span className="text-2xl font-bold text-[oklch(0.35_0.12_15)]">
                      €{recommendedOrder.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2)}
                    </span>
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-[oklch(0.35_0.12_15)] to-amber-700 hover:from-[oklch(0.30_0.12_15)] hover:to-amber-800 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                            onClick={() => {
                              const cartParams = recommendedOrder.map((item, index) =>
                                  `items[${index}][id]=${item.product_sku}&items[${index}][quantity]=${item.quantity}`
                              ).join('&');
                              const shopifyUrl = `https://www.biologischvleeschatelier.nl/cart/add?${cartParams}`;
                              window.open(shopifyUrl, '_blank');
                            }}
                        >
                          <ShoppingCart className="w-6 h-6 mr-2"/>
                          Order in Romano webshop
                          <ExternalLink className="w-5 h-5 ml-2"/>
                        </Button>

                        <p className="text-xs text-center text-gray-500 mt-3">
                          You'll be redirected to our Shopify store with all items in your cart
                        </p>
                      </div>
                    </CardContent>
                  </Card>
              )}

              <OrdersSection orders={orders}/>


              {/* Active Subscriptions */}
              {subscriptions && subscriptions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5"/>
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
                    <Award className="w-5 h-5"/>
                    Loyalty Program
                  </CardTitle>
                  <CardDescription>Your rewards and benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                      <p className="text-sm text-purple-700 mb-1">Points Balance</p>
                      <p className="text-3xl font-bold text-purple-900">{(enrollmentData.points + enrollmentData.bonus_points + enrollmentData.reserved_points)?.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                      <p className="text-sm text-blue-700 mb-1">Member Since</p>
                      <p className="text-3xl font-bold text-blue-900">{new Date(enrollmentData.member_since).getFullYear()}</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-600"/>
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
                </CardContent>
              </Card>

              {/* ── Rewards Store ── */}
              <LoyaltyRedemption
                  customerData={customerData}
              />

            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">

              {/* Delivery Instructions */}


              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5"/>
                        Delivery Instructions
                      </CardTitle>
                      <CardDescription>Special instructions for delivery</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {isEditingSettings ? (
                          <>
                            <Button
                                onClick={() => setIsEditingSettings(false)}
                                variant="outline"
                                size="sm"
                            >
                              Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                size="sm"
                                className="bg-[oklch(0.35_0.12_15)] hover:bg-[oklch(0.30_0.12_15)]"
                            >
                              <Save className="w-4 h-4 mr-1"/>
                              {saving ? 'Saving...' : 'Save'}
                            </Button>
                          </>
                      ) : (
                          <Button
                              onClick={() => setIsEditingSettings(true)}
                              variant="outline"
                              size="sm"
                          >
                            <Edit2 className="w-4 h-4 mr-1"/>
                            Edit
                          </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingSettings ? (
                      <textarea
                          value={customerData.delivery_instructions || ''}
                          onChange={(e) => setCustomerData({
                            ...customerData,
                            delivery_instructions: e.target.value
                          })}
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
                    <Mail className="w-5 h-5"/>
                    Communication Preferences
                  </CardTitle>
                  <CardDescription>Manage how we communicate with you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-amber-600 mt-1"/>
                      <div>
                        <p className="font-medium">Marketing Communications</p>
                        <p className="text-sm text-gray-600">Receive promotional emails and special
                          event invitations</p>
                      </div>
                    </div>
                    <Switch
                        checked={customerData.marketing_communications}
                        onCheckedChange={(checked) => setCustomerData({
                          ...customerData,
                          marketing_communications: checked
                        })}
                        disabled={!isEditingSettings}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-purple-600 mt-1"/>
                      <div>
                        <p className="font-medium">Marketing Personalization</p>
                        <p className="text-sm text-gray-600">Allow us to suggest products based on
                          your preferences</p>
                      </div>
                    </div>
                    <Switch
                        checked={customerData.marketing_personalization}
                        onCheckedChange={(checked) => setCustomerData({
                          ...customerData,
                          marketing_personalization: checked
                        })}
                        disabled={!isEditingSettings}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy & Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5"/>
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
                    <Download className="w-4 h-4 mr-2"/>
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
                    <Trash2 className="w-4 h-4 mr-2"/>
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
                    <X className="w-4 h-4"/>
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="member-name">Name *</Label>
                    <Input
                        id="member-name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                        placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-relationship">Relationship *</Label>
                    <select
                        id="member-relationship"
                        value={newMember.relationship}
                        onChange={(e) => setNewMember({...newMember, relationship: e.target.value})}
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
                      <Label htmlFor="member-age">Date of birth *</Label>
                      <Input
                          id="member-age"
                          type="date"
                          value={newMember.date_of_birth}
                          onChange={(e) => setNewMember({...newMember, date_of_birth: e.target.value})}
                          placeholder="Date of birth"
                      />
                    </div>
                    <div>
                      <Label htmlFor="member-gender">Gender</Label>
                      <select
                          id="member-gender"
                          value={newMember.gender}
                          onChange={(e) => setNewMember({...newMember, gender: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                        <option value="3">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="member-dietary">Dietary Requirements</Label>
                    <Input
                        id="member-dietary"
                        value={newMember.requirements}
                        onChange={(e) => setNewMember({...newMember, requirements: e.target.value})}
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
                        disabled={!newMember.name || !newMember.relationship || !newMember.date_of_birth}
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
