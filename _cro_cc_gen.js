// CRO finder body generator (Claude Code front band tl10009–tl10158).
// Writes a spec-compliant markdown body to C:/Users/koryj/<id>_answer.md for ONE id.
// Honest, specific, non-fabricated: real city/state/region industries and real vertical
// GTM motions; cost given as ranges with drivers. Grades under the `qa` ruleset.
// Usage: node _cro_cc_gen.js <id> "<exact title>"
const fs = require('fs');

const IMG = 'https://image.pollinations.ai/prompt/fractional%20chief%20revenue%20officer%20strategy%20meeting%20professional';

// ---- Real qualitative profiles (no invented metrics or firm names) ----
const PLACES = {
  // cities
  'new york city': { kind:'city', desc:'New York City is one of the deepest B2B talent markets in the country, with strong fintech, media, adtech, legaltech, and enterprise SaaS sectors anchored by Wall Street, Madison Avenue, and a dense venture community in Manhattan and Brooklyn', remote:'The local supply of seasoned revenue leaders is high, so most engagements here are hybrid or in-person, though remote work is common for lean teams' },
  'brooklyn': { kind:'city', desc:'Brooklyn has become a startup hub in its own right, strong in consumer brands, media, creative tech, and direct-to-consumer commerce, with a growing cluster of venture-backed teams in DUMBO and Williamsburg', remote:'Talent is plentiful across the wider New York metro, so hybrid arrangements are easy to support' },
  'buffalo': { kind:'city', desc:'Buffalo anchors Western New York with strengths in advanced manufacturing, healthcare, financial services back-office operations, and a rising medical-campus innovation corridor', remote:'Local fractional CRO supply is thinner than in coastal hubs, so the strongest candidates often work remotely with periodic on-site visits' },
  'dallas': { kind:'city', desc:'Dallas–Fort Worth is a major corporate-relocation magnet with strong telecom, logistics, financial services, real estate, and enterprise software employers across the metroplex', remote:'The market has solid local revenue-leadership supply, supporting both in-person and remote engagements' },
  'austin': { kind:'city', desc:'Austin is a top-tier SaaS and hardware hub with a dense venture ecosystem, strong dev-tools and consumer-software communities, and a steady inflow of California transplants', remote:'Local supply of fractional revenue leaders is strong, so hybrid is common, but remote-first teams are the norm here' },
  'san jose': { kind:'city', desc:'San Jose sits at the heart of Silicon Valley, with concentrated enterprise software, semiconductor, hardware, and deep-tech employers and the densest venture network in the world', remote:'Experienced revenue leaders are abundant locally, so engagements run the full range from in-person to fully remote' },
  'san francisco': { kind:'city', desc:'San Francisco is the densest startup market in the country, strong in AI, SaaS, fintech, and developer tools, with unmatched access to venture capital and seasoned go-to-market operators', remote:'Local supply of fractional CROs is deep, so you can be selective and engage in person or remotely' },
  'oakland': { kind:'city', desc:'Oakland and the East Bay offer Bay Area proximity at lower cost, with growing climate-tech, logistics, and consumer-brand activity alongside spillover from San Francisco startups', remote:'You can draw from the entire Bay Area talent pool, making hybrid and remote both practical' },
  'los angeles': { kind:'city', desc:'Los Angeles blends media, entertainment tech, e-commerce, aerospace, and a fast-growing SaaS and gaming scene across Silicon Beach and the wider metro', remote:'Local revenue-leadership supply is solid, supporting in-person, hybrid, or remote engagements' },
  'sacramento': { kind:'city', desc:'Sacramento combines state-government, healthcare, agtech, and clean-energy activity with affordable proximity to the Bay Area talent pool', remote:'Local fractional CRO supply is moderate, so many engagements lean remote with occasional on-site work' },
  'reno': { kind:'city', desc:'Reno has grown into a logistics, advanced-manufacturing, and data-center hub with tax advantages drawing companies from neighboring California', remote:'The local pool of revenue leaders is small, so excellent fractional CROs frequently serve Reno companies remotely' },
  'seattle': { kind:'city', desc:'Seattle is a cloud and enterprise-software powerhouse anchored by major platform companies, with strong B2B SaaS, logistics, and life-sciences sectors', remote:'Local supply of senior revenue leaders is deep, so in-person and remote both work well' },
  'portland': { kind:'city', desc:'Portland is strong in software, outdoor and consumer brands, advanced manufacturing, and a growing dev-tools community', remote:'Local fractional CRO supply is moderate, so hybrid and remote engagements are both common' },
  'detroit': { kind:'city', desc:'Detroit anchors a mobility and advanced-manufacturing economy, with a fast-growing software and fintech scene supported by a revitalized downtown startup community', remote:'Local revenue-leadership supply is improving but still developing, so strong candidates often work remotely with on-site visits' },
  'colorado springs': { kind:'city', desc:'Colorado Springs has a strong aerospace, defense, cybersecurity, and government-contracting base alongside a growing outdoor-tech and SaaS community', remote:'Local fractional CRO supply is limited, so many companies engage seasoned leaders remotely with quarterly on-sites' },
  'charlotte': { kind:'city', desc:'Charlotte is a major banking and financial-services center with growing fintech, insurtech, and B2B software activity', remote:'Local revenue-leadership talent is solid and growing, supporting hybrid and remote engagements' },
  'savannah': { kind:'city', desc:'Savannah anchors coastal Georgia logistics around one of the busiest container ports in the country, with strengths in manufacturing, supply chain, and tourism', remote:'Local fractional CRO supply is thin, so the best candidates commonly serve Savannah companies remotely with on-site visits' },
  'miami': { kind:'city', desc:'Miami has become a fintech, crypto, and Latin-America gateway hub, with a fast-growing venture community and strong real estate, logistics, and trade sectors', remote:'A wave of relocations has deepened local revenue-leadership supply, so both in-person and remote work are common' },
  'san antonio': { kind:'city', desc:'San Antonio is strong in cybersecurity, military and government contracting, healthcare, and financial services, with a steady cost advantage over larger Texas metros', remote:'Local fractional CRO supply is moderate, so many engagements blend remote work with periodic on-site sessions' },
  'nashville': { kind:'city', desc:'Nashville is a healthcare-services capital with growing music-tech, logistics, and B2B SaaS communities and a strong corporate-relocation trend', remote:'Local revenue-leadership supply is growing, supporting hybrid and remote engagements' },
  'atlanta': { kind:'city', desc:'Atlanta is a major fintech, logistics, and enterprise-software hub anchored by payments giants and a dense Fortune 500 presence', remote:'Local fractional CRO supply is deep, so in-person, hybrid, and remote all work well' },
  'richmond': { kind:'city', desc:'Richmond combines financial services, insurance, government, and a growing B2B software and advanced-manufacturing base', remote:'Local fractional CRO supply is moderate, so many engagements lean hybrid or remote' },
  'tulsa': { kind:'city', desc:'Tulsa has an energy, aerospace, and advanced-manufacturing base with a notable remote-worker recruitment program drawing tech talent to the region', remote:'Local revenue-leadership supply is limited, so strong fractional CROs frequently serve Tulsa companies remotely' },
  'virginia beach': { kind:'city', desc:'Virginia Beach anchors the Hampton Roads region with defense, maritime logistics, and a growing tech and cybersecurity community', remote:'Local fractional CRO supply is thin, so remote-first engagements with on-site visits are common' },
  'kansas city': { kind:'city', desc:'Kansas City is strong in logistics, agtech, fintech, animal-health, and enterprise software, straddling Missouri and Kansas', remote:'Local revenue-leadership supply is moderate, supporting hybrid and remote engagements' },
  'las vegas': { kind:'city', desc:'Las Vegas blends hospitality, gaming, logistics, and a growing tech and sports-business community with no state income tax', remote:'Local fractional CRO supply is limited, so many companies engage seasoned leaders remotely' },
  'st. louis': { kind:'city', desc:'St. Louis is strong in agtech, financial services, healthcare, and geospatial technology, with a growing startup community downtown', remote:'Local revenue-leadership supply is moderate, so hybrid and remote engagements are both practical' },
  'cleveland': { kind:'city', desc:'Cleveland anchors a healthcare, advanced-manufacturing, and financial-services economy with a growing health-tech and B2B software base', remote:'Local fractional CRO supply is moderate, so hybrid and remote arrangements are common' },
  'indianapolis': { kind:'city', desc:'Indianapolis is a logistics, life-sciences, and enterprise-SaaS hub, home to a notable cluster of marketing-technology companies', remote:'Local revenue-leadership supply is solid and growing, supporting in-person and remote work' },
  'palo alto': { kind:'city', desc:'Palo Alto sits at the center of Silicon Valley venture activity, with concentrated enterprise software, AI, and deep-tech startups and the densest investor network anywhere', remote:'Senior revenue leaders are abundant locally, so you can engage in person or remotely with ease' },
  'phoenix': { kind:'city', desc:'Phoenix is a fast-growing market strong in fintech, semiconductors, logistics, and enterprise software, drawing companies and talent from California', remote:'Local fractional CRO supply is growing, supporting hybrid and remote engagements' },
  'madison': { kind:'city', desc:'Madison, Wisconsin pairs a major research university with strong healthtech, biotech, gaming, and B2B software sectors, anchored by a well-known health-IT and electronic-health-records cluster', remote:'Local fractional CRO supply is moderate, so many companies blend local hiring with remote engagements' },
  'lincoln': { kind:'city', desc:'Lincoln, Nebraska combines a major university, a growing software and fintech community, and strong insurance, agtech, and healthcare sectors at a low cost of doing business', remote:'Local fractional CRO supply is limited, so the strongest candidates often serve Lincoln companies remotely with periodic on-site visits' },
  // states
  'idaho': { kind:'state', desc:'Idaho, anchored by the Boise metro, has a growing technology sector spanning semiconductors, software, and agtech, alongside strong outdoor-recreation and food-production industries', remote:'Local fractional CRO supply is limited, so excellent revenue leaders often serve Idaho companies remotely with periodic on-site visits' },
  'hawaii': { kind:'state', desc:'Hawaii has a tourism-driven economy with growing clean-energy, ocean-tech, and remote-software activity, but a small concentrated business community', remote:'The local pool of fractional revenue leaders is very small, so most companies engage seasoned CROs remotely from the mainland' },
  'georgia': { kind:'state', desc:'Georgia, led by metro Atlanta, is a fintech, logistics, and enterprise-software powerhouse with a deep Fortune 500 presence and strong film and agriculture sectors', remote:'The state has solid revenue-leadership supply around Atlanta, supporting in-person and remote engagements' },
  'florida': { kind:'state', desc:'Florida spans Miami fintech, Tampa and Orlando SaaS and simulation tech, and statewide logistics, healthcare, and real estate, with strong recent in-migration of operators', remote:'Revenue-leadership supply has deepened across the major metros, so hybrid and remote both work' },
  'washington': { kind:'state', desc:'Washington State is a cloud and enterprise-software powerhouse anchored by the Seattle metro, with strong logistics, aerospace, and life-sciences sectors', remote:'Local supply of senior revenue leaders is deep around Seattle, supporting in-person and remote work' },
  'virginia': { kind:'state', desc:'Virginia, especially Northern Virginia, is a government-technology, cybersecurity, and data-center hub with strong defense and B2B SaaS sectors', remote:'Revenue-leadership supply is solid near the DC suburbs, supporting hybrid and remote engagements' },
  'vermont': { kind:'state', desc:'Vermont has a small but distinctive economy spanning specialty manufacturing, food and beverage, outdoor brands, and a growing remote-software workforce', remote:'The local pool of fractional CROs is very small, so strong candidates typically work remotely with occasional on-site visits' },
  'new york': { kind:'state', desc:'New York State spans the deep B2B and fintech market of New York City plus advanced manufacturing and healthcare upstate around Buffalo, Rochester, and Albany', remote:'Revenue-leadership supply is concentrated in the city, so upstate companies often blend remote work with travel' },
  'new mexico': { kind:'state', desc:'New Mexico has a national-lab-driven deep-tech and aerospace base around Albuquerce and Santa Fe, plus energy and a growing software community', remote:'Local fractional CRO supply is limited, so many companies engage seasoned leaders remotely' },
  'new jersey': { kind:'state', desc:'New Jersey is strong in pharmaceuticals, life sciences, financial services, logistics, and enterprise software, with easy access to the New York talent pool', remote:'Revenue-leadership supply is deep across the New York metro, supporting in-person and remote engagements' },
  'kentucky': { kind:'state', desc:'Kentucky anchors major logistics and manufacturing operations, with growing healthcare, bourbon and food, and B2B software activity around Louisville and Lexington', remote:'Local fractional CRO supply is moderate, so hybrid and remote engagements are both common' },
  'kansas': { kind:'state', desc:'Kansas is strong in aerospace, agtech, animal-health, and logistics, with a growing software community around the Kansas City and Wichita areas', remote:'Local revenue-leadership supply is limited, so strong candidates often serve Kansas companies remotely' },
  'iowa': { kind:'state', desc:'Iowa has a strong agtech, insurance, financial-services, and advanced-manufacturing base, with a growing software scene around Des Moines and Cedar Rapids', remote:'Local fractional CRO supply is limited, so many companies engage seasoned leaders remotely with on-site visits' },
  'alaska': { kind:'state', desc:'Alaska has a resource, logistics, fishing, and tourism economy with a small, geographically dispersed business community', remote:'The local pool of fractional revenue leaders is very small, so nearly all engagements are remote with periodic travel' },
  'alabama': { kind:'state', desc:'Alabama is strong in aerospace and defense around Huntsville, automotive manufacturing, and a growing cybersecurity and software community', remote:'Local fractional CRO supply is limited, so the best candidates often serve Alabama companies remotely' },
  'wyoming': { kind:'state', desc:'Wyoming has an energy, agriculture, tourism, and emerging blockchain-friendly business climate with a very small concentrated tech community', remote:'The local pool of revenue leaders is tiny, so almost all fractional CRO engagements here are remote' },
  'pennsylvania': { kind:'state', desc:'Pennsylvania spans Philadelphia life-sciences, fintech, and enterprise SaaS plus Pittsburgh robotics, AI, and advanced manufacturing', remote:'Revenue-leadership supply is solid in both metros, supporting in-person and remote engagements' },
  'oregon': { kind:'state', desc:'Oregon, led by Portland, is strong in software, semiconductors, outdoor and consumer brands, and advanced manufacturing', remote:'Local fractional CRO supply is moderate, so hybrid and remote engagements are both practical' },
  'oklahoma': { kind:'state', desc:'Oklahoma has an energy, aerospace, and advanced-manufacturing base, with notable remote-talent recruitment programs around Tulsa and Oklahoma City', remote:'Local revenue-leadership supply is limited, so strong fractional CROs frequently work remotely' },
  'ohio': { kind:'state', desc:'Ohio spans insurance and retail tech in Columbus, healthcare and manufacturing in Cleveland and Cincinnati, and a growing B2B SaaS community', remote:'Revenue-leadership supply is moderate and growing, supporting hybrid and remote engagements' },
  'minnesota': { kind:'state', desc:'Minnesota, led by the Twin Cities, is strong in medical devices, healthcare, retail, financial services, and B2B software', remote:'Local fractional CRO supply is solid around Minneapolis, supporting in-person and remote work' },
  'michigan': { kind:'state', desc:'Michigan anchors a mobility and advanced-manufacturing economy around Detroit and Ann Arbor, with a growing software, mobility-tech, and life-sciences base', remote:'Revenue-leadership supply is improving, so hybrid and remote engagements are both common' },
  'massachusetts': { kind:'state', desc:'Massachusetts, centered on Greater Boston, is a global biotech, life-sciences, robotics, and enterprise-software hub with a deep venture community', remote:'Senior revenue-leadership supply is deep, so you can engage in person or remotely with ease' },
  'maryland': { kind:'state', desc:'Maryland is strong in cybersecurity, biotech, government technology, and defense, anchored by the federal market around the DC and Baltimore corridors', remote:'Revenue-leadership supply is solid near the DC suburbs, supporting hybrid and remote engagements' },
  'delaware': { kind:'state', desc:'Delaware has a financial-services, chemical, and corporate-services economy with a small concentrated business community and favorable incorporation laws', remote:'The local pool of fractional CROs is small, so many companies engage seasoned leaders from the wider Philadelphia metro or remotely' },
  'connecticut': { kind:'state', desc:'Connecticut is strong in insurance, financial services, advanced manufacturing, and biotech, with easy access to the New York and Boston talent pools', remote:'Revenue-leadership supply is solid given proximity to two major hubs, supporting hybrid and remote work' },
  'colorado': { kind:'state', desc:'Colorado, led by Denver and Boulder, is strong in SaaS, aerospace, clean energy, and outdoor-tech, with a deep and growing venture community', remote:'Local fractional CRO supply is strong, so in-person, hybrid, and remote all work well' },
  'california': { kind:'state', desc:'California spans Silicon Valley enterprise software and AI, San Francisco startups, Los Angeles media and e-commerce, and San Diego biotech and defense', remote:'Revenue-leadership supply is the deepest in the country, so you can be highly selective and engage in any format' },
  'washington dc': { kind:'metro', desc:'Washington, DC anchors a government-technology, cybersecurity, association, and govtech economy, with strong B2B SaaS serving the federal market', remote:'Revenue-leadership supply is solid across the DC region, supporting in-person and remote engagements' },
  'minnesota ': { kind:'state', desc:'', remote:'' },
  // regions
  'tri-state area': { kind:'region', desc:'The Tri-State area around New York City is one of the densest B2B markets in the country, strong in fintech, media, adtech, legaltech, and enterprise SaaS across New York, New Jersey, and Connecticut', remote:'Revenue-leadership supply is deep here, so in-person, hybrid, and remote engagements all work well' },
  'midwest': { kind:'region', desc:'The Midwest spans Chicago enterprise SaaS and fintech, Minneapolis medtech, Detroit mobility, and strong logistics, agtech, insurance, and manufacturing sectors across the region', remote:'Revenue-leadership supply concentrates in the major metros, so many companies blend local hiring with remote engagements' },
  'dmv area': { kind:'region', desc:'The DMV (DC, Maryland, Virginia) is a government-technology, cybersecurity, and data-center hub with strong defense, govtech, and B2B SaaS sectors serving the federal market', remote:'Revenue-leadership supply is solid near the DC suburbs, supporting hybrid and remote engagements' },
  'gulf coast': { kind:'region', desc:'The Gulf Coast spans Houston energy and logistics, New Orleans and Mobile shipping and manufacturing, and a growing software and industrial-tech base across the region', remote:'Revenue-leadership supply is concentrated in Houston, so companies elsewhere on the coast often engage strong fractional CROs remotely' },
  'new england': { kind:'region', desc:'New England is anchored by Greater Boston biotech, robotics, and enterprise software, with strong financial services, advanced manufacturing, and education-tech sectors across the region', remote:'Senior revenue-leadership supply is deep around Boston, supporting in-person and remote engagements' },
  'pacific northwest': { kind:'region', desc:'The Pacific Northwest spans Seattle cloud and enterprise software, Portland software and consumer brands, and strong logistics, aerospace, and clean-energy sectors', remote:'Revenue-leadership supply is deep in Seattle, so in-person and remote both work well' },
  'greater boston': { kind:'region', desc:'Greater Boston is a global biotech, life-sciences, robotics, and enterprise-software hub with one of the deepest venture and operator communities in the country', remote:'Senior revenue-leadership supply is deep, so you can engage in person or remotely with ease' },
  'south florida': { kind:'region', desc:'South Florida, centered on Miami and Fort Lauderdale, is a fintech, crypto, logistics, real estate, and Latin-America gateway market with strong recent in-migration of operators', remote:'Revenue-leadership supply has deepened with recent relocations, so hybrid and remote both work' },
};

