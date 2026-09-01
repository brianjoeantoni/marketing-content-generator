import { CreatePosterClient } from "./components/create-poster-client"
import { WorkspaceShell } from "@/components/workspace/workspace-shell"

export default function CreatePosterPage() {
  return (
    <WorkspaceShell>
      <div className="px-4 pb-6 pt-2">
        <h1 className="text-3xl font-semibold tracking-normal">
          Create Poster
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Turn product details into a campaign poster preview.
        </p>
      </div>
      <CreatePosterClient />
    </WorkspaceShell>
  )
}
