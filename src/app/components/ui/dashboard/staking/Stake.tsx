'use client';

import { stakerAbi } from '@/app/lib/generated';
import { useReadContract, useWriteContract } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';

export default function Stake() {
  const queryClient = useQueryClient();
  const stakeAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
  const { data: timeLeft, queryKey } = useReadContract({
    abi: stakerAbi,
    address: stakeAddress,
    functionName: 'timeLeft',
  });
  const {
    data: stakeData,
    isPending: stakePending,
    writeContractAsync: stakeWriter,
  } = useWriteContract();

  async function stakeEth() {
    await stakeWriter({
      abi: stakerAbi,
      address: stakeAddress,
      functionName: 'stake',
    });
    console.log(stakeData);
  }

  async function checkTimeLeft() {
    await queryClient.invalidateQueries({ queryKey });
    console.log(timeLeft);
  }

  return (
    <div className="card bg-base-200 shadow-2xl my-4">
      <div className="card-body text-center items-center">
        <h2 className="card-title">Stake Contract</h2>
        <p className="italic">{`Address: ${stakeAddress}`}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="stats stats-vertical shadow-xl bg-base-300">
            <div className="stat">
              <div className="stat-title">Target ETH</div>
              <div className="stat-value text-primary">10 ETH</div>
            </div>

            <div className="stat">
              <div className="stat-title">Time Remaining</div>
              <div className="stat-value text-warning">
                <span className="countdown font-mono text-2xl">
                  <span></span>h<span></span>m<span></span>s
                </span>
              </div>
            </div>
          </div>
          <div className="stats stats-vertical shadow-xl bg-base-300">
            <div className="stat">
              <div className="stat-title">Total Staked</div>
              <div className="stat-value text-error"> 5 / 10 ETH</div>
            </div>

            <div className="stat">
              <div className="stat-title">Your Stake</div>
              <div className="stat-value text-success">2 ETH</div>
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
      </div>
    </div>
  );
}
