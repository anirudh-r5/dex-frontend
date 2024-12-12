'use client';
import Item from '@/app/components/ui/dashboard/market/Item';
import { marketplaceAbi, nftAbi } from '@/app/lib/abi';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Address, parseEther } from 'viem';
import {
  useAccount,
  useConfig,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { readContract } from 'wagmi/actions';

export interface ItemListing {
  id: number;
  owner: Address;
  data: string;
  price: string;
  listed: boolean;
}

export default function Market() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const [marketMode, setMarketMode] = useState(true);
  const [listings, setListings] = useState<ItemListing[]>([]);
  const [pricing, setPricing] = useState<number[]>([]);
  const [marking, setMarking] = useState<boolean[]>([]);
  const config = useConfig();
  const nft = {
    abi: nftAbi,
    address: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44' as Address,
  };
  const market = {
    abi: marketplaceAbi,
    address: '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1' as Address,
  };

  const { data: getOwn } = useReadContract({ ...nft, functionName: 'getOwn' });

  const { writeContractAsync: minter } = useWriteContract();
  const { writeContractAsync: lister } = useWriteContract();
  const { writeContractAsync: buyer } = useWriteContract();

  function displayListings(page: number) {
    const items = [];
    for (const item of listings) {
      if (page === 0 && item.owner !== address && item.listed) {
        items.push(
          <Item
            listing={item}
            address={address}
            lister={makeListing}
            buyer={makeTransfer}
          />
        );
      } else if (page === 1 && item.owner === address) {
        items.push(
          <Item
            listing={item}
            address={address}
            lister={makeListing}
            buyer={makeTransfer}
          />
        );
      }
    }
    return items;
  }

  async function makeTransfer(id: number, price: number) {
    await buyer({
      ...market,
      functionName: 'buyItem',
      args: [nft.address, BigInt(id)],
      value: parseEther(String(price)),
    });
    const newMark = marking.map((m, i) => {
      if (i === id) return false;
      else return m;
    });
    setMarking(newMark);
    await queryClient.invalidateQueries();
  }

  async function makeListing(id: number, price: number) {
    await lister({
      ...nft,
      functionName: 'approve',
      args: [market.address, BigInt(id)],
    });
    await lister({
      ...market,
      functionName: 'listItem',
      args: [nft.address, BigInt(id), BigInt(price)],
    });
    const newPrice = pricing.map((p, i) => {
      if (i === id) return price;
      else return p;
    });
    const newMark = marking.map((m, i) => {
      if (i === id) return true;
      else return m;
    });
    setPricing(newPrice);
    setMarking(newMark);
    await queryClient.invalidateQueries();
  }

  useEffect(() => {
    const getAll = async () => {
      const items = getOwn || [];
      const allList: ItemListing[] = [];
      for (let i = 0; i < items.length; i++) {
        const lp = await readContract(config, {
          abi: market.abi,
          address: market.address,
          functionName: 'getListing',
          args: [nft.address, BigInt(i)],
        });
        const owner = items[i];
        const price = lp?.price ? lp.price : 0;
        const obj = {
          id: i,
          owner: owner,
          data: String(i),
          price: String(price),
          listed: lp?.price ? true : false,
        };
        allList.push(obj);
      }
      setListings(allList);
    };
    getAll();
  }, [address, config, getOwn, market.abi, market.address, nft.address]);

  async function mintNew() {
    const data = listings.length;
    await minter({
      ...nft,
      functionName: 'mintToken',
      args: [address as Address, `${data}`],
    });
    setPricing([...pricing, 0]);
    setMarking([...marking, false]);
    await queryClient.invalidateQueries();
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
