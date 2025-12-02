import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Heart } from 'lucide-react'

const MEAT_TYPES = ['Beef', 'Pork', 'Lamb', 'Poultry', 'Game', 'Veal']
const CUT_TYPES = ['Ribeye', 'Tenderloin', 'Sirloin', 'Shoulder', 'Brisket', 'Short Rib']
const COOKING_PREFS = ['Rare', 'Medium-rare', 'Medium', 'Medium-well', 'Well-done']

function MeatPreferences({ preferences, onChange, isEditing }) {
  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item)
    } else {
      return [...array, item]
    }
  }

  const handleMeatTypeToggle = (type) => {
    const newTypes = toggleArrayItem(preferences.favorite_meat_types || [], type)
    onChange({ ...preferences, favorite_meat_types: newTypes })
  }

  const handleCutToggle = (cut) => {
    const newCuts = toggleArrayItem(preferences.preferred_cuts || [], cut)
    onChange({ ...preferences, preferred_cuts: newCuts })
  }

  const handleToggle = (field) => {
    onChange({ ...preferences, [field]: !preferences[field] })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-[oklch(0.35_0.12_15)]" />
          <CardTitle>Meat Preferences</CardTitle>
        </div>
        <CardDescription>Tell us about your favorite meats and cuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Favorite Meat Types */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Favorite Meat Types</Label>
          <div className="flex flex-wrap gap-2">
            {MEAT_TYPES.map((type) => {
              const isSelected = (preferences.favorite_meat_types || []).includes(type)
              return (
                <Badge
                  key={type}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[oklch(0.35_0.12_15)] text-white hover:bg-[oklch(0.30_0.12_15)]' 
                      : 'hover:bg-gray-100'
                  } ${!isEditing && 'cursor-default'}`}
                  onClick={() => isEditing && handleMeatTypeToggle(type)}
                >
                  {type}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Preferred Cuts */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Preferred Cuts</Label>
          <div className="flex flex-wrap gap-2">
            {CUT_TYPES.map((cut) => {
              const isSelected = (preferences.preferred_cuts || []).includes(cut)
              return (
                <Badge
                  key={cut}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[oklch(0.35_0.12_15)] text-white hover:bg-[oklch(0.30_0.12_15)]' 
                      : 'hover:bg-gray-100'
                  } ${!isEditing && 'cursor-default'}`}
                  onClick={() => isEditing && handleCutToggle(cut)}
                >
                  {cut}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Cooking Preference & Household Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cooking_preference">Cooking Preference</Label>
            {isEditing ? (
              <select
                id="cooking_preference"
                value={preferences.cooking_preference || 'medium-rare'}
                onChange={(e) => onChange({ ...preferences, cooking_preference: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[oklch(0.35_0.12_15)]"
              >
                {COOKING_PREFS.map(pref => (
                  <option key={pref} value={pref.toLowerCase()}>{pref}</option>
                ))}
              </select>
            ) : (
              <Input value={preferences.cooking_preference || 'medium-rare'} disabled className="mt-1" />
            )}
          </div>
          <div>
            <Label htmlFor="household_size">Household Size</Label>
            <Input
              id="household_size"
              type="number"
              min="1"
              max="20"
              value={preferences.household_size || 2}
              onChange={(e) => onChange({ ...preferences, household_size: parseInt(e.target.value) })}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
        </div>

        {/* Toggle Switches */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Organic Only</div>
              <div className="text-sm text-gray-500">Show only certified organic products</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.organic_only || false}
                onChange={() => isEditing && handleToggle('organic_only')}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(0.35_0.12_15)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(0.35_0.12_15)]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Grass-Fed Preference</div>
              <div className="text-sm text-gray-500">Prioritize grass-fed options</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.grass_fed_preference || false}
                onChange={() => isEditing && handleToggle('grass_fed_preference')}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(0.35_0.12_15)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(0.35_0.12_15)]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Local Sourcing Priority</div>
              <div className="text-sm text-gray-500">Prefer products from local farms</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.local_sourcing_priority || false}
                onChange={() => isEditing && handleToggle('local_sourcing_priority')}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(0.35_0.12_15)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(0.35_0.12_15)]"></div>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MeatPreferences
