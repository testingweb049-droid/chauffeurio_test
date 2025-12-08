import Image from "next/image";
import HeroImg from "@/assets/bmw.png";
import FleetBg from "@/assets/bmw-city.jpeg";
export default function WhyChoose() {
  return (
    <section className="py-20 bg-white text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={FleetBg}
                alt="OKTaxis Fleet"
                fill
                className="object-cover"
              />
            </div>
            {/* <div className="absolute -bottom-6 -left-6 bg-brand p-6 rounded-xl shadow-lg text-white hidden lg:block w-48">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm font-medium">Vehicles in Our Fleet</div>
            </div> */}
          </div>
          <div className="lg:w-1/2">
            <div className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              Our Fleet
            </div>
            <h2 className="text-4xl text-black font-bold mb-6 leading-tight">
              Vehicle Options at <span className="text-brand">OKTaxis</span>
            </h2>
            
            <p className="text-black mb-6">
              Have a look at our different cars, grouped to make it simple to choose what's right for your journey. We work in main UK spots like Manchester, Liverpool, London, Leeds, Birmingham, and Edinburgh, with picks that mix price, fancy touches, and size. We keep everything in top nick so each trip feels new and safe—get in touch and give it a go.
            </p>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl text-black font-semibold mb-2">1. Economy Cars</h3>
                  <p className="text-black">
                    Great for daily runs or if you're watching the pennies, our economy picks like the Skoda Octavia and Toyota Prius are thrifty on fuel and solid. They're small but cosy, ideal for one person or quick town jaunts.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl text-black font-semibold mb-2">2. Executive Cars</h3>
                  <p className="text-black">
                    Go up a notch with executive ones like the BMW 5 Series and Mercedes E-Class, with soft seats and easy driving. Just right for work folks who want a smart, pro feel while moving.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl text-black font-semibold mb-2">3. Executive Premium</h3>
                  <p className="text-black">
                    For the best luxury, pick our premium Tesla Model S, with its modern electric power and quiet, clean drive. Made for people after class with no fumes at all.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl text-black font-semibold mb-2">4. XL & Group Vehicles</h3>
                  <p className="text-black">
                    If you're with family or a bunch, our big Passenger Van has loads of space for up to eight plus their stuff. It's flexible and spacious, brilliant for airport drops or group days out in our areas.
                  </p>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}