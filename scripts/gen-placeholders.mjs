import { writeFileSync } from "fs";

const items = [
  { name: "placeholder-01", w: 1200, h: 800, color: "#D4C9BE" },
  { name: "placeholder-02", w: 800, h: 1200, color: "#C5BCAD" },
  { name: "placeholder-03", w: 1200, h: 800, color: "#B8AFA3" },
  { name: "placeholder-04", w: 800, h: 1200, color: "#CEC5B8" },
  { name: "placeholder-05", w: 1200, h: 800, color: "#C0B7A9" },
  { name: "placeholder-06", w: 800, h: 1200, color: "#D1C8BC" },
  { name: "placeholder-07", w: 1200, h: 800, color: "#BAB1A4" },
  { name: "placeholder-08", w: 800, h: 1200, color: "#C8BFAF" },
];

for (const { name, w, h, color } of items) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${color}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="24" fill="#8A827980">${w} × ${h}</text>
</svg>`;
  writeFileSync(`public/photos/${name}.svg`, svg);
  console.log(`Created ${name}.svg (${w}×${h})`);
}
