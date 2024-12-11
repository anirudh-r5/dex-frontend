'use client';
import Item from '@/app/components/ui/dashboard/market/Item';
import { marketplaceAbi, nftAbi } from '@/app/lib/abi';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { useConfig, useReadContracts, useWriteContract } from 'wagmi';
import { readContract } from '@wagmi/core';

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
      functionName: 'mintToken',
      args: [`${listings.length}`],
    });
  }

  useEffect(() => {
    const fetchAll = async () => {
      const items = allItems.data ? allItems.data[0].result : [];
      const own = allItems.data ? allItems.data[1].result : [];
      const listItems: ItemListing[] = [];
      const ownItems: ItemListing[] = [];
      for (const item of items) {
        const result = await readContract(config, {
          ...nft,
          functionName: 'tokenURI',
          args: [item.tokenId],
        });
        listItems.push({ ...item, uri: result });
      }
      for (const item of own) {
        const result = await readContract(config, {
          ...nft,
          functionName: 'tokenURI',
          args: [item.tokenId],
        });
        ownItems.push({ ...item, uri: result });
      }
      setListings(listItems);
      setOwned(ownItems);
    };
    fetchAll();
  }, [allItems.data]);

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
