// ---------------------------------------------------------------------------
// Ten ENTIRELY FICTIONAL test profiles (A–J). No real individuals. Used to
// validate the form data structure and to exercise the app's journey. These
// deliberately span seniority, quality of input and edge cases.
// ---------------------------------------------------------------------------

import type { CvFormData } from "../../lib/types";
import { emptyForm } from "../../lib/store";

let n = 0;
const id = (p: string) => `${p}_${(n++).toString(36)}`;

function base(overrides: Partial<CvFormData>): CvFormData {
  return { ...emptyForm(), ...overrides };
}

// Profile A — Junior serving officer, ~5 years.
export const profileA: CvFormData = base({
  personal: {
    ...emptyForm().personal,
    fullName: "Adaeze Okonkwo",
    headline: "Junior Operations Officer",
    email: "a.okonkwo@example.com",
    phone: "+000 000 0001",
    city: "Kaduna",
    country: "Nigeria",
    militaryStatus: "Serving",
    serviceBranch: "Army",
    currentOrFinalRank: "Lieutenant",
    yearsOfService: "5",
    cvPurpose: "General Professional CV",
  },
  appointments: [
    {
      id: id("appt"),
      organisation: "Army",
      formation: "12 Field Engineer Regiment",
      appointment: "Platoon Commander",
      rank: "Lieutenant",
      location: "Kaduna",
      startMonth: "Jan",
      startYear: "2021",
      endMonth: "",
      endYear: "",
      present: true,
      responsibilities: "Responsible for administration and troops. Led a platoon and ran daily activities and training.",
      achievements: "Improved turnout and discipline in the platoon.",
      leadershipScope: "Team of around 30 personnel.",
    },
  ],
});

// Profile B — Mid-career officer, ~15 years.
export const profileB: CvFormData = base({
  personal: {
    ...emptyForm().personal,
    fullName: "Marcus Delano",
    headline: "Operations & Logistics Manager",
    email: "m.delano@example.com",
    phone: "+000 000 0002",
    city: "Portsmouth",
    country: "United Kingdom",
    militaryStatus: "Serving",
    serviceBranch: "Navy",
    currentOrFinalRank: "Lieutenant Commander",
    yearsOfService: "15",
    cvPurpose: "Corporate Employment",
    targetRole: "Operations Manager",
  },
  appointments: [
    {
      id: id("appt"),
      organisation: "Navy",
      formation: "Fleet Logistics",
      appointment: "Logistics Officer",
      rank: "Lieutenant Commander",
      location: "Portsmouth",
      startMonth: "Mar",
      startYear: "2016",
      endMonth: "",
      endYear: "",
      present: true,
      responsibilities: "Managed logistics and supply for fleet units, coordinated with multiple departments, oversaw inventory and procurement processes.",
      achievements: "Introduced a revised stock control process that reduced delays in resupply.",
      leadershipScope: "Department of 45 across three sites.",
    },
    {
      id: id("appt"),
      organisation: "Navy",
      appointment: "Divisional Officer",
      rank: "Lieutenant",
      location: "Plymouth",
      startMonth: "Jan",
      startYear: "2011",
      endMonth: "Feb",
      endYear: "2016",
      present: false,
      responsibilities: "Personnel management, welfare, training coordination and administration for a division.",
      achievements: "",
      leadershipScope: "",
    },
  ],
  academic: [
    { id: id("acad"), qualification: "BEng", field: "Mechanical Engineering", institution: "University of Plymouth", country: "United Kingdom", year: "2010" },
  ],
});

// Profile C — Senior Colonel-level career.
export const profileC: CvFormData = base({
  personal: {
    ...emptyForm().personal,
    fullName: "Ingrid Halvorsen",
    headline: "Senior Defence Leader",
    email: "i.halvorsen@example.com",
    phone: "+000 000 0003",
    city: "Oslo",
    country: "Norway",
    militaryStatus: "Serving",
    serviceBranch: "Army",
    currentOrFinalRank: "Colonel",
    yearsOfService: "26",
    cvPurpose: "Defence / Security Role",
    targetSector: "Defence advisory",
  },
  appointments: [
    {
      id: id("appt"),
      organisation: "Army",
      formation: "Joint Operations Command",
      appointment: "Chief of Operations Planning",
      rank: "Colonel",
      location: "Oslo",
      startMonth: "Jun",
      startYear: "2018",
      present: true,
      endMonth: "",
      endYear: "",
      responsibilities: "Directed operational planning across joint commands, led a large planning staff, coordinated with allied partners and civilian agencies, developed doctrine and oversaw capability development.",
      achievements: "Led the redesign of the operational planning framework adopted across the command.",
      leadershipScope: "Directorate of 120 staff; multinational coordination.",
    },
  ],
  executiveProgrammes: [
    { id: id("exec"), programme: "Advanced Defence Management Programme", institution: "Defence College", country: "Norway", year: "2017" },
  ],
});

