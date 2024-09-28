import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export default function SelectableSearch({ values, onSelect }) {
  const [query, setQuery] = useState("");
  const [selectedvalue, setSelectedValue] = useState(null);

  const filterdValues =
    query === ""
      ? values
      : values.filter((value) => {
          return value.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selectedvalue}
      onChange={(value) => {
        setQuery("");
        setSelectedValue(value);
        onSelect(value);
      }}
    >
      <Label className="block text-sm font-medium leading-6 dark:text-white text-gray-900">
        Genre
      </Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="w-full rounded-md border-0 bg-white dark:bg-gray-800 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(value) => value}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filterdValues.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filterdValues.map((value) => (
              <ComboboxOption
                key={value.id}
                value={value.name}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 dark:text-white data-[focus]:bg-red-600 data-[focus]:text-white"
              >
                <span className="block truncate group-data-[selected]:font-semibold">
                  {value.name}
                </span>

                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-red-600 group-data-[selected]:flex group-data-[focus]:text-white">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
