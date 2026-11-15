import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { PageCopy } from '../content'

interface WorkflowSectionProps {
  workflow: PageCopy['workflow']
}

export function WorkflowSection({ workflow }: WorkflowSectionProps) {
  const listRef = useRef<HTMLOListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const items = Array.from(list.querySelectorAll<HTMLLIElement>(':scope > li'))
    if (!items.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = items.indexOf(entry.target as HTMLLIElement)
            if (idx !== -1) setActiveIndex(idx)
          }
        }
      },
      { rootMargin: '-32% 0px -48% 0px', threshold: 0 },
    )

    for (const item of items) observer.observe(item)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="landing-workflow"
      id="workflow"
      tabIndex={-1}
      aria-labelledby="workflow-title"
    >
      <div className="landing-shell landing-workflow__layout">
        <div className="landing-workflow__intro">
          <p className="landing-section-kicker">{workflow.kicker}</p>
          <h2 id="workflow-title">
            {workflow.titleA}
            <br />
            {workflow.titleB}
          </h2>
          <p>{workflow.intro}</p>
          <a className="landing-inline-link" href="#demo">
            {workflow.cta} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <ol className="landing-workflow__steps" ref={listRef}>
          {workflow.steps.map((step, index) => (
            <li
              key={step.number}
              className={activeIndex === index ? 'is-active' : undefined}
            >
              <span className="workflow-step__number">{step.number}</span>
              <div>
                <p className="workflow-step__english">{step.english}</p>
                <h3>{step.title}</h3>
                <p className="workflow-step__description">{step.description}</p>
                <ul>
                  {step.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
