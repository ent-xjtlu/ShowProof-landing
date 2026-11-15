import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { PageCopy } from '../content'

interface DemoSectionProps {
  demo: PageCopy['demo']
}

const FILM_PATH = '/exvis-overview'

export function DemoSection({ demo }: DemoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldPreload, setShouldPreload] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || shouldPreload) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldPreload(true)
          observer.disconnect()
        }
      },
      { rootMargin: '480px 0px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [shouldPreload])

  return (
    <section
      className="landing-demo"
      id="demo"
      tabIndex={-1}
      aria-labelledby="demo-title"
      ref={sectionRef}
    >
      <div className="landing-shell">
        <div className="landing-section-heading">
          <h2 id="demo-title">{demo.title}</h2>
          <p>{demo.intro}</p>
        </div>
        <div className="landing-demo__frame">
          <video
            ref={videoRef}
            aria-label={demo.aria}
            src={`${FILM_PATH}.mp4`}
            poster={`${FILM_PATH}.webp`}
            controls
            muted
            preload={shouldPreload ? 'metadata' : 'none'}
            playsInline
          >
            <a href={`${FILM_PATH}.mp4`}>{demo.fallback}</a>
          </video>
        </div>
        <a className="landing-demo__back" href="#top">
          {demo.back} <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
