import { t } from "@/content/format";
import { tag } from "./ui";

/** Pencil "SkillGroup": group name + tool count, then the tools as tags. */
export function SkillGroup({ group, items, toolsLabel }: { group: string; items: string[]; toolsLabel: string }) {
  const count = t(toolsLabel, { n: String(items.length).padStart(2, "0") });
  return (
    <li className="flex flex-col gap-3 border-b border-line py-5 md:flex-row md:gap-6 md:py-6">
      <div className="flex items-center gap-2.5 md:w-[180px] md:shrink-0 md:flex-col md:items-start md:gap-1 lg:w-[260px]">
        <h3 className="font-heading text-lg font-semibold tracking-[-0.5px] text-fg md:text-xl">{group}</h3>
        <p className="font-mono text-[11px] uppercase text-fg-3">{count}</p>
      </div>
      <ul className="flex flex-1 flex-wrap content-start gap-2" aria-label={group}>
        {items.map((item) => (
          <li key={item} className={tag}>
            {item}
          </li>
        ))}
      </ul>
    </li>
  );
}
