import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function CitasLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-12 w-40 rounded-xl" />
          <Skeleton className="h-5 w-72 rounded-md" />
        </div>
        <Skeleton className="h-11 w-32 rounded-md" />
      </header>

      {/* Tabs */}
      <div className="flex flex-col gap-6">
        <div className="flex gap-1">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="gap-4">
              <CardHeader className="gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-5 w-44 rounded-lg" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-4 w-40 rounded-md" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2 pt-0">
                <Skeleton className="h-8 w-28 rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
