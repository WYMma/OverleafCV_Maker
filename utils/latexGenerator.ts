
import { CVData } from "../types";

export const generateLatex = (data: CVData): string => {
  // Function to sanitize text for LaTeX output
  const sanitize = (str: string) => {
    if (!str) return "";
    return str
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/\$/g, "\\$")
      .replace(/#/g, "\\#")
      .replace(/_/g, "\\_")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}")
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/</g, "\\textless{})")
      .replace(/>/g, "\\textgreater{})");
  };

  // Split name for moderncv \name command
  const nameParts = data.fullName.split(' ');
  const lastName = nameParts.pop() || '';
  const firstName = nameParts.join(' ');

  const experienceSection = data.experience.map(exp => {
    const bullets = exp.description
      .split('\n')
      .map(line => line.trim())
      .filter(l => l)
      .map(line => `\\item ${sanitize(line.replace(/^[•-]\s*/, ''))}`)
      .join('\n');

    const technologiesLine = exp.technologies
      ? `\\textit{Technologies \\\& Skills:} ${sanitize(exp.technologies)}\[0.5em]`
      : '';

    const roleAndType = exp.employmentType
      ? `${sanitize(exp.role)} (${sanitize(exp.employmentType)})`
      : sanitize(exp.role);

    return `\\cventry{${sanitize(exp.startDate)}--${sanitize(exp.endDate)}}{${roleAndType}}{${sanitize(exp.company)}}{${sanitize(exp.location)}}{}{%
\\begin{itemize}%
${bullets}
\\end{itemize}
${technologiesLine}}`;
  }).join('\n');

  const educationSection = data.education.map(edu => {
    const period = edu.startDate && edu.endDate
      ? `${sanitize(edu.startDate)}--${sanitize(edu.endDate)}`
      : sanitize(edu.year);

    return `
\\cventry{${period}}{${sanitize(edu.degree)}}{${sanitize(edu.institution)}}{${sanitize(edu.location)}}{${sanitize(edu.speciality)}}{${sanitize(edu.details)}}
`;
  }).join('\n');

  const extracurricularActivitiesSection = data.extracurricularActivities.map(activity => {
    const bullets = activity.description
      .split('\n')
      .map(line => line.trim())
      .filter(l => l)
      .map(line => `\\item ${sanitize(line.replace(/^[•-]\s*/, ''))}`)
      .join('\n');

    return `\\cventry{${sanitize(activity.startDate)}--${sanitize(activity.endDate)}}{${sanitize(activity.organization)}}{${sanitize(activity.location)}}{}{}{%
\\begin{itemize}%
${bullets}
\\end{itemize}}`;
  }).join('\n');

  const certificationsSection = (data as any).certifications?.map((cert: any) => `
\\cventry{${sanitize(cert.date)}}{${sanitize(cert.name)}}{${sanitize(cert.provider)}}{}{ }{${sanitize(cert.details)}}
`).join('\n') || '';

  const skillsSection = data.skills.trim()
    ? `\\cvitem{}{${sanitize(data.skills)}}`
    : '';

  const projectSection = data.projects.map(proj => {
    const description = sanitize(proj.description);
    const link = proj.link ? `\\href{${proj.link.replace(/[\\&%$#_{}~^]/g, '\\\\$&')}}{[Link]}` : '';
    return `\\cvitem{${sanitize(proj.name)}}{${description} ${link}}`;
  }).join('\n');

  const languagesSection = data.languages && data.languages.length > 0
    ? data.languages
        .map(lang => `\\cvitem{${sanitize(lang.name)}}{${sanitize(lang.proficiency)}}`)
        .join('\n')
    : '\\cvitem{}{No languages specified}';

  // Helper function to create a section only if it has content
  const createSection = (title: string, content: string, condition: boolean = true) => {
    if (!condition || !content.trim()) return '';
    return `%-----------${title.toUpperCase()}-----------
\\section{${title}}
${content}

`;
  };

  return `\\documentclass[11pt,a4paper,sans]{moderncv}

% ModernCV theme and color
\\moderncvstyle{classic}
\\moderncvcolor{green}
\\usepackage[utf8]{inputenc}
\\usepackage[scale=0.8]{geometry}
\\setlength{\\hintscolumnwidth}{3cm} % width of the date column
\\usepackage{enumitem}

% Personal data
\\name{${sanitize(firstName)}}{${sanitize(lastName)}}
\\title{${sanitize(data.title)}}
${data.phone ? `\\phone[mobile]{${sanitize(data.phone)}}` : ''}
${data.email ? `\\email{${sanitize(data.email)}}` : ''}
${data.linkedin ? `\\social[linkedin]{${data.linkedin.replace(/[\\&%$#_{}~^]/g, '\\$&')}}` : ''}
${data.github ? `\\social[github]{${data.github.replace(/[\\&%$#_{}~^]/g, '\\$&')}}` : ''}
${data.website ? `\\homepage{${data.website.replace(/[\\&%$#_{}~^]/g, '\\$&')}}` : ''}

\\begin{document}

\\makecvtitle

${createSection('Profile', `\\cvitem{}{${sanitize(data.summary)}}`, !!data.summary)}
${createSection('Education', educationSection, data.education?.length > 0)}
${createSection('Extracurricular Activities', extracurricularActivitiesSection, data.extracurricularActivities?.length > 0)}
${createSection('Certifications', certificationsSection, !!certificationsSection)}
${createSection('Professional Experience', experienceSection, data.experience?.length > 0)}
${createSection('Languages', languagesSection, data.languages?.length > 0)}
${createSection('Skills', skillsSection, data.skills?.length > 0)}
${createSection('Projects \\& Interests', projectSection, data.projects?.length > 0)}

\\end{document}
`;
};