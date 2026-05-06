import { getTrack } from '@shared/api/endpoints/tracks/get-track';
import { waitForSpicetify } from '@shared/utils/spicetify-utils';
import i18next from 'i18next';
import { EarthLock } from 'lucide-react';
import React from 'react';
import { WorldMap } from './components/WorldMap/WorldMap';
import { getIsoCountriesLocale, registerMapLocale } from './utils/i18n-utils';

async function showAvailability(uris: string[], locale: string): Promise<void> {
    const track = await getTrack({ uri: uris[0], withoutMarket: true });

    Spicetify.PopupModal.display({
        title: i18next.t('modalTitle'),
        content: (
            <WorldMap
                trackMarkets={track.available_markets ?? []}
                locale={locale}
            />
        ),
        isLarge: true,
    });
}

function isSingleTrack(uris: string[]): boolean {
    return uris.length === 1 && Spicetify.URI.isTrack(uris[0]);
}

async function main(): Promise<void> {
    await waitForSpicetify();

    const locale: string = Spicetify.Locale.getLocale();

    await i18next.init({
        lng: locale,
        fallbackLng: 'en',
        debug: false,
        resources: {
            en: {
                translation: {
                    showAvailability: 'Show availability',
                    modalTitle: 'Availability map',
                },
            },
            fr: {
                translation: {
                    showAvailability: 'Voir la disponibilité',
                    modalTitle: 'Carte des disponibilités',
                },
            },
        },
    });

    const isoCountriesLocale = getIsoCountriesLocale(locale);
    registerMapLocale(isoCountriesLocale);

    const menuItem = new Spicetify.ContextMenu.Item(
        i18next.t('showAvailability'),
        (uris) => {
            void showAvailability(uris, isoCountriesLocale);
        },
        isSingleTrack,
        Spicetify.ReactDOMServer.renderToString(
            <EarthLock size={16} color="var(--text-subdued)" strokeWidth={1} />,
        ),
        false,
    );

    menuItem.register();
}

export default main;
