import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  ListingType,
  MediaRenderer,
  useBuyNow,
  useContract,
  useListing,
  useMakeOffer,
  useNetworkMismatch,
  useSwitchChain,
  useMakeBid,
  useOffers,
  NATIVE_TOKENS,
  useAddress,
  useAcceptDirectListingOffer,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Countdown from "react-countdown";
import network from "@/utils/network";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";

type Props = {};

const ListingItem = (props: Props) => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [minimumNextbid, setMinimumNextbid] = useState<{
    value: string;
    symbol: string;
  }>();

  const [bidAmount, setBidAmount] = useState(0);

  //Connect to marketplace contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { data: listing, isLoading: loadingListing } = useListing(contract, id);

  const formatPlaceholder = () => {
    if (listing?.type === ListingType.Direct) {
      return "Enter your offer";
    } else if (listing?.type === ListingType.Auction) {
      return Number(minimumNextbid?.value) === 0
        ? "Enter your bid"
        : `${minimumNextbid} ${minimumNextbid?.symbol} or more`;
    }

    // TODO improve bid amount
  };

  const fetchNextMinimumBid = async () => {
    if (!id || !contract) return;

    const minBidResponse = await contract?.auction.getMinimumNextBid(id);
    setMinimumNextbid({
      value: minBidResponse?.displayValue || "",
      symbol: minBidResponse?.symbol || "",
    });
  };

  const networkMisMatch = useNetworkMismatch();
  const switchChain = useSwitchChain();
  const address = useAddress();

  const { data: offers, isLoading: offersLoading } = useOffers(contract, id);

  const {
    mutate: buyNow,
    isLoading: directBuyLoading,
    error,
  } = useBuyNow(contract);

  const {
    mutate: makeOffer,
    isLoading: makeOfferLoading,
    error: auctionError,
  } = useMakeOffer(contract);

  const { mutate: makeBid, isLoading: makeBidLoadding } = useMakeBid(contract);

  const {
    mutate: acceptDirectOffer,
    isLoading: acceptDirectOfferLoading,
    error: acceptDirectOfferError,
  } = useAcceptDirectListingOffer(contract);

  const buyNft = async () => {
    if (networkMisMatch) {
      switchChain && switchChain(network);
      return;
    }

    if (!id || !contract || !listing) return;

    await buyNow(
      {
        id: id,
        buyAmount: 1,
        type: listing.type,
      },
      {
        onSuccess: () => {
          toast("NFT has been bought succesfully! ✅", {
            icon: "👏",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setTimeout((_) => {
            router.replace("/");
          }, 1000);
        },
        onError: (error) => {
          toast("NFT can't be bought!", {
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

    if (error) {
      console.error("failed to buyout listing", error);
    }
  };

  const createBidOrOffer = async () => {
    if (!id || !contract) return;

    try {
      if (networkMisMatch) {
        switchChain && switchChain(network);
        return;
      }

      if (listing?.type === ListingType.Auction) {
      }

      if (listing?.type === ListingType.Direct) {
        if (
          listing?.buyoutPrice === ethers.utils.parseEther(bidAmount.toString())
        ) {
          await buyNft();
          return;
        }

        // Make an offer if price is less than buyout price
        await makeOffer(
          {
            listingId: id,
            pricePerToken: bidAmount,
            quantity: 1,
          },
          {
            onSuccess: () => {
              setBidAmount(0);
              toast("Offer made succesfully! ✌🏻", {
                icon: "👏🏻",
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
            },
            onError: (error) => {
              toast("Offer can't be made!", {
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
      }

      if (listing?.type === ListingType.Auction) {
        await makeBid(
          {
            bid: bidAmount,
            listingId: id,
          },
          {
            onSuccess: () => {
              setBidAmount(0);
              toast("Bid made succesfully! ✌🏻", {
                icon: "👏🏻",
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
            },
            onError: (error) => {
              toast("Bid can't be made!", {
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
      }
    } catch (e) {
      toast.error("some error occurred!", {
        icon: "📛",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    if (!id || !contract) return;

    if (listing?.type === ListingType.Auction) {
      fetchNextMinimumBid();
    }

    return () => {};
  }, [id, listing, contract]);

  return (
    <div>
      <Header />
      {loadingListing && <Loading message={"Loading listing, please wait"} />}
      {directBuyLoading && (
        <>
          <div className="fixed inset-0 bg-gray-800 opacity-90"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-2">
            <div className="animate-spin rounded-full w-20 border-t-4 border-b-4 border-green-500 h-20"></div>
            <p className="text-sm text-bold animate-pulse">
              Buying your NFT, please wait...
            </p>
          </div>
        </>
      )}

      {makeOfferLoading && (
        <>
          <div className="fixed inset-0 bg-gray-800 opacity-90"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-2">
            <div className="animate-spin rounded-full w-20 border-t-4 border-b-4 border-green-500 h-20"></div>
            <p className="text-sm text-bold animate-pulse">Making offer...</p>
          </div>
        </>
      )}

      {makeBidLoadding && (
        <>
          <div className="fixed inset-0 bg-gray-800 opacity-90"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-2">
            <div className="animate-spin rounded-full w-20 border-t-4 border-b-4 border-green-500 h-20"></div>
            <p className="text-sm text-bold animate-pulse">
              Making Bid for this NFT...
            </p>
          </div>
        </>
      )}

      {acceptDirectOfferLoading && (
        <>
          <div className="fixed inset-0 bg-gray-800 opacity-90"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-2">
            <div className="animate-spin rounded-full w-20 border-t-4 border-b-4 border-green-500 h-20"></div>
            <p className="text-sm text-bold animate-pulse">
              Accepting this Offer...
            </p>
          </div>
        </>
      )}
      {!loadingListing && (
        <main className="container flex flex-col space-y-10 space-x-5 md:pr-10 lg:flex-row">
          <div className="p-3 md:p-9 border border-gray-600 rounded-lg md:rounded-xl mx-auto lg:mx-0 max-w-md lg:max-wd-xl pointer-events-none">
            <MediaRenderer src={listing?.asset.image} />
          </div>

          <section className="pb-20 md:pb-0 ">
            <div>
              <h1 className="text-xl font-bold">{listing?.asset.name}</h1>
              <p>{listing?.asset.description}</p>
              <p className="flex items-center text-sm sm:text-base gap-1">
                <UserCircleIcon className="h-5" />
                <span className="font-bold pr-1">Seller :</span>
                {listing?.sellerAddress}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center py-8">
              <p className="font-bold">Listing Type</p>
              <p>
                {listing?.type === ListingType.Direct
                  ? "Direct Listing"
                  : "Auction Listing"}
              </p>
              <p className="font-bold">Buy at Now Price</p>
              <p className="text-4xl font-bold">
                {listing?.buyoutCurrencyValuePerToken.displayValue}{" "}
                {listing?.buyoutCurrencyValuePerToken.symbol}
              </p>

              <button
                onClick={buyNft}
                className="hover:bg-green-800 font-bold text-lg col-start-2 mt-2 bg-green-600 text-white rounded-full w-44 py-4 px-10"
              >
                Buy now
              </button>
            </div>
            {/* show offers for direct listing */}

            {listing?.type === ListingType.Direct && offers && (
              <div className="grid grid-cols-2 gap-y-2">
                <p className="font-bold">Offers : </p>
                <p className="font-bold">
                  {offers.length > 0 ? offers.length : 0}
                </p>

                {offers.map((offer) => {
                  return (
                    <>
                      <p className="flex items-center text-sm sm:text-base gap-1">
                        <UserCircleIcon className="h-3 mr-2" />
                        {offer.offeror.slice(0, 6) +
                          "..." +
                          offer.offeror.slice(-4)}
                      </p>
                      <div>
                        <p className="text-sm italic ">
                          {ethers.utils.formatEther(offer.totalOfferAmount)}{" "}
                          {NATIVE_TOKENS[network].symbol}
                        </p>

                        {listing.sellerAddress === address && (
                          <button
                            onClick={() => {
                              acceptDirectOffer(
                                {
                                  addressOfOfferor: offer.offeror,
                                  listingId: id,
                                },
                                {
                                  onSuccess: () => {
                                    toast("Offer Accepted! ✅", {
                                      icon: "👏🏻",
                                      style: {
                                        borderRadius: "10px",
                                        background: "#333",
                                        color: "#fff",
                                      },
                                    });
                                    router.replace("/");
                                  },
                                  onError: () => {
                                    toast("Error accepting offer! ❌", {
                                      style: {
                                        borderRadius: "10px",
                                        background: "#333",
                                        color: "#fff",
                                      },
                                    });
                                  },
                                }
                              );
                            }}
                            className="p-2 w-32 bg-orange-500/50 rounded-lg font-bold text-xs cursor-pointer"
                          >
                            Accept Offer
                          </button>
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-2 space-y-2 items-center justify-end ">
              <hr className="col-span-2" />

              <p className="col-span-2 font-bold">
                {listing?.type === ListingType.Direct
                  ? "Make an Offer"
                  : "Place a Bid"}
              </p>

              {/* Remaining Time on auction or offer */}
              {listing?.type === ListingType.Auction && (
                <>
                  <p>Current Minimum Bid</p>
                  <p>
                    {minimumNextbid?.value} {minimumNextbid?.symbol}
                  </p>

                  <p>Time Remaining</p>
                  <Countdown
                    date={
                      Number(listing?.endTimeInEpochSeconds.toString()) * 1000
                    }
                  />
                </>
              )}

              <input
                type="text"
                placeholder={formatPlaceholder()}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="border border-gray-600 p-2 outline-none rounded-sm mr-5 bg-gray-800"
              />
              <button
                onClick={createBidOrOffer}
                className="hover:bg-orange-800 bg-orange-700 text-lg font-bold w-44 py-4 px-10 rounded-full"
              >
                {" "}
                {listing?.type === ListingType.Direct ? "Offer" : "Bid"}
              </button>
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default ListingItem;
