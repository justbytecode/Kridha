"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Users, Clock, Star } from "lucide-react"

export default function LiveWaitlist() {
  const [waitlist, setWaitlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const [lastUpdated, setLastUpdated] = useState("just now")

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        setIsLoading(true)
        
        // Fetch from the actual API endpoint
        const res = await fetch("/api/waitlist")
        
        if (!res.ok) {
          throw new Error(`Failed to fetch waitlist: ${res.status}`)
        }
        
        const data = await res.json()
        setWaitlist(data)
        setLastUpdated("just now")
        setError(null)
        
        // Start countdown for "last updated" text
        startUpdateCountdown()
      } catch (error) {
        console.error("Fetch waitlist error:", error)
        setError("Unable to load waitlist data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    // Function to update the "last updated" text
    const startUpdateCountdown = () => {
      const times = ["just now", "a few seconds ago", "a minute ago"]
      let index = 0
      
      const updateInterval = setInterval(() => {
        index = (index + 1) % times.length
        setLastUpdated(times[index])
        
        if (index === times.length - 1) {
          clearInterval(updateInterval)
        }
      }, 10000) // Update every 10 seconds
      
      return () => clearInterval(updateInterval)
    }

    // Initial fetch
    fetchWaitlist()

    // Set up polling for real-time updates
    const pollingInterval = setInterval(fetchWaitlist, 30000) // Poll every 30 seconds
    
    // Clean up on component unmount
    return () => {
      clearInterval(pollingInterval)
    }
  }, [])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    fetchWaitlist()
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Clothes":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        )
      case "Jewelry":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )
      case "Sunglasses":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m-6-8h6M9 20h6" />
          </svg>
        )
      default:
        return <Star className="w-4 h-4" />
    }
  }

  // Function to handle manual refresh
  const handleManualRefresh = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/waitlist")
      
      if (!res.ok) {
        throw new Error(`Failed to fetch waitlist: ${res.status}`)
      }
      
      const data = await res.json()
      
      // Apply animations for new entries
      const currentIds = waitlist.map(item => item.id || item.name)
      const newData = data.map(item => ({
        ...item,
        isNew: !currentIds.includes(item.id || item.name)
      }))
      
      setWaitlist(newData)
      setLastUpdated("just now")
    } catch (error) {
      console.error("Manual refresh error:", error)
      setError("Failed to refresh waitlist data.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-xl" />

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-400" />
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Live Contributors
              </CardTitle>
            </div>
            
            {/* Refresh button */}
            <button 
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
            >
              <svg 
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </button>
          </div>
          <CardDescription className="text-gray-400">People who have recently joined our waitlist</CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          {isLoading && waitlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
              <p className="text-gray-400 text-sm animate-pulse">Loading waitlist data...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300 text-sm">
              <p>{error}</p>
              <button 
                onClick={handleRetry}
                className="mt-2 text-purple-400 hover:text-purple-300 text-xs underline"
              >
                Try again
              </button>
            </div>
          ) : waitlist.length > 0 ? (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/80 via-pink-500/50 to-transparent"></div>
                <ul className="space-y-4 relative">
                  <AnimatePresence>
                    {waitlist.map((entry, index) => (
                      <motion.li
                        key={entry.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="pl-8 relative"
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                      >
                        <motion.div
                          className={`absolute left-2 top-0 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                            activeIndex === index
                              ? "bg-gradient-to-br from-purple-500 to-pink-500 scale-110"
                              : "bg-gray-800 border border-gray-700"
                          } ${entry.isNew ? 'ring-2 ring-purple-400' : ''}`}
                          animate={
                            activeIndex === index || entry.isNew
                              ? {
                                  boxShadow: [
                                    "0 0 0px rgba(168, 85, 247, 0.4)",
                                    "0 0 8px rgba(168, 85, 247, 0.6)",
                                    "0 0 0px rgba(168, 85, 247, 0.4)",
                                  ],
                                }
                              : {}
                          }
                          transition={{ duration: 1.5, repeat: (activeIndex === index || entry.isNew) ? Number.POSITIVE_INFINITY : 0 }}
                        >
                          {entry.name?.charAt(0).toUpperCase() || "?"}
                        </motion.div>

                        <div
                          className={`p-4 rounded-lg transition-all duration-300 ${
                            activeIndex === index
                              ? "bg-gray-800/80 border-gray-700 border transform scale-[1.02]"
                              : entry.isNew
                              ? "bg-gray-800/60 border-purple-900/40 border"
                              : "bg-gray-800/40 border-gray-800 border"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium text-white">
                              {entry.name}
                              {entry.isNew && (
                                <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full">
                                  New
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center text-xs text-gray-400">
                              <Clock className="w-3 h-3 mr-1" />
                              {entry.joinedAt}
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{entry.shopifyStoreName}</p>
                          <div className="flex items-center text-xs text-purple-400 bg-purple-900/20 rounded-full py-1 px-2 w-fit">
                            {getCategoryIcon(entry.category)}
                            <span className="ml-1">{entry.category}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    <span className="text-purple-400 font-medium">{waitlist.length}</span> people on waitlist
                  </p>
                  <p className="text-xs text-gray-500">Updated {lastUpdated}</p>
                </div>
                <div className="flex -space-x-2">
                  {waitlist.slice(0, 3).map((entry, index) => (
                    <motion.div
                      key={index}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium border-2 border-gray-900 ${entry.isNew ? 'ring-1 ring-purple-300' : ''}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {entry.name?.charAt(0).toUpperCase() || "?"}
                    </motion.div>
                  ))}
                  {waitlist.length > 3 && (
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-medium border-2 border-gray-900"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      +{waitlist.length - 3}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Users className="h-8 w-8 text-gray-400" />
              </motion.div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No one has joined yet</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Be the first to join our waitlist and get early access to our Virtual Try-On platform!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}