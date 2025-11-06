'use client'

import React, { useEffect, useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Plane,
  CreditCard,
  MapPin,
  ClipboardCopy,
  CheckCircle2,
  Navigation,
  Calendar,
  Users,
  Luggage,
  Baby,
  Briefcase,
  FileText,
  Star,
} from 'lucide-react'
import { getOrderById } from '@/actions/get-order'

// 🕒 Helpers
const formatDate = (date?: string | Date | null) => {
  if (!date) return ''
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

const formatTime = (time?: string | null) => {
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

interface OrderPageProps {
  id: string
}

export default function OrderPage({ id }: OrderPageProps) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchOrder = async () => {
      try {
        const result = await getOrderById(id)
        if (result.status === 200 && result.order) {
          setOrder(result.order)
        } else {
          setError(result.error || 'Order not found.')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load order.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-medium">
        Loading your booking...
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        {error}
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-52">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Booking Confirmed
            </h1>
            <p className="text-gray-600">Your ride is ready to go</p>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1">Booking ID</p>
              <p className="font-mono font-bold text-gray-900 truncate">
                {order.id}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(order.id)}
              className="p-2 hover:bg-white rounded-lg transition-all duration-200"
              title="Copy ID"
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <ClipboardCopy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Price" value={`€${order.price}`} />
          <StatCard label="Vehicle" value={order.car} />
          <StatCard label="Passengers" value={order.passengers} />
          <StatCard label="Bags" value={order.bags} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Journey Details */}
          <div className="lg:col-span-2 space-y-6">
            <Section title="Journey Details" icon={<Navigation />}>
              <div className="space-y-4">
                <RouteStop
                  type="pickup"
                  location={order.pickup_location}
                  date={order.pickup_date}
                  time={order.pickup_time}
                />
                {order.stops?.map((stop: string, i: number) => (
                  <RouteStop key={i} type="stop" location={stop} number={i + 1} />
                ))}
                {order.dropoff_location && (
                  <RouteStop type="dropoff" location={order.dropoff_location} />
                )}
              </div>
            </Section>

            <Section title="Contact Information" icon={<User />}>
              <div className="grid sm:grid-cols-2 gap-4">
                <DetailItem icon={<User />} label="Name" value={order.name} />
                <DetailItem icon={<Mail />} label="Email" value={order.email} />
                <DetailItem icon={<Phone />} label="Phone" value={order.phone} />
                {order.flight && (
                  <DetailItem icon={<Plane />} label="Flight" value={order.flight} />
                )}
              </div>
            </Section>

            <Section title="Passengers & Luggage" icon={<Luggage />}>
              <div className="grid sm:grid-cols-3 gap-4">
                <PassengerCard icon={<Users />} label="Adults" count={order.passengers} />
                <PassengerCard icon={<Baby />} label="Children" count={order.kids} />
                <PassengerCard icon={<Briefcase />} label="Bags" count={order.bags} />
              </div>
            </Section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {order.extras_description && (
              <Section title="Extras" icon={<Star />}>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {order.extras_description}
                </p>
                {/* {order.extras_total && (
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Extras Total:</span>
                    <span className="text-lg font-bold text-gray-900">
                      €{order.extras_total}
                    </span>
                  </div>
                )} */}
              </Section>
            )}

            <Section title="Payment" icon={<CreditCard />}>
              <PaymentItem label="Method" value={order.payment_method || '—'} />
              <PaymentItem
                label="Booking Date"
                value={formatDate(order.created_at)}
              />
              <PaymentItem
                label="Pickup Time"
                value={`${formatDate(order.pickup_date)} ${formatTime(
                  order.pickup_time
                )}`}
              />
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Total Paid
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  €{order.price}
                </span>
              </div>
            </Section>
          </div>
        </div>
      </main>
    </div>
  )
}

// 🧩 Subcomponents
const StatCard = ({ label, value }: any) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
)

const Section = ({ title, icon, children }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg text-white">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
)

type RouteStopType = 'pickup' | 'stop' | 'dropoff';

interface RouteStopProps {
  type: RouteStopType;
  location: string;
  date?: string;
  time?: string;
  number?: number;
}

const RouteStop = ({ type, location, date, time, number }: RouteStopProps) => {
  const config = {
    pickup: { color: 'bg-emerald-500', label: 'Pick-Up' },
    stop: { color: 'bg-blue-500', label: `Stop ${number}` },
    dropoff: { color: 'bg-red-500', label: 'Drop-Off' },
  }[type]
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center text-white`}
        >
          <MapPin />
        </div>
        {type !== 'dropoff' && <div className="w-0.5 flex-1 bg-gray-300 mt-2"></div>}
      </div>
      <div className="flex-1 pb-6">
        <p className="font-semibold text-gray-900 mb-1">{config.label}</p>
        {date && (
          <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formatDate(date)} {formatTime(time)}
          </p>
        )}
        <p className="text-sm text-gray-700 break-words">{location}</p>
      </div>
    </div>
  )
}

const DetailItem = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
    <div className="text-gray-400 w-5 h-5 flex-shrink-0 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900 break-all">{value}</p>
    </div>
  </div>
)

const PassengerCard = ({ icon, label, count }: any) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col items-center justify-center text-center">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center mb-2">
      {icon}
    </div>
    <p className="font-semibold text-gray-900">{count}</p>
    <p className="text-xs text-gray-600">{label}</p>
  </div>
)

const PaymentItem = ({ label, value }: any) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
)
