import { Table } from 'antd';
import React, { useState } from 'react';
import Loading from '../LoadingComponent/Loading';
import { Excel } from 'antd-table-saveas-excel';
import { useMemo } from 'react';

const TableComponent = (props) => {
    const { selectionType = 'checkbox', isLoading = false, data:dataSource = [], columns = [], handleDeleteMany } = props;
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const newColumnExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== 'action')
        return arr
      }, [columns])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     // Column configuration not to be checked
        //     name: record.name,
        // }),
    };
    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
        setRowSelectedKeys([]);
    }

    const exportExcel = () => {
        const excel = new Excel();
        excel
          .addSheet("test")
          .addColumns(newColumnExport)
          .addDataSource(dataSource, {
            str2Percent: true
          })
          .saveAs("Excel.xlsx");
    };

    return (
        <div>
           <Loading isLoading={isLoading}>
                {rowSelectedKeys.length > 0 && (
                    <div style={{
                        background: '#1d1ddd',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '10px',
                        cursor: 'pointer'
                    }}
                    onClick={handleDeleteAll}
                    >
                        Xóa tất cả
                    </div>
                )}
                <button onClick={exportExcel}>Export Excel</button>
                <Table
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={dataSource}
                    {...props}
                />
           </Loading>
        </div>
    );
};

export default TableComponent;
