"use client";

import React, { useEffect, useState, useRef } from "react";
import { Star, ArrowLeft, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";

interface Review {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface ReviewsData {
  reviews: Review[];
  rating?: number;
  totalRatings?: number;
}

export default function Testimonials() {
  const { testimonials: t } = ClientSideStrings();
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        const data = await response.json();
        
        if (!response.ok) {
          // Handle API errors (400, 404, 500, etc.)
          setError(data.message || data.error || "Failed to fetch reviews");
          setReviewsData(null);
        } else if (data.error) {
          // Handle error in response body
          setError(data.message || data.error);
          setReviewsData(null);
        } else {
          // Success - set reviews data
          setReviewsData(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Unable to load reviews at this time");
        setReviewsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Detect screen size
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const renderStars = (rating: number, size: string = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const slidesToShow = isMobile ? 1 : 4;
  const reviews = reviewsData?.reviews || [];
  const maxIndex = Math.max(0, reviews.length - slidesToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const newMaxIndex = Math.max(0, reviews.length - (isMobile ? 1 : 4));
      return prev >= newMaxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const newMaxIndex = Math.max(0, reviews.length - (isMobile ? 1 : 4));
      return prev <= 0 ? newMaxIndex : prev - 1;
    });
  };

  // Swipe handlers for mobile
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Reset index when screen size or reviews change
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile, reviews.length]);

  // Auto scroll
  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const newMaxIndex = Math.max(0, reviews.length - (isMobile ? 1 : 4));
        return prev >= newMaxIndex ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length, isMobile]);

  if (loading) {
    return (
      <section className="bg-gray-50 md:py-16 py-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error message if API key is not configured
  if (error && error.includes("API key not configured")) {
    return (
      <section className="bg-gray-50 md:py-16 py-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-3">
            <h4 className="uppercase tracking-wider text-secondary font-semibold">{t?.eyebrow}</h4>
          </div>
          <div className="mb-12">
            <h1 className="max-w-2xl text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {t?.title}
            </h1>
          </div>
          <div className="text-center py-12 bg-white rounded-lg border p-6">
            <p className="text-gray-600 mb-2">Google Maps API key not configured</p>
            <p className="text-sm text-gray-500">
              Please set <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> or <code className="bg-gray-100 px-2 py-1 rounded">GOOGLE_PLACES_API_KEY</code> in your environment variables.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Don't show section if no reviews and no error (or other errors)
  if (error || !reviewsData || !reviewsData.reviews || reviewsData.reviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  return (
    <section className="bg-gray-50 md:py-16 py-8">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-3">
          <h4 className="uppercase tracking-wider text-secondary font-semibold">{t?.eyebrow}</h4>
        </div>

        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <h1 className="max-w-2xl text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {t?.title}
          </h1>
          
          {reviewsData.rating && (
            <div className="flex items-center gap-2">
              {/* Google Icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-2xl font-bold text-gray-900">
                {reviewsData.rating.toFixed(1)}
              </span>
              <div className="flex items-center gap-1">
                {renderStars(Math.round(reviewsData.rating), "w-5 h-5")}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Slider */}
        <div className="relative w-full flex items-center justify-center">
          {/* Left Arrow - Hidden (auto-slide only) */}

          {/* Mobile Slider - Swipeable */}
          <div 
            className="block md:hidden w-full max-w-sm overflow-hidden relative touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full px-2"
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                    {/* Reviewer Info */}
                    <div className="flex items-start gap-3 mb-4">
                      {review.profile_photo_url ? (
                        <Image
                          src={review.profile_photo_url}
                          alt={review.author_name}
                          width={44}
                          height={44}
                          className="rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 ring-2 ring-gray-100">
                          <span className="text-gray-600 font-semibold text-sm">
                            {review.author_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="text-xs text-gray-800 font-medium truncate">
                            {review.author_name}
                          </span>
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-50 border border-green-200 flex-shrink-0">
                            <Check className="h-2 w-2 text-green-600" />
                            <span className="text-[9px] text-green-700 font-medium">Verified</span>
                          </div>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-0.5">
                          {review.relative_time_description}
                        </p>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {renderStars(review.rating, "h-3.5 w-3.5")}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed flex-1 mb-4 line-clamp-4">
                      {review.text}
                    </p>

                    {/* Google Link */}
                    {review.author_url && (
                      <a
                        href={review.author_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary text-[10px] md:text-xs mt-auto inline-block hover:underline font-medium"
                      >
                        View on Google →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Slider */}
          <div className="hidden md:block w-full max-w-7xl overflow-hidden relative">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-1/4 px-3"
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                    {/* Reviewer Info */}
                    <div className="flex items-start gap-3 mb-4">
                      {review.profile_photo_url ? (
                        <Image
                          src={review.profile_photo_url}
                          alt={review.author_name}
                          width={44}
                          height={44}
                          className="rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 ring-2 ring-gray-100">
                          <span className="text-gray-600 font-semibold text-sm">
                            {review.author_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="text-xs text-gray-800 font-medium truncate">
                            {review.author_name}
                          </span>
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-50 border border-green-200 flex-shrink-0">
                            <Check className="h-2 w-2 text-green-600" />
                            <span className="text-[9px] text-green-700 font-medium">Verified</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {review.relative_time_description}
                        </p>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {renderStars(review.rating, "h-3.5 w-3.5")}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed flex-1 mb-4 line-clamp-4">
                      {review.text}
                    </p>

                    {/* Google Link */}
                    {review.author_url && (
                      <a
                        href={review.author_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary text-[10px] md:text-xs mt-auto inline-block hover:underline font-medium"
                      >
                        View on Google →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow - Hidden (auto-slide only) */}
        </div>

        {/* Slider Indicators */}
        {reviews.length > slidesToShow && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-gray-800"
                    : "w-2 bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* View All Reviews Link */}
        {reviewsData.totalRatings && reviewsData.totalRatings > reviews.length && (
          <div className="text-center mt-8">
            <a
              href="https://www.google.com/search?sca_esv=5e300ab470657ab2&hl=es&gl=es&output=search&kgmid=/g/11yl0738fq&q=Chauffeurio+Transfers+Valencia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-800 text-white font-semibold rounded px-6 py-3 hover:bg-gray-900 transition"
            >
              View All Reviews on Google
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
