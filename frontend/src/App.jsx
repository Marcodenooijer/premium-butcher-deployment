import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { 
  User, MapPin, Heart, ShoppingBag, Award, Bell, 
  Download, Edit, Save, X, ChefHat, Leaf, 
  Calendar, MessageSquare, Star, TrendingUp, Package,
  CreditCard, Settings, Shield, Users, BookOpen
} from 'lucide-react'
import './App.css'

function App() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Mock customer data
  const [customerData, setCustomerData] = useState({
    name: 'Jan de Vries',
    email: 'jan.devries@email.nl',
    phone: '+31 6 1234 5678',
    dateOfBirth: '1985-03-15',
    language: 'nl',
    profilePhoto: null,
    
    // Addresses
    primaryAddress: {
      street: 'Prinsengracht 123',
      city: 'Amsterdam',
      postalCode: '1015 DL',
      country: 'Nederland'
    },
    
    // Meat preferences
    favoriteMeats: ['Beef', 'Lamb', 'Poultry'],
    preferredCuts: ['Ribeye', 'Tenderloin', 'Shoulder'],
    cookingPreference: 'Medium-rare',
    householdSize: 4,
    weeklyConsumption: '2-3 times',
    organicOnly: true,
    grassFedPreference: true,
    localSourcing: true,
    
    // Family members (when household size > 1)
    familyMembers: [
      { id: 1, gender: 'Female', age: 38, dietaryRequirements: 'None' },
      { id: 2, gender: 'Male', age: 12, dietaryRequirements: 'No spicy food' },
      { id: 3, gender: 'Female', age: 9, dietaryRequirements: 'Vegetarian options preferred' }
    ],
    
    // Culinary profile
    cookingSkill: 'Intermediate',
    favoriteCuisines: ['Dutch', 'French', 'BBQ'],
    equipment: ['Grill', 'Oven', 'Smoker'],
    
    // Loyalty
    loyaltyPoints: 2450,
    membershipTier: 'Gold',
    lifetimeValue: 3250,
    
    // Subscription
    hasSubscription: true,
    deliveryFrequency: 'Bi-weekly',
    preferredDeliveryDay: 'Saturday',
    
    // Communication
    emailNotifications: true,
    smsNotifications: false,
    newsletter: true,
    recipeEmails: true
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend/Shopify API
    console.log('Saving customer data:', customerData)
  }

  const handleDownload = (format) => {
    // Mock download functionality
    const data = JSON.stringify(customerData, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `profile-data.${format}`
    a.click()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="premium-gradient text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">🥩 Premium Biological Butcher</div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <Card className="mb-8 premium-card border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary">
                <AvatarImage src={customerData.profilePhoto} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {customerData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{customerData.name}</h1>
                  <Badge className="gold-shimmer text-foreground border-0">
                    <Award className="w-4 h-4 mr-1" />
                    {customerData.membershipTier} Member
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">{customerData.email}</p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm">{customerData.loyaltyPoints} Points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-sm">€{customerData.lifetimeValue} Lifetime Value</span>
                  </div>
                  {customerData.hasSubscription && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm">{customerData.deliveryFrequency} Delivery</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" onClick={() => handleDownload('json')}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 h-auto p-2 bg-card">
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
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Subscription</span>
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
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input 
                      value={customerData.name} 
                      disabled={!isEditing}
                      onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input 
                      type="email"
                      value={customerData.email} 
                      disabled={!isEditing}
                      onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input 
                      value={customerData.phone} 
                      disabled={!isEditing}
                      onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input 
                      type="date"
                      value={customerData.dateOfBirth} 
                      disabled={!isEditing}
                      onChange={(e) => setCustomerData({...customerData, dateOfBirth: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Primary Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Street Address</Label>
                    <Input 
                      value={customerData.primaryAddress.street} 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Postal Code</Label>
                      <Input 
                        value={customerData.primaryAddress.postalCode} 
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input 
                        value={customerData.primaryAddress.city} 
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input 
                      value={customerData.primaryAddress.country} 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  Sustainability Impact
                </CardTitle>
                <CardDescription>Your contribution to sustainable farming</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">87%</div>
                    <div className="text-sm text-muted-foreground">Local Sourcing</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">245kg</div>
                    <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">12</div>
                    <div className="text-sm text-muted-foreground">Partner Farms</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Meat Preferences
                </CardTitle>
                <CardDescription>Tell us about your favorite meats and cuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">Favorite Meat Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Beef', 'Pork', 'Lamb', 'Poultry', 'Game', 'Veal'].map(meat => (
                      <Badge 
                        key={meat}
                        variant={customerData.favoriteMeats.includes(meat) ? "default" : "outline"}
                        className={customerData.favoriteMeats.includes(meat) ? "bg-primary cursor-pointer" : "cursor-pointer"}
                      >
                        {meat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Preferred Cuts</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Ribeye', 'Tenderloin', 'Sirloin', 'Shoulder', 'Brisket', 'Short Rib'].map(cut => (
                      <Badge 
                        key={cut}
                        variant={customerData.preferredCuts.includes(cut) ? "default" : "outline"}
                        className={customerData.preferredCuts.includes(cut) ? "bg-primary cursor-pointer" : "cursor-pointer"}
                      >
                        {cut}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Cooking Preference</Label>
                    <Input 
                      value={customerData.cookingPreference} 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Household Size</Label>
                    <Input 
                      type="number"
                      value={customerData.householdSize} 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Organic Only</Label>
                      <p className="text-sm text-muted-foreground">Show only certified organic products</p>
                    </div>
                    <Switch 
                      checked={customerData.organicOnly}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Grass-Fed Preference</Label>
                      <p className="text-sm text-muted-foreground">Prioritize grass-fed options</p>
                    </div>
                    <Switch 
                      checked={customerData.grassFedPreference}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Local Sourcing Priority</Label>
                      <p className="text-sm text-muted-foreground">Prefer products from local farms</p>
                    </div>
                    <Switch 
                      checked={customerData.localSourcing}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Family Members Section - shown when household size > 1 */}
            {customerData.householdSize > 1 && (
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Family Members
                  </CardTitle>
                  <CardDescription>Details about household members and their dietary needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerData.familyMembers.map((member, index) => (
                      <div key={member.id} className="p-4 border rounded-lg bg-muted/30">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Gender</Label>
                            <Input 
                              value={member.gender} 
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Age</Label>
                            <Input 
                              type="number"
                              value={member.age} 
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Dietary Requirements</Label>
                            <Input 
                              value={member.dietaryRequirements} 
                              disabled={!isEditing}
                              className="mt-1"
                              placeholder="e.g., Vegetarian, Allergies"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <Button variant="outline" className="w-full">
                        <Users className="w-4 h-4 mr-2" />
                        Add Family Member
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Culinary Profile Section */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-primary" />
                  Culinary Profile
                </CardTitle>
                <CardDescription>Your cooking preferences and expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Cooking Skill Level</Label>
                    <Input 
                      value={customerData.cookingSkill} 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Weekly Meat Consumption</Label>
                    <Input 
                      value={customerData.weeklyConsumption} 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Favorite Cuisines</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Dutch', 'French', 'Italian', 'BBQ', 'Asian', 'Mediterranean'].map(cuisine => (
                      <Badge 
                        key={cuisine}
                        variant={customerData.favoriteCuisines.includes(cuisine) ? "default" : "outline"}
                        className={customerData.favoriteCuisines.includes(cuisine) ? "bg-primary cursor-pointer" : "cursor-pointer"}
                      >
                        {cuisine}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Cooking Equipment</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Grill', 'Oven', 'Smoker', 'Sous-vide', 'Air Fryer', 'Slow Cooker'].map(equip => (
                      <Badge 
                        key={equip}
                        variant={customerData.equipment.includes(equip) ? "default" : "outline"}
                        className={customerData.equipment.includes(equip) ? "bg-primary cursor-pointer" : "cursor-pointer"}
                      >
                        {equip}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recipe Collection */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Recipe Collection
                </CardTitle>
                <CardDescription>Your saved recipes and cooking inspiration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: 'Perfect Ribeye Steak', time: '20 min', difficulty: 'Easy' },
                    { title: 'Slow-Roasted Lamb Shoulder', time: '4 hours', difficulty: 'Medium' },
                    { title: 'BBQ Beef Brisket', time: '8 hours', difficulty: 'Advanced' },
                    { title: 'Herb-Crusted Pork Tenderloin', time: '45 min', difficulty: 'Medium' }
                  ].map(recipe => (
                    <div key={recipe.title} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-20 h-20 bg-muted rounded-md flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{recipe.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{recipe.time}</span>
                          <span>•</span>
                          <span>{recipe.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order History
                </CardTitle>
                <CardDescription>Your recent purchases and favorite products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: '#12345', date: '2025-10-01', total: '€89.50', status: 'Delivered', items: 'Premium Ribeye, Lamb Shoulder' },
                    { id: '#12344', date: '2025-09-15', total: '€125.00', status: 'Delivered', items: 'Beef Tenderloin, Organic Chicken' },
                    { id: '#12343', date: '2025-09-01', total: '€67.80', status: 'Delivered', items: 'Pork Chops, Game Sausages' }
                  ].map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold">{order.id}</span>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.items}</p>
                        <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{order.total}</div>
                        <Button variant="ghost" size="sm" className="mt-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Favorite Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: 'Premium Ribeye', price: '€32.50/kg', rating: 5 },
                    { name: 'Organic Lamb Shoulder', price: '€24.00/kg', rating: 5 },
                    { name: 'Free-Range Chicken', price: '€15.50/kg', rating: 4 }
                  ].map(product => (
                    <div key={product.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-muted rounded-md mb-3"></div>
                      <h4 className="font-semibold mb-1">{product.name}</h4>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < product.rating ? 'fill-primary text-primary' : 'text-muted'}`} />
                        ))}
                      </div>
                      <p className="text-sm font-bold text-primary">{product.price}</p>
                      <Button size="sm" className="w-full mt-3">Reorder</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <Card className="premium-card border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Active Subscription
                </CardTitle>
                <CardDescription>Manage your recurring meat delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Premium Family Box</h3>
                      <p className="text-sm text-muted-foreground">Bi-weekly delivery</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">€95.00</div>
                      <p className="text-xs text-muted-foreground">per delivery</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Next Delivery:</span>
                      <p className="font-semibold">Saturday, Oct 12</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Delivery Window:</span>
                      <p className="font-semibold">10:00 - 14:00</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Delivery Frequency</Label>
                  <Input 
                    value={customerData.deliveryFrequency} 
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Preferred Delivery Day</Label>
                  <Input 
                    value={customerData.preferredDeliveryDay} 
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Pause Subscription
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Customize Box
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-6">
            <Card className="premium-card border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Loyalty Program
                </CardTitle>
                <CardDescription>Your rewards and membership benefits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                  <Badge className="gold-shimmer text-foreground border-0 mb-4 text-lg px-4 py-2">
                    <Award className="w-5 h-5 mr-2" />
                    {customerData.membershipTier} Member
                  </Badge>
                  <div className="text-4xl font-bold text-primary mb-2">{customerData.loyaltyPoints}</div>
                  <p className="text-muted-foreground">Available Points</p>
                  <div className="mt-4 w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">550 points to Platinum tier</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Your Benefits</h3>
                  <div className="space-y-2">
                    {[
                      '10% discount on all orders',
                      'Free delivery on orders over €50',
                      'Priority access to limited cuts',
                      'Exclusive recipe content',
                      'Personal butcher consultation'
                    ].map(benefit => (
                      <div key={benefit} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Referral Program</h3>
                  <p className="text-sm text-muted-foreground mb-3">Share your love for premium meat! Give €20, Get €20</p>
                  <div className="flex gap-2">
                    <Input value="JANDEVRIES20" readOnly className="font-mono" />
                    <Button>Copy Code</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Communication Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Order updates and delivery notifications</p>
                  </div>
                  <Switch 
                    checked={customerData.emailNotifications}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Delivery alerts and special offers</p>
                  </div>
                  <Switch 
                    checked={customerData.smsNotifications}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter Subscription</Label>
                    <p className="text-sm text-muted-foreground">Weekly updates and promotions</p>
                  </div>
                  <Switch 
                    checked={customerData.newsletter}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recipe Emails</Label>
                    <p className="text-sm text-muted-foreground">Cooking tips and recipe inspiration</p>
                  </div>
                  <Switch 
                    checked={customerData.recipeEmails}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download My Data (GDPR)
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  <X className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Premium Biological Butcher. Committed to sustainable, ethical meat sourcing.</p>
          <p className="mt-2">🌱 100% Organic • 🐄 Animal Welfare Certified • 🇳🇱 Proudly Dutch</p>
        </div>
      </footer>
    </div>
  )
}

export default App
