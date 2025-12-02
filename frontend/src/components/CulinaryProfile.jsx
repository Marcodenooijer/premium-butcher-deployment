import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ChefHat } from 'lucide-react'

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
const CONSUMPTION_LEVELS = ['1 time', '2-3 times', '4-5 times', 'Daily']
const CUISINES = ['Dutch', 'French', 'Italian', 'BBQ', 'Asian', 'Mediterranean']
const EQUIPMENT = ['Grill', 'Oven', 'Smoker', 'Sous-vide', 'Air Fryer', 'Slow Cooker']

function CulinaryProfile({ preferences, onChange, isEditing }) {
  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item)
    } else {
      return [...array, item]
    }
  }

  const handleCuisineToggle = (cuisine) => {
    const newCuisines = toggleArrayItem(preferences.favorite_cuisines || [], cuisine)
    onChange({ ...preferences, favorite_cuisines: newCuisines })
  }

  const handleEquipmentToggle = (equipment) => {
    const newEquipment = toggleArrayItem(preferences.cooking_equipment || [], equipment)
    onChange({ ...preferences, cooking_equipment: newEquipment })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-[oklch(0.35_0.12_15)]" />
          <CardTitle>Culinary Profile</CardTitle>
        </div>
        <CardDescription>Your cooking preferences and expertise</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cooking Skill Level & Weekly Consumption */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cooking_skill_level">Cooking Skill Level</Label>
            {isEditing ? (
              <select
                id="cooking_skill_level"
                value={preferences.cooking_skill_level || 'intermediate'}
                onChange={(e) => onChange({ ...preferences, cooking_skill_level: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[oklch(0.35_0.12_15)]"
              >
                {SKILL_LEVELS.map(level => (
                  <option key={level} value={level.toLowerCase()}>{level}</option>
                ))}
              </select>
            ) : (
              <Input value={preferences.cooking_skill_level || 'intermediate'} disabled className="mt-1 capitalize" />
            )}
          </div>
          <div>
            <Label htmlFor="weekly_meat_consumption">Weekly Meat Consumption</Label>
            {isEditing ? (
              <select
                id="weekly_meat_consumption"
                value={preferences.weekly_meat_consumption || '2-3 times'}
                onChange={(e) => onChange({ ...preferences, weekly_meat_consumption: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[oklch(0.35_0.12_15)]"
              >
                {CONSUMPTION_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            ) : (
              <Input value={preferences.weekly_meat_consumption || '2-3 times'} disabled className="mt-1" />
            )}
          </div>
        </div>

        {/* Favorite Cuisines */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Favorite Cuisines</Label>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((cuisine) => {
              const isSelected = (preferences.favorite_cuisines || []).includes(cuisine)
              return (
                <Badge
                  key={cuisine}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[oklch(0.35_0.12_15)] text-white hover:bg-[oklch(0.30_0.12_15)]' 
                      : 'hover:bg-gray-100'
                  } ${!isEditing && 'cursor-default'}`}
                  onClick={() => isEditing && handleCuisineToggle(cuisine)}
                >
                  {cuisine}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Cooking Equipment */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Cooking Equipment</Label>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT.map((equip) => {
              const isSelected = (preferences.cooking_equipment || []).includes(equip)
              return (
                <Badge
                  key={equip}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[oklch(0.35_0.12_15)] text-white hover:bg-[oklch(0.30_0.12_15)]' 
                      : 'hover:bg-gray-100'
                  } ${!isEditing && 'cursor-default'}`}
                  onClick={() => isEditing && handleEquipmentToggle(equip)}
                >
                  {equip}
                </Badge>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CulinaryProfile
