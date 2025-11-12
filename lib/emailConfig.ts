export const emailConfig = {
  host: process.env.EMAIL_HOST ,
   port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

// export const emailConfig = {
//       host: "smtp.hostinger.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: "info@chauffeurio.com",
//         pass:"Valenciaspain2025@@"
//       },
//     };
