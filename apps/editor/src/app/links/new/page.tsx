import { LinkForm } from "@/components/link-form";

export default function NewLinkPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">新增連結</h1>
      <LinkForm />
    </div>
  );
}
