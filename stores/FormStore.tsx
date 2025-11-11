'use client';

import { createOrder, OrderDataType } from "@/actions/add-order";
import { CreateStripePaymentURLAction } from "@/actions/create-stripe-payment-url";
import { calculateDistance } from "@/actions/get-distance";
import { fleets } from "@/app/book-ride/CarList";
import { hourlyInitialFormData, tripInitialFormData } from "@/constants/storeInitailObjects";
import { OrderReturnType } from "@/types/OrderProps";
import { create } from "zustand";

export interface FieldType<T> {
  value: T;
  error: string;
  coardinates: string;
  coardinatesRequired: boolean;
  required: boolean;
  step: number;
}

export interface FormDataType {
  [x: string]: any;
  fromLocation: FieldType<string>;
  toLocation: FieldType<string>;
  stops: FieldType<string>[];
  duration: FieldType<string>;
  distance: FieldType<number>;
  car: FieldType<string>;
  price: FieldType<string>;
  name: FieldType<string>;
  phone: FieldType<string>;
  email: FieldType<string>;
  date: FieldType<string>;
  time: FieldType<string>;
  returnDate: FieldType<string>;
  returnTime: FieldType<string>;
  passengers: FieldType<string>;
  bags: FieldType<string>;
  flightName: FieldType<string>;
  flightNumber: FieldType<string>;
  paymentId: FieldType<string>;
  isAirportPickup: FieldType<boolean>;
  isFlightTrack: FieldType<boolean>;
  isMeetGreet: FieldType<boolean>;
  isReturn: FieldType<boolean>;
  childSeat: FieldType<number>;
  infantSeat: FieldType<number>;
  boosterSeat: FieldType<number>;
  description: FieldType<string>;
  extraStops: FieldType<number>;
}

interface FormStoreType {
  step: number;
  isMobileDropdownOpen: boolean;
  category: "trip" | "hourly";
  formError: string;
  orderId: string;
  paymentURL: string;
  isOrderDone: boolean;
  formLoading: boolean;
  formData: FormDataType;
  setFormData: (
    key: keyof FormDataType | "stops",
    value: string | boolean | number,
    coardinates?: string,
    index?: number
  ) => void;
  setFieldOptions: (
    key: keyof FormDataType | "stops",
    required: boolean,
  ) => void;
  validateData: (_step: number) => boolean;
  changeStep: (isNext: boolean, _step: number, payment_secret?:string) => Promise<boolean>;
  changeCategory: (newCategory: "trip" | "hourly") => void;
  manageStops: (action: "add" | "remove", index?: number) => void;
  toggleMobileDropdown: () => void;
  resetForm: () => void;
  updateExtra: (extraType: 'childSeat' | 'infantSeat' | 'boosterSeat', value: number) => void;
  getTotalPrice: () => number;
  createOrderForPayment: () => Promise<{ success: boolean; orderId?: string; error?: string }>;
  getActualOrderId: () => string;
  loadOrderIntoForm: (order: OrderReturnType, step?:number) => void
}

const makeStop = (required = false): FieldType<string> => ({
  value: "",
  coardinates: "",
  error: "",
  required,
  coardinatesRequired: required,
  step: 1,
});

