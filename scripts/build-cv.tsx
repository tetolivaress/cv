/**
 * Builds the ATS-friendly PDF CV from src/content (the same data as the site)
 * and writes it to public/<site.pdf.fileName> and public/cv.pdf.
 *
 * Runs before `next dev` and `next build` (see package.json "assets").
 * Also prints every field that was skipped because it is empty or still TODO,
 * and fails the build if the PDF grows past two pages.
 */
import { Document, Link, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { copyFile, writeFile } from "node:fs/promises";
import { Children } from "react";
import path from "node:path";
import {
  certifications,
  contentWarnings,
  education,
  experience,
  featuredCertifications,
  formatMonths,
  person,
  projects,
  site,
  skills,
  t,
  ui,
} from "../src/content";
import { displayUrl, getSiteUrl } from "../src/lib/site-url";

const MAX_PAGES = 2;
const root = path.resolve(import.meta.dirname, "..");
const outFile = path.join(root, "public", site.pdf.fileName);
const aliasFile = path.join(root, "public", "cv.pdf");

// ───────────────────────── warnings ─────────────────────────
if (contentWarnings.length) {
  const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
  console.warn(yellow(`\n⚠ ${contentWarnings.length} empty or TODO fields in src/content/resume.ts are not shown on the site or in the PDF:`));
  for (const warning of contentWarnings) console.warn(yellow(`  · ${warning}`));
  console.warn("");
}

// ───────────────────────── document ─────────────────────────
const siteUrl = getSiteUrl();
const ink = "#111111";
const muted = "#444444";
const rule = "#BBBBBB";

const s = StyleSheet.create({
  page: { paddingTop: 34, paddingBottom: 40, paddingHorizontal: 42, fontFamily: "Helvetica", fontSize: 9.4, lineHeight: 1.35, color: ink },
  name: { fontFamily: "Helvetica", fontWeight: "bold", fontSize: 20, lineHeight: 1.1 },
  title: { fontSize: 11, marginTop: 3, color: muted },
  contact: { marginTop: 6, fontSize: 9, color: ink },
  sep: { color: muted },
  link: { color: ink, textDecoration: "none" },
  section: { marginTop: 11 },
  heading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingBottom: 2,
    marginBottom: 5,
    borderBottomWidth: 0.75,
    borderBottomColor: rule,
  },
  entry: { marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  entryTitle: { fontFamily: "Helvetica", fontWeight: "bold", fontSize: 9.8, flexShrink: 1, paddingRight: 8 },
  dates: { fontSize: 9, color: muted, textAlign: "right" },
  bullet: { flexDirection: "row", marginTop: 1.5 },
  bulletDot: { width: 9, color: muted },
  bulletText: { flex: 1 },
  stack: { marginTop: 1.5, fontSize: 8.6, color: muted },
  line: { marginBottom: 2.5 },
  bold: { fontFamily: "Helvetica", fontWeight: "bold" },
  footer: { position: "absolute", bottom: 20, left: 42, right: 42, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: "#777777" },
});



/** Section heading kept on the same page as its first entry (no orphaned headings). */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [first, ...rest] = Children.toArray(children);
  return (
    <View style={s.section}>
      <View wrap={false}>
        <Text style={s.heading}>{title}</Text>
        {first}
      </View>
      {rest}
    </View>
  );
}

/** Clickable URL whose visible text is the URL itself (without the protocol). */
function Url({ href }: { href: string }) {
  return (
    <Link src={href} style={s.link}>
      {displayUrl(href)}
    </Link>
  );
}

const SEP = "\u00A0\u00A0·\u00A0\u00A0";
const contactLines: React.ReactNode[][] = [
  [
    <Text key="loc">{person.location}</Text>,
    <Link key="mail" src={`mailto:${person.email}`} style={s.link}>
      {person.email}
    </Link>,
  ],
  [
    ...(["linkedin", "github"] as const)
      .filter((key) => person.links[key])
      .map((key) => <Url key={key} href={person.links[key]!} />),
    <Text key="site">
      {ui.pdf.portfolio}: <Url href={siteUrl} />
    </Text>,
  ],
];

const otherCerts = certifications.length - featuredCertifications.length;

