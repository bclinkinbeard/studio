// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { cloneDeep, set } from "lodash";

import { DEFAULT_CAMERA_STATE } from "@foxglove/regl-worldview";
import { SettingsTreeAction } from "@foxglove/studio";

import { Renderer } from "../Renderer";
import { SceneExtension } from "../SceneExtension";
import { SettingsTreeEntry } from "../SettingsManager";
import { fieldSize, PRECISION_DEGREES, PRECISION_DISTANCE } from "../settings";
import type { FrameAxes } from "./FrameAxes";

export const DEFAULT_LABEL_PPU = 100;
export const DEFAULT_AXIS_SCALE = 1;
export const DEFAULT_LINE_WIDTH_PX = 2;
export const DEFAULT_LINE_COLOR_STR = "#ffff00";

const ONE_DEGREE = Math.PI / 180;

export class CoreSettings extends SceneExtension {
  constructor(renderer: Renderer) {
    super("foxglove.CoreSettings", renderer);

    renderer.on("transformTreeUpdated", this.handleTransformTreeUpdated);
    renderer.on("cameraMove", this.handleCameraMove);
  }

  override dispose(): void {
    this.renderer.off("transformTreeUpdated", this.handleTransformTreeUpdated);
    this.renderer.off("cameraMove", this.handleCameraMove);
    super.dispose();
  }

  override settingsNodes(): SettingsTreeEntry[] {
    const config = this.renderer.config;
    const camera = config.cameraState;
    const handler = this.handleSettingsAction;

    return [
      {
        path: ["general"],
        node: {
          label: "General",
          fields: {
            followTf: {
              label: "Frame",
              input: "select",
              options: this.renderer.coordinateFrameList,
              value: this.renderer.renderFrameId ?? config.followTf,
            },
          },
          defaultExpansionState: "expanded",
          handler,
        },
      },
      {
        path: ["scene"],
        node: {
          label: "Scene",
          fields: {
            enableStats: {
              label: "Render stats",
              input: "boolean",
              value: config.scene.enableStats,
            },
            backgroundColor: { label: "Color", input: "rgb", value: config.scene.backgroundColor },
            labelPixelsPerUnit: {
              label: "Label size",
              help: "Controls the size of labels by setting the pixel density per unit of world space (usually meters)",
              input: "number",
              min: 0,
              step: 10,
              precision: 0,
              value: config.scene.labelPixelsPerUnit,
              placeholder: String(DEFAULT_LABEL_PPU),
            },
          },
          children: {
            transforms: {
              label: "Transforms",
              fields: {
                showLabel: {
                  label: "Labels",
                  input: "boolean",
                  value: config.scene.transforms?.showLabel ?? true,
                },
                axisScale: fieldSize(
                  "Axis scale",
                  config.scene.transforms?.axisScale,
                  DEFAULT_AXIS_SCALE,
                ),
                lineWidth: {
                  label: "Line width",
                  input: "number",
                  min: 0,
                  step: 0.5,
                  precision: 1,
                  value: config.scene.transforms?.lineWidth,
                  placeholder: String(DEFAULT_LINE_WIDTH_PX),
                },
                lineColor: {
                  label: "Line color",
                  input: "rgb",
                  value: config.scene.transforms?.lineColor ?? DEFAULT_LINE_COLOR_STR,
                },
              },
            },
          },
          defaultExpansionState: "collapsed",
          handler,
        },
      },
      {
        path: ["cameraState"],
        node: {
          label: "Camera",
          actions: [{ type: "action", id: "reset-camera", label: "Reset" }],
          fields: {
            distance: {
              label: "Distance",
              input: "number",
              step: 1,
              precision: PRECISION_DISTANCE,
              value: camera.distance,
            },
            perspective: { label: "Perspective", input: "boolean", value: camera.perspective },
            targetOffset: {
              label: "Target",
              input: "vec3",
              labels: ["X", "Y", "Z"],
              precision: PRECISION_DISTANCE,
              value: [...camera.targetOffset],
            },
            thetaOffset: {
              label: "Theta",
              input: "number",
              step: ONE_DEGREE,
              precision: PRECISION_DEGREES,
              value: camera.thetaOffset,
            },
            ...(camera.perspective && {
              phi: {
                label: "Phi",
                input: "number",
                step: ONE_DEGREE,
                precision: PRECISION_DEGREES,
                value: camera.phi,
              },
              fovy: {
                label: "Y-Axis FOV",
                input: "number",
                step: ONE_DEGREE,
                precision: PRECISION_DEGREES,
                value: camera.fovy,
              },
            }),
            near: {
              label: "Near",
              input: "number",
              step: DEFAULT_CAMERA_STATE.near,
              precision: PRECISION_DISTANCE,
              value: camera.near,
            },
            far: {
              label: "Far",
              input: "number",
              step: 1,
              precision: PRECISION_DISTANCE,
              value: camera.far,
            },
          },
          defaultExpansionState: "collapsed",
          handler,
        },
      },
    ];
  }

  handleSettingsAction = (action: SettingsTreeAction): void => {
    if (action.action === "perform-node-action" && action.payload.id === "reset-camera") {
      this.renderer.updateConfig((draft) => {
        draft.cameraState = cloneDeep(DEFAULT_CAMERA_STATE);
      });
      return;
    }

    if (action.action !== "update" || action.payload.path.length === 0) {
      return;
    }

    const path = action.payload.path;
    const category = path[0]!;
    const value = action.payload.value;
    if (category === "general") {
      if (path[1] === "followTf") {
        const followTf = value as string | undefined;
        // Update the configuration. This is done manually since followTf is at the top level of
        // config, not under `general`
        this.renderer.updateConfig((draft) => {
          draft.followTf = followTf;
        });

        this.renderer.followFrameId = followTf;
      }
    } else if (category === "scene") {
      // Update the configuration
      this.renderer.updateConfig((draft) => set(draft, path, value));

      if (path[1] === "backgroundColor") {
        const backgroundColor = value as string | undefined;
        this.renderer.setColorScheme(this.renderer.colorScheme, backgroundColor);
      } else if (path[1] === "labelPixelsPerUnit") {
        const labelPixelsPerUnit = value as number | undefined;
        this.renderer.labels.setPixelsPerUnit(labelPixelsPerUnit ?? DEFAULT_LABEL_PPU);
      } else if (path[1] === "transforms") {
        const frameAxes = this.renderer.sceneExtensions.get("foxglove.FrameAxes") as
          | FrameAxes
          | undefined;

        if (path[2] === "showLabel") {
          const showLabel = value as boolean | undefined;
          frameAxes?.setLabelVisible(showLabel ?? true);
        } else if (path[2] === "axisScale") {
          const axisScale = value as number | undefined;
          frameAxes?.setAxisScale(axisScale ?? DEFAULT_AXIS_SCALE);
        } else if (path[2] === "lineWidth") {
          const lineWidth = value as number | undefined;
          frameAxes?.setLineWidth(lineWidth ?? DEFAULT_LINE_WIDTH_PX);
        } else if (path[2] === "lineColor") {
          const lineColor = value as string | undefined;
          frameAxes?.setLineColor(lineColor ?? DEFAULT_LINE_COLOR_STR);
        }
      }
    } else if (category === "cameraState") {
      // Update the configuration
      this.renderer.updateConfig((draft) => set(draft, path, value));
    } else {
      return;
    }

    // Update the settings sidebar
    this.updateSettingsTree();
  };

  handleTransformTreeUpdated = (): void => {
    this.updateSettingsTree();
  };

  handleCameraMove = (): void => {
    this.updateSettingsTree();
  };
}
