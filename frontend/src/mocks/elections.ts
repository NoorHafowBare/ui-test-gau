export interface ElectionCandidate {
  id: string
  name: string
  registrationNumber: string
  programme: string
  year: string
  avatarInitials: string
  manifesto: string
  keyPledges: string[]
}

export interface ElectionPosition {
  id: string
  title: string
  description: string
  requiredVotes: number
  candidates: ElectionCandidate[]
}

export interface CastBallotReceipt {
  receiptNumber: string
  timestamp: string
  voterHash: string
  selections: { positionTitle: string; candidateName: string }[]
}

export const ELECTIONS_OPEN_DEFAULT = true

export const MOCK_ELECTION_POSITIONS: ElectionPosition[] = [
  {
    id: "pos-pres",
    title: "Chairperson / Student President (GUSA)",
    description: "Executive head of the Garissa University Students Association and chief student representative to the University Council.",
    requiredVotes: 1,
    candidates: [
      {
        id: "cand-p1",
        name: "Abdiwahab Hassan Adan",
        registrationNumber: "BSC/G0042/23",
        programme: "B.Sc. Applied Statistics with Computing",
        year: "Year 4",
        avatarInitials: "AH",
        manifesto: "Empowering every student voice with transparent administration, 24/7 campus library study spaces, and upgraded sports facilities.",
        keyPledges: ["24-Hour Digital Study Hubs", "Timely Helb & Bursary Advocacy", "Transparent GUSA Financial Audits"],
      },
      {
        id: "cand-p2",
        name: "Faith Chebet Kipkorir",
        registrationNumber: "BED/G0118/23",
        programme: "Bachelor of Education (Arts)",
        year: "Year 4",
        avatarInitials: "FC",
        manifesto: "Inclusive student leadership centered on female student mentorship, improved hostel sanitation, and streamlined academic appeals.",
        keyPledges: ["Hostel Infrastructure Renovation", "Student Mental Health Clinic", "Career Networking Partnerships"],
      },
      {
        id: "cand-p3",
        name: "Mohamed Noor Ibrahim",
        registrationNumber: "BBA/G0204/24",
        programme: "Bachelor of Business Administration",
        year: "Year 3",
        avatarInitials: "MN",
        manifesto: "Entrepreneurship incubators on campus, subsidized printing services, and high-speed campus-wide fiber connectivity.",
        keyPledges: ["Subsidized ICT & Printing", "Campus Enterprise Grant Fund", "Student Transport Shuttle Service"],
      },
    ],
  },
  {
    id: "pos-sg",
    title: "Secretary General (GUSA)",
    description: "Custodian of student association records, official correspondence, and general meeting coordination.",
    requiredVotes: 1,
    candidates: [
      {
        id: "cand-sg1",
        name: "Brian Otieno Onyango",
        registrationNumber: "COM/G0088/24",
        programme: "B.Sc. Computer Science",
        year: "Year 3",
        avatarInitials: "BO",
        manifesto: "Digitalizing student petitions with real-time tracking, weekly bulletin publications, and open town halls.",
        keyPledges: ["Digital GUSA Portal Updates", "Open Fortnightly Town Halls", "Rapid Petition Response System"],
      },
      {
        id: "cand-sg2",
        name: "Zainab Sheikh Ahmed",
        registrationNumber: "BDS/G0155/23",
        programme: "Bachelor of Development Studies",
        year: "Year 4",
        avatarInitials: "ZS",
        manifesto: "Bridging the gap between administration and student body through accessible communication and documented policy tracking.",
        keyPledges: ["Accessible Document Archives", "Inter-Campus Student Exchanges", "Prompt Exam Resolution Assistance"],
      },
    ],
  },
  {
    id: "pos-acad",
    title: "Academic Affairs Secretary",
    description: "Liaison with Deans and Senate on curriculum delivery, exam timetables, and academic appeals.",
    requiredVotes: 1,
    candidates: [
      {
        id: "cand-ac1",
        name: "Kevin Mwangi Wanjiku",
        registrationNumber: "STA/G0019/23",
        programme: "B.Sc. Statistics",
        year: "Year 4",
        avatarInitials: "KM",
        manifesto: "Zero exam timetable clashes, early publication of CAT results, and accessible departmental tutorials for complex units.",
        keyPledges: ["Clash-Free Exam Timetabling", "Mandatory Early CAT Return", "Peer Tutoring Support Network"],
      },
      {
        id: "cand-ac2",
        name: "Amina Dahir Yusuf",
        registrationNumber: "BED/G0231/24",
        programme: "Bachelor of Education (Science)",
        year: "Year 3",
        avatarInitials: "AD",
        manifesto: "Streamlining special exam approvals, expanding laboratory reagent access, and online academic advice workshops.",
        keyPledges: ["Simplified Special Exam Petitions", "Enhanced Science Lab Supplies", "Academic Excellence Mentorship"],
      },
    ],
  },
]
