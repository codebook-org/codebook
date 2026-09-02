export default async function AboutPage() {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-center max-w-2xl mx-auto px-6 py-16 text-left">
        <section className="mb-8">
          <h1 className="text-monaco-txt font-mono text-2xl font-bold mb-3">
            {`> `}about
          </h1>
          <p className="text-sm opacity-80 leading-relaxed">
            codebook is a collaborative coding platform designed to make technical interview prep and practice interactive.
            unlike other traditional, solo-grind platforms, codebook lets you take the wheel, letting you create and publish your own problems.
          </p>
        </section>
  
        <section>
          <h1 className="text-monaco-txt font-mono text-xl font-bold mb-3">
            {`> `}features
          </h1>
          <ul className="list-disc pl-5 space-y-2 text-sm opacity-80 leading-relaxed">
            <li>
              <strong>community problems</strong> — write, test, and publish your
              own coding problems and test cases.
            </li>
            <li>
              <strong>competitive programming</strong> — an advanced alternative
              to other platforms.
            </li>
            <li>
              <strong>social outreach</strong> — access other profiles, share the
              problems you create, or show off your trophy shelf of solved
              problems!
            </li>
          </ul>
        </section>
      </main>
    );
  }