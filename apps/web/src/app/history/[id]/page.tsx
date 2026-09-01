import { HistoryDetailClient } from "./components/history-detail-client"
import { WorkspaceShell } from "@/components/workspace/workspace-shell"

export default async function HistoryDetailPage(
  props: PageProps<"/history/[id]">
) {
  const { id } = await props.params

  return (
    <WorkspaceShell>
      <div className="px-4 pb-6 pt-2">
        <h1 className="text-3xl font-semibold tracking-normal">
          Poster Details
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Review the generated poster and its saved campaign details.
        </p>
      </div>
      <HistoryDetailClient posterId={id} />
    </WorkspaceShell>
  )
}
