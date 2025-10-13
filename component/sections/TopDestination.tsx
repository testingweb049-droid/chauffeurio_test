"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface Destination {
  id: number
  title: string
  image: string
}

const destinations: Destination[] = [
  { id: 1, title: "OCEANOGRÀFIC AQUARIUM", image: "/hero.jpg" },
  { id: 2, title: "LA LONJA DE LA SEDA",   image: "/hero.jpg" },
  { id: 3, title: "SCIENCE MUSEUM",        image: "/hero.jpg" }
]

export default function TopDestination() {
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <section className="relative bg-[#0a3d4f] text-white py-16 px-4 overflow-hidden">
      {/* corner glow: top-right & bottom-left */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-bl from-white/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-white/15 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="mb-3 text-sm uppercase tracking-wider text-[#C2C8CA]">
              OUR TOP DESTINATIONS
            </p>
            <h2 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl">
              Explore Valencia&apos;s Top Destinations in
              <br />Style with Executive Chauffeur Travel
            </h2>
          </div>

          <button
            className="group hidden items-center gap-2 text-white transition-colors hover:text-yellow-400 md:flex"
            aria-label="View Cities"
          >
            <span className="text-sm font-medium">View Cities</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Cards */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <div key={d.id} className="group">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <Image
                  src={d.image}
                  alt={d.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Title BELOW image, not overlay */}
              <h3 className="mt-4 text-lg font-extrabold uppercase tracking-wide">
                {d.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === i ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Mobile "View Cities" */}
        <div className="mt-8 flex justify-center md:hidden">
          <button className="group flex items-center gap-2 text-white transition-colors hover:text-yellow-400">
            <span className="text-sm font-medium">View Cities</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  )
}
