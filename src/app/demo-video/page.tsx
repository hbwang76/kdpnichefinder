import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'See how KDP Niche Finder works',
  description: 'A short walkthrough of the KDP Niche Finder workflow: enter an idea, review ranked niches, and choose your next step.',
  alternates: { canonical: '/demo-video' },
}

export default function DemoVideoPage() {
  return (
    <section className="demo-video-page">
      <div className="demo-video-copy">
        <span className="demo-video-eyebrow">FIELD GUIDE / DEMO</span>
        <h1>Find a profitable KDP niche in almost 30 seconds.</h1>
        <p>Enter a topic, review the signals, and leave with a practical next step.</p>
      </div>
      <div className="demo-video-frame">
        <video controls playsInline preload="metadata" poster="/assets/og-image.webp">
          <source src="/demo/demo-60s.mp4" type="video/mp4" />
          Your browser does not support the demo video.
        </video>
        <p className="demo-video-note">Product walkthrough · Free preview · No signup</p>
      </div>
    </section>
  )
}
