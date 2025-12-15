import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Flame, Clock, Utensils } from 'lucide-react';

const CulinaryProfile = ({ profile, onUpdate }) => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState({
    cooking_skill_level: profile?.cooking_skill_level || 'intermediate',
    cooking_equipment: profile?.cooking_equipment || [],
    cooking_minutes_weekdays: profile?.cooking_minutes_weekdays || 30,
    cooking_minutes_weekend: profile?.cooking_minutes_weekend || 60,
    cooking_minutes_festive: profile?.cooking_minutes_festive || 120,
    has_bbq: profile?.has_bbq || false,
    bbq_type: profile?.bbq_type || 'charcoal',
    bbq_frequency: profile?.bbq_frequency || 'occasionally',
    bbq_skill_level: profile?.bbq_skill_level || 'intermediate',
  });

  useEffect(() => {
    if (profile) {
      setPreferences({
        cooking_skill_level: profile.cooking_skill_level || 'intermediate',
        cooking_equipment: profile.cooking_equipment || [],
        cooking_minutes_weekdays: profile.cooking_minutes_weekdays || 30,
        cooking_minutes_weekend: profile.cooking_minutes_weekend || 60,
        cooking_minutes_festive: profile.cooking_minutes_festive || 120,
        has_bbq: profile.has_bbq || false,
        bbq_type: profile.bbq_type || 'charcoal',
        bbq_frequency: profile.bbq_frequency || 'occasionally',
        bbq_skill_level: profile.bbq_skill_level || 'intermediate',
      });
    }
  }, [profile]);

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  const equipmentOptions = [
    { id: 'oven', label: 'Oven' },
    { id: 'stovetop', label: 'Stovetop' },
    { id: 'grill', label: 'Grill' },
    { id: 'smoker', label: 'Smoker' },
    { id: 'sous_vide', label: 'Sous Vide' },
    { id: 'air_fryer', label: 'Air Fryer' },
    { id: 'grillpan', label: 'Grill Pan' },
    { id: 'dutch_oven', label: 'Dutch Oven' },
    { id: 'slow_cooker', label: 'Slow Cooker' },
    { id: 'pressure_cooker', label: 'Pressure Cooker' },
    { id: 'rotisserie', label: 'Rotisserie' },
  ];
  const bbqTypes = ['Charcoal', 'Gas', 'Electric', 'Pellet', 'Kamado', 'Ceramic', 'Wood-fired', 'Portable'];
  const bbqFrequencies = ['Rarely', 'Occasionally', 'Regularly', 'Frequently'];

  const toggleEquipment = (equipment) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        cooking_equipment: prev.cooking_equipment.includes(equipment)
          ? prev.cooking_equipment.filter(e => e !== equipment)
          : [...prev.cooking_equipment, equipment]
      };
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

  const handleToggle = (field) => {
    setPreferences(prev => {
      const updated = { ...prev, [field]: !prev[field] };
      onUpdate(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* Cooking Skills & Equipment */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Flame className="w-6 h-6 text-[oklch(0.35_0.12_15)]" />
            {t('culinaryProfile.title', 'Culinary Profile')}
          </CardTitle>
          <CardDescription>
            {t('culinaryProfile.description', 'Tell us about your cooking style and equipment')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Cooking Skill Level */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              {t('culinaryProfile.skillLevel', 'Cooking Skill Level')}
            </Label>
            <select
              value={preferences.cooking_skill_level}
              onChange={(e) => handleInputChange('cooking_skill_level', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent"
            >
              {skillLevels.map(level => (
                <option key={level} value={level.toLowerCase()}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Cooking Equipment */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              {t('culinaryProfile.equipment', 'Cooking Equipment')}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {equipmentOptions.map(equipment => (
                <label key={equipment.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.cooking_equipment.includes(equipment.id)}
                    onChange={() => toggleEquipment(equipment.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[oklch(0.35_0.12_15)] focus:ring-[oklch(0.35_0.12_15)]"
                  />
                  <span className="text-sm">{equipment.label}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cooking Time */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-5 h-5 text-[oklch(0.35_0.12_15)]" />
            {t('culinaryProfile.cookingTime', 'Cooking Time Available')}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                {t('culinaryProfile.weekdays', 'Weekdays (minutes)')}
              </Label>
              <Input
                type="number"
                min="5"
                max="240"
                step="5"
                value={preferences.cooking_minutes_weekdays}
                onChange={(e) => handleInputChange('cooking_minutes_weekdays', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">
                {t('culinaryProfile.weekend', 'Weekend (minutes)')}
              </Label>
              <Input
                type="number"
                min="5"
                max="240"
                step="5"
                value={preferences.cooking_minutes_weekend}
                onChange={(e) => handleInputChange('cooking_minutes_weekend', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">
                {t('culinaryProfile.festive', 'Festive Days (minutes)')}
              </Label>
              <Input
                type="number"
                min="5"
                max="240"
                step="5"
                value={preferences.cooking_minutes_festive}
                onChange={(e) => handleInputChange('cooking_minutes_festive', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BBQ Profile */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Utensils className="w-5 h-5 text-[oklch(0.35_0.12_15)]" />
            {t('culinaryProfile.bbqProfile', 'BBQ Profile')}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Has BBQ Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">
                {t('culinaryProfile.hasBbq', 'Do you have a BBQ?')}
              </Label>
              <p className="text-sm text-gray-600">
                {t('culinaryProfile.hasBbqDesc', 'Tell us if you have a BBQ at home')}
              </p>
            </div>
            <Switch
              checked={preferences.has_bbq}
              onCheckedChange={() => handleToggle('has_bbq')}
            />
          </div>

          {/* BBQ Details - Only show if has_bbq is true */}
          {preferences.has_bbq && (
            <div className="space-y-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    {t('culinaryProfile.bbqType', 'BBQ Type')}
                  </Label>
                  <select
                    value={preferences.bbq_type}
                    onChange={(e) => handleInputChange('bbq_type', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent"
                  >
                    {bbqTypes.map(type => (
                      <option key={type} value={type.toLowerCase()}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    {t('culinaryProfile.bbqFrequency', 'Usage Frequency')}
                  </Label>
                  <select
                    value={preferences.bbq_frequency}
                    onChange={(e) => handleInputChange('bbq_frequency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent"
                  >
                    {bbqFrequencies.map(freq => (
                      <option key={freq} value={freq.toLowerCase()}>
                        {freq}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  {t('culinaryProfile.bbqSkillLevel', 'BBQ Skill Level')}
                </Label>
                <select
                  value={preferences.bbq_skill_level}
                  onChange={(e) => handleInputChange('bbq_skill_level', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(0.35_0.12_15)] focus:border-transparent"
                >
                  {skillLevels.map(level => (
                    <option key={level} value={level.toLowerCase()}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CulinaryProfile;

