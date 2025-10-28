'use client';

import React from 'react';
import useFormStore from '@/stores/FormStore';
import MyPaymentForm from './PaymentForm';
import BackButton from './BackButton';

function Step4() {
  const { formData, getTotalPrice } = useFormStore();

  // Currency symbol
  const CURRENCY = '€';

  // Read values from store
  const basePriceNum = Number(formData.price.value ?? 0);
  const isReturn = Boolean(formData.isReturn.value);
  const isMeetGreet = Boolean(formData.isMeetGreet.value);
  const isFlightTrack = Boolean(formData.isFlightTrack.value);
  const childSeats = Number(formData.childSeat.value ?? 0);
  const infantSeats = Number(formData.infantSeat.value ?? 0);
  const boosterSeats = Number(formData.boosterSeat.value ?? 0);
  const carLabel = String(formData.car.value ?? 'Economy Sedan Transfer');

  // Fees
  const MEET_GREET_FEE = 15;
  const FLIGHT_TRACK_FEE = 7;
  const CHILD_SEAT_FEE = 5;
  const INFANT_SEAT_FEE = 5;
  const BOOSTER_SEAT_FEE = 5;

  // Return calculation: if return is selected, return price is base - 10%
  const returnPriceNum = isReturn ? basePriceNum - basePriceNum / 10 : 0;

  // Calculate extras totals
  const childSeatTotal = childSeats * CHILD_SEAT_FEE;
  const infantSeatTotal = infantSeats * INFANT_SEAT_FEE;
  const boosterSeatTotal = boosterSeats * BOOSTER_SEAT_FEE;
  const meetGreetTotal = isMeetGreet ? MEET_GREET_FEE : 0;
  const flightTrackTotal = isFlightTrack ? FLIGHT_TRACK_FEE : 0;

  // Get total price from form store (includes all extras)
  const totalPriceNum = getTotalPrice();

  // Formatted strings for display
  const format = (n: number) => n.toFixed(2);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-5 w-full">
          <div className="font-bold">Price Breakdown</div>

          <div className="flex flex-col gap-2 w-full">
            {/* Base Price */}
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-gray-500">{carLabel}</div>
              <div className="text-sm text-gray-500">
                {CURRENCY} {format(basePriceNum)}
              </div>
            </div>

            {/* Child Seats */}
            {childSeats > 0 && (
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-gray-500">
                  Child Seat{childSeats > 1 ? 's' : ''} (x{childSeats})
                </div>
                <div className="text-sm text-gray-500">
                  {CURRENCY} {format(childSeatTotal)}
                </div>
              </div>
            )}

            {/* Infant Seats */}
            {infantSeats > 0 && (
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-gray-500">
                  Infant Seat{infantSeats > 1 ? 's' : ''} (x{infantSeats})
                </div>
                <div className="text-sm text-gray-500">
                  {CURRENCY} {format(infantSeatTotal)}
                </div>
              </div>
            )}

            {/* Booster Seats */}
            {boosterSeats > 0 && (
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-gray-500">
                  Booster Seat{boosterSeats > 1 ? 's' : ''} (x{boosterSeats})
                </div>
                <div className="text-sm text-gray-500">
                  {CURRENCY} {format(boosterSeatTotal)}
                </div>
              </div>
            )}

            {/* Meet & Greet */}
            {isMeetGreet && (
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-gray-500">Meet & Greet</div>
                <div className="text-sm text-gray-500">
                  {CURRENCY} {format(MEET_GREET_FEE)}
                </div>
              </div>
            )}

            {/* Flight Track */}
            {isFlightTrack && (
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-gray-500">Flight Track</div>
                <div className="text-sm text-gray-500">
                  {CURRENCY} {format(FLIGHT_TRACK_FEE)}
                </div>
              </div>
            )}

            {/* Return Transfer */}
            {isReturn && (
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-gray-500">Return Transfer</div>
                <div className="text-sm text-gray-500">
                  {CURRENCY} {format(returnPriceNum)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t-2 border-black border-dashed text-2xl font-bold text-black">
          <div>Total:</div>
          <div>
            {CURRENCY} {format(totalPriceNum)}
          </div>
        </div>
      </div>

      <MyPaymentForm price={String(totalPriceNum)} />

      <BackButton step={4} />
    </div>
  );
}

export default Step4;