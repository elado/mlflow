import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RequestStateWrapper from '../../common/components/RequestStateWrapper';
import { getExperimentApi, getRunApi, setTagApi } from '../actions';
import { searchModelVersionsApi } from '../../model-registry/actions';
import { connect } from 'react-redux';
import { RunView } from './RunView';
import Routes from '../routes';
import Utils from '../../common/utils/Utils';
import { ErrorCodes } from '../../common/constants';
import { RunNotFoundView } from './RunNotFoundView';
import { getUUID } from '../../common/utils/ActionUtils';
import { Spinner } from '../../common/components/Spinner';
import { PageContainer } from '../../common/components/PageContainer';
import { getExperiment, getRunInfo } from '../reducers/Reducers';
import { Experiment } from '../sdk/MlflowMessages';

export class RunPageImpl extends Component {
  static propTypes = {
    runUuid: PropTypes.string.isRequired,
    experimentId: PropTypes.string,
    experiment: PropTypes.instanceOf(Experiment),
    modelVersions: PropTypes.arrayOf(PropTypes.object),
    getRunApi: PropTypes.func.isRequired,
    getExperimentApi: PropTypes.func.isRequired,
    searchModelVersionsApi: PropTypes.func.isRequired,
    setTagApi: PropTypes.func.isRequired,
  };

  getRunRequestId = getUUID();

  searchModelVersionsRequestId = getUUID();
  setTagRequestId = getUUID();

  componentDidMount() {
    const { runUuid, experimentId, experiment } = this.props;
    this.props.getRunApi(runUuid, this.getRunRequestId);
    this.props.searchModelVersionsApi({ run_id: runUuid }, this.searchModelVersionsRequestId);

    // If the experiment ID is already known (either from URL or from run payload), but
    // it does not exist in store - fetch it
    if (experimentId && !experiment) {
      this.props.getExperimentApi(experimentId);
    }
  }

  componentDidUpdate({ experimentId: prevExperimentId }) {
    const { experimentId, experiment } = this.props;
    // If the experiment ID has changed (e.g. it was extracted from run payload), but
    // it does not exist in store - fetch it
    if (prevExperimentId !== experimentId && !experiment) {
      this.props.getExperimentApi(experimentId);
    }
  }

  handleSetRunTag = (tagName, value) => {
    const { runUuid } = this.props;
    return this.props
      .setTagApi(runUuid, tagName, value, this.setTagRequestId)
      .then(() => getRunApi(runUuid, this.getRunRequestId));
  };

  renderRunView = (isLoading, shouldRenderError, requests) => {
    if (isLoading) {
      return <Spinner />;
    } else if (shouldRenderError) {
      const getRunRequest = Utils.getRequestWithId(requests, this.getRunRequestId);
      if (getRunRequest.error.getErrorCode() === ErrorCodes.RESOURCE_DOES_NOT_EXIST) {
        return <RunNotFoundView runId={this.props.runUuid} />;
      }
      return null;
    }
    return (
      <RunView
        runUuid={this.props.runUuid}
        getMetricPagePath={(key) =>
          Routes.getMetricPageRoute([this.props.runUuid], key, [this.props.experimentId])
        }
        experiment={this.props.experiment}
        modelVersions={this.props.modelVersions}
        handleSetRunTag={this.handleSetRunTag}
      />
    );
  };

  render() {
    const requestIds = [this.getRunRequestId];
    return (
      <PageContainer>
        <RequestStateWrapper
          requestIds={requestIds}
          // eslint-disable-next-line no-trailing-spaces
        >
          {this.renderRunView}
        </RequestStateWrapper>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps;
  const { runUuid } = match.params;

  const runInfo = getRunInfo(runUuid, state);

  // Get the experiment ID from the optional route param and if not available,
  // wait for it to appear in the run payload
  const experimentId = match.params.experimentId ?? runInfo?.experiment_id ?? undefined;

  const experiment = experimentId ? getExperiment(experimentId, state) : null;

  const { modelVersionsByRunUuid } = state.entities;
  const modelVersions = modelVersionsByRunUuid ? modelVersionsByRunUuid[runUuid] : null;
  return {
    runUuid,
    experimentId,
    experiment,
    modelVersions,
    // so that we re-render the component when the route changes
    key: runUuid,
  };
};

const mapDispatchToProps = {
  getRunApi,
  getExperimentApi,
  searchModelVersionsApi,
  setTagApi,
};

export const RunPage = connect(mapStateToProps, mapDispatchToProps)(RunPageImpl);
