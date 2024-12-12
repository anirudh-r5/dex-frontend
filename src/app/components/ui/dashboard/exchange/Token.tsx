'use client';

import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import { tokenAbi, tokenVendorAbi } from '@/app/lib/abi';
import { Address, parseEther } from 'viem';
import { ChangeEvent, useEffect, useState } from 'react';

interface TokenState {
  tName: string;
  tSym: string;
  tSupply: number;
  tPrice: number;
  tBal: number;
}

export default function Token() {
  const { address } = useAccount();
  const [currentToken, setCurrentToken] = useState<TokenState>();
  const [currentValue, setCurrentValue] = useState(0);
  const [exchange, setExchange] = useState('');
  const [tradeMode, setTradeMode] = useState(false); //true = sell, false = buy
  const [tokens, setTokens] = useState<TokenState[]>([]);
  const [logo, setLogo] = useState<string>();

  const usdtToken = {
    abi: tokenAbi,
    address: process.env.NEXT_PUBLIC_USDT_TOKEN as Address,
  };
  const usdtVendor = {
    abi: tokenVendorAbi,
    address: process.env.NEXT_PUBLIC_USDT_VENDOR as Address,
  };
  const usdcToken = {
    abi: tokenAbi,
    address: process.env.NEXT_PUBLIC_USDC_TOKEN as Address,
  };
  const usdcVendor = {
    abi: tokenVendorAbi,
    address: process.env.NEXT_PUBLIC_USDC_VENDOR as Address,
  };

  const reads = useReadContracts({
    contracts: [
      { ...usdtToken, functionName: 'name' },
      { ...usdtToken, functionName: 'symbol' },
      { ...usdtToken, functionName: 'totalSupply' },
      { ...usdtVendor, functionName: 'tokensPerEth' },
      { ...usdtToken, functionName: 'balanceOf', args: [address as Address] },
      { ...usdcToken, functionName: 'name' },
      { ...usdcToken, functionName: 'symbol' },
      { ...usdcToken, functionName: 'totalSupply' },
      { ...usdcVendor, functionName: 'tokensPerEth' },
      { ...usdcToken, functionName: 'balanceOf', args: [address as Address] },
    ],
  });

  const { writeContractAsync } = useWriteContract();

  function getTokens() {
    const tokenButtons = [];
    for (let t = 0; t < tokens.length; t++) {
      tokenButtons.push(
        <li key={tokens[t].tSym}>
          <button className="btn no-animation" onClick={tokenSelect} value={t}>
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img src={logo} />
              </div>
            </div>
            {`${tokens[t].tName} ${tokens[t].tSym}`}
          </button>
        </li>
      );
    }
    return tokenButtons;
  }

  function tokenSelect(e: React.MouseEvent) {
    const token = Number((e.target as HTMLInputElement).value);
    setCurrentToken(tokens[token]);
    if (token === 0)
      setLogo('https://cryptologos.cc/logos/tether-usdt-logo.png');
    if (token === 1)
      setLogo('https://cryptologos.cc/logos/usd-coin-usdc-logo.png');
  }

  function toggleTradeMode() {
    setTradeMode(!tradeMode);
  }

  function checkValue(e: ChangeEvent) {
    const value = Number((e.target as HTMLInputElement).value);
    if (value === 0 || !value) {
      setExchange('');
      setCurrentValue(0);
      return;
    }
    const price = currentToken ? currentToken.tPrice : 1;
    setExchange(`= ${value / price} ETH`);
    setCurrentValue(value);
  }

  async function executeTrade() {
    let vendor = usdtVendor;
    if (currentToken?.tSym === 'USDT') vendor = usdtVendor;
    else if (currentToken?.tSym === 'USDC') vendor = usdcVendor;
    console.log(parseEther(String(currentValue)));
    if (tradeMode) {
      //selling
      await writeContractAsync({
        ...usdtToken,
        functionName: 'approve',
        args: [vendor.address as Address, parseEther(String(currentValue))],
      });
      await writeContractAsync({
        ...vendor,
        functionName: 'sellTokens',
        args: [parseEther(String(currentValue))],
      });
    } else {
      await writeContractAsync({
        ...vendor,
        functionName: 'buyTokens',
        value: parseEther(exchange.split(' ')[1]),
      });
    }
  }

  useEffect(() => {
    const dataLength = reads.data ? reads.data?.length : 0;
    const allTokens = [];
    for (let t = 0; t < dataLength; t += 5) {
      const token = {
        tName: String(reads.data?.[t].result),
        tSym: String(reads.data?.[t + 1].result),
        tSupply: Number(BigInt(reads.data?.[t + 2].result)),
        tPrice: Number(reads.data?.[t + 3].result),
        tBal: Number(BigInt(reads.data?.[t + 4].result)),
      };
      allTokens.push(token);
    }
    setTokens(allTokens);
  }, [reads.data]);

  return (
    <div className="card card-compact bg-base-200 shadow-2xl my-4 w-96">
      <div className="card-body text-center">
        <div className="card-actions justify-end">
          <div className="dropdown dropdown-right">
            <div tabIndex={0} role="button" className="btn btn-square btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              {reads.isSuccess && getTokens()}
            </ul>
          </div>
        </div>
        {currentToken ? (
          <div>
            <div className="grid grid-flow-col gap-3 items-center">
              <div className="avatar justify-end">
                <div className="w-16 rounded-full">
                  <img src={logo} />
                </div>
              </div>
              <h2 className="card-title">{`${currentToken.tName} (${currentToken.tSym})`}</h2>
            </div>
            <div className="card-actions justify-center">
              <div className="form-control">
                <div>
                  <label className="label cursor-pointer">
                    <span className="label-text">Buy</span>
                    <input
                      type="checkbox"
                      className="toggle border-primary bg-primary hover:bg-accent checked:bg-secondary checked:border-secondary"
                      onChange={toggleTradeMode}
                    />
                    <span className="label-text">Sell</span>
                  </label>
                </div>
                <div className="join">
                  <input
                    type="text"
                    placeholder="Enter Value..."
                    className={`input input-bordered w-full max-w-xs join-item ${tradeMode ? 'input-secondary' : 'input-primary'}`}
                    onChange={checkValue}
                  />

                  <button
                    className={`btn join-item ${tradeMode ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={executeTrade}
                  >
                    {tradeMode ? 'Sell!' : 'Buy!'}
                  </button>
                </div>
                <div className="label">
                  <span className="label-text-alt">{exchange}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="card-title justify-center">No token selected </h2>
            <p>Select a token to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