// Profile D — Retired General, 30+ years.
export const profileD: CvFormData = base({
  personal: {
    ...emptyForm().personal,
    fullName: "Rafael Mendoza",
    headline: "Retired General Officer | Strategic Leadership",
    email: "r.mendoza@example.com",
    phone: "+000 000 0004",
    city: "Madrid",
    country: "Spain",
    militaryStatus: "Retired",
    serviceBranch: "Air Force",
    currentOrFinalRank: "Major General",
    yearsOfService: "34",
    cvPurpose: "Board Appointment",
    targetSector: "Aerospace & defence boards",
  },
  appointments: [
    {
      id: id("appt"),
      organisation: "Air Force",
      appointment: "Air Component Commander",
      rank: "Major General",
      location: "Madrid",
      startMonth: "",
      startYear: "2015",
      endMonth: "",
      endYear: "2021",
      present: false,
      responsibilities: "Commanded air component operations, set strategic direction, led senior officers, managed institutional relationships with government and international partners, accountable for readiness and governance.",
      achievements: "Directed a modernisation programme and established a new safety governance regime.",
      leadershipScope: "Command of several thousand personnel; national and NATO-level engagement.",
    },
    {
      id: id("appt"),
      organisation: "Air Force",
      appointment: "Director of Strategy",
      rank: "Brigadier General",
      startYear: "2011",
      endYear: "2015",
      startMonth: "",
      endMonth: "",
      present: false,
      responsibilities: "Led strategy development, force planning and inter-agency policy.",
      achievements: "Authored the long-term force development strategy.",
      leadershipScope: "",
    },
  ],
  boardExperience: [
    { id: id("board"), organisation: "National Aviation Safety Council", role: "Advisory Board Member", dates: "2022 – present", responsibilities: "Governance oversight and risk advisory.", achievements: "" },
  ],
});

// Profile E — Retired officer with substantial private-sector experience.
export const profileE: CvFormData = base({
  personal: {
    ...emptyForm().personal,
    fullName: "Sandra Whitfield",
    headline: "Security & Risk Executive",
    email: "s.whitfield@example.com",
    phone: "+000 000 0005",
    city: "Toronto",
    country: "Canada",
    militaryStatus: "Retired",
    serviceBranch: "Army",
    currentOrFinalRank: "Colonel",
    yearsOfService: "22",
    cvPurpose: "Executive Leadership",
    targetRole: "Chief Security Officer",
  },
  appointments: [
    {
      id: id("appt"),
      organisation: "Army",
      appointment: "Commanding Officer, Signals Regiment",
      rank: "Colonel",
      startYear: "2010",
      endYear: "2016",
      startMonth: "",
      endMonth: "",
      present: false,
      responsibilities: "Commanded a signals regiment, led communications and cyber-defence capability, managed personnel and budgets.",
      achievements: "Delivered a regimental communications upgrade on schedule.",
      leadershipScope: "600 personnel.",
    },
  ],
  postMilitary: [
    { id: id("gen"), organisation: "Meridian Logistics Group", role: "Director of Corporate Security", location: "Toronto", dates: "2016 – present", description: "Lead enterprise security, business continuity and risk across a multinational logistics firm.", result: "Built the corporate security function from the ground up." },
  ],
});

// Profile F — Senior officer seeking a board appointment.
export const profileF: CvFormData = base({
  personal: {
    ...emptyForm().personal,
    fullName: "Kwame Asante",
    headline: "Governance & Strategy Leader",
    email: "k.asante@example.com",
    phone: "+000 000 0006",
    city: "Accra",
    country: "Ghana",
    militaryStatus: "Retired",
    serviceBranch: "Army",
    currentOrFinalRank: "Brigadier General",
    yearsOfService: "29",
    cvPurpose: "Board Appointment",
    targetSector: "Public and private sector boards",
  },
  appointments: [
    {
      id: id("appt"),
      organisation: "Army",
      appointment: "Director of Personnel",
      rank: "Brigadier General",
      startYear: "2014",
      endYear: "2020",
      startMonth: "",
      endMonth: "",
      present: false,
      responsibilities: "Directed human resources policy, workforce planning, welfare and institutional governance for the service.",
      achievements: "Led a workforce policy reform adopted service-wide.",
      leadershipScope: "Policy affecting the entire service workforce.",
    },
  ],
  boardExperience: [
    { id: id("board"), organisation: "Veterans Support Foundation", role: "Trustee", dates: "2020 – present", responsibilities: "Governance, finance oversight and strategy.", achievements: "Chaired the finance and audit committee." },
  ],
});

