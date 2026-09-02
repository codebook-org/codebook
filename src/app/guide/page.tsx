export default function GuidePage() {
    return (
      <main className="min-h-[calc(100vh-4rem)] max-w-2xl mx-auto px-6 py-16 text-left space-y-16">       
        {/* Introduction */}
        <section className="space-y-3">
          <h1 className="text-monaco-txt font-mono text-2xl font-bold">
            {`> `}introduction
          </h1>
          <p className="text-sm opacity-80 leading-relaxed">
            welcome to codebook. whether you're here to prepare for upcoming technical interviews,
            test your problem solving limits, or design and share your own challenges,
            this guide will walk you through everything codebook has to offer.
            dive into the sections below to get started, or use the sidebar to jump to a section.
          </p>
        </section>
  
        {/*Account*/}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-monaco-txt font-mono text-xl font-bold border-b pb-1">
              {`> `}accounts
            </h2>

            <p className="text-sm opacity-80 leading-relaxed">
              flavour text, that occurs before our sections. Can be easily removed if we just want to get straight into the sections.
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-semibold">register</h3>

            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Aenean nec sapien lorem. Proin in eleifend neque. 
              Ut porttitor risus sed posuere commodo.

              Each subsection wrapped as a div, so images could probably be easily added if we want to add visual documentation.
            </p>
          </div>
  
          <div className="space-y-1">
            <h3 className="font-semibold">log in</h3>
            
            <p className="text-sm opacity-80 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Aenean nec sapien lorem. Proin in eleifend neque. 
              Ut porttitor risus sed posuere commodo.
            </p>
          </div>
        </section>

      </main>
    );
  }