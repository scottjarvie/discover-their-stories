import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Compass, ScrollText, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-36">
      <div className="absolute -left-36 top-14 h-80 w-80 rounded-full bg-[#c57d3933] blur-3xl animate-drift" />
      <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-[#234d5e2e] blur-3xl animate-drift [animation-delay:1.8s]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:px-8">
        <div className="animate-rise-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#b79f7a88] bg-[#efe4cdcc] px-4 py-2 text-sm text-[#35505c] shadow-[0_12px_30px_-20px_#29343d]">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Discover Their Stories in the AI Era</span>
          </div>

          <h1
            className="mt-8 text-5xl leading-[0.98] text-[#1d212a] sm:text-6xl lg:text-7xl"
            data-display="true"
          >
            Discover Their Stories
            <span className="mt-2 block text-3xl text-[#9f5a2d] sm:text-4xl lg:text-5xl">
              and bind generations together.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#3b4650] sm:text-xl">
            Family history is entering a new age. AI lets you gather evidence faster, uncover
            deeper context, and transform names and dates into vivid stories your family can carry
            forward.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-[3.25rem] rounded-full bg-[#234d5e] px-8 text-base font-semibold text-[#f7f3e8] shadow-[0_18px_30px_-22px_#0f2730] hover:bg-[#1f4554]"
            >
              <Link href="/app" className="flex items-center gap-2">
                Start Discovering
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-[3.25rem] rounded-full border-[#9f5a2d55] bg-[#f8f1e2dd] px-8 text-base text-[#5e4d2f] hover:bg-[#f5e9d2]"
            >
              <Link href="/features">See the Toolset</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#c7b38f80] bg-[#fbf7eecc] p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-[#6c6a56]">Discover</p>
              <p className="mt-2 text-sm text-[#24323e]">Find hidden details.</p>
            </div>
            <div className="rounded-2xl border border-[#c7b38f80] bg-[#fbf7eecc] p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-[#6c6a56]">Connect</p>
              <p className="mt-2 text-sm text-[#24323e]">Connect people, places, and events.</p>
            </div>
            <div className="rounded-2xl border border-[#c7b38f80] bg-[#fbf7eecc] p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-[#6c6a56]">Preserve</p>
              <p className="mt-2 text-sm text-[#24323e]">Preserve stories for generations.</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#b79f7a66] bg-[#efe3cbcc] p-6 shadow-[0_20px_30px_-30px_#5c492f]">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6d6249]">
              The Heart is in the Story.
            </p>
            <p className="mt-3 text-xl leading-snug text-[#24323e]" data-display="true">
              “He shall turn the heart of the fathers to the children, and the heart of the children
              to their fathers...”
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#4e5a64]">Malachi 4:6</p>
          </div>
        </div>

        <div className="animate-rise-in [animation-delay:120ms]">
          <div className="hero-grain relative overflow-hidden rounded-[2rem] border border-[#9f5a2d44] bg-gradient-to-br from-[#17343f] via-[#1f4554] to-[#2f5b53] p-6 text-[#f7f3e8] shadow-[0_30px_60px_-34px_#111] sm:p-8">
            <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full border border-[#f2d0a255] animate-pulse-ring" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#f5c98f1a] blur-2xl" />

            <p className="text-xs uppercase tracking-[0.2em] text-[#e7d7ba]">Discovery Engine</p>
            <h2 className="mt-4 text-4xl leading-tight text-[#fff6e5]" data-display="true">
              From archival fragments to living storylines
            </h2>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 rounded-xl border border-[#f2d7af45] bg-[#ffffff10] p-4">
                <div className="mt-0.5 rounded-full border border-[#f7e2bf80] bg-[#f7e2bf22] p-2">
                  <Compass className="h-4 w-4 text-[#f8d7a1]" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[#f1d9b1]">Find Signals</p>
                  <p className="mt-1 text-sm text-[#f3eadc]">
                    Surface people, places, and links fast.
                  </p>
                </div>
              </div>

              <div className="shimmer-divider h-px w-full" />

              <div className="flex items-start gap-4 rounded-xl border border-[#f2d7af45] bg-[#ffffff10] p-4">
                <div className="mt-0.5 rounded-full border border-[#f7e2bf80] bg-[#f7e2bf22] p-2">
                  <Bot className="h-4 w-4 text-[#f8d7a1]" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[#f1d9b1]">Build Context</p>
                  <p className="mt-1 text-sm text-[#f3eadc]">
                    Connect events and resolve conflicts.
                  </p>
                </div>
              </div>

              <div className="shimmer-divider h-px w-full" />

              <div className="flex items-start gap-4 rounded-xl border border-[#f2d7af45] bg-[#ffffff10] p-4">
                <div className="mt-0.5 rounded-full border border-[#f7e2bf80] bg-[#f7e2bf22] p-2">
                  <ScrollText className="h-4 w-4 text-[#f8d7a1]" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[#f1d9b1]">Tell the Story</p>
                  <p className="mt-1 text-sm text-[#f3eadc]">
                    Write clear stories grounded in evidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
