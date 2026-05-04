// @ts-nocheck
(() => {
    const PATCH_FLAG = "__eternalJukeboxLowLagPatchNoVolumeV5";
    const DEFAULT_SEEK_LEAD_MS = 56;
    const MIN_SEEK_LEAD_MS = 24;
    const MAX_SEEK_LEAD_MS = 110;
    const SEEK_LEAD_BIAS_MS = 4;
    const BACKWARD_SEEK_SETTLE_MS = 80;
    const SEEK_EPSILON_MS = 8;
    const START_WAIT_EPSILON_MS = 4;

    function now() {
        return typeof performance !== "undefined" && typeof performance.now === "function"
            ? performance.now()
            : Date.now();
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function getProgress() {
        return Number(Spicetify?.Player?.getProgress?.() ?? 0);
    }

    function getVolumeController() {
        const candidates = [
            Spicetify?.Platform?.PlayerAPI,
            Spicetify?.Player,
        ];

        return candidates.find((candidate) => (
            candidate
            && typeof candidate.setVolume === "function"
        )) ?? null;
    }

    function restoreLegacyDuckedVolume(driver) {
        const baseVolume = Number(driver?.__ejbBaseVolume);
        const controller = getVolumeController();

        if (!Number.isFinite(baseVolume)) {
            return;
        }

        if (controller) {
            try {
                controller.setVolume.call(controller, baseVolume);
            } catch (error) {
                console.error(error);
            }
        }

        driver.__ejbBaseVolume = null;
    }

    function clearLegacyTransition(driver) {
        window.clearTimeout(driver?.__ejbTransitionTimer);
        window.clearTimeout(driver?.__ejbRestoreTimer);

        if (driver?.__ejbVolumeFrame) {
            window.cancelAnimationFrame?.(driver.__ejbVolumeFrame);
            window.clearTimeout(driver.__ejbVolumeFrame);
        }

        restoreLegacyDuckedVolume(driver);

        if (driver) {
            driver.__ejbTransitionTimer = 0;
            driver.__ejbRestoreTimer = 0;
            driver.__ejbVolumeFrame = 0;
        }
    }

    function seekTo(positionMs) {
        try {
            const playerApi = Spicetify?.Platform?.PlayerAPI;
            const seek = playerApi?.seekTo ?? Spicetify?.Player?.seek;

            if (typeof seek !== "function") {
                return;
            }

            const result = seek.call(playerApi ?? Spicetify.Player, positionMs);
            result?.catch?.(console.error);
        } catch (error) {
            console.error(error);
        }
    }

    function clearPrepared(driver) {
        driver.__ejbPreparedNext = null;
        driver.__ejbPreparedSeek = false;
        driver.__ejbSkipPlayBeat = false;
        driver.__ejbPreparedStart = null;
        driver.__ejbPreparedTarget = null;
        driver.__ejbWaitingForPreparedStart = false;
    }

    function getSeekLead(driver) {
        const lead = Number(driver.__ejbSeekLeadMs);
        return Number.isFinite(lead) ? lead : DEFAULT_SEEK_LEAD_MS;
    }

    function getExpectedSeekLatency(driver) {
        return Math.max(0, getSeekLead(driver) - SEEK_LEAD_BIAS_MS);
    }

    function updateSeekLead(driver, measuredLatencyMs) {
        if (!Number.isFinite(measuredLatencyMs) || measuredLatencyMs < 5 || measuredLatencyMs > 500) {
            return;
        }

        driver.__ejbSeekLeadMs = clamp(
            getSeekLead(driver) * 0.65 + (measuredLatencyMs + SEEK_LEAD_BIAS_MS) * 0.35,
            MIN_SEEK_LEAD_MS,
            MAX_SEEK_LEAD_MS
        );
    }

    function asArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function activateBranchEdge(driver, edge) {
        driver.beatsSinceLastBranch = 0;
        driver.lastBranch = edge;
        driver.setLastBranchPlaying?.(true);
        return edge.destination;
    }

    function selectOriginalRandomNextBeat(driver, beat) {
        if (!beat || asArray(beat.neighbours).length === 0 || !driver.shouldRandomBranch?.(beat)) {
            return beat;
        }

        const edge = beat.neighbours.shift();
        beat.neighbours.push(edge);
        return activateBranchEdge(driver, edge);
    }

    function selectOriginalForcedNeighbor(driver, beat) {
        if (!beat || asArray(beat.neighbours).length === 0) {
            return beat;
        }

        const edge = beat.neighbours.shift();
        beat.neighbours.push(edge);
        return activateBranchEdge(driver, edge);
    }

    function choosePreparedNext(driver) {
        const currentBeat = driver.currentBeat;

        if (!currentBeat) {
            return null;
        }

        if (driver.bouncing) {
            if (driver.bounceSeed === null) {
                driver.bounceSeed = currentBeat;
                driver.bounceCount = 0;
            }

            return driver.bounceCount++ % 2 === 1
                ? driver.selectNextNeighbor(driver.bounceSeed)
                : driver.bounceSeed;
        }

        if (driver.bounceSeed !== null) {
            const next = driver.bounceSeed;
            driver.bounceSeed = null;
            return next;
        }

        const beats = driver.songState?.graph?.beats ?? [];
        const nextIndex = currentBeat.index + 1;

        return nextIndex >= beats.length ? null : driver.selectRandomNextBeat(beats[nextIndex]);
    }

    function getNextBeat(driver, progress, outOfSync) {
        if (driver.__ejbPreparedNext) {
            const next = driver.__ejbPreparedNext;
            const shouldUsePrepared = !outOfSync || driver.__ejbPreparedSeek;
            const shouldSkipPlayBeat = shouldUsePrepared && driver.__ejbPreparedSeek;

            clearPrepared(driver);
            driver.__ejbSkipPlayBeat = shouldSkipPlayBeat;

            if (shouldUsePrepared) {
                return next;
            }
        }

        if (driver.currentBeat === null || outOfSync) {
            for (const beat of driver.songState.graph.beats) {
                if (progress >= beat.start && progress <= beat.end) {
                    return beat;
                }
            }

            return driver.songState.graph.beats[0];
        }

        if (driver.bouncing) {
            if (driver.bounceSeed === null) {
                driver.bounceSeed = driver.currentBeat;
                driver.bounceCount = 0;
            }

            return driver.bounceCount++ % 2 === 1
                ? driver.selectNextNeighbor(driver.bounceSeed)
                : driver.bounceSeed;
        }

        if (driver.bounceSeed !== null) {
            const next = driver.bounceSeed;
            driver.bounceSeed = null;
            return next;
        }

        const nextIndex = driver.currentBeat.index + 1;

        if (nextIndex >= driver.songState.graph.beats.length) {
            driver.stop();
            return null;
        }

        return driver.selectRandomNextBeat(driver.songState.graph.beats[nextIndex]);
    }

    function createSeekResolver(driver, target, destinationStart, requestProgress, requestedAt) {
        let settled = false;

        return (value) => {
            if (settled) {
                return true;
            }

            const didSettle = target > requestProgress
                ? value >= target - SEEK_EPSILON_MS
                : value <= target + BACKWARD_SEEK_SETTLE_MS;

            if (didSettle) {
                settled = true;
                updateSeekLead(driver, now() - requestedAt);
                driver.__ejbWaitingForPreparedStart = value < destinationStart - START_WAIT_EPSILON_MS;
            }

            return didSettle;
        };
    }

    function prepareEarlySeek(driver, progress) {
        if (driver.__ejbPreparedNext || driver.isSeekingResolver) {
            return;
        }

        const currentBeat = driver.currentBeat;

        if (!currentBeat?.next || !Number.isFinite(progress) || !currentBeat.isInBeat(progress)) {
            return;
        }

        const remainingMs = currentBeat.end - progress;

        if (remainingMs <= 0 || remainingMs > getSeekLead(driver)) {
            return;
        }

        const previousBeatsSinceLastBranch = Number(driver.beatsSinceLastBranch);

        if (Number.isFinite(previousBeatsSinceLastBranch)) {
            driver.beatsSinceLastBranch = previousBeatsSinceLastBranch + 1;
        }

        const next = choosePreparedNext(driver);
        const isBranch = Boolean(next && currentBeat.index + 1 !== next.index);

        if (Number.isFinite(previousBeatsSinceLastBranch)) {
            driver.beatsSinceLastBranch = isBranch ? -1 : previousBeatsSinceLastBranch;
        }

        if (!next) {
            return;
        }

        driver.__ejbPreparedNext = next;

        if (!isBranch) {
            return;
        }

        const expectedLatencyMs = getExpectedSeekLatency(driver);
        const target = Math.max(0, Math.floor(next.start + expectedLatencyMs - remainingMs));
        const currentProgress = getProgress();
        const requestedAt = now();

        driver.__ejbPreparedStart = next.start;
        driver.__ejbPreparedTarget = target;
        driver.__ejbPreparedSeek = true;
        driver.isSeekingResolver = createSeekResolver(driver, target, next.start, currentProgress, requestedAt);

        seekTo(target);
    }

    async function process(driver, progress) {
        clearLegacyTransition(driver);
        prepareEarlySeek(driver, progress);

        if (driver.isSeekingResolver !== null) {
            if (!driver.isSeekingResolver(progress)) {
                return;
            }

            driver.isSeekingResolver = null;
        }

        if (driver.__ejbWaitingForPreparedStart) {
            const preparedStart = Number(driver.__ejbPreparedStart);

            if (Number.isFinite(preparedStart) && progress < preparedStart - START_WAIT_EPSILON_MS) {
                return;
            }

            driver.__ejbWaitingForPreparedStart = false;
        }

        if (driver.lastBranch !== null) {
            driver.setLastBranchPlaying(false);
        }

        if (driver.currentBeat !== null) {
            if (driver.currentBeat.isInBeat(progress)) {
                return;
            }

            driver.currentBeat.isPlaying = false;
        }

        driver.beatsSinceLastBranch++;

        const previousBeat = driver.currentBeat;
        const nextEnd = driver.currentBeat?.next?.end;
        const previousStart = driver.currentBeat?.previous?.start;
        const outOfSync = (nextEnd != null && nextEnd < progress) || (previousStart != null && progress < previousStart);

        if (outOfSync) {
            console.error(`Out of sync ! ${progress} - ${driver.currentBeat?.toString()}`);
        }

        driver.currentBeat = getNextBeat(driver, progress, outOfSync);

        if (driver.currentBeat === null) {
            return;
        }

        const shouldSkipPlayBeat = driver.__ejbSkipPlayBeat;
        driver.__ejbSkipPlayBeat = false;

        if (!shouldSkipPlayBeat) {
            await driver.playBeat(previousBeat, driver.currentBeat, progress, outOfSync);
        }

        driver.currentBeat.playCount += 1;
        driver.songState.beatsPlayed += 1;

        if (previousBeat !== null) {
            previousBeat.isPlaying = false;
        }

        driver.currentBeat.isPlaying = true;
        driver.onProgressSubject.next();
    }

    function patchDriver(driver) {
        if (!driver || driver[PATCH_FLAG]) {
            clearLegacyTransition(driver);
            return;
        }

        Object.defineProperty(driver, PATCH_FLAG, { value: true });
        clearLegacyTransition(driver);

        const originalStop = driver.stop.bind(driver);

        driver.process = function processWithoutVolumeDuck(progress) {
            return process(this, progress);
        };

        driver.getNextBeat = function getNextBeatWithoutVolumeDuck(progress, outOfSync) {
            return getNextBeat(this, progress, outOfSync);
        };

        driver.selectRandomNextBeat = function selectRandomNextBeatOriginalRotation(beat) {
            return selectOriginalRandomNextBeat(this, beat);
        };

        driver.selectNextNeighbor = function selectNextNeighborOriginalRotation(beat) {
            return selectOriginalForcedNeighbor(this, beat);
        };

        driver.stop = function stopWithoutVolumeDuck(...args) {
            clearLegacyTransition(this);
            clearPrepared(this);
            return originalStop(...args);
        };
    }

    function patchJukebox(jukebox) {
        if (!jukebox) {
            return false;
        }

        patchDriver(jukebox.driver);

        if (jukebox[PATCH_FLAG]) {
            return true;
        }

        Object.defineProperty(jukebox, PATCH_FLAG, { value: true });

        const originalStart = jukebox.start.bind(jukebox);

        jukebox.start = async function startWithNoVolumeDuckDriver(...args) {
            const result = await originalStart(...args);
            patchDriver(this.driver);
            return result;
        };

        return true;
    }

    const waitForJukebox = window.setInterval(() => {
        if (patchJukebox(window.jukebox)) {
            window.clearInterval(waitForJukebox);
        }
    }, 250);
})();

