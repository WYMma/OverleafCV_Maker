import { CVData } from "../types";

// Function to sanitize text for LaTeX output
const sanitize = (str: string) => {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/</g, "\\textless{}")
    .replace(/>/g, "\\textgreater{}")
    .replace(/\r?\n/g, " ") // Replace newlines with spaces in cvitem content
    .replace(/\s+/g, " ") // Multiple spaces to single space
    .trim();
};

const extractHandle = (url: string) => {
  if (!url) return "";
  // Remove trailing slashes and get the last part
  return url.replace(/\/+$/, "").split("/").pop() || "";
};

const cleanUrl = (url: string) => {
  if (!url) return "";
  // Remove protocol and trailing slashes for display
  return url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
};

// Helper function to create a section only if it has content
const createSection = (title: string, content: string, condition: boolean = true) => {
  if (!condition || !content.trim()) return '';
  return `%-----------${title.toUpperCase()}-----------
\\section{${title}}
${content}

`;
};

const generateModernCV = (data: CVData, style: 'classic' | 'banking' = 'classic'): string => {
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
      ? `\\\\\\textit{Technologies \\\& Skills:} ${sanitize(exp.technologies)}`
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

  const certificationsSection = data.certifications?.map((cert: any) => `
\\cventry{${sanitize(cert.date)}}{${sanitize(cert.name)}}{${sanitize(cert.provider)}}{}{ }{${sanitize(cert.details)}}
`).join('\n') || '';

  const skillsSection = data.skills && data.skills.trim()
    ? (() => {
      const sanitizedSkills = sanitize(data.skills);
      return sanitizedSkills ? `\\cvitem{}{${sanitizedSkills}}` : '';
    })()
    : '';

  const projectSection = data.projects.map(proj => {
    const description = proj.description
      .split('\n')
      .map(line => line.trim())
      .filter(l => l)
      .map(line => sanitize(line.replace(/^[•-]\s*/, '')))
      .join(' ');
    const link = proj.link ? `\\href{${proj.link.replace(/[\\&%$#_{}~^]/g, '\\$&')}}{[Link]}` : '';
    const projectName = sanitize(proj.name);
    const content = `${description} ${link}`.trim();

    // Only generate cvitem if we have valid content
    if (!projectName || !content) return '';
    return `\\cvitem{${projectName}}{${content}}`;
  }).filter(item => item.trim()).join('\n');

  const languagesSection = data.languages && data.languages.length > 0
    ? data.languages
      .map(lang => {
        const langName = sanitize(lang.name);
        const langProf = sanitize(lang.proficiency);
        if (!langName || !langProf) return '';
        return `\\cvitem{${langName}}{${langProf}}`;
      })
      .filter(item => item.trim())
      .join('\n')
    : '\\cvitem{}{No languages specified}';

  return `\\documentclass[11pt,a4paper,sans]{moderncv}

% ModernCV theme and color
\\moderncvstyle{${style}}
\\moderncvcolor{green}
\\usepackage[utf8]{inputenc}
\\usepackage[scale=0.8]{geometry}
\\setlength{\\hintscolumnwidth}{3cm} % width of the date column
\\usepackage{enumitem}

% Personal data
\\name{${sanitize(firstName)}}{${sanitize(lastName)}}
${data.phone ? `\\phone[mobile]{${sanitize(data.phone)}}` : ''}
${data.email ? `\\email{${sanitize(data.email)}}` : ''}
${data.linkedin ? `\\social[linkedin]{${extractHandle(data.linkedin).replace(/[\\&%$#_{}~^]/g, '\\$&')}}` : ''}
${data.github ? `\\social[github]{${extractHandle(data.github).replace(/[\\&%$#_{}~^]/g, '\\$&')}}` : ''}
${data.website ? `\\homepage{${cleanUrl(data.website).replace(/[\\&%$#_{}~^]/g, '\\$&')}}` : ''}

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

const generateEuroPassCV = (data: CVData): string => {
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

    return `\\ecvtitle{${sanitize(exp.startDate)}--${sanitize(exp.endDate)}}{${sanitize(exp.role)}}
\\ecvitem{}{${sanitize(exp.company)}, ${sanitize(exp.location)}}
\\ecvitem{}{%
\\begin{itemize}%
${bullets}
\\end{itemize}}`;
  }).join('\n');

  const educationSection = data.education.map(edu => {
    const period = edu.startDate && edu.endDate
      ? `${sanitize(edu.startDate)}--${sanitize(edu.endDate)}`
      : sanitize(edu.year);

    return `\\ecvtitle{${period}}{${sanitize(edu.degree)}}
\\ecvitem{}{${sanitize(edu.institution)}, ${sanitize(edu.location)}}
\\ecvitem{}{${sanitize(edu.speciality)} -- ${sanitize(edu.details)}}`;
  }).join('\n');

  const skillsSection = data.skills && data.skills.trim()
    ? `\\ecvsection{Digital Skills}
\\ecvitem{}{${sanitize(data.skills)}}`
    : '';

  const languagesSection = data.languages && data.languages.length > 0
    ? `\\ecvsection{Languages}
${data.languages.map(lang => `\\ecvitem{${sanitize(lang.name)}}{${sanitize(lang.proficiency)}}`).join('\n')}`
    : '';

  return `\\documentclass[english,a4paper]{europasscv}
\\usepackage[utf8]{inputenc}

\\ecvname{${sanitize(data.fullName)}}
${data.phone ? `\\ecvmobile{${sanitize(data.phone)}}` : ''}
${data.email ? `\\ecvemail{${sanitize(data.email)}}` : ''}
${data.linkedin ? `\\ecvlinkedin{${data.linkedin}}` : ''}
${data.github ? `\\ecvgithub{${data.github}}` : ''}
${data.website ? `\\ecvhomepage{${data.website}}` : ''}

\\begin{document}
\\begin{europasscv}
\\ecvpersonalinfo

${createSection('Work Experience', experienceSection, data.experience?.length > 0).replace(/\\section/g, '\\ecvsection')}
${createSection('Education and training', educationSection, data.education?.length > 0).replace(/\\section/g, '\\ecvsection')}
${languagesSection}
${skillsSection}

\\end{europasscv}
\\end{document}
`;
};

export const generateLatex = (data: CVData): string => {
  switch (data.template) {
    case 'europass':
      return generateEuroPassCV(data);
    case 'canadian':
      return generateModernCV(data, 'banking');
    case 'moderncv':
    default:
      return generateModernCV(data, 'classic');
  }
};