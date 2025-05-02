const Page = () => {
  return (
    <div>

      <div className="mb-12 text-center">
        <h1 className="text-foreground text-sm font-medium">Agents</h1>
        <div className="text-foreground mx-auto my-4 max-w-2xl text-3xl font-medium tracking-tight md:text-5xl">Your every day AI assistant</div>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">a growing set of personal AI agents, built for ideas, writing, and product work.</p>
      </div>

      <div className="mt-12">
        <h2 className="text-foreground mb-1 text-lg font-medium">Research</h2>
        <button className="group w-full items-end justify-start" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-«r30»" data-state="closed" data-slot="dialog-trigger">
          <div className="relative min-h-[140px] w-full overflow-hidden rounded-2xl shadow-lg md:aspect-[4/1]">
          <div className="absolute inset-0">
            <img alt="Cloud background" className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" src="/banner_cloud.jpg" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent dark:from-black/70 dark:via-black/20">
            </div>
            <div className="relative flex h-full min-h-[140px] flex-col p-5">
              <div className="mt-auto flex flex-row items-end justify-between gap-2">
                <div className="flex flex-col items-start gap-0.5 text-left">
                  <h3 className="text-2xl leading-tight font-medium text-white">Zola Research</h3>
                  <p className="text-sm text-white/80">Summarizes sources, finds answers. Helps you explore any topic, fast, focused, and clear.</p>
                  </div>
                  <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256" className="h-4 w-4 text-white">
                  <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z">
                    </path>
                  </svg>
                  </div>
                  </div>
                  </div>
                  </div>
                  </button>
                  </div>
    </div>
  );
};

export default Page;