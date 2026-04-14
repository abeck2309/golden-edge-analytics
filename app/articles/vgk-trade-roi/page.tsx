import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageIntro } from "@/components/page-intro";

export default function VgkTradeRoiArticlePage() {
  return (
    <Container className="space-y-12 pb-20 pt-12 md:space-y-16 md:pt-16">
      <PageIntro
        eyebrow="Project Article"
        title="Rethinking VGK Trades: What the Data Actually Says"
        description="A project article on what the VGK Trade ROI model reveals once the emotion fades and the outcomes have time to settle."
      />

      <section className="panel p-6 md:p-8">
        <div className="space-y-2 border-b border-line pb-6">
          <p className="text-sm font-semibold text-gold-bright">Written by: Andrew, Creator of Golden Edge Analytics</p>
          <p className="text-sm text-mist">4/6/26</p>
        </div>

        <div className="mt-8 space-y-6 text-sm leading-8 text-mist md:text-base">
          <p>
            When the Vegas Golden Knights make a trade, the reaction is almost always immediate and
            emotional. Fans decide who &quot;won&quot; within hours, sometimes minutes. But those
            reactions rarely hold up over time.
          </p>

          <p>
            This project was built to step back from that moment and ask a different question:
          </p>

          <p className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white md:text-2xl">
            What did these trades actually produce, once everything played out?
          </p>

          <p>
            Using on-ice impact, expected value from future assets, and contract cost, the goal
            was not to recreate every storyline. It was to measure what each move turned into once
            the dust settled.
          </p>

          <p>
            And in doing that, a few trades stand out in ways that are not immediately obvious.
          </p>

          <div className="border-t border-line pt-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
              The Fleury Trade: A "Win" That Doesn&apos;t Feel Like One
            </h2>
            <p className="mt-4">
              The Marc-Andre Fleury trade is the clearest example of where data and intuition
              diverge.
            </p>
            <p className="mt-4">
              The model shows it as a win for Vegas. On paper, that makes sense:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Fleury&apos;s post-trade performance registers as negative value</li>
              <li>The return produced essentially no NHL value</li>
              <li>Vegas shed a significant contract</li>
            </ul>
            <p className="mt-4">
              So statistically, it looks like Vegas moved out negative value and gained
              flexibility. In terms of cap efficiency, Fleury&apos;s post-trade impact comes out
              to -1.617 GSAx per million, driven largely by the situation he was traded into.
            </p>
            <p className="mt-4">
              But that does not tell the full story.
            </p>
            <p className="mt-4">
              Fleury was traded into a Chicago team that was already struggling, and that context
              heavily influenced his measured impact. The model captures the outcome, but not the
              environment it occurred in.
            </p>
            <p className="mt-4">
              More importantly, the trade had a ripple effect.
            </p>
            <p className="mt-4">
              Moving Fleury&apos;s contract helped open the path for what came next, including the
              ability to acquire Jack Eichel just a few months later. Without that cap flexibility,
              it is hard to see how Vegas pulls off that deal, and without that deal, it is even
              harder to see a Stanley Cup run materializing in the same way.
            </p>
            <p className="mt-4">
              So while the model calls it a win, it is better understood as a context-driven result
              with long-term implications, not a clean evaluation of the decision itself.
            </p>
          </div>

          <div className="border-t border-line pt-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
              Tomas Tatar: Same Player, Completely Different Outcome
            </h2>
            <p className="mt-4">
              Tomas Tatar is one of the most interesting cases in the entire dataset.
            </p>
            <p className="mt-4">
              In Vegas, he was underwhelming and quickly moved. At the time, the return felt like a
              necessary correction. But once he got to Montreal, something changed.
            </p>
            <p className="mt-4">
              Measured over his tenure there, Tatar actually ends up with one of the highest xGAR
              per million figures in the project at 2.409.
            </p>
            <p className="mt-4">
              Same player. Different environment. Completely different result.
            </p>
            <p className="mt-4">
              This is one of the clearest examples of what the model reveals:
            </p>
            <p className="mt-4 font-[family-name:var(--font-heading)] text-xl font-semibold text-white">
              Trades do not just move talent, they change context.
            </p>
            <p className="mt-4">
              And context matters more than most people think.
            </p>
          </div>

          <div className="border-t border-line pt-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
              Nick Suzuki: The Value That Keeps Growing
            </h2>
            <p className="mt-4">
              When the Max Pacioretty trade happened, it was widely seen as a win-now move for
              Vegas and a future-focused move for Montreal. That framing still holds, but the scale
              of it has shifted over time.
            </p>
            <p className="mt-4">
              Nick Suzuki&apos;s development shows up clearly in the cap efficiency results. His
              value relative to cost has steadily increased, with an xGAR per million of 2.203,
              reinforcing how impactful that asset has become over time.
            </p>
            <p className="mt-4">
              What started as a promising prospect has turned into a player delivering significant
              value relative to his contract. As that value compounds, the long-term side of the
              trade becomes more meaningful.
            </p>
            <p className="mt-4">
              This is exactly what expected value is meant to capture, not just what a prospect is
              worth at the moment of the trade, but what they can become.
            </p>
          </div>

          <div className="border-t border-line pt-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
              The Eichel Trade: From "Win-Win" to Something Else
            </h2>

            <figure className="md:float-right md:mb-4 md:ml-6 md:mt-2 overflow-hidden rounded-[1.4rem] border border-line bg-white/[0.02] md:w-[320px]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/eichel-vgk.png"
                  alt="Jack Eichel with Vegas Golden Knights branding"
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="border-t border-line px-4 py-3 text-xs uppercase tracking-[0.14em] text-mist">
                NHL
              </figcaption>
            </figure>

            <p className="mt-4">
              At the time, the Jack Eichel trade was widely labeled a win-win.
            </p>
            <p className="mt-4">
              Vegas got a true number one center. Buffalo got multiple high-end assets and future
              value. Both sides seemed to get what they needed.
            </p>
            <p className="mt-4">
              Early on, the model reflects that. The trade looks balanced.
            </p>
            <p className="mt-4">
              But over time, the gap has widened.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Eichel&apos;s realized value for Vegas continues to grow, with an xGAR per million of 1.188</li>
              <li>Alex Tuch has been productive, but not at the same level</li>
              <li>Peyton Krebs has not developed into the impact player many expected, reflected in an xGAR per million of -0.856</li>
            </ul>
            <p className="mt-4">
              As that plays out, what once looked like a fair exchange starts to lean more clearly
              in Vegas&apos; favor.
            </p>
            <p className="mt-4">
              This is one of the core ideas behind the project:
            </p>
            <p className="mt-4 font-[family-name:var(--font-heading)] text-xl font-semibold text-white">
              Trade outcomes are not static, they evolve.
            </p>
          </div>

          <div className="border-t border-line pt-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
              Why This Approach Matters
            </h2>
            <p className="mt-4">
              This model does not try to capture everything. It intentionally leaves out:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>locker room impact</li>
              <li>coaching fit</li>
              <li>narrative context</li>
            </ul>
            <p className="mt-4">
              Not because those things do not matter, but because they cannot be measured
              consistently.
            </p>
            <p className="mt-4">
              Instead, it focuses on:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>what players actually produced</li>
              <li>what future assets are likely to become</li>
              <li>what it cost to acquire that value</li>
            </ul>
            <p className="mt-4">
              That tradeoff creates a cleaner, more comparable way to look at decisions over time.
            </p>
          </div>

          <div className="border-t border-line pt-6">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
              Final Thought
            </h2>
            <p className="mt-4">
              Vegas has built its identity on aggressive, high-stakes trades. Some work
              immediately. Some take years to fully understand. Some only make sense in hindsight.
            </p>
            <p className="mt-4">
              What this project shows is that those trades are rarely as simple as good or bad.
            </p>
            <p className="mt-4">
              They are a mix of:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>timing</li>
              <li>context</li>
              <li>development</li>
              <li>and cost</li>
            </ul>
            <p className="mt-4">
              And sometimes, the most important part of a trade is not what it does in the moment,
              it is what it makes possible next.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/articles" className="text-sm font-semibold text-gold-bright hover:text-white">
            Back to articles
          </Link>
        </div>
      </section>
    </Container>
  );
}
