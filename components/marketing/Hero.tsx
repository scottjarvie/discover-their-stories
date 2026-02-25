import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36">
      <div className="absolute -left-36 top-14 h-80 w-80 rounded-full bg-[#c57d3933] blur-3xl animate-drift" />
      <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-[#234d5e2e] blur-3xl animate-drift [animation-delay:1.8s]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="animate-rise-in text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#b79f7a88] bg-[#efe4cdcc] px-4 py-2 text-sm text-[#35505c] shadow-[0_12px_30px_-20px_#29343d]">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Discover Their Stories in the AI Era</span>
          </div>

          <h1
            className="mt-8 text-5xl leading-[0.98] text-[#1d212a] sm:text-6xl lg:text-7xl"
            data-display="true"
          >
            Discover Their Stories
          </h1>
          <p
            className="mx-auto mt-5 max-w-4xl text-4xl leading-[1.03] text-[#9f5a2d] sm:text-5xl lg:text-6xl"
            data-display="true"
          >
            The Heart is in the Story.
          </p>

          <div className="mx-auto mt-7 max-w-5xl rounded-[2.2rem] border border-[#b79f7a66] bg-[#efe3cbdd] px-8 py-10 shadow-[0_26px_50px_-38px_#111] sm:px-10 sm:py-12">
            <p className="text-[13px] uppercase tracking-[0.22em] text-[#6d6249]">The Heart Is In The Story.</p>
            <p className="mt-5 text-4xl leading-tight text-[#24323e] sm:text-5xl lg:text-6xl" data-display="true">
              “He shall turn the heart of the fathers to the children, and the heart of the
              children to their fathers...”
            </p>
            <p className="mt-6 text-2xl text-[#4e5a64] sm:text-3xl">Malachi 4:6</p>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-[#3b4650] sm:text-xl">
            Family history is entering a new age. AI lets you gather evidence faster, uncover
            deeper context, and transform names and dates into vivid stories your family can carry
            forward.
          </p>
        </div>
      </div>
    </section>
  );
}
