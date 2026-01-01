import Robokings from '@/assets/Robokings.svg';

export function Logo() {
  return (
    <img
      src={Robokings}
      alt="Robokings logo"
      className="h-full w-full object-contain"
      loading="lazy"
    />
  );
}
