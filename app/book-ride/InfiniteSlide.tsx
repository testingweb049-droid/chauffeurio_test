import Image from 'next/image'
import React from 'react'
import one from "@/assets/new-form/1.png"
import two from "@/assets/new-form/2.png"
import three from "@/assets/new-form/3.png"
import four from "@/assets/new-form/4.png"
import five from "@/assets/new-form/5.png"

const list = [
    {
      image: one,
      text: 'Competitive Rates'
    },
    {
      image: two,
      text: 'Online Payment'
    },
    {
      image: three,
      text: 'Everywhere in England'
    },
    {
      image: four,
      text: 'Trustworthy'
    },
    {
      image: five,
      text: 'Meet and Greet'
    },
]

function InfiniteSlide() {

    return <div className="overflow-hidden flex max-w-screen-lg mx-auto w-full ">
          <div className="flex items-center max-lg:animate-infinite-slide px-2 py-8">
            { list.map((item)=>{
              return <div key={item.text} className="flex items-center text-gray-700 text-xl font-medium " >
                <div className="pl-8 pr-4 w-24" >
                <Image src={item.image} alt={item.text} className="w-12"/>
                </div>
                <p className="text-nowrap">{item.text}</p>
              </div>
            })
            }
            { [...list, ...list, ...list].map((item)=>{
              return <div key={item.text} className="flex items-center text-gray-700 text-xl font-medium lg:hidden" >
                <div className="pl-8 pr-4 w-24" >
                <Image src={item.image} alt={item.text} className="w-12"/>
                </div>
                <p className="text-nowrap">{item.text}</p>
              </div>
            })
            }
          </div>
        </div>

}

export default InfiniteSlide