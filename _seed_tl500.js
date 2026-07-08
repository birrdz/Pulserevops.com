// _seed_tl500.js — build the Pulse Tools (tl) +500 sprint queue.
// 250 Top-10 software-category roundups ("The 10 Best <Category> in 2027") +
// 250 regular how-to Q&As, interleaved so a serial writer alternates kinds,
// deduped vs the live index (normalized title), ids from the current max tl id.
// Real software categories / real tool how-tos only — NO fabrication.
// Writes _tl_sprint_queue500.json. tl is now DUAL ('qa') in grade-entry.js:
//   Top-10 (>=8 numbered sections) grades electronicreview, else qa.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const norm = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// ---- 250+ real B2B software categories (RevOps / sales / marketing / CS / data /
// finance / ops / people / productivity). Each becomes a "The 10 Best <X> in 2027".
const CATEGORIES = [
  // Sales tech
  'CRM Platforms for Small Business', 'Enterprise CRM Platforms', 'Sales Engagement Platforms',
  'Sales Intelligence Tools', 'Conversation Intelligence Tools', 'Revenue Intelligence Platforms',
  'Sales Forecasting Tools', 'CPQ Software', 'Sales Proposal Software', 'Contract Management Tools',
  'E-Signature Tools', 'Sales Dialer Software', 'Sales Enablement Platforms', 'Sales Content Management Tools',
  'Sales Commission Software', 'Sales Territory Mapping Tools', 'Lead Routing Software', 'Meeting Scheduling Tools',
  'Corporate Gifting Platforms', 'Video Selling Tools', 'Sales Coaching Software', 'Deal Room Software',
  'Digital Sales Room Software', 'Account Planning Tools', 'Mutual Action Plan Tools', 'Sales Onboarding Software',
  'Buyer Intent Data Providers', 'Sales Email Tracking Tools', 'Cold Email Software', 'Sales Pipeline Management Tools',
  'Quote-to-Cash Software', 'Sales Gamification Software', 'Revenue Operations Platforms', 'Partner Relationship Management Software',
  'Channel Sales Software', 'Field Sales Apps', 'Inside Sales Software', 'B2B Prospecting Tools',
  // Marketing tech
  'Marketing Automation Platforms', 'Email Marketing Software', 'Account-Based Marketing Platforms', 'SEO Tools',
  'Content Marketing Platforms', 'Social Media Management Tools', 'Landing Page Builders', 'Webinar Platforms',
  'Digital Ad Management Tools', 'Marketing Attribution Software', 'Customer Data Platforms', 'Website Personalization Tools',
  'Influencer Marketing Platforms', 'Affiliate Marketing Software', 'Public Relations Software', 'Survey Software',
  'Form Builders', 'Pop-up and Lead Capture Tools', 'Push Notification Tools', 'SMS Marketing Platforms',
  'Marketing Analytics Tools', 'Brand Monitoring Tools', 'Competitive Intelligence Tools', 'Product Marketing Tools',
  'Demand Generation Platforms', 'Conversion Rate Optimization Tools', 'A/B Testing Tools', 'Heatmap and Session Recording Tools',
  'Digital Asset Management Software', 'Marketing Resource Management Tools', 'Event Marketing Platforms', 'Community Marketing Platforms',
  'Loyalty and Rewards Software', 'Referral Marketing Software', 'Video Marketing Platforms', 'Podcast Hosting Platforms',
  'Email Deliverability Tools', 'Local SEO Tools', 'Link Building Tools', 'Keyword Research Tools',
  // RevOps / data / analytics
  'Data Enrichment Tools', 'B2B Contact Database Providers', 'Reverse ETL Tools', 'ETL Tools',
  'Business Intelligence Platforms', 'Data Warehouse Platforms', 'Embedded Analytics Tools', 'Self-Service BI Tools',
  'Data Visualization Tools', 'No-Code Database Tools', 'iPaaS Integration Platforms', 'Workflow Automation Tools',
  'Data Quality Tools', 'Customer Data Cleansing Tools', 'Spreadsheet Automation Tools', 'Dashboard Software',
  'Product Analytics Tools', 'Web Analytics Tools', 'Data Catalog Tools', 'Data Observability Platforms',
  'Reverse IP Lookup Tools', 'Website Visitor Identification Tools', 'Data Pipeline Tools', 'Customer Journey Analytics Tools',
  'Predictive Analytics Platforms', 'Marketing Mix Modeling Tools', 'Revenue Reporting Tools', 'KPI Tracking Software',
  // Customer success / support
  'Customer Success Platforms', 'Help Desk Software', 'Live Chat Software', 'Knowledge Base Software',
  'Customer Feedback Tools', 'NPS Survey Tools', 'Customer Community Platforms', 'Customer Onboarding Software',
  'In-App Messaging Tools', 'Product Adoption Platforms', 'Customer Health Scoring Tools', 'Support Ticketing Systems',
  'Chatbot Builders', 'Call Center Software', 'Contact Center Software', 'Voice of the Customer Platforms',
  'Customer Portal Software', 'Self-Service Support Software', 'Customer Education Platforms', 'Renewal Management Software',
  // Finance / ops / billing
  'Subscription Billing Software', 'Revenue Recognition Software', 'Accounting Software for Startups', 'Accounts Payable Automation Tools',
  'Expense Management Software', 'Procurement Software', 'Spend Management Platforms', 'Contract Lifecycle Management Software',
  'Invoicing Software', 'Payment Processing Platforms', 'Financial Planning and Analysis Software', 'Cap Table Management Software',
  'Corporate Card Platforms', 'Vendor Management Software', 'SaaS Management Platforms', 'Usage-Based Billing Tools',
  'Tax Compliance Software', 'Treasury Management Software', 'Equity Management Software', 'Billing Reconciliation Tools',
  // People ops / HR
  'Applicant Tracking Systems', 'HRIS Platforms', 'Payroll Software', 'Performance Management Software',
  'OKR Software', 'Employee Engagement Platforms', 'Learning Management Systems', 'Recruiting Software',
  'Onboarding Software for New Hires', 'Time Tracking Software', 'PTO and Leave Management Software', 'Employee Recognition Platforms',
  'Background Check Software', 'Interview Scheduling Tools', 'Candidate Sourcing Tools', 'Compensation Management Software',
  'Workforce Planning Software', 'Employee Survey Tools', 'Internal Communication Tools', 'People Analytics Platforms',
  // Productivity / PM / collaboration
  'Project Management Software', 'Work Management Platforms', 'Team Collaboration Tools', 'Document Collaboration Tools',
  'Online Whiteboard Tools', 'Note-Taking Apps', 'Knowledge Management Software', 'Internal Wiki Software',
  'Password Managers', 'Screen Recording Tools', 'Async Video Messaging Tools', 'Calendar Scheduling Apps',
  'Task Management Apps', 'Time Blocking Apps', 'Meeting Notes Software', 'Diagramming Tools',
  'Form and Workflow Builders', 'Digital Adoption Platforms', 'Internal Tool Builders', 'Process Documentation Tools',
  'Resource Management Software', 'Gantt Chart Software', 'Kanban Board Tools', 'Mind Mapping Software',
  // Dev / IT / security adjacent (business-tool framing)
  'API Management Platforms', 'Single Sign-On Providers', 'Identity and Access Management Tools', 'IT Asset Management Software',
  'Endpoint Management Software', 'Status Page Tools', 'Incident Management Software', 'On-Call Scheduling Tools',
  'Internal Developer Portals', 'Feature Flag Tools', 'Application Monitoring Tools', 'Log Management Tools',
  'Uptime Monitoring Tools', 'Error Tracking Tools', 'Help Authoring Tools', 'Service Desk Software',
  // E-commerce / retail ops
  'E-Commerce Platforms', 'Headless Commerce Platforms', 'Subscription Commerce Tools', 'Product Information Management Software',
  'Order Management Systems', 'Inventory Management Software', 'Shipping Software', 'Returns Management Software',
  'Point of Sale Systems', 'Loyalty Program Software for Retail', 'Cart Abandonment Tools', 'Product Review Software',
  // Vertical / niche but real categories
  'Legal Practice Management Software', 'Medical Practice Management Software', 'Field Service Management Software', 'Construction Management Software',
  'Real Estate CRM Software', 'Nonprofit CRM Software', 'Restaurant Management Software', 'Fitness Studio Management Software',
  'Salon and Spa Booking Software', 'Property Management Software', 'Event Management Software', 'Donor Management Software',
  'Grant Management Software', 'Membership Management Software', 'Volunteer Management Software', 'Church Management Software',
  'Agency Management Software', 'Freelance Invoicing Tools', 'Client Portal Software', 'Proposal Software for Agencies',
  // AI-assisted business tools (kept business-ops, not infra)
  'AI Meeting Assistants', 'AI Note-Taking Tools', 'AI Writing Assistants for Business', 'AI Sales Email Generators',
  'AI Chatbots for Customer Service', 'AI Data Analysis Tools', 'AI Presentation Makers', 'AI Transcription Tools',
  'AI Scheduling Assistants', 'AI Knowledge Assistants', 'AI Voice Agents for Sales', 'AI Customer Support Tools',
  // More sales/marketing depth to reach 250+
  'Webinar Funnel Software', 'Quiz Funnel Software', 'Sales Battlecard Software', 'Competitive Win-Loss Tools',
  'Pricing Optimization Software', 'Discount Approval Workflow Tools', 'Renewal Forecasting Tools', 'Churn Prediction Software',
  'Customer Reference Management Software', 'Case Study Software', 'Testimonial Collection Tools', 'Review Generation Software',
  'Reputation Management Software', 'Listing Management Software', 'Appointment Reminder Software', 'Text Message Marketing Tools',
  'WhatsApp Business Tools', 'Conversational Marketing Platforms', 'Website Chat-to-Call Tools', 'Form Analytics Tools',
];

