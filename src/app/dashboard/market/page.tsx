'use client';
import Item from '@/app/components/ui/dashboard/market/Item';
import { marketplaceAbi, nftAbi } from '@/app/lib/abi';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { useReadContracts } from 'wagmi';

interface ItemListing {
  marketItemId: bigint;
  nftContractAddress: Address;
  tokenId: bigint;
  creator: Address;
  seller: Address;
  owner: Address;
  price: bigint;
  sold: boolean;
  canceled: boolean;
}

export default function Market() {
  const [marketMode, setMarketMode] = useState(true);
  const [listings, setListings] = useState<ItemListing[]>([]);
  const [owned, setOwned] = useState<ItemListing[]>([]);

  const market = {
    abi: marketplaceAbi,
    address: process.env.NEXT_MARKET_ADDRESS as Address,
  };
  const nft = {
    abi: nftAbi,
    address: process.env.NEXT_NFT_ADDRESS as Address,
  };

  const allItems = useReadContracts({
    contracts: [
      { ...market, functionName: 'fetchAvailableMarketItems' },
      { ...market, functionName: 'fetchOwnedMarketItems' },
    ],
  });

  useEffect(() => {
    const items = allItems.data ? allItems.data[0].result : [];
    const own = allItems.data ? allItems.data[1].result : [];
    setListings(items);
    setOwned(own);
  }, [allItems.data]);

  function displayListings() {
    for (const item of listings) {

    }
  }

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
        {marketMode && }
      </div>
    </div>
  );
}
