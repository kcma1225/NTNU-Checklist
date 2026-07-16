import { Hero } from "@/components/home/hero";
import { NeedsAttention } from "@/components/home/needs-attention";
import { TimelinePreview } from "@/components/home/timeline-preview";
import { HomeSidebar } from "@/components/home/sidebar";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NeedsAttention />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <TimelinePreview />
          <HomeSidebar />
        </div>
      </section>
    </>
  );
}
