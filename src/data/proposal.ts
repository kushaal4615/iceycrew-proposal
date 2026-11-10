/**
 * Every word and figure on the page. Sections only render this file.
 * Source: the issued proposal document for the AI Style Assistant (project overview, core platform
 * flow, roles, interaction of user flows, feature list, data ingestion, integrations, monetisation,
 * future features, technology stack, milestones, deliverables, support terms, why us, clients, FAQs,
 * to start), the v1 Contractor Brief the client shared, and the discovery call of 10 November 2026
 * with Hazel. Nothing here is invented about the client.
 *
 * COMMERCIALS is the single knob for price and schedule: every amount derives from TOTAL_COST and
 * the milestone percentages; the timeline label derives from TIMELINE_MONTHS.
 */

import coatImg from '../assets/img/coat.jpg'
import bluecoatImg from '../assets/img/bluecoat.jpg'
import plaidImg from '../assets/img/plaid.jpg'
import yellowImg from '../assets/img/yellow.jpg'
import rackImg from '../assets/img/rack.jpg'
import beigeImg from '../assets/img/beige.jpg'
import necklaceImg from '../assets/img/necklace.jpg'
import pendantsImg from '../assets/img/pendants.jpg'
import braceletImg from '../assets/img/bracelet.jpg'
import chainImg from '../assets/img/chain.jpg'
import ringImg from '../assets/img/ring.jpg'
import mayaImg from '../assets/img/maya.jpg'
import storeImg from '../assets/img/store.jpg'
import hoodieImg from '../assets/img/hoodie.jpg'
import swatchesImg from '../assets/img/swatches.jpg'
import logoImg from '../assets/img/iceycrew-logo.png'

/* ------------------------------------------------------------------ commercial knob */

export const COMMERCIALS = {
  /** false: no cost, no timeline, no percentages anywhere on the page */
  show: true,
  totalCost: 8000,
  /** three months from the kick-start payment to the store submissions */
  timelineMonths: { min: 3, max: 3 },
  currency: 'USD',
} as const

export const TOTAL_COST = COMMERCIALS.totalCost
export const TIMELINE_MONTHS = COMMERCIALS.timelineMonths
export const CURRENCY = COMMERCIALS.currency
export const timelineLabel: string = COMMERCIALS.show
  ? (TIMELINE_MONTHS.min as number) === (TIMELINE_MONTHS.max as number)
    ? `${TIMELINE_MONTHS.min} months`
    : `${TIMELINE_MONTHS.min}–${TIMELINE_MONTHS.max} months`
  : 'Schedule on the call'

/* ------------------------------------------------------------------ imagery */

export interface Img {
  src: string
  alt: string
  w: number
  h: number
  credit: string
}

const UN = 'Unsplash License'
export const IMG = {
  coat: { src: coatImg, alt: 'A woman in a burgundy wool coat and sunglasses carrying shopping bags', w: 1400, h: 933, credit: UN },
  bluecoat: { src: bluecoatImg, alt: 'A woman in a pale blue coat with a crossbody bag in front of a cathedral', w: 733, h: 1100, credit: UN },
  plaid: { src: plaidImg, alt: 'A woman in a long plaid coat on a city pavement', w: 731, h: 1100, credit: UN },
  yellow: { src: yellowImg, alt: 'A woman in a head-to-toe yellow tracksuit on a basketball court', w: 1400, h: 1938, credit: UN },
  rack: { src: rackImg, alt: 'Neutral knits and coats on a wooden clothes rail', w: 1300, h: 975, credit: UN },
  beige: { src: beigeImg, alt: 'A pale blue shirt tucked into wide beige trousers', w: 895, h: 1100, credit: UN },
  necklace: { src: necklaceImg, alt: 'A gold pendant necklace in warm light', w: 866, h: 1300, credit: UN },
  pendants: { src: pendantsImg, alt: 'Gold pendants on fine chains', w: 1400, h: 2100, credit: UN },
  bracelet: { src: braceletImg, alt: 'A diamond tennis bracelet on black', w: 1400, h: 929, credit: UN },
  chain: { src: chainImg, alt: 'A gold chain bracelet lying on a magazine', w: 1400, h: 1869, credit: UN },
  ring: { src: ringImg, alt: 'A halo diamond ring on a dark surface', w: 1400, h: 933, credit: UN },
  maya: { src: mayaImg, alt: 'Portrait of a laughing woman with dark hair in a leopard-print top', w: 736, h: 1100, credit: UN },
  store: { src: storeImg, alt: 'Shelves of folded clothes and shoes in a menswear store', w: 1400, h: 934, credit: UN },
  hoodie: { src: hoodieImg, alt: 'A woman in a grey hoodie under a denim jacket against a blue wall', w: 733, h: 1100, credit: UN },
  swatches: { src: swatchesImg, alt: 'Oil and water bubbles in gold, pink and blue', w: 1400, h: 933, credit: UN },
} satisfies Record<string, Img>

/** The store's own logo file, as served on iceycrew.com (gold IC + diamond, transparent). */
export const LOGO = { src: logoImg, w: 268, h: 216 } as const

/* ------------------------------------------------------------------ types */

