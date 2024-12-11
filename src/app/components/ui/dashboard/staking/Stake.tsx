'use client';

import { stakerAbi } from '@/app/lib/abi';
import {
  useAccount,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { ChangeEvent, useEffect, useState } from 'react';
import { Address, formatEther, parseEther } from 'viem';
import { AnimatePresence, motion } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import bigIntSupport from 'dayjs/plugin/bigIntSupport';

export default function Stake() {
  const queryClient = useQueryClient();
  const stakeContract = {
    abi: stakerAbi,
    address: process.env.NEXT_PUBLIC_STAKE_ADDRESS as Address,
  };
  dayjs.extend(bigIntSupport);
  const { address } = useAccount();
  const [stake, setStake] = useState('');
  const [target, setTarget] = useState<bigint>();
  const [raised, setRaised] = useState<bigint>();
  const [selfRaised, setSelfRaised] = useState<bigint>();
  const [deadline, setDeadline] = useState<bigint>();
  const [countdownTime, setCountdownTime] = useState({ h: 0, m: 0, s: 0 });
  const [notifyStake, setnotifyStake] = useState(true);

  const reads = useReadContracts({
    contracts: [
      {
        ...stakeContract,
        functionName: 'deadline',
      },
      {
        ...stakeContract,
        functionName: 'threshold',
      },
      {
        ...stakeContract,
        functionName: 'raised',
      },
      {
        ...stakeContract,
        functionName: 'balances',
        args: [address as Address],
      },
    ],
  });

  const {
    data: stakeData,
    isPending: stakePending,
    writeContractAsync: stakeWriter,
  } = useWriteContract();

  const { isLoading: stakeConfirming, isSuccess: stakeConfirmed } =
    useWaitForTransactionReceipt({
      hash: stakeData,
    });

  async function stakeEth() {
    await stakeWriter({
      ...stakeContract,
      functionName: 'stake',
      value: parseEther(stake),
    });
    await queryClient.invalidateQueries();
    setnotifyStake(true);
  }

  function handleStake(e: ChangeEvent<HTMLInputElement>) {
    setStake(e.target.value);
  }

  function dismissNotify() {
    setnotifyStake(false);
  }

  useEffect(() => {
    console.log(process.env);
    setDeadline(reads.data?.[0].result);
    setTarget(reads.data?.[1].result);
    setRaised(reads.data?.[2].result);
    setSelfRaised(reads.data?.[3].result);
  }, [reads]);

  useEffect(() => {
    const updater = setInterval(() => {
      const limit = new Date(Number(deadline) * 1000);
      const now = new Date();
      let diff = (limit.getTime() - now.getTime()) / 1000;
      const hours = Math.floor(diff / 3600);
      diff -= hours * 3600;
      const mins = Math.floor(diff / 60) % 60;
      diff -= mins * 60;
      const secs = Math.floor(diff) % 60;
      setCountdownTime({
        h: hours,
        m: mins,
        s: secs,
      });
    }, 1000);
    return () => clearInterval(updater);
  }, [deadline]);

  return (
    <div className="card bg-base-200 shadow-2xl my-4 w-500">
      <div className="card-body text-center items-center">
        <h2 className="card-title">Stake Contract</h2>
        <p className="italic">{`Address: ${stakeContract.address}`}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="stats stats-vertical shadow-xl bg-base-300">
            <div className="stat">
              <div className="stat-title">Target ETH</div>
              <div className="stat-value text-primary">{`${target ? formatEther(target) : 0} ETH`}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Time Remaining</div>
              <div className="stat-value text-warning">
                <span className="font-mono text-2xl">{`${countdownTime.h}h ${countdownTime.m}m ${countdownTime.s}s`}</span>
              </div>
            </div>
          </div>
          <div className="stats stats-vertical shadow-xl bg-base-300">
            <div className="stat">
              <div className="stat-title">Total Staked</div>
              <div className="stat-value text-error">{`${raised ? formatEther(raised) : 0} / ${target ? formatEther(target) : 0} ETH`}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Your Stake</div>
              <div className="stat-value text-success">{`${selfRaised ? formatEther(selfRaised) : 0} ETH`}</div>
            </div>
          </div>
        </div>
        <div className="card-actions grid grid-cols-2 grid-rows-2 gap-4 justify-items-stretch">
          <button className="btn btn-info" disabled={true}>
            Execute
          </button>
          <button className="btn btn-error" disabled={true}>
            Withdraw
          </button>
          <div className="join col-span-2">
            <input
              type="text"
              placeholder="Enter amount"
              className="input input-bordered input-primary join-item"
              disabled={stakePending}
              value={stake}
              onChange={handleStake}
            />
            <button
              className="btn join-item btn-primary"
              onClick={stakeEth}
              disabled={stakePending}
            >
              Stake Now!
            </button>
          </div>
        </div>
        <AnimatePresence>
          {stakePending && (
            <motion.div
              role="alert"
              className="alert alert-warning"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Processing transaction</span>
            </motion.div>
          )}
          {stakeConfirming && (
            <motion.div
              role="alert"
              className="alert alert-info"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Awaiting confirmation</span>
            </motion.div>
          )}
          {stakeConfirmed && notifyStake && (
            <motion.div
              role="alert"
              className="alert alert-success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                <p>Transaction success!</p>
                <p>Hash: {stakeData}</p>
              </span>
              <button className="btn btn-square btn-sm" onClick={dismissNotify}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
