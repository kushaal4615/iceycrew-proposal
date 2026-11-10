/* OVERVIEW · Archetype 10: single-column long-read with a pull quote and margin notes.
   Field 02 on the report, "Summary". The clothes rail printed full-width as a plate, then one reading
   column: the lead, the paragraphs, the pull quote (Hazel's own words on the call) on a plate under
   the facet ornament with the product's four marks drawn beneath it, and the report's three notes set
   in the margin on wide screens, as a plain list below it on narrow ones. */
import { IMG, MARKS, P } from '../../data/proposal'
import { Facet, Grade, Item, Photo } from '../ui/bits'
import { Reveal } from '../ui/motion'

function Note({ n, i }: { n: string; i: number }) {
  const [head, rest] = n.split(/:\s*/)
  return (
    <li>
      <Reveal delay={0.08 * i} className="flex gap-4">
        <span className="struck shrink-0 text-[0.8rem] text-[var(--primary-ink)]">{String(i + 1).padStart(2, '0')}</span>
        <p className="text-[length:var(--fs-small)] leading-snug text-[var(--ink-2)]">
          <span className="display-wide block text-[0.72rem] text-[var(--ink)]">{head}</span>
          <span className="mt-1.5 block">{rest}</span>
        </p>
      </Reveal>
    </li>
  )
}

export function Overview() {
  return (
    <section id="overview" aria-labelledby="overview-title" className="section-y relative overflow-x-clip bg-[var(--ground-2)]">
      <div className="shell">
        <Item no="02" time="F-02" name="Summary" id="overview-title" lines={['One photo,', <>one <em>grade</em>.</>]} />

        <Reveal className="mt-12">
          <figure className="relative">
            <Photo img={IMG.rack} eager className="aspect-[16/9] w-full sm:aspect-[21/9]" sizes="(min-width: 1408px) 1344px, 100vw" />
            <figcaption className="kicker mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--ink-3)]">
              <span className="normal-case">{IMG.rack.alt}</span>
              <span className="ml-auto">{IMG.rack.credit}</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,66ch)_minmax(14rem,1fr)] lg:gap-20 lg:pl-[8%]">
          <div className="min-w-0">
            <Reveal>
              <p className="text-[clamp(1.25rem,1.05rem+0.8vw,1.6rem)] font-medium leading-[1.4] text-[var(--ink)]">{P.overview.lead}</p>
            </Reveal>
            <p className="mt-8 text-[var(--ink-2)]">{P.overview.paragraphs[0]}</p>
            <p className="mt-6 text-[var(--ink-2)]">{P.overview.paragraphs[1]}</p>

            <Reveal delay={0.05} className="my-10 lg:-mr-12">
              <blockquote className="card px-6 py-8 sm:px-10 sm:py-10">
                <Facet width={64} />
                <p className="display-italic mt-5 text-[clamp(1.4rem,1.05rem+1.5vw,2.3rem)] text-[var(--ink)]">{P.overview.pull}</p>
                <footer className="kicker mt-4 text-[var(--ink-3)]">{P.client.contact}, on the call · {P.client.date}</footer>
                {/* the product's signature, drawn beside the words: the four marks every outfit gets */}
                <figure className="mt-7 border-t border-[var(--rule-strong)] pt-5">
                  <Grade scores={[88, 91, 82, 74]} height={10} />
                  <figcaption className="kicker mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[var(--ink-3)]">
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden className="inline-block h-2 w-2 rounded-[1px] bg-[var(--grade-strong)]" />
                      80 and up
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden className="inline-block h-2 w-2 rounded-[1px] bg-[var(--grade-good)]" />
                      60 to 79
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden className="inline-block h-2 w-2 rounded-[1px] bg-[var(--grade-work)]" />
                      Under 60
                    </span>
                    <span className="normal-case sm:ml-auto">{MARKS.join(' · ')}: the four marks every outfit gets</span>
                  </figcaption>
                </figure>
              </blockquote>
            </Reveal>

            <p className="text-[var(--ink-2)]">{P.overview.paragraphs[2]}</p>
          </div>

          <aside className="min-w-0 lg:pt-3" aria-label="Margin notes">
            <ol className="flex flex-col gap-6 border-t-2 border-[var(--ink)] pt-6 lg:sticky lg:top-24 lg:border-t-0 lg:border-l lg:border-[var(--rule-strong)] lg:pl-6 lg:pt-0">
              {P.overview.notes.map((n, i) => (
                <Note key={n} n={n} i={i} />
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  )
}
