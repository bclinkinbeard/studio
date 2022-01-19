// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import produce from "immer";
import { Dispatch } from "react";

import { Point } from "@foxglove/studio-base/util/geometry";

export type PublishClickType = "pose" | "goal" | "point";

type InteractionToolState = { name: "idle" } | { name: "measure" } | { name: "publish-click" };

type InteractionState = {
  measure: undefined | { start: Point; end: Point; distance: number };
  publish: undefined | { start?: Point; end?: Point; type: PublishClickType };
  tool: InteractionToolState;
};

type InteractionStateAction =
  | { action: "measure-start"; point: Point }
  | { action: "measure-update"; point: Point; distance: number }
  | { action: "publish-click-start"; point: Point }
  | { action: "publish-click-update"; point: Point }
  | { action: "reset" }
  | { action: "select-tool"; tool: "idle" }
  | { action: "select-tool"; tool: "measure" }
  | { action: "select-tool"; tool: "publish-click"; type: PublishClickType };

type InteractionStateDispatch = Dispatch<InteractionStateAction>;

export type InteractionStateProps = {
  interactionState: Readonly<InteractionState>;
  interactionStateDispatch: InteractionStateDispatch;
};

export function makeInitialInteractionState(): InteractionState {
  return {
    measure: undefined,
    publish: undefined,
    tool: { name: "idle" },
  };
}

export function interactionStateReducer(
  oldState: InteractionState,
  action: InteractionStateAction,
): InteractionState {
  return produce(oldState, (state) => {
    switch (action.action) {
      case "reset":
        return makeInitialInteractionState();
      case "select-tool":
        if (action.tool === state.tool.name || action.tool === "idle") {
          state.publish = undefined;
          state.tool = { name: "idle" };
        } else if (action.tool === "measure") {
          state.measure = undefined;
          state.tool = { name: action.tool };
        } else if (action.tool === "publish-click") {
          state.publish = { type: action.type };
          state.tool = { name: action.tool };
        }
        break;

      case "measure-start":
        state.measure = {
          start: action.point,
          end: action.point,
          distance: 0,
        };
        break;

      case "measure-update":
        if (state.measure) {
          state.measure.end = action.point;
          state.measure.distance = action.distance;
        }
        break;

      case "publish-click-start":
        if (state.publish) {
          state.publish.start = action.point;
        }
        break;

      case "publish-click-update":
        if (state.publish) {
          state.publish.end = action.point;
        }
        break;
    }

    return state;
  });
}
