export default function Stake() {
  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <div className="card-body text-center items-center">
        <h2 className="card-title">Stake Contract</h2>
        <p className="italic">By: 0x1234...ab0f</p>
        <div className="card-actions grid grid-cols-2 grid-rows-2 gap-4 justify-items-stretch">
          <button className="btn btn-info" disabled={true}>
            Execute
          </button>
          <button className="btn btn-error" disabled={true}>
            Withdraw
          </button>
          <button className="btn btn-primary col-span-2">Stake Now!</button>
        </div>
      </div>
    </div>
  );
}