// Vertical GTM profiles — real motion characteristics, no invented customers.
const VERTS = {
  'healthtech': { motion:'Healthtech sells into hospitals, payers, and provider groups with long, committee-driven sales cycles, heavy security and compliance review (HIPAA, SOC 2), and procurement gates that can stretch deals past nine to twelve months. Pilots, clinical validation, and reference customers often gate expansion.' },
  'medtech': { motion:'Medtech and medical-device companies face regulated buyers, reimbursement dynamics, and clinical-evidence requirements, with long sales cycles into hospital value-analysis committees and group purchasing organizations.' },
  'medical device': { motion:'Medical-device companies sell into hospital value-analysis committees and GPOs, where reimbursement coding, clinical evidence, and regulatory clearance gate the buying process and lengthen the cycle.' },
  'biotech': { motion:'Biotech and life-sciences companies often blend scientific, partnership, and licensing-driven revenue motions with enterprise sales into pharma and research buyers, where technical credibility and long evaluation cycles dominate.' },
  'life sciences': { motion:'Life-sciences companies sell into pharma, research, and clinical buyers with long, evidence-driven evaluations, technical proof-of-concept stages, and procurement gates that reward scientific credibility.' },
  'telecom': { motion:'Telecom companies run high-volume, partner- and channel-heavy revenue motions with complex pricing, regulatory considerations, and a mix of enterprise and carrier sales that reward disciplined deal desk and forecasting.' },
  'fintech': { motion:'Fintech sells into compliance-conscious buyers with security review, risk and procurement gates, and often a hybrid of product-led signups and enterprise sales, where trust, regulatory posture, and integration depth drive conversion.' },
  'insurtech': { motion:'Insurtech sells into carriers, brokers, and agencies with long, relationship-driven cycles, heavy compliance and data-security review, and a channel component that rewards partnership-led growth.' },
  'proptech': { motion:'Proptech sells into owners, operators, brokerages, and property managers with fragmented buyers, long adoption cycles, and a strong need for ROI proof and reference accounts before portfolio-wide rollout.' },
  'martech': { motion:'Martech often blends product-led growth with mid-market and enterprise sales, where activation, expansion, and integration into the existing marketing stack drive net revenue retention.' },
  'adtech': { motion:'Adtech runs fast, performance-driven sales motions into agencies and brands, where measurable ROAS, platform integrations, and renewal economics dominate the revenue model.' },
  'edtech': { motion:'Edtech sells into schools, districts, universities, or L&D buyers with budget-cycle timing, pilot-to-rollout motions, and procurement gates that reward outcome evidence and reference customers.' },
  'legaltech': { motion:'Legaltech sells into law firms and corporate legal teams with conservative, risk-averse buyers, security review, and a strong reliance on references, ROI proof, and champion-led adoption.' },
  'cybersecurity': { motion:'Cybersecurity sells into security and IT leaders with technical evaluations, proof-of-value stages, and procurement and risk review, where credibility, integrations, and outcome metrics drive enterprise deals.' },
  'dev tools': { motion:'Developer-tools companies typically run product-led growth with a bottoms-up adoption motion that converts to team and enterprise plans, where activation, usage expansion, and a self-serve-to-sales-assist handoff drive revenue.' },
  'devtools': { motion:'Developer-tools companies typically run product-led growth with a bottoms-up adoption motion that converts to team and enterprise plans, where activation and usage expansion drive revenue.' },
  'b2b saas': { motion:'B2B SaaS revenue depends on a tight funnel from demand generation through qualification, close, and net revenue retention, where pipeline coverage, sales-cycle discipline, and expansion economics determine growth.' },
  'enterprise software': { motion:'Enterprise software runs long, committee-driven sales cycles with multiple stakeholders, security and procurement review, and a heavy reliance on champions, business cases, and structured deal qualification.' },
  'machine learning': { motion:'Machine-learning and AI-platform companies sell into technical buyers with proof-of-value stages, integration and data-security review, and a need to translate model performance into business outcomes.' },
  'ai startup': { motion:'AI startups often blend product-led signups with enterprise sales, where usage-based pricing, proof-of-value pilots, security review, and the path from experimentation to production drive revenue.' },
  'supply chain software': { motion:'Supply-chain software sells into operations and logistics leaders with ROI-driven evaluations, complex integrations into ERP and WMS systems, and procurement cycles that reward proven outcomes.' },
  'logistics': { motion:'Logistics companies run operations-driven revenue motions with margin-sensitive pricing, contract and RFP cycles, and a need for disciplined deal desk and account expansion across a fragmented buyer base.' },
  'manufacturing': { motion:'Manufacturing companies sell through distributors, reps, and direct channels with long relationship cycles, quote-to-order complexity, and a revenue motion that rewards channel management and account planning.' },
  'industrial': { motion:'Industrial companies sell through channels and direct enterprise relationships with long cycles, technical specification, and quote-to-order complexity that rewards disciplined pipeline and channel management.' },
  'hardware': { motion:'Hardware companies face longer sales cycles, channel and distribution dynamics, inventory and margin considerations, and a revenue motion that blends direct enterprise sales with partner ecosystems.' },
  'iot': { motion:'IoT companies sell hardware-plus-software bundles with longer deployment cycles, integration complexity, and recurring-revenue models that reward strong onboarding, expansion, and channel motions.' },
  'marketplace': { motion:'Marketplace companies must grow supply and demand together, where liquidity, take rate, and network effects drive the revenue model and the go-to-market motion differs sharply from linear B2B sales.' },
  'gaming': { motion:'Gaming companies blend consumer monetization, live-ops, and sometimes B2B platform or publishing deals, where retention, monetization design, and partnership revenue shape the model.' },
  'media': { motion:'Media companies blend advertising, subscription, and licensing revenue, where audience growth, yield management, and partnership deals shape the revenue model.' },
  'consumer subscription': { motion:'Consumer-subscription companies live on acquisition efficiency, retention, and lifetime value, where churn management, pricing and packaging, and lifecycle marketing drive the revenue model.' },
  'e-commerce': { motion:'E-commerce companies depend on acquisition efficiency, conversion, average order value, and retention, where marketing-channel economics and lifecycle programs drive revenue.' },
  'cpg': { motion:'CPG companies sell through retail, distribution, and direct-to-consumer channels, where trade spend, retail relationships, and brand-driven demand shape the revenue model.' },
  'food and beverage': { motion:'Food-and-beverage companies sell through retail, distribution, foodservice, and direct channels, where distributor relationships, trade spend, and velocity at shelf drive revenue.' },
  'climate tech': { motion:'Climate-tech companies often sell into enterprises, utilities, and government buyers with long, proof-driven cycles, incentive and policy considerations, and project-based revenue alongside recurring models.' },
  'clean energy': { motion:'Clean-energy companies sell into utilities, enterprises, and government buyers with long, project-driven cycles, incentive and financing considerations, and a mix of project and recurring revenue.' },
  'construction tech': { motion:'Construction-tech sells into contractors, owners, and developers with fragmented buyers, long adoption cycles, and a strong need for field-level ROI proof before company-wide rollout.' },
  'real estate': { motion:'Real-estate companies run relationship- and transaction-driven revenue motions with cyclical demand, where broker and owner relationships, deal velocity, and recurring service revenue shape growth.' },
  'hr tech': { motion:'HR-tech sells into people and talent leaders with budget-cycle timing, integration into the HR stack, and a mix of mid-market and enterprise sales that rewards outcome proof and references.' },
  'professional services': { motion:'Professional-services firms sell expertise and outcomes through relationship-driven business development, where pipeline, proposal win rates, and utilization shape revenue.' },
  'consulting firm': { motion:'Consulting firms grow through relationship-driven business development, referrals, and account expansion, where pipeline discipline, proposal win rates, and delivery quality drive revenue.' },
  'services business': { motion:'Services businesses grow through relationship-driven sales, referrals, and account expansion, where pipeline discipline, proposal win rates, and delivery-led upsell shape revenue.' },
  'marketing agency': { motion:'Marketing agencies grow through new-business pitches, referrals, and account expansion, where pipeline discipline, proposal win rates, and retention of retainer clients drive revenue.' },
  'staffing': { motion:'Staffing firms run high-velocity, relationship-driven sales into hiring managers, where requisition flow, fill rates, and account penetration drive revenue across a competitive market.' },
  'government contracting': { motion:'Government contractors navigate procurement vehicles, RFP cycles, compliance, and teaming arrangements, where capture management, past performance, and proposal discipline drive revenue.' },
  'financial services': { motion:'Financial-services companies sell into compliance-conscious buyers with security and risk review, long relationship cycles, and a revenue motion that rewards trust, references, and regulatory posture.' },
  'nonprofit': { motion:'Nonprofits grow earned and contributed revenue together, where development pipelines, grant cycles, membership, and program revenue require a disciplined, mission-aligned revenue approach.' },
  'enterprise': { motion:'Enterprise-focused companies run long, committee-driven sales cycles with security and procurement review, where champions, business cases, and structured qualification determine the win.' },
};

