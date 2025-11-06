'use client'

import React, { useEffect, useState } from 'react'
import { MdDone } from 'react-icons/md'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getOrderById } from '@/actions/get-order'
import { fleets } from '../book-ride/CarList'

// 📅 Helper to format date nicely
function formatDate(date?: string | Date | null) {
    if (!date) return 'N/A'
    try {
        const d = typeof date === 'string' ? new Date(date) : date
        return d.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    } catch {
        return 'N/A'
    }
}

// ⏰ Helper to format time in AM/PM
function formatTime(time?: string | null) {
    if (!time) return ''
    try {
        const parsed = new Date(`1970-01-01T${time}`)
        return parsed.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
    } catch {
        return time
    }
}

export default function OrderPlacedPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('order_id')
    const paymentStatus = searchParams.get('payment')

    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!orderId) return

        const fetchOrder = async () => {
            try {
                const result = await getOrderById(orderId)
                if (result.status === 200 && result.order) {
                    setOrder(result.order)
                } else {
                    setError(result.error || 'Order not found.')
                }
            } catch (err) {
                console.error(err)
                setError('Failed to fetch order details.')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderId])

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-[60vh] text-lg font-medium text-gray-600 animate-pulse px-4 text-center">
                Loading your order...
            </div>
        )

    if (error)
        return (
            <div className="flex justify-center items-center min-h-[60vh] text-lg font-medium text-red-500 px-4 text-center">
                {error}
            </div>
        )

    const selectedFleet = fleets.find((item) => item.category === order.car)

    return (
        <div className="w-full bg-slate-100 flex flex-col min-h-screen">
            <div className="h-20 sm:h-24 w-full bg-black" />

            <div className="max-w-5xl mx-auto py-10 sm:py-16 lg:py-20 w-full flex flex-col items-center gap-6 sm:gap-8 px-4">
                <MdDone className="p-2 text-white bg-green-500 rounded-full shadow-lg" size={50} />

                <div className="text-gray-800 text-center text-base sm:text-lg">
                    Great choice, <span className="font-semibold">{order.name}</span>
                </div>

                <div className="text-black text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center leading-tight">
                    YOUR RESERVATION IS CONFIRMED
                </div>

                {paymentStatus === 'failed' && (
                    <div className="text-red-600 font-semibold text-sm sm:text-base text-center">
                        Payment failed — please contact support.
                    </div>
                )}

                <div className="text-gray-800 text-center text-sm sm:text-base">
                    We've sent a confirmation email to <strong>{order.email}</strong>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                    <div className="md:col-span-2 bg-white border border-gray-300 py-6 px-5 sm:px-6 rounded-2xl flex flex-col gap-6 text-start shadow-sm">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold">Your itinerary</div>

                        <div className="flex gap-3 w-full">
                            <div className="w-1 bg-gray-500 rounded-full" />
                            <div className="flex flex-col gap-3 w-full text-sm sm:text-base text-gray-700">
                                <div>{order.pickup_location}</div>
                                {order.stops?.map((stop: string, i: number) => (
                                    <div key={i}>{stop}</div>
                                ))}
                                {order.dropoff_location && <div>{order.dropoff_location}</div>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 text-sm sm:text-base">
                            <div className="text-gray-500 font-medium">Pickup Date & Time</div>
                            <div className="font-semibold text-gray-800">
                                {formatDate(order.pickup_date)} {formatTime(order.pickup_time)}
                            </div>
                        </div>

                        {order.return_date && (
                            <div className="flex flex-col gap-1 text-sm sm:text-base">
                                <div className="text-gray-500 font-medium">Return Date & Time</div>
                                <div className="font-semibold text-gray-800">
                                    {formatDate(order.return_date)} {formatTime(order.return_time)}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end mt-4">
                            <Link
                                href={`/order/${orderId}`}
                                className="bg-primary/90 hover:bg-primary/60 transition-colors duration-200 px-4 sm:px-5 py-2 text-white font-semibold rounded-md text-sm sm:text-base"
                            >
                                View Order Details
                            </Link>
                        </div>
                    </div>

                    {selectedFleet && (
                        <div className="border border-gray-300 p-4 sm:p-6 flex flex-col items-center justify-center bg-gray-200 rounded-2xl shadow-sm">
                            <Image
                                src={selectedFleet.imageUrl}
                                alt={selectedFleet.displayName}
                                width={280}
                                height={160}
                                className="object-contain w-full max-w-[300px]"
                            />
                            <div className="font-bold mt-3 text-center text-sm sm:text-base">
                                {selectedFleet.displayName}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-10 md:hidden">
                    <Link
                        href="/"
                        className="bg-black text-white px-5 py-2.5 rounded-md text-sm sm:text-base font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Book Another Ride
                    </Link>
                </div>
            </div>
        </div>
    )
}
