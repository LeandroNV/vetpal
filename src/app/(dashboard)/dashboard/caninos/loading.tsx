import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CaninosLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-12 w-44 rounded-xl" />
          <Skeleton className="h-5 w-80 rounded-md" />
        </div>
        <Skeleton className="h-11 w-36 rounded-md" />
      </header>

      {/* Card grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="gap-4">
            <CardHeader className="flex-row items-center gap-4 px-6 pb-0">
              <Skeleton className="size-14 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
              <Separator />
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-10 rounded-sm" />
                    <Skeleton className="h-4 w-14 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="gap-2 pt-0">
              <Skeleton className="h-8 flex-1 rounded-md" />
              <Skeleton className="h-8 flex-1 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  );
}
