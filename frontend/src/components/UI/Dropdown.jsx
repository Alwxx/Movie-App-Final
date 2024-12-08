import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

export default function Dropdown({ label, links }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold">
          {label}
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md  z-50 dark:bg-gray-800 bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {links &&
            links.map((link, index) => (
              <MenuItem key={index}>
                <Link
                  to={link.url}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-white data-[focus]:bg-gray-100 dark:data-[focus]:bg-gray-600 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  onClick={link.callback ?? null}
                >
                  {link.label}
                </Link>
              </MenuItem>
            ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
