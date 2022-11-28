// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { Party } from '@daml/types';
import { User } from '@daml.js/create-daml-app';
import { publicContext, userContext } from './App';
import UserList from './UserList';
import PartyListEdit from './PartyListEdit';
import LeverageEdit from './LeverageEdit';


// USERS_BEGIN
const MainView: React.FC = () => {
  const username = userContext.useParty();
  const myUserResult = userContext.useStreamFetchByKeys(User.User, () => [username], [username]);
  const aliases = publicContext.useStreamQueries(User.Alias, () => [], []);
  const myUser = myUserResult.contracts[0]?.payload;
  const allUsers = userContext.useStreamQueries(User.User).contracts;

  // USERS_END

  // Sorted list of users that are following the current user
  const followers = useMemo(() =>
    allUsers
    .map(user => user.payload)
    .filter(user => user.username !== username)
    .sort((x, y) => x.username.localeCompare(y.username)),
    [allUsers, username]);



  // Map to translate party identifiers to aliases.
  const partyToAlias = useMemo(() =>
    new Map<Party, string>(aliases.contracts.map(({payload}) => [payload.username, payload.alias])),
    [aliases]
  );
  // Map to translate party identifiers to leverage.
  const partyToLeverageCap = useMemo(() =>
    new Map<Party, string>(aliases.contracts.map(({payload}) => [payload.username, payload.leverageCap])),
    [aliases]
  );

  const myUserName = aliases.loading ? 'loading ...' : partyToAlias.get(username) ?? username;
  const myLeverageCap = aliases.loading ? 'loading ...' : partyToLeverageCap.get(username) ?? username;

  // FOLLOW_BEGIN
  const ledger = userContext.useLedger();

  const follow = async (userToFollow: Party): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(User.User.Follow, username, {userToFollow});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }
  // FOLLOW_END

  // LEVERAGE_BEGIN

  const leverage = async (newLeverageCap: number): Promise<boolean> => {
    alert('refactor');
    alert(newLeverageCap);
    alert(username);
    return true;

//    let userAlias = await ledger.fetchByKey(User.Alias, {_1: party, _2: publicParty});

    // try {
    //   await ledger.exerciseByKey(User.Alias.Leverage, {_1: username, _2: username}, {newLeverageCap});
    //   return true;
    // } catch (error) {
    //   alert(`Unknown error:\n${JSON.stringify(error)}`);
    //   return false;
    // }
  }
  // FOLLOW_END



  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                {myUserName ? `Welcome, ${myUserName}!` : 'Loading...'}
            </Header>
            <Container textAlign='center'>
              {myUserName ? `You have ${myLeverageCap}x - if you want more leverage, get more followers.` : 'Loading...'}
            </Container>
            {followers.length > 0 && 
              <Container>
                <Container textAlign='center'>
                  {myUserName && followers.length > 0 ? `With ${followers.length} followers, you can bump up leverage.  Just do it!` : 'Nobody is following you, so you have no leverage.'}
                </Container>
                <LeverageEdit
                  numberFollowers={followers.length}
                  parties={myUser?.following ?? []}
                  partyToAlias={partyToAlias}
                  onChangeLeverage={leverage}
                />
              </Container>
            }
            <Segment>
              <Header as='h2'>
                <Icon name='user' />
                <Header.Content>
                  {myUserName ?? 'Loading...'}
                  <Header.Subheader>Users I'm following</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <PartyListEdit
                parties={myUser?.following ?? []}
                partyToAlias={partyToAlias}
                onAddParty={follow}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='globe' />
                <Header.Content>
                  The Network
                  <Header.Subheader>My followers and users they are following</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              {/* USERLIST_BEGIN */}
              <UserList
                users={followers}
                partyToAlias={partyToAlias}
                onFollow={follow}
              />
              {/* USERLIST_END */}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
