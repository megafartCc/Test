const highlights = [
  {
    title: 'Simple foundation',
    description: 'A landing page structure that is easy to expand with new sections and routes.',
  },
  {
    title: 'Tailwind styling',
    description: 'Utility-first classes keep the design consistent and fast to iterate on.',
  },
  {
    title: 'Ready to grow',
    description: 'Perfect starting point for adding products, features, testimonials, or a backend later.',
  },
]

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-400">Your Brand</p>
        </div>
        <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
          <a className="transition hover:text-white" href="#features">
            Features
          </a>
          <a className="transition hover:text-white" href="#about">
            About
          </a>
          <a className="transition hover:text-white" href="#contact">
            Contact
          </a>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-16 pt-10 lg:px-8 lg:pt-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              React + Tailwind starter layout
            </span>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Welcome to your next website.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Launch with a polished hero section, a clean feature grid, and a modern responsive layout that gives you a strong starting point.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full bg-accent-500 px-6 py-3 font-medium text-white shadow-glow transition hover:bg-accent-400"
              >
                Explore layout
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-medium text-slate-200 transition hover:border-white/40 hover:bg-white/5"
              >
                Get in touch
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-accent-400">Preview</p>
              <div className="mt-6 space-y-4">
                <div className="h-3 w-24 rounded-full bg-white/20" />
                <div className="h-3 w-full rounded-full bg-white/10" />
                <div className="h-3 w-5/6 rounded-full bg-white/10" />
                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="h-24 rounded-xl bg-gradient-to-br from-accent-500/40 to-cyan-300/10" />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="h-24 rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-purple-300/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-accent-400/40"
            >
              <h2 className="text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
            </article>
          ))}
        </section>

        <section
          id="about"
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-400">About this layout</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Structured for clarity and easy expansion.</h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                This page is organized into a clear hero, reusable feature cards, and a callout section so you can keep building without needing to refactor the whole front end later.
              </p>
            </div>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/50 p-6 text-sm text-slate-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span>Responsive layout</span>
                <span className="text-accent-400">Included</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span>Backend required</span>
                <span className="text-accent-400">Not yet</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Future-ready sections</span>
                <span className="text-accent-400">Easy to add</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-accent-400/30 bg-accent-500/10 p-8 md:flex-row md:items-center"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-300">Ready when you are</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Swap this section for your real CTA later.</h2>
          </div>
          <a
            href="mailto:hello@example.com"
            className="inline-flex rounded-full bg-white px-6 py-3 font-medium text-slate-950 transition hover:bg-slate-100"
          >
            hello@example.com
          </a>
        </section>
      </main>
    </div>
  )
}

export default App
