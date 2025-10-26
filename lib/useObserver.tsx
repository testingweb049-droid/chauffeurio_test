"use client"

import { useState, useEffect, useRef } from "react"

interface UseIntersectionObserverProps {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  onIntersect?: () => void
}

export function useIntersectionObserver({
  root = null,
  rootMargin = "0px",
  threshold = 0.1,
  onIntersect,
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const targetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)

        if (entry.isIntersecting && onIntersect) {
          onIntersect()
        }
      },
      {
        root,
        rootMargin,
        threshold,
      },
    )

    const currentTarget = targetRef.current

    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [root, rootMargin, threshold, onIntersect])

  return { ref: targetRef, isIntersecting }
}
