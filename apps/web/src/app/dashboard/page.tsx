import { BarChart3Icon, FileTextIcon, ImagePlusIcon } from "lucide-react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { WorkspaceShell } from "@/components/workspace/workspace-shell"

export default function Page() {
  return (
    <WorkspaceShell>
      <div className="px-4 pb-6 pt-2">
        <h1 className="text-3xl font-semibold tracking-normal">Dashboard</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Monitor your marketing content workflow from one workspace.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ImagePlusIcon className="size-4" />
                Create
              </CardTitle>
              <CardDescription>
                Start a new poster from product and campaign details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/create-poster"
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Open creator
              </Link>
            </CardContent>
          </Card>
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileTextIcon className="size-4" />
                History
              </CardTitle>
              <CardDescription>
                Review saved poster records from your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/history"
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                View history
              </Link>
            </CardContent>
          </Card>
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3Icon className="size-4" />
                Overview
              </CardTitle>
              <CardDescription>
                Generation stats and activity summaries will live here later.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </WorkspaceShell>
  )
}
