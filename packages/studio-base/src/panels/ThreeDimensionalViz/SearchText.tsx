// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2019-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { IButtonStyles, IconButton, TextField, useTheme } from "@fluentui/react";
import { Stack } from "@mui/material";
import { vec3 } from "gl-matrix";
import { range, throttle } from "lodash";
import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";

import { CameraState, cameraStateSelectors } from "@foxglove/regl-worldview";
import { Time } from "@foxglove/rostime";
import { useTooltip } from "@foxglove/studio-base/components/Tooltip";
import useDeepChangeDetector from "@foxglove/studio-base/hooks/useDeepChangeDetector";
import { Interactive } from "@foxglove/studio-base/panels/ThreeDimensionalViz/Interactions/types";
import { IImmutableTransformTree } from "@foxglove/studio-base/panels/ThreeDimensionalViz/transforms";
import { TextMarker, Color } from "@foxglove/studio-base/types/Messages";
import { emptyPose } from "@foxglove/studio-base/util/Pose";

export const YELLOW = { r: 1, b: 0, g: 1, a: 1 };
export const ORANGE = { r: 0.97, g: 0.58, b: 0.02, a: 1 };

export type GLTextMarker = TextMarker & {
  highlightedIndices?: number[];
  highlightColor?: Color;
};

export type WorldSearchTextProps = {
  searchTextOpen: boolean;
  searchText: string;
  setSearchTextMatches: (markers: GLTextMarker[]) => void;
  searchTextMatches: GLTextMarker[];
  selectedMatchIndex: number;
};

export type SearchTextProps = WorldSearchTextProps & {
  // eslint-disable-next-line @foxglove/no-boolean-parameters
  toggleSearchTextOpen: (bool: boolean) => void;
  setSearchText: (searchText: string) => void;
  setSelectedMatchIndex: (index: number) => void;
  searchInputRef: { current: HTMLInputElement | ReactNull };
};

export const getHighlightedIndices = (text: string, searchText: string): number[] => {
  const highlightedIndicesSet = new Set<number>();
  let match;
  let startingIndex = 0;
  const lowerCaseSearchText = searchText.toLowerCase();
  const lowerCaseText = text.toLowerCase();
  while ((match = lowerCaseText.indexOf(lowerCaseSearchText, startingIndex)) !== -1) {
    range(match, match + searchText.length).forEach((index) => {
      highlightedIndicesSet.add(index);
    });
    startingIndex = match + 1;
  }

  return Array.from(highlightedIndicesSet);
};

