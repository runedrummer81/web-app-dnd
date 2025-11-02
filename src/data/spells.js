export const SPELL_BASE = import.meta.env.BASE_URL;

export const spellsData = [
  {
    id: "flaming-sphere",
    name: "Flaming Sphere",
    iconURL: SPELL_BASE + "spell-icons/flaming_sphere.webp", // You'll add this icon
    effectURL: SPELL_BASE + "spell-effects/flaming_sphere.webm",
    color: "#F1f1f1",
  },
  {
    id: "darkness",
    name: "Darkness",
    iconURL: SPELL_BASE + "spell-icons/darkness.webp", // You'll add this icon
    effectURL: SPELL_BASE + "spell-effects/darkness.webm",
    color: "#FF4500",
  },
  {
    id: "web",
    name: "Web",
    iconURL: SPELL_BASE + "spell-icons/web.webp", // You'll add this icon
    effectURL: SPELL_BASE + "spell-effects/web.webm",
    color: "#FF4500",
  },
  // Add more spells here later
];
