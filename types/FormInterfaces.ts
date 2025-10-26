import z from "zod";

const timeSchema = z.object({
  hour: z.number()
    .min(1, "Hour must be between 1 and 12")
    .max(23, "Hour must be between 1 and 23"),

  minute: z.number()
    .min(0, "Minutes must be between 0 and 59")
    .max(59, "Minutes must be between 0 and 59"),
});

export const hourlyFormValidation = z.object({
  pickup_date: z.date().optional().nullable(),
  pickup_time: timeSchema.optional().nullable(),

  return_date: z.date().optional(),
  return_time: timeSchema.optional(),
  is_return: z.boolean().default(false),

  pickup_location_lag_alt: z.string().min(1, "Please Choose Pickup Location"),
  pickup_location: z.string().min(1, "Please Choose Pickup Location"),
  dropoff_location_lag_alt: z.string().optional(),
  dropoff_location: z.string().optional(),

  stops: z.number().min(0, "Please Enter Stops").max(3).default(0),
  stop_1: z.string().optional(),
  stop_1_lag_alt: z.string().optional(),
  stop_2: z.string().optional(),
  stop_2_lag_alt: z.string().optional(),
  stop_3: z.string().optional(),
  stop_3_lag_alt: z.string().optional(),

  passengers: z.number().min(1, "Please Enter Passengers").max(6),
  kids: z.number().min(0, "Please Enter Kids").max(6),
  bags: z.number().min(0, "Please Enter Bags").max(6),
  car: z.string().min(1, "Please select fleet"),
  price: z.number().min(0, "Please select fleet"),
  name: z.string().min(1, "Please Enter Your Name"),
  email: z.string().min(1, "Please Enter Email").email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  flight: z.string().optional(),
  payment_id: z.string().optional(),
  duration: z.number().min(1, "Please Enter duration"),
  payment_method: z.string().min(1, "Please Select Payment Method"),
  distance: z.string().optional(),
  instructions: z.string().optional(),
  flight_track: z.boolean().default(false),
  meet_greet: z.boolean().default(false),
  airport_pickup: z.boolean().default(false),
  flight_number: z.string().optional(),
}).superRefine((data, ctx) => {
  // return checks
  if (data.is_return) {
    if (!data.return_date) {
      ctx.addIssue({ path: ['return_date'], code: z.ZodIssueCode.custom, message: "Return date is required when return is selected" });
    }
    if (!data.return_time) {
      ctx.addIssue({ path: ['return_time'], code: z.ZodIssueCode.custom, message: "Return time is required when return is selected" });
    }
  }

  // stops checks
  if (data.stops >= 1) {
    if (!data.stop_1) ctx.addIssue({ path: ['stop_1'], code: z.ZodIssueCode.custom, message: "Stop 1 is required" });
    if (!data.stop_1_lag_alt) ctx.addIssue({ path: ['stop_1_lag_alt'], code: z.ZodIssueCode.custom, message: "Stop 1 lag/lat is required" });
  }
  if (data.stops >= 2) {
    if (!data.stop_2) ctx.addIssue({ path: ['stop_2'], code: z.ZodIssueCode.custom, message: "Stop 2 is required" });
    if (!data.stop_2_lag_alt) ctx.addIssue({ path: ['stop_2_lag_alt'], code: z.ZodIssueCode.custom, message: "Stop 2 lag/lat is required" });
  }
  if (data.stops === 3) {
    if (!data.stop_3) ctx.addIssue({ path: ['stop_3'], code: z.ZodIssueCode.custom, message: "Stop 3 is required" });
    if (!data.stop_3_lag_alt) ctx.addIssue({ path: ['stop_3_lag_alt'], code: z.ZodIssueCode.custom, message: "Stop 3 lag/lat is required" });
  }
});

export const simpleFormValidation = z.object({
  pickup_date: z.date().optional().nullable(),
  pickup_time: timeSchema.optional().nullable(),

  return_date: z.date().optional(),
  return_time: timeSchema.optional(),
  is_return: z.boolean().default(false),

  pickup_location_lag_alt: z.string().min(1, "Please Choose Pickup Location"),
  pickup_location: z.string().min(1, "Please Choose Pickup Location"),
  dropoff_location_lag_alt: z.string().min(1, "Please Choose Dropoff Location"),
  dropoff_location: z.string().min(1, "Please Choose Dropoff Location"),

  stops: z.number().min(0, "Please Enter Stops").max(3).default(0),
  stop_1: z.string().optional(),
  stop_1_lag_alt: z.string().optional(),
  stop_2: z.string().optional(),
  stop_2_lag_alt: z.string().optional(),
  stop_3: z.string().optional(),
  stop_3_lag_alt: z.string().optional(),

  passengers: z.number().min(1, "Please Enter Passengers").max(6),
  kids: z.number().min(0, "Please Enter Kids").max(6),
  bags: z.number().min(0, "Please Enter Bags").max(6),

  car: z.string().min(1, "Please select fleet"),
  price: z.number().min(0, "Please select fleet"),
  name: z.string().min(1, "Please Enter Your Name"),
  email: z.string().min(1, "Please Enter Email").email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  flight: z.string().optional(),
  name_board: z.string().optional(),
  payment_method: z.string().min(1, "Please Select Payment Method"),
  payment_id: z.string().optional(),
  distance: z.string().min(1, "Distance not calculated"),
  instructions: z.string().optional(),
  duration: z.number(),
  flight_track: z.boolean().default(false),
  meet_greet: z.boolean().default(false),
  airport_pickup: z.boolean().default(false),
  flight_number: z.string().optional(),
}).superRefine((data, ctx) => {
  // return checks
  if (data.is_return) {
    if (!data.return_date) {
      ctx.addIssue({ path: ['return_date'], code: z.ZodIssueCode.custom, message: "Return date is required when return is selected" });
    }
    if (!data.return_time) {
      ctx.addIssue({ path: ['return_time'], code: z.ZodIssueCode.custom, message: "Return time is required when return is selected" });
    }
  }

  // stops checks
  if (data.stops >= 1) {
    if (!data.stop_1) ctx.addIssue({ path: ['stop_1'], code: z.ZodIssueCode.custom, message: "Stop 1 is required" });
    if (!data.stop_1_lag_alt) ctx.addIssue({ path: ['stop_1_lag_alt'], code: z.ZodIssueCode.custom, message: "Stop 1 lag/lat is required" });
  }
  if (data.stops >= 2) {
    if (!data.stop_2) ctx.addIssue({ path: ['stop_2'], code: z.ZodIssueCode.custom, message: "Stop 2 is required" });
    if (!data.stop_2_lag_alt) ctx.addIssue({ path: ['stop_2_lag_alt'], code: z.ZodIssueCode.custom, message: "Stop 2 lag/lat is required" });
  }
  if (data.stops === 3) {
    if (!data.stop_3) ctx.addIssue({ path: ['stop_3'], code: z.ZodIssueCode.custom, message: "Stop 3 is required" });
    if (!data.stop_3_lag_alt) ctx.addIssue({ path: ['stop_3_lag_alt'], code: z.ZodIssueCode.custom, message: "Stop 3 lag/lat is required" });
  }
});