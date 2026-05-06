import { getPlatform, waitForSpicetify } from '@shared/utils/spicetify-utils';
import { addUpdateChecker } from '@shared/utils/version-utils';
import { FolderSync, FolderX } from 'lucide-react';
import React from 'react';
import { version } from '../../package.json';
import { LocalTracksService } from '../services/local-tracks-service';

void (async () => {
    await waitForSpicetify();

    // Necessary to share the same instance between the extension and the custom app
    window.localTracksService = new LocalTracksService();

    const history = getPlatform().History;

    const REBUILD_MENU_ICON: string = Spicetify.ReactDOMServer.renderToString(
        <FolderSync size={16} strokeWidth={1.5} />,
    );

    const rebuildMenuItem = new Spicetify.Menu.Item(
        'Rebuild local album cache',
        false,
        () => {
            void window.localTracksService.reset();
        },
        REBUILD_MENU_ICON,
    );

    const CLEAR_CACHE_MENU_ICON: string =
        Spicetify.ReactDOMServer.renderToString(
            <FolderX size={16} strokeWidth={1.5} />,
        );

    const clearCacheMenuItem = new Spicetify.Menu.Item(
        'Clear local album cache',
        false,
        () => {
            void window.localTracksService.clearCache();
        },
        CLEAR_CACHE_MENU_ICON,
    );

    const handlePathnameChange = (pathname: string): void => {
        if (pathname.includes('better-local-files')) {
            rebuildMenuItem.register();
            clearCacheMenuItem.register();
        } else {
            rebuildMenuItem.deregister();
            clearCacheMenuItem.deregister();
        }
    };

    handlePathnameChange(history.location.pathname);

    history.listen((event) => {
        handlePathnameChange(event.pathname);
    });

    await addUpdateChecker(version, 'better-local-files');
})();
