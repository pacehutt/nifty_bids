import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import {
  BellIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useTheme } from "next-themes";

type Props = {};

const Header = (props: Props) => {
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="max-w-6xl mx-auto">
      <nav className="flex justify-between items-center p-2">
        <div className="flex items-center gap-3 text-sm">
          {address ? (
            <button onClick={disconnect} className="connectWalletBtn">
              Hi,{address.slice(0, 5) + "..." + address.slice(-4)}{" "}
            </button>
          ) : (
            <button
              onClick={() => connectWithMetamask()}
              className="connectWalletBtn"
            >
              Connect Wallet
            </button>
          )}

          <p className="hidden md:inline-flex cursor-pointer hover:link">
            Daily Deals
          </p>
          <p className="hidden md:inline-flex cursor-pointer hover:link">
            Help and Contact
          </p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <p className="hidden md:inline-flex cursor-pointer hover:link">
            Ship to
          </p>
          <p className="hidden md:inline-flex cursor-pointer hover:link">
            Sell
          </p>
          <p className="hidden md:inline-flex cursor-pointer hover:link">
            WatchList
          </p>

          <Link
            href={"/additem"}
            className="flex items-center font-semibold hover:link"
          >
            Add to Inventory
            <ChevronDownIcon className="h-4" />
          </Link>

          <BellIcon className="h-6 w-6"></BellIcon>
          <ShoppingCartIcon className="h-6 w-6"></ShoppingCartIcon>
        </div>
      </nav>

      <hr className="mt-2" />

      <section className="flex flex-col sm:flex-row items-center space-x-2 p-2 justify-between">
        <div className="h-16 w-24 sm:w-28 md:w-30 cursor-pointer flex-shrink-0 my-2 md:my-0">
          <Link href={"/"}>
            <h2
              className="text-bold text-center text-xl"
              style={{
                textShadow:
                  "rgb(38 19 94) 4px 2px 0px, rgb(110 255 86) 4px 4px 0px",
                color: "white",
                fontSize: "2rem",
                letterSpacing: "4px",
              }}
            >
              Nifty Bids
            </h2>
          </Link>
        </div>

        <button className=" items-center space-x-2 w-20 hidden md:flex">
          <p>Shop by category</p>
          <ChevronDownIcon className="h-4 flex-shrink-0"></ChevronDownIcon>
        </button>
        <div className="flex flex-row flex-1 gap-2 w-full">
          <div className="flex flex-1 sm:justify-center items-center space-x-2 px-2 md:px-5 py-2 border-gray-700 border-2">
            <MagnifyingGlassIcon className="w-5 text-gray-400 "></MagnifyingGlassIcon>
            <input
              className="flex-1 outline-none dark:bg-gray-900"
              type="text"
              placeholder="Search for anything"
            />
          </div>

          <button className="hidden md:inline bg-green-600 text-white px-5 md:px-10 py-2 border-2 border-green-600 hover:bg-green-800 order-4 sm:order-2">
            Search
          </button>
          <Link
            href="/listitem"
            className="text-green-600 px-5 md:px-10 py-2 border-2 border-green-600 hover:text-white hover:bg-green-600/50 order-3 sm:order-2"
          >
            List Item
          </Link>
        </div>
      </section>

      <section className="flex py-3 space-x-6 text-xs md:text-sm whitespace-nowrap justify-center px-6">
        <p className="hover:link">Home</p>
        <p className="hover:link">Electronics</p>
        <p className="hover:link">Computers</p>
        <p className="hover:link hidden sm:inline">Video Games</p>
        <p className="hover:link hidden sm:inline">Home &amp; Garden</p>
        <p className="hover:link hidden md:inline">Health &amp; Beauty</p>
        <p className="hover:link hidden lg:inline">Collectibles and Art</p>
        <p className="hover:link hidden lg:inline">Books</p>
        <p className="hover:link hidden lg:inline">Music</p>
        <p className="hover:link hidden xl:inline">Deals</p>
        <p className="hover:link hidden xl:inline">Others</p>
        <p className="hover:link">More</p>
      </section>

      <hr />
    </div>
  );
};

export default Header;
