// src/services/tradingService.js
import axios from '@/config/axios'

const periodToDays = {
  Day: 1,
  Week: 7,
  Month: 30
}

export const tradingService = {
  getSummary: async (period = 'Month') => {
    const days = {
      'Day': 1,
      'Week': 7,
      'Month': 30
    }[period] || 30

    try {
      console.log('Fetching with period:', period, 'days:', days)
      const response = await axios.get(`/trading/stats/summary?days=${days}`)
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // Perbaikan transformasi win rate
  transformDailyPnL: (dailyData = []) => {
    return dailyData.map(day => {
      // Hitung total trades
      const totalTrades = (day.winning_trades || 0) + (day.losing_trades || 0);
      
      // Hitung win rate
      const winRate = totalTrades > 0 
        ? ((day.winning_trades || 0) / totalTrades) * 100 
        : 0;

      console.log('Win Rate Calculation:', {
        winning_trades: day.winning_trades,
        losing_trades: day.losing_trades,
        total_trades: totalTrades,
        calculated_win_rate: winRate
      });

      return {
        date: new Date(day.date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short'
        }),
        pnl: day.pnl,
        cumulative_pnl: day.cumulative_pnl,
        trades_count: totalTrades,
        winning_trades: day.winning_trades || 0,
        losing_trades: day.losing_trades || 0,
        win_rate: winRate
      }
    })
  },

  formatCurrency: (value) => {
    if (!value && value !== 0) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  },

  formatPercentage: (value) => {
    if (!value && value !== 0) return '0%'
    return `${value.toFixed(2)}%`
  },

  formatDate: (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}