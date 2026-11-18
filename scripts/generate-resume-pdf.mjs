// Build step: render src/data/resume.json to an ATS-friendly, single-column PDF
// at public/Saurabh-Lokhande-AI-Engineer.pdf (linked from the hero, nav and /resume).
// Plain text, real selectable characters, standard fonts — parsers read it cleanly.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/resume.json'), 'utf8'));
export const OUT = path.join(root, 'public', 'Saurabh-Lokhande-AI-Engineer.pdf');

const url = s => (s.startsWith('http') ? s : `https://${s}`);
const INK = '#111111', MUTED = '#555555', ACCENT = '#0e7490';

const doc = new PDFDocument({
    size: 'A4',
    bufferPages: true,
    margins: { top: 40, bottom: 36, left: 50, right: 50 },
    info: { Title: `${data.personal.name} — Résumé`, Author: data.personal.name, Subject: data.personal.title },
});
doc.pipe(fs.createWriteStream(OUT));
const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;

const heading = text => {
    doc.moveDown(0.6).font('Helvetica-Bold').fontSize(10.2).fillColor(ACCENT).text(text.toUpperCase(), { characterSpacing: 1 });
    const y = doc.y + 2;
    doc.moveTo(doc.page.margins.left, y).lineTo(doc.page.margins.left + width, y).lineWidth(0.6).strokeColor('#cccccc').stroke();
    doc.moveDown(0.35);
};
const bullet = text => {
    doc.font('Helvetica').fontSize(9.4).fillColor(INK).text(`•  ${text}`, { indent: 0, paragraphGap: 1.5, lineGap: 0.6 });
};

// Header
const p = data.personal;
doc.font('Helvetica-Bold').fontSize(22).fillColor(INK).text(p.name);
doc.font('Helvetica').fontSize(11).fillColor(MUTED).text(p.title).moveDown(0.3);
const line = items => {
    items.forEach((c, i) => {
        const last = i === items.length - 1;
        doc.fillColor(c.link ? ACCENT : MUTED).text(c.t, { continued: !last, link: c.link ?? null });
        if (!last) doc.fillColor(MUTED).text('   ·   ', { continued: true, link: null });
    });
};
doc.fontSize(9.3);
line([{ t: p.email, link: `mailto:${p.email}` }, { t: p.phone }, { t: p.location }].filter(c => c.t));
line([p.github, p.linkedin, p.portfolio].filter(Boolean).map(t => ({ t, link: url(t) })));

heading('Summary');
doc.font('Helvetica').fontSize(9.6).fillColor(INK).text(data.summary, { lineGap: 1 });

heading('Experience');
for (const e of data.experience) {
    doc.font('Helvetica-Bold').fontSize(10.6).fillColor(INK).text(`${e.role} — ${e.company}`, { continued: true });
    doc.font('Helvetica').fillColor(MUTED).text(`   ${e.duration}${e.type ? ` · ${e.type}` : ''}`);
    doc.moveDown(0.15);
    e.points.forEach(bullet);
    doc.moveDown(0.35);
}

heading('Selected projects');
for (const pr of data.projects) {
    doc.font('Helvetica-Bold').fontSize(10.2).fillColor(INK).text(pr.name, { continued: Boolean(pr.link) });
    if (pr.link) doc.font('Helvetica').fillColor(ACCENT).text(`   ${pr.link}`, { link: url(pr.link) });
    doc.font('Helvetica').fontSize(9.4).fillColor(INK).text(pr.desc, { lineGap: 0.6 }).moveDown(0.35);
}

heading('Skills');
for (const [cat, items] of Object.entries(data.skills)) {
    doc.font('Helvetica-Bold').fontSize(9.4).fillColor(INK).text(`${cat}: `, { continued: true });
    doc.font('Helvetica').fillColor(INK).text(items.join(', '), { lineGap: 0.6 });
}

heading('Education');
doc.font('Helvetica-Bold').fontSize(10.2).fillColor(INK).text(`${data.education.degree} — ${data.education.school}`, { continued: true });
doc.font('Helvetica').fillColor(MUTED).text(`   ${data.education.year}`);

if (doc.bufferedPageRange().count > 1) console.warn('resume pdf: content spills onto a second page');
doc.end();
console.log(`resume pdf → ${path.relative(root, OUT)}`);
