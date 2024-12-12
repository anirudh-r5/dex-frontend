import { ItemListing } from '@/app/dashboard/market/page';
import { pngs } from '@/app/lib/imgLoader';
import { ChangeEvent, useEffect, useState } from 'react';
import { StaticImageData } from 'next/image';
import { randomInt } from 'crypto';
import { Address } from 'viem';

interface ItemProps {
  listing: ItemListing;
  address: Address;
  lister(id: number, price: number): void;
  buyer(id: number, price: number): void;
}

export default function Item({ listing, address, lister, buyer }: ItemProps) {
  const [nftImg, setNftImg] = useState<StaticImageData>();
  const [nftName, setNftName] = useState<string>();
  const [money, setMoney] = useState<number>(0);

  function handleMoney(e: ChangeEvent<HTMLInputElement>) {
    setMoney(Number(e.target.value));
  }

  function handleBuy() {
    buyer(listing.id, Number(listing.price));
  }

  useEffect(() => {
    switch (listing.data) {
      case '0':
        setNftImg(pngs[0]);
        setNftName('The Rabbit');
        break;
      case '1':
        setNftImg(pngs[1]);
        setNftName('The Astronaut');
        break;
      case '2':
        setNftImg(pngs[2]);
        setNftName('The Beaver');
        break;
      case '3':
        setNftImg(pngs[3]);
        setNftName('The Cat');
        break;
      case '4':
        setNftImg(pngs[4]);
        setNftName('The Chick');
        break;
      case '5':
        setNftImg(pngs[5]);
        setNftName('The Dog');
        break;
      case '6':
        setNftImg(pngs[6]);
        setNftName('The Hacker');
        break;
      case '7':
        setNftImg(pngs[7]);
        setNftName('The Man');
        break;
      case '8':
        setNftImg(pngs[8]);
        setNftName('The Fox');
        break;
      case '9':
        setNftImg(pngs[9]);
        setNftName('The Panda');
        break;
      default:
        setNftImg(pngs[randomInt(9)]);
        setNftName('The Stranger');
        break;
    }
  }, [listing.data]);
  return (
    <div className="card bg-base-200 shadow-2xl m-4 w-80">
      <figure className="px-10 pt-10">
        <img src={nftImg?.src} className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{nftName}</h2>
        <p>Id: {listing.id}</p>
        <p>{listing.listed && `Price: ${listing.price}`}</p>
        <div className="card-actions">
          {!listing.listed && listing.owner === address && (
            <div className="join col-span-2">
              <input
                type="text"
                placeholder="Enter amount"
                className="input input-bordered input-secondary join-item"
                value={money}
                onChange={handleMoney}
              />
              <button
                className="btn btn-secondary"
                onClick={() => lister(listing.id, money)}
              >
                List for sale
              </button>
            </div>
          )}
          {listing.listed && listing.owner !== address && (
            <button className="btn btn-primary" onClick={handleBuy}>
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
