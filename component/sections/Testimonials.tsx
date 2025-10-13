"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Nick Evans",
    avatar: "https://i.pravatar.cc/150?img=12",
    verified: true,
    date: "1 week ago",
    rating: 5,
    comment:
      "Absolutely brilliant service! The driver arrived right on time, and the car was immaculate. The whole pricing was very transparent, and the journey was smooth and comfortable.",
  },
  {
    id: 2,
    name: "Emma Johnson",
    avatar: "https://i.pravatar.cc/150?img=5",
    verified: true,
    date: "2 weeks ago",
    rating: 5,
    comment:
      "Absolutely brilliant service! The driver arrived right on time, and the car was immaculate. The whole pricing was very transparent, and the journey was smooth and comfortable.",
  },
  {
    id: 3,
    name: "John Green",
    avatar: "https://i.pravatar.cc/150?img=13",
    verified: true,
    date: "3 weeks ago",
    rating: 5,
    comment:
      "Absolutely brilliant service! The driver arrived right on time, and the car was immaculate. The whole pricing was very transparent, and the journey was smooth and comfortable.",
  },
  {
    id: 4,
    name: "Megan Smith",
    avatar: "https://i.pravatar.cc/150?img=9",
    verified: true,
    date: "1 month ago",
    rating: 5,
    comment:
      "Absolutely brilliant service! The driver arrived right on time, and the car was immaculate. The whole pricing was very transparent, and the journey was smooth and comfortable.",
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "https://i.pravatar.cc/150?img=14",
    verified: true,
    date: "2 months ago",
    rating: 5,
    comment:
      "Absolutely brilliant service! The driver arrived right on time, and the car was immaculate. The whole pricing was very transparent, and the journey was smooth and comfortable.",
  },
  {
    id: 6,
    name: "Sarah Taylor",
    avatar: "https://i.pravatar.cc/150?img=10",
    verified: true,
    date: "3 months ago",
    rating: 5,
    comment:
      "Absolutely brilliant service! The driver arrived right on time, and the car was immaculate. The whole pricing was very transparent, and the journey was smooth and comfortable.",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 1280) {
        setItemsToShow(4)
      } else if (width >= 1024) {
        setItemsToShow(3)
      } else if (width >= 768) {
        setItemsToShow(2)
      } else {
        setItemsToShow(1)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalSlides = Math.ceil(testimonials.length / itemsToShow)

  const getVisibleTestimonials = () => {
    const startIdx = currentIndex * itemsToShow
    return testimonials.slice(startIdx, startIdx + itemsToShow)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }

  const renderStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <svg
        key={i}
        className="h-3 w-3 fill-yellow-400 text-yellow-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-3">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">TESTIMONIALS</p>
        </div>

        {/* Title and Review Badges */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12 gap-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-2xl">
            Explore Valencia with Our Executive Chauffeur Travel
          </h2>

          {/* Review Badges */}
          <div className="flex flex-wrap gap-4">
            {/* Google Reviews */}
            <div className=" p-4 min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-semibold text-gray-900 text-sm">Google</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xl font-bold text-gray-900">4.9</span>
                <div className="flex">{renderStars(5)}</div>
              </div>
              <p className="text-xs text-gray-500">2,394 reviews</p>
            </div>

            {/* Facebook Reviews */}
            <div className="p-4 min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <svg className="h-5 w-5 fill-blue-600" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-semibold text-gray-900 text-sm">Facebook</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xl font-bold text-gray-900">5.0</span>
                <div className="flex">{renderStars(5)}</div>
              </div>
              <p className="text-xs text-gray-500">1,428 reviews</p>
            </div>

            {/* TripAdvisor Reviews */}
            <div className=" p-4 min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#00AA6C" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <circle fill="#00AA6C" cx="8.5" cy="12" r="2.5"/>
                  <circle fill="#00AA6C" cx="15.5" cy="12" r="2.5"/>
                </svg>
                <span className="font-semibold text-gray-900 text-sm">TripAdvisor</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xl font-bold text-gray-900">4.9</span>
                <div className="flex">{renderStars(5)}</div>
              </div>
              <p className="text-xs text-gray-500">3,891 reviews</p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="relative">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
            {getVisibleTestimonials().map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                {/* User Info */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-700">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {testimonial.name}
                        </h4>
                        {testimonial.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500 fill-green-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{testimonial.date}</p>
                    </div>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="mb-3 flex gap-1">{renderStars(testimonial.rating)}</div>

                {/* Comment */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {testimonial.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === index
                    ? "w-8 bg-gray-800"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}