/** The screens the in-code product mock can show. Member screens render in a phone; the admin in a laptop. */
export type Screen = 'home' | 'camera' | 'analysis' | 'colours' | 'swipe' | 'verify' | 'adminMembers' | 'adminAi'

export const PHONE_SCREENS: Screen[] = ['verify', 'swipe', 'home', 'camera', 'analysis', 'colours']
export const TABLET_SCREENS: Screen[] = []
export const WEB_SCREENS: Screen[] = ['adminMembers', 'adminAi']

export type Who = 'Member' | 'Backend' | 'Admin' | 'AI'

export interface FlowStep {
  id: string
  title: string
  who: Who
  body: string
  screen: Screen
  /** the field code this step is inscribed under on the report */
  time: string
}

export interface Feature {
  title: string
  detail: string
  tip?: { term: string; text: string }
}

export interface Role {
  id: 'member' | 'admin'
  name: string
  device: string
  line: string
  screen: Screen
  img: Img
  features: Feature[]
}

export interface Interaction {
  name: string
  chain: string[]
}

export interface Layer {
  id: string
  code: string
  name: string
  tech: { name: string; icon: string }[]
  detail: string
  carries: string[]
}

export type Phase = 'define' | 'build' | 'release'

export interface Milestone {
  id: string
  name: string
  heading: string
  /** share of the total; amounts derive from it */
  pct: number
  phase: Phase
  body: string
  deliverable: string
  /** when the amount for this field is paid */
  pay: string
  /** the field code this milestone is inscribed under */
  time: string
}

export interface SupportLine {
  item: string
  detail: string
  figure: string
  status: 'INCLUDED' | 'OPT-IN' | 'FIXED'
}

export interface ClientMark {
  name: string
  url: string
  /** the typeset treatment of the mark: never an image */
  set: 'heavy' | 'wide' | 'stack' | 'italic' | 'light' | 'mono'
}

export interface Proposal {
  client: { contact: string; product: string; markets: string; programmeNo: string; date: string; eventName: string; eventDate: string; store: string }
  project: { name: string; title: string; oneLine: string[]; promise: string }
  heroFacts: { label: string; value: number; unit: string; note: string }[]
  overview: { lead: string; paragraphs: string[]; pull: string; notes: string[] }
  constraints: { title: string; body: string; shapes: string }[]
  flow: FlowStep[]
  interactions: Interaction[]
  roles: Role[]
  featureList: { title: string; body: string }[]
  ingestion: { title: string; body: string }[]
  layers: Layer[]
  integrations: { name: string; status: 'IN SCOPE' | 'LATER PHASE'; body: string }[]
  milestones: Milestone[]
  milestoneNote: string
  howItWorks: { title: string; body: string }[]
  support: SupportLine[]
  deliverables: { title: string; body: string; screen?: Screen }[]
  monetisation: { title: string; body: string }
  future: { title: string; body: string }[]
  clients: ClientMark[]
  whyUs: { title: string; body: string }[]
  faq: { q: string; a: string }[]
  startNeeds: { title: string; body: string }[]
  cta: { line: string; action: string; message: string; done: string }
}

/* ------------------------------------------------------------------ content */

