"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { ToggleTheme } from "./toggleTheme";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <>
      <nav className="w-full p-4 md:p-6 shadow-sm bg-transparent text-white z-10 mb-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <a
            href="#"
            className="text-xl font-bold mb-4 md:mb-0 text-black dark:text-white"
          >
            True Feedback
          </a>
          {session ? (
            <div className="flex gap-5 items-center">
              <h1 className="mr-4 text-black dark:text-white">
                Welcome, {user.username || user.email}
              </h1>
              <Button
                className="w-full md:w-auto bg-black text-white dark:bg-slate-100 dark:text-black"
                variant="outline"
                onClick={() => signOut()}
              >
                Logout
              </Button>
              <ToggleTheme />
            </div>
          ) : (
            <div className="flex gap-5 items-center">
              <Link href="/sign-in">
                <Button
                  className="w-full md:w-auto bg-black text-white dark:bg-slate-100 dark:text-black"
                  variant="outline"
                >
                  Login
                </Button>
              </Link>
              <ToggleTheme />
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
