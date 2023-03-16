import { Spinner, useDesignSystemTheme } from '@databricks/design-system';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Utils from '../../../common/utils/Utils';
import { OverflowMenu, PageHeader } from '../../../shared/building_blocks/PageHeader';
import Routes from '../../routes';
import { ExperimentEntity } from '../../types';

export const RunViewHeader = ({
  experiment,
  runDisplayName,
  onRenameRun = () => {},
}: {
  experiment?: ExperimentEntity;
  runDisplayName: string;
  onRenameRun: () => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const breadcrumbs = useMemo(() => {
    const result = [
      experiment ? (
        <Link
          to={Routes.getExperimentPageRoute(experiment.experiment_id)}
          data-test-id='experiment-runs-link'
        >
          {Utils.baseName(experiment.name)}
        </Link>
      ) : (
        <div css={{ height: theme.typography.lineHeightBase, overflow: 'hidden' }}>
          <Spinner size='small' />
        </div>
      ),
    ];
    return result;
  }, [experiment, theme]);

  return (
    <PageHeader
      title={<span data-test-id='runs-header'>{runDisplayName}</span>}
      breadcrumbs={breadcrumbs}
    >
      <OverflowMenu
        menu={[
          {
            id: 'overflow-rename-button',
            onClick: onRenameRun,
            itemName: (
              <FormattedMessage
                defaultMessage='Rename'
                description='Menu item to rename an experiment run'
              />
            ),
          },
        ]}
      />
    </PageHeader>
  );
};