// ---- Regular how-to Q&As: curated standalone + sensible task x tool combos.
// Only pairings where the tool genuinely does the task. Evergreen how-tos (no year).
const STANDALONE = [
  'How do you migrate from one CRM to another without losing data?',
  'How do you clean up duplicate records in your CRM?',
  'How do you set up a lead scoring model from scratch?',
  'How do you build a sales pipeline report your CEO will actually read?',
  'How do you connect your CRM to your marketing automation platform?',
  'How do you choose between a marketing automation platform and a simple email tool?',
  'How do you measure ROI on a new sales tool before you buy it?',
  'How do you run a tech stack audit before adding new software?',
  'How do you consolidate an overlapping sales tech stack?',
  'How do you calculate the total cost of ownership for a SaaS tool?',
  'How do you write a business case to get budget for new software?',
  'How do you run a software vendor evaluation and shortlist?',
  'How do you negotiate a SaaS contract renewal?',
  'How do you avoid shelfware when rolling out a new tool?',
  'How do you drive adoption of a new CRM across a sales team?',
  'How do you set up role-based permissions in a CRM?',
  'How do you design a sales activity dashboard?',
  'How do you track multi-touch attribution without a data team?',
  'How do you set up closed-loop reporting between sales and marketing?',
  'How do you build a RevOps reporting layer on top of your CRM?',
  'How do you sync product usage data into your CRM?',
  'How do you set up territory and quota planning in a spreadsheet?',
  'How do you automate quote generation for a complex product?',
  'How do you set up a customer health score for the first time?',
  'How do you reduce SaaS spend during a budget freeze?',
  'How do you find and cancel unused SaaS subscriptions?',
  'How do you secure your sales tech stack against data leaks?',
  'How do you set up data enrichment to fill missing CRM fields?',
  'How do you keep your email domain out of spam when sending sequences?',
  'How do you warm up a new sending domain for cold email?',
  'How do you set up a meeting booking page that routes to the right rep?',
  'How do you integrate your calendar with your CRM for activity logging?',
  'How do you build a renewal forecast for a subscription business?',
  'How do you set up usage-based billing for a SaaS product?',
  'How do you choose a customer data platform for a mid-market company?',
  'How do you set up a no-code internal tool for your ops team?',
  'How do you automate a manual back-office process without engineering?',
  'How do you pick an iPaaS tool to connect your stack?',
  'How do you build a single source of truth for revenue data?',
  'How do you set up a reverse ETL pipeline from your warehouse to your CRM?',
];

