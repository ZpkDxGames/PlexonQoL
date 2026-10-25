import data from "@/data/armor-trims.json";
import { SLOTS, type ArmorSet, type ArmorSlot } from "./model";

const armorPaths: Record<ArmorSlot, string> = {
  helmet: "M54 10H106V57H93V43H67V57H54Z",
  chestplate:
    "M49 66L20 78V135H45V111L54 107V145H106V107L115 111V135H140V78L111 66L99 80H61Z",
  leggings: "M54 152H106V223H85V175H75V223H54Z",
  boots: "M53 230H76V255H46V245H53Z M84 230H107V245H114V255H84Z",
};
// Deliberately schematic motifs. Vanilla texture UV maps are a separate content milestone.
const motifs = [
  "M35 20H125M40 42H120M35 88H125M35 128H125M40 170H120M40 243H120",
  "M30 38L80 18L130 38M30 100L80 80L130 100M40 190L80 170L120 190M40 245H120",
  "M25 25Q80 55 135 25M25 85Q80 115 135 85M25 150Q80 180 135 150M25 235Q80 265 135 235",
  "M45 12V255M65 12V255M95 12V255M115 12V255",
  "M30 28L80 48L130 28M35 78L80 108L125 78M50 170L68 210M92 170L108 210M40 246H120",
  "M40 30H60L80 14L100 30H120M40 100H62L80 84L98 100H120M45 175H115M45 245H115",
  "M35 15L125 55M125 15L35 55M25 75L130 135M130 75L25 135M50 160L110 220M110 160L50 220M45 246H115",
  "M25 28Q50 8 80 28T135 28M25 100Q50 80 80 100T135 100M35 175Q60 155 85 175T130 175M35 245Q60 225 85 245T130 245",
  "M40 22H120V43H40ZM40 86H120V123H40ZM55 170H105M50 243H110",
  "M30 20H130M30 36H130M30 52H130M25 82H135M25 100H135M25 118H135M40 166H120M40 188H120M40 210H120M45 242H115",
  "M40 50L80 10L120 50M30 125L80 72L130 125M50 220L68 158L80 180L94 158L110 220M45 246H115",
  "M45 20L80 45L115 20M45 80L80 110L115 80M53 165L70 192L53 215M107 165L90 192L107 215M45 245H115",
  "M55 12V55H105V12M45 70V134H115V70M58 158H102V215M46 245H114",
  "M33 24H127M38 41H122M35 85L80 110L125 85M40 125H120M62 156V219M98 156V219M45 245H115",
  "M38 43L80 19L122 43M30 122L80 82L130 122M52 215L68 165M108 215L92 165M45 242H115",
  "M42 20H118V45H42ZM45 82H115V128H45ZM57 165H103V215H57ZM45 240H115",
  "M35 25Q80 0 125 25M35 43Q80 18 125 43M28 95Q80 55 132 95M28 120Q80 80 132 120M45 180Q80 150 115 180M45 244Q80 220 115 244",
  "M44 15H95L70 38H119M40 78H100L65 108H123M60 158H98L60 190H100M45 236H95L75 250H115",
];

export function ArmorPreview({ state }: { state: ArmorSet }) {
  return (
    <svg
      viewBox="0 0 160 270"
      role="img"
      aria-label="Schematic armor set color and pattern preview"
      shapeRendering="crispEdges"
    >
      {SLOTS.map((slot) => {
        const piece = state[slot];
        const base = data.bases.find((x) => x.id === piece.base)!;
        const material = data.materials.find((x) => x.id === piece.material)!;
        const index = data.templates.findIndex((x) => x.id === piece.pattern);
        return (
          <g key={slot}>
            <defs>
              <clipPath id={`armor-${slot}`}>
                <path d={armorPaths[slot]} />
              </clipPath>
            </defs>
            <path
              d={armorPaths[slot]}
              fill={base.color}
              stroke="#c4d8df55"
              strokeWidth="2"
            />
            <g clipPath={`url(#armor-${slot})`}>
              <path
                d={motifs[index]}
                stroke={material.color}
                strokeWidth="4"
                fill="none"
              />
              <path d="M0 0H160V270H150V0H0Z" fill="#ffffff12" />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
