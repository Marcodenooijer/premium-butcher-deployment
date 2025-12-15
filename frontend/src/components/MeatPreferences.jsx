import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Heart, X } from 'lucide-react';

const MeatPreferences = ({ profile, onUpdate }) => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState({
    favorite_meat_types: profile?.favorite_meat_types || [],
    preferred_cuts: profile?.preferred_cuts || [],
    cooking_preference: profile?.cooking_preference || 'medium-rare',
    household_size: profile?.household_size || 2,
    organic_only: profile?.organic_only || false,
    grass_fed_preference: profile?.grass_fed_preference || false,
    local_sourcing_priority: profile?.local_sourcing_priority || false,
    weekly_meat_consumption: profile?.weekly_meat_consumption || '2-3 times',
    favorite_meat_other: profile?.favorite_meat_other || '',
    preferred_cut_other: profile?.preferred_cut_other || '',
  });

  useEffect(() => {
    if (profile) {
      setPreferences({
        favorite_meat_types: profile.favorite_meat_types || [],
        preferred_cuts: profile.preferred_cuts || [],
        cooking_preference: profile.cooking_preference || 'medium-rare',
        household_size: profile.household_size || 2,
        organic_only: profile.organic_only || false,
        grass_fed_preference: profile.grass_fed_preference || false,
        local_sourcing_priority: profile.local_sourcing_priority || false,
        weekly_meat_consumption: profile.weekly_meat_consumption || '2-3 times',
        favorite_meat_other: profile.favorite_meat_other || '',
        preferred_cut_other: profile.preferred_cut_other || '',
      });
    }
  }, [profile]);

  const meatTypes = ['Beef', 'Pork', 'Lamb', 'Poultry', 'Game', 'Veal', 'Other'];
  
  // Deduplicated cuts list
  const allCuts = [
    'Ribeye', 'Tenderloin', 'Sirloin', 'Shoulder', 'Brisket', 'Short Rib',
    'T-Bone', 'Chop', 'Leg', 'Ham', 'Chuck', 'Neck', 'Belly', 'Loin',
    'Cheek', 'Rack', 'Shank', 'Collar', 'Breast', 'Ribs'
  ];
  
  // Remove duplicates
  const uniqueCuts = [...new Set(allCuts)].sort();

  const cookingPreferences = ['rare', 'medium-rare', 'medium', 'medium-well', 'well-done'];
  const consumptionFrequencies = ['Once a week', '2-3 times', '4-5 times', 'Daily'];

  const toggleMeatType = (meat) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        favorite_meat_types: prev.favorite_meat_types.includes(meat)
          ? prev.favorite_meat_types.filter(m => m !== meat)
          : [...prev.favorite_meat_types, meat]
      };
      onUpdate(updated);
      return updated;
    });
  };

  const toggleCut = (cut) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        preferred_cuts: prev.preferred_cuts.includes(cut)
          ? prev.preferred_cuts.filter(c => c !== cut)
          : [...prev.preferred_cuts, cut]
      };
      onUpdate(updated);
      return updated;
    });
  };

  const handleToggle = (field) => {
    setPreferences(prev => {
      const updated = { ...prev, [field]: !prev[field] };
      onUpdate(updated);
      return updated;
    });
  };

  const handleInputChange = (field, value) => {
    setPreferences(prev => {
      const updated = { ...prev, [field]: value };
      onUpdate(updated);
      return updated;
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Heart className="w-6 h-6 text-[oklch(0.35_0.12_15)]" />
          {t('meatPreferences.title', 'Let us Meat')}
        </CardTitle>
        <CardDescription>
          {t('meatPreferences.description', 'Tell us about your favorite meats and cuts')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Favorite Meat Types */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            {t('meatPreferences.favoriteMeats', 'Favorite Meat Types')}
          </Label>
          <div className="flex flex-wrap gap-2">
            {meatTypes.map(meat => (
              <button
                key={meat}
                onClick={() => toggleMeatType(meat)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  preferences.favorite_meat_types.includes(meat)
                    ? 'bg-[oklch(0.35_0.12_15)] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {meat}
              </button>
            ))}
          </div>
          {preferences.favorite_meat_types.includes('Other') && (
            <Input
              placeholder="Specify other meat type"
              value={preferences.favorite_meat_other}
              onChange={(e) => handleInputChange('favorite_meat_other', e.target.value)}
              className="mt-3"
            />
          )}
        </div>

        {/* Preferred Cuts */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            {t('meatPreferences.preferredCuts', 'Preferred Cuts')}
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {uniqueCuts.map(cut => (
              <label key={cut} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.preferred_cuts.includes(cut)}
                  onChange={() => toggleCut(cut)}
                  className="w-4 h-4 rounded border-gray-300 text-[oklch(0.35_0.12_15)] focus:ring-[oklch(0.35_0.12_15)]"
                />
                <span className="text-sm">{cut}</span>
              </label>
            ))}
          </div>
          {preferences.preferred_cuts.includes('Other Cut') && (
            <Input
              placeholder="Specify other cut"
              value={preferences.preferred_cut_other}
              onChange={(e) => handleInputChange('preferred_cut_other', e.target.value)}
              className="mt-3"
            />
          )}
        </div>

        {/* Cooking Preference & Household Size - Side by Side */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">
              {t('meatPreferences.cookingPreference', 'Cooking Preference')}
            </Label>
            <select
              value={preferences.cooking_preference}
              onChange={(e) => handleInputChange('cooking_preference', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent"
            >
              {cookingPreferences.map(pref => (
                <option key={pref} value={pref}>
                  {pref.charAt(0).toUpperCase() + pref.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">
              {t('meatPreferences.householdSize', 'Household Size')}
            </Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={preferences.household_size}
              onChange={(e) => handleInputChange('household_size', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Weekly Consumption */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            {t('meatPreferences.weeklyConsumption', 'Weekly Meat Consumption')}
          </Label>
          <select
            value={preferences.weekly_meat_consumption}
            onChange={(e) => handleInputChange('weekly_meat_consumption', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent"
          >
            {consumptionFrequencies.map(freq => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>
        </div>

        {/* Sourcing Preferences with Toggles */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-base font-semibold">
            {t('meatPreferences.sourcingPreferences', 'Sourcing Preferences')}
          </h3>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">
                {t('meatPreferences.organicOnly', 'Organic Only')}
              </Label>
              <p className="text-sm text-gray-600">
                {t('meatPreferences.organicOnlyDesc', 'Show only certified organic products')}
              </p>
            </div>
            <Switch
              checked={preferences.organic_only}
              onCheckedChange={() => handleToggle('organic_only')}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">
                {t('meatPreferences.grassFed', 'Grass-Fed Preference')}
              </Label>
              <p className="text-sm text-gray-600">
                {t('meatPreferences.grassFedDesc', 'Prioritize grass-fed options')}
              </p>
            </div>
            <Switch
              checked={preferences.grass_fed_preference}
              onCheckedChange={() => handleToggle('grass_fed_preference')}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">
                {t('meatPreferences.localSourcing', 'Local Sourcing Priority')}
              </Label>
              <p className="text-sm text-gray-600">
                {t('meatPreferences.localSourcingDesc', 'Prefer products from local farms')}
              </p>
            </div>
            <Switch
              checked={preferences.local_sourcing_priority}
              onCheckedChange={() => handleToggle('local_sourcing_priority')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeatPreferences;

