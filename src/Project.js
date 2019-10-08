import React from 'react';
import { arrayOf, object, number } from 'prop-types';
import { Column } from './Column';
import { Footer } from './Footer';
import { Tray } from './Tray';
import { Filters } from './Filters';
import { FilterContainer } from './FilterContainer';
import { PeopleContext } from './PeopleContext';
import { EpicsContext } from './EpicsContext';
import { FilterSummary } from './FilterSummary';
import { ColumnContainer } from './ColumnContainer';
import { FilterModal } from './FilterModal';
import { FilterEpicsModal } from './FilterEpicsModal';
import { useLocalStorage } from './useLocalStorage';
import { Settings } from './Settings';

const Project = ({
  uniqueOwnerIds,
  people,
  storyIds,
  stories,
  uniqueEpicIds,
  epics,
  dispatch
}) => {
  const [splitFinalColumns] = useLocalStorage('splitColumns');

  return (
    <PeopleContext.Provider value={people}>
      <EpicsContext.Provider value={epics}>
        <FilterContainer
          uniqueOwnerIds={uniqueOwnerIds}
          uniqueEpicIds={uniqueEpicIds}
        >
          <section className="section" style={{ paddingBottom: '12rem' }}>
            <ColumnContainer dispatch={dispatch}>
              <div className="columns">
                <Column
                  title="Pending"
                  storyIds={storyIds}
                  stories={stories}
                  storyStates={['planned', 'unstarted']}
                  featureDropState="unstarted"
                  bugDropState="unstarted"
                  choreDropState="unstarted"
                />

                <Column
                  title="Started"
                  storyIds={storyIds}
                  stories={stories}
                  storyStates={['started']}
                  featureDropState="started"
                  bugDropState="started"
                  choreDropState="started"
                />

                <Column
                  title="Finished"
                  storyIds={storyIds}
                  stories={stories}
                  storyStates={['finished']}
                  featureDropState="finished"
                  bugDropState="finished"
                  choreDropState={null}
                />

                {splitFinalColumns ? (
                  <>
                    <Column
                      title="Delivered"
                      storyIds={storyIds}
                      stories={stories}
                      storyStates={['delivered']}
                      featureDropState="delivered"
                      bugDropState="delivered"
                      choreDropState={null}
                    />

                    <Column
                      title="Accepted"
                      storyIds={storyIds}
                      stories={stories}
                      storyStates={['accepted']}
                      featureDropState="accepted"
                      bugDropState="accepted"
                      choreDropState="accepted"
                    />
                  </>
                ) : (
                  <Column
                    title="Delivered | Accepted"
                    storyIds={storyIds}
                    stories={stories}
                    storyStates={['delivered', 'accepted']}
                    featureDropState="delivered"
                    bugDropState="delivered"
                    choreDropState="accepted"
                  />
                )}
              </div>
            </ColumnContainer>
          </section>

          <Footer>
            <Tray
              title="Filters"
              fullWidth
              renderLabel={() => <FilterSummary />}
            >
              <Filters />
            </Tray>

            <Tray title="Settings" rightAlign>
              <Settings />
            </Tray>
          </Footer>

          <FilterModal />
          <FilterEpicsModal />
        </FilterContainer>
      </EpicsContext.Provider>
    </PeopleContext.Provider>
  );
};

Project.propTypes = {
  people: object,
  stories: object,
  storyIds: arrayOf(number),
  uniqueOwnerIds: arrayOf(number),
  uniqueEpicIds: arrayOf(number),
  epics: object
};

export { Project };
