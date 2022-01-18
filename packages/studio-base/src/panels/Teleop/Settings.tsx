// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { Dropdown, IDropdownOption, Label, Text, TextField, useTheme } from "@fluentui/react";
import { Box, Stack } from "@mui/material";
import { useCallback, useMemo } from "react";

import Autocomplete from "@foxglove/studio-base/components/Autocomplete";

import { Config } from "./types";

type SettingsProps = {
  topics: string[];
  config: Config;
  onConfigChange: (newConfig: Config) => void;
};

export default function Settings(props: SettingsProps): JSX.Element {
  const theme = useTheme();
  const { topics, config, onConfigChange } = props;

  const saveConfig = useCallback(
    (partial: Partial<Config>) => {
      const full = Object.assign({}, config, partial);
      onConfigChange(full);
    },
    [config, onConfigChange],
  );

  const onChangeTopic = useCallback(
    (_ev: unknown, text: string) => {
      onConfigChange({
        ...config,
        topic: text,
      });
    },
    [config, onConfigChange],
  );

  const onSelectTopic = useCallback(
    (text: string) => {
      onConfigChange({
        ...config,
        topic: text,
      });
    },
    [config, onConfigChange],
  );

  const dropDownOptions = useMemo<IDropdownOption[]>(() => {
    return [
      { key: "linear-x", text: "Linear X" },
      { key: "linear-y", text: "Linear Y" },
      { key: "linear-z", text: "Linear Z" },
      { key: "angular-x", text: "Angular X" },
      { key: "angular-y", text: "Angular Y" },
      { key: "angular-z", text: "Angular Z" },
    ];
  }, []);

  return (
    <Stack height="100%" spacing={2}>
      <div>
        <Text>Publish topic</Text>
        <Stack paddingY={1}>
          <Autocomplete
            placeholder="Enter a topic"
            items={topics}
            hasError={false}
            onChange={onChangeTopic}
            onSelect={onSelectTopic}
            selectedItem={config.topic}
            inputStyle={{
              padding: theme.spacing.s1,
              border: `1px solid ${theme.semanticColors.inputBorder}`,
              backgroundColor: theme.semanticColors.inputBackground,
            }}
            menuStyle={{
              zIndex: 1000000 + 1, // Make sure the menu is above the dialog
            }}
          />
        </Stack>
      </div>
      <div>
        <TextField
          type="number"
          label="Publish rate (Hz)"
          defaultValue={String(config.publishRate)}
          styles={{ root: { width: 80 } }}
          onGetErrorMessage={(value) => {
            const num = +value;
            if (isNaN(num)) {
              return "Not a valid number";
            } else if (num < 0) {
              return "Must be a positive number";
            }

            return;
          }}
          onChange={(_ev, value) => {
            if (!value || isNaN(+value)) {
              return;
            }

            saveConfig({
              publishRate: +value,
            });
          }}
        />
      </div>
      <Box flexGrow={1}>
        <Stack direction="row" alignItems="flex-end" spacing={2}>
          <Box flexGrow={1}>
            <Label>Up button:</Label>
          </Box>
          <Dropdown
            label="Field"
            selectedKey={config.upButton.field}
            options={dropDownOptions}
            styles={{ root: { minWidth: 128 } }}
            onChange={(_ev, option) => {
              if (option?.key == undefined) {
                return;
              }

              saveConfig({
                upButton: { field: String(option.key), value: config.upButton.value },
              });
            }}
          />
          <TextField
            type="number"
            label="Value"
            defaultValue={String(config.upButton.value)}
            styles={{ root: { width: 80 } }}
            onChange={(_ev, value) => {
              if (!value || isNaN(+value)) {
                return;
              }

              saveConfig({
                upButton: { field: config.upButton.field, value: +value },
              });
            }}
          />
        </Stack>
      </Box>
      <div>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box flexGrow={1}>
            <Label>Down button:</Label>
          </Box>
          <Dropdown
            selectedKey={config.downButton.field}
            options={dropDownOptions}
            styles={{ root: { minWidth: 128 } }}
            onChange={(_ev, option) => {
              if (option?.key == undefined) {
                return;
              }

              saveConfig({
                downButton: { field: String(option.key), value: config.downButton.value },
              });
            }}
          />
          <TextField
            type="number"
            defaultValue={String(config.downButton.value)}
            styles={{ root: { width: 80 } }}
            onChange={(_ev, value) => {
              if (!value || isNaN(+value)) {
                return;
              }

              saveConfig({
                downButton: { field: config.downButton.field, value: +value },
              });
            }}
          />
        </Stack>
      </div>
      <div>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box flexGrow={1}>
            <Label>Left button:</Label>
          </Box>
          <Dropdown
            selectedKey={config.leftButton.field}
            options={dropDownOptions}
            styles={{ root: { minWidth: 128 } }}
            onChange={(_ev, option) => {
              if (option?.key == undefined) {
                return;
              }

              saveConfig({
                leftButton: { field: String(option.key), value: config.leftButton.value },
              });
            }}
          />
          <TextField
            type="number"
            defaultValue={String(config.leftButton.value)}
            styles={{ root: { width: 80 } }}
            onChange={(_ev, value) => {
              if (!value || isNaN(+value)) {
                return;
              }

              saveConfig({
                leftButton: { field: config.leftButton.field, value: +value },
              });
            }}
          />
        </Stack>
      </div>
      <div>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box flexGrow={1}>
            <Label>Right button:</Label>
          </Box>
          <Dropdown
            selectedKey={config.rightButton.field}
            options={dropDownOptions}
            styles={{ root: { minWidth: 128 } }}
            onChange={(_ev, option) => {
              if (option?.key == undefined) {
                return;
              }

              saveConfig({
                rightButton: { field: String(option.key), value: config.rightButton.value },
              });
            }}
          />
          <TextField
            type="number"
            defaultValue={String(config.rightButton.value)}
            styles={{ root: { width: 80 } }}
            onChange={(_ev, value) => {
              if (!value || isNaN(+value)) {
                return;
              }

              saveConfig({
                rightButton: { field: config.rightButton.field, value: +value },
              });
            }}
          />
        </Stack>
      </div>
    </Stack>
  );
}