function Cv() {
  return (
    <Document
      title={`${person.name} — CV`}
      author={person.name}
      subject={person.title}
      keywords={skills.flatMap((g) => g.items).slice(0, 25).join(", ")}
      creator={person.name}
      producer={person.name}
      language="en"
    >
      <Page size={site.pdf.pageSize} style={s.page}>
        {/* Header */}
        <Text style={s.name}>{person.name}</Text>
        <Text style={s.title}>{person.title}</Text>
        {contactLines.map((line, l) => (
          <Text key={l} style={[s.contact, l > 0 ? { marginTop: 2 } : {}]}>
            {line.map((item, i) => (
              <Text key={i}>
                {i > 0 && <Text style={s.sep}>{SEP}</Text>}
                {item}
              </Text>
            ))}
          </Text>
        ))}

        <Section title={ui.pdf.summary}>
          <Text>{person.summary}</Text>
        </Section>

        <Section title={ui.pdf.experience}>
          {experience.map((job, i) => {
            const heading = job.company ? `${job.role}, ${job.company}` : job.role;
            const dates = [formatMonths(job.start, job.end), job.remote ? ui.remote : ""].filter(Boolean).join(" · ");
            return (
              <View key={i} style={s.entry} wrap={false}>
                <View style={s.row}>
                  <Text style={s.entryTitle}>{heading}</Text>
                  {dates && <Text style={s.dates}>{dates}</Text>}
                </View>
                {job.highlights.slice(0, 3).map((item) => (
                  <View key={item} style={s.bullet}>
                    <Text style={s.bulletDot}>•</Text>
                    <Text style={s.bulletText}>{item}</Text>
                  </View>
                ))}
                {job.stack.length > 0 && <Text style={s.stack}>{job.stack.join(", ")}</Text>}
              </View>
            );
          })}
        </Section>

        <Section title={ui.pdf.projects}>
          {projects.map((project) => (
            <View key={project.slug} style={s.entry} wrap={false}>
              <Text>
                <Text style={s.bold}>{project.name}</Text>
                <Text style={s.sep}>{"\u00A0\u00A0—\u00A0\u00A0"}</Text>
                <Url href={project.url} />
              </Text>
              {project.summary && (
                <Text>
                  {project.summary}
                  {project.stack.length > 0 ? ` (${project.stack.join(", ")})` : ""}
                </Text>
              )}
            </View>
          ))}
        </Section>

        <Section title={ui.pdf.skills}>
          {skills.map(({ group, items }) => (
            <Text key={group} style={s.line}>
              <Text style={s.bold}>{group}: </Text>
              {items.join(", ")}
            </Text>
          ))}
        </Section>

        <Section title={ui.pdf.education}>
          {education.map((item) => (
            <View key={item.degree} style={s.row} wrap={false}>
              <Text style={s.bulletText}>
                <Text style={s.bold}>{item.degree}</Text>, {item.school}
              </Text>
              <Text style={s.dates}>{item.year}</Text>
            </View>
          ))}
        </Section>

        <Section title={ui.pdf.certifications}>
          {featuredCertifications.map((cert) => (
            <Text key={`${cert.issuer}-${cert.name}`} style={s.line}>
              <Text style={s.bold}>{cert.name}</Text>, {cert.issuer}
              {cert.date ? ` (${cert.date.slice(0, 4)})` : ""}
              {cert.credentialUrl ? "\u00A0\u00A0" : ""}
              {cert.credentialUrl ? <Url href={cert.credentialUrl} /> : null}
            </Text>
          ))}
          {otherCerts > 0 && (
            <Text style={s.line}>
              {t(ui.pdf.moreCerts, { n: otherCerts, url: "" }).trim()}{" "}
              <Url href={`${siteUrl}/?certs=all`} />
            </Text>
          )}
        </Section>

        <Section title={ui.pdf.languages}>
          <Text>
            {person.languages
              .map((l) => `${l.name}: ${[l.cefr && !/native/i.test(l.level) ? l.cefr : l.level, l.note].filter(Boolean).join(", ")}`)
              .join(SEP)}
          </Text>
        </Section>

        <View style={s.footer} fixed>
          <Text>{person.name} · CV</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

// ───────────────────────── build + verify ─────────────────────────
const buffer = await renderToBuffer(<Cv />);
await writeFile(outFile, buffer);
await copyFile(outFile, aliasFile);

const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
const pdf = await getDocument({ data: new Uint8Array(buffer), verbosity: 0 }).promise;
let text = "";
const links: string[] = [];
for (let n = 1; n <= pdf.numPages; n++) {
  const page = await pdf.getPage(n);
  const content = await page.getTextContent();
  text += content.items.map((item) => ("str" in item ? item.str : "")).join(" ") + "\n";
  for (const annotation of await page.getAnnotations()) if (annotation.url) links.push(annotation.url);
}

const problems: string[] = [];
if (pdf.numPages > MAX_PAGES) problems.push(`PDF has ${pdf.numPages} pages (max ${MAX_PAGES}).`);
const flat = text.replace(/\s+/g, " ");
for (const project of projects) {
  if (!flat.includes(displayUrl(project.url))) problems.push(`Project URL text missing: ${displayUrl(project.url)}`);
  if (!links.some((l) => l.replace(/\/$/, "") === project.url.replace(/\/$/, ""))) problems.push(`Project link not clickable: ${project.url}`);
}
if (!flat.includes(person.name)) problems.push("Name is not selectable text.");

const kb = (buffer.length / 1024).toFixed(0);
console.log(`[cv] public/${site.pdf.fileName} — ${pdf.numPages} page(s), ${kb} KB, ${links.length} links, ${flat.length} chars of text`);
if (problems.length) {
  console.error(`\x1b[31m[cv] PDF checks failed:\n  - ${problems.join("\n  - ")}\x1b[0m`);
  process.exit(1);
}
