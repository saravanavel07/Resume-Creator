import { SampleResume } from '../types';

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'sample-fresher-entry',
    title: 'Fresher / Entry-Level Graduate (Fresher Template)',
    role: 'Junior Analyst / Graduate Trainee',
    experienceLevel: 'Fresher / Entry Level',
    targetJD: 'Seeking an enthusiastic Graduate Associate to assist in data analysis, report preparation, client communication, cross-functional projects, MS Excel modeling, and team collaboration. Strong academic background and eagerness to learn required.',
    data: {
      contact: {
        fullName: 'Rohan Sharma',
        email: 'rohan.sharma@email.com',
        phone: '555-019-3829',
        location: 'New York, NY',
        linkedin: 'linkedin.com/in/rohansharma-grad',
        github: 'github.com/rohansharma',
        portfolio: 'rohansharma.me'
      },
      summary: 'High-achieving Finance & Business Analytics graduate (GPA 3.8/4.0) with strong foundations in financial modeling, Excel, Python, and data visualization. Demonstrated leadership through campus organizations and hands-on internship projects.',
      experience: [
        {
          id: 'exp-fresher-1',
          company: 'Apex Business Solutions',
          role: 'Data & Operations Intern',
          dates: 'May 2025 - Aug 2025',
          location: 'New York, NY',
          bullets: [
            'Analyzed weekly client sales performance data using Excel PivotTables and SQL queries across 15+ regional accounts.',
            'Automated monthly reporting workflows, reducing data entry time by 8 hours per week.',
            'Collaborated with senior consultants to draft 5 comprehensive market research decks presented to C-level stakeholders.'
          ]
        },
        {
          id: 'exp-fresher-2',
          company: 'University Student Council',
          role: 'Treasurer & Event Coordinator',
          dates: 'Aug 2024 - May 2025',
          location: 'New York, NY',
          bullets: [
            'Managed a $45,000 annual student organization budget, ensuring 100% compliance with university financial policies.',
            'Orchestrated annual career summit for 600+ student attendees with 18 corporate partner sponsors.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-fresher-1',
          institution: 'State University School of Business',
          degree: 'Bachelor of Science in Business Administration & Analytics',
          dates: '2021 - 2025',
          gpa: '3.8 / 4.0'
        }
      ],
      skills: {
        technical: ['Data Analysis', 'Financial Modeling', 'SQL', 'Python (Pandas)', 'Market Research'],
        soft: ['Problem Solving', 'Team Collaboration', 'Presentation Skills', 'Time Management'],
        tools: ['Microsoft Excel (Advanced)', 'Power BI', 'Google Analytics', 'Tableau', 'Canva']
      },
      projects: [
        {
          id: 'proj-fresher-1',
          name: 'Retail Customer Segmentation Study',
          technologies: 'Python, Excel, Tableau',
          link: 'github.com/rohansharma/retail-analytics',
          bullets: [
            'Clustered 10,000+ consumer records using Python K-Means algorithm to identify key demographic purchasing tiers.',
            'Designed an interactive Tableau dashboard showcasing customer retention trends.'
          ]
        }
      ],
      certifications: ['Bloomberg Market Concepts (BMC)', 'Google Data Analytics Certificate']
    }
  },

  {
    id: 'sample-healthcare-nurse',
    title: 'Healthcare & Nursing (Registered Nurse)',
    role: 'Registered Nurse (RN)',
    experienceLevel: 'Mid Level',
    targetJD: 'Seeking a compassionate Registered Nurse (RN) for ICU / Medical-Surgical unit. Requires BLS/ACLS certification, patient triage, electronic health records (EHR/Epic), patient care coordination, medication administration, and strict adherence to HIPAA standards.',
    data: {
      contact: {
        fullName: 'Sarah Jenkins, BSN, RN',
        email: 'sarah.jenkins.rn@healthmail.com',
        phone: '312-555-0148',
        location: 'Chicago, IL',
        linkedin: 'linkedin.com/in/sarahjenkins-rn',
        github: '',
        portfolio: ''
      },
      summary: 'Dedicated Registered Nurse with 5+ years of clinical experience in acute care and medical-surgical units. Expert in patient assessment, critical care triage, medication administration, and Epic EHR documentation. Maintain a 98% patient satisfaction score.',
      experience: [
        {
          id: 'exp-nurse-1',
          company: 'Northwestern Memorial Hospital',
          role: 'Staff Registered Nurse (Med-Surg / ICU)',
          dates: '2021 - Present',
          location: 'Chicago, IL',
          bullets: [
            'Delivered comprehensive direct care for 5–7 complex medical-surgical patients per shift in a 400-bed Magnet hospital.',
            'Administered IV medications, blood products, and wound care while maintaining zero medication administration error rate.',
            'Utilized Epic EHR system for meticulous patient charting and interdisciplinary care communication.',
            'Precepted and mentored 6 new graduate nurses, guiding them through clinical orientation and unit protocols.'
          ]
        },
        {
          id: 'exp-nurse-2',
          company: 'Mercy Medical Center',
          role: 'Staff Nurse',
          dates: '2019 - 2021',
          location: 'Chicago, IL',
          bullets: [
            'Monitored vital signs, performed diagnostic tests, and educated patients and families on post-discharge care plans.',
            'Collaborated with attending physicians and physical therapists to optimize individualized patient treatment plans.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-nurse-1',
          institution: 'Loyola University Chicago',
          degree: 'Bachelor of Science in Nursing (BSN)',
          dates: '2015 - 2019'
        }
      ],
      skills: {
        technical: ['Patient Triage', 'Medication Administration', 'IV Therapy', 'Patient Education', 'Wound Care', 'Vital Signs Monitoring'],
        soft: ['Empathy', 'Crisis Management', 'Interdisciplinary Communication', 'Attention to Detail'],
        tools: ['Epic EHR', 'Cerner', 'Pyxis MedStation', 'Telemetry Monitors']
      },
      projects: [],
      certifications: ['Registered Nurse (RN) - State of Illinois', 'Basic Life Support (BLS)', 'Advanced Cardiovascular Life Support (ACLS)']
    }
  },

  {
    id: 'sample-finance-analyst',
    title: 'Finance & Accounting (Financial Analyst)',
    role: 'Financial Analyst',
    experienceLevel: 'Mid Level',
    targetJD: 'Hiring a Financial Analyst to perform variance analysis, annual budgeting, forecasting, quarterly financial reporting, GAAP compliance, NPV/IRR modeling, and ERP financial software management (SAP / Oracle).',
    data: {
      contact: {
        fullName: 'David Miller, CFA',
        email: 'david.miller@financesolutions.com',
        phone: '212-555-8930',
        location: 'New York, NY',
        linkedin: 'linkedin.com/in/davidmiller-finance',
        github: '',
        portfolio: ''
      },
      summary: 'Results-driven Financial Analyst with 4+ years of experience in corporate FP&A, financial modeling, budget forecasting, and cost optimization. Successfully managed $80M operating budgets and identified $1.2M in annual operational cost savings.',
      experience: [
        {
          id: 'exp-fin-1',
          company: 'Global Capital Partners',
          role: 'Senior Financial Analyst',
          dates: '2022 - Present',
          location: 'New York, NY',
          bullets: [
            'Spearheaded annual corporate budget forecasting for $80M operational division across 4 regional business units.',
            'Engineered automated financial forecast models in Excel/VBA, improving quarterly revenue prediction accuracy by 14%.',
            'Conducted monthly P&L variance analysis and presented actionable recommendations to CFO and executive suite.',
            'Identified supplier contract redundancies, securing $1.2M in annual cost reductions.'
          ]
        },
        {
          id: 'exp-fin-2',
          company: 'Horizon Financial Advisory',
          role: 'Junior Analyst',
          dates: '2020 - 2022',
          location: 'New York, NY',
          bullets: [
            'Prepared monthly financial statement packages (Balance Sheet, Income Statement, Cash Flow) in compliance with GAAP.',
            'Evaluated capital expenditure proposals utilizing Discounted Cash Flow (DCF) and Net Present Value (NPV) metrics.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-fin-1',
          institution: 'New York University (Stern School of Business)',
          degree: 'Bachelor of Science in Finance',
          dates: '2016 - 2020'
        }
      ],
      skills: {
        technical: ['Financial Modeling', 'FP&A', 'P&L Management', 'Variance Analysis', 'GAAP Compliance', 'Valuation (DCF/NPV)'],
        soft: ['Strategic Thinking', 'Stakeholder Management', 'Analytical Problem Solving'],
        tools: ['SAP ERP', 'Oracle Hyperion', 'Advanced Excel (VBA/Macros)', 'Bloomberg Terminal', 'Power BI']
      },
      projects: [],
      certifications: ['Chartered Financial Analyst (CFA Level II)', 'Certified Management Accountant (CMA)']
    }
  },

  {
    id: 'sample-sales-ae',
    title: 'Sales & Business Development (Account Executive)',
    role: 'Senior Account Executive',
    experienceLevel: 'Experienced',
    targetJD: 'Seeking a high-performing B2B Account Executive to drive SaaS sales pipeline, conduct discovery calls, negotiate enterprise contracts, close $500k+ annual quota, manage CRM (Salesforce), and expand key customer accounts.',
    data: {
      contact: {
        fullName: 'Jessica Taylor',
        email: 'jessica.taylor@salesteam.com',
        phone: '415-555-0912',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/jessicataylorsales',
        github: '',
        portfolio: ''
      },
      summary: 'High-energy B2B Sales Executive with 6+ years of enterprise SaaS sales experience. Consistently exceeded annual revenue quotas (140% average quota attainment). Expert in consultative solution selling, pipeline management, and contract negotiation.',
      experience: [
        {
          id: 'exp-sales-1',
          company: 'SaaSify Enterprise Systems',
          role: 'Enterprise Account Executive',
          dates: '2022 - Present',
          location: 'San Francisco, CA',
          bullets: [
            'Generated $1.85M in ARR in 2024, achieving 148% of annual quota and earning Presidents Club recognition.',
            'Managed full sales cycle from cold outbound prospecting through executive demo and multi-year contract negotiation.',
            'Expanded key enterprise account from $40k to $250k ARR via strategic upsell and cross-sell campaigns.',
            'Maintained rigorous Salesforce CRM data accuracy and structured pipeline forecasting.'
          ]
        },
        {
          id: 'exp-sales-2',
          company: 'CloudTech Media',
          role: 'Account Executive',
          dates: '2019 - 2022',
          location: 'San Francisco, CA',
          bullets: [
            'Closed 45+ new business deals averaging $25k ACV across mid-market tech verticals.',
            'Partnered with Sales Engineers to deliver customized product demonstrations to C-level buyers.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-sales-1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Arts in Economics',
          dates: '2015 - 2019'
        }
      ],
      skills: {
        technical: ['B2B SaaS Sales', 'Enterprise Deal Closing', 'Pipeline Management', 'Contract Negotiation', 'Outbound Prospecting'],
        soft: ['Consultative Selling', 'Objection Handling', 'Relationship Building', 'Executive Presentation'],
        tools: ['Salesforce CRM', 'HubSpot Sales', 'Gong.io', 'LinkedIn Sales Navigator', 'Outreach.io']
      },
      projects: [],
      certifications: ['MEDDPICC Sales Methodology Certification', 'HubSpot Inbound Sales Certified']
    }
  },

  {
    id: 'sample-hr-talent',
    title: 'Human Resources & Recruiting (HR Generalist)',
    role: 'Human Resources Generalist',
    experienceLevel: 'Mid Level',
    targetJD: 'Looking for an HR Generalist to handle employee relations, full-cycle recruiting, onboarding, benefits administration, HRIS management (Workday/BambooHR), compliance, and employee engagement programs.',
    data: {
      contact: {
        fullName: 'Rachel Green, SHRM-CP',
        email: 'rachel.green@hrconnect.org',
        phone: '404-555-7821',
        location: 'Atlanta, GA',
        linkedin: 'linkedin.com/in/rachelgreen-hr',
        github: '',
        portfolio: ''
      },
      summary: 'Proactive Human Resources Generalist with 5+ years of experience managing full-cycle talent acquisition, employee onboarding, benefits, and HR compliance for a 350+ employee organization. Increased candidate retention by 22%.',
      experience: [
        {
          id: 'exp-hr-1',
          company: 'Vanguard Enterprise Group',
          role: 'Human Resources Generalist',
          dates: '2021 - Present',
          location: 'Atlanta, GA',
          bullets: [
            'Managed end-to-end recruitment lifecycle for 60+ open requisitions annually across Sales, Tech, and Operations teams.',
            'Overhauled employee onboarding program, reducing 90-day new hire turnover from 18% to 6%.',
            'Administered annual open enrollment for medical, dental, and 401(k) plans across 350+ nationwide employees.',
            'Maintained Workday HRIS database, ensuring 100% compliance with federal/state employment laws (FLSA, FMLA, EEOC).'
          ]
        },
        {
          id: 'exp-hr-2',
          company: 'Pinnacle Staffing Services',
          role: 'HR Coordinator',
          dates: '2019 - 2021',
          location: 'Atlanta, GA',
          bullets: [
            'Coordinated candidate interviews, conducted background checks, and issued official offer letters.',
            'Organized quarterly employee engagement events, resulting in a 15% increase in employee NPS survey scores.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-hr-1',
          institution: 'Georgia State University',
          degree: 'Bachelor of Business Administration in Human Resource Management',
          dates: '2015 - 2019'
        }
      ],
      skills: {
        technical: ['Talent Acquisition', 'Employee Relations', 'Onboarding & Offboarding', 'Benefits Administration', 'HR Compliance (FMLA/EEOC)'],
        soft: ['Conflict Resolution', 'Active Listening', 'Interpersonal Communication', 'Discretion'],
        tools: ['Workday HRIS', 'BambooHR', 'Greenhouse ATS', 'ADP Workforce Now', 'LinkedIn Recruiter']
      },
      projects: [],
      certifications: ['SHRM Certified Professional (SHRM-CP)', 'PHR - Professional in Human Resources']
    }
  },

  {
    id: 'sample-marketing-flawed',
    title: 'Marketing Specialist (Mid Level)',
    role: 'Marketing Specialist',
    experienceLevel: 'Mid Level',
    targetJD: 'Senior Growth Marketing Specialist needed to spearhead user acquisition, optimize campaign databases, execute email campaigns with HubSpot, drive 25%+ ROI, manage $50k/mo ad budgets, and lead A/B experiments with Google Analytics 4.',
    data: {
      contact: {
        fullName: 'Alex Vance',
        email: 'alex.vance@gmail.com',
        phone: '555-019-2834',
        location: 'Chicago, IL',
        linkedin: 'linkedin.com/in/alexvance',
        github: '',
        portfolio: 'alexvancemarketing.com'
      },
      summary: 'Results-driven Marketing Specialist with 4+ years of experience executing digital marketing campaigns, managing $50k monthly ad budgets, driving organic traffic growth, and optimizing lead generation conversion funnels.',
      experience: [
        {
          id: 'exp-1',
          company: 'Acme Digital Agency',
          role: 'Digital Marketing Specialist',
          dates: '2022 - Present',
          location: 'Chicago, IL',
          bullets: [
            'Managed digital marketing strategy and Google Ads campaigns, increasing qualified lead pipeline by 34%.',
            'Optimized organic SEO rankings for 20+ target keywords, driving a 45% increase in monthly website traffic.',
            'Executed automated email nurturing campaigns via HubSpot, generating 120+ monthly sales qualified leads (SQLs).',
            'Spearheaded A/B testing experiments on landing pages, boosting conversion rates from 2.1% to 3.8%.'
          ]
        },
        {
          id: 'exp-2',
          company: 'BrightBrand Media',
          role: 'Marketing Associate',
          dates: '2020 - 2022',
          location: 'Chicago, IL',
          bullets: [
            'Authored weekly blog posts and social media copy, building brand audience to 25k+ followers.',
            'Assisted senior marketers in daily marketing duties and campaign performance analysis.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of Illinois',
          degree: 'Bachelor of Science in Marketing & Communication',
          dates: '2016 - 2020'
        }
      ],
      skills: {
        technical: ['Digital Marketing', 'SEO', 'PPC Advertising', 'Email Marketing', 'A/B Testing', 'Content Strategy'],
        soft: ['Creative Thinking', 'Data-Driven Analysis', 'Cross-Functional Collaboration'],
        tools: ['HubSpot', 'Google Analytics 4', 'Google Ads', 'Mailchimp', 'Semrush', 'Canva']
      },
      projects: [],
      certifications: ['Google Ads Search Certification', 'HubSpot Inbound Marketing Certified']
    }
  },

  {
    id: 'sample-tech-swe',
    title: 'Senior Software Engineer (Tech Role)',
    role: 'Senior Software Engineer',
    experienceLevel: 'Senior Level',
    targetJD: 'Looking for a Senior Software Engineer with strong experience in React, TypeScript, Node.js, Express, PostgreSQL, Microservices, and Cloud infrastructure (AWS/Docker). Responsible for architecting scalable APIs and improving system latency by 20%+',
    data: {
      contact: {
        fullName: 'Marcus Sterling',
        email: 'marcus.sterling@devmail.io',
        phone: '415-892-1049',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/marcussterling',
        github: 'github.com/marcussterling',
        portfolio: 'marcussterling.dev'
      },
      summary: 'Full-Stack Software Engineer with 6+ years of expertise in TypeScript, React, Node.js, and cloud microservices. Engineered high-throughput backend APIs supporting 2M+ active daily users while reducing server latency by 35%.',
      experience: [
        {
          id: 'exp-swe-1',
          company: 'CloudScale Technologies',
          role: 'Senior Full Stack Engineer',
          dates: '2022 - Present',
          location: 'San Francisco, CA',
          bullets: [
            'Architected distributed microservices API with Node.js, Express, and PostgreSQL handling 50k requests/sec at 99.99% uptime.',
            'Optimized client-side React bundle sizes by 42% through code-splitting, tree-shaking, and lazy loading strategies.',
            'Spearheaded CI/CD automated pipeline with Docker and AWS ECS, reducing deployment cycle times from 4 hours to 12 minutes.',
            'Mentored 5 junior developers, conducting code reviews and enforcing unit testing coverage standards above 90%.'
          ]
        },
        {
          id: 'exp-swe-2',
          company: 'NexTech Solutions',
          role: 'Software Developer',
          dates: '2019 - 2022',
          location: 'Austin, TX',
          bullets: [
            'Developed key customer dashboard components in React and TypeScript, boosting user retention metrics by 18%.',
            'Integrated Stripe payment gateway and OAuth authentication for 100k+ subscriber platform.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-swe-1',
          institution: 'University of Texas at Austin',
          degree: 'Bachelor of Science in Computer Science',
          dates: '2015 - 2019'
        }
      ],
      skills: {
        technical: ['TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'GraphQL', 'Microservices'],
        soft: ['System Architecture', 'Agile Leadership', 'Problem Solving', 'Code Review'],
        tools: ['AWS', 'Docker', 'Git', 'Webpack', 'Vite', 'Jest']
      },
      projects: [
        {
          id: 'proj-1',
          name: 'Real-Time Telemetry Dashboard',
          technologies: 'React, WebSocket, Node.js, D3.js',
          link: 'github.com/marcussterling/telemetry-dash',
          bullets: [
            'Built live data visualization dashboard rendering 10,000 data points per second with sub-10ms frame rendering.'
          ]
        }
      ],
      certifications: ['AWS Certified Solutions Architect', 'Meta Professional React Engineer']
    }
  }
];
