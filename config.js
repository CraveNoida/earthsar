/* =====================================================================
   EARTHSAR WEBSITE CONTENT
   Edit this file to update the website. No other code changes needed.
   Only add genuine, verifiable information.
   ===================================================================== */
window.EARTHSAR_CONFIG = {

  /* ---------- Statistics ----------
     Leave a value empty ("") to show "XX" as a placeholder. */
  stats: {
    years: "10",          // 10+ Years in the industry
    satisfaction: "100",  // 100% Customer satisfaction
    properties: "5"       // 5K Properties sold
  },

  /* ---------- Contact details ---------- */
  contact: {
    phone: "+91 890 176 0000",
    email: "earthzgroup@gmail.com",
    address: "SF001A, Emaar Emerald Plaza, Retail Block, Sector 65, Gurugram, Haryana",
    hours: "Mon–Sun, 10:00 am – 7:00 pm IST"
  },

  /* ---------- Forms ----------
     The website is static, so form submissions are sent to a form service.
     1. Create a free form at https://formspree.io (or a similar service).
     2. Paste its endpoint URL below, e.g. "https://formspree.io/f/abcdwxyz".
     Enquiries and review submissions will then arrive in your inbox.
     You can use the same endpoint for both. */
  forms: {
    enquiryEndpoint: "",
    reviewEndpoint: ""
  },

  /* ---------- Hero image ----------
     Leave empty to use the built-in architectural illustration,
     or set a path such as "images/hero.jpg" (portrait photo works best). */
  heroImage: "assets/hero-property.jpg",
  heroImageAlt: "Luxury modern real estate property with infinity pool at sunset",

  /* ---------- Associations (partner logos) ----------
     Order here = order on the website. Put logo files in /images.
     { name: "Company Name", website: "https://...", logo: "images/partner.png" } */
  partners: [
    { name: "Partner 1", logo: "icons/011.png" },
    { name: "Partner 2", logo: "icons/011111.png" },
    { name: "Partner 3", logo: "icons/4444444444.png" },
    { name: "Partner 4", logo: "icons/777777777.png" },
    { name: "Partner 5", logo: "icons/Untitled-design-1.png" },
    { name: "Partner 6", logo: "icons/Untitled-design-10-1.png" },
    { name: "Partner 7", logo: "icons/Untitled-design-10.png" },
    { name: "Partner 8", logo: "icons/Untitled-design-11.png" },
    { name: "Partner 9", logo: "icons/Untitled-design-2.png" },
    { name: "Partner 10", logo: "icons/Untitled-design-3.png" },
    { name: "Partner 11", logo: "icons/Untitled-design-4.png" },
    { name: "Partner 12", logo: "icons/Untitled-design-5.png" },
    { name: "Partner 13", logo: "icons/Untitled-design-6.png" },
    { name: "Partner 14", logo: "icons/Untitled-design-7.png" },
    { name: "Partner 15", logo: "icons/Untitled-design-8.png" },
    { name: "Partner 16", logo: "icons/Untitled-design-9.png" }
  ],

  /* ---------- Credentials / achievements ----------
     type: "Registration" | "Certification" | "Membership" | "Award" | "Recognition"
     { type: "Registration", title: "UP RERA Registration", issuer: "UP RERA",
       year: "2024", reference: "Registration number", description: "..." } */
  credentials: [
  ],

  /* ---------- Team ----------
     { name: "Full Name", role: "Designation", experience: "12 years in real-estate advisory",
       bio: "Short introduction.", linkedin: "https://linkedin.com/in/...", photo: "images/name.jpg" } */
  team: [
    {
      name: "Mr. Naveen Sharma",
      role: "Founder & Director",
      experience: "10+ years in real estate advisory",
      bio: "Naveen has over one decade of rich experience in real estate industry covering sales, land acquisition, leasing (commercial & residential properties). He leads the sales ecosystem, client development and channel management functions at EarthZ. He brings deep market knowledge and an extended ecosystem to help uncover the right priced deals. A perfect team player, Naveen leads from front and is always there to support his team. He has done his post-graduation in business management and has worked with leading realty firms of NCR. An avid marathoner, he has a “never give up” attitude when it comes to client service.",
      photo: "assets/naveen-sharma.jpg"
    },
    {
      name: "Mr. Bhaskar Rawat",
      role: "Associate Director Sales",
      experience: "Sales & Client Advisory",
      bio: "Dedicated professional working collaboratively to achieve your real estate objectives through market analysis and deal execution.",
      photo: "assets/bhaskar-rawat.jpg"
    },
    {
      name: "Mrs. Neha Sharma",
      role: "Associate Director Digital Marketing",
      experience: "Digital Strategy & Outreach",
      bio: "Leading digital marketing, modern client discovery, and strategic outreach initiatives.",
      photo: "assets/neha-sharma.jpg"
    },
    {
      name: "Mr. Dushyant Arora",
      role: "Manager Sales",
      experience: "Sales & Property Consulting",
      bio: "Assisting buyers and investors with tailored property options, site visits, and transparent advisory.",
      photo: "assets/dushyant-arora.jpg"
    }
  ],

  /* ---------- Published client reviews ----------
     Add reviews here after confirming them. Newest first is not required; they are sorted by date.
     { name: "Client Name", rating: 5, date: "2026-09-01", verified: true,
       message: "Review text", photo: "images/reviews/client.jpg",
       photos: ["images/reviews/p1.jpg"], videoUrl: "https://youtu.be/..." } */
  reviews: [
  ],

  /* ---------- Legal pages ----------
     Set to page URLs once your legal text is ready, e.g. "privacy.html". */
  legal: {
    privacy: "",
    terms: "",
    disclaimer: ""
  }
};