const useFormStore = create<FormStoreType>((set, get) => ({
  step: 1,
  isMobileDropdownOpen: false,
  category: "trip",
  formError: "",
  formLoading: false,
  formData: {
    ...tripInitialFormData,
    childSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
    infantSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
    boosterSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
    description: { value: "", error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
    extraStops: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
  },
  isOrderDone: false,
  orderId: '',
  paymentURL: '',

  setFormData: (key, value, coardinates = "", index) => {
    if (key === "stops" && typeof index === "number") {
      set((state) => {
        const stops = [...state.formData.stops];
        stops[index] = { ...stops[index], value: value as string, coardinates, error: '' };
        return { formData: { ...state.formData, stops } };
      });
      return;
    }
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: { ...state.formData[key as keyof FormDataType], value, coardinates, error: '' },
      },
    }));
  },

  setFieldOptions: (key, required) => {
    if (key === 'stops') return;
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: { ...state.formData[key as keyof FormDataType], error: '', required },
      },
    }));
  },

  updateExtra: (extraType, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [extraType]: { ...state.formData[extraType], value, error: '' },
      },
    }));
  },

  getTotalPrice: () => {
    const { formData } = get();
    const basePrice = parseFloat(formData.price.value) || 0;
    const returnBasePrice = formData.isReturn.value ? basePrice * 0.9 : 0;
    
    const extrasTotal =
    (formData.childSeat.value * 5) +
    (formData.infantSeat.value * 5) +
    (formData.boosterSeat.value * 5) +
      (formData.isFlightTrack.value ? 7 : 0) +
      (formData.isMeetGreet.value ? 15 : 0);

    return basePrice + extrasTotal + returnBasePrice;
  },

  getActualOrderId: () => {
    const { orderId } = get();
    return orderId && !orderId.startsWith('pending-') ? orderId : '';
  },

  createOrderForPayment: async () => {
    const { formData, getTotalPrice, category } = get();

    const totalPrice = getTotalPrice();
    const carImage = fleets.find((item) => item.category === formData.car.value)?.imageUrl;

    const orderData: OrderDataType = {
      fromLocation: formData.fromLocation.value,
      toLocation: formData.toLocation.value,
      stops: formData.stops.map((s) => s.value),
      duration: formData.duration.value,
      distance: formData.distance.value,
      car: formData.car.value,
      price: totalPrice.toString(),
      name: formData.name.value,
      phone: formData.phone.value,
      email: formData.email.value,
      date: formData.date.value,
      time: formData.time.value,
      returnDate: formData.returnDate.value,
      returnTime: formData.returnTime.value,
      passengers: formData.passengers.value,
      bags: formData.bags.value,
      flightName: formData.flightName.value,
      flightNumber: formData.flightNumber.value,
      paymentId: formData.paymentId.value,
      isAirportPickup: formData.isAirportPickup.value,
      isFlightTrack: formData.isFlightTrack.value,
      isMeetGreet: formData.isMeetGreet.value,
      isReturn: formData.isReturn.value,
      carImage,
      category: category,
      extras: {
        childSeat: formData.childSeat.value.toString(),
        infantSeat: formData.infantSeat.value.toString(),
        boosterSeat: formData.boosterSeat.value.toString(),
        flightTrack: formData.isFlightTrack.value ? "yes" : "no",
        meetGreet: formData.isMeetGreet.value ? "yes" : "no",
        description: formData.description.value,
        extraStops: formData.extraStops.value.toString(),
        extrasTotal: (totalPrice - (parseFloat(formData.price.value) || 0)).toString(),
      },
    };

    try {
      const response = await createOrder(orderData, 'ffdd' );
      console.log("Order creation response:", response);

      if (response.status !== 201) {
        return { success: false, error: response.error };
      }

      const actualOrderId = response?.order?.id || '';
      console.log("✅ Order created with ID:", actualOrderId);

      set({
        orderId: actualOrderId,
        formData: {
          ...get().formData,
          paymentId: { ...get().formData.paymentId, value: actualOrderId }
        }
      });

      return { success: true, orderId: actualOrderId };
    } catch (error) {
      console.error("Order creation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create order"
      };
    }
  },

  validateData: (_step: number) => {
    const { formData } = get();
    const updated: FormDataType = { ...formData };

    (Object.keys(formData) as (keyof FormDataType)[]).forEach((k) => {
      if (k === "stops") return;
      const item = formData[k] as FieldType<any>;
      const hasErr = item.step === _step && item.required && !item.value;
      const hasErr2 = item.step === _step && item.coardinatesRequired && !item.coardinates;
      (updated[k] as FieldType<any>) = { ...item, error: hasErr ? `${k} is required` : hasErr2 ? `${k} coordinates required` : "" };
    });

    const stopsUpdated = formData.stops.map((s) => {
      const hasErr = s.step === _step && s.required && !s.value;
      const hasErr2 = s.step === _step && s.coardinatesRequired && !s.coardinates;
      return { ...s, error: hasErr ? `stop is required` : hasErr2 ? `stop coordinates required` : "" };
    });

    updated.stops = stopsUpdated;
    set({ formData: updated });

    const anyErrorField = Object.values(updated as FormDataType).some((v) => {
      if (Array.isArray(v)) {
        return v.some((s) => s.error !== '');
      }
      return v.error !== '';
    });

    return anyErrorField;
  },

  changeStep: async (isNext, _step, payment_secret) => {
    const { formData, category, validateData , getTotalPrice} = get();

    if (!isNext) {
      set((state) => ({
        ...state,
        step: isNext ? _step + 1 : Math.max(1, _step - 1),
      }));
      return true;
    }

    set((state) => ({ ...state, formError: "", formLoading: true }));

    if (validateData(_step)) {
      console.log("not validate");
      set((state) => ({ ...state, formError: "", formLoading: false }));
      return false;
    }

    console.log("validate");

    if (_step === 1 && category === "trip") {
      try {
        const stopsCoords = formData.stops.map((s) => s.coardinates);
        const distanceResponse = await calculateDistance({
          from: formData.fromLocation.coardinates,
          to: formData.toLocation.coardinates,
          stops: stopsCoords,
        } as any);
        console.log("distanceResponse ", distanceResponse);
        if (distanceResponse.status !== 200) {
          set((state) => ({ ...state, formError: distanceResponse.error ?? "route not found", formLoading: false }));
          return false;
        }
        set((state) => ({
          ...state,
          formData: { ...state.formData, distance: { ...state.formData.distance, value: distanceResponse?.kmDistance ?? 0 } },
        }));
      } catch (error) {
        set((state) => ({
          ...state,
          formError: error instanceof Error ? error.message : "route not found",
          formLoading: false,
        }));
        return false;
      }
    }

    if(_step===3 && isNext){
      const totalPrice = getTotalPrice();
      const carImage = fleets.find((item) => item.category === formData.car.value)?.imageUrl;

      const orderData: OrderDataType = {
      fromLocation: formData.fromLocation.value,
      toLocation: formData.toLocation.value,
      stops: formData.stops.map((s) => s.value),
      duration: formData.duration.value,
      distance: formData.distance.value,
      car: formData.car.value,
      price: totalPrice.toString(),
      name: formData.name.value,
      phone: formData.phone.value,
      email: formData.email.value,
      date: formData.date.value,
      time: formData.time.value,
      returnDate: formData.returnDate.value,
      returnTime: formData.returnTime.value,
      passengers: formData.passengers.value,
      bags: formData.bags.value,
      flightName: formData.flightName.value,
      flightNumber: formData.flightNumber.value,
      paymentId: formData.paymentId.value,
      isAirportPickup: formData.isAirportPickup.value,
      isFlightTrack: formData.isFlightTrack.value,
      isMeetGreet: formData.isMeetGreet.value,
      isReturn: formData.isReturn.value,
      carImage,
      category: category,
      extras: {
        childSeat: formData.childSeat.value.toString(),
        infantSeat: formData.infantSeat.value.toString(),
        boosterSeat: formData.boosterSeat.value.toString(),
        flightTrack: formData.isFlightTrack.value ? "yes" : "no",
        meetGreet: formData.isMeetGreet.value ? "yes" : "no",
        description: formData.description.value,
        extraStops: formData.extraStops.value.toString(),
        extrasTotal: (totalPrice - (parseFloat(formData.price.value) || 0)).toString(),
      },
      };

    try {
      const response = await createOrder(orderData, payment_secret ?? 'n/a');
      console.log("Order creation response:", response);

      if (response.status !== 200) {
      set((state) => ({ ...state, formError: response.error, formLoading: false }));
      return false;
      }

      const actualOrderId = response?.order?.id || '';
      console.log("✅ Order created with ID:", actualOrderId);

      const paymentSession = await CreateStripePaymentURLAction(getTotalPrice(), actualOrderId, payment_secret??'n/a')
      console.log("paymentSession : ",paymentSession)
      if(!paymentSession.success){
       set((state) => ({ ...state, formError: paymentSession.error ?? 'n/a', formLoading: false }));
       return false;
      }

     console.log("is Order Done ",true)
      set((state)=>({
        ...state,
        orderId: actualOrderId,
        paymentURL: paymentSession.url?.toString(),
        isOrderDone: true
      }));

    } catch (error) {
      console.error("Order creation error:", error);
     
      set((state) => ({ ...state, formError: error instanceof Error ? error.message : "Failed to create order", formLoading: false }));
      return false;
    }
    }

    console.log("working fine : ", _step);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("working fine 2 : ", _step);
    if(_step===3){
      set((state) => ({ ...state, formError: ""  }));
      return true;
    }
    set((state) => ({ ...state, formError: "", formLoading: false, step: isNext ? _step + 1 : Math.max(1, _step - 1) }));
    return true;
  },

  changeCategory: (newCategory) => {
    const { category } = get();
    if (category === newCategory) return;

    const baseFormData = newCategory === "trip" ? tripInitialFormData : hourlyInitialFormData;

    if (newCategory === "trip") {
      set({
        formData: {
          ...baseFormData,
          childSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
          infantSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
          boosterSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
          description: { value: "", error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
        },
        step: 1,
        category: "trip",
        formError: "",
        formLoading: false,
        orderId: '', // Reset orderId
      });
    } else {
      set({
        formData: {
          ...baseFormData,
          childSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
          infantSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
          boosterSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
          description: { value: "", error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
        },
        step: 1,
        category: "hourly",
        formError: "",
        formLoading: false,
        orderId: '', // Reset orderId
      });
    }
  },

  manageStops: (action, index) => {
    const { formData } = get();
    if (action === "add") {
      set((state) => ({
        ...state,
        formData: {
          ...state.formData,
          stops: [
            ...state.formData.stops.slice(0, index),
            makeStop(true),
            ...state.formData.stops.slice(index, state.formData.stops.length)
          ]
        }
      }));
      return;
    }
    if (action === "remove" && typeof index === "number") {
      const stops = [...formData.stops];
      stops.splice(index, 1);
      set((state) => ({ ...state, formData: { ...state.formData, stops } }));
    }
  },

  toggleMobileDropdown: () => {
    set((state) => ({ ...state, isMobileDropdownOpen: !state.isMobileDropdownOpen }));
  },
  
  
loadOrderIntoForm: (order: OrderReturnType , step?:number) => {
  const mapField = (<T,>(value: T, step = 1, required = false): FieldType<T> => ({
    value,
    error: "",
    coardinates: "",
    coardinatesRequired: false,
    required,
    step,
  }));

  const stops = (order.stops ?? []).map((s) => ({
    value: s,
    error: "",
    coardinates: "",
    coardinatesRequired: false,
    required: false,
    step: 1,
  }));

  set({
    formData: {
      fromLocation: mapField(order.pickup_location, 1, true),
      toLocation: mapField(order.dropoff_location ?? "", 1, true),
      stops,
      duration: mapField(order.duration ? order.duration.toString() : "", 1),
      distance: mapField(order.distance ? parseFloat(order.distance) : 0, 2),
      car: mapField(order.car, 2, true),
      price: mapField(order.price, 2, true),
      name: mapField(order.name, 3, true),
      phone: mapField(order.phone, 3, true),
      email: mapField(order.email, 3, true),
      date: mapField(
        order.pickup_date
          ? new Date(order.pickup_date).toISOString().split("T")[0]
          : "",
        1,
        true
      ),
      time: mapField(order.pickup_time ?? "", 1, true),
      returnDate: mapField(
        order.return_date
          ? new Date(order.return_date).toISOString().split("T")[0]
          : "",
        3
      ),
      returnTime: mapField(order.return_time ?? "", 3),
      passengers: mapField(order.passengers.toString(), 1, true),
      bags: mapField(order.bags.toString(), 1, true),
      flightName: mapField(order.flight_name ?? "", 3),
      flightNumber: mapField(order.flight_number ?? "", 3),
      paymentId: mapField(order.payment_id ?? order.id ?? "", 4, true),
      isAirportPickup: mapField(order.is_airport_pickup ?? false, 3),
      isFlightTrack: mapField(order.flight_track ?? false, 3),
      isMeetGreet: mapField(order.meet_greet ?? false, 3),
      isReturn: mapField(order.is_return ?? false, 3),

      // Extras
      childSeat: mapField(order.child_seat ? parseInt(order.child_seat) : 0, 3),
      infantSeat: mapField(
        order.infant_seat ? parseInt(order.infant_seat) : 0,
        3
      ),
      boosterSeat: mapField(
        order.booster_seat ? parseInt(order.booster_seat) : 0,
        3
      ),
      description: mapField(order.extras_description ?? "", 3),
      extraStops: mapField(order.extra_stops ? parseInt(order.extra_stops) : 0, 3),
    },
    category: order.category === "hourly" ? "hourly" : "trip",
    orderId: order.id,
    formError: "",
    formLoading: false,
    isOrderDone: true,
    paymentURL: "",
    step:step ? step : 4
  });
},

  resetForm: () => set({
    formData: {
      ...tripInitialFormData,
      childSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
      infantSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
      boosterSeat: { value: 0, error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
      description: { value: "", error: "", coardinates: "", coardinatesRequired: false, required: false, step: 3 },
    },
    step: 1,
    category: "trip",
    formError: "",
    formLoading: false,
    isMobileDropdownOpen: false,
    isOrderDone: false,
    orderId: ''
  }),




}));

export default useFormStore;


