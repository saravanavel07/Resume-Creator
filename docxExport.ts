import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { ResumeData } from '../types';

/**
 * Generates an ATS-compliant Word (.docx) document from ResumeData
 * and triggers a client-side file download.
 */
export async function exportToWordDocx(resumeData: ResumeData): Promise<void> {
  const { contact, summary, experience, skills, education, projects } = resumeData;

  const children: Paragraph[] = [];

  // 1. Header Name (Centered, 16pt Bold)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: (contact.fullName || 'YOUR NAME').toUpperCase(),
          bold: true,
          size: 32, // 16pt (half-points in docx)
          font: 'Arial',
        }),
      ],
    })
  );

  // Contact Info Line
  const contactParts: string[] = [];
  if (contact.email) contactParts.push(contact.email);
  if (contact.phone) contactParts.push(contact.phone);
  if (contact.location) contactParts.push(contact.location);
  if (contact.linkedin) contactParts.push(contact.linkedin);
  if (contact.github) contactParts.push(contact.github);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: contactParts.join('  •  '),
            size: 20, // 10pt
            font: 'Arial',
            color: '333333',
          }),
        ],
      })
    );
  }

  // Helper for section headings
  const addSectionHeading = (title: string) => {
    children.push(
      new Paragraph({
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: '111827',
            space: 4,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22, // 11pt
            font: 'Arial',
            color: '111827',
          }),
        ],
      })
    );
  };

  // 2. Executive Summary
  if (summary && summary.trim()) {
    addSectionHeading('Professional Summary');
    children.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: summary.trim(),
            size: 20, // 10pt
            font: 'Arial',
          }),
        ],
      })
    );
  }

  // 3. Work Experience
  if (experience && experience.length > 0) {
    addSectionHeading('Work Experience');

    experience.forEach((exp) => {
      // Role & Company Header
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: `${exp.role} — ${exp.company}`,
              bold: true,
              size: 21, // 10.5pt
              font: 'Arial',
            }),
            new TextRun({
              text: exp.dates ? ` (${exp.dates})` : '',
              size: 19, // 9.5pt
              font: 'Arial',
              color: '555555',
            }),
          ],
        })
      );

      // Bullets
      exp.bullets.forEach((bullet) => {
        if (bullet && bullet.trim()) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: bullet.trim(),
                  size: 20, // 10pt
                  font: 'Arial',
                }),
              ],
            })
          );
        }
      });
    });
  }

  // 4. Skills & Competencies
  if (skills && (skills.technical.length > 0 || skills.tools.length > 0)) {
    addSectionHeading('Skills & Competencies');

    if (skills.technical.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: 'Technical Skills: ',
              bold: true,
              size: 20,
              font: 'Arial',
            }),
            new TextRun({
              text: skills.technical.join(', '),
              size: 20,
              font: 'Arial',
            }),
          ],
        })
      );
    }

    if (skills.tools.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: 'Tools & Software: ',
              bold: true,
              size: 20,
              font: 'Arial',
            }),
            new TextRun({
              text: skills.tools.join(', '),
              size: 20,
              font: 'Arial',
            }),
          ],
        })
      );
    }
  }

  // 5. Education
  if (education && education.length > 0) {
    addSectionHeading('Education');

    education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `${edu.degree} — ${edu.institution}`,
              bold: true,
              size: 20,
              font: 'Arial',
            }),
            new TextRun({
              text: edu.dates ? ` (${edu.dates})` : '',
              size: 19,
              font: 'Arial',
              color: '555555',
            }),
          ],
        })
      );
    });
  }

  // 6. Projects
  if (projects && projects.length > 0) {
    addSectionHeading('Key Projects');

    projects.forEach((proj) => {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 21,
              font: 'Arial',
            }),
            new TextRun({
              text: proj.technologies ? ` (${proj.technologies})` : '',
              size: 19,
              font: 'Arial',
              color: '555555',
            }),
          ],
        })
      );

      proj.bullets.forEach((bullet) => {
        if (bullet && bullet.trim()) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: bullet.trim(),
                  size: 20,
                  font: 'Arial',
                }),
              ],
            })
          );
        }
      });
    });
  }

  // Construct Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch (1440 twips per inch)
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children,
      },
    ],
  });

  // Pack to Blob and download
  const blob = await Packer.toBlob(doc);
  const cleanName = (contact.fullName || 'ATS_Resume').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${cleanName}_ATS_Resume.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
