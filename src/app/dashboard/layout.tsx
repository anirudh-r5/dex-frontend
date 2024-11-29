import Tabs from '../components/ui/dashboard/Tabs';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col px-4 py-4">
      <div className="grow">
        <Tabs />
      </div>
      {children}
    </div>
  );
}
