export default function App() {
  return (
    <div className="min-h-dvh bg-bg-main text-text-primary">
      <section className="bg-bg-section px-6 py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-xl bg-bg-surface p-6 border border-border">
            <h1 className="text-3xl font-bold">Palette Showcase</h1>
            <p className="mt-2 text-text-secondary">
              Every color below is from your locked Tailwind tokens.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-bg-main p-4">
                <div className="text-sm font-semibold">Soft Beige</div>
                <div className="text-xs text-text-muted">bg-bg-main</div>
              </div>
              <div className="rounded-lg border border-border bg-bg-section p-4">
                <div className="text-sm font-semibold">Warm Cream</div>
                <div className="text-xs text-text-muted">bg-bg-section</div>
              </div>
              <div className="rounded-lg border border-border bg-bg-surface p-4">
                <div className="text-sm font-semibold">Off White</div>
                <div className="text-xs text-text-muted">bg-bg-surface</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-bg-surface p-6 border border-border">
            <h2 className="text-xl font-semibold">Text Colors</h2>
            <div className="mt-4 space-y-2">
              <p className="text-text-primary">Deep Brown: text-text-primary</p>
              <p className="text-text-secondary">Muted Brown: text-text-secondary</p>
              <p className="text-text-muted">Light Taupe: text-text-muted</p>
            </div>
          </div>

          <div className="rounded-xl bg-bg-surface p-6 border border-border">
            <h2 className="text-xl font-semibold">Primary / Action Colors</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-lg bg-primary-button px-4 py-2 font-medium text-bg-surface"
              >
                Primary (bg-primary-button)
              </button>
              <button
                type="button"
                className="rounded-lg bg-primary-hover px-4 py-2 font-medium text-bg-surface"
              >
                Hover (bg-primary-hover)
              </button>
              <button
                type="button"
                className="rounded-lg bg-primary-active px-4 py-2 font-medium text-bg-surface"
              >
                Active (bg-primary-active)
              </button>
            </div>
            <div className="mt-4">
              <a
                href="#"
                className="font-medium text-primary-button hover:text-primary-hover active:text-primary-active"
              >
                Link color (text-primary-button)
              </a>
            </div>
          </div>

          <div className="rounded-xl bg-bg-surface p-6 border border-border">
            <h2 className="text-xl font-semibold">Accent / UI Support</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <div className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-sm font-medium text-text-primary">
                  Warm Sand badge (bg-accent)
                </div>
                <div className="mt-3 text-sm text-text-secondary">
                  Border uses <span className="font-medium text-text-primary">border-border</span>
                </div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="text-sm font-semibold">Divider / Outline</div>
                <div className="mt-3 h-px w-full bg-border" />
                <div className="mt-3 text-xs text-text-muted">bg-border</div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="text-sm font-semibold">Icon / Inactive</div>
                <div className="mt-3 inline-flex items-center gap-2">
                  <span className="inline-block size-3 rounded-full bg-icon" />
                  <span className="text-icon">text-icon</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-bg-surface p-6 border border-border">
            <h2 className="text-xl font-semibold">Status / Feedback</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-lg border border-success bg-bg-surface p-4 text-success">
                Success (border-success / text-success)
              </div>
              <div className="rounded-lg border border-warning bg-bg-surface p-4 text-warning">
                Warning (border-warning / text-warning)
              </div>
              <div className="rounded-lg border border-danger bg-bg-surface p-4 text-danger">
                Danger (border-danger / text-danger)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}