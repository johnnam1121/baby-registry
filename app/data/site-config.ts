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

  // --- The gift fund -----------------------------------------------
  // The cards in the carousel — add or remove as many as you like, the
  // carousel follows the array. Guests send money by Venmo or Zelle using
  // the handles above, then log what they sent against one of these;
  // nothing here takes a payment, it only keeps a running total.
  //
  // `id` is what ties a logged contribution to its card, so don't rename
  // an id once people have started contributing — those rows would stop
  // counting toward the card. (They'd still count toward the total.)
  giftFund: {
    // The heading and paragraph above the combined progress bar.
    overallLabel: "Want to conribute towards something specific?",
    overallBlurb:
      "Please feel free to contribute to one of these bigger items below and tell us what you sent!",
    items: [
      {
        id: "Uppababy Vista v3 Callum Baby Stroller",
        name: "Baby Stroller & Infant Car Seat",
        blurb: "Uppababy Vista v3 Callum Baby Stroller and Aria v2 Infant Car Seat",
        goal: 1250,
        image: "/gifts/stroller.png",
      },
      // Both goals: $439.99 list at Albee Baby, less 20%, plus 8.25% Texas
      // sales tax (6.25% state + 2% local — Cypress is at the cap).
      // 439.99 × 0.80 = 351.99; × 1.0825 = 381.03. Shipping is free over $99.
      {
        id: "carSeatMom",
        name: "Mom Car Seat",
        blurb: "Chicco Fit360 ClearTex Rotating Convertible Car Seat — Titanium",
        goal: 380,
        image: "/gifts/chiccoTitanium.png",
      },
      {
        id: "carSeatDad",
        name: "Dad Car Seat",
        blurb: "Chicco Fit360 ClearTex Rotating Convertible Car Seat — Carbon",
        goal: 380,
        image: "/gifts/chiccoCarbon.png",
      },
      // {
      //   id: "monitor",
      //   name: "Baby monitor",
      //   blurb: "So we can watch him sleep instead of sleeping.",
      //   goal: 200,
      //   image: "/gifts/monitor.jpg",
      // },
    ],
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
