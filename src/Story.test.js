import React from 'react';
import { render, within } from '@testing-library/react';
import { Story } from './Story';
import { PeopleContext } from './PeopleContext';

describe('Story', () => {
  const people = {
    101: {
      email: 'vader@deathstar.mil',
      id: 101,
      initials: 'DV',
      kind: 'person',
      name: 'Darth Vader',
      username: 'vader'
    },
    102: {
      email: 'governor@eriadu.gov',
      id: 102,
      initials: 'WT',
      kind: 'person',
      name: 'Wilhuff Tarkin',
      username: 'tarkin'
    }
  };

  const story = {
    kind: 'chore',
    id: 564,
    createdAt: '2018-09-25T12:24:00Z',
    updatedAt: '2018-09-25T12:24:00Z',
    acceptedAt: '2018-09-26T12:00:05Z',
    estimate: 3,
    blockers: [],
    tasks: [],
    storyType: 'feature',
    name: 'Test the Expeditionary Battle Planetoid',
    description: 'Blow upp some stuff',
    current_state: 'accepted',
    requestedById: 102,
    externalId: 'abc123',
    integrationId: 30,
    url: 'http://localhost/story/show/564',
    projectId: 99,
    ownerIds: [101, 102],
    labels: [
      {
        id: 1,
        projectId: 99,
        kind: 'label',
        name: 'first label',
        createdAt: '2018-09-25T12:01:00Z',
        updatedAt: '2018-09-25T12:01:00Z'
      },
      {
        id: 2,
        projectId: 99,
        kind: 'label',
        name: 'second label',
        createdAt: '2018-09-25T12:01:00Z',
        updatedAt: '2018-09-25T12:01:00Z'
      }
    ],
    ownedById: 102
  };

  const renderSubject = props =>
    render(
      <PeopleContext.Provider value={people}>
        <Story {...story} slim={false} {...props} />
      </PeopleContext.Provider>
    );

  it('renders title as link', () => {
    const { container } = renderSubject({ storyType: 'feature' });

    expect(container).toHaveTextContent(
      'Test the Expeditionary Battle Planetoid'
    );

    expect(container.querySelector('.subtitle > a')).toHaveAttribute(
      'href',
      'http://localhost/story/show/564'
    );
  });

  describe('estimate', () => {
    it('renders estimate tag', () => {
      const { queryByTestId } = renderSubject({ estimate: 5 });

      expect(queryByTestId('estimate-tag')).toHaveTextContent(5);
    });

    it('does not render if estimate is not present', () => {
      const { queryByTestId } = renderSubject({ estimate: undefined });

      expect(queryByTestId('estimate-tag')).not.toBeInTheDocument();
    });

    it('does not render if estimate is zero', () => {
      const { queryByTestId } = renderSubject({ estimate: 0 });

      expect(queryByTestId('estimate-tag')).not.toBeInTheDocument();
    });
  });

  it('renders feature tag for feature story', () => {
    const { queryByTestId } = renderSubject({ storyType: 'feature' });

    expect(queryByTestId('feature-tag')).toBeInTheDocument();
    expect(queryByTestId('bug-tag')).not.toBeInTheDocument();
    expect(queryByTestId('chore-tag')).not.toBeInTheDocument();
  });

  it('renders bug tag for bug story', () => {
    const { queryByTestId } = renderSubject({ storyType: 'bug' });

    expect(queryByTestId('feature-tag')).not.toBeInTheDocument();
    expect(queryByTestId('bug-tag')).toBeInTheDocument();
    expect(queryByTestId('chore-tag')).not.toBeInTheDocument();
  });

  it('renders chore tag for chore story', () => {
    const { queryByTestId } = renderSubject({ storyType: 'chore' });

    expect(queryByTestId('feature-tag')).not.toBeInTheDocument();
    expect(queryByTestId('bug-tag')).not.toBeInTheDocument();
    expect(queryByTestId('chore-tag')).toBeInTheDocument();
  });

  it('renders labels', () => {
    const { container, queryAllByTestId } = renderSubject();

    expect(queryAllByTestId('label-tag')).toHaveLength(2);
    expect(container).toHaveTextContent('first label');
    expect(container).toHaveTextContent('second label');
  });

  it('renders owners', () => {
    const { queryByTestId, getByTestId } = renderSubject();

    expect(queryByTestId('owners')).toBeInTheDocument();
    expect(within(getByTestId('owners')).getByText('DV')).toBeInTheDocument();
    expect(within(getByTestId('owners')).getByText('WT')).toBeInTheDocument();
  });

  describe('story blockers', () => {
    it('renders blockers if blocked', () => {
      const { queryByTestId } = renderSubject({
        blockers: [{ resolved: false }]
      });

      expect(queryByTestId('story-blockers')).toBeInTheDocument();
    });

    it('does not render blockers if no blockers', () => {
      const { queryByTestId } = renderSubject({
        blockers: []
      });

      expect(queryByTestId('story-blockers')).not.toBeInTheDocument();
    });
  });

  describe('renders task progress', () => {
    it('is not rendered when there are no tasks', () => {
      const { queryByTestId } = renderSubject({
        tasks: []
      });

      expect(queryByTestId('progress-tag')).not.toBeInTheDocument();
    });

    it('is rendered when there are incomplete tasks', () => {
      const { queryByTestId } = renderSubject({
        tasks: [{ complete: false }, { complete: false }, { complete: true }]
      });

      expect(queryByTestId('progress-tag')).toBeInTheDocument();
      expect(queryByTestId('progress-tag')).toHaveAttribute(
        'aria-valuenow',
        '1'
      );
      expect(queryByTestId('progress-tag')).toHaveAttribute(
        'aria-valuemax',
        '3'
      );
    });

    it('is rendered when all tasks are complete', () => {
      const { queryByTestId } = renderSubject({
        tasks: [{ complete: true }, { complete: true }, { complete: true }]
      });

      expect(queryByTestId('progress-tag')).toBeInTheDocument();
      expect(queryByTestId('progress-tag')).toHaveAttribute(
        'aria-valuenow',
        '3'
      );
      expect(queryByTestId('progress-tag')).toHaveAttribute(
        'aria-valuemax',
        '3'
      );
    });
  });

  describe('slim theme', () => {
    it('renders story with slim tags', () => {
      const { queryByTestId } = renderSubject({
        slim: true,
        blockers: [{ resolved: false }]
      });

      expect(queryByTestId('slim-tags')).toBeInTheDocument();

      expect(queryByTestId('estimate-tag')).not.toBeInTheDocument();
      expect(queryByTestId('blocked-tag')).not.toBeInTheDocument();
      expect(queryByTestId('owners')).not.toBeInTheDocument();
      expect(queryByTestId('feature-tag')).not.toBeInTheDocument();
      expect(queryByTestId('bug-tag')).not.toBeInTheDocument();
      expect(queryByTestId('chore-tag')).not.toBeInTheDocument();
    });
  });
});