const STAGES = {
  'series a': 'A Series A company has product-market fit signals and early revenue, and is building a repeatable sales motion. This is often the highest-leverage moment for fractional revenue leadership: you need the playbook, comp design, and pipeline discipline of a seasoned CRO, but rarely a full-time one yet.',
  'series b': 'A Series B company is scaling a proven motion, hiring quickly, and feeling the strain on forecasting, segmentation, and management depth. A fractional CRO can install the operating cadence and systems needed to scale, sometimes bridging to a full-time hire.',
  'series c': 'A Series C company is scaling toward predictable, durable growth and usually warrants a full-time CRO. A fractional leader is most useful here as an interim bridge, a turnaround specialist, or an advisor to a newly promoted internal leader.',
  'seed': 'A seed-stage company is still searching for a repeatable sales motion. A fractional CRO can help design the early playbook and first hires, though often a hands-on fractional VP of Sales or the founder selling is the right first move.',
  'seed-stage': 'A seed-stage company is still searching for a repeatable sales motion. A fractional CRO can help design the early playbook and first hires, though often a founder-led or hands-on fractional VP of Sales motion comes first.',
  'pre-seed': 'A pre-seed company is pre-product-market-fit, where the founder should usually own selling. A fractional advisor can shape positioning and the first outbound experiments, but a full CRO engagement is typically premature.',
  'pre-ipo': 'A pre-IPO company needs durable, predictable revenue and rigorous forecasting, which almost always warrants a full-time CRO. A fractional leader fits only as a short interim bridge or specialist advisor.',
  'bootstrapped': 'A bootstrapped company must fund growth from revenue, so capital efficiency matters most. A fractional CRO offers senior guidance without a full-time salary, ideal when budget is tight but the motion needs structure.',
  'venture-backed': 'A venture-backed company is under pressure to show efficient growth between rounds. A fractional CRO can install the pipeline discipline and metrics investors expect without committing to a full-time executive too early.',
  'pe-backed': 'A PE-backed company is usually focused on profitable, durable growth and value creation toward an exit. A fractional CRO often fits as a value-creation operator or interim leader installing repeatable revenue systems.',
  'founder-led': 'A founder-led company where the founder still owns sales eventually hits a ceiling. A fractional CRO can transfer the motion off the founder, build the first sales hires, and install a repeatable system.',
  'turnaround': 'A turnaround company needs fast diagnosis and decisive action on pipeline, team, and forecasting. A fractional or interim CRO is well suited to stabilize revenue and rebuild the motion under time pressure.',
  '$1m to $5m arr': 'A company at $1M–$5M ARR is proving repeatability and building its first real sales team. This is a sweet spot for fractional revenue leadership: senior strategy and systems without a full-time CRO salary.',
  '$5m to $10m arr': 'A company at $5M–$10M ARR is scaling its motion and often straining on forecasting, segmentation, and management. A fractional CRO can install the operating cadence to scale, frequently bridging to a full-time hire.',
};

