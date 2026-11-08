import { sections, skills } from "@/content";
import { SectionHead } from "./SectionHead";
import { SkillGroup } from "./SkillGroup";

/** Pencil "Skills": skill groups as ruled rows. No percentage bars. */
export function Skills() {
  const s = sections.skills;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="wrap section-y">
      <SectionHead
        id={`${s.id}-title`}
        index={s.index}
        label={s.eyebrow}
        title={s.title}
        description={s.description}
        className="max-w-[720px]"
      />
      <ul className="mt-8 border-t border-line md:mt-12">
        {skills.map(({ group, items }) => (
          <SkillGroup key={group} group={group} items={items} />
        ))}
      </ul>
    </section>
  );
}
