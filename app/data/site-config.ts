// =====================================================================
// EVERYTHING YOU'LL WANT TO EDIT LIVES IN THIS FILE.
// Change a value here and it updates everywhere on the site.
// Anything marked TODO still needs your real details.
// =====================================================================

export const siteConfig = {
  // --- The headline ------------------------------------------------
  coupleNames: "John & Tiffany",
  babyName: "Baby Nam", // shown in the hero; use "Baby Boy Nam", a real name, whatever you like
  hero: {
    eyebrow: "Please join us for a baby shower celebrating",
    subhead:
      "We'd love to have you there! Come say hi, eat, and help us get ready for our little one.",
  },

  // --- The party ---------------------------------------------------
  event: {
    dateLong: "Sunday, September 20, 2026",
    dateShort: "9/20/26",
    timeStart: "1:00 PM",
    timeEnd: "4:00 PM",
    // Short lines listed as "good to know" bullets under the date.
    notes: ["Food & drinks provided", "Please no alcohol or smoking/vaping! We will get in trouble", "Free on-site parking"],
    address: {
      line1: "18900 Copper Breaks Xing",
      line2: "Cypress, TX 77433",
    },
  },

  // --- Gifts -------------------------------------------------------
  gifts: {
    // TODO: your exact Venmo username, including the @
    venmoHandle: "@Jellychews",
    // TODO: the phone number or email your bank has linked to Zelle
    zelleHandle: "Johnnam93@gmail.com",
    amazonRegistryUrl: "https://www.amazon.com/baby-reg/your-registry/1E6TBC4VNOCMY?ref_=br_dsk_tbnr_yr",
  },

  // --- Questions? (bottom of the page) -----------------------------
  contact: {
    // TODO: the number guests should text. Digits only in `phoneRaw`.
    phoneDisplay: "(832) 455-7478",
    phoneRaw: "+8324557478",
    // TODO: the email guests should write to.
    email: "Johnnam93@gmail.com",
  },

  // --- RSVP --------------------------------------------------------
  rsvp: {
    // Shown on the RSVP page so guests know when to decide by.
    deadline: "September 6, 2026",
  },

  // --- Benny (the /benny gallery) -----------------------------------
  dog: {
    name: "Benny",
    breed: "Border collie (probably)",
    specialty: "Tennis balls",
  },

  // --- Footer ------------------------------------------------------
  footer: {
    builtBy: "John Nam",
    year: "2026",
  },
};

/**
 * The address as one line — used for the map embed, the "open in maps"
 * link, and anywhere the full address is printed.
 */
export const fullAddress = `${siteConfig.event.address.line1}, ${siteConfig.event.address.line2}`;

/**
 * Google Maps without an API key.
 *
 * `output=embed` is the classic no-key iframe endpoint (the newer
 * /maps/embed/v1/ API would require a billing-enabled key), and
 * `search/?api=1` is the documented way to hand an address off to
 * whatever maps app the guest has installed.
 */
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  fullAddress
)}&output=embed`;

export const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  fullAddress
)}`;
