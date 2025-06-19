'use client'

import { useEffect } from 'react'

export default function ScrollEffects() {
  useEffect(() => {
    // Add shadow to navbar on scroll
    const handleScroll = () => {
      const nav = document.querySelector('nav')
      if (nav) {
        if (window.scrollY > 10) {
          nav.classList.add('scrolled', 'shadow-lg')
        } else {
          nav.classList.remove('scrolled', 'shadow-lg')
        }
      }
    }

    // Smooth scrolling for navigation links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        
        const targetId = target.getAttribute('href')
        const targetElement = document.querySelector(targetId!)
        
        if (targetElement) {
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          })
        }
      }
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll)
    
    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll)
    })

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll)
      })
    }
  }, [])

  return null // This component only handles effects, no UI
}