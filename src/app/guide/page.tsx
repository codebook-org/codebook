export default function GuidePage() {
  return (
    <div className="flex justify-center gap-12 max-w-5xl mx-auto px-6">
      {/* Sidebar/Simple ToC */}
      <aside className="text-monaco-txt font-mono text-xs w-40 sticky top-20 self-start space-y-3 text-sm">
        <div>
          <a href="#introduction" className="block font-semibold">
            {`> `} introduction
          </a>
        </div>

        <div className="space-y-1">
          <a href="#accounts" className="block font-semibold">
            {`> `} accounts
          </a>
          <div className="pl-3 space-y-1 opacity-80">
            <a href="#register" className="block">
              register
            </a>
            <a href="#login" className="block">
              log in
            </a>
          </div>
        </div>

        <div className="space-y-1">
          <a href="#solve-problems" className="block font-semibold">
            {`> `} solve problems
          </a>
          <div className="pl-3 space-y-1 opacity-80">
            <a href="#solve-description" className="block">
              description
            </a>
            <a href="#code-editor" className="block">
              code editor
            </a>
            <a href="#submission" className="block">
              submitting solutions
            </a>
            <a href="#test-case-viewing" className="block">
              view accuracy
            </a>
          </div>
        </div>

        <div className="space-y-1">
          <a href="#create-problems" className="block font-semibold">
            {`> `} create problems
          </a>
          <div className="pl-3 space-y-1 opacity-80">
            <a href="#create-description" className="block">
              description
            </a>
            <a href="#starter-code" className="block">
              starter code
            </a>
            <a href="#test-cases" className="block">
              test cases
            </a>
            <a href="#title" className="block">
              title
            </a>
          </div>
        </div>

        <div className="space-y-1">
          <a href="#profiles" className="block font-semibold">
            {`> `} profiles
          </a>
          <div className="pl-3 space-y-1 opacity-80">
            <a href="#displayed-info" className="block">
              displayed info
            </a>
            <a href="#problems-solved" className="block">
              problems solved
            </a>
            <a href="#published-problems" className="block">
              published problems
            </a>
          </div>
        </div>
      </aside>

      {/* Main Documentation */}
      <main className="min-h-[calc(100vh-4rem)] max-w-2xl mx-auto px-6 py-16 text-left space-y-16">
        {/* Introduction */}
        <section id="introduction" className="space-y-3 scroll-mt-20">
          <h1 className="text-monaco-txt font-mono text-2xl font-bold">
            {`> `}introduction
          </h1>
          <p className="text-sm opacity-80 leading-relaxed">
            welcome to codebook. whether you're here to prepare for upcoming
            technical interviews, test your problem solving limits, or design
            and share your own challenges, this guide will walk you through
            everything codebook has to offer. dive into the sections below to
            get started, or use the sidebar to jump to a section.
          </p>
        </section>

        {/*Account*/}
        <section id="accounts" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-monaco-txt font-mono text-xl font-bold border-b pb-1">
              {`> `}accounts
            </h2>

            <p className="text-sm opacity-80 leading-relaxed">
              flavour text, that occurs before our sections. Can be easily
              removed if we just want to get straight into the sections.
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="register" className="font-semibold scroll-mt-20">
              register
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo. Each subsection wrapped as a div, so images could
              probably be easily added if we want to add visual documentation.
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="login" className="font-semibold scroll-mt-20">
              log in
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>
        </section>

        {/*Solve Problems*/}
        <section id="solve-problems" className="space-y-6 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-monaco-txt font-mono text-xl font-bold border-b pb-1">
              {`> `}solve problems
            </h2>

            <p className="text-sm opacity-80 leading-relaxed">
              awesome flavour text that claims 1500 scientific documents say
              using codebook increases your iq by 100!
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="solve-description" className="font-semibold scroll-mt-20">
              description
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="code-editor" className="font-semibold scroll-mt-20">
              code editor
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="submission" className="font-semibold scroll-mt-20">
              submitting solutions
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="test-case-viewing" className="font-semibold scroll-mt-20">
              view accuracy
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>
        </section>

        {/* Create Problems */}
        <section id="create-problems" className="space-y-6 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-monaco-txt font-mono text-xl font-bold border-b pb-1">
              {`> `}create problems
            </h2>

            <p className="text-sm opacity-80 leading-relaxed">
              more flavour text claiming that donating 1000 dollars to each
              codebook member will extend life expectancy..
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="create-description" className="font-semibold scroll-mt-20">
              description
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="starter-code" className="font-semibold scroll-mt-20">
              starter code
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="test-cases" className="font-semibold scroll-mt-20">
              test cases
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="title" className="font-semibold scroll-mt-20">
              title
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>
        </section>

        {/* Profiles */}
        <section id="profiles" className="space-y-6 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-monaco-txt font-mono text-xl font-bold border-b pb-1">
              {`> `}profiles
            </h2>

            <p className="text-sm opacity-80 leading-relaxed">
              flavour text about codebook's awesome members!
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="displayed-info" className="font-semibold scroll-mt-20">
              displayed information
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="problems-solved" className="font-semibold scroll-mt-20">
              problems solved
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>

          <div className="space-y-1">
            <h3 id="published-problems" className="font-semibold scroll-mt-20">
              published problems
            </h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              nec sapien lorem. Proin in eleifend neque. Ut porttitor risus sed
              posuere commodo.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
