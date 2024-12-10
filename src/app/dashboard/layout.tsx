import Tabs from '../components/ui/dashboard/Tabs';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-flow-row grid-cols-1 auto-rows-max px-4 py-4 h-full">
      <div>
        <Tabs />
      </div>
      {children}
    </div>
  );
}
