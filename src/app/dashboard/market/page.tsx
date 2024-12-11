'use client';
import Item from '@/app/components/ui/dashboard/market/Item';
import { nftMarketplaceAbi, basicNftAbi } from '@/app/lib/abi';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { useConfig, useReadContract, useWriteContract } from 'wagmi';

export interface ItemListing {
  marketItemId: bigint;
  nftContractAddress: Address;
  tokenId: bigint;
  creator: Address;
  seller: Address;
  owner: Address;
  price: bigint;
  sold: boolean;
  canceled: boolean;
  uri: string;
}

export default function Market() {
  const [marketMode, setMarketMode] = useState(true);
  const [listings, setListings] = useState<ItemListing[]>([]);
  const [owned, setOwned] = useState<ItemListing[]>([]);
  const config = useConfig();

  const market = {
    abi: nftMarketplaceAbi,
    address: process.env.NEXT_MARKET_ADDRESS as Address,
  };
  const nft = {
    abi: basicNftAbi,
    address: process.env.NEXT_NFT_ADDRESS as Address,
  };

  const { data } = useReadContract({
    ...nft,
    functionName: 'getAll',
  });

  const { data: counter } = useReadContract({
    ...nft,
    functionName: 'getTokenCounter',
  });

  const { writeContractAsync: minter } = useWriteContract();

  function displayListings(page: number) {
    const items = [];
    if (page === 0) {
      for (const item of listings) {
        items.push(<Item listing={item} />);
      }
    } else {
      for (const item of owned) {
        items.push(<Item listing={item} />);
      }
    }
    return items;
  }

  async function mintNew() {
    await minter({
      ...nft,
      functionName: 'mintNft',
      args: [String(listings.length)],
      gas: BigInt(3000000),
    });
  }

  useEffect(() => {
    console.log(data);
    console.log(counter);
  });

  return (
    <div>
      <div role="tablist" className="tabs tabs-boxed">
        <button
          role="tab"
          className={clsx('tab', { 'tab-active': marketMode === true })}
          onClick={() => setMarketMode(true)}
        >
          Market
        </button>
        <button
          role="tab"
          className={clsx('tab', { 'tab-active': marketMode === false })}
          onClick={() => setMarketMode(false)}
        >
          Your Items
        </button>
      </div>
      <div className="grid grid-cols-5 grid-rows-5 grid-flow-row-dense justify-center gap-3">
        {marketMode && displayListings(0)}
        {!marketMode && (
          <button className="btn btn-secondary" onClick={mintNew}>
            Mint NFT
          </button>
        )}
        {!marketMode && displayListings(1)}
      </div>
    </div>
  );
}
