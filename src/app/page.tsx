import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';

export default function Home() {
  return (
    <div className='relative flex h-screen w-full items-center justify-center overflow-hidden cursor-crosshair bg-black'>
      <InteractiveGridPattern />
    </div>
  );
}