// Task -> real tools that genuinely support it. Generates "How do you <task> in <tool>?"
const COMBOS = [
  ['build a forecast dashboard', ['BoostUp', 'Aviso', 'Salesforce', 'HubSpot', 'Pipedrive', 'Weflow']],
  ['set up lead routing', ['LeanData', 'Chili Piper', 'Distribution Engine', 'RingLead', 'HubSpot', 'Salesforce']],
  ['configure email sequences without burning your domain', ['Outreach', 'Salesloft', 'Apollo', 'HubSpot', 'Reply.io', 'Lemlist']],
  ['set up multi-touch attribution', ['HubSpot', 'Dreamdata', 'Bizible', 'Salesforce', 'Ruler Analytics']],
  ['build a deal scoring model', ['Gong', 'Clari', 'HubSpot', 'Salesforce', 'People.ai']],
  ['create a sales dashboard', ['Tableau', 'Power BI', 'Looker', 'HubSpot', 'Salesforce', 'Klipfolio']],
  ['set up call recording and coaching', ['Gong', 'Chorus', 'Salesloft', 'Avoma', 'Fathom']],
  ['enrich contact records', ['ZoomInfo', 'Clearbit', 'Apollo', 'Lusha', 'Cognism']],
  ['build a booking page', ['Calendly', 'Chili Piper', 'HubSpot', 'Cal.com', 'SavvyCal']],
  ['create automated workflows', ['Zapier', 'Make', 'Workato', 'HubSpot', 'n8n']],
  ['set up a knowledge base', ['Zendesk', 'Intercom', 'Notion', 'Document360', 'HelpScout']],
  ['build a customer health score', ['Gainsight', 'ChurnZero', 'Vitally', 'Catalyst', 'Planhat']],
  ['configure a chatbot', ['Intercom', 'Drift', 'Tidio', 'Ada', 'HubSpot']],
  ['set up subscription billing', ['Stripe Billing', 'Chargebee', 'Recurly', 'Zuora', 'Maxio']],
  ['create a quote with CPQ', ['Salesforce CPQ', 'DealHub', 'PandaDoc', 'Subskribe', 'Conga']],
  ['send a contract for e-signature', ['DocuSign', 'PandaDoc', 'Dropbox Sign', 'Adobe Acrobat Sign', 'Ironclad']],
  ['track sales commissions', ['CaptivateIQ', 'Spiff', 'QuotaPath', 'Everstage', 'Xactly']],
  ['build a marketing email campaign', ['Klaviyo', 'Mailchimp', 'HubSpot', 'Customer.io', 'Braze']],
  ['run an ABM campaign', ['6sense', 'Demandbase', 'Terminus', 'RollWorks', 'HubSpot']],
  ['set up product analytics', ['Amplitude', 'Mixpanel', 'PostHog', 'Heap', 'June']],
  ['identify anonymous website visitors', ['Clearbit', 'Leadfeeder', 'RB2B', 'Albacross', 'Vector']],
  ['build a landing page', ['Unbounce', 'Instapage', 'Webflow', 'HubSpot', 'Leadpages']],
  ['run an A/B test', ['Optimizely', 'VWO', 'Google Optimize alternatives', 'AB Tasty', 'Convert']],
  ['manage projects', ['Asana', 'Monday.com', 'ClickUp', 'Jira', 'Notion']],
  ['take AI meeting notes', ['Otter', 'Fathom', 'Fireflies', 'Avoma', 'tl;dv']],
  ['set up an NPS survey', ['Delighted', 'AskNicely', 'Qualtrics', 'SurveyMonkey', 'Retently']],
];

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const have = new Set(idx.entries.map(e => norm(e.question)));
  let maxTl = 0;
  for (const e of idx.entries) { const m = String(e.id).match(/^tl(\d+)$/); if (m) maxTl = Math.max(maxTl, +m[1]); }

  // Build candidate pools (overshoot, then cap to 250 each after dedupe).
  const top10cands = CATEGORIES.map(c => `The 10 Best ${c} in 2027`);
  const regCands = [...STANDALONE];
  for (const [task, tools] of COMBOS) for (const t of tools) regCands.push(`How do you ${task} in ${t}?`);

  const pick = (cands, want) => {
    const out = []; const seen = new Set();
    for (const t of cands) { const k = norm(t); if (have.has(k) || seen.has(k)) continue; seen.add(k); out.push(t); if (out.length >= want) break; }
    return out;
  };
  const top10 = pick(top10cands, 250);
  const regular = pick(regCands, 250);

  const items = [];
  let id = maxTl;
  const push = (title, kind) => { id++; items.push({ id: 'tl' + String(id).padStart(4, '0'), title, kind, prefix: 'tl' }); };
  const n = Math.max(top10.length, regular.length);
  for (let i = 0; i < n; i++) { if (top10[i]) push(top10[i], 'top10'); if (regular[i]) push(regular[i], 'regular'); }

  fs.writeFileSync('C:/Users/koryj/website/_tl_sprint_queue500.json', JSON.stringify(items, null, 1));
  console.log(`candidates: ${top10cands.length} top10, ${regCands.length} regular`);
  console.log(`queue: ${items.length} items (${top10.length} top10 + ${regular.length} regular) | ids ${items[0].id}..${items[items.length - 1].id} | maxTl was ${maxTl}`);
  if (top10.length < 250) console.log(`⚠️ only ${top10.length} top10 survived dedupe — widen CATEGORIES.`);
  if (regular.length < 250) console.log(`⚠️ only ${regular.length} regular survived dedupe — widen STANDALONE/COMBOS.`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
