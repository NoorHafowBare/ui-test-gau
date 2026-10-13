import * as React from "react"
import { toast } from "sonner"
import {
  Vote,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Info,
  Sparkles,
} from "lucide-react"

import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  getElectionStatus,
  submitBallot,
  toggleElectionsOpen,
  resetVotingState,
} from "@/api/elections"
import type {
  ElectionPosition,
  CastBallotReceipt,
} from "@/mocks/elections"

export function StudentElectionsPage() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [positions, setPositions] = React.useState<ElectionPosition[]>([])
  const [hasVoted, setHasVoted] = React.useState(false)
  const [ballotReceipt, setBallotReceipt] = React.useState<CastBallotReceipt | null>(null)

  // Selected votes: { [positionId]: candidateId }
  const [votes, setVotes] = React.useState<Record<string, string>>({})
  const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false)
  const [submittingBallot, setSubmittingBallot] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await getElectionStatus()
        if (mounted) {
          setIsOpen(data.isOpen)
          setPositions(data.positions)
          setHasVoted(data.hasVoted)
          setBallotReceipt(data.ballotReceipt)
        }
      } catch {
        toast.error("Failed to load elections data.")
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleSelectCandidate = (positionId: string, candidateId: string) => {
    setVotes((prev) => ({ ...prev, [positionId]: candidateId }))
  }

  const handleToggleOpenState = () => {
    const next = toggleElectionsOpen()
    setIsOpen(next)
    toast.info(
      next
        ? "Demo Mode: Elections Window OPEN"
        : "Demo Mode: Elections Window CLOSED (No active polling)"
    )
  }

  const handleResetVote = () => {
    resetVotingState()
    setHasVoted(false)
    setBallotReceipt(null)
    setVotes({})
    toast.info("Demo Mode: Ballot reset. You may vote again.")
  }

  const allPositionsVoted =
    positions.length > 0 && positions.every((p) => Boolean(votes[p.id]))

  const handleSubmitBallot = async () => {
    setSubmittingBallot(true)
    try {
      const receipt = await submitBallot(votes)
      setBallotReceipt(receipt)
      setHasVoted(true)
      toast.success("Ballot cast successfully!", {
        description: `Receipt #${receipt.receiptNumber} generated with cryptographic verification.`,
      })
      setReviewDialogOpen(false)
    } catch {
      toast.error("Failed to submit ballot.")
    } finally {
      setSubmittingBallot(false)
    }
  }

  return (
    <div className="space-y-4 w-full">
      <PageHeader
        title="Student Elections"
        breadcrumbs={[
          { label: "Home", href: "/app/dashboard" },
          { label: "Periodic Activities" },
          { label: "Student Elections" },
        ]}
        description="Garissa University Students Association (GUSA) Executive Council Polling & E-Ballot Portal."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleOpenState}
              className="h-8 gap-1.5 text-xs font-medium"
              title="Toggle election polling window open or closed"
            >
              {isOpen ? (
                <>
                  <ToggleRight className="size-4 text-primary" strokeWidth={1.75} />
                  Demo: Elections OPEN (Click to Close)
                </>
              ) : (
                <>
                  <ToggleLeft className="size-4 text-muted-foreground" strokeWidth={1.75} />
                  Demo: Elections CLOSED (Click to Open)
                </>
              )}
            </Button>

            {hasVoted && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetVote}
                className="h-8 text-xs font-medium"
              >
                Reset My Ballot (Demo)
              </Button>
            )}
          </div>
        }
      />

      {/* State 1: When No Election is Open */}
      {!isOpen && (
        <Alert variant="warning" className="border-warning/30 bg-warning/10 text-foreground">
          <AlertTriangle className="size-4 text-warning mt-0.5 shrink-0" strokeWidth={1.75} />
          <div className="space-y-1">
            <AlertTitle className="text-sm font-semibold text-foreground">
              No Active Student Election is Currently Open
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
              The Garissa University Independent Electoral Commission (IEC) has not scheduled an active polling session today. Official election timetables, voter register verification, and candidate gazettement notices will appear here once announced by the Dean of Students.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* State 2: When Already Voted */}
      {isOpen && hasVoted && ballotReceipt && (
        <Card className="rounded-xl border border-success/30 bg-success/5 shadow-xs overflow-hidden">
          <CardHeader className="border-b border-success/20 py-4 px-6 bg-success/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-success" strokeWidth={2} />
                  <CardTitle className="text-base font-semibold text-foreground tracking-tight">
                    Official Ballot Receipt • Vote Recorded
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Your electronic vote has been anonymized, encrypted, and recorded in the university electoral tally.
                </CardDescription>
              </div>

              <Badge variant="default" className="text-xs font-mono bg-success text-success-foreground self-start sm:self-auto">
                Receipt #{ballotReceipt.receiptNumber}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-card border border-border/60">
                <span className="text-[11px] text-muted-foreground block">Time Recorded:</span>
                <span className="font-mono font-medium text-foreground text-xs">{ballotReceipt.timestamp}</span>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border/60">
                <span className="text-[11px] text-muted-foreground block">Digital Signature Hash:</span>
                <span className="font-mono text-muted-foreground text-[11px] truncate block">{ballotReceipt.voterHash}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Confirmed Ballot Selections
              </h4>
              <div className="divide-y divide-border/50 rounded-lg border border-border/60 bg-card overflow-hidden text-xs">
                {ballotReceipt.selections.map((sel) => (
                  <div key={sel.positionTitle} className="p-3 flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">{sel.positionTitle}</span>
                    <span className="font-semibold text-foreground">{sel.candidateName}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* State 3: When Election is OPEN and user hasn't voted yet */}
      {isOpen && !hasVoted && (
        <div className="space-y-6">
          {/* Active Poll Notice */}
          <Alert variant="info" className="border-info/30 bg-info/10 text-foreground">
            <Info className="size-4 text-info mt-0.5 shrink-0" strokeWidth={1.75} />
            <div className="space-y-1">
              <AlertTitle className="text-sm font-semibold text-foreground">
                GUSA General Election 2026/2027 • Official Ballot Active
              </AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground leading-relaxed flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Polling Window closes today at 5:00 PM EAT.</span>
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <ShieldCheck className="size-3 text-primary" strokeWidth={1.75} />
                  Secret Ballot • One Student, One Vote
                </span>
              </AlertDescription>
            </div>
          </Alert>

          {/* Ballots per Position */}
          <div className="space-y-6">
            {positions.map((position, pIdx) => {
              const selectedCandId = votes[position.id]

              return (
                <Card
                  key={position.id}
                  className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden"
                >
                  <CardHeader className="border-b border-border/50 py-3.5 px-5 bg-muted/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="size-5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold flex items-center justify-center">
                            {pIdx + 1}
                          </span>
                          <CardTitle className="text-base font-semibold text-foreground tracking-tight">
                            {position.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-xs text-muted-foreground">
                          {position.description}
                        </CardDescription>
                      </div>

                      <Badge
                        variant={selectedCandId ? "default" : "outline"}
                        className="text-xs self-start sm:self-auto"
                      >
                        {selectedCandId ? "Vote Selected" : "Pending Selection"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5">
                    <RadioGroup
                      value={selectedCandId || ""}
                      onValueChange={(val) => handleSelectCandidate(position.id, val)}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {position.candidates.map((candidate) => {
                        const isChosen = selectedCandId === candidate.id

                        return (
                          <div
                            key={candidate.id}
                            onClick={() => handleSelectCandidate(position.id, candidate.id)}
                            className={`rounded-xl border p-4 transition-all flex flex-col justify-between gap-3 cursor-pointer select-none ${
                              isChosen
                                ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-xs"
                                : "border-border/70 hover:border-border hover:bg-muted/15 shadow-2xs"
                            }`}
                          >
                            <div className="space-y-3">
                              {/* Candidate Header */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <Avatar className="size-9 border border-border/60">
                                    <AvatarFallback className="text-xs font-semibold bg-muted text-foreground">
                                      {candidate.avatarInitials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-semibold text-xs text-foreground">
                                      {candidate.name}
                                    </h4>
                                    <span className="text-[11px] text-muted-foreground block">
                                      {candidate.year} • {candidate.programme}
                                    </span>
                                  </div>
                                </div>

                                <RadioGroupItem
                                  value={candidate.id}
                                  id={`${position.id}-${candidate.id}`}
                                  className="mt-1"
                                />
                              </div>

                              {/* Manifesto Snippet */}
                              <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/20 p-2.5 rounded-lg border border-border/40">
                                "{candidate.manifesto}"
                              </p>

                              {/* Key Pledges */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                                  Priority Pledges:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {candidate.keyPledges.map((pledge) => (
                                    <span
                                      key={pledge}
                                      className="rounded bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border/30"
                                    >
                                      • {pledge}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-border/40 flex justify-end">
                              <span
                                className={`text-[11px] font-medium ${
                                  isChosen ? "text-primary font-semibold" : "text-muted-foreground"
                                }`}
                              >
                                {isChosen ? "✓ Candidate Selected" : "Click to Vote"}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Cast Ballot Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-border/80 bg-card shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" strokeWidth={1.75} />
                Ready to Cast Your Ballot?
              </span>
              <p className="text-xs text-muted-foreground">
                {allPositionsVoted
                  ? "All positions selected. Click 'Review & Submit Ballot' to cast your official vote."
                  : `Please make a selection for all ${positions.length} executive positions above.`}
              </p>
            </div>

            <Button
              disabled={!allPositionsVoted}
              onClick={() => setReviewDialogOpen(true)}
              className="gap-1.5 text-xs font-semibold h-9 shadow-xs"
            >
              <Vote className="size-3.5" strokeWidth={1.75} />
              Review & Submit Ballot
            </Button>
          </div>

          {/* Review and Submit Dialog */}
          <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-card border border-border">
              <div className="p-6 space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Vote className="size-4 text-primary" strokeWidth={1.75} />
                    Confirm Official Ballot Submission
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-1">
                    Please review your candidate choices before casting your vote. Ballots cannot be modified once submitted.
                  </DialogDescription>
                </DialogHeader>

                <div className="rounded-lg border border-border/60 bg-muted/15 p-3.5 space-y-3 text-xs">
                  {positions.map((pos) => {
                    const chosenCand = pos.candidates.find((c) => c.id === votes[pos.id])
                    return (
                      <div key={pos.id} className="flex justify-between items-center py-1 border-b border-border/40 last:border-b-0">
                        <div>
                          <span className="font-medium text-muted-foreground block text-[11px]">{pos.title}</span>
                          <span className="font-semibold text-foreground text-xs">{chosenCand?.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {chosenCand?.avatarInitials}
                        </Badge>
                      </div>
                    )
                  })}
                </div>

                <div className="rounded-md bg-muted/30 p-2.5 text-[11px] text-muted-foreground border border-border/40">
                  By clicking "Cast My Ballot", your vote is cryptographically recorded. You will receive an official verifiable digital ballot receipt.
                </div>

                <DialogFooter className="flex flex-row justify-end gap-2 pt-2 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReviewDialogOpen(false)}
                    disabled={submittingBallot}
                    className="h-8 text-xs"
                  >
                    Modify Choices
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitBallot}
                    disabled={submittingBallot}
                    className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
                  >
                    {submittingBallot ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        Casting Ballot...
                      </>
                    ) : (
                      <>
                        <Vote className="size-3.5" strokeWidth={1.75} />
                        Cast My Ballot
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
