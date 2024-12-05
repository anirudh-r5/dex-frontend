'use client';

import { stakerAbi } from '@/app/lib/generated';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { ChangeEvent, useEffect, useState } from 'react';
import { formatEther, parseEther } from 'viem';
import { AnimatePresence, motion } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

export default function Stake() {
  const queryClient = useQueryClient();
  const stakeAddress = '0x59b670e9fA9D0A427751Af201D676719a970857b';
  const { address } = useAccount();
  const [stake, setStake] = useState('');
  const [target, setTarget] = useState<bigint>(BigInt(0));
  const [raised, setRaised] = useState<bigint>(BigInt(0));
  const [selfRaised, setSelfRaised] = useState<bigint>(BigInt(0));
  const [deadline, setDeadline] = useState<number>();
  const [countdownTime, setCountdownTime] = useState({ h: 0, m: 0, s: 0 });
  const [notifyStake, setnotifyStake] = useState(true);
  const { data: timeLeft } = useReadContract({
    abi: stakerAbi,
    address: stakeAddress,
    functionName: 'deadline',
  });

  const { data: targetEth } = useReadContract({
    abi: stakerAbi,
    address: stakeAddress,
    functionName: 'threshold',
  });

  const { data: raisedEth, queryKey } = useReadContract({
    abi: stakerAbi,
    address: stakeAddress,
    functionName: 'raised',
  });

  const { data: selfEth } = useReadContract({
    abi: stakerAbi,
    address: stakeAddress,
    functionName: 'balances',
    args: [address],
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
      abi: stakerAbi,
      address: stakeAddress,
      functionName: 'stake',
      value: parseEther(stake),
    });
    await queryClient.invalidateQueries({ queryKey });
    setnotifyStake(true);
  }

  function handleStake(e: ChangeEvent<HTMLInputElement>) {
    setStake(e.target.value);
  }

  function dismissNotify() {
    setnotifyStake(false);
  }

  useEffect(() => {
    if (targetEth) setTarget(targetEth);
    if (raisedEth) setRaised(raisedEth);
    if (selfEth) setSelfRaised(selfEth);
    setDeadline(Number(timeLeft));
    const limit = dayjs(Number(timeLeft));
    const dead = {
      h: limit.diff(dayjs(), 'h'),
      m: limit.diff(dayjs(), 'm'),
      s: limit.diff(dayjs(), 's'),
    };
    setCountdownTime(dead);
  }, [targetEth, raisedEth, selfEth, timeLeft]);

  useEffect(() => {
    const updater = setInterval(() => {
      const limit = dayjs(deadline);
      const dead = {
        h: limit.diff(dayjs(), 'h'),
        m: limit.diff(dayjs(), 'm'),
        s: limit.diff(dayjs(), 's'),
      };
      setCountdownTime(dead);
    }, 1000);
    return () => clearInterval(updater);
  }, [deadline]);

  return (
    <div className="card bg-base-200 shadow-2xl my-4 w-500">
      <div className="card-body text-center items-center">
        <h2 className="card-title">Stake Contract</h2>
        <p className="italic">{`Address: ${stakeAddress}`}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="stats stats-vertical shadow-xl bg-base-300">
            <div className="stat">
              <div className="stat-title">Target ETH</div>
              <div className="stat-value text-primary">{`${formatEther(target)} ETH`}</div>
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
              <div className="stat-value text-error">{`${formatEther(raised)}/${formatEther(target)} ETH`}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Your Stake</div>
              <div className="stat-value text-success">{`${formatEther(selfRaised)} ETH`}</div>
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
