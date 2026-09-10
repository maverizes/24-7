import { ObjectGridSkeleton } from "@/components/object/object-grid";
import { Skeleton } from "@/components/ui/skeleton";

/** Qidiruv natijalari yuklanayotgan holat (TZ 43) — bo'sh ekran bo'lmaydi. */
export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <Skeleton className="h-11 w-full" />
      <div className="mt-4 grid gap-5 lg:grid-cols-[16rem_1fr]">
        <div className="hidden lg:block">
          <Skeleton className="h-[28rem] w-full rounded-card" />
        </div>
        <div>
          <Skeleton className="mb-3 h-5 w-40" />
          <ObjectGridSkeleton count={6} columns={1} />
        </div>
      </div>
    </div>
  );
}
