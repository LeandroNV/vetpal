import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-12 w-56 rounded-xl" />
        <Skeleton className="h-5 w-80 rounded-md" />
      </header>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="justify-between gap-3">
            <CardHeader className="flex-row items-center justify-between gap-3 px-6 pb-0">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="size-9 rounded-xl" />
            </CardHeader>
            <CardContent className="flex flex-col gap-1 pb-1">
              <Skeleton className="h-8 w-14 rounded-lg" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Main content */}
      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <Skeleton className="size-11 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48 rounded-md" />
                  <Skeleton className="h-3 w-32 rounded-md" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="gap-3 px-6">
            <Skeleton className="size-11 rounded-2xl" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-44 rounded-lg" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-10 w-36 rounded-md" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
