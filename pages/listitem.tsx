import Header from "@/components/Header";
import React, { useState } from "react";
import {
  MediaRenderer,
  NATIVE_TOKEN_ADDRESS,
  NFT,
  useAddress,
  useChainId,
  useContract,
  useCreateAuctionListing,
  useCreateDirectListing,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useSwitchChain,
} from "@thirdweb-dev/react";
import network from "@/utils/network";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

type Props = {};

const Listitem = (props: Props) => {
  const address = useAddress();
  const router = useRouter();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const {
    data: ownedNfts,
    isLoading: nftLoading,
    error,
  } = useOwnedNFTs(collectionContract, address);

  const [selectedNft, setSelectedNft] = useState<NFT>();
  const networkMisMatch = useNetworkMismatch();

  const chainId = useChainId();
  const switchChain = useSwitchChain();

  const {
    mutate: createDirectListing,
    isLoading: loadingDirect,
    error: errorDirect,
  } = useCreateDirectListing(contract);

  const {
    mutate: createAuctionListing,
    isLoading: loadingAuction,
    error: errorAuction,
  } = useCreateAuctionListing(contract);

  const handleCreateListing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (networkMisMatch) {
      switchChain && switchChain(network);
      return;
    }

    if (!selectedNft) return;
    const target = e.target as typeof e.target & {
      listingType: { value: string };
      price: { value: number };
    };
    const [listingType, price] = [target.listingType, target.price];

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7 * 50,
          buyoutPricePerToken: price.value,
          quantity: 1,
          startTimestamp: new Date(),
        },
        {
          onSuccess: (data, variables, context) => {
            console.log("SUCCESS", data, variables, context);
            toast("Your NFT has been listed! ✅", {
              icon: "👏",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
            setTimeout((_) => {
              router.push("/");
            }, 2000);
          },
          onError: (error, variables, context) => {
            console.log("ERROR", error, variables, context);
            toast("Your NFT can't be listed!", {
              icon: "📛",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          },
        }
      );
    } else if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          reservePricePerToken: 0,
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7 * 50,
          buyoutPricePerToken: price.value,
          quantity: 1,
          startTimestamp: new Date(),
        },
        {
          onSuccess: (data, variables, context) => {
            console.log("SUCCESS Auction", data, variables, context);
            toast("Your NFT has been listed! ✅", {
              icon: "👏",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
            setTimeout((_) => {
              router.push("/");
            }, 2000);
          },
          onError: (error, variables, context) => {
            toast("Your NFT can't be listed!", {
              icon: "📛",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
            console.log("ERROR Auction", error, variables, context);
          },
        }
      );
    }
  };

  console.log(contract);
  return (
    <div>
      <Header />
      {(loadingDirect || loadingAuction) && (
        <>
          <div className="fixed inset-0 bg-gray-800 opacity-90"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-2">
            <div className="animate-spin rounded-full w-20 border-t-4 border-b-4 border-gray-200 h-20"></div>
            <p className="text-sm text-bold animate-pulse">
              Listing your NFT, please wait..
            </p>
          </div>
        </>
      )}
      <main className="container">
        <h1 className="text-4xl font-bold">List an item</h1>
        <h2 className="text-xl font-semibold pt-5">
          Select an Item you would like to sell
        </h2>

        <hr className="mb-2" />
        <p>Below you will find the NFTs you own in your wallet.</p>
        {!address && (
          <p className="text-center text-sm font-semibold text-red-500 m-3">
            Please connect your wallet to list an item.
          </p>
        )}

        {address && !nftLoading && (
          <div className="flex overflow-x-scroll gap-2 p-4">
            {ownedNfts?.map((nft) => (
              <div
                onClick={() => setSelectedNft(nft)}
                key={nft.metadata.id}
                className={`flex gap-4 flex-col min-w-fit max-w-sm card border-2 shadow-md items-center justify-center ${
                  selectedNft?.metadata.id === nft.metadata.id
                    ? `dark:border-gray-500 dark:bg-gray-900 dark:hover:bg-gray-900`
                    : "border-transparent"
                }`}
              >
                <MediaRenderer
                  src={nft.metadata.image}
                  className="h-48 rounded-lg"
                  style={{
                    width: "11rem",
                    height: "11rem",
                  }}
                />
                <div className=" flex flex-col w-full h-full overflow-y-auto">
                  <p className="text-lg truncate font-semibold">
                    {nft.metadata.name}
                  </p>
                  <p className="text-sm truncate">
                    {nft.metadata?.description?.slice(0, 30) + "..."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {nftLoading && (
          <>
            <div className="relative inset-0 flex flex-col items-center justify-center z-50 gap-2 mt-10 pt-10 md:mt-16">
              <div className="animate-spin rounded-full w-10 border-t-4 border-b-4 border-gray-200 h-10"></div>
              <p className="text-sm text-bold animate-pulse">
                Loading your NFTs, please wait
              </p>
            </div>
          </>
        )}

        {selectedNft && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col p-10 border-1 border-gray-500">
              <div className="grid grid-cols-2 gap-5">
                <label htmlFor="" className="border-r font-light">
                  Direct Listing/ Fixed Price
                </label>
                <input
                  type="radio"
                  name="listingType"
                  value="directListing"
                  className="ml-auto w-8 h-8"
                />

                <label htmlFor="" className="border-r font-light">
                  Auction
                </label>
                <input
                  type="radio"
                  name="listingType"
                  value="auctionListing"
                  className="ml-auto h-8 w-8"
                />

                <label htmlFor="" className="border-r font-light">
                  Price{" "}
                </label>
                <input
                  type="text"
                  name="price"
                  placeholder="0.01"
                  className="bg-gray-700 p-5 rounded-md outline-none"
                />
              </div>

              <button
                className="bg-green-600 text-white rounded-lg mt-8 p-4"
                type="submit"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default Listitem;
