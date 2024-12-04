'use client';

import { stakerAbi } from '@/app/lib/generated';
import { useReadContract } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';

export default function Stake() {
  const queryClient = useQueryClient();
  const { data, queryKey } = useReadContract({
    abi: stakerAbi,
    address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    functionName: 'timeLeft',
  });
  async function checkContract() {
    await queryClient.invalidateQueries({ queryKey });
    console.log(data);
  }
  return (
    <div className="card bg-base-200 shadow-2xl my-4">
      <div className="card-body text-center items-center">
        <h2 className="card-title">Stake Contract</h2>
        <p className="italic">By: 0x1234...ab0f</p>
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
          <button
            className="btn btn-primary col-span-2"
            onClick={checkContract}
          >
            Stake Now!
          </button>
        </div>
      </div>
    </div>
  );
}
