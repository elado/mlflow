import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { RunPage, RunPageImpl } from './RunPage';
import { ArtifactNode } from '../utils/ArtifactUtils';
import { mockModelVersionDetailed } from '../../model-registry/test-utils';
import { ModelVersionStatus, Stages } from '../../model-registry/constants';
import { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import { ErrorCodes } from '../../common/constants';
import { RunNotFoundView } from './RunNotFoundView';
import { getExperimentApi, getRunApi } from '../actions';
import { cloneDeep } from 'lodash';

jest.mock('../actions', () => ({
  getRunApi: jest.fn().mockReturnValue({ type: 'getRunApi', payload: {} }),
  getExperimentApi: jest.fn().mockReturnValue({ type: 'getExperimentApi', payload: {} }),
}));

describe('RunPage', () => {
  let wrapper;
  let minimalProps;
  let mockedState;
  let minimalStore;
  const mockStore = configureStore([thunk, promiseMiddleware()]);

  beforeEach(() => {
    // TODO: remove global fetch mock by explicitly mocking all the service API calls
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('') }),
    );
    jest.clearAllMocks();
    const modelVersion = mockModelVersionDetailed(
      'Model A',
      1,
      Stages.PRODUCTION,
      ModelVersionStatus.READY,
    );
    const versions = [modelVersion];
    minimalProps = {
      match: {
        params: {
          runUuid: 'uuid-1234-5678-9012',
          experimentId: '12345',
        },
      },
      history: {
        push: jest.fn(),
      },
      modelVersions: versions,
      getRunApi: jest.fn(() => Promise.resolve({})),
      getExperimentApi: jest.fn(() => Promise.resolve({})),
      searchModelVersionsApi: jest.fn(() => Promise.resolve({})),
      setTagApi: jest.fn(() => Promise.resolve({})),
    };
    mockedState = {
      entities: {
        runInfosByUuid: {
          'uuid-1234-5678-9012': {
            run_uuid: 'uuid-1234-5678-9012',
            experiment_id: '12345',
            user_id: 'me@me.com',
            status: 'RUNNING',
            start_time: 12345678990,
            end_time: 12345678999,
            artifact_uri: 'dbfs:/databricks/abc/uuid-1234-5678-9012',
            lifecycle_stage: 'active',
          },
        },
        artifactsByRunUuid: { 'uuid-1234-5678-9012': new ArtifactNode(true) },
        experimentsById: {
          12345: {
            experiment_id: '12345',
            name: 'my experiment',
            artifact_location: 'dbfs:/databricks/abc',
            lifecycle_stage: 'active',
            last_update_time: 12345678999,
            creation_time: 12345678900,
            tags: [],
          },
        },
        modelVersionsByModel: {
          'Model A': {
            1: modelVersion,
          },
        },
        tagsByRunUuid: { 'uuid-1234-5678-9012': {} },
      },
      apis: {},
    };
    minimalStore = mockStore(mockedState);
  });

  test('should render with minimal props and store without exploding', () => {
    wrapper = mount(
      <Provider store={minimalStore}>
        <BrowserRouter>
          <RunPage {...minimalProps} />
        </BrowserRouter>
      </Provider>,
    );
    expect(wrapper.find(RunPage).length).toBe(1);
  });

  test('should display RunNotFoundView on RESOURCE_DOES_NOT_EXIST error', () => {
    wrapper = mount(
      <Provider store={minimalStore}>
        <BrowserRouter>
          <RunPage {...minimalProps} />
        </BrowserRouter>
      </Provider>,
    ).find(RunPage);
    const runPageInstance = wrapper.find(RunPageImpl).instance();
    const responseErrorWrapper = new ErrorWrapper(
      `{"error_code": "${ErrorCodes.RESOURCE_DOES_NOT_EXIST}", "message": "Not found."}`,
      404,
    );
    const getRunErrorRequest = {
      id: runPageInstance.getRunRequestId,
      active: false,
      error: responseErrorWrapper,
    };
    expect(runPageInstance.renderRunView(false, true, [getRunErrorRequest]).type).toBe(
      RunNotFoundView,
    );
  });

  test('should fetch the experiment if it does not exist in the store but the ID is provided by match param', () => {
    wrapper = mount(
      <Provider
        store={mockStore({ ...mockedState, entities: { runInfosByUuid: {}, experimentsById: {} } })}
      >
        <BrowserRouter>
          <RunPage {...minimalProps} />
        </BrowserRouter>
      </Provider>,
    ).find(RunPage);

    expect(getRunApi).toBeCalledWith('uuid-1234-5678-9012', expect.anything());
    expect(getExperimentApi).toBeCalledWith('12345');
  });

  test('should fetch the experiment if it does not exist in the store but the ID is provided by run payload', () => {
    const runInfoInState = mockedState.entities.runInfosByUuid['uuid-1234-5678-9012'];

    const props = cloneDeep(minimalProps);
    props.match.params.experimentId = undefined;

    wrapper = mount(
      <Provider
        store={mockStore({
          ...mockedState,
          entities: {
            runInfosByUuid: {
              'uuid-1234-5678-9012': { ...runInfoInState, experiment_id: 'other_experiment_id' },
            },
            experimentsById: {},
          },
        })}
      >
        <BrowserRouter>
          <RunPage {...props} />
        </BrowserRouter>
      </Provider>,
    ).find(RunPage);

    expect(getRunApi).toBeCalledWith('uuid-1234-5678-9012', expect.anything());
    expect(getExperimentApi).toBeCalledWith('other_experiment_id');
  });

  test('should not fetch the experiment if it does exist in the store already', () => {
    wrapper = mount(
      <Provider store={minimalStore}>
        <BrowserRouter>
          <RunPage {...minimalProps} />
        </BrowserRouter>
      </Provider>,
    ).find(RunPage);

    expect(getRunApi).toBeCalledWith('uuid-1234-5678-9012', expect.anything());
    expect(getExperimentApi).not.toBeCalled();
  });
});
