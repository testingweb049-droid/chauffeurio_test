"use client"

import { useEffect, useRef } from "react"
import Image, { StaticImageData } from "next/image"
import HeroSectionBookingForm from "../NewBookingForm/HeroBookingForm"

interface HeroSectionProps {
   bgImage: string | StaticImageData
  title: string
  description: string
}

export default function BlogHeroSection({
  bgImage,
  title,
  description,
}: HeroSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const overlay = overlayRef.current
    const formContainer = formContainerRef.current

    if (overlay) {
      overlay.style.opacity = "0.7"
      setTimeout(() => {
        overlay.style.transition = "opacity 1.5s ease-out"
        overlay.style.opacity = "0.4"
      }, 100)
    }

    if (title) {
      title.style.opacity = "0"
      title.style.transform = "translateY(30px)"

      setTimeout(() => {
        title.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out"
        title.style.opacity = "1"
        title.style.transform = "translateY(0)"
      }, 300)
    }

    if (subtitle) {
      subtitle.style.opacity = "0"
      subtitle.style.transform = "translateY(30px)"

      setTimeout(() => {
        subtitle.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out"
        subtitle.style.opacity = "1"
        subtitle.style.transform = "translateY(0)"
      }, 600)
    }

    if (formContainer) {
      formContainer.style.opacity = "0"
      formContainer.style.transform = "translateY(30px)"

      setTimeout(() => {
        formContainer.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out"
        formContainer.style.opacity = "1"
        formContainer.style.transform = "translateY(0)"
      }, 900)
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (title) {
        title.style.transform = `translateY(${scrollPosition * 0.2}px)`
      }
      if (subtitle) {
        subtitle.style.transform = `translateY(${scrollPosition * 0.1}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section id="herosection" className="relative min-h-[50vh] h-full w-full overflow-hidden pt-32 md:pt-44 pb-12">
      <Image 
        src={bgImage} 
        alt="Luxury chauffeur service" 
        fill 
        className="object-cover" 
        priority 
      />
      <div ref={overlayRef} className="absolute inset-0 bg-black" />
      <div className="container relative z-10 mx-auto flex h-full flex-col gap-10 items-center justify-center px-3 text-white lg:px-5">
        <div>
          <h1 ref={titleRef} className="mb-2 sm:mb-4 text-4xl font-bold md:text-4xl lg:text-4xl lg:leading-[55px]">
            {title}
          </h1>
          <p ref={subtitleRef} className="text-lg md:text-xl max-w-6xl lg:text-xl">
            {description}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
    </section>
  )
}