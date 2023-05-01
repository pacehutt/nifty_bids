import Header from "@/components/Header";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  useActiveListings,
  useContract,
  MediaRenderer,
  ListingType,
} from "@thirdweb-dev/react";

export default function Home() {
  //Connect to marketplace contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  // Passinf the contract and getting the listings
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

  console.log(listings);
  return (
    <main>
      <Header />

      <main className="container">
        {loadingListings ? (
          <p className="text-center animate-pulse text-blue-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mx-auto pt-2">
            {listings?.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out"
              >
                <div className="flex flex-1 flex-col pb-2 items-center">
                  <MediaRenderer
                    className="w-44"
                    src={listing.asset.image}
                  ></MediaRenderer>
                </div>

                <div className="pt-2 space-y-4">
                  <div>
                    <h2 className="text-lg truncate">{listing.asset.name}</h2>
                    <hr />
                    <p className="trucate text-sm text-gray-600 mt-2">
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
                    className={`flex items-center space-x-1 justify-end text-xs w-fit ml-auto p-2 rounded-lg text-white ${
                      listing.type === ListingType.Direct
                        ? "bg-blue-500"
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
            ))}
          </div>
        )}
      </main>
    </main>
  );
}
