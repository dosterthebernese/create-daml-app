// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Form, List, Button } from "semantic-ui-react";
import { Party } from "@daml/types";

type Props = {
  numberFollowers: number;
  parties: Party[];
  partyToAlias: Map<Party, string>;
  onChangeLeverage: (leverageCap: number) => Promise<boolean>;
};

/**
 * React component to edit a list of `Party`s.
 */
const LeverageEdit: React.FC<Props> = ({
  numberFollowers,
  parties,
  partyToAlias,
  onChangeLeverage,
}) => {
  const [newLeverageCap, setNewLeverageCap] = React.useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const aliasToOption = (party: string, alias: string) => {
    return { key: party, text: alias, value: party };
  };

  const leverageToOption = (idx: number) => {
    return { key: idx.toString(), text: (idx+1).toString(), value: (idx+1).toString() };
  };

  const options = Array.from(Array(numberFollowers).keys()).map(e => leverageToOption(e) );

  const changeLeverage = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const nlc = parseInt(newLeverageCap ?? "0" );
    alert(nlc);
    const success = await onChangeLeverage(nlc ?? 0);
    setIsSubmitting(false);
    if (success) {
      setNewLeverageCap(undefined);
    }
  };

  return (
      <Form onSubmit={changeLeverage}>
        <Form.Select
          fluid
          search
          readOnly={isSubmitting}
          loading={isSubmitting}
          className="test-select-follow-input"
          value={newLeverageCap}
          options={options}
          onChange={(event, { value }) => setNewLeverageCap(value?.toString())}

        />
        <Button type="submit" className="test-select-follow-button">
          Bump It
        </Button>
      </Form>
  );
};

export default LeverageEdit;
