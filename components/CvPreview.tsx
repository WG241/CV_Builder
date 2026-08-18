import type { StructuredCV, CvSimpleEntry, CvGenericItem } from "@/lib/types";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <h2 className="border-b border-line pb-1 text-[13px] font-bold uppercase tracking-wide text-brand">
        {title}
      </h2>
      <div className="mt-2 text-[13px] leading-relaxed text-ink">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  const clean = items.filter((s) => s.trim());
  if (!clean.length) return null;
  return (
    <ul className="ml-4 list-disc space-y-1">
      {clean.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ul>
  );
}

function SimpleList({ items }: { items: CvSimpleEntry[] }) {
  return (
    <div className="space-y-1">
      {items.map((it, i) => (
        <div key={i} className="flex justify-between gap-4">
          <span>{[it.title, it.detail].filter(Boolean).join(" — ")}</span>
          {it.year && <span className="shrink-0 text-ink-muted">{it.year}</span>}
        </div>
      ))}
    </div>
  );
}

function GenericList({ items }: { items: CvGenericItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((e, i) => (
        <div key={i}>
          <div className="flex justify-between gap-4">
            <span className="font-semibold">
              {[e.role, e.organisation].filter(Boolean).join(", ")}
            </span>
            {e.dates && <span className="shrink-0 text-ink-muted">{e.dates}</span>}
          </div>
          {e.location && <p className="italic text-ink-muted">{e.location}</p>}
          <Bullets items={e.points} />
        </div>
      ))}
    </div>
  );
}

export function CvPreview({ cv }: { cv: StructuredCV }) {
  const dev = [
    ...cv.militaryTraining,
    ...cv.professionalCertifications,
    ...cv.executiveEducation,
  ];
  return (
    <article className="mx-auto max-w-[820px] bg-white p-6 text-ink shadow-card sm:p-10">
      <header>
        <h1 className="text-2xl font-bold text-brand sm:text-3xl">
          {cv.personalDetails.fullName}
        </h1>
        {cv.professionalHeadline && (
          <p className="mt-0.5 text-base text-ink-soft">{cv.professionalHeadline}</p>
        )}
        {cv.personalDetails.contactLine && (
          <p className="mt-1 text-xs text-ink-muted">{cv.personalDetails.contactLine}</p>
        )}
        {cv.personalDetails.linkedin && (
          <p className="text-xs text-ink-muted">{cv.personalDetails.linkedin}</p>
        )}
      </header>

      {cv.professionalProfile && (
        <Section title="Professional Profile">
          <p>{cv.professionalProfile}</p>
        </Section>
      )}

      {cv.coreCompetencies.length > 0 && (
        <Section title="Core Competencies">
          <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            {cv.coreCompetencies.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand-accent">•</span>
                {c}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {cv.careerExperience.length > 0 && (
        <Section title="Professional / Military Experience">
          <div className="space-y-4">
            {cv.careerExperience.map((e, i) => (
              <div key={i}>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold">
                    {[e.appointment, e.rank].filter(Boolean).join(" — ")}
                  </span>
                  <span className="shrink-0 text-ink-muted">
                    {[e.startDate, e.endDate].filter(Boolean).join(" – ")}
                  </span>
                </div>
                <p className="italic text-ink-muted">
                  {[e.organisation, e.formation, e.location].filter(Boolean).join(", ")}
                </p>
                <Bullets items={e.responsibilities} />
                {e.achievements.some((a) => a.trim()) && (
                  <>
                    <p className="mt-1 text-xs font-semibold text-brand">Key achievements</p>
                    <Bullets items={e.achievements} />
                  </>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {cv.education.length > 0 && (
        <Section title="Education">
          <div className="space-y-1">
            {cv.education.map((e, i) => (
              <div key={i} className="flex justify-between gap-4">
                <span>
                  {[[e.qualification, e.field].filter(Boolean).join(", "), [e.institution, e.location].filter(Boolean).join(", ")]
                    .filter(Boolean)
                    .join(" — ")}
                </span>
                {e.year && <span className="shrink-0 text-ink-muted">{e.year}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {dev.length > 0 && (
        <Section title="Military & Professional Development">
          <SimpleList items={dev} />
        </Section>
      )}

      {cv.boardExperience.length > 0 && (
        <Section title="Board & Governance Experience">
          <div className="space-y-3">
            {cv.boardExperience.map((e, i) => (
              <div key={i}>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold">
                    {[e.role, e.organisation].filter(Boolean).join(", ")}
                  </span>
                  {e.dates && <span className="shrink-0 text-ink-muted">{e.dates}</span>}
                </div>
                <Bullets items={e.points} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {cv.postMilitaryExperience.length > 0 && (
        <Section title="Post-Military Employment">
          <GenericList items={cv.postMilitaryExperience} />
        </Section>
      )}
      {cv.consultingExperience.length > 0 && (
        <Section title="Consulting & Advisory Experience">
          <GenericList items={cv.consultingExperience} />
        </Section>
      )}
      {cv.internationalAssignments.length > 0 && (
        <Section title="International Assignments">
          <GenericList items={cv.internationalAssignments} />
        </Section>
      )}
      {cv.projects.length > 0 && (
        <Section title="Major Projects & Initiatives">
          <GenericList items={cv.projects} />
        </Section>
      )}
      {cv.trainingExperience.length > 0 && (
        <Section title="Training & Instructional Experience">
          <GenericList items={cv.trainingExperience} />
        </Section>
      )}

      {cv.publications.length > 0 && (
        <Section title="Publications">
          <SimpleList items={cv.publications} />
        </Section>
      )}
      {cv.speakingEngagements.length > 0 && (
        <Section title="Speaking Engagements">
          <SimpleList items={cv.speakingEngagements} />
        </Section>
      )}
      {cv.professionalMemberships.length > 0 && (
        <Section title="Professional Memberships">
          <SimpleList items={cv.professionalMemberships} />
        </Section>
      )}
      {cv.awards.length > 0 && (
        <Section title="Awards & Decorations">
          <SimpleList items={cv.awards} />
        </Section>
      )}
      {cv.languages.length > 0 && (
        <Section title="Languages">
          <p>
            {cv.languages
              .map((l) => (l.proficiency ? `${l.language} (${l.proficiency})` : l.language))
              .join("   ·   ")}
          </p>
        </Section>
      )}
    </article>
  );
}
