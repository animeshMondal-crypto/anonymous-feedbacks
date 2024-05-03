"use client";

import Hero from "@/components/Hero";

export default function Home() {
  // const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <div className="flex flex-col min-h-screen relative">
      <Hero />
      {/* Footer */}

      <footer className="text-center p-4 md:p-6 dark:bg-gray-900 bg-slate-500 text-white">
        © 2024 True Feedback. All rights reserved.
      </footer>
    </div>
  );
}
