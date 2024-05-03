import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "./ui/moving-border";
import Link from "next/link";

function Hero() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center gap-5 px-4 md:px-24 py-8 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="relative z-10 text-lg md:text-7xl  dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold text-gray-500">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>
        <Link href="/sign-up">
          <Button
            borderRadius="1.75rem"
            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 z-10 top-0 left-0 right-0 bottom-0"
          >
            Get Started
          </Button>
        </Link>
      </main>
      <BackgroundBeams />
    </>
  );
}

export default Hero;
