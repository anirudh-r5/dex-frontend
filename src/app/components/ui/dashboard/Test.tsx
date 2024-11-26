'use client';

import { useEffect, useState } from 'react';

export default function Address() {
  const [address, setAddress] = useState<string>();
  useEffect(() => {
    async function getAddress() {
      console.log(window.ethereum);
      const addr = await window.ethereum?.request({
        method: 'eth_requestAccounts',
        params: [],
      });
      console.log(addr);
    }
    getAddress();
  }, []);

  return <p>hehe</p>;
}
