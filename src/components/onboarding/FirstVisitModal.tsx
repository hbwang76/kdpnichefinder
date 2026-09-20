'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const STORAGE_KEY = 'kdpnichefinder:onboarding-seen:v1'

export function FirstVisitModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const startButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setOpen(true)
      }
    } catch {
      setOpen(true)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => startButtonRef.current?.focus(), 40)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const markSeen = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // The modal should still be dismissible when storage is unavailable.
    }
  }

  const close = (remember: boolean) => {
    if (remember) markSeen()
    setOpen(false)
  }

  const startNow = () => {
    close(true)
    window.setTimeout(() => document.getElementById('niche-input')?.focus(), 0)
  }

  if (!open) return null

  return (
    <div
      className="onboarding-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close(true)
      }}
    >
      <section
        className="onboarding-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
      >
        <div className="onboarding-eyebrow">FIRST VISIT / 01</div>
        <h2 id="onboarding-title">Welcome — see how it works.</h2>
        <p id="onboarding-description" className="onboarding-lede">
          Three small steps. Then you can run your first niche.
        </p>

        <div className="onboarding-steps">
          <article className="onboarding-step onboarding-step-primary">
            <span className="onboarding-number">01</span>
            <div>
              <h3>Enter one book idea</h3>
              <p>A topic, audience, or format is enough to start.</p>
            </div>
            <button ref={startButtonRef} type="button" onClick={startNow}>
              Start now <span aria-hidden="true">→</span>
            </button>
          </article>

          <article className="onboarding-step">
            <span className="onboarding-number">02</span>
            <div>
              <h3>Watch the signals come together</h3>
              <p>See BSR, demand, and competition turn into a ranked view.</p>
            </div>
            <button type="button" className="onboarding-step-link" onClick={() => { close(true); router.push('/demo-video') }}>
              <span aria-hidden="true">▶</span> Play video
            </button>
          </article>

          <article className="onboarding-step">
            <span className="onboarding-number">03</span>
            <div>
              <h3>Take the next practical step</h3>
              <p>Use the action plan to shape your cover, title, and launch.</p>
            </div>
            <button type="button" className="onboarding-step-link" onClick={() => { close(true); router.push('/blog/best-kdp-niches-2026') }}>
              Read guide <span aria-hidden="true">→</span>
            </button>
          </article>
        </div>

        <button type="button" className="onboarding-skip" onClick={() => close(true)}>
          Got it, skip for now
        </button>
      </section>
    </div>
  )
}
