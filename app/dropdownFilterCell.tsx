import * as React from 'react';

import {
  DropDownList,
  DropDownListChangeEvent,
  MultiSelect,
  MultiSelectChangeEvent,
} from '@progress/kendo-react-dropdowns';
import {
  GridFilterCellProps,
  GridFilterChangeEvent,
} from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { isArray } from '@progress/kendo-react-treeview/dist/es/utils/misc';

interface DropdownFilterCellProps extends GridFilterCellProps {
  defaultItem: object;
  data: object[];
  filter: CompositeFilterDescriptor;
  filterChange: (event: GridFilterChangeEvent) => void;
}

export const DropdownFilterCell = (props: DropdownFilterCellProps) => {
  let hasValue: any = (value) => Boolean(value && value !== props.defaultItem);

  const onChange = (event: MultiSelectChangeEvent) => {
    /*let filters: FilterDescriptor[] = event.target.value.map((i) => {
      return { field: props.field, value: i.value, operator: 'eq' };
    });
    let filter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [],
    };
    const actualFilter = props.filter || filter;
    if (!actualFilter.filters) {
      actualFilter.filters = [];
    }
    console.log(`before change cell`);
    console.log(actualFilter);
    const idx = actualFilter.filters.findIndex((f) => {
      return (
        (f as any).filters !== undefined &&
        (f as any).filters.length > 0 &&
        (f as any).filters[0].field === props.field
      );
    });
    if (idx !== -1) {
      actualFilter.filters.splice(idx, 1);
    }
    actualFilter.filters.push({
      filters,
      logic: 'or',
    });
    console.log(`after change cell`);
    console.log(actualFilter);
    console.log(`call grid change within cell`);
    props.filterChange({
      filter: actualFilter,
    });

    hasValue = hasValue(event.target.value);*/
    props.onChange({
      value: hasValue ? event.target.value : '',
      operator: 'eq',
      syntheticEvent: event.syntheticEvent,
    });
  };

  const onClearButtonClick = (event) => {
    event.preventDefault();
    props.onChange({
      value: '',
      operator: '',
      syntheticEvent: event,
    });
  };
  return (
    <div className="k-filtercell">
      <MultiSelect
        data={props.data}
        onChange={onChange}
        value={props.value}
        defaultItem={props.defaultItem}
        textField={'text'}
        dataItemKey={'value'}
      />
      <Button
        title="Clear"
        disabled={!hasValue(props.value)}
        onClick={onClearButtonClick}
        icon="filter-clear"
      />
    </div>
  );
};
