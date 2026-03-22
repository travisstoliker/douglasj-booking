export const BUSINESS_NAME = "Douglas J";
export const BUSINESS_LOCATION = "Okemos Salon + MedSpa";
export const BUSINESS_ADDRESS = "4663 Ardmore Ave, Okemos, Michigan 48864";
export const BUSINESS_PHONE = "(517) 349-0430";
export const BUSINESS_EMAIL = "OKS.GuestServices@douglasj.com";
export const BUSINESS_WEBSITE = "https://douglasj.com/";
export const CANCELLATION_FEE = 50;
export const CANCELLATION_WINDOW_HOURS = 24;
export const MAX_GROUP_SIZE = 6;

export const MERCHANT_ID = "16b7e9a9-676f-417f-8c7c-c1bd93fa47bd";

export const LOGO_URL =
  "https://douglasj.zenoti.com/temp_data/tempassetstore/1bc26bad-f51c-420c-9856-cdcb7011562c/customassetupload/8e12ba2d-47b3-4832-98a9-b9dd78e118d9.gif";

export const BACKGROUND_IMAGE_URL =
  "https://douglasj.zenoti.com/temp_data/tempassetstore/1bc26bad-f51c-420c-9856-cdcb7011562c/customassetupload/6bd00e69-999c-49ef-8630-466686ef4d48.jpg";

export const SERVICE_HOURS = [
  { day: "Sunday", hours: "11:00 am - 5:00 pm" },
  { day: "Monday", hours: "9:00 am - 8:00 pm" },
  { day: "Tuesday", hours: "8:00 am - 8:00 pm" },
  { day: "Wednesday", hours: "8:00 am - 9:00 pm" },
  { day: "Thursday", hours: "8:00 am - 9:00 pm" },
  { day: "Friday", hours: "8:00 am - 8:00 pm" },
  { day: "Saturday", hours: "8:00 am - 5:00 pm" },
];

export const PROVIDER_NAMES: Record<string, string> = {
  s1: "Sarah Mitchell",
  s2: "Jessica Taylor",
  s3: "Marcus Johnson",
  s4: "Emily Chen",
  s5: "Dr. Lauren Davis",
  s6: "Amanda Rivera",
  s7: "Nicole Park",
};

export const SERVICE_NAMES: Record<string, string> = {
  h1: "Haircut - Female", h2: "Haircut - Male", h3: "Haircut - Child Female",
  h4: "Haircut - Child Male", h5: "Haircut Blowout Finish", h6: "Haircut Thermal Blowout",
  h7: "Beard Trim", hc1: "Color Consultation", hc2: "Color Retouch",
  hc3: "All-Over Color or A Few Highlights", hc4: "Color + Partial Highlight",
  hc5: "Full Highlight", hc6: "Custom Color", hc7: "Color Transformation",
  hs1: "Blowout Finish - Female", hs2: "Blowout Thermal Style",
  hs3: "Special Occasion Style - Junior Level", hs4: "Special Occasion Style - Senior Level",
  hco1: "Haircut Consultation", hco2: "Keratin Consultation",
  hco3: "Hair Extension Consultation", hco4: "Bridal Style Consultation",
  b1: "Barber Haircut", b2: "Barber Fade", b3: "Beard Trim", b4: "Hot Towel Shave",
  b5: "Express Hot Towel Facial", b6: "Hot Towel Shave + Facial",
  b7: "Edge Up or Line Up", b8: "Neck Shave",
  n1: "Aveda Manicure", n2: "Aveda Pedicure", n3: "Hot Stone Pedicure",
  n4: "Express Pedicure", n5: "Aveda Manicure + Gel Polish",
  n6: "Aveda Pedicure + Gel Polish", n7: "Gel Polish Change for Hands",
  n8: "Hard Gel Nails with Tips", n9: "Hard Gel Fill",
  sk1: "Standard Facial - 60 min", sk2: "Standard Facial - 90 min",
  sk3: "Dermaplane", sk4: "Perfecting Plant Peel",
  sk5: "Signature HydraFacial", sk6: "Deluxe HydraFacial", sk7: "Platinum HydraFacial",
  sk8: "Chemical Peel with Homecare Kit", sk9: "Skin Care Consultation",
  bw1: "Aroma Massage - 60 min", bw2: "Aroma Massage - 90 min",
  bw3: "Hot Stone Massage", bw4: "CBD Body Glow",
  bw5: "Reboot IV", bw6: "Myer's Cocktail IV", bw7: "Immunity IV", bw8: "Inner Beauty IV",
  i1: "Neurotoxin Consultation", i2: "Filler Consultation", i3: "Filler Dissolver",
  m1: "Makeup Application - Advanced Artist", m2: "Makeup Application - Senior Artist",
  m3: "Lash Lift", m4: "Lash Tinting", m5: "Lash Lift + Tint",
  m6: "Brow Lamination", m7: "Brow Lamination + Tint", m8: "Microblading",
  w1: "Brow Wax", w2: "Lip Wax", w3: "Chin Wax", w4: "Full Face Wax",
  w5: "Under Arm Wax", w6: "Bikini Wax", w7: "Brazilian Wax", w8: "Full Leg Wax",
  l1: "Upper Lip", l2: "Chin", l3: "Under Arm", l4: "Bikini Line",
  l5: "Brazilian", l6: "Full Face", l7: "Full Leg",
};

export const SERVICE_PRICES: Record<string, number> = {
  h1: 40, h2: 40, h3: 25, h4: 25, h5: 48, h6: 58, h7: 16,
  hc2: 69, hc3: 100, hc4: 131, hc5: 163, hc6: 194, hc7: 262,
  hs1: 25, hs2: 45, hs3: 81, hs4: 93,
  b1: 32, b2: 38, b3: 15, b4: 28, b5: 28, b6: 46, b7: 12, b8: 12,
  n1: 40, n2: 65, n3: 101, n4: 54, n5: 63, n6: 85, n7: 48, n8: 105, n9: 75,
  sk1: 88, sk2: 105, sk3: 88, sk4: 83, sk5: 199, sk6: 250, sk7: 325, sk8: 150,
  bw1: 98, bw2: 130, bw3: 186, bw4: 115, bw5: 200, bw6: 100, bw7: 150, bw8: 200,
  i3: 175,
  m1: 80, m2: 100, m3: 80, m4: 23, m5: 100, m6: 60, m7: 80, m8: 375,
  w1: 20, w2: 20, w3: 20, w4: 50, w5: 40, w6: 40, w7: 82, w8: 74,
  l1: 90, l2: 100, l3: 130, l4: 150, l5: 225, l6: 200, l7: 450,
};
