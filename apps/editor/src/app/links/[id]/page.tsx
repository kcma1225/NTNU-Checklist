import { notFound } from "next/navigation";
import { LinkForm } from "@/components/link-form";
import { DeleteButton } from "@/components/delete-button";
import { getLink, NotFoundError } from "@/lib/data-store";

export default async function EditLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let link;
  try {
    link = getLink(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">編輯連結</h1>
        <DeleteButton resource="links" id={link.id} label={link.label} redirectTo="/links" />
      </div>
      <LinkForm link={link} />
    </div>
  );
}
