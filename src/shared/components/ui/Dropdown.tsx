import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

interface DropdownProps {
  button: React.ReactNode;
  children: React.ReactNode;
}

export default function Dropdown({ button, children }: DropdownProps) {
  return (
    <Menu>
      <Menu.Button className="inline-flex items-center focus:outline-none">
        {button}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items portal className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 max-h-60 overflow-y-auto z-[var(--z-dropdown)]">
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}