import { useState, useEffect } from 'react'
import api from '../services/api'
import {
  Star, Gift, Heart, Calendar, ExternalLink
} from 'lucide-react'
import loyaltyApi from "@/services/loyaltyApi.js";

function PremiumHeaderBlocks() {
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [rewards, setRewards] = useState([])
  const [tipOfDay, setTipOfDay] = useState(null)
  const [nextEvent, setNextEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        // Use allSettled so one failure doesn't break everything
        const results = await Promise.allSettled([
          loyaltyApi.getEnrollments(),
          api.getHeaderRewards(),
          api.getHeaderTipOfDay(),
          api.getHeaderNextEvent()
        ])

        // Process Loyalty Points
        if (results[0].status === 'fulfilled') {
          setLoyaltyPoints(results[0].value[0].points+results[0].value[0].bonus_points+results[0].value[0].reserved_points || 0)
        } else {
          console.error('Loyalty points failed:', results[0].reason)
        }

        // Process Rewards
        if (results[1].status === 'fulfilled') {
          setRewards(results[1].value || [])
        }

        // Process Tip of the Day - Robust Handling
        if (results[2].status === 'fulfilled') {
          const tipData = results[2].value
          let processedTip = null
          
          if (Array.isArray(tipData) && tipData.length > 0) {
            processedTip = tipData[0]
          } else if (tipData && typeof tipData === 'object') {
             if (tipData.data) {
               processedTip = Array.isArray(tipData.data) ? tipData.data[0] : tipData.data
             } else {
               processedTip = tipData
             }
          }
          setTipOfDay(processedTip)
        } else {
           console.error('Tip API failed:', results[2].reason)
        }

        // Process Next Event
        if (results[3].status === 'fulfilled') {
          setNextEvent(results[3].value)
        }

      } catch (error) {
        console.error('Unexpected error in header data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeaderData()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleTipClick = () => {
    // Check for both product_link (DB column) and url (JSON file) just in case
    const link = tipOfDay?.product_link || tipOfDay?.url;
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4 mt-8 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 min-w-[200px] bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    )
  }

  // Helper to get the link safely
  const tipLink = tipOfDay?.product_link || tipOfDay?.url;

  return (
    <div className="flex flex-wrap gap-4 mt-8 w-full">
      {/* Block 1: Loyalty Points */}
      <div className="flex-1 min-w-[200px] bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-black/30 transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="text-white/70 text-sm uppercase tracking-wide">Loyalty Points</span>
        </div>
        <div className="text-4xl font-bold text-white">
          {loyaltyPoints.toLocaleString()}
        </div>
      </div>

      {/* Block 2: Rewards Available */}
      <div className="flex-1 min-w-[200px] bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-black/30 transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <Gift className="w-5 h-5 text-yellow-400" />
          <span className="text-white/70 text-sm uppercase tracking-wide">Rewards Available</span>
        </div>
        <div className="text-4xl font-bold text-white">
          {rewards.length}
        </div>
        {rewards.length > 0 && (
          <div className="mt-2 text-white/60 text-sm">
            {rewards[0].name}
          </div>
        )}
      </div>

      {/* Block 3: Saved Items / Tip */}
      <div 
        onClick={handleTipClick}
        className={`flex-1 min-w-[200px] bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 transition-all duration-300 ${
          tipLink
            ? 'hover:bg-black/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
            : 'hover:bg-black/30'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-yellow-400" />
            <span className="text-white/70 text-sm uppercase tracking-wide">Tip of the Day</span>
          </div>
          {tipLink && (
            <ExternalLink className="w-4 h-4 text-white/40" />
          )}
        </div>
        <div className="text-lg font-semibold text-white line-clamp-2">
          {tipOfDay?.title || 'No tips available'}
        </div>
        {/* Check for both content (DB) and tip (JSON) fields */}
        {(tipOfDay?.content || tipOfDay?.tip) && (
          <div className="mt-1 text-white/60 text-sm line-clamp-3">
            {tipOfDay.content || tipOfDay.tip}
          </div>
        )}
      </div>

      {/* Block 4: Next Event */}
      <div className="flex-1 min-w-[200px] bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-black/30 transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-5 h-5 text-yellow-400" />
          <span className="text-white/70 text-sm uppercase tracking-wide">Next Event</span>
        </div>
        <div className="text-lg font-semibold text-white line-clamp-2">
          {nextEvent?.title || 'No upcoming events'}
        </div>
        {nextEvent?.event_date && (
          <div className="mt-2 text-white/60 text-sm">
            {formatDate(nextEvent.event_date)}
          </div>
        )}
      </div>
    </div>
  )
}

export default PremiumHeaderBlocks

