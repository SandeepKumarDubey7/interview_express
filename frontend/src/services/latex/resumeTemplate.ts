
// LaTeX template generator for professional resumes

export const generateLatexTemplate = (formData: any, templateId: string): string => {
  // Get current date for the "Last updated" text
  const currentDate = new Date();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const lastUpdated = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  
  // Extract data
  const {
    personalInfo,
    education,
    experience,
    skills,
    projects,
    certifications
  } = formData;

  // Generate LaTeX document
  return `\\documentclass[10pt, letterpaper]{article}

% Packages:
\\usepackage[
    ignoreheadfoot, % set margins without considering header and footer
    top=2 cm, % seperation between body and page edge from the top
    bottom=2 cm, % seperation between body and page edge from the bottom
    left=2 cm, % seperation between body and page edge from the left
    right=2 cm, % seperation between body and page edge from the right
    footskip=1.0 cm, % seperation between body and footer
]{geometry} % for adjusting page geometry
\\usepackage{titlesec} % for customizing section titles
\\usepackage{tabularx} % for making tables with fixed width columns
\\usepackage{array} % tabularx requires this
\\usepackage[dvipsnames]{xcolor} % for coloring text
\\definecolor{primaryColor}{RGB}{0, 79, 144} % define primary color
\\usepackage{enumitem} % for customizing lists
\\usepackage{fontawesome5} % for using icons
\\usepackage{amsmath} % for math
\\usepackage[
    pdftitle={${personalInfo.fullName}'s Resume},
    pdfauthor={${personalInfo.fullName}},
    pdfcreator={LaTeX with ResumeAI},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref} % for links, metadata and bookmarks
\\usepackage[pscoord]{eso-pic} % for floating text on the page
\\usepackage{calc} % for calculating lengths
\\usepackage{bookmark} % for bookmarks
\\usepackage{lastpage} % for getting the total number of pages
\\usepackage{changepage} % for one column entries (adjustwidth environment)
\\usepackage{paracol} % for two and three column entries
\\usepackage{ifthen} % for conditional statements
\\usepackage{needspace} % for avoiding page brake right after the section title
\\usepackage{iftex} % check if engine is pdflatex, xetex or luatex

% Ensure that generate pdf is machine readable/ATS parsable:
\\ifPDFTeX
    \\input{glyphtounicode}
    \\pdfgentounicode=1
    % \\usepackage[T1]{fontenc}
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
\\fi

% Some settings:
\\AtBeginEnvironment{adjustwidth}{\\partopsep0pt} % remove space before adjustwidth environment
\\pagestyle{empty} % no header or footer
\\setcounter{secnumdepth}{0} % no section numbering
\\setlength{\\parindent}{0pt} % no indentation
\\setlength{\\topskip}{0pt} % no top skip
\\setlength{\\columnsep}{0cm} % set column seperation
\\makeatletter
\\let\\ps@customFooterStyle\\ps@plain % Copy the plain style to customFooterStyle
\\patchcmd{\\ps@customFooterStyle}{\\thepage}{
    \\color{gray}\\textit{\\small ${personalInfo.fullName} - Page \\thepage{} of \\pageref*{LastPage}}
}{}{} % replace number by desired string
\\makeatother
\\pagestyle{customFooterStyle}

\\titleformat{\\section}{\\needspace{4\\baselineskip}\\bfseries\\large}{}{0pt}{}[\\vspace{1pt}\\titlerule]

\\titlespacing{\\section}{
    % left space:
    -1pt
}{
    % top space:
    0.3 cm
}{
    % bottom space:
    0.2 cm
} % section title spacing

\\renewcommand\\labelitemi{$\\circ$} % custom bullet points
\\newenvironment{highlights}{
    \\begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=0.4 cm + 10pt
    ]
}{
    \\end{itemize}
} % new environment for highlights

\\newenvironment{highlightsforbulletentries}{
    \\begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=10pt
    ]
}{
    \\end{itemize}
} % new environment for highlights for bullet entries

\\newenvironment{onecolentry}{
    \\begin{adjustwidth}{
        0.2 cm + 0.00001 cm
    }{
        0.2 cm + 0.00001 cm
    }
}{
    \\end{adjustwidth}
} % new environment for one column entries

\\newenvironment{twocolentry}[2][]{
    \\onecolentry
    \\def\\secondColumn{#2}
    \\setcolumnwidth{\\fill, 4.5 cm}
    \\begin{paracol}{2}
}{
    \\switchcolumn \\raggedleft \\secondColumn
    \\end{paracol}
    \\endonecolentry
} % new environment for two column entries

\\newenvironment{header}{
    \\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}
}{
    \\par\\kern\\topsep
} % new environment for the header

\\newcommand{\\placelastupdatedtext}{% \\placetextbox{<horizontal pos>}{<vertical pos>}{<stuff>}
  \\AddToShipoutPictureFG*{% Add <stuff> to current page foreground
    \\put(
        \\LenToUnit{\\paperwidth-2 cm-0.2 cm+0.05cm},
        \\LenToUnit{\\paperheight-1.0 cm}
    ){\\vtop{{\\null}\\makebox[0pt][c]{
        \\small\\color{gray}\\textit{Last updated in ${lastUpdated}}\\hspace{\\widthof{Last updated in ${lastUpdated}}}
    }}}%
  }%
}%

% save the original href command in a new command:
\\let\\hrefWithoutArrow\\href

% new command for external links:
\\renewcommand{\\href}[2]{\\hrefWithoutArrow{#1}{\\ifthenelse{\\equal{#2}{}}{}{#2 }\\raisebox{.15ex}{\\footnotesize \\faExternalLink*}}}

\\begin{document}
    \\newcommand{\\AND}{\\unskip
        \\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox
        \\ignorespaces
    }
    \\newsavebox\\ANDbox
    \\sbox\\ANDbox{}

    \\placelastupdatedtext
    \\begin{header}
        \\textbf{\\fontsize{24 pt}{24 pt}\\selectfont ${personalInfo.fullName}}

        \\vspace{0.3 cm}

        \\normalsize
        ${personalInfo.address ? `\\mbox{{\\color{black}\\footnotesize\\faMapMarker*}\\hspace*{0.13cm}${personalInfo.address}}%
        \\kern 0.25 cm%
        \\AND%
        \\kern 0.25 cm%` : ''}
        \\mbox{\\hrefWithoutArrow{mailto:${personalInfo.email}}{{\\color{black}{\\footnotesize\\faEnvelope[regular]}}\\hspace*{0.13cm}${personalInfo.email}}}%
        \\kern 0.25 cm%
        \\AND%
        \\kern 0.25 cm%
        ${personalInfo.phone ? `\\mbox{\\hrefWithoutArrow{tel:${personalInfo.phone}}{{\\color{black}{\\footnotesize\\faPhone*}}\\hspace*{0.13cm}${personalInfo.phone}}}%
        \\kern 0.25 cm%
        \\AND%
        \\kern 0.25 cm%` : ''}
        ${personalInfo.website ? `\mbox{\hrefWithoutArrow{${personalInfo.website}}{{\color{black}{\footnotesize\faLink}}\hspace*{0.13cm}${personalInfo.website.replace(/^https?:\/\//, '')}}}%
        \kern 0.25 cm%
        \AND%
        \kern 0.25 cm%` : ''}
        ${personalInfo.linkedin ? `\mbox{\hrefWithoutArrow{${personalInfo.linkedin}}{{\color{black}{\footnotesize\faLinkedinIn}}\hspace*{0.13cm}${personalInfo.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, '')}}}%
        \kern 0.25 cm%
        \AND%
        \kern 0.25 cm%` : ''}
        ${personalInfo.github ? `\mbox{\hrefWithoutArrow{${personalInfo.github}}{{\color{black}{\footnotesize\faGithub}}\hspace*{0.13cm}${personalInfo.github.replace(/^https?:\/\/(?:www\.)?github\.com\//, '')}}}%` : ''}
    \\end{header}

    \\vspace{0.3 cm - 0.3 cm}

${personalInfo.summary ? `
    \\section{Professional Summary}
        
        \\begin{onecolentry}
            ${personalInfo.summary.replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/#/g, '\\#').replace(/\n/g, '\\\\\\\\')}
        \\end{onecolentry}
` : ''}

${education.some(edu => edu.institution) ? `
    \\section{Education}
${education.filter(edu => edu.institution).map((edu, index) => `
        ${index > 0 ? '\\vspace{0.2 cm}\n' : ''}
        \\begin{twocolentry}{
            ${edu.startDate && edu.endDate ? `\\textit{${edu.startDate} – ${edu.endDate}}` : ''}
        }
            \\textbf{${edu.institution.replace(/&/g, '\\&').replace(/%/g, '\\%')}}

            ${edu.degree ? `\\textit{${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}}` : ''}
        \\end{twocolentry}
        ${edu.gpa || edu.description ? `
        \\vspace{0.10 cm}
        \\begin{onecolentry}
            \\begin{highlights}
                ${edu.gpa ? `\\item GPA: ${edu.gpa}` : ''}
                ${edu.description ? `\\item ${edu.description.replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/#/g, '\\#').replace(/\n/g, '\\\\\\\\')}` : ''}
            \\end{highlights}
        \\end{onecolentry}` : ''}
`).join('')}
` : ''}

${experience.some(exp => exp.company) ? `
    \\section{Experience}
${experience.filter(exp => exp.company).map((exp, index) => `
        ${index > 0 ? '\\vspace{0.2 cm}\n' : ''}
        \\begin{twocolentry}{
        ${exp.location ? `\\textit{${exp.location}}` : ''}    
            
        \\textit{${exp.startDate}${exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}}}
            \\textbf{${exp.position.replace(/&/g, '\\&').replace(/%/g, '\\%')}}
            
            \\textit{${exp.company.replace(/&/g, '\\&').replace(/%/g, '\\%')}}
        \\end{twocolentry}
        ${exp.description ? `
        \\vspace{0.10 cm}
        \\begin{onecolentry}
            \\begin{highlights}
                ${exp.description
                  .split('\n')
                  .filter(line => line.trim())
                  .map(line => `\\item ${line.trim().replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/#/g, '\\#')}`)
                  .join('\n                ')}
            \\end{highlights}
        \\end{onecolentry}` : ''}
`).join('')}
` : ''}

${skills.some(skill => skill) ? `
    \\section{Skills}
        
        \\begin{onecolentry}
            ${skills.filter(s => s.trim()).join(', ')}
        \\end{onecolentry}
` : ''}

${projects.some(proj => proj.title) ? `
    \\section{Projects}
${projects.filter(proj => proj.title).map((proj, index) => `
        ${index > 0 ? '\vspace{0.2 cm}\n' : ''}
        \begin{twocolentry}{
            ${proj.link ? `\textit{\href{${proj.link}}{${proj.link.replace(/^https?:\/\/(?:www\.)?github\.com\//, 'github.com/').replace(/&/g, '\&').replace(/%/g, '\%')}}}` : ''}
        }
            \textbf{${proj.title.replace(/&/g, '\&').replace(/%/g, '\%')}}
        \end{twocolentry}
        ${proj.description || proj.technologies.some(t => t) ? `
        \\vspace{0.10 cm}
        \\begin{onecolentry}
            \\begin{highlights}
                ${proj.description ? `\item ${proj.description.replace(/&/g, '\&').replace(/%/g, '\%').replace(/#/g, '\#').replace(/\n/g, '\\\\')}` : ''}
                ${proj.technologies.some(t => t) ? `\item \textbf{Technologies:} ${proj.technologies.filter(t => t.trim()).join(', ').replace(/&/g, '\&').replace(/%/g, '\%')}` : ''}
            \end{highlights}
        \end{onecolentry}` : ''}
`).join('')}
` : ''}

${certifications.some(cert => cert.name) ? `
    \section{Certifications}
${certifications.filter(cert => cert.name).map((cert, index) => `
        ${index > 0 ? '\vspace{0.2 cm}\n' : ''}
        \begin{twocolentry}{
            ${cert.date}${cert.expiration ? ` - ${cert.expiration}` : ''}
        }
            \textbf{${cert.name.replace(/&/g, '\&').replace(/%/g, '\%')}}
            
            \textit{${cert.issuer.replace(/&/g, '\&').replace(/%/g, '\%')}}
        \end{twocolentry}
`).join('')}
` : ''}

\end{document}`;
};