export const P: Proposal = {
  client: {
    contact: 'Hazel',
    product: 'AI Style Assistant',
    markets: 'United States · Canada · United Kingdom · Australia',
    programmeNo: 'No. IC-2026-1110',
    date: '10 November 2026',
    eventName: 'The AI Style Assistant build',
    eventDate: 'Three months from the kick-start',
    store: 'iceycrew.com',
  },
  project: {
    name: 'AI Style Assistant',
    title: 'AI style assistant for IceyCrew VIP members',
    oneLine: ['Every outfit', 'your members wear,', 'graded.'],
    promise:
      'An AI-powered personal style assistant, built exclusively for paying VIP members of the IceyCrew brand. Members photograph their outfits and receive real-time, personalised feedback: an overall score out of 100, constructive styling advice and actionable tips, based on fashion conventions and their own style profile. Behind it, a swappable membership provider layer verifies Shopify subscriptions in Version 1 and stays fully decoupled for the move to a dedicated CRM.',
  },
  heroFacts: [
    { label: 'The score', value: 100, unit: 'point scale', note: 'one overall mark, four sub-scores: Fit, Colour, Cohesion, Occasion' },
    { label: 'Launch markets', value: 4, unit: 'countries', note: 'the United States, Canada, the United Kingdom and Australia' },
    { label: 'Fields on the report', value: 8, unit: 'milestones', note: 'each reviewed before the next begins' },
  ],
  overview: {
    lead:
      'The platform is an AI-powered personal style assistant mobile application built exclusively for paying VIP members of the IceyCrew brand. Users photograph their outfits to receive real-time, personalised AI feedback, including an overall score out of 100, constructive styling advice, and actionable improvement tips based on fashion conventions and their individual style profile.',
    paragraphs: [
      'A member downloads the app and enters their Shopify checkout email and order number to verify their active VIP membership. Once verified, they create an account with email, Apple or Google and enter onboarding: multiple-choice style questions and a 20-card swipe deck that together establish an AI style profile. They land on Home, where the brand’s curated style-tips newsletter is already waiting as cards.',
      'The camera is the largest button on the screen. A member captures or uploads a full-body outfit photo, optionally tags the occasion and lets the app read the local weather, and the backend processes the image through a vision AI model in under ten seconds. The app redirects by itself to an Analysis page: the score, the four sub-scores, what is working, what could be better, and tailored tips to level up the fit.',
      'The backend architecture utilises a swappable membership provider layer. The app never talks to Shopify directly; it asks our membership layer, which holds a provider-neutral record of every member and drives the Shopify adapter. When billing and membership move to a dedicated CRM later, a second adapter is written and switched on by configuration, with no app update and no disruption to existing members.',
    ],
    pull: 'It’s really hard to search around the internet to find this tip, and then a lot of tips contradict each other. Having it all in one place, sending your photo in and getting advice straight there: that’s what’s going to be nice for the users.',
    notes: ['Replaces: scattered, contradictory style tips found across the internet.', 'Keeps: your Shopify store, your VIP product and your existing newsletter workflow exactly as they run today.', 'Produces: an iOS and Android app, a Node.js backend with the membership layer, and a web admin panel.'],
  },
  constraints: [
    {
      title: 'Shopify is the bank',
      body: 'VIP is a monthly subscription bought on the IceyCrew Shopify store. For v1 Shopify handles everything: the purchase, the monthly billing and the membership status. There are no in-app payments; anything that upgrades a member sends them to the website.',
      shapes: 'Verification reads the order and the subscription through the Shopify Admin API; webhooks for renewal, cancellation, refund and failed billing keep the membership record current, and the app only ever reads that record. The Phase 2 tiers will be nudges to the website, never a checkout in the app.',
    },
    {
      title: 'Built to leave Shopify',
      body: 'Billing and membership will move from Shopify to a dedicated CRM in future. The switch must be possible without an app update and without disrupting existing members.',
      shapes: 'One membership layer on the backend, a Shopify adapter behind it today and a CRM adapter later, both chosen by configuration. The record stores the provider’s customer, subscription and order IDs and has room for more than one provider ID per member, so existing members match their CRM record by email without re-verifying.',
    },
    {
      title: 'One level now, three later',
      body: 'There is one VIP level in Version 1. Three tiers, basic, premium and gold, with higher daily analysis limits, come in Phase 2 with a subtle nudge toward the next tier.',
      shapes: 'The membership level is a field on the record from day one, and the rate limits are per-level settings in the admin panel. Adding tiers is a data change and a nudge screen, not a rebuild.',
    },
    {
      title: 'English first, more later',
      body: 'Version 1 is English only across four launch markets, with regional formats for dates and temperatures and regional spelling in the AI feedback. More languages come later and must not require a rebuild of the screens.',
      shapes: 'No hard-coded text: every string lives in a standard localisation file, dates and °F or °C follow the device region, and the member’s country is sent with every analysis so the feedback spells colour the way they do.',
    },
    {
      title: 'Ten scans a day, a cap on the bill',
      body: 'Ten analyses per member per day plus an hourly anti-abuse cap, per-IP and per-device limits on login, sign-up and verification, and a global AI spend cap with an email alert at a set threshold. Limits must hold against a modified app or a script.',
      shapes: 'Every AI call goes through our backend, where the limits are enforced and the API keys live. The admin panel edits the limits without a redeploy; a limit hit returns HTTP 429 with a retry-after and the app shows a friendly message.',
    },
    {
      title: 'Photos that respect four privacy laws',
      body: 'Explicit consent before the first upload, encrypted storage, deletion at any time, and automatic deletion of outfit photos after twelve months unless the member keeps them. CCPA/CPRA, PIPEDA and Quebec Law 25, UK GDPR and Australia’s Privacy Act 1988 all apply.',
      shapes: 'Photos sit encrypted in Amazon S3 with a twelve-month retention job the admin can configure; scores and text stay in history after a photo goes. Consent prompts, a data processing agreement with the AI provider and the store privacy labels are part of the build, not an afterthought.',
    },
  ],
  flow: [
    {
      id: 'verify',
      title: 'Verify the VIP order',
      who: 'Member',
      body: 'The user downloads the app and is prompted to enter their Shopify checkout email and order number to verify their active VIP membership.',
      screen: 'verify',
      time: 'F-01',
    },
    {
      id: 'account',
      title: 'Create an account',
      who: 'Member',
      body: 'Upon successful verification, the user creates an account via email, Apple or Google and enters the onboarding flow.',
      screen: 'verify',
      time: 'F-02',
    },
    {
      id: 'onboarding',
      title: 'Build the style profile',
      who: 'Member',
      body: 'The user completes multiple-choice style preference questions and interacts with a 20-card swipe deck to establish an AI style profile.',
      screen: 'swipe',
      time: 'F-03',
    },
    {
      id: 'home',
      title: 'Land on Home',
      who: 'Member',
      body: 'The user lands on the Home dashboard, where they can browse curated style tips from the brand’s newsletter.',
      screen: 'home',
      time: 'F-04',
    },
    {
      id: 'camera',
      title: 'Photograph the outfit',
      who: 'Member',
      body: 'The user taps the primary camera button to capture or upload a full-body outfit photo, optionally attaching occasion tags and local weather data.',
      screen: 'camera',
      time: 'F-05',
    },
    {
      id: 'analysis',
      title: 'Read the grade',
      who: 'AI',
      body: 'The backend processes the image via a vision AI model in under 10 seconds, automatically redirecting the user to an Analysis page displaying scores, positive highlights and tailored styling tips.',
      screen: 'analysis',
      time: 'F-06',
    },
  ],
  interactions: [
    { name: 'App to Shopify', chain: ['The app asks the backend to validate the subscription', 'The backend queries Shopify’s Admin API and webhooks', 'The user is approved or rejected'] },
    { name: 'Onboarding to AI', chain: ['Swipe-deck preferences are saved to the database', 'Appended as context to the AI payload', 'Every analysis is scored against them'] },
    { name: 'Photo to limits', chain: ['The member captures an outfit photo', 'The backend checks the admin-configured daily limit', 'The image goes to the vision AI provider'] },
    { name: 'AI to Analysis page', chain: ['The model returns structured JSON', 'The backend validates the format', 'Scores and feedback are served to the Analysis page'] },
    { name: 'Report to admin inbox', chain: ['The member reports a poor AI rating', 'The backend appends the analysis ID and device OS', 'The admin inbox is notified by email'] },
  ],
  roles: [
    {
      id: 'member',
      name: 'VIP Member',
      device: 'Mobile app · iOS and Android',
      line: 'Verify once, onboard once, then photograph any outfit and read its grade in under ten seconds.',
      screen: 'analysis',
      img: IMG.maya,
      features: [
        { title: 'Authentication and verification', detail: 'Sign in via email, Apple or Google, backed by a Shopify order verification check.' },
        { title: 'Interactive onboarding', detail: 'Swipe right or left on a deck of 20+ outfit cards and answer multiple-choice questions to build a personalised style profile.' },
        { title: 'Outfit scanner and analysis', detail: 'Capture photos with a full-body guide overlay, input the occasion (Work, Date and more) and receive detailed ratings for Fit, Colour, Cohesion and Occasion with actionable tips.', tip: { term: 'Cohesion', text: 'Whether the pieces belong together: formality, era, texture, one statement rather than three.' } },
        { title: 'Colour analysis quiz', detail: 'Complete a 6–10 question quiz to determine undertones, best metal tones and a personalised 12–16 colour season palette.', tip: { term: 'colour season', text: 'A palette family (Deep Autumn, Cool Winter and so on) derived from undertone, depth and contrast; the tips reference it on every analysis.' } },
        { title: 'Newsletter reader', detail: 'Browse and read curated IceyCrew style articles directly within the app using a native webview.' },
        { title: 'Account management', detail: 'Manage privacy settings, toggle the 12-month automated photo deletion policy, request data downloads or report AI feedback bugs.' },
      ],
    },
    {
      id: 'admin',
      name: 'System Administrator',
      device: 'Web-based admin panel',
      line: 'Members and their status, the questions and the deck, the prompts and the limits, the bug inbox.',
      screen: 'adminMembers',
      img: IMG.store,
      features: [
        { title: 'Membership dashboard', detail: 'Monitor registered users, view VIP verification status and track subscription renewals or cancellations.' },
        { title: 'Content management', detail: 'Edit the onboarding questionnaire, update the colour quiz logic and manage the swipe deck images.' },
        { title: 'AI configuration', detail: 'Modify the AI prompts and rating criteria without requiring an app update.' },
        { title: 'System controls', detail: 'Adjust user rate limits (daily and hourly) and manage the global AI monthly spend cap.', tip: { term: 'spend cap', text: 'A ceiling on the month’s AI bill. At a set threshold the admin gets an email; at the cap, analyses pause with a friendly message until the month resets.' } },
        { title: 'Support and analytics inbox', detail: 'Review user-submitted bug reports with attached screenshots and device data, and track platform analytics like analysis counts and helpfulness ratings.' },
      ],
    },
  ],
  featureList: [
    { title: 'Swappable membership provider', body: 'Backend architecture designed to abstract external billing platforms.' },
    { title: 'Shopify VIP verification', body: 'Integration with automated rate-limiting to prevent brute-force abuse.' },
    { title: 'Resumable onboarding engine', body: 'Dynamic progress tracking and swipe-card mechanics.' },
    { title: 'Native in-app browser', body: 'A viewer for the external newsletter feed, with a Done button back to the app.' },
    { title: 'Custom camera interface', body: 'Full-body alignment guides and gallery upload support.' },
    { title: 'AI vision outfit rating engine', body: 'Overall scores and segmented sub-scores: Fit, Colour, Cohesion, Occasion.' },
    { title: 'Algorithmic colour season quiz', body: 'Personalised user palettes and undertone profiles.' },
    { title: 'Location-based weather', body: 'Temperature, rain and wind, integrated directly into the outfit analysis.' },
    { title: 'Automated content moderation', body: 'Detects and rejects nude, sexual or inappropriate images before AI processing.' },
    { title: 'Configurable 12-month photo deletion', body: 'Auto-deletion of outfit photos with an opt-out toggle for members.' },
  ],
  ingestion: [
    { title: 'Newsletter feed', body: 'Article links, titles, preview images and source names are ingested directly from the brand’s existing workflow at iceycrew.com/pages/style-tips, which already stores each edition as JSON.' },
    { title: 'Weather data', body: 'Live temperature, rain and wind conditions, using device location permission or a manually entered city.' },
    { title: 'Onboarding assets', body: 'A starter deck of 20+ commercially licensed fashion images, sourced by us and loaded into the admin database with a source-and-licence list.' },
  ],
  layers: [
    {
      id: 'L1',
      code: 'L1',
      name: 'Hosting and storage',
      tech: [
        { name: 'AWS EC2', icon: 'aws' },
        { name: 'Amazon S3', icon: 's3' },
      ],
      detail: 'Amazon Web Services hosts the backend on EC2 and holds every outfit photo in Amazon S3, encrypted at rest and served by signed links. Hosting is prioritised for North America, where most members are, with HTTPS everywhere.',
      carries: ['EC2 hosting and DevOps', 'Encrypted photo storage on S3', 'Twelve-month retention job'],
    },
    {
      id: 'L2',
      code: 'L2',
      name: 'Data',
      tech: [{ name: 'MongoDB', icon: 'mongodb' }],
      detail: 'MongoDB Atlas provides flexible cloud database management for the provider-neutral membership records, style profiles and swipe-deck preferences, colour profiles, every analysis with its tags, occasion, weather and helpfulness rating, the limit logs and the bug reports. The schema is structured for the languages that come later.',
      carries: ['Membership records, provider-neutral', 'Style and colour profiles', 'Analyses, limits, reports'],
    },
    {
      id: 'L3',
      code: 'L3',
      name: 'Backend API and the membership layer',
      tech: [
        { name: 'Node.js', icon: 'nodedotjs' },
        { name: 'Express.js', icon: 'express' },
        { name: 'JWT', icon: 'jwt' },
      ],
      detail: 'Node.js with Express.js powers the backend API: authentication with JSON Web Tokens, the membership layer that every check goes through, the Shopify adapter behind it, the rate limiter and the spend cap, and the validator that checks every piece of AI JSON before it reaches a screen.',
      carries: ['The membership layer and its adapters', 'Rate limits and the spend cap, server-side', 'JSON validation and retry'],
    },
    {
      id: 'L4',
      code: 'L4',
      name: 'Integrations',
      tech: [
        { name: 'Shopify', icon: 'shopify' },
        { name: 'OpenAI', icon: 'openai' },
        { name: 'Claude', icon: 'claude' },
        { name: 'Weather API', icon: 'weather' },
        { name: 'Sentry', icon: 'sentry' },
      ],
      detail: 'Shopify’s Admin API and webhooks for verification and billing sync; a vision AI provider, OpenAI or the Claude API, that returns structured JSON scores; OpenWeatherMap or WeatherAPI for forecasting context; Crashlytics or Sentry for crash reporting.',
      carries: ['Shopify APIs and webhooks', 'Vision AI, structured JSON', 'Weather and crash reporting'],
    },
    {
      id: 'L5',
      code: 'L5',
      name: 'Apps',
      tech: [
        { name: 'React Native', icon: 'reactnative' },
        { name: 'React', icon: 'react' },
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'Redux Toolkit', icon: 'redux' },
      ],
      detail: 'React Native for the cross-platform iOS and Android app, React.js for the web admin panel, TypeScript throughout, React Navigation and Redux Toolkit for navigation and state. The MERN stack foundation: MongoDB, Express.js, React.js, Node.js.',
      carries: ['iOS and Android app, phones only', 'Web admin panel', 'Strings in localisation files'],
    },
  ],
  integrations: [
    { name: 'Shopify APIs and webhooks', status: 'IN SCOPE', body: 'Validating initial orders and syncing ongoing subscription statuses: renewals, cancellations, failed billing.' },
    { name: 'Vision AI provider', status: 'IN SCOPE', body: 'OpenAI or Claude API for processing images and generating structured JSON scoring feedback.' },
    { name: 'Weather API', status: 'IN SCOPE', body: 'OpenWeatherMap or WeatherAPI for real-time forecasting context.' },
    { name: 'Crash reporting', status: 'IN SCOPE', body: 'Crashlytics or Sentry for automated bug and stability monitoring.' },
    { name: 'Newsletter feed', status: 'IN SCOPE', body: 'The existing style-tips workflow, read from its JSON; new articles appear with no app update.' },
    { name: 'CRM adapter', status: 'LATER PHASE', body: 'The second adapter behind the membership layer, written when billing moves off Shopify.' },
  ],
  milestones: [
    { id: 'M01', name: 'Planning', heading: 'Project planning, architecture blueprint and discovery', pct: 10, phase: 'define', body: 'We finalise the project scope, the technical requirements and the database schemas. This includes planning the custom swappable membership provider architecture so the future CRM migration is seamless, mapping out the AWS cloud infrastructure, and defining the data structures that support future multi-language scalability.', deliverable: 'Scope, technical requirements, database schemas, the membership-layer design and the AWS map', pay: 'The kick-start deposit', time: 'M-01' },
    { id: 'M02', name: 'UI/UX design', heading: 'High-fidelity Figma prototypes for the app and the admin panel', pct: 10, phase: 'define', body: 'Our design team creates high-fidelity, interactive Figma prototypes for both the mobile application and the web-based admin panel: the onboarding swipe deck, the custom camera interface with full-body guides, the AI analysis results screen, every screen styled for both light and dark modes. Development only proceeds once you approve these designs.', deliverable: 'Approved Figma designs for every screen, light and dark', pay: 'Paid when you approve the designs', time: 'M-02' },
    { id: 'M03', name: 'Frontend development', heading: 'Mobile app and web admin frontend coding', pct: 15, phase: 'build', body: 'We code the client-facing interfaces: the cross-platform iOS and Android screens in React Native, the interactive 20-card swipe deck, the 6–10 question colour analysis quiz, the native in-app browser for the newsletter, and the React.js web admin dashboard for system administrators.', deliverable: 'The mobile app and admin panel frontends, navigable and responsive', pay: 'Paid when you sign off this field', time: 'M-03' },
    { id: 'M04', name: 'Backend and database', heading: 'Backend development and core database setup', pct: 15, phase: 'build', body: 'We set up the core server infrastructure: the Node.js backend, the database that securely stores user profiles and style preferences, and the swappable membership adapter layer. We also implement the automated rate-limiting logic for the daily and hourly limits and the 12-month auto-deletion protocol for user photos.', deliverable: 'The backend, the database, the membership layer, the limits and the retention job', pay: 'Paid when you sign off this field', time: 'M-04' },
    { id: 'M05', name: 'Integrations', heading: 'AI, Shopify and third-party API integrations', pct: 15, phase: 'build', body: 'We connect every critical external service: the Shopify Admin APIs and webhooks for VIP verification and billing sync, the vision AI provider (OpenAI or Claude) to process outfits and return structured JSON scores, the weather API for location-based context, and the external IceyCrew newsletter feed.', deliverable: 'Shopify, the vision AI, the weather API and the newsletter feed, connected', pay: 'Paid when you sign off this field', time: 'M-05' },
    { id: 'M06', name: 'First release (MVP beta)', heading: 'A fully functional, testable beta', pct: 15, phase: 'release', body: 'You receive a testable beta of the application. The core flow is operational: a member can verify their Shopify order, create an account, complete onboarding, capture an outfit photo and receive real-time AI feedback for Fit, Colour, Cohesion and Occasion. The admin panel is functional for monitoring these first tests.', deliverable: 'A beta you can test end to end with your first VIP members', pay: 'Paid when you sign off this field', time: 'M-06' },
    { id: 'M07', name: 'Final release', heading: 'Feature complete, refined and polished', pct: 10, phase: 'release', body: 'We finalise and polish every remaining feature: the automated content moderation filter that rejects inappropriate images, the admin support and analytics inbox for bug reports, and every dynamic admin control, editing the AI prompts and the swipe-deck images without an app update, fully locked in and working.', deliverable: 'The feature-complete app and admin panel, refined from your beta feedback', pay: 'Paid when you sign off this field', time: 'M-07' },
    { id: 'M08', name: 'QA, deployment and stores', heading: 'Quality assurance, deployment and App Store submission', pct: 10, phase: 'release', body: 'Rigorous end-to-end bug testing and the integration of Crashlytics or Sentry for live stability monitoring. We deploy the backend to your live production environment, hand over the full source code and technical documentation, and handle the complete submission to the Apple App Store and Google Play Store under your developer accounts. This field also starts your post-launch bug-fix warranty.', deliverable: 'Live backend, apps submitted to both stores, source code and documentation handed over', pay: 'Paid at go-live', time: 'M-08' },
  ],
  milestoneNote:
    'A transparent, trust-based partnership on a strict milestone-based workflow: you are fully satisfied with the progress before you make a significant payment. A 10% deposit kick-starts the project; the first two fields are delivered for your review and paid only after you are satisfied; then each payment clears the next field on the report.',
  howItWorks: [
    { title: 'No large upfront cost', body: 'We do not require the full project amount upfront.' },
    { title: 'Kick-start payment', body: 'A 10% initial deposit formally kick-starts the project and allocates our resources.' },
    { title: 'Performance-based billing', body: 'We deliver the first two milestones for your review. You release the payment for them only after you are satisfied with the work delivered.' },
    { title: 'Progressive workflow', body: 'Once a payment clears, we move on to the next set of milestones, repeating the cycle until the project is complete.' },
  ],
  support: [
    { item: 'Investment', detail: 'Eight fields: a 10% deposit to start, then each field paid when you sign off its deliverable. Nothing is due between fields.', figure: '$8,000', status: 'FIXED' },
    { item: 'Schedule', detail: 'Three months from the kick-start payment to the store submissions, with the eight fields inscribed along the way.', figure: '3 months', status: 'FIXED' },
    { item: 'Support and maintenance after launch', detail: 'Ninety days of free support and maintenance for bug fixes are included from the day the source code is handed over. Anything that breaks, we fix, at no charge.', figure: '90 days', status: 'INCLUDED' },
    { item: 'Source code and intellectual property', detail: 'Full transfer in a repository you own. Every milestone also hands over its own deliverables, the Figma file or the code of that module, as it completes.', figure: 'Handover', status: 'INCLUDED' },
    { item: 'Documentation and test builds', detail: 'Technical documentation covering the architecture, deployment and how to edit prompts, limits and app text; a test plan and TestFlight or internal-testing builds at each milestone; an estimate of monthly running costs for hosting and AI.', figure: 'Included', status: 'INCLUDED' },
    { item: 'Maintenance after the ninety days', detail: 'Completely optional. No lock-in, no auto-renew. If you want it, a monthly plan of $500 covers up to 15 hours of bug fixes and light UI/UX or logic improvements; additional hours at $30 an hour or a mutually agreed rate.', figure: '$500 / month', status: 'OPT-IN' },
  ],
  deliverables: [
    { title: 'Approved Figma designs', body: 'Every screen of the app and the admin panel, in both light and dark modes, approved by you before development starts.' },
    { title: 'Production-ready iOS and Android app', body: 'React Native, phones only: the VIP member experience on the App Store and Google Play.', screen: 'analysis' },
    { title: 'Web backend and React admin panel', body: 'Node.js, Express.js and MongoDB on AWS, with the membership layer, the limits and the admin panel.', screen: 'adminMembers' },
    { title: 'Full source code in a repository you own', body: 'Everything is yours; each milestone hands over its own files as it completes.' },
    { title: 'App Store and Google Play submissions', body: 'Handled under your developer accounts, with the store privacy labels and data-safety form.' },
    { title: 'Technical documentation', body: 'Architecture, deployment steps, and how to edit the AI prompts, the limits and the app text.' },
    { title: 'Ninety days of support and maintenance', body: 'A defined post-launch warranty for bug fixes, included, then entirely optional maintenance.' },
  ],
  monetisation: {
    title: 'A VIP subscription, billed by the store',
    body: 'The platform uses a gated, recurring VIP subscription model processed exclusively through the IceyCrew Shopify store. Access to the app is dynamically tethered to the Shopify billing cycle: if a payment fails or a refund is issued, mobile app access is instantly revoked and the member is downgraded to a locked screen. One VIP level in Version 1; basic, premium and gold tiers with higher daily limits arrive in Phase 2, always upgraded on the website.',
  },
  future: [
    { title: 'CRM migration', body: 'Fully transitioning the billing and membership infrastructure from Shopify to a dedicated CRM system using the built-in adapter layer.' },
    { title: 'Tiered memberships', body: 'Expanding beyond a single VIP tier to basic, premium and gold levels, accommodating higher daily AI analysis limits via web-based upgrades.' },
    { title: 'Multi-language support', body: 'Localising the application for French, Spanish and other languages, utilising the database schemas structured during Version 1.' },
    { title: 'Push notifications', body: 'Delivering alerts, daily style tips and reminders; the infrastructure is built in Phase 1 and activated in Phase 2.' },
  ],
  clients: [
    { name: 'Clientify', url: 'https://clientify.com/', set: 'heavy' },
    { name: 'LeadKlozer', url: 'https://www.leadklozer.com/', set: 'wide' },
    { name: 'Zebra Recovery', url: 'https://zebrarecovery.com/', set: 'stack' },
    { name: 'OneLifeTale', url: 'https://onelifetale.com/', set: 'italic' },
    { name: 'Elomia Health', url: 'https://elomia.com/', set: 'light' },
    { name: 'Laser Bros', url: 'http://laserbros.com/', set: 'mono' },
    { name: 'BRiDDG', url: 'https://www.briddg.com/', set: 'heavy' },
    { name: 'Leadovate', url: 'https://leadovate.com/', set: 'wide' },
    { name: 'knowi', url: 'https://www.knowi.com/', set: 'italic' },
    { name: 'FaMEMEly', url: 'https://famemely.com/', set: 'mono' },
    { name: 'Welfore Health', url: 'https://welforehealth.com/', set: 'light' },
  ],
  whyUs: [
    { title: 'Proven expertise', body: 'MERN stack development and AI integrations, delivered for vision and language-model products before this one.' },
    { title: 'A dedicated in-house team', body: 'Full-stack engineers, AI specialists, UI/UX professionals, quality analysts and a DevOps engineer, assigned to the Style Assistant for the whole build.' },
    { title: 'Agile development', body: 'Clearly defined sprints and deliverables, with your review at every field on the report.' },
    { title: 'A strong focus on quality', body: 'Dedicated QA and testing at every phase, across real phones.' },
    { title: 'Current standards', body: 'The latest web standards, modern techniques and well-documented, commented code.' },
    { title: 'Scalable and secure architecture', body: 'Built for performance and future growth: the membership layer that leaves Shopify, the schema that takes new languages, the limits that hold.' },
    { title: 'Ninety days of free support', body: 'Ninety days of free support and maintenance for bug fixes, for a risk-free launch.' },
    { title: 'Flexible engagement', body: 'Optional terms for long-term maintenance and enhancements, with no lock-in.' },
    { title: 'Documentation and training', body: 'Complete documentation, training and client-first communication.' },
  ],
  faq: [
    { q: 'Will I have ownership of the platform and its source code?', a: 'Absolutely. On completion of every milestone you receive the deliverables associated with it, whether that is the Figma file or the code of the module, and on completion of the project and full payment you have complete ownership of the platform and its source code.' },
    { q: 'Do you provide post-launch support and maintenance?', a: 'Yes. Ninety days of free support and maintenance for bug fixes are included from the handover. After that, support and maintenance are completely optional: a monthly plan or an hourly rate if and when you want it, with no lock-in and no auto-renew. The app stays up to date, secure and performing on the latest devices and operating systems.' },
    { q: 'Can I request changes or updates after it is developed?', a: 'Yes. Requirements evolve. We provide change management procedures where you request updates or changes, we assess the feasibility and impact, and we advise on the best course of action.' },
    { q: 'How do you ensure the security of the application and user data?', a: 'We implement industry-standard security practices: encrypted photo storage, secure data storage, JWT authentication, server-side rate limits, adherence to the privacy regulations of all four launch markets, and thorough security testing to identify and address vulnerabilities.' },
    { q: 'How is the swappable membership layer structured?', a: 'One membership layer on the backend holds a provider-neutral record for every member: status, paid-until date, membership level, provider name and the provider’s customer, subscription and order IDs. All Shopify-specific code lives in a single adapter behind that layer, Shopify webhooks are converted into our own events, and the provider is a configuration setting. Moving to a CRM means writing a CRM adapter and switching the setting; the app never changes.' },
    { q: 'How is the $8,000 paid?', a: 'A 10% deposit of $800 kick-starts the project. Planning and design are delivered for your review and paid after you are satisfied. Then 15% each for the frontend, the backend, the integrations and the MVP beta, and 10% each for the final release and for QA, deployment and the store submissions, every one paid when you sign off its deliverable.' },
    { q: 'What happens after the three months?', a: 'The backend is live, the apps are submitted to the Apple App Store and Google Play Store under your accounts, the source code and documentation are handed over, and your ninety days of free support and maintenance begin.' },
  ],
  startNeeds: [
    { title: 'Planning', body: 'We assess the technical feasibility, settle the development approach, plan the resources and set the deployment strategy. We also confirm which Shopify subscription app runs VIP, since it decides which API and webhooks report status.' },
    { title: 'Design assets', body: 'Your existing brand assets: the IceyCrew logo and its gold, the colour scheme and visual elements to carry into the design, and the app’s name once you decide it.' },
    { title: 'Content and access', body: 'Shopify access to the store, the VIP product and the subscription app; access to the existing newsletter workflow and its JSON; and any text, images or media the app should include.' },
  ],
  cta: {
    line: 'Shall we inscribe the first field?',
    action: 'Accept the report',
    message: 'Hi, I’ve read through the AI Style Assistant proposal. $8,000 over 3 months in eight milestones works for me. Let’s set the start date.',
    done: 'Message copied. Paste it in our chat.',
  },
}