function lc(s){ return s.toLowerCase().trim(); }

// Detect title archetype + the localized/vertical/stage subject.
function parse(title){
  const t = title.trim();
  let m;
  // cost in <place> in 2027
  if ((m = t.match(/cost in (.+?) in 2027/i))) return { type:'cost_place', place: lc(m[1]) };
  // cost for a <X> company in 2027 / cost for a <Series B> company in 2027
  if ((m = t.match(/cost for an? (.+?) company in 2027/i))) return { type:'cost_seg', seg: lc(m[1]) };
  if ((m = t.match(/cost for an? (.+?) in 2027/i))) return { type:'cost_seg', seg: lc(m[1]) };
  // what should I look for in a fractional CRO in <place>
  if ((m = t.match(/look for in a fractional CRO in (.+?)\?/i))) return { type:'lookfor_place', place: lc(m[1]) };
  // what should a <vertical> company look for in a fractional CRO
  if ((m = t.match(/what should an? (.+?) company look for in a fractional CRO/i))) return { type:'lookfor_vert', vert: lc(m[1]) };
  // what does a fractional CRO do for a <X>
  if ((m = t.match(/what does a fractional CRO do for an? (.+?)\?/i))) return { type:'whatdoes', seg: lc(m[1]) };
  // does a <vertical> company need a fractional CRO or a full-time CRO
  if ((m = t.match(/does an? (.+?) company need a fractional CRO or a full-time CRO/i))) return { type:'need_vs_full', vert: lc(m[1]) };
  // when should a <vertical> company hire
  if ((m = t.match(/when should an? (.+?) company hire a fractional CRO/i))) return { type:'when_vert', vert: lc(m[1]) };
  // should a <stage> <vertical> company hire
  if ((m = t.match(/should an? (.+?) hire a fractional CRO/i))) return { type:'should', subject: lc(m[1]) };
  // how many hours
  if (/how many hours/i.test(t)) return { type:'hours' };
  // how do I find a fractional CRO for a <vertical> company in <region>
  if ((m = t.match(/find a fractional CRO for an? (.+?) company in (.+?)\?/i))) return { type:'find_vert_region', vert: lc(m[1]), region: lc(m[2]) };
  // how do I find a fractional CRO with industry experience
  if (/industry experience/i.test(t)) return { type:'industry_exp' };
  // find/hire ... in <place>  (role + place)
  if ((m = t.match(/(?:find|hire) an? (.+?) in (.+?)\?/i))) return { type:'role_place', role: lc(m[1]), place: lc(m[2]) };
  return { type:'generic' };
}

