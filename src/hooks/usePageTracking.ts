'use client'

import { useEffect, useRef } from 'react'
import { trackScrollDepth, trackTimeOnPage } from '@/lib/tracking'

export function usePageTracking(pageType: string) {
  const scrollTracked = useRef<Set<number>>(new Set())
  const timeTracked = useRef<Set<number>>(new Set())
  const startTime = useRef<number>(Date.now())

  useEffect(() => {
    // Track scroll depth
    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      // Track at 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100]
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !scrollTracked.current.has(milestone)) {
          scrollTracked.current.add(milestone)
          trackScrollDepth(milestone)
        }
      })
    }

    // Track time on page
    const timeInterval = setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - startTime.current) / 1000)
      
      // Track at 30s, 60s, 120s
      const timeMilestones = [30, 60, 120]
      timeMilestones.forEach(milestone => {
        if (timeOnPage >= milestone && !timeTracked.current.has(milestone)) {
          timeTracked.current.add(milestone)
          trackTimeOnPage(milestone)
        }
      })
    }, 5000) // Check every 5 seconds

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(timeInterval)
    }
  }, [pageType])
}
