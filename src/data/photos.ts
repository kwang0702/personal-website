import { R2_BASE } from "@/lib/r2";

export type Photo = {
  src: string;
  thumb: string;
  alt: string;
  orientation: "horizontal" | "vertical";
  collection?: string;
};

/**
 * Add or remove photos here.
 *
 * To add a photo:
 *   1. Upload image to R2: npx wrangler r2 object put "personal-website-media/<section>/<collection>/<file>" --file="<local-path>"
 *   2. Add an entry below with src: `${R2_BASE}/<section>/<collection>/<file>`
 *   3. Set orientation to "horizontal" or "vertical"
 *   4. Set collection (e.g. "japan") for filter grouping
 *
 * To remove a photo:
 *   1. Delete the entry from this array
 *   2. Optionally: npx wrangler r2 object delete "personal-website-media/<path>"
 */
export const photos: Photo[] = [
  // ── Japan ────────────────────────────────────────────────────────
  {
    src: `${R2_BASE}/photography/japan/japan-01.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-01.jpg`,
    alt: "Osaka Castle framed by summer trees",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-02.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-02.jpg`,
    alt: "Bamboo grove and tea house in Kyoto",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-03.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-03.jpg`,
    alt: "Boutique window display at night",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-04.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-04.jpg`,
    alt: "Wooden engawa corridor overlooking a garden",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-05.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-05.jpg`,
    alt: "Tatami room looking out to a lush garden with red felt bench",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-06.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-06.jpg`,
    alt: "Bamboo ladle resting on a tsukubai water basin",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-07.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-07.jpg`,
    alt: "Moss-covered stone path through a green forest",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-08.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-08.jpg`,
    alt: "Counter seat with sake and a bamboo garden view",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-09.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-09.jpg`,
    alt: "Kinkaku-ji reflected in the mirror pond",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-10.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-10.jpg`,
    alt: "Traditional tatami banquet hall with zabuton seating",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-11.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-11.jpg`,
    alt: "Washi paper lamp glowing in the dark",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-12.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-12.jpg`,
    alt: "Wooden lantern against shoji sliding doors",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-13.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-13.jpg`,
    alt: "Cube shoji lantern on a wooden shelf",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-14.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-14.jpg`,
    alt: "Pavilion by a pond with weeping willows",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-15.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-15.jpg`,
    alt: "Power lines and rooftops in a quiet Japanese neighborhood",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-16.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-16.jpg`,
    alt: "Two cups of pour-over coffee on a wooden tray",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-17.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-17.jpg`,
    alt: "Noren curtain at a Kyoto restaurant entrance",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-18.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-18.jpg`,
    alt: "Veranda with bamboo sudare blind overlooking a zen garden",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-19.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-19.jpg`,
    alt: "Gold geometric pattern on a fusuma sliding door",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-20.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-20.jpg`,
    alt: "Lantern-lit shoji corridor at dusk",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-21.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-21.jpg`,
    alt: "Kiyomizu-dera stage overlooking Kyoto skyline",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-22.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-22.jpg`,
    alt: "Yakitori skewers at a counter-style izakaya",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-23.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-23.jpg`,
    alt: "Kiyomizu-dera pagoda and main hall through the trees",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-24.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-24.jpg`,
    alt: "Nara deer resting by a stone lantern",
    orientation: "vertical",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-25.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-25.jpg`,
    alt: "Nara deer grazing up close",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-26.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-26.jpg`,
    alt: "Deer herd on the lawn at Nara Park",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-27.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-27.jpg`,
    alt: "Fushimi Inari torii gate illuminated at night",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-28.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-28.jpg`,
    alt: "Fushimi Inari Taisha sign glowing on a dark street",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-29.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-29.jpg`,
    alt: "Traditional ryokan gate with a figure in kimono",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-30.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-30.jpg`,
    alt: "Onigawara demon roof tiles on moss",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-31.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-31.jpg`,
    alt: "Glico Running Man sign at Dotonbori, Osaka",
    orientation: "horizontal",
    collection: "japan",
  },
  {
    src: `${R2_BASE}/photography/japan/japan-32.jpg`,
    thumb: `${R2_BASE}/photography/japan/thumbs/japan-32.jpg`,
    alt: "Osaka Castle and moat boat from across the water",
    orientation: "horizontal",
    collection: "japan",
  },
];
