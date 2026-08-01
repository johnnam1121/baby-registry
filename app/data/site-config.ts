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
    eyebrow: "Please join us for a baby shower honoring",
    subhead:
      "We'd love to have you there. Come eat, say hi, and help us get ready for the little one.",
  },

  // --- The party ---------------------------------------------------
  event: {
    dateLong: "Sunday, September 20, 2026",
    dateShort: "9/20/26",
    timeStart: "1:00 PM",
    timeEnd: "4:00 PM",
    // Short lines listed as "good to know" bullets under the date.
    notes: ["Food & drinks provided", "Free on-site parking"],
    address: {
      line1: "18900 Copper Breaks Xing",
      line2: "Cypress, TX 77433",
    },
  },

  // --- Gifts -------------------------------------------------------
  gifts: {
    // TODO: your exact Venmo username, including the @
    venmoHandle: "@Your-Venmo",
    // TODO: the phone number or email your bank has linked to Zelle
    zelleHandle: "you@example.com",
    amazonRegistryUrl: "https://www.amazon.com/baby-reg/1E6TBC4VNOCMY",
  },

  // --- Questions? (bottom of the page) -----------------------------
  contact: {
    // TODO: the number guests should text. Digits only in `phoneRaw`.
    phoneDisplay: "(555) 123-4567",
    phoneRaw: "+15551234567",
    // TODO: the email guests should write to.
    email: "you@example.com",
  },

  // --- RSVP --------------------------------------------------------
  rsvp: {
    // Shown on the RSVP page so guests know when to decide by.
    deadline: "September 6, 2026",
  },

  // --- Benny (the /benny gallery + the little guy trotting along
  //     the bottom of every page) ------------------------------------
  dog: {
    name: "Benny",
    breed: "Border collie",
    specialty: "Tennis balls",
    bio:
      "Benny has been the baby of the house for a while now, and he's taking " +
      "the demotion in stride. He supervises every nap, inspects every " +
      "delivery, and has already claimed the nursery rug as his own.",
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
