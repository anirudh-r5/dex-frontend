'use client';
import Item from '@/app/components/ui/dashboard/market/Item';
import { marketplaceAbi, nftAbi } from '@/app/lib/abi';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { useConfig, useReadContracts, useWriteContract } from 'wagmi';
import { readContract } from 'wagmi/actions';

export interface ItemListing {
  id: bigint;
  data: string;
  owner: Address;
  seller: Address;
  price: bigint;
}

export default function Market() {
  const [marketMode, setMarketMode] = useState(true);
  const [listings, setListings] = useState<ItemListing[]>([]);
  const [owned, setOwned] = useState<ItemListing[]>([]);
  const config = useConfig();
  const market = {
    abi: marketplaceAbi,
    address: '0x9A676e781A523b5d0C0e43731313A708CB607508' as Address,
  };
  const nft = {
    abi: nftAbi,
    address: '0x0B306BF915C4d645ff596e518fAf3F9669b97016' as Address,
  };

  const reads = useReadContracts({
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

  useEffect(() => {
    const getAll = async () => {
      const list = reads.data?.[0].result || [];
      const owns = reads.data?.[1].result || [];
      const allList = [];
      const allOwn = [];
      for (const item of list) {
        const owner = item.owner;
        const seller = item.seller;
        const id = item.tokenId;
        const price = item.price;
        const data = await readContract(config, {
          ...nft,
          functionName: 'tokenURI',
          args: [id],
        });
        const obj = {
          id,
          data,
          owner,
          seller,
          price,
        };
        allList.push(obj);
      }
      for (const item of owns) {
        const owner = item.owner;
        const seller = item.seller;
        const id = item.tokenId;
        const price = item.price;
        const data = await readContract(config, {
          ...nft,
          functionName: 'tokenURI',
          args: [id],
        });
        const obj = {
          id,
          data,
          owner,
          seller,
          price,
        };
        allOwn.push(obj);
      }
      setListings(allList);
      setOwned(allOwn);
    };
    getAll();
  }, [reads.data, config, nft]);

  async function mintNew() {
    minter({
      address: nft.address,
      abi: nft.abi,
      functionName: 'mintToken',
      args: [`${listings.length}`],
    });
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

      {marketMode && (
        <div className="grid grid-cols-5 grid-rows-5 grid-flow-row-dense justify-center gap-3">
          {displayListings(0)}
        </div>
      )}
      {!marketMode && (
        <div className="flex justify-center">
          <button className="btn btn-info btn-block" onClick={mintNew}>
            Mint NFT
          </button>
        </div>
      )}
      {!marketMode && (
        <div className="grid grid-cols-5 grid-rows-5 grid-flow-row-dense justify-center gap-3">
          {displayListings(1)}
        </div>
      )}
    </div>
  );
}
