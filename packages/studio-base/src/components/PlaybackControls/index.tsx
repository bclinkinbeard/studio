// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { IButtonStyles, useTheme } from "@fluentui/react";
import { Stack } from "@mui/material";
import { merge } from "lodash";
import { useCallback, useMemo, useState } from "react";

import { compare, Time } from "@foxglove/rostime";
import HoverableIconButton from "@foxglove/studio-base/components/HoverableIconButton";
import KeyListener from "@foxglove/studio-base/components/KeyListener";
import MessageOrderControls from "@foxglove/studio-base/components/MessageOrderControls";
import {
  jumpSeek,
  DIRECTION,
} from "@foxglove/studio-base/components/PlaybackControls/sharedHelpers";
import PlaybackSpeedControls from "@foxglove/studio-base/components/PlaybackSpeedControls";
import Tooltip from "@foxglove/studio-base/components/Tooltip";

import PlaybackTimeDisplay from "./PlaybackTimeDisplay";
import RepeatAdapter from "./RepeatAdapter";
import Scrubber from "./Scrubber";

export default function PlaybackControls({
  play,
  pause,
  seek,
  isPlaying,
  getTimeInfo,
}: {
  play: () => void;
  pause: () => void;
  seek: (time: Time) => void;
  isPlaying: boolean;
  getTimeInfo: () => { startTime?: Time; endTime?: Time; currentTime?: Time };
}): JSX.Element {
  const theme = useTheme();
  const [repeat, setRepeat] = useState(false);

  const resumePlay = useCallback(() => {
    const { startTime: start, endTime: end, currentTime: current } = getTimeInfo();
    // if we are at the end, we need to go back to start
    if (current && end && start && compare(current, end) >= 0) {
      seek(start);
    }
    play();
  }, [getTimeInfo, play, seek]);

  const toggleRepeat = useCallback(() => {
    setRepeat((old) => !old);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      resumePlay();
    }
  }, [pause, resumePlay, isPlaying]);

  const keyDownHandlers = useMemo(
    () => ({
      " ": togglePlayPause,
      ArrowLeft: (ev: KeyboardEvent) => {
        const { currentTime } = getTimeInfo();
        if (!currentTime) {
          return;
        }
        seek(jumpSeek(DIRECTION.BACKWARD, currentTime, ev));
      },
      ArrowRight: (ev: KeyboardEvent) => {
        const { currentTime } = getTimeInfo();
        if (!currentTime) {
          return;
        }
        seek(jumpSeek(DIRECTION.FORWARD, currentTime, ev));
      },
    }),
    [getTimeInfo, seek, togglePlayPause],
  );

  const iconButtonStyles: IButtonStyles = {
    icon: { height: 20 },
    root: {
      color: theme.semanticColors.buttonText,
    },
    rootChecked: {
      color: theme.palette.themePrimary,
      backgroundColor: "transparent",
    },
    rootCheckedHovered: { color: theme.palette.themePrimary },
    rootHovered: { color: theme.semanticColors.buttonTextHovered },
    rootPressed: { color: theme.semanticColors.buttonTextPressed },
  };

  const seekIconButttonStyles = ({
    left = false,
    right = false,
  }: {
    left?: boolean | undefined;
    right?: boolean | undefined;
  }) =>
    ({
      root: {
        background: theme.semanticColors.buttonBackgroundHovered,
        ...(left && {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }),
        ...(right && {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }),
      },
      rootHovered: {
        background: theme.semanticColors.buttonBackgroundPressed,
      },
    } as IButtonStyles);

  return (
    <>
      <RepeatAdapter
        play={play}
        pause={pause}
        seek={seek}
        repeatEnabled={repeat}
        isPlaying={isPlaying}
      />
      <KeyListener global keyDownHandlers={keyDownHandlers} />
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        padding={1}
        sx={{
          backgroundColor: theme.palette.neutralLighterAlt,
          borderTop: `1px solid ${theme.palette.neutralLighter}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <MessageOrderControls />
          <PlaybackSpeedControls />
        </Stack>
        <Stack direction="row" alignItems="center" flex={1} spacing={1} paddingX={0.5}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <div>
              <Tooltip contents="Loop playback">
                <HoverableIconButton
                  checked={repeat}
                  onClick={toggleRepeat}
                  iconProps={{
                    iconName: repeat ? "LoopFilled" : "Loop",
                    iconNameActive: "LoopFilled",
                  }}
                  styles={merge(iconButtonStyles, {
                    rootDisabled: { background: "transparent" },
                  })}
                />
              </Tooltip>
            </div>
            <div>
              <HoverableIconButton
                onClick={isPlaying ? pause : resumePlay}
                iconProps={{
                  iconName: isPlaying ? "Pause" : "Play",
                  iconNameActive: isPlaying ? "PauseFilled" : "PlayFilled",
                }}
                styles={merge(iconButtonStyles, {
                  rootDisabled: { background: "transparent" },
                })}
              />
            </div>
          </Stack>
          <Scrubber onSeek={seek} />
          <PlaybackTimeDisplay onSeek={seek} onPause={pause} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.25}>
          <div>
            <Tooltip contents="Seek backward">
              <HoverableIconButton
                iconProps={{ iconName: "Previous", iconNameActive: "PreviousFilled" }}
                onClick={() => {
                  const { currentTime } = getTimeInfo();
                  if (!currentTime) {
                    return;
                  }
                  seek(jumpSeek(DIRECTION.BACKWARD, currentTime));
                }}
                styles={merge(seekIconButttonStyles({ left: true }), iconButtonStyles)}
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip contents="Seek forward">
              <HoverableIconButton
                iconProps={{ iconName: "Next", iconNameActive: "NextFilled" }}
                onClick={() => {
                  const { currentTime } = getTimeInfo();
                  if (!currentTime) {
                    return;
                  }
                  seek(jumpSeek(DIRECTION.FORWARD, currentTime));
                }}
                styles={merge(seekIconButttonStyles({ right: true }), iconButtonStyles)}
              />
            </Tooltip>
          </div>
        </Stack>
      </Stack>
    </>
  );
}
