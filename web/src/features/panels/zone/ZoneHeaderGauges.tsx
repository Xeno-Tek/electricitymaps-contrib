import CarbonIntensitySquare from 'components/CarbonIntensitySquare';
import { CircularGauge } from 'components/CircularGauge';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { ZoneDetails } from 'types';
import { Mode } from 'utils/constants';
import { getCarbonIntensity, getFossilFuelRatio, getRenewableRatio } from 'utils/helpers';
import { productionConsumptionAtom, selectedDatetimeStringAtom } from 'utils/state/atoms';

export function ZoneHeaderGauges({ data }: { data?: ZoneDetails }) {
  const { t } = useTranslation();
  const currentMode = useAtomValue(productionConsumptionAtom);
  const selectedDatetimeString = useAtomValue(selectedDatetimeStringAtom);
  const isConsumption = currentMode === Mode.CONSUMPTION;
  const selectedData = data?.zoneStates[selectedDatetimeString];

  const {
    co2intensity,
    renewableRatio,
    fossilFuelRatio,
    co2intensityProduction,
    renewableRatioProduction,
    fossilFuelRatioProduction,
  } = selectedData || {};

  const intensity = getCarbonIntensity(
    { c: { ci: co2intensity }, p: { ci: co2intensityProduction } },
    isConsumption
  );
  const renewable = getRenewableRatio(
    { c: { rr: renewableRatio }, p: { rr: renewableRatioProduction } },
    isConsumption
  );
  const fossilFuelPercentage = getFossilFuelRatio(
    { c: { fr: fossilFuelRatio }, p: { fr: fossilFuelRatioProduction } },
    isConsumption
  );

  return (
    <div className="flex w-full flex-row justify-evenly">
      <CarbonIntensitySquare
        data-test-id="co2-square-value"
        intensity={intensity}
        tooltipContent={<p>{t('tooltips.zoneHeader.carbonIntensity')}</p>}
      />
      <CircularGauge
        name={t('country-panel.lowcarbon')}
        ratio={fossilFuelPercentage}
        tooltipContent={<p>{t('tooltips.zoneHeader.lowcarbon')}</p>}
        testId="zone-header-lowcarbon-gauge"
      />
      <CircularGauge
        name={t('country-panel.renewable')}
        ratio={renewable}
        tooltipContent={<p>{t('tooltips.zoneHeader.renewable')}</p>}
        testId="zone-header-renewable-gauge"
      />
    </div>
  );
}
