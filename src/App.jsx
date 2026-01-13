export default function App() {
  return (
    <div className="min-h-dvh bg-bg-main text-text-primary">
      <section className="bg-bg-section px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-xl bg-bg-surface p-6 border border-border">
          <h1 className="text-3xl font-bold">Hello world!</h1>
          <p className="mt-2 text-text-secondary">
            This project is using the locked Prana palette via Tailwind tokens.
          </p>
          <button
            type="button"
            className="mt-6 rounded-lg bg-primary-button px-4 py-2 font-medium text-bg-surface hover:bg-primary-hover active:bg-primary-active"
          >
            Primary Action
          </button>
        </div>
      </section>
    </div>
  )
}