/* ------------------------------------------------------------------ derived */

export interface ResolvedMilestone extends Milestone {
  no: string
  amount: number
  cumulative: number
}

/** Milestone amounts derive from percentages; running totals accumulate. */
export function resolveMilestones(total = TOTAL_COST): ResolvedMilestone[] {
  let run = 0
  return P.milestones.map((m, i) => {
    const amount = Math.round((total * m.pct) / 100)
    run += amount
    return { ...m, no: String(i + 1).padStart(2, '0'), amount, cumulative: run }
  })
}

export const MILESTONES = resolveMilestones()

/** The report's four marks, as the product grades them: the grading scale the page is drawn on. */
export const MARKS = ['Fit', 'Colour', 'Cohesion', 'Occasion'] as const

/** The report's running order: the first field and the last. Nav and field lines use it. */
export const PROGRAMME = {
  doors: 'F-01',
  lastItem: 'F-12',
} as const

/* ------------------------------------------------------------------ the product's own colours */

/** The demo member's colour season as the product paints it: content, not theme. Hex lives here on purpose. */
export const SEASON = {
  name: 'Deep Autumn',
  palette: ['#5B2A1E', '#7A1F2B', '#8A4B12', '#A6651D', '#C78A2B', '#4A5A23', '#1F4D3A', '#0F3B4C', '#2B2E6B', '#5E2D5C', '#B6412E', '#D9A066', '#EADBC2', '#1C1A17'],
  names: ['Chocolate', 'Burgundy', 'Rust', 'Caramel', 'Mustard', 'Olive', 'Forest', 'Deep teal', 'Ink navy', 'Aubergine'],
} as const

/** Ink colours the product uses on its own soft chips (on gold, on success, on danger, on gold-soft). */
export const SCREEN_INK = { onGoldSoft: '#4a3a00', onSuccess: '#0f4f33', onDanger: '#6c1620', goldDeep: '#5c4600' } as const
