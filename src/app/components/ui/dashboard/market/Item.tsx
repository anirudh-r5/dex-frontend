import { ItemListing } from '@/app/dashboard/market/page';
import rabbitPng from '../../../../assets/nfts/0.png';
import astroPng from '../../../../assets/nfts/1.png';
import beaverPng from '../../../../assets/nfts/2.png';
import catPng from '../../../../assets/nfts/3.png';
import chickPng from '../../../../assets/nfts/4.png';
import dogPng from '../../../../assets/nfts/5.png';
import hackerPng from '../../../../assets/nfts/6.png';
import manPng from '../../../../assets/nfts/7.png';
import foxPng from '../../../../assets/nfts/8.png';
import pandaPng from '../../../../assets/nfts/9.png';
import { useEffect, useState } from 'react';
import { StaticImageData } from 'next/image';

interface ItemProps {
  listing: ItemListing;
}

export default function Item({ listing }: ItemProps) {
  const [nftImg, setNftImg] = useState<StaticImageData>();
  const [nftName, setNftName] = useState<string>();

  useEffect(() => {
    switch (listing.uri) {
      case '0':
        setNftImg(rabbitPng);
        setNftName('The Rabbit');
        break;
      case '1':
        setNftImg(astroPng);
        setNftName('The Astronaut');
        break;
      case '2':
        setNftImg(beaverPng);
        setNftName('The Beaver');
        break;
      case '3':
        setNftImg(catPng);
        setNftName('The Cat');
        break;
      case '4':
        setNftImg(chickPng);
        setNftName('The Chick');
        break;
      case '5':
        setNftImg(dogPng);
        setNftName('The Dog');
        break;
      case '6':
        setNftImg(hackerPng);
        setNftName('The Hacker');
        break;
      case '7':
        setNftImg(manPng);
        setNftName('The Man');
        break;
      case '8':
        setNftImg(foxPng);
        setNftName('The Fox');
        break;
      case '9':
        setNftImg(pandaPng);
        setNftName('The Panda');
        break;
    }
  }, [listing.uri]);
  return (
    <div className="card bg-base-200 shadow-2xl m-4 w-80">
      <figure className="px-10 pt-10">
        <img src={nftImg?.src} className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{nftName}</h2>
        <p>Owner: {listing.owner}</p>
        <p>Price: {listing.price}</p>
        <div className="card-actions">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