export const useGLText = ({
  text,
  searchText,
  searchTextOpen,
  selectedMatchIndex,
  setSearchTextMatches,
  searchTextMatches,
}: WorldSearchTextProps & {
  text: Interactive<TextMarker>[];
}): Interactive<GLTextMarker>[] => {
  let numMatches = 0;
  const glText: Interactive<GLTextMarker>[] = text.map((marker) => {
    // RViz ignores scale.x/y for text and only uses z
    const z = marker.scale.z;
    const scale = { x: z, y: z, z };

    if (searchText.length === 0 || !searchTextOpen) {
      return { ...marker, scale };
    }

    const highlightedIndices = getHighlightedIndices(marker.text, searchText);

    if (highlightedIndices.length > 0) {
      numMatches += 1;
      const highlightedMarker = {
        ...marker,
        scale,
        highlightColor: selectedMatchIndex + 1 === numMatches ? ORANGE : YELLOW,
        highlightedIndices,
      };
      return highlightedMarker;
    }

    return { ...marker, scale };
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledSetSearchTextMatches = useCallback(
    throttle(setSearchTextMatches, 200, { trailing: true }),
    [setSearchTextMatches],
  );

  useEffect(() => {
    if (!searchTextOpen && searchTextMatches.length === 0) {
      return;
    }
    const matches = glText.filter((marker) => marker.highlightedIndices?.length);
    if (matches.length > 0) {
      throttledSetSearchTextMatches(matches);
    } else if (searchTextMatches.length > 0) {
      throttledSetSearchTextMatches([]);
    }
  }, [throttledSetSearchTextMatches, glText, searchText, searchTextMatches.length, searchTextOpen]);

  return glText;
};

export const useSearchText = (): SearchTextProps => {
  const [searchTextOpen, toggleSearchTextOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchTextMatches, setSearchTextMatches] = useState<GLTextMarker[]>([]);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(ReactNull);

  return {
    searchTextOpen,
    toggleSearchTextOpen,
    searchText,
    setSearchText,
    setSearchTextMatches,
    searchTextMatches,
    selectedMatchIndex,
    setSelectedMatchIndex,
    searchInputRef,
  };
};
type SearchTextComponentProps = SearchTextProps & {
  onCameraStateChange: (arg0: CameraState) => void;
  cameraState: CameraState;
  renderFrameId?: string;
  fixedFrameId?: string;
  currentTime: Time;
  transforms: IImmutableTransformTree;
};

// Exported for tests.
export const useSearchMatches = ({
  cameraState,
  currentMatch,
  onCameraStateChange,
  renderFrameId,
  fixedFrameId,
  currentTime,
  searchTextOpen,
  transforms,
}: {
  cameraState: CameraState;
  currentMatch?: GLTextMarker;
  onCameraStateChange: (arg0: CameraState) => void;
  renderFrameId?: string;
  fixedFrameId?: string;
  currentTime: Time;
  searchTextOpen: boolean;
  transforms: IImmutableTransformTree;
}): void => {
  const hasCurrentMatchChanged = useDeepChangeDetector([currentMatch], { initiallyTrue: true });

  useEffect(() => {
    if (!currentMatch || !searchTextOpen || renderFrameId == undefined || !hasCurrentMatchChanged) {
      return;
    }
    if (fixedFrameId == undefined) {
      throw new Error(`renderFrameId="${renderFrameId}" but fixedFrame is undefined`);
    }

    const output = transforms.apply(
      emptyPose(),
      currentMatch.pose,
      renderFrameId,
      fixedFrameId,
      currentMatch.header.frame_id,
      currentTime,
      currentTime,
    );
    if (output == undefined) {
      return;
    }
    const {
      position: { x, y, z },
    } = output;

    const targetHeading: number = cameraStateSelectors.targetHeading(cameraState);
    const targetOffset: vec3 = [0, 0, 0];
    vec3.rotateZ(
      targetOffset,
      vec3.subtract(targetOffset, [x, y, z], cameraState.target),
      [0, 0, 0],
      targetHeading,
    );
    onCameraStateChange({ ...cameraState, targetOffset });
  }, [
    cameraState,
    currentMatch,
    currentTime,
    fixedFrameId,
    hasCurrentMatchChanged,
    onCameraStateChange,
    renderFrameId,
    searchTextOpen,
    transforms,
  ]);
};

const arrowButtonStyles = {
  icon: { height: 18, fontSize: 10 },
  root: { backgroundColor: "transparent", width: 18 },
  rootHovered: { backgroundColor: "transparent" },
  rootPressed: { backgroundColor: "transparent" },
  rootDisabled: { backgroundColor: "transparent" },
} as Partial<IButtonStyles>;

const SearchText = React.memo<SearchTextComponentProps>(function SearchText({
  searchTextOpen,
  toggleSearchTextOpen,
  searchText,
  setSearchText,
  searchInputRef,
  setSelectedMatchIndex,
  selectedMatchIndex,
  searchTextMatches,
  onCameraStateChange,
  cameraState,
  transforms,
  renderFrameId,
  fixedFrameId,
  currentTime,
}: SearchTextComponentProps) {
  const theme = useTheme();
  const currentMatch = searchTextMatches[selectedMatchIndex];
  const iterateCurrentIndex = useCallback(
    (iterator: number) => {
      const newIndex = selectedMatchIndex + iterator;
      if (newIndex >= searchTextMatches.length) {
        setSelectedMatchIndex(0);
      } else if (newIndex < 0) {
        setSelectedMatchIndex(searchTextMatches.length - 1);
      } else {
        setSelectedMatchIndex(newIndex);
      }
    },
    [searchTextMatches, selectedMatchIndex, setSelectedMatchIndex],
  );

  useEffect(() => {
    if (searchTextMatches.length === 0) {
      setSelectedMatchIndex(0);
    }
  }, [searchTextMatches.length, setSelectedMatchIndex]);

  useSearchMatches({
    cameraState,
    currentMatch,
    onCameraStateChange,
    renderFrameId,
    fixedFrameId,
    currentTime,
    searchTextOpen,
    transforms,
  });
  const hasMatches: boolean = searchTextMatches.length > 0;
  const searchButton = useTooltip({ contents: "Search text markers", placement: "left" });

  const iconStyle: Partial<IButtonStyles> = {
    icon: {
      color: theme.semanticColors.bodyText,

      svg: {
        fill: "currentColor",
        height: "1em",
        width: "1em",
      },
    },
  };

  if (!searchTextOpen) {
    return (
      <div>
        {searchButton.tooltip}
        <IconButton
          elementRef={searchButton.ref}
          iconProps={{ iconName: "Search" }}
          onClick={() => toggleSearchTextOpen(!searchTextOpen)}
          styles={{
            // see also ExpandingToolbar styles
            root: {
              backgroundColor: theme.semanticColors.buttonBackgroundHovered,
              pointerEvents: "auto",
            },
            rootHovered: { backgroundColor: theme.semanticColors.buttonBackgroundHovered },
            rootPressed: { backgroundColor: theme.semanticColors.buttonBackgroundHovered },
            rootDisabled: { backgroundColor: theme.semanticColors.buttonBackgroundHovered },
            ...iconStyle,
          }}
        />
      </div>
    );
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        pointerEvents: "auto",
        backgroundColor: theme.semanticColors.buttonBackgroundHovered,
        borderRadius: theme.effects.roundedCorner2,
        position: "relative",
      }}
    >
      <TextField
        autoFocus
        iconProps={{ iconName: "Search" }}
        elementRef={searchInputRef}
        type="text"
        placeholder="Find in scene"
        spellCheck={false}
        suffix={`${hasMatches ? selectedMatchIndex + 1 : "0"} of ${searchTextMatches.length}`}
        value={searchText}
        styles={{
          icon: {
            color: theme.semanticColors.inputText,
            lineHeight: 0,
            left: theme.spacing.s1,
            right: "auto",
            fontSize: 18,

            svg: {
              fill: "currentColor",
              height: "1em",
              width: "1em",
            },
          },
          field: {
            padding: `0 ${theme.spacing.s1} 0 ${theme.spacing.l2}`,

            "::placeholder": { opacity: 0.6 },
          },
          suffix: { backgroundColor: "transparent" },
        }}
        onChange={(_, newValue) => setSearchText(newValue ?? "")}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key !== "Enter") {
            return;
          }
          if (e.shiftKey) {
            iterateCurrentIndex(-1);
            return;
          }
          iterateCurrentIndex(1);
        }}
      />
      <Stack direction="row" alignItems="center" paddingLeft={0.5} spacing={0.5}>
        <IconButton
          iconProps={{ iconName: "ChevronUpSmall" }}
          onClick={() => iterateCurrentIndex(-1)}
          disabled={!hasMatches || searchTextMatches.length === selectedMatchIndex + 1}
          styles={arrowButtonStyles}
        />
        <IconButton
          iconProps={{ iconName: "ChevronDownSmall" }}
          onClick={() => iterateCurrentIndex(1)}
          disabled={!hasMatches || selectedMatchIndex === 0}
          styles={arrowButtonStyles}
        />
      </Stack>
      <IconButton
        onClick={() => toggleSearchTextOpen(false)}
        iconProps={{ iconName: "Close" }}
        styles={{
          rootHovered: { backgroundColor: "transparent" },
          rootPressed: { backgroundColor: "transparent" },
          rootDisabled: { backgroundColor: "transparent" },
          ...iconStyle,
        }}
      />
    </Stack>
  );
});

export default SearchText;
