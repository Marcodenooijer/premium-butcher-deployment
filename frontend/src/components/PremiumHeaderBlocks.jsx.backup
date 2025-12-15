import { useState, useEffect } from 'react'
import api from '../services/api'
import { 
  Star, Gift, Heart, Calendar 
} from 'lucide-react'

function PremiumHeaderBlocks() {
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [rewards, setRewards] = useState([])
  const [tipOfDay, setTipOfDay] = useState(null)
  const [nextEvent, setNextEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const [pointsData, rewardsData, tipData, eventData] = await Promise.all([
          api.getHeaderLoyaltyPoints(),
          api.getHeaderRewards(),
          api.getHeaderTipOfDay(),
          api.getHeaderNextEvent()
        ])

        setLoyaltyPoints(pointsData.points || 0)
        setRewards(rewardsData || [])
        setTipOfDay(tipData)
        setNextEvent(eventData)
      } catch (error) {
        console.error('Error fetching header data:', error)
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
      <div className="flex-1 min-w-[200px] bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-black/30 transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <Heart className="w-5 h-5 text-yellow-400" />
          <span className="text-white/70 text-sm uppercase tracking-wide">Tip of the Day</span>
        </div>
        <div className="text-lg font-semibold text-white line-clamp-2">
          {tipOfDay?.title || 'No tips available'}
        </div>
        {tipOfDay?.content && (
          <div className="mt-2 text-white/60 text-sm line-clamp-2">
            {tipOfDay.content}
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
