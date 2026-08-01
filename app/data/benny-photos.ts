export type BennyPhoto = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

/**
 * The gallery, in display order — the first few are the ones people
 * actually came to see.
 *
 * To add a photo: drop the file in `public/benny/` and add an entry
 * here. `width`/`height` are the file's real pixel dimensions; they
 * let the browser reserve the right space so the page doesn't jump
 * around while the images load.
 */
export const bennyPhotos: BennyPhoto[] = [
  {
    src: "/benny/big-brother.jpg",
    alt: "Benny wearing a navy bandana that reads 'big brother'",
    caption: "Promoted to big brother",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/hello.jpg",
    alt: "Benny grinning up at the camera in a green bow tie",
    caption: "Checking in while human is on toilet",
    width: 1536,
    height: 1700,
  },
  {
    src: "/benny/first-snow.jpg",
    alt: "Close-up of Benny with snowflakes across his face and whiskers",
    caption: "First snow",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/sit-pretty.jpg",
    alt: "Benny sitting on a grey mat looking hopefully up at the camera",
    caption: "Bread loaf mode",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/under-the-stairs.jpg",
    alt: "Benny lying in his bed under the stairs, surrounded by toys and fairy lights",
    caption: "His new room under the stairs",
    width: 2048,
    height: 1536,
  },
  {
    src: "/benny/belly-up.jpg",
    alt: "Benny asleep belly-up on the couch with his tongue out",
    caption: "Peak relaxation",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/shotgun-rider.jpg",
    alt: "Benny sitting in the front seat of a car wearing a Christmas tie",
    caption: "Fancy Christmas tie",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/blanket-burrito.jpg",
    alt: "Benny wrapped up in a striped fleece blanket, only his head showing",
    caption: "Blanket burrito",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/toy-pile-nap.jpg",
    alt: "Benny asleep in his bed surrounded by a pile of stuffed animals",
    caption: "Guarding the collection",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/window-watch.jpg",
    alt: "Benny standing on the back of the couch looking out the window at the trees",
    caption: "Neighborhood watch",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/game-day.jpg",
    alt: "Benny in a burnt orange jersey with his tongue out by the fireplace",
    caption: "Game day",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/pet-store-haul.jpg",
    alt: "Benny being carried through a pet store holding a treat in his mouth",
    caption: "Checkout line at the pet store",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/upside-down.jpg",
    alt: "Benny lying upside down on a white blanket in a red sweater",
    caption: "Upside down, as usual",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/road-trip.jpg",
    alt: "Benny in the car resting on a plush toy with a treat",
    caption: "Snacks for the road",
    width: 1530,
    height: 2048,
  },
  {
    src: "/benny/mom-selfie.jpg",
    alt: "Close-up selfie of Benny being hugged, mid-grin",
    caption: "The obligatory selfie",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/nap-champion.jpg",
    alt: "Benny asleep in a navy sweater tucked into a fleece blanket",
    caption: "Nap champion",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/bandana.jpg",
    alt: "Benny sitting on tile wearing a patterned bandana",
    caption: "Fresh from the groomer",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/windowsill-snooze.jpg",
    alt: "Benny asleep with his chin on the windowsill and his tongue poking out",
    caption: "Tongue out, lights off",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/huh.jpg",
    alt: "Benny looking kinda derpy",
    caption: "Huh?",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/gender-reveal.jpg",
    alt: "Benny excited about gender reveal",
    caption: "So excited to have a brother!",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/pregnant.jpg",
    alt: "Benny during the pregnancy reveal",
    caption: "We are pregnant?!",
    width: 1536,
    height: 2048,
  },
  {
    src: "/benny/home.jpg",
    alt: "Why are you in my house?",
    caption: "Why are you in my house?",
    width: 1536,
    height: 2048,
  },
];
