import TravelLensLogo from '../assets/travel-lens-logo.svg';

interface LogoHeaderProps {
  size: string;
}

export const LogoHeader = ({ size }: LogoHeaderProps) => (
  <header className="w-full px-4 pt-2 flex items-center justify-start gap-2">
    <img
      src={TravelLensLogo}
      alt="TravelLens logo"
      className={`${size === 'small' ? 'h-8' : 'h-12'}`}
    />
    <h1
      className={`${
        size === 'small' ? 'text-md' : 'text-2xl'
      } font-bold text-darkGreen`}
    >
      TravelLens
    </h1>
  </header>
);
