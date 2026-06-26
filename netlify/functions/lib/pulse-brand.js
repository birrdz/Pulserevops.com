// Canonical PULSE brand assets for Organization logo / Google site name in SERPs.
// Square lightbulb mark — source: icon-512.png / pulse-mark.svg (2026-06 lightbulb rebrand).

const PULSE_SITE = 'https://pulserevops.com';
const PULSE_ORG_LOGO_PATH = '/img/pulse-logo-lightbulb.png';
const PULSE_ORG_LOGO_URL = PULSE_SITE + PULSE_ORG_LOGO_PATH;
const PULSE_ORG_ID = PULSE_SITE + '/#organization';

function pulseOrgLogoImageObject() {
  return {
    '@type': 'ImageObject',
    url: PULSE_ORG_LOGO_URL,
    width: 512,
    height: 512,
    caption: 'PULSE lightbulb logo',
  };
}

/** Minimal Organization node with logo — merge extra fields as needed. */
function pulseOrganizationStub(extra = {}) {
  return {
    '@type': 'Organization',
    '@id': PULSE_ORG_ID,
    name: 'Pulse RevOps',
    url: PULSE_SITE,
    logo: pulseOrgLogoImageObject(),
    ...extra,
  };
}

module.exports = {
  PULSE_SITE,
  PULSE_ORG_LOGO_PATH,
  PULSE_ORG_LOGO_URL,
  PULSE_ORG_ID,
  pulseOrgLogoImageObject,
  pulseOrganizationStub,
};
