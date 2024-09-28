import { useState } from "react";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import ThemeContext from "../../context/ThemeContext";
import Toggle from "../UI/Toggle";
import clsx from "clsx";
import AuthContext from "../../context/AuthContext";
import Spinner from "../UI/Spinner";

const navigation = [
  { name: "My Favorites", href: "/favorites" },
  { name: "Search", href: "/search" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const { user, isLoading, setToken, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwt");
  };

  const location = useLocation();
  return (
    <header
      className={clsx(
        "shadow",
        location.pathname == "/"
          ? "transition-all fixed w-full bg-[rgba(255,255,255,0.14)] dark:bg-[rgba(0,0,0,0.4)]  z-10 text-white"
          : "bg-gray-100 dark:bg-gray-900"
      )}
    >
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link to="/">
            <span className="sr-only">CineHub</span>
            <img
              alt=""
              src="https://tailwindui.com/img/logos/mark.svg?color=red&shade=600"
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="hidden lg:flex flex-1 lg:gap-x-12 justify-center items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                "text-sm font-semibold leading-6 transition   rounded px-4 py-2",
                location.pathname == "/"
                  ? "text-white "
                  : location.pathname == item.href
                  ? "text-red-500 dark:text-red-500 font-bold"
                  : "text-gray-900 dark:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
          {isLoading ? (
            <Spinner />
          ) : user ? (
            <div
              className={clsx(
                "text-sm font-semibold leading-6 transition   rounded px-4 py-2",
                location.pathname == "/"
                  ? "text-white"
                  : "text-gray-900 dark:text-white"
              )}
            >
              Hi {user.username}!
              <div className="underline cursor-pointer" onClick={handleLogout}>
                Logout
              </div>
            </div>
          ) : (
            <Link
              to={`/login`}
              className={clsx(
                "text-sm font-semibold leading-6 transition   rounded px-4 py-2",
                location.pathname == "/"
                  ? "text-white "
                  : location.pathname == "/login"
                  ? "text-red-500 dark:text-red-500 font-bold"
                  : "text-white"
              )}
            >
              Login
            </Link>
          )}
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        <div
          className={clsx(
            "theme-switch flex-1  flex items-center justify-center gap-2 text-xs",
            location.pathname == "/"
              ? "text-white"
              : "text-gray-900 dark:text-white"
          )}
        >
          Light Mode
          <Toggle value={theme} setValue={toggleTheme} />
          Dark Mode
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center gap-x-6">
            <Link href="#/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindui.com/img/logos/mark.svg?color=red&shade=600"
                className="h-8 w-auto"
              />
            </Link>
            <Link
              to="/sign-up"
              className="ml-auto rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Sign up
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                      location.pathname == item.href && "text-red-500"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  to="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