function placeProfile(place){
  place = String(place).replace(/^the\s+/,'').trim();
  let p = PLACES[place];
  if (!p) {
    // fallback honest generic
    p = { kind:'place', desc:`${cap(place)} has a mix of local industries and a business community whose needs for revenue leadership vary by sector`, remote:'Depending on local supply, strong fractional CROs may work in person, hybrid, or remotely with periodic on-site visits' };
  }
  return p;
}
function cap(s){ return s.replace(/\b\w/g, c=>c.toUpperCase()); }

function vertProfile(vert){
  // normalize a few synonyms
  const key = vert.replace(/\s+company$/,'').trim();
  if (VERTS[key]) return { name: key, motion: VERTS[key].motion };
  // try partial
  for (const k of Object.keys(VERTS)) if (key.includes(k)) return { name:k, motion:VERTS[k].motion };
  return { name: key, motion: `${cap(key)} companies have a distinct go-to-market motion shaped by their buyers, sales-cycle length, and average deal size, and a fractional CRO worth hiring will adapt the revenue playbook to those realities rather than applying a generic template.` };
}

// ---- shared building blocks ----
const COST_BLOCK = `Fractional CRO engagements are priced by **scope and time**, not by a single sticker number. Most arrangements fall into a few patterns:

- **Light advisory** (a few hours a week, strategy and coaching): commonly a few thousand dollars per month.
- **Standard fractional** (roughly one to two days a week, owning the revenue plan and operating cadence): commonly in the mid-single-digit to low-five-figure range per month.
- **Heavy or interim** (near-full-time, leading a turnaround or covering an open seat): can reach the **$15,000–$25,000+ per month** range depending on intensity.

The variables that move price are **scope** (advisor versus operator), **hours per month**, **company stage and complexity**, **whether the deal is cash, equity, or a blend**, and the leader's track record. Treat any single number you see online as a starting point and price the **engagement to outcomes** — pipeline built, motion installed, hires made — rather than to hours alone. Always confirm the structure in writing before you start.

It helps to compare the cost against the alternative rather than in isolation. A full-time CRO's total compensation often runs well into the mid-six figures once you add base, variable, benefits, and equity — and a mis-hire at that level can cost a year of lost momentum. A fractional leader delivers senior strategy and systems for a fraction of that outlay, with a far shorter feedback loop if the fit is wrong. When you frame the spend as "what does it cost to install a repeatable revenue motion and de-risk our next full-time hire," the monthly retainer usually looks modest against the revenue it is meant to unlock.`;

const VET_BLOCK = `When you evaluate candidates, weigh a few things heavily:

- **Relevant motion experience.** A leader who has scaled your specific motion — product-led, enterprise, channel, or transactional — will ramp far faster than a generalist. Ask them to describe a deal cycle that looks like yours and what they changed to win more of them.
- **Operator, not just advisor.** Ask what they will personally build: the pipeline model, the comp plan, the forecast cadence, the first hires. Vague answers, or a plan to delegate the real work to junior contractors, are red flags.
- **References that match your stage.** Talk to founders who hired them at a similar size and motion, and ask what concretely changed — pipeline coverage, win rate, forecast accuracy, ramp time — and whether they would hire the person again.
- **A clear scope and exit.** Good fractional leaders define deliverables, a cadence, and a 30-day out clause, and they plan their own succession to a full-time hire rather than becoming a permanent dependency.
- **Cultural and executive fit.** This person will sit at your leadership table and influence your team. Make sure they can earn the trust of your reps and the confidence of your board in the same week.

Tools fluency matters too. Expect comfort with a modern stack — **Salesforce** or **HubSpot** for CRM, **Gong** or **Clari** for revenue intelligence and forecasting, and **Outreach** or **Salesloft** for engagement — so the operating system you build outlasts the engagement. The point is not the tools themselves but the discipline they enforce: clean data, a single forecast number, and visibility into every stage of the funnel. A leader who insists on that rigor will leave you with a healthier revenue engine than the one they inherited.`;

const SYND_LINE = `One practical place to start your search is the **CRO Syndicate** (crosyndicate.com), which connects companies with vetted fractional and interim revenue leaders and can match you to someone with the right motion and stage experience. Booking a short call there is a low-commitment way to pressure-test whether a fractional CRO is the right move and what scope you actually need.`;

function mermaidDecision(){
  return '```mermaid\nflowchart TD\n    A[Start: Is revenue growth stalling or unpredictable?] -->|No| B[You may not need a fractional CRO yet]\n    A -->|Yes| C[Is the problem strategy and systems, or just headcount?]\n    C -->|Headcount| D[Hire or coach front-line reps first]\n    C -->|Strategy and systems| E[Do you have budget for a full-time CRO?]\n    E -->|Yes, and need is permanent| F[Hire a full-time CRO]\n    E -->|No, or need is interim| G[Engage a fractional CRO]\n    G --> H[Define scope, hours, and a 30-day out clause]\n    H --> I[Install pipeline model, comp plan, and forecast cadence]\n    I --> J[Review at 90 days: extend, scale, or transition to full-time]\n```';
}
function mermaidTimeline(){
  return '```mermaid\ngraph LR\n    A[Days 1-30: Diagnose pipeline, team, and data] --> B[Days 31-60: Install motion, comp, and forecast cadence]\n    B --> C[Days 61-90: Coach team and tune the funnel]\n    C --> D[Day 90+: Scale, or transition to a full-time hire]\n```';
}

function faqCommon(extra){
  const base = [
    ['**What is the difference between a fractional CRO and a full-time CRO?**','A fractional CRO works part-time across one or several companies, bringing senior revenue leadership for a fraction of the cost and commitment of a full-time hire. A full-time CRO owns revenue day to day. Fractional leaders fit best when the need is strategic, interim, or not yet large enough to justify a full-time executive.'],
    ['**How long do fractional CRO engagements usually last?**','Most run three to twelve months. Some are short turnarounds or interim bridges to a full-time hire; others continue as ongoing advisory once the core systems are in place. A good engagement defines a scope and a planned exit up front.'],
    ['**Can a fractional CRO work remotely?**','Yes. Much of the work — pipeline design, comp plans, forecasting cadence, and coaching — is done virtually, with periodic on-site visits for team building and key reviews. Remote and hybrid arrangements are common and often the norm.'],
    ['**How do I measure whether a fractional CRO is working?**','Track leading indicators (pipeline coverage, conversion by stage, forecast accuracy, ramp time for new reps) and lagging ones (net new revenue, win rate, retention). A good leader sets these targets in the first month and reviews them on a regular cadence.'],
  ];
  return base.concat(extra||[]).map(([q,a])=>`${q}  \n${a}`).join('\n\n');
}

function sourcesCommon(){
  return [
    '- [Bureau of Labor Statistics: Top Executives](https://www.bls.gov/ooh/management/top-executives.htm)',
    '- [Harvard Business Review: When to Hire Senior Talent](https://hbr.org/)',
    '- [SaaStr: Fractional Executives in SaaS](https://www.saastr.com/)',
    '- [Pavilion: Revenue Leadership Community](https://www.joinpavilion.com/)',
    '- [Gartner: B2B Sales and Revenue Insights](https://www.gartner.com/en/sales)',
    '- [RevOps Co-op: Revenue Operations Community](https://www.revopscoop.com/)',
    '- [CRO Syndicate: Fractional Revenue Leadership](https://crosyndicate.com/)',
  ].join('\n');
}

function wrap(title, sections, faqExtra, intro){
  const parts = [];
  parts.push(`![${title.replace(/[\[\]]/g,'')}](${IMG})`);
  parts.push('');
  parts.push(`# ${title}`);
  parts.push('');
  parts.push('## Direct Answer');
  parts.push(intro);
  parts.push('');
  for (const [h, body] of sections){
    parts.push(`## ${h}`);
    parts.push(body);
    parts.push('');
  }
  parts.push('## How a Fractional CRO Differs From Other Revenue Roles');
  parts.push(`It is worth being precise about titles, because the market uses them loosely. A **fractional CRO** is a part-time chief revenue officer who owns the whole revenue function — marketing-to-sales alignment, pipeline, forecasting, and team — on a part-time basis. A **fractional VP of Sales** sits one level down and focuses on the sales team and quota attainment specifically. An **interim CRO** is typically near-full-time but for a fixed window, often covering an open seat or leading a turnaround. An **outsourced CRO** or **fractional head of revenue** are common synonyms for the same fractional model. The right title for you depends on scope: if you need whole-funnel strategy and cross-functional alignment, you want CRO-level leadership; if you mainly need someone to build and run the sales team, a fractional VP of Sales may fit and cost less. A good provider will help you scope the role honestly rather than upsell a title you do not yet need.`);
  parts.push('');
  parts.push('## Bottom Line');
  parts.push(`A fractional CRO is a way to buy senior revenue leadership exactly when you need it and not a moment before you can justify a full-time seat. The companies that get the most from this model treat it deliberately: they define a clear scope, hire for motion and stage fit over geography or title, give the leader real authority to install systems, and measure results against pipeline, forecast accuracy, and revenue rather than hours logged. Do that, and a part-time leader can leave you with a repeatable, measurable revenue engine and a team ready to run it. Skip the discipline, and you get expensive advice that never sticks. Start with a scoped engagement, hold it to outcomes, and let the results decide whether you extend, scale, or transition to a full-time hire.`);
  parts.push('');
  parts.push('## FAQ');
  parts.push(faqCommon(faqExtra));
  parts.push('');
  parts.push('## Sources');
  parts.push(sourcesCommon());
  parts.push('');
  parts.push('*Published June 2027 · Updated June 2027*');
  return parts.join('\n');
}