// Profile G — Officer targeting corporate employment.
export const profileG: CvFormData = base({
  personal: {
    ...emptyForm().personal,
    fullName: "Elena Petrova",
    headline: "Project & Programme Manager",
    email: "e.petrova@example.com",
    phone: "+000 000 0007",
    city: "Berlin",
    country: "Germany",
    militaryStatus: "Veteran",
    serviceBranch: "Air Force",
    currentOrFinalRank: "Major",
    yearsOfService: "12",
    cvPurpose: "Corporate Employment",
    targetRole: "Programme Manager",
  },
  appointments: [
    {
      id: id("appt"),
      organisation: "Air Force",
      appointment: "Project Officer, Capability Programmes",
      rank: "Major",
      startYear: "2016",
      endYear: "2022",
      startMonth: "",
      endMonth: "",
      present: false,
      responsibilities: "Managed capability projects, coordinated cross-functional teams, controlled schedules and reported to senior leadership.",
      achievements: "Delivered a training-systems project across multiple sites.",
      leadershipScope: "Project teams up to 20.",
    },
  ],
  certifications: [
    { id: id("cert"), certification: "PRINCE2 Practitioner", issuer: "AXELOS", year: "2021" },
  ],
});

// Profile H — Badly written experience descriptions.
export const profileH: CvFormData = base({
  personal: {
    ...emptyForm().personal,
    fullName: "Tunde Bakare",
    email: "t.bakare@example.com",
    phone: "+000 000 0008",
    city: "Lagos",
    country: "Nigeria",
    militaryStatus: "Veteran",
    serviceBranch: "Army",
    currentOrFinalRank: "Captain",
    yearsOfService: "9",
    cvPurpose: "General Professional CV",
  },
  appointments: [
    {
      id: id("appt"),
      organisation: "army",
      appointment: "coy 2ic",
      rank: "capt",
      startYear: "2015",
      endYear: "2020",
      startMonth: "",
      endMonth: "",
      present: false,
      responsibilities: "did admin and stuff, helped the OC, sorted men out, logistics etc, various duties as assigned",
      achievements: "did well, got commended",
      leadershipScope: "",
    },
  ],
});

// Profile I — Responsibilities but few achievements.
export const profileI: CvFormData = base({
  personal: {
    ...emptyForm().personal,
    fullName: "Grace Nakamura",
    headline: "Training & Development Specialist",
    email: "g.nakamura@example.com",
    phone: "+000 000 0009",
    city: "Nairobi",
    country: "Kenya",
    militaryStatus: "Serving",
    serviceBranch: "Army",
    currentOrFinalRank: "Major",
    yearsOfService: "14",
    cvPurpose: "Academic / Training Role",
  },
  appointments: [
    {
      id: id("appt"),
      organisation: "Army",
      formation: "Training School",
      appointment: "Chief Instructor",
      rank: "Major",
      startYear: "2018",
      present: true,
      endMonth: "",
      endYear: "",
      startMonth: "",
      responsibilities: "Responsible for the delivery of instruction, course design, assessment standards, instructor development and curriculum management across multiple courses.",
      achievements: "",
      leadershipScope: "Faculty of 25 instructors.",
    },
  ],
  trainingExperience: [
    { id: id("gen"), organisation: "Army Training School", role: "Course Designer", location: "Nairobi", dates: "2018 – present", description: "Design and accredit professional development courses.", result: "" },
  ],
});

// Profile J — Inconsistent dates.
export const profileJ: CvFormData = base({
  personal: {
    ...emptyForm().personal,
    fullName: "Oliver Grant",
    headline: "Security Operations Leader",
    email: "o.grant@example.com",
    phone: "+000 000 0010",
    city: "Canberra",
    country: "Australia",
    militaryStatus: "Retired",
    serviceBranch: "Army",
    currentOrFinalRank: "Lieutenant Colonel",
    yearsOfService: "20",
    cvPurpose: "Consulting / Advisory",
  },
  appointments: [
    {
      id: id("appt"),
      organisation: "Army",
      appointment: "Commanding Officer",
      rank: "Lieutenant Colonel",
      startMonth: "Jun",
      startYear: "2019",
      endMonth: "Jan",
      endYear: "2015", // deliberately inconsistent (end before start)
      present: false,
      responsibilities: "Command of a battalion, operations, training and administration.",
      achievements: "Led a successful unit certification.",
      leadershipScope: "800 personnel.",
    },
    {
      id: id("appt"),
      organisation: "Army",
      appointment: "Operations Officer",
      rank: "Major",
      startMonth: "",
      startYear: "2020", // overlaps/after the CO role above — inconsistent ordering
      endMonth: "",
      endYear: "2022",
      present: false,
      responsibilities: "Operational planning and coordination.",
      achievements: "",
      leadershipScope: "",
    },
  ],
});

export const ALL_PROFILES: { key: string; label: string; data: CvFormData }[] = [
  { key: "A", label: "Junior serving officer (~5 yrs)", data: profileA },
  { key: "B", label: "Mid-career officer (~15 yrs)", data: profileB },
  { key: "C", label: "Senior Colonel-level", data: profileC },
  { key: "D", label: "Retired General (30+ yrs)", data: profileD },
  { key: "E", label: "Retired officer + private sector", data: profileE },
  { key: "F", label: "Senior officer → board", data: profileF },
  { key: "G", label: "Officer → corporate", data: profileG },
  { key: "H", label: "Badly written input", data: profileH },
  { key: "I", label: "Responsibilities, few achievements", data: profileI },
  { key: "J", label: "Inconsistent dates", data: profileJ },
];
