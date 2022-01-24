// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { IconButton, IButtonStyles, Stack, useTheme } from "@fluentui/react";

import { useTooltip } from "@foxglove/studio-base/components/Tooltip";
import { InteractionStateProps } from "@foxglove/studio-base/panels/ThreeDimensionalViz/InteractionState";
import { colors } from "@foxglove/studio-base/util/sharedStyleConstants";

type Props = InteractionStateProps & {
  debug: boolean;
  onToggleCameraMode: () => void;
  onToggleDebug: () => void;
  perspective: boolean;
};

function MainToolbar({
  debug,
  interactionState,
  interactionStateDispatch,
  onToggleCameraMode,
  onToggleDebug,
  perspective = false,
}: Props) {
  const theme = useTheme();
  const toggleCameraButton = useTooltip({
    contents: perspective ? "Switch to 2D camera" : "Switch to 3D camera",
  });
  const measuringToolButton = useTooltip({
    contents: perspective
      ? "Switch to 2D camera to measure distance"
      : interactionState.tool.name === "measure"
      ? "Cancel measuring"
      : "Measure distance",
  });
  const publishGoalToolButton = useTooltip({
    contents:
      interactionState.publish?.type === "goal"
        ? "Cancel goal publishing"
        : "Click to publish goal",
  });
  const publishPoseToolButton = useTooltip({
    contents:
      interactionState.publish?.type === "pose"
        ? "Cancel pose publishing"
        : "Click to publish pose",
  });
  const publishPointToolButton = useTooltip({
    contents:
      interactionState.publish?.type === "point"
        ? "Cancel point publishing"
        : "Click to publish point",
  });
  const debugButton = useTooltip({
    contents: debug ? "Disable debug" : "Enable debug",
  });

  const iconButtonStyles: Partial<IButtonStyles> = {
    rootHovered: { backgroundColor: "transparent" },
    rootPressed: { backgroundColor: "transparent" },
    rootDisabled: { backgroundColor: "transparent" },

    rootChecked: { backgroundColor: "transparent" },
    rootCheckedHovered: { backgroundColor: "transparent" },
    rootCheckedPressed: { backgroundColor: "transparent" },

    iconChecked: { color: colors.HIGHLIGHT },
    icon: {
      color: theme.semanticColors.bodyText,

      svg: {
        fill: "currentColor",
        height: "1em",
        width: "1em",
      },
    },
  };

  return (
    <Stack
      grow={0}
      styles={{
        root: {
          backgroundColor: theme.semanticColors.buttonBackgroundHovered,
          borderRadius: theme.effects.roundedCorner2,
          flexShrink: 0,
          pointerEvents: "auto",
        },
      }}
    >
      {toggleCameraButton.tooltip}
      <IconButton
        checked={perspective}
        onClick={onToggleCameraMode}
        elementRef={toggleCameraButton.ref}
        data-text="MainToolbar-toggleCameraMode"
        iconProps={{ iconName: "Video3d" }}
        styles={iconButtonStyles}
      />
      {measuringToolButton.tooltip}
      <IconButton
        checked={interactionState.tool.name === "measure"}
        disabled={perspective}
        onClick={() => interactionStateDispatch({ action: "select-tool", tool: "measure" })}
        elementRef={measuringToolButton.ref}
        iconProps={{ iconName: "Ruler" }}
        styles={iconButtonStyles}
      />
      {publishPoseToolButton.tooltip}
      <IconButton
        checked={interactionState.publish?.type === "pose"}
        disabled={perspective}
        onClick={() =>
          interactionStateDispatch({ action: "select-tool", tool: "publish-click", type: "pose" })
        }
        elementRef={publishPoseToolButton.ref}
        iconProps={{ iconName: "ArrowExpandUp" }}
        styles={iconButtonStyles}
      />
      {publishGoalToolButton.tooltip}
      <IconButton
        checked={interactionState.publish?.type === "goal"}
        disabled={perspective}
        onClick={() =>
          interactionStateDispatch({ action: "select-tool", tool: "publish-click", type: "goal" })
        }
        elementRef={publishGoalToolButton.ref}
        iconProps={{ iconName: "ArrowCollapseUp" }}
        styles={iconButtonStyles}
      />
      {publishPointToolButton.tooltip}
      <IconButton
        checked={interactionState.publish?.type === "point"}
        disabled={perspective}
        onClick={() =>
          interactionStateDispatch({ action: "select-tool", tool: "publish-click", type: "point" })
        }
        elementRef={publishPointToolButton.ref}
        iconProps={{ iconName: "MapMarker" }}
        styles={iconButtonStyles}
      />
      {process.env.NODE_ENV === "development" && (
        <>
          {debugButton.tooltip}
          <IconButton
            checked={debug}
            onClick={onToggleDebug}
            elementRef={debugButton.ref}
            iconProps={{ iconName: "Bug" }}
            styles={iconButtonStyles}
          />
        </>
      )}
    </Stack>
  );
}

export default React.memo<Props>(MainToolbar);