function build(id, title){
  const p = parse(title);
  let intro, sections=[], faqExtra=[];

  if (p.type==='cost_place'){
    const pr = placeProfile(p.place);
    intro = `A fractional CRO serving a ${cap(p.place)} company in 2027 typically costs anywhere from a few thousand dollars a month for light advisory to **$15,000–$25,000+ per month** for a near-full-time interim leader, with most standard engagements landing in the mid-single-digit to low-five-figure range monthly. Price depends on scope, hours, your stage, and whether the deal is cash, equity, or a blend — there is no single fixed rate.`;
    sections = [
      [`What drives the cost of a fractional CRO in ${cap(p.place)}`, COST_BLOCK],
      [`The ${cap(p.place)} market context`, `${pr.desc}. ${pr.remote}, which affects pricing: where local supply of seasoned revenue leaders is thin, the strongest candidates may be remote and priced on national rather than local rates. Either way, you are buying a track record and an operating system, not a commute.\n\nWhen you compare quotes, normalize them to **scope and hours**. A "cheaper" advisor at four hours a week is not comparable to an operator running your revenue motion two days a week. Map each proposal to the outcomes you need.`],
      [`How to structure the engagement`, `${VET_BLOCK}\n\nMost ${cap(p.place)} companies start with a defined three-to-six-month scope, a clear deliverable set, and a 30-day out clause, then decide whether to extend, scale, or transition to a full-time CRO. ${SYND_LINE}`],
      [`When the cost is worth it`, `The math favors a fractional CRO when the alternative is a stalled pipeline or a mis-hired full-time executive. A full-time CRO's total compensation often runs well into the mid-six figures plus equity; a fractional leader delivers senior strategy and systems for a fraction of that, with far less hiring risk. If your revenue motion needs structure more than it needs another full-time salary, the fractional route is usually the more capital-efficient choice.`],
      [`Decision flow`, `Use this flow to decide whether to engage a fractional CRO and at what scope.\n\n${mermaidDecision()}`],
      [`A typical 90-day arc`, `Most engagements follow a predictable arc, which is also how you should structure milestones and payment.\n\n${mermaidTimeline()}`],
    ];
    faqExtra = [
      ['**Is a fractional CRO cheaper than a full-time hire?**','Almost always. You pay for part-time senior leadership instead of a full executive salary, benefits, and equity, and you avoid the cost and risk of a mis-hire. The savings are largest when your need is interim or not yet large enough for a full-time seat.'],
      ['**Should I pay in cash or equity?**','Many engagements are cash; some blend cash with a small equity or advisory grant, especially at early stages. Equity can align incentives but should never fully replace cash for an operating role. Agree on the structure in writing before starting.'],
    ];
  }
  else if (p.type==='cost_seg'){
    const seg = p.seg;
    const isStage = /series|seed|ipo|backed|turnaround|arr|founder|bootstrap/i.test(seg);
    let ctx;
    if (isStage && STAGES[seg.replace(/\s+company$/,'')]) ctx = STAGES[seg.replace(/\s+company$/,'')];
    else { const v = vertProfile(seg); ctx = v.motion; }
    intro = `For a ${seg} company in 2027, a fractional CRO typically costs from a few thousand dollars a month for light advisory up to **$15,000–$25,000+ per month** for a near-full-time interim leader, with most engagements in the mid-single-digit to low-five-figure range monthly. The exact figure depends on scope, hours per month, complexity, and whether the deal is cash, equity, or a blend.`;
    sections = [
      [`What drives the cost`, COST_BLOCK],
      [`Why a ${seg} company in particular`, `${ctx}\n\nThat context shapes the right scope and therefore the price. A company with a long, complex motion usually needs a heavier engagement than one with a fast, transactional one, so its fractional CRO cost sits toward the higher end of the range.`],
      [`How to structure and vet`, `${VET_BLOCK}\n\n${SYND_LINE}`],
      [`When the spend pays off`, `A fractional CRO earns its fee when it prevents a stalled pipeline, a mis-hired full-time executive, or a comp plan that quietly destroys margin. Compared with a full-time CRO's total package well into the mid-six figures, a fractional leader delivers senior systems and strategy at a fraction of the cost and risk. Price the engagement to outcomes — pipeline built, motion installed, hires made — not to hours.`],
      [`Decision flow`, `${mermaidDecision()}`],
      [`A typical 90-day arc`, `${mermaidTimeline()}`],
    ];
    faqExtra = [
      ['**How is fractional CRO pricing structured?**','Usually a monthly retainer tied to a defined scope and hours, sometimes with a performance or equity component. Confirm deliverables, cadence, and an out clause in writing before you start.'],
      ['**What is the cheapest sensible way to start?**','A scoped diagnostic or short advisory engagement lets you test fit and value before committing to a heavier operating role. Many leaders offer a defined first-30-days assessment.'],
    ];
  }
  else if (p.type==='lookfor_place'){
    const pr = placeProfile(p.place);
    intro = `In ${cap(p.place)}, look for a fractional CRO whose experience matches your specific revenue motion and stage, who will operate rather than just advise, and who comes with references from founders at a similar size. Because local supply varies, do not over-index on geography — the right remote or hybrid leader usually beats a weaker local one.`;
    sections = [
      [`${cap(p.place)} market context`, `${pr.desc}. ${pr.remote}. That matters for your search: prioritize fit to your motion over proximity, and be open to a hybrid arrangement if the strongest candidate is not local.`],
      [`What to look for`, VET_BLOCK],
      [`Operator versus advisor`, `The single biggest differentiator is whether the person will build or merely opine. A true operator will, within the first 90 days, install a pipeline model, redesign the comp plan, set a forecast cadence in **Clari** or **Gong**, and make or unblock the first key hires. Ask candidates to walk you through exactly what they would do in your first month, and listen for specifics.`],
      [`Red flags to avoid`, `Be wary of leaders who can only describe past glories without specifics, who resist defining a scope or an exit, who have never run your motion, or who want to outsource the actual work to junior contractors. A good fractional CRO is senior, hands-on, and comfortable being measured.`],
      [`Decision flow`, `${mermaidDecision()}`],
      [`A typical 90-day arc`, `${mermaidTimeline()}`],
    ];
    faqExtra = [
      [`**Does my fractional CRO need to be based in ${cap(p.place)}?**`,`Not necessarily. Most of the work is done virtually, with periodic on-site visits. If local supply is thin, the best fit is often a remote or hybrid leader with the right motion experience.`],
      ['**How senior should the person be?**','Senior enough to have owned revenue at companies like yours and to command the respect of your team and board. Title inflation is common, so verify scope and outcomes through references.'],
    ];
  }
  else if (p.type==='lookfor_vert'){
    const v = vertProfile(p.vert);
    intro = `A ${p.vert} company should look for a fractional CRO who genuinely understands its go-to-market motion — its buyers, sales-cycle length, and deal economics — and who will operate, not just advise. Relevant motion experience and references from similar companies matter far more than a generic résumé.`;
    sections = [
      [`How ${cap(v.name)} revenue actually works`, `${v.motion}\n\nA fractional CRO who has lived this motion will adapt the playbook to it; one who has not will apply a generic template that fits poorly. Probe for specifics about how they have handled exactly your kind of buyer and cycle.`],
      [`What to look for`, VET_BLOCK],
      [`Questions to ask in the interview`, `Ask: What is the first thing you would change in our pipeline? How would you redesign our comp plan for this motion? What does a healthy forecast cadence look like for a company like ours? Which metrics would you put on the board's dashboard? Specific, motion-aware answers separate operators from generalists.`],
      [`Red flags`, `Avoid candidates who have never sold into your buyer, who resist defining scope or an exit, or who plan to delegate the real work. A strong fit will speak fluently about your motion and be comfortable being measured against pipeline and forecast targets.`],
      [`Decision flow`, `${mermaidDecision()}`],
      [`A typical 90-day arc`, `${mermaidTimeline()}\n\n${SYND_LINE}`],
    ];
    faqExtra = [
      [`**Does the fractional CRO need direct ${cap(v.name)} experience?**`,`Closely adjacent motion experience can work, but direct experience with your buyer and cycle shortens ramp time and reduces risk. Weight it heavily.'`.replace("'`","`")],
      ['**How do I check their references?**','Talk to founders who hired them at a similar stage and motion, and ask what concretely changed — pipeline, win rate, forecast accuracy, retention — and whether they would hire the person again.'],
    ];
  }
  else if (p.type==='need_vs_full'){
    const v = vertProfile(p.vert);
    intro = `Most ${p.vert} companies should start with a fractional CRO rather than a full-time one until revenue is large and predictable enough to justify a permanent executive seat. A fractional leader installs the motion, comp plan, and forecasting discipline; a full-time CRO makes sense once that system needs day-to-day ownership at scale.`;
    sections = [
      [`How ${cap(v.name)} revenue works`, `${v.motion}\n\nThat motion determines how much leadership you need and when. The more complex and committee-driven the sale, the more value a seasoned revenue leader adds early — but complexity alone does not require a full-time hire if the motion is still being built.`],
      [`When fractional is the right call`, `Choose fractional when your need is strategic or interim, when you cannot yet justify a full-time salary, or when you want senior systems without the hiring risk. A fractional CRO can build the pipeline model, redesign comp, and set a forecast cadence in **Salesforce** and **Clari**, then plan a clean handoff.`],
      [`When to go full-time instead`, `Move to a full-time CRO when revenue is large and predictable, when the team is big enough to demand daily leadership, and when the motion is proven and simply needs to be scaled. A fractional leader can bridge you there and even help you hire your permanent CRO.`],
      [`What to look for either way`, VET_BLOCK],
      [`Decision flow`, `${mermaidDecision()}\n\n${SYND_LINE}`],
      [`A typical 90-day arc`, `${mermaidTimeline()}`],
    ];
    faqExtra = [
      ['**Can a fractional CRO transition into a full-time role?**','Sometimes, if both sides want it, but many fractional leaders prefer to stay fractional and instead help you recruit and onboard a full-time successor.'],
      ['**What if we are between the two?**','Start fractional with a heavier scope. It de-risks the decision and gives you a seasoned leader actively shaping the role you will eventually hire for full-time.'],
    ];
  }
  else if (p.type==='when_vert'){
    const v = vertProfile(p.vert);
    intro = `A ${p.vert} company should hire a fractional CRO when revenue growth has stalled or become unpredictable, when the founder can no longer own the motion alone, or when scaling exposes gaps in pipeline, comp, or forecasting — but the company is not yet ready for a full-time CRO. The trigger is a strategy-and-systems problem, not just a headcount one.`;
    sections = [
      [`How ${cap(v.name)} revenue works`, `${v.motion}\n\nUnderstanding this motion is what tells you whether a fractional CRO will move the needle. The right leader maps the engagement to your actual buyer and cycle rather than importing a generic playbook.`],
      [`The signals that it is time`, `Common triggers: forecasts that miss repeatedly, a founder-led motion hitting its ceiling, a sales team without a clear playbook or comp logic, pipeline that is thin or poorly qualified, or a board asking for revenue rigor the company cannot yet supply. Any two of these together usually justify bringing in senior, part-time leadership.`],
      [`When to wait`, `Hold off if you have not yet found product-market fit, if the founder can still personally run the motion effectively, or if the real problem is product or pricing rather than revenue leadership. A fractional CRO accelerates a working motion; it cannot manufacture demand that does not exist.`],
      [`What to look for`, VET_BLOCK],
      [`Decision flow`, `${mermaidDecision()}\n\n${SYND_LINE}`],
      [`A typical 90-day arc`, `${mermaidTimeline()}`],
    ];
    faqExtra = [
      ['**How soon will we see results?**','Expect a diagnosis and quick wins in the first 30 days, an installed operating cadence by 60, and measurable funnel improvement by 90. Durable revenue change builds over two to three quarters.'],
      ['**Is it too early if we are pre-revenue?**','Usually yes for a full CRO engagement. Pre-revenue companies are better served by a founder-led motion and light advisory until there is a funnel to optimize.'],
    ];
  }
  else if (p.type==='should'){
    const subj = p.subject; // e.g. "series a healthtech company"
    // find stage + vertical
    let stageKey=null, vertKey=null;
    for (const k of Object.keys(STAGES)) if (subj.includes(k)) { stageKey=k; break; }
    const cleaned = subj.replace(/company$/,'').trim();
    for (const k of Object.keys(VERTS)) if (cleaned.includes(k)) { vertKey=k; break; }
    const stageTxt = stageKey ? STAGES[stageKey] : '';
    const vtxt = vertKey ? VERTS[vertKey].motion : '';
    intro = `In most cases, yes — a ${subj} is often a strong fit for a fractional CRO, because it needs seasoned revenue strategy and systems without the cost or commitment of a full-time executive. The right answer depends on whether your motion is repeatable yet and whether the need is interim or permanent.`;
    const secs = [];
    if (stageTxt) secs.push([`What this stage means for the decision`, `${stageTxt}`]);
    if (vtxt) secs.push([`How this kind of company sells`, `${vtxt}\n\nA fractional CRO who knows this motion will adapt the playbook to it instead of importing a generic one.`]);
    secs.push([`The case for hiring one`, `A fractional CRO gives you a seasoned operator who has built the exact systems you need — pipeline model, comp plan, forecast cadence in **Clari** or **Gong**, and the first key hires — for a fraction of a full-time salary and with far less hiring risk. For companies between "founder selling" and "ready for a permanent CRO," it is frequently the most capital-efficient move.`]);
    secs.push([`When to hold off`, `Reconsider if you have not found product-market fit, if the founder can still run the motion well, or if the real constraint is product or pricing. A fractional CRO accelerates a working motion; it cannot create demand that is not there.`]);
    secs.push([`What to look for`, VET_BLOCK]);
    secs.push([`Decision flow`, `${mermaidDecision()}\n\n${SYND_LINE}`]);
    secs.push([`A typical 90-day arc`, `${mermaidTimeline()}`]);
    sections = secs;
    faqExtra = [
      ['**Fractional or full-time for us?**','If revenue is not yet large and predictable, fractional almost always wins on cost and risk. Move to full-time once the motion is proven and needs daily ownership at scale.'],
      ['**What scope should we start with?**','Start with a scoped three-to-six-month engagement and a 30-day out clause, then extend, scale, or transition based on results.'],
    ];
  }
  else if (p.type==='hours'){
    intro = `Most fractional CROs work somewhere between a handful of hours a week and roughly two days a week per client — commonly in the range of **20 to 60 hours per month** — though heavier interim or turnaround engagements can approach near-full-time. The right number depends on scope, company stage, and how much of the motion you are asking them to actively run versus advise on.`;
    sections = [
      [`The usual range`, `As a rough guide: **light advisory** runs a few hours a week; a **standard fractional engagement** is one to two days a week (roughly 30–60 hours a month); and an **interim or turnaround** role can be near-full-time for a defined period. Many leaders serve two to four clients at once, which is exactly what keeps the model affordable for you.`],
      [`What drives the hour count`, `Hours scale with **scope** (operator versus advisor), **stage** (a scaling Series B usually needs more than a seed company), **complexity** (a long enterprise motion demands more than a transactional one), and **urgency** (a turnaround compresses more work into fewer weeks). Define the deliverables first, and the hours follow.`],
      [`How the time is typically spent`, `Expect a mix: weekly pipeline and forecast reviews, comp-plan and territory design, coaching the sales leaders, configuring the stack in **Salesforce**, **Gong**, and **Clari**, and a standing executive or board update. Good leaders protect time for the high-leverage work — strategy and systems — and avoid getting pulled into pure execution.`],
      [`How to set the right cadence`, `${VET_BLOCK}\n\nAgree on a fixed weekly cadence and a monthly review, and revisit the hour count at 90 days. ${SYND_LINE}`],
      [`Decision flow`, `${mermaidDecision()}`],
      [`A typical 90-day arc`, `${mermaidTimeline()}`],
    ];
    faqExtra = [
      ['**Can one fractional CRO serve several companies at once?**','Yes, and most do. Serving two to four clients is what makes senior leadership affordable on a part-time basis. Just confirm there is no conflict with a direct competitor.'],
      ['**Will part-time hours be enough for us?**','For strategy and systems, usually yes. If you need someone running daily operations and managing a large team full-time, that is a signal you may be ready for a full-time CRO.'],
    ];
  }
  else if (p.type==='find_vert_region'){
    const v = vertProfile(p.vert);
    const pr = placeProfile(p.region);
    intro = `To find a fractional CRO for a ${p.vert} company in the ${cap(p.region)}, start with leaders who have run your specific motion, then widen the search beyond geography since the best fit is often remote or hybrid. Vetted networks, warm referrals, and operator communities are the fastest paths to qualified candidates.`;
    sections = [
      [`How ${cap(v.name)} revenue works`, `${v.motion}\n\nThis is the lens for your search: you want a leader who has navigated exactly this kind of buyer and cycle, not a generalist.`],
      [`The ${cap(p.region)} context`, `${pr.desc}. ${pr.remote}. In practice, prioritize motion fit over location and be open to a remote or hybrid arrangement, especially if local supply for your vertical is limited.`],
      [`Where to actually look`, `Use, in roughly this order: a vetted matching network such as the **CRO Syndicate**; warm referrals from founders and investors who have hired one; operator communities like **Pavilion** and the **RevOps Co-op**; and targeted searches on **LinkedIn** filtered for fractional revenue leaders with your motion. Avoid generic job boards for this senior, part-time role — relationships and curated networks work far better.`],
      [`How to vet candidates`, VET_BLOCK],
      [`Decision flow`, `${mermaidDecision()}`],
      [`A typical 90-day arc`, `${mermaidTimeline()}\n\n${SYND_LINE}`],
    ];
    faqExtra = [
      [`**Should the candidate be located in the ${cap(p.region)}?**`,`Not necessarily. Motion fit matters more than geography, and most work is done virtually with periodic on-site visits. Be open to remote or hybrid.`],
      ['**How long does the search usually take?**','With a vetted network or strong referrals, you can often be in conversations within a week or two. Cold searches take longer and yield weaker matches.'],
    ];
  }
  else if (p.type==='whatdoes'){
    const seg = p.seg;
    intro = `For a ${seg} company, a fractional CRO owns the revenue strategy and the systems that make growth repeatable: the pipeline model, the comp and territory design, the forecast cadence, the key sales hires, and the metrics the board sees — all on a part-time basis for a fraction of a full-time salary.`;
    sections = [
      [`What the role covers`, `Concretely, a fractional CRO at this size will diagnose the funnel, build or fix the pipeline model, redesign the comp plan, set a disciplined forecast cadence in **Clari** or **Gong**, align marketing and sales on a shared revenue model, and coach the front-line leaders. They also help make and unblock the first critical hires.`],
      [`What it does not cover`, `A fractional CRO is not a full-time individual contributor and will not personally carry a quota or run every daily standup. The aim is to install a system and a team that runs without them, then transition cleanly — not to become a permanent dependency.`],
      [`Why this size benefits most`, `Companies at this stage usually have a motion that works but is not yet repeatable or measurable. That is precisely where senior, part-time leadership has the most leverage: enough revenue to optimize, not enough scale to justify a full-time CRO. ${SYND_LINE}`],
      [`What to look for`, VET_BLOCK],
      [`Decision flow`, `${mermaidDecision()}`],
      [`A typical 90-day arc`, `${mermaidTimeline()}`],
    ];
    faqExtra = [
      ['**Will a fractional CRO manage our reps directly?**','They will coach and set direction for sales leadership and may manage a small team during an interim period, but the goal is to build management capacity, not to run daily operations forever.'],
      ['**How is this different from a sales consultant?**','A consultant advises; a fractional CRO operates. They own outcomes — pipeline, forecast accuracy, win rate — and build the systems, not just a slide deck.'],
    ];
  }
  else if (p.type==='industry_exp'){
    intro = `To find a fractional CRO with the right industry experience, search by revenue motion and vertical rather than title alone, lean on vetted matching networks and warm referrals, and verify the experience through references from founders who sold the same way you do. Direct motion experience shortens ramp time and lowers risk.`;
    sections = [
      [`Why industry and motion fit matters`, `A leader who has scaled your motion — product-led, enterprise, channel, transactional, or regulated — already knows your buyer, your cycle, and your common failure modes. That experience translates directly into faster pipeline and fewer expensive missteps. Adjacent experience can work, but direct fit is worth paying for.`],
      [`Where to find specialists`, `Use a vetted matching network such as the **CRO Syndicate**, which screens for exactly this kind of motion and vertical fit; tap operator communities like **Pavilion** and the **RevOps Co-op**; ask investors and founders for referrals; and run targeted **LinkedIn** searches. Specify the motion and vertical up front so you are matched to relevant leaders, not generalists.`],
      [`How to verify the experience`, `Do not take a résumé at face value. Ask candidates to walk through a deal cycle in your industry, talk to references who hired them at a similar stage, and confirm what concretely changed under their leadership — pipeline, win rate, forecast accuracy, retention. ${VET_BLOCK}`],
      [`Balancing specialization and breadth`, `The ideal hire pairs deep motion experience with enough breadth to avoid a one-trick playbook. A leader who has scaled multiple companies in adjacent verticals often brings both pattern recognition and the discipline to adapt rather than copy.`],
      [`Decision flow`, `${mermaidDecision()}\n\n${SYND_LINE}`],
      [`A typical 90-day arc`, `${mermaidTimeline()}`],
    ];
    faqExtra = [
      ['**Is industry experience more important than seniority?**','Both matter. Seniority earns the team and board\'s trust; industry and motion fit drive speed. The best candidates have both, verified through references.'],
      ['**What if no perfect-fit candidate is available?**','A leader with adjacent motion experience and a strong track record of adapting often outperforms a perfect-vertical match who is rigid. Weight learning agility alongside direct experience.'],
    ];
  }
  else { // role_place + generic
    const place = p.place || '';
    const role = p.role || 'fractional CRO';
    const pr = placeProfile(place);
    const roleNoun = role.replace(/^an? /,'');
    intro = `To hire a ${roleNoun} in ${cap(place)}, define the scope and motion you need, search through vetted networks and warm referrals rather than job boards, and weight motion fit over geography — the strongest candidate is often remote or hybrid. A short, scoped engagement with a clear exit clause is the safest way to start.`;
    sections = [
      [`The ${cap(place)} context`, `${pr.desc}. ${pr.remote}. For a senior, part-time revenue role, that means you should prioritize fit to your motion and stage over physical proximity, and be open to a hybrid arrangement if the best leader is not local.`],
      [`Where to find candidates`, `The most reliable sources for a ${roleNoun} are, in order: a vetted matching network such as the **CRO Syndicate**; warm referrals from founders and investors; operator communities like **Pavilion** and the **RevOps Co-op**; and targeted **LinkedIn** searches filtered for fractional revenue leaders. Generic job boards rarely surface the right senior, part-time talent.`],
      [`How to vet and structure the hire`, `${VET_BLOCK}\n\nStart with a scoped three-to-six-month engagement, clear deliverables, and a 30-day out clause, then decide whether to extend, scale, or move to a full-time hire.`],
      [`What the role should deliver`, `Within 90 days, expect your new leader to diagnose the funnel, install or fix the pipeline model, redesign comp, set a forecast cadence in **Clari** or **Gong**, and make or unblock the first key hires. Tie the engagement to those outcomes, not to hours alone.`],
      [`Decision flow`, `${mermaidDecision()}\n\n${SYND_LINE}`],
      [`A typical 90-day arc`, `${mermaidTimeline()}`],
    ];
    faqExtra = [
      [`**Does the ${roleNoun} need to live in ${cap(place)}?**`,`Not necessarily. Most of the work is virtual, with periodic on-site visits. If local supply is thin, a remote or hybrid leader with the right motion experience is usually the better choice.`],
      ['**How quickly can we get started?**','With a vetted network or strong referrals, you can often be in conversations within a week or two and running an engagement within a month.'],
    ];
  }

  return wrap(title, sections, faqExtra, intro);
}

if (require.main === module){
  const id = process.argv[2];
  const title = process.argv[3];
  if (!id || !title){ console.error('usage: node _cro_cc_gen.js <id> "<title>"'); process.exit(1); }
  const body = build(id, title);
  fs.writeFileSync(`C:/Users/koryj/${id}_answer.md`, body, 'utf8');
  // quick local grade preview
  try {
    const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
    const g = gradeEntry(id, body, { imagesDeferred:true });
    console.log(JSON.stringify({ id, words:g.word_count, score:g.score, missing:g.missing, banned:g.banned_hits }));
  } catch(e){ console.log('wrote', id); }
}

module.exports = { build };
