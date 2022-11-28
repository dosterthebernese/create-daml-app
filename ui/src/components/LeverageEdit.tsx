// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Form, List, Button } from "semantic-ui-react";
import { Party } from "@daml/types";

type Props = {
  parties: Party[];
  partyToAlias: Map<Party, string>;
  onChangeLeverage: (leverageCap: number) => Promise<boolean>;
};

/**
 * React component to edit a list of `Party`s.
 */
const LeverageEdit: React.FC<Props> = ({
  parties,
  partyToAlias,
  onChangeLeverage,
}) => {
  const [newLeverageCap, setNewLeverageCap] = React.useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const aliasToOption = (party: string, alias: string) => {
    return { key: party, text: alias, value: party };
  };

  const leverageToOption = (idx: number) => {
    return { key: idx, text: idx, value: idx };
  };

  const options = Array.from(Array(20).keys()).map(e => leverageToOption(e) );

  const changeLeverage = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await onChangeLeverage(newLeverageCap ?? 0);
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
          allowAdditions
          additionLabel="Insert a party identifier: "
          additionPosition="bottom"
          readOnly={isSubmitting}
          loading={isSubmitting}
          className="test-select-follow-input"
          value={newLeverageCap}
          options={options}
        />
        <Button type="submit" className="test-select-follow-button">
          Bump It
        </Button>
      </Form>
  );
};

export default LeverageEdit;
