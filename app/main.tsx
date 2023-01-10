import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Grid,
  GridColumn as Column,
  GridFilterChangeEvent,
  GridFilterCellProps,
} from '@progress/kendo-react-grid';
import {
  CompositeFilterDescriptor,
  filterBy,
  FilterDescriptor,
} from '@progress/kendo-data-query';

import { RangeFilterCell } from './rangeFilterCell';
import { DropdownFilterCell } from './dropdownFilterCell';
import { sampleProducts } from './sample-products';
import { Product } from './interfaces';

const categories: object[] = Array.from(
  new Set(
    sampleProducts.map((p: Product) =>
      p.Category ? p.Category.CategoryName : ''
    )
  )
).map((s: String) =>
  s !== ''
    ? { text: s, value: s }
    : { text: 'Select category', value: undefined }
);

const CategoryFilterCell: any = (
  props: GridFilterCellProps & {
    filter: CompositeFilterDescriptor;
    filterChange: (event: GridFilterChangeEvent) => void;
  }
) => (
  <DropdownFilterCell
    {...props}
    data={categories}
    defaultItem={{ text: 'Select category', value: undefined }}
    filter={props.filter}
    filterChange={props.filterChange}
  />
);

const App = () => {
  const [data, setData] = React.useState(sampleProducts);
  const [filter, setFilter] = React.useState<CompositeFilterDescriptor>();

  const filterChange = (event: GridFilterChangeEvent) => {
    console.log(`grid change event`);
    console.log(event.filter);
    const filterForDisplay = JSON.parse(JSON.stringify(event.filter));
    const filterForData = Object.assign({}, event.filter);
    const multiFilterIdx = filterForData.filters.findIndex(
      (f) => (f as any).field === 'Category.CategoryName'
    );
    const multiFilter = filterForData.filters[
      multiFilterIdx
    ] as FilterDescriptor;
    const actualMultiFilter: CompositeFilterDescriptor = {
      filters: multiFilter.value.map((v) => {
        return { field: multiFilter.field, operator: 'eq', value: v.value };
      }),
      logic: 'or',
    };
    if (actualMultiFilter.filters.length > 0) {
      filterForData.filters.splice(multiFilterIdx, 1, actualMultiFilter);
    } else {
      filterForData.filters.splice(multiFilterIdx, 1);
    }
    console.log(`after update grid change event`);
    console.log(filterForData);
    console.log(`filter for display`);
    console.log(filterForDisplay);
    setData(filterBy(sampleProducts, filterForData));
    setFilter(filterForDisplay);
  };

  return (
    <Grid
      style={{ height: '400px' }}
      data={data}
      filterable={true}
      filter={filter}
      onFilterChange={filterChange}
    >
      <Column field="ProductID" title="ID" filterable={false} width="60px" />
      <Column field="ProductName" title="Product Name" />
      <Column
        field="Category.CategoryName"
        title="Category Name"
        filterCell={(props) =>
          CategoryFilterCell({ ...props, filter, filterChange })
        }
      />
      <Column
        field="UnitPrice"
        title="Unit Price"
        format="{0:c}"
        filterCell={RangeFilterCell}
      />
    </Grid>
  );
};

ReactDOM.render(<App />, document.querySelector('my-app'));
