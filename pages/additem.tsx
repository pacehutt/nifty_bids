import React, { useState } from "react";
import Header from "@/components/Header";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

type Props = {};

const AddItem = (props: Props) => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const address = useAddress();

  const [preview, setPreview] = useState("");
  const [image, setImage] = useState<File>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  console.log(contract);

  const mintNft = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    if (!contract || !address) {
      setLoading(false);
      return;
    }

    if (!image) {
      alert("Please select an image");
      setLoading(false);
      return;
    }

    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    const metaData = {
      name: target.name.value,
      description: target.description.value,
      image: image, // imageUrl or file
    };

    try {
      const tx = await contract.mintTo(address, metaData);

      const reciept = tx.receipt; //transaction reciept
      const tokenId = tx.id; // tokenId of the NFT
      const nft = await tx.data(); // NFT object details

      console.log(reciept, tokenId, nft);
      setLoading(false);
      toast("Your NFT has been added! ✅", {
        icon: "🙌🏻",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      router.push("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast("Your NFT can't be added!", {
        icon: "📛",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }

    console.log("Submitted");
  };

  return (
    <div>
      <Header></Header>
      {loading && (
        <>
          <div className="fixed inset-0 bg-gray-800 opacity-90"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-2">
            <div className="animate-spin rounded-full w-20 border-t-4 border-b-4 border-gray-200 h-20"></div>
            <p className="text-sm text-bold animate-pulse">
              Minting your NFT, please wait
            </p>
          </div>
        </>
      )}

      <main className="container">
        <h1 className="text-4xl font-bold">Add an Item to the Marketplace</h1>
        <h2 className="text-xl font-semibold pt-5">Item Details - </h2>
        <p>
          By adding an item to the marketplace, you are essentially Minting an
          NFT of the item into your wallet which we can then list for sale.
        </p>
        {!address && (
          <p className="text-center text-sm font-semibold text-red-500 m-3">
            Please connect your wallet to list an item.
          </p>
        )}
        {address && (
          <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-5 ">
            <img
              className="border h-80 w-80 object-contain"
              src={preview || "https://images2.imgbox.com/f4/8f/qHs1ajWE_o.png"}
              alt=""
            />

            <form
              onSubmit={mintNft}
              className="flex flex-col flex-1 p-2 space-y-3 "
            >
              <label htmlFor="" className="font-light">
                Name of item
              </label>
              <input
                type="text"
                placeholder="Name of item..."
                className="formField"
                name="name"
                id="name"
              />

              <label htmlFor="" className="font-light">
                Description
              </label>
              <input
                type="text"
                placeholder="Enter description..."
                className="formField"
                name="description"
                id="description"
              />

              <label htmlFor="" className="font-light">
                Image of the item
              </label>
              <input
                type="file"
                className="fileField"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setPreview(URL.createObjectURL(e.target.files[0]));
                    setImage(e.target.files[0]);
                  }
                }}
              />
              <div className="mx-auto mt-5 md:ml-auto">
                <button
                  type="submit"
                  className="hover:bg-green-800 font-bold text-white bg-green-600 rounded-full px-5 py-3 mx-auto mt-5 md:ml-auto w-56"
                >
                  Add/Mint Item
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AddItem;
