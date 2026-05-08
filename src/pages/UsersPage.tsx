import { Construction } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export function UsersPage() {
  return (
    <div>
      <PageHeader
        title="Users"
        description="Manajemen pengguna sistem SmartPatrol"
      />
      <div className="bg-card border border-border rounded-[6px] p-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Construction />
            </EmptyMedia>
            <EmptyTitle>Segera Hadir</EmptyTitle>
            <EmptyDescription>
              Halaman manajemen users sedang dalam pengembangan. Fitur ini akan tersedia setelah API backend Users selesai diimplementasikan.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </div>
  );
}
