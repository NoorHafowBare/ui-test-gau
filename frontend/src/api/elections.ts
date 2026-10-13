import {
  MOCK_ELECTION_POSITIONS,
  ELECTIONS_OPEN_DEFAULT,
  type ElectionPosition,
  type CastBallotReceipt,
} from "@/mocks/elections"

const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

let isElectionsOpen = ELECTIONS_OPEN_DEFAULT
let ballotReceipt: CastBallotReceipt | null = null

export async function getElectionStatus(): Promise<{
  isOpen: boolean
  electionTitle: string
  session: string
  votingDeadline: string
  positions: ElectionPosition[]
  hasVoted: boolean
  ballotReceipt: CastBallotReceipt | null
}> {
  await simulateDelay(250)
  return {
    isOpen: isElectionsOpen,
    electionTitle: "Garissa University Student Association (GUSA) General Elections",
    session: "Academic Year 2026/2027",
    votingDeadline: "Today at 5:00 PM EAT",
    positions: MOCK_ELECTION_POSITIONS,
    hasVoted: !!ballotReceipt,
    ballotReceipt,
  }
}

export async function submitBallot(
  votes: Record<string, string>
): Promise<CastBallotReceipt> {
  await simulateDelay(600)
  const selections = Object.entries(votes).map(([posId, candId]) => {
    const pos = MOCK_ELECTION_POSITIONS.find((p) => p.id === posId)
    const cand = pos?.candidates.find((c) => c.id === candId)
    return {
      positionTitle: pos?.title || posId,
      candidateName: cand?.name || candId,
    }
  })

  const receipt: CastBallotReceipt = {
    receiptNumber: `GUSA-VOTE-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    voterHash: `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    selections,
  }

  ballotReceipt = receipt
  return receipt
}

export function toggleElectionsOpen(): boolean {
  isElectionsOpen = !isElectionsOpen
  return isElectionsOpen
}

export function resetVotingState(): void {
  ballotReceipt = null
}
