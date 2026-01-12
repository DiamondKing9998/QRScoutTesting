import { Button } from '@/components/ui/button';
import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CounterInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

export default function CounterInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<CounterInputData>(props.section, props.code),
  );

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [value, setValue] = useState(data.defaultValue);

  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
      if (force) {
        setValue(data.defaultValue);
        return;
      }
      switch (data.formResetBehavior) {
        case 'reset':
          setValue(data.defaultValue);
          return;
        case 'increment':
          setValue(prev => (typeof prev === 'number' ? prev + data.step : 1));
          return;
        case 'preserve':
          return;
        default:
          return;
      }
    },
    [value],
  );

  useEvent('resetFields', resetState);

  const handleChange = useCallback(
    (increment: number) => {
      const newVal = value + increment;
      if (data.max !== undefined && newVal > data.max) {
        // Don't fire the event if the new value would be greater than the max
        return;
      }
      if (data.min !== undefined && newVal < data.min) {
        // Don't fire the event if the new value would be less than the min
        return;
      }
      setValue(newVal);
    },
    [data.max, data.min, value],
  );

  useEffect(() => {
    updateValue(props.code, value);
  }, [value]);

  const increments = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), []);

  return (
    <div className="my-2 flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center gap-2">
        {increments.map(inc => (
          <Button
            key={`dec-${inc}`}
            variant="outline"
            size="sm"
            className="px-2 py-1 text-sm"
            onClick={() => handleChange(-inc)}
          >
            -{inc}
          </Button>
        ))}
      </div>

      <h2 className="px-4 text-2xl dark:text-white">{value}</h2>

      <div className="flex flex-wrap justify-center gap-2">
        {increments.map(inc => (
          <Button
            key={`inc-${inc}`}
            variant="outline"
            size="sm"
            className="px-2 py-1 text-sm"
            onClick={() => handleChange(inc)}
          >
            +{inc}
          </Button>
        ))}
      </div>
    </div>
  );
}
