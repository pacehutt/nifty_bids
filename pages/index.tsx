import Header from "@/components/Header";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  useActiveListings,
  useContract,
  MediaRenderer,
  ListingType,
} from "@thirdweb-dev/react";
import Link from "next/link";

export default function Home() {
  //Connect to marketplace contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  // Passing the contract and getting the listings
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

  console.log(listings);
  return (
    <main>
      <Header />

      <main className="container">
        {loadingListings ? (
          <>
            <div className="relative inset-0 flex flex-col items-center justify-center z-50 gap-2 mt-10 pt-10 md:mt-16">
              <div className="animate-spin rounded-full w-10 border-t-4 border-b-4 border-gray-200 h-10"></div>
              <p className="text-sm text-bold animate-pulse">
                Loading marketplace NFTs, please wait
              </p>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 mx-auto pt-2">
            {listings?.map((listing) => (
              <Link href={`/listing/${listing.id}`} key={listing.id}>
                <div
                  className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out"
                  style={{ padding: "1rem", marginBottom: "1rem" }}
                >
                  <div className="flex flex-1 flex-col items-center">
                    <MediaRenderer
                      className="rounded-lg"
                      src={listing.asset.image}
                      style={{
                        width: "11rem",
                        height: "11rem",
                      }}
                    ></MediaRenderer>
                  </div>

                  <div className="pt-2 space-y-4">
                    <div>
                      <h2 className="text-lg truncate">{listing.asset.name}</h2>
                      <hr />
                      <p className="trucate text-sm text-gray-400 mt-2">
                        {listing.asset.description}
                      </p>
                    </div>

                    <p>
                      <span className="font-bold mr-1">
                        {listing.buyoutCurrencyValuePerToken.displayValue}
                      </span>{" "}
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>

                    <div
                      className={`flex items-center space-x-1 justify-end text-xs w-fit ml-auto py-2 rounded-lg text-white px-3 ${
                        listing.type === ListingType.Direct
                          ? "bg-blue-800"
                          : "bg-red-500"
                      }`}
                    >
                      <p>
                        {listing.type === ListingType.Direct
                          ? "Buy Now"
                          : "Auction"}
                      </p>
                      {listing.type === ListingType.Direct ? (
                        <BanknotesIcon className="h-4" />
                      ) : (
                        <ClockIcon className="h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </main>
  );
